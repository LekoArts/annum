import { expect, test } from '@playwright/test'
import { authenticate, cachedLibrary, LIBRARY, openDashboard, posterNames, signIn, signOut, stubSync } from './fixtures/dashboard'

test('a second tab reuses the fresh cache without another sync', async ({ page, context }) => {
	await openDashboard(page)

	const second = await context.newPage()
	const secondSync = await stubSync(second, LIBRARY)

	await second.goto('/dashboard?year=2022&types=movies,shows')

	await expect.poll(async () => await posterNames(second)).toEqual(['The Bear', 'Everything Everywhere'])
	expect(secondSync.requests).toHaveLength(0)
})

test('signing out drops the cached library', async ({ page }) => {
	const sync = await openDashboard(page)

	expect(JSON.parse((await cachedLibrary(page))!)).toMatchObject({ lastSyncedAt: expect.any(Number) })

	// A session that is gone cannot sync; the dev server's stub has to say so too
	sync.failWith(401, 'Your session expired. Sign in again to continue syncing.')

	await signOut(page)

	expect(JSON.parse((await cachedLibrary(page))!)).toMatchObject({ accountId: null, lastSyncedAt: null, movies: [] })
})

test('a new account never sees the previous library', async ({ page }) => {
	const previous = await openDashboard(page)
	previous.failWith(401, 'Your session expired. Sign in again to continue syncing.')
	await signOut(page)

	const sync = await stubSync(page, {
		movies: [{ simklId: 900, slug: 'other-movie', title: 'Other Movie', year: 2020, poster: null, watched: [{ year: 2020, month: 'May', watchedAt: '2020-05-01T00:00:00Z' }] }],
		shows: [],
		anime: [],
	})

	await signIn(page, { account: 424242 })
	await page.goto('/dashboard?year=2020&types=movies')

	await expect.poll(async () => await posterNames(page)).toEqual(['Other Movie'])
	// The cache was dropped, so the new account gets its own full sync
	expect(sync.requests).toHaveLength(1)
})

test('a tab opened during a cold sync waits for the running one', async ({ page, context }) => {
	const sync = await stubSync(page, LIBRARY)

	await authenticate(page)
	sync.hold()
	await page.goto('/dashboard?year=2022&types=movies,shows')

	await expect.poll(() => sync.requests.length).toBe(1)

	// The second tab has no library yet and the lock is held, so it waits for the first tab to write it
	const second = await context.newPage()
	const secondSync = await stubSync(second, LIBRARY)

	// Record the lock attempts, so the test proves the second tab asked and was turned away rather than
	// merely being throttled by the freshness check
	await second.addInitScript(() => {
		const calls: Array<{ name: string, ifAvailable: boolean }> = []
		const request = navigator.locks.request.bind(navigator.locks)

		Object.defineProperty(window, '__syncLockCalls', { value: calls })
		Object.defineProperty(navigator.locks, 'request', {
			configurable: true,
			value: (name: string, options: { ifAvailable?: boolean }, callback: (lock: unknown) => Promise<unknown>) => {
				calls.push({ name, ifAvailable: options?.ifAvailable === true })

				return request(name, options, callback)
			},
		})
	})

	await second.goto('/dashboard?year=2022&types=movies,shows')
	await expect.poll(() => second.evaluate(() => (window as unknown as { __syncLockCalls: Array<{ name: string }> }).__syncLockCalls.some(call => call.name === 'annum-sync'))).toBe(true)
	expect(await second.evaluate(() => (window as unknown as { __syncLockCalls: Array<{ ifAvailable: boolean }> }).__syncLockCalls[0].ifAvailable)).toBe(true)
	// Still only the first tab's request exists while the second has already tried
	expect(sync.requests).toHaveLength(1)
	expect(secondSync.requests).toHaveLength(0)

	sync.release()

	await expect.poll(async () => await posterNames(second)).toEqual(['The Bear', 'Everything Everywhere'])
	expect(secondSync.requests).toHaveLength(0)
})

test('signing out in one tab empties the library in another', async ({ page, context }) => {
	const sync = await openDashboard(page)

	const second = await context.newPage()
	await second.goto('/dashboard?year=2022&types=movies,shows')
	await expect.poll(async () => await posterNames(second)).toEqual(['The Bear', 'Everything Everywhere'])

	sync.failWith(401, 'Your session expired. Sign in again to continue syncing.')
	await signOut(page)

	// The other tab shares the storage, so the dropped cache has to reach its grid as well
	await expect.poll(async () => JSON.parse((await cachedLibrary(second)) ?? '{}')).toMatchObject({ accountId: null, movies: [] })
	await expect.poll(async () => await posterNames(second)).toEqual([])
})
