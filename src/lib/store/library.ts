import type { SimklActivities, SimklLibrary, SimklSyncResponse } from '#lib/types.js'
import { derived, get, writable } from 'svelte/store'
import { mergeSyncResponse } from '#lib/utils/simkl.js'
import { isSyncFresh } from '#lib/utils/sync.js'
import { persisted } from './persisted'

export interface SyncState {
	/** `auth`: the session is gone, so retrying cannot help until the user signs in again. */
	status: 'idle' | 'syncing' | 'error' | 'auth'
	/** Why the last sync failed, as the server explained it; shown beside the retry controls. */
	message: string | null
}

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

/** Rendering reads `watched` directly, so a malformed entry has to be rejected before it is stored. */
function isWatchedEntry(value: unknown): boolean {
	if (typeof value !== 'object' || value === null)
		return false

	const entry = value as Record<string, unknown>

	return typeof entry.year === 'number' && typeof entry.month === 'string' && typeof entry.watchedAt === 'string'
}

function isMediaItem(value: unknown): boolean {
	if (typeof value !== 'object' || value === null)
		return false

	const item = value as Record<string, unknown>

	return typeof item.simklId === 'number'
		&& typeof item.title === 'string'
		&& (item.slug === null || typeof item.slug === 'string')
		&& (item.year === null || typeof item.year === 'number')
		&& (item.poster === null || typeof item.poster === 'string')
		&& Array.isArray(item.watched)
		&& item.watched.every(isWatchedEntry)
}

function isMediaList(value: unknown): boolean {
	return Array.isArray(value) && value.every(isMediaItem)
}

function isActivities(value: unknown): boolean {
	return value === null || (typeof value === 'object' && !Array.isArray(value))
}

/** A stored payload from an older release must not be read as the current shape. */
function isCachedLibrary(value: unknown): value is CachedLibrary {
	if (typeof value !== 'object' || value === null)
		return false

	const candidate = value as Record<string, unknown>

	return (candidate.accountId === null || typeof candidate.accountId === 'string')
		&& (candidate.lastSyncedAt === null || typeof candidate.lastSyncedAt === 'number')
		&& isActivities(candidate.activities)
		&& isMediaList(candidate.movies)
		&& isMediaList(candidate.shows)
		&& isMediaList(candidate.anime)
}

/** Bumped by `clearLibrary` and by another tab clearing the cache, so no stale write can undo it. */
let cacheGeneration = 0

/** The raw stored cache, which may still belong to the previous account until it is claimed. */
const cache = persisted<CachedLibrary>('annum-simkl-library', EMPTY_LIBRARY, {
	isValid: isCachedLibrary,
	onError: e => console.warn('Failed to persist the Simkl library', e),
	// A sign-out in another tab must also invalidate a request this tab still has in flight
	onExternalChange: (value) => {
		if (value.accountId === null)
			cacheGeneration += 1
	},
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
	cacheGeneration += 1
	cache.set(EMPTY_LIBRARY)
}

export const syncState = writable<SyncState>({ status: 'idle', message: null })

/** Whether a sync completed for the claimed account; the "nothing watched" copy waits for this. */
export const hasSynced = derived(library, $library => $library.lastSyncedAt !== null)

/** Whether the cached library holds anything — distinguishes "never synced" from "empty year". */
export const hasData = derived(library, $library =>
	$library.movies.length + $library.shows.length + $library.anime.length > 0)

const SYNC_LOCK = 'annum-sync'
/** Browsers without the Web Locks API coordinate through a lease that expires on its own. */
const SYNC_LEASE_KEY = 'annum-simkl-sync-lease'
/**
 * Short enough that a tab that died mid-sync unblocks the others quickly. A retrying or very large
 * sync can outlive it, and then a second tab may join in — the price of a lease that cannot renew.
 */
const SYNC_LEASE_MS = 30_000

let syncing = false

/**
 * One tab syncs at a time; the other skips and picks the result up through the `storage` event. Web
 * Locks does that atomically; the lease is best effort, so two tabs claiming at once can still slip
 * through, which only costs a duplicate request that the throttle bounds.
 */
async function withSyncLock<T>(run: () => Promise<T>): Promise<T | null> {
	if (navigator.locks)
		return await navigator.locks.request(SYNC_LOCK, { ifAvailable: true }, async lock => lock ? await run() : null)

	const lease = claimSyncLease()

	if (lease === null)
		return null

	try {
		return await run()
	}
	finally {
		releaseSyncLease(lease)
	}
}

/** Returns the claim's token, so the sync that made it clears its own lease and not a later tab's. */
function claimSyncLease(): string | null {
	try {
		const held = readSyncLease()

		if (held !== null && held.expiresAt > Date.now())
			return null

		const token = crypto.randomUUID()

		localStorage.setItem(SYNC_LEASE_KEY, `${Date.now()}:${token}`)

		return token
	}
	catch {
		// Unavailable storage leaves nothing to coordinate with, so syncing beats never syncing
		return ''
	}
}

function releaseSyncLease(token: string): void {
	try {
		if (readSyncLease()?.token === token)
			localStorage.removeItem(SYNC_LEASE_KEY)
	}
	catch {
		// The lease is an optimisation; failing to clear it only delays another tab by its expiry
	}
}

/** A lease reads `<claimed-at-epoch-ms>:<token>`; anything else is treated as no lease. */
function readSyncLease(): { expiresAt: number, token: string } | null {
	const raw = localStorage.getItem(SYNC_LEASE_KEY)
	const separator = raw?.indexOf(':') ?? -1

	if (raw === null || separator === -1)
		return null

	const claimedAt = Number.parseInt(raw.slice(0, separator), 10)
	const token = raw.slice(separator + 1)

	if (!Number.isFinite(claimedAt) || token === '')
		return null

	return { expiresAt: claimedAt + SYNC_LEASE_MS, token }
}

/** The session is gone rather than Simkl failing, so the UI asks for a sign-in instead of a retry. */
export class SyncAuthError extends Error {}

/** Only the sign-in redirect means the session is gone; a proxy's HTML error page stays retryable. */
function isSignInRedirect(response: Response): boolean {
	if (!response.redirected)
		return false

	try {
		return new URL(response.url).pathname === '/sign-in'
	}
	catch {
		return false
	}
}

/** SvelteKit sends route errors as JSON, so Simkl's own explanation reaches the UI instead of a status. */
async function requestSync(): Promise<SimklSyncResponse> {
	const saved = get(library)
	const query = encodeURIComponent(JSON.stringify(saved.activities ?? {}))
	const response = await fetch(`/api/simkl/sync?activities=${query}`)
	// An expired session is redirected to /sign-in, which fetch follows into HTML with a 200
	if (response.status === 401 || response.status === 403 || isSignInRedirect(response))
		throw new SyncAuthError('Your session expired. Sign in again to continue syncing.')

	if (!response.ok) {
		const body = await response.json().catch(() => null) as { message?: unknown } | null

		throw new Error(typeof body?.message === 'string' ? body.message : `Sync request failed with HTTP ${response.status}`)
	}

	try {
		return await response.json() as SimklSyncResponse
	}
	catch {
		throw new Error('The sync endpoint returned an unexpected response.')
	}
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

	const generation = cacheGeneration

	try {
		const result = await withSyncLock(async () => {
			syncState.set({ status: 'syncing', message: null })

			const response = await requestSync()

			cache.update((current) => {
				// A stale cookie can return another account's history after a switch in another tab, so
				// the response must carry the account it belongs to, not just match the local claim;
				// a sign-out in between means the rows belong to a library that no longer exists
				if (get(accountId) !== account || response.accountId !== account || generation !== cacheGeneration)
					return current

				// Another account's cache is replaced rather than merged, so its anchor cannot leak
				const base = current.accountId === account ? current : EMPTY_LIBRARY

				// On `up-to-date` the item arrays keep their identity, so only the wrapper and the timestamp change
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
			syncState.set({ status: 'idle', message: null })
	}
	catch (e) {
		const message = e instanceof Error ? e.message : String(e)

		// A failure that belongs to an account which is already gone must not become the new one's state
		if (get(accountId) === account) {
			if (e instanceof SyncAuthError) {
				syncState.set({ status: 'auth', message })
			}
			else {
				console.warn(`Simkl sync failed: ${message}`)
				syncState.set({ status: 'error', message })
			}
		}
	}
	finally {
		syncing = false
	}

	// The account that took over bailed out while this request held the flag, so it runs now - whether
	// this request succeeded or not
	if (get(accountId) !== null && get(accountId) !== account)
		await sync()
}
