import type { SimklActivities } from '#lib/types.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The route resolves the Simkl token through Better Auth; the real module needs a database-less auth setup
// and environment secrets, so it is stubbed down to the one call the route makes.
const getAccessToken = vi.fn(async (_options: unknown) => ({ accessToken: 'test-token' }))

vi.mock('#lib/auth.js', () => ({
	auth: { api: { getAccessToken: (options: unknown) => getAccessToken(options) } },
}))

const { GET } = await import('../../../routes/(protected)/api/simkl/sync/+server')

const SAVED_ALL = '2026-10-03T14:28:11Z'
const MOVED_ALL = '2026-10-04T09:00:00Z'

let requested: Array<string> = []
let activities: SimklActivities = {}

/** Records every outbound Simkl request and answers with the minimum each endpoint needs. */
function stubSimkl(): void {
	vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
		const url = new URL(typeof input === 'string' ? input : input.toString())
		requested.push(`${url.pathname}${url.searchParams.has('date_from') ? '?date_from' : ''}${url.searchParams.get('extended') === 'simkl_ids_only' ? '&ids_only' : ''}`)

		if (url.pathname === '/sync/activities')
			return Response.json(activities)
		if (url.searchParams.get('extended') === 'simkl_ids_only')
			return Response.json({ movies: [{ ids: { simkl: 1 } }], shows: [], anime: [] })

		return Response.json({ movies: [], shows: [], anime: [] })
	})
}

function event(search = ''): Parameters<typeof GET>[0] {
	return {
		url: new URL(`https://annum.app/api/simkl/sync${search}`),
		request: new Request('https://annum.app/api/simkl/sync'),
		locals: { user: { id: 'user-1' } },
	} as unknown as Parameters<typeof GET>[0]
}

function activitiesParam(value: SimklActivities): string {
	return `?activities=${encodeURIComponent(JSON.stringify(value))}`
}

beforeEach(() => {
	requested = []
	activities = { all: SAVED_ALL }
	getAccessToken.mockClear()
	stubSimkl()
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('the simkl sync route', () => {
	it('reads the activities baseline before the initial pulls, sequentially', async () => {
		const response = await GET(event())
		const body = await response.json()

		expect(body.status).toBe('full')
		// The client drops any response that is not stamped with the account it claimed
		expect(body.accountId).toBe('user-1')
		expect(requested).toEqual([
			'/sync/activities',
			'/sync/all-items/movies',
			'/sync/all-items/shows',
			'/sync/all-items/anime',
		])
	})

	// A change landing between the pulls must stay newer than the saved anchor, or it is skipped forever
	it('anchors the bootstrap on the snapshot taken before the pulls', async () => {
		const before = '2026-10-03T10:00:00Z'
		const duringPull = '2026-10-03T11:00:00Z'

		activities = { all: before }
		vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
			const url = new URL(typeof input === 'string' ? input : input.toString())

			if (url.pathname === '/sync/activities')
				return Response.json(activities)

			// A watch lands while the media pulls are still running
			activities = { all: duringPull }

			return Response.json({ movies: [], shows: [], anime: [] })
		})

		const body = await (await GET(event())).json()

		expect(body.activities.all).toBe(before)

		// The change made during the pull is newer than the anchor, so the next sync sees it
		const deltas: Array<string> = []
		vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
			const url = new URL(typeof input === 'string' ? input : input.toString())

			if (url.pathname === '/sync/activities')
				return Response.json({ all: duringPull })

			deltas.push(url.searchParams.get('date_from') ?? '')
			activities = { all: '2026-10-03T12:00:00Z' }

			return Response.json({ movies: [{ ids: { simkl: 42 } }], shows: [], anime: [] })
		})

		const delta = await (await GET(event(activitiesParam(body.activities)))).json()

		expect(deltas).toEqual([before])
		expect(delta.status).toBe('delta')
		expect(delta.movies).toHaveLength(1)
	})

	// The endpoint the Simkl dev asked about: an unchanged library costs exactly one cheap call
	it('spends one activities call and nothing else when nothing moved', async () => {
		const response = await GET(event(activitiesParam({ all: SAVED_ALL })))
		const body = await response.json()

		expect(body.status).toBe('up-to-date')
		expect(body.accountId).toBe('user-1')
		expect(requested).toEqual(['/sync/activities'])
	})

	it('follows a moved activities.all with a single date_from delta', async () => {
		activities = { all: MOVED_ALL }
		const response = await GET(event(activitiesParam({ all: SAVED_ALL })))
		const body = await response.json()

		expect(body.status).toBe('delta')
		expect(body.accountId).toBe('user-1')
		expect(requested).toEqual(['/sync/activities', '/sync/all-items?date_from'])
	})

	it('adds one ids-only diff when removed_from_list moved', async () => {
		activities = {
			all: MOVED_ALL,
			movies: { removed_from_list: MOVED_ALL },
		}
		const saved: SimklActivities = { all: SAVED_ALL, movies: { removed_from_list: SAVED_ALL } }
		const response = await GET(event(activitiesParam(saved)))
		const body = await response.json()

		expect(body.status).toBe('delta')
		expect(body.accountId).toBe('user-1')
		expect(requested).toEqual(['/sync/activities', '/sync/all-items?date_from', '/sync/all-items&ids_only'])
		expect(body.currentIds).toEqual({ movies: [1], shows: [], anime: [] })
	})

	it('surfaces the Simkl failure in the route error the client reads', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		vi.stubGlobal('fetch', async () => Response.json({ error: 'user_limit_exceeded' }, { status: 429, headers: { 'retry-after': '3600' } }))

		let caught: unknown

		try {
			await GET(event(activitiesParam({ all: SAVED_ALL })))
		}
		catch (cause) {
			caught = cause
		}

		expect(caught).toMatchObject({ status: 429 })
		expect((caught as { body: { message: string } }).body.message).toContain('Try again in 3600 seconds')
	})

	it('never makes two activities calls for one sync', async () => {
		activities = { all: MOVED_ALL }

		await GET(event(activitiesParam({ all: SAVED_ALL })))

		expect(requested.filter(call => call === '/sync/activities')).toHaveLength(1)
	})
})
