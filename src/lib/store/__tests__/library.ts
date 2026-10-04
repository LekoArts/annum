// @vitest-environment happy-dom
import type { SimklSyncResponse } from '#lib/types.js'
import { get } from 'svelte/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { claimLibrary, clearLibrary, hasData, hasSynced, library, sync, syncState } from '../library'

const ACCOUNT = '12345'
const OTHER_ACCOUNT = '67890'
const STORAGE_KEY = 'annum-simkl-library'
const MINUTE = 60_000
const LEASE_KEY = 'annum-simkl-sync-lease'

function media(id: number) {
	return { simklId: id, slug: `title-${id}`, title: `Title ${id}`, year: 2020, poster: null, watched: [{ year: 2020, month: 'May', watchedAt: '2020-05-05T00:00:00Z' }] }
}

function seed({ accountId = ACCOUNT, lastSyncedAt = null as number | null, movies = [media(1)] } = {}): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ accountId, activities: { all: '2026-10-03T14:28:11Z', movies: { removed_from_list: '2026-09-01T00:00:00Z' } }, lastSyncedAt, movies, shows: [], anime: [] }))
}

function stubResponse(response: SimklSyncResponse): void {
	vi.stubGlobal('fetch', async () => new Response(JSON.stringify(response), { status: 200, headers: { 'content-type': 'application/json' } }))
}

let lockRequests: Array<{ name: string, options: unknown }> = []

function stubLock(available: boolean): void {
	Object.defineProperty(navigator, 'locks', {
		configurable: true,
		value: {
			request: async (name: string, options: unknown, callback: (lock: unknown) => Promise<unknown>) => {
				lockRequests.push({ name, options })

				return available ? await callback({ name: 'annum-sync' }) : null
			},
		},
	})
}

const UP_TO_DATE: SimklSyncResponse = { status: 'up-to-date', activities: { all: '2026-10-03T14:28:11Z' }, movies: [], shows: [], anime: [] }

beforeEach(() => {
	localStorage.clear()
	clearLibrary()
	claimLibrary(null)
	syncState.set({ status: 'idle', message: null })
	lockRequests = []
	delete (navigator as { locks?: unknown }).locks
	stubResponse(UP_TO_DATE)
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
	localStorage.clear()
})

describe('library account scoping', () => {
	it('hides another account\'s library until it is claimed', () => {
		seed({ accountId: ACCOUNT })

		claimLibrary(OTHER_ACCOUNT)

		expect(get(library).movies).toEqual([])
		expect(get(hasData)).toBe(false)
		expect(get(hasSynced)).toBe(false)
	})

	it('exposes the cached library of the claimed account', () => {
		seed({ accountId: ACCOUNT, lastSyncedAt: Date.now() - MINUTE })

		claimLibrary(ACCOUNT)

		expect(get(library).movies).toHaveLength(1)
		expect(get(hasData)).toBe(true)
		expect(get(hasSynced)).toBe(true)
	})

	it('replaces the stored library when a different account signs in', async () => {
		seed({ accountId: ACCOUNT, lastSyncedAt: Date.now() })
		claimLibrary(OTHER_ACCOUNT)
		stubResponse({ status: 'full', activities: { all: '2026-10-04T09:00:00Z' }, movies: [media(2)], shows: [], anime: [] })

		await sync()

		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ accountId: OTHER_ACCOUNT })
		expect(get(library).movies.map(item => item.simklId)).toEqual([2])
	})

	it('does not keep a response that lands after sign-out', async () => {
		let release: (response: Response) => void = () => {}
		vi.stubGlobal('fetch', async () => await new Promise<Response>((resolve) => {
			release = resolve
		}))
		claimLibrary(ACCOUNT)

		const pending = sync()
		// The tab signs out while the request is still in flight
		claimLibrary(null)
		clearLibrary()
		release(new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		await pending

		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ accountId: null, lastSyncedAt: null })
	})

	it('renders the library another tab wrote through the storage event', () => {
		seed({ lastSyncedAt: Date.now() - MINUTE })
		claimLibrary(ACCOUNT)
		const seen: Array<Array<number>> = []
		// A mounted component holds the subscription, which is what keeps the cross-tab listener alive
		const unsubscribe = library.subscribe(($library) => {
			seen.push($library.movies.map(item => item.simklId))
		})

		window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify({ accountId: ACCOUNT, activities: null, lastSyncedAt: Date.now(), movies: [media(9)], shows: [], anime: [] }) }))
		unsubscribe()

		expect(seen.at(-1)).toEqual([9])
	})

	it('drops the cache on sign-out', () => {
		seed({ accountId: ACCOUNT, lastSyncedAt: Date.now() })
		claimLibrary(ACCOUNT)

		clearLibrary()

		expect(get(library).movies).toEqual([])
		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ accountId: null, lastSyncedAt: null })
	})
})

describe('library sync throttling', () => {
	it('does not sync before the session is known', async () => {
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('always syncs a cold cache', async () => {
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)
		claimLibrary(ACCOUNT)

		await sync()

		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(get(hasSynced)).toBe(true)
	})

	it('skips the request while the last sync is fresh', async () => {
		seed({ lastSyncedAt: Date.now() - MINUTE })
		claimLibrary(ACCOUNT)
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		expect(fetchMock).not.toHaveBeenCalled()
		expect(get(syncState).status).toBe('idle')
	})

	it('syncs again once the interval has passed', async () => {
		seed({ lastSyncedAt: Date.now() - 16 * MINUTE })
		claimLibrary(ACCOUNT)
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('ignores the throttle when forced and reports the new timestamp', async () => {
		seed({ lastSyncedAt: Date.now() - MINUTE })
		claimLibrary(ACCOUNT)
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)
		const before = Date.now()

		await sync({ force: true })

		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(get(library).lastSyncedAt).toBeGreaterThanOrEqual(before)
	})

	it('keeps the saved activities snapshot when Simkl reports up-to-date', async () => {
		seed({ lastSyncedAt: Date.now() - 16 * MINUTE })
		claimLibrary(ACCOUNT)

		await sync()

		expect(get(library).activities).toMatchObject({ movies: { removed_from_list: '2026-09-01T00:00:00Z' } })
	})

	it('sends the claimed activities snapshot as the delta anchor', async () => {
		seed({ lastSyncedAt: Date.now() - 16 * MINUTE })
		claimLibrary(ACCOUNT)
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		const requested = String(fetchMock.mock.calls[0][0])
		expect(JSON.parse(decodeURIComponent(requested.split('activities=')[1]))).toMatchObject({ all: '2026-10-03T14:28:11Z' })
	})

	it('leaves a stale anchor behind when the account switches', async () => {
		seed({ accountId: ACCOUNT, lastSyncedAt: Date.now() - 16 * MINUTE })
		claimLibrary(OTHER_ACCOUNT)
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify({ status: 'full', activities: { all: '2026-10-04T09:00:00Z' }, movies: [], shows: [], anime: [] }), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		const requested = String(fetchMock.mock.calls[0][0])
		expect(JSON.parse(decodeURIComponent(requested.split('activities=')[1]))).toEqual({})
	})

	it('skips while another tab holds the sync lock', async () => {
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)
		stubLock(false)
		claimLibrary(ACCOUNT)

		await sync()

		expect(fetchMock).not.toHaveBeenCalled()
		expect(get(syncState).status).toBe('idle')
		expect(lockRequests).toEqual([{ name: 'annum-sync', options: { ifAvailable: true } }])
	})

	it('syncs when it holds the lock itself', async () => {
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)
		stubLock(true)
		claimLibrary(ACCOUNT)

		await sync()

		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('reports a failed sync and keeps the cached library', async () => {
		seed({ lastSyncedAt: Date.now() - 16 * MINUTE })
		claimLibrary(ACCOUNT)
		vi.stubGlobal('fetch', async () => new Response('nope', { status: 502 }))
		vi.spyOn(console, 'warn').mockImplementation(() => {})

		await sync()

		expect(get(syncState).status).toBe('error')
		expect(get(library).movies).toHaveLength(1)
	})

	it('carries the server\'s reason for a failure into the state', async () => {
		claimLibrary(ACCOUNT)
		vi.stubGlobal('fetch', async () => Response.json({ message: 'The Simkl daily request quota is exhausted. Try again in 3600 seconds.' }, { status: 429 }))
		vi.spyOn(console, 'warn').mockImplementation(() => {})

		await sync()

		expect(get(syncState)).toEqual({ status: 'error', message: 'The Simkl daily request quota is exhausted. Try again in 3600 seconds.' })

		vi.stubGlobal('fetch', async () => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))

		await sync({ force: true })

		expect(get(syncState)).toEqual({ status: 'idle', message: null })
	})

	it('falls back to the HTTP status when a failure carries no message', async () => {
		claimLibrary(ACCOUNT)
		vi.stubGlobal('fetch', async () => new Response('nope', { status: 502 }))
		vi.spyOn(console, 'warn').mockImplementation(() => {})

		await sync()

		expect(get(syncState)).toEqual({ status: 'error', message: 'Sync request failed with HTTP 502' })
	})
})

describe('library sync lease without Web Locks', () => {
	it('skips while another tab holds the lease', async () => {
		claimLibrary(ACCOUNT)
		localStorage.setItem(LEASE_KEY, `${Date.now()}:another-tab`)
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		expect(fetchMock).not.toHaveBeenCalled()
		expect(get(syncState).status).toBe('idle')
	})

	it('syncs once the lease has expired', async () => {
		claimLibrary(ACCOUNT)
		localStorage.setItem(LEASE_KEY, `${Date.now() - 60_000}:stale-tab`)
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('leaves a lease another tab took over after it expired in place', async () => {
		claimLibrary(ACCOUNT)
		const takenOver = `${Date.now()}:later-tab`

		vi.stubGlobal('fetch', async () => {
			// This sync outlived its own lease, so another tab claimed it meanwhile
			localStorage.setItem(LEASE_KEY, takenOver)

			return new Response(JSON.stringify(UP_TO_DATE), { status: 200 })
		})

		await sync()

		expect(localStorage.getItem(LEASE_KEY)).toBe(takenOver)
	})

	it('treats an unreadable lease value as no lease at all', async () => {
		claimLibrary(ACCOUNT)
		localStorage.setItem(LEASE_KEY, 'not-a-lease')
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		await sync()

		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('syncs anyway when storage cannot be read or written', async () => {
		claimLibrary(ACCOUNT)
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) => new Response(JSON.stringify(UP_TO_DATE), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('localStorage', {
			getItem: () => { throw new Error('storage blocked') },
			setItem: () => { throw new Error('storage blocked') },
			removeItem: () => { throw new Error('storage blocked') },
		})

		await sync()

		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('hands the lease back when the sync ends, however it ends', async () => {
		claimLibrary(ACCOUNT)

		await sync()
		expect(localStorage.getItem(LEASE_KEY)).toBeNull()

		vi.stubGlobal('fetch', async () => new Response('nope', { status: 502 }))
		vi.spyOn(console, 'warn').mockImplementation(() => {})

		await sync({ force: true })
		expect(localStorage.getItem(LEASE_KEY)).toBeNull()
	})
})
