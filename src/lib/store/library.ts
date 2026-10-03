import type { SimklActivities, SimklLibrary, SimklSyncResponse } from '#lib/types.js'
import { mergeSyncResponse } from '#lib/utils/simkl.js'
import { derived, get, writable } from 'svelte/store'
import { persisted } from './persisted'

export type SyncState = 'idle' | 'syncing' | 'error'

/** The cache: the normalized library plus the `activities` snapshot that anchors the next delta. */
export interface CachedLibrary extends SimklLibrary {
	activities: SimklActivities | null
}

export const library = persisted<CachedLibrary>('annum-simkl-library', {
	activities: null,
	movies: [],
	shows: [],
	anime: [],
}, {
	onError: e => console.warn('Failed to persist the Simkl library', e),
})

export const syncState = writable<SyncState>('idle')

/**
 * Whether a sync finished in this session. The library only lives in the browser, so the "nothing
 * watched" copy waits for this flag - `syncState` is `idle` before the first sync too.
 */
export const syncCompleted = writable(false)

/** Whether the cached library holds anything — distinguishes "never synced" from "empty year". */
export const hasData = derived(library, $library =>
	$library.movies.length + $library.shows.length + $library.anime.length > 0)

let syncing = false

/**
 * Sync into the persisted cache; on `up-to-date` the saved activities snapshot is kept, since
 * overwriting it could drop a moved `removed_from_list` baseline.
 */
export async function sync(): Promise<void> {
	if (syncing)
		return

	syncing = true
	syncState.set('syncing')

	try {
		const saved = get(library)
		const query = encodeURIComponent(JSON.stringify(saved.activities ?? {}))
		const res = await fetch(`/api/simkl/sync?activities=${query}`)

		if (!res.ok)
			throw new Error(`Sync request failed with HTTP ${res.status}`)

		const response = await res.json() as SimklSyncResponse

		library.update(current => ({
			...mergeSyncResponse(current, response),
			activities: response.status === 'up-to-date' ? current.activities : response.activities,
		}))

		syncCompleted.set(true)
		syncState.set('idle')
	}
	catch (e) {
		console.warn(`Simkl sync failed: ${e}`)
		syncState.set('error')
	}
	finally {
		syncing = false
	}
}
