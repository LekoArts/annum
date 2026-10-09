import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSimklActivities, fetchSimklAllItems, fetchSimklDelta, fetchSimklIdSets, SimklError } from '../simkl'

const TOKEN = 'test-token'
let calls: Array<string> = []

function stubFetch(): void {
	vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
		calls.push(typeof input === 'string' ? input : input.toString())

		return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
	})
}

function params(url: string): URLSearchParams {
	return new URL(url).searchParams
}

beforeEach(() => {
	calls = []
	stubFetch()
})

afterEach(() => {
	vi.useRealTimers()
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe('simkl sync request shapes', () => {
	it('checks activities with the app params and the bearer token', async () => {
		await fetchSimklActivities(TOKEN)

		expect(calls).toHaveLength(1)
		const url = new URL(calls[0])
		expect(url.pathname).toBe('/sync/activities')
		expect(url.searchParams.get('app-name')).toBe('annum')
		expect(url.searchParams.get('app-version')).toBe('1.0')
		expect(url.searchParams.has('date_from')).toBe(false)
	})

	it('pulls the full library per type for the first sync, with episodes for shows and anime', async () => {
		await fetchSimklAllItems({ type: 'movies', token: TOKEN })
		await fetchSimklAllItems({ type: 'shows', token: TOKEN })
		await fetchSimklAllItems({ type: 'anime', token: TOKEN })

		expect(calls.map(call => new URL(call).pathname)).toEqual([
			'/sync/all-items/movies',
			'/sync/all-items/shows',
			'/sync/all-items/anime',
		])
		expect(params(calls[0]).has('extended')).toBe(false)
		expect(params(calls[1]).get('extended')).toBe('full')
		expect(params(calls[1]).get('episode_watched_at')).toBe('yes')
		expect(params(calls[2]).get('extended')).toBe('full')
	})

	// `original` is the lighter value: `yes` synthesizes a row per watched episode, all stamped at
	// `last_watched_at`, which the normalizer already folds in
	it('asks for only the recorded episodes, not every episode of a completed show', async () => {
		await fetchSimklAllItems({ type: 'shows', token: TOKEN })
		await fetchSimklDelta({ dateFrom: '2026-10-03T14:28:11Z', token: TOKEN })

		expect(params(calls[0]).get('include_all_episodes')).toBe('original')
		expect(params(calls[1]).get('include_all_episodes')).toBe('original')
	})

	// The dev-visible contract: Phase 2 deltas carry the timestamp exactly as `/sync/activities` returned it
	it('passes date_from verbatim on the delta call', async () => {
		const saved = '2026-10-03T14:28:11Z'
		await fetchSimklDelta({ dateFrom: saved, token: TOKEN })

		const url = new URL(calls[0])
		expect(url.pathname).toBe('/sync/all-items')
		expect(url.searchParams.get('date_from')).toBe(saved)
		expect(url.searchParams.get('extended')).toBe('full')
		expect(url.searchParams.get('episode_watched_at')).toBe('yes')
		expect(url.searchParams.get('include_all_episodes')).toBe('original')
	})

	it('diffs deletions with an unfiltered ids-only call', async () => {
		await fetchSimklIdSets(TOKEN)

		const url = new URL(calls[0])
		expect(url.pathname).toBe('/sync/all-items')
		expect(url.searchParams.get('extended')).toBe('simkl_ids_only')
		expect(url.searchParams.has('date_from')).toBe(false)
	})
})

describe('simkl retry handling', () => {
	it('pauses briefly on a per-second rate_limit instead of honouring Retry-After', async () => {
		vi.useFakeTimers()
		let requests = 0

		vi.stubGlobal('fetch', async () => {
			requests += 1

			return requests === 1
				// On `rate_limit` a `Retry-After` carries the daily reset, not this pause
				? new Response(JSON.stringify({ error: 'rate_limit' }), { status: 429, headers: { 'content-type': 'application/json', 'retry-after': '45000' } })
				: new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
		})

		const pending = fetchSimklActivities(TOKEN)

		await vi.advanceTimersByTimeAsync(5_000)
		expect(requests).toBe(2)

		await vi.runAllTimersAsync()
		await pending
	})

	it('logs each retry pause with the attempt and the request URL', async () => {
		vi.useFakeTimers()
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		let requests = 0

		vi.stubGlobal('fetch', async () => {
			requests += 1

			return requests === 1
				? new Response(JSON.stringify({ error: 'rate_limit' }), { status: 429, headers: { 'content-type': 'application/json' } })
				: new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
		})

		const pending = fetchSimklActivities(TOKEN)

		await vi.advanceTimersByTimeAsync(1_300)
		await pending

		expect(warn).toHaveBeenCalledWith(expect.stringContaining('retrying'))
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('attempt 1/5'))
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('/sync/activities'))
	})

	it('fails a daily quota 429 immediately, keeping Retry-After for the message', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		let requests = 0

		vi.stubGlobal('fetch', async () => {
			requests += 1

			return new Response(JSON.stringify({ error: 'user_limit_exceeded' }), { status: 429, headers: { 'content-type': 'application/json', 'retry-after': '3600' } })
		})

		const error = await fetchSimklActivities(TOKEN).catch((cause: unknown) => cause)

		expect(requests).toBe(1)
		expect(error).toBeInstanceOf(SimklError)
		expect((error as SimklError).retryAfterSeconds).toBe(3600)
		expect((error as SimklError).message).toContain('Try again in 3600 seconds')
	})

	it('fails a deterministic error on the first response and logs it with the request URL', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		let requests = 0

		vi.stubGlobal('fetch', async () => {
			requests += 1

			return new Response(JSON.stringify({ error: 'client_id_failed' }), { status: 412, headers: { 'content-type': 'application/json' } })
		})

		await expect(fetchSimklActivities(TOKEN)).rejects.toThrow('412')

		expect(requests).toBe(1)
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('client_id_failed'))
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('/sync/activities'))
	})
})

function maxItems(): Response {
	return Response.json({ error: 'max_items', code: 400, message: 'Too many episodes: ...' }, { status: 400 })
}

/** Stubs fetch per request so a single call can be made to fail; anything unhandled succeeds with `{}`. */
function stubFetchMatching(handle: (path: string) => Response | undefined): void {
	vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
		const href = typeof input === 'string' ? input : input.toString()
		calls.push(href)

		return handle(new URL(href).pathname) ?? new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
	})
}

describe('simkl max_items fallback', () => {
	it('makes a single call per type while a pull fits', async () => {
		await fetchSimklAllItems({ type: 'shows', token: TOKEN })

		expect(calls.map(call => new URL(call).pathname)).toEqual(['/sync/all-items/shows'])
	})

	it('retries an oversized type one status per call and merges the buckets', async () => {
		const simklIds: Record<string, number> = { watching: 1, plantowatch: 2, hold: 3, completed: 4, dropped: 5 }

		vi.spyOn(console, 'warn').mockImplementation(() => {})

		stubFetchMatching((path) => {
			const status = path.match(/^\/sync\/all-items\/shows\/(\w+)$/)?.[1]

			if (!status)
				return maxItems()

			return Response.json({ shows: [{ status, show: { title: status, ids: { simkl: simklIds[status] } } }] })
		})

		const result = await fetchSimklAllItems({ type: 'shows', token: TOKEN })

		expect(calls.map(call => new URL(call).pathname)).toEqual([
			'/sync/all-items/shows',
			'/sync/all-items/shows/watching',
			'/sync/all-items/shows/plantowatch',
			'/sync/all-items/shows/hold',
			'/sync/all-items/shows/completed',
			'/sync/all-items/shows/dropped',
		])
		expect(result.shows?.map(item => item.show?.ids?.simkl)).toEqual([1, 2, 3, 4, 5])
	})

	// Movies only have plantowatch, completed and dropped, so the split must not invent the other two
	it('splits movies across only the statuses movies have', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		stubFetchMatching(path => path === '/sync/all-items/movies' ? maxItems() : Response.json({}))

		await fetchSimklAllItems({ type: 'movies', token: TOKEN })

		expect(calls.map(call => new URL(call).pathname)).toEqual([
			'/sync/all-items/movies',
			'/sync/all-items/movies/plantowatch',
			'/sync/all-items/movies/completed',
			'/sync/all-items/movies/dropped',
		])
	})

	it('splits an oversized delta across all three types with the same params', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		stubFetchMatching(path => path === '/sync/all-items' ? maxItems() : Response.json({}))

		await fetchSimklDelta({ dateFrom: '2026-10-03T14:28:11Z', token: TOKEN })

		const split = calls.slice(1)
		expect(split).toHaveLength(13)
		expect(split.map(call => new URL(call).pathname)).toContain('/sync/all-items/anime/dropped')
		expect(split.map(call => new URL(call).pathname)).toContain('/sync/all-items/movies/completed')

		for (const call of split) {
			const url = new URL(call)
			expect(url.searchParams.get('date_from')).toBe('2026-10-03T14:28:11Z')
			expect(url.searchParams.get('extended')).toBe('full')
			expect(url.searchParams.get('episode_watched_at')).toBe('yes')
			expect(url.searchParams.get('include_all_episodes')).toBe('original')
		}
	})

	it('does not split when the refusal is something other than max_items', async () => {
		stubFetchMatching(path => path === '/sync/all-items/shows' ? Response.json({ error: 'client_id_failed' }, { status: 412 }) : undefined)

		await expect(fetchSimklAllItems({ type: 'shows', token: TOKEN })).rejects.toMatchObject({ status: 412, code: 'client_id_failed' })
		expect(calls).toHaveLength(1)
	})

	it('gives up after one status still refuses, with a message that explains why', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		stubFetchMatching(path => path.startsWith('/sync/all-items/shows') ? maxItems() : undefined)

		const error = await fetchSimklAllItems({ type: 'shows', token: TOKEN }).catch((cause: unknown) => cause)

		expect(error).toBeInstanceOf(SimklError)
		expect((error as SimklError).message).toContain('too large to sync')
		expect((error as SimklError).code).toBe('max_items')
		expect(calls).toHaveLength(2)
	})
})
