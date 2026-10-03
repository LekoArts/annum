import type { SimklActivities, SimklLibrary, SimklSyncResponse } from '#lib/types.js'
import { mergeSyncResponse } from '#lib/utils/simkl.js'
import { derived, get, writable } from 'svelte/store'
import { persisted } from './persisted'

export type SyncState = 'idle' | 'syncing' | 'error'

/**
 * The cache is the last sync: the normalized library plus the Simkl `activities` snapshot whose `all`
 * timestamp anchors the next `date_from` delta.
 */
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

export const hasData = derived(library, $library =>
	$library.movies.length + $library.shows.length + $library.anime.length > 0)

let syncing = false

/**
 * Sync the Simkl library into the persisted cache.
 *
 * On `up-to-date` the previously saved activities snapshot is kept: it is identical to what the server
 * returned, and overwriting it could drop a moved `removed_from_list` baseline.
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
