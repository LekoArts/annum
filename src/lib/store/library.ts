import type { SimklActivities, SimklLibrary, SimklSyncResponse } from '#lib/types.js'
import { mergeSyncResponse } from '#lib/utils/simkl.js'
import { isSyncFresh } from '#lib/utils/sync.js'
import { derived, get, writable } from 'svelte/store'
import { persisted } from './persisted'

export type SyncState = 'idle' | 'syncing' | 'error'

/** The cache: the normalized library, its `activities` anchor and the account it belongs to. */
export interface CachedLibrary extends SimklLibrary {
	accountId: string | null
	activities: SimklActivities | null
	lastSyncedAt: number | null
}

const EMPTY_LIBRARY: CachedLibrary = {
	accountId: null,
	activities: null,
	lastSyncedAt: null,
	movies: [],
	shows: [],
	anime: [],
}

/** The raw stored cache, which may still belong to the previous account until it is claimed. */
const cache = persisted<CachedLibrary>('annum-simkl-library', EMPTY_LIBRARY, {
	onError: e => console.warn('Failed to persist the Simkl library', e),
})

const accountId = writable<string | null>(null)

/**
 * Accounts share a browser, so the cache is only readable once claimed by the signed-in one. Another
 * account's posters and delta anchor must never reach the grid or the sync request.
 */
export const library = derived([cache, accountId], ([$cache, $accountId]) =>
	$accountId !== null && $cache.accountId === $accountId ? $cache : EMPTY_LIBRARY)

/**
 * Point the store at the signed-in account, or at nothing while the session is unknown. The id is the
 * Simkl account id, because `getUserInfo` builds the Better Auth user out of `account.id`.
 */
export function claimLibrary(id: string | null): void {
	accountId.set(id)
}

/** Signing out drops the cached library with it. */
export function clearLibrary(): void {
	cache.set(EMPTY_LIBRARY)
}

export const syncState = writable<SyncState>('idle')

/** Whether a sync completed for the claimed account; the "nothing watched" copy waits for this. */
export const hasSynced = derived(library, $library => $library.lastSyncedAt !== null)

/** Whether the cached library holds anything — distinguishes "never synced" from "empty year". */
export const hasData = derived(library, $library =>
	$library.movies.length + $library.shows.length + $library.anime.length > 0)

const SYNC_LOCK = 'annum-sync'

let syncing = false

/** One tab syncs at a time; the other skips and picks the result up through the `storage` event. */
async function withSyncLock<T>(run: () => Promise<T>): Promise<T | null> {
	if (!navigator.locks)
		return await run()

	return await navigator.locks.request(SYNC_LOCK, { ifAvailable: true }, async lock => lock ? await run() : null)
}

async function requestSync(): Promise<SimklSyncResponse> {
	const saved = get(library)
	const query = encodeURIComponent(JSON.stringify(saved.activities ?? {}))
	const response = await fetch(`/api/simkl/sync?activities=${query}`)

	if (!response.ok)
		throw new Error(`Sync request failed with HTTP ${response.status}`)

	return await response.json() as SimklSyncResponse
}

/** A sync that already ran inside the interval is skipped, so a reload costs no request. */
function isThrottled(cached: CachedLibrary, account: string): boolean {
	return cached.accountId === account && isSyncFresh(cached.lastSyncedAt)
}

/**
 * Sync into the persisted cache. Automatic calls are throttled and `force` is for the refresh control
 * and the retry buttons. On `up-to-date` the saved activities snapshot is kept, since overwriting it
 * could drop a moved `removed_from_list` baseline.
 */
export async function sync({ force = false }: { force?: boolean } = {}): Promise<void> {
	if (syncing)
		return

	const account = get(accountId)

	if (account === null)
		return

	const cached = get(cache)

	if (!force && isThrottled(cached, account))
		return

	syncing = true

	try {
		const result = await withSyncLock(async () => {
			syncState.set('syncing')

			const response = await requestSync()

			cache.update((current) => {
				// A sign-out or account switch landed while the request was in flight, so this response
				// belongs to nobody: keeping it would leave an empty library marked as freshly synced
				if (get(accountId) !== account)
					return current

				// Another account's cache is replaced rather than merged, so its anchor cannot leak
				const base = current.accountId === account ? current : EMPTY_LIBRARY

				return {
					...mergeSyncResponse(base, response),
					accountId: account,
					activities: response.status === 'up-to-date' ? base.activities : response.activities,
					lastSyncedAt: Date.now(),
				}
			})

			return response
		})

		// A skipped sync leaves the state alone: the other tab owns the spinner
		if (result !== null)
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
