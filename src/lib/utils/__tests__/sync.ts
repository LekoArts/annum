import { describe, expect, it } from 'vitest'
import { formatSyncAge, isSyncFresh, SYNC_INTERVAL_MS } from '../sync'

const MINUTE = 60_000
const NOW = 1_700_000_000_000

describe('isSyncFresh', () => {
	it('is never fresh without a completed sync', () => {
		expect(isSyncFresh(null, NOW)).toBe(false)
	})

	it('is fresh inside the interval', () => {
		expect(isSyncFresh(NOW - MINUTE, NOW)).toBe(true)
		expect(isSyncFresh(NOW - 14 * MINUTE - 59_000, NOW)).toBe(true)
	})

	it('stops being fresh at the interval', () => {
		expect(isSyncFresh(NOW - SYNC_INTERVAL_MS, NOW)).toBe(false)
		expect(isSyncFresh(NOW - 16 * MINUTE, NOW)).toBe(false)
	})

	// A clock that ran backwards must not turn every load into a sync
	it('treats a future timestamp as fresh', () => {
		expect(isSyncFresh(NOW + MINUTE, NOW)).toBe(true)
	})
})

describe('formatSyncAge', () => {
	it('has no label before the first sync', () => {
		expect(formatSyncAge(null, NOW)).toBeNull()
	})

	it('labels seconds as just now', () => {
		expect(formatSyncAge(NOW - 30_000, NOW)).toBe('just now')
		expect(formatSyncAge(NOW, NOW)).toBe('just now')
	})

	it('labels minutes, hours and days', () => {
		expect(formatSyncAge(NOW - 12 * MINUTE, NOW)).toBe('12 min ago')
		expect(formatSyncAge(NOW - 59 * MINUTE, NOW)).toBe('59 min ago')
		expect(formatSyncAge(NOW - 3 * 60 * MINUTE, NOW)).toBe('3 h ago')
		expect(formatSyncAge(NOW - 23 * 60 * MINUTE, NOW)).toBe('23 h ago')
		expect(formatSyncAge(NOW - 2 * 24 * 60 * MINUTE, NOW)).toBe('2 d ago')
	})

	it('does not read a future timestamp as a negative age', () => {
		expect(formatSyncAge(NOW + 5 * MINUTE, NOW)).toBe('just now')
	})
})
