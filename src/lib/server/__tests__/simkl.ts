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
		expect(params(calls[1]).get('include_all_episodes')).toBe('yes')
		expect(params(calls[2]).get('extended')).toBe('full')
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
		expect(url.searchParams.get('include_all_episodes')).toBe('yes')
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
