/** How long a completed sync stays fresh; Simkl asks for 15-30 minutes between automatic checks. */
export const SYNC_INTERVAL_MS = 15 * 60 * 1000

/** Whether a completed sync is recent enough to render from cache instead of asking Simkl again. */
export function isSyncFresh(lastSyncedAt: number | null, now = Date.now()): boolean {
	return lastSyncedAt !== null && now - lastSyncedAt < SYNC_INTERVAL_MS
}

/** Short age of the last completed sync, or `null` when nothing has synced yet. */
export function formatSyncAge(lastSyncedAt: number | null, now = Date.now()): string | null {
	if (lastSyncedAt === null)
		return null

	// A skewed clock reads as "just now" rather than a negative age
	const minutes = Math.floor(Math.max(0, now - lastSyncedAt) / 60_000)

	if (minutes < 1)
		return 'just now'
	if (minutes < 60)
		return `${minutes} min ago`

	const hours = Math.floor(minutes / 60)

	return hours < 24 ? `${hours} h ago` : `${Math.floor(hours / 24)} d ago`
}
