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
	it('runs the initial pull once, sequentially, then reads the activities baseline', async () => {
		const response = await GET(event())
		const body = await response.json()

		expect(body.status).toBe('full')
		expect(requested).toEqual([
			'/sync/all-items/movies',
			'/sync/all-items/shows',
			'/sync/all-items/anime',
			'/sync/activities',
		])
	})

	// The endpoint the Simkl dev asked about: an unchanged library costs exactly one cheap call
	it('spends one activities call and nothing else when nothing moved', async () => {
		const response = await GET(event(activitiesParam({ all: SAVED_ALL })))
		const body = await response.json()

		expect(body.status).toBe('up-to-date')
		expect(requested).toEqual(['/sync/activities'])
	})

	it('follows a moved activities.all with a single date_from delta', async () => {
		activities = { all: MOVED_ALL }
		const response = await GET(event(activitiesParam({ all: SAVED_ALL })))
		const body = await response.json()

		expect(body.status).toBe('delta')
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
