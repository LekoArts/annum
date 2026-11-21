import { expect, test } from '@playwright/test'
import { ACTIVITIES, LIBRARY, openDashboard, posterNames, signIn, stubSync, syncAnchor } from './fixtures/dashboard'

test('a cold failure explains itself and recovers on retry', async ({ page }) => {
	const sync = await stubSync(page, LIBRARY)
	sync.failWith(502, 'Simkl is unavailable')

	await signIn(page)

	const coldError = page.getByRole('alert').filter({ hasText: 'Couldn’t load your library' })

	await expect(coldError).toBeVisible()
	await expect(coldError).toContainText('Simkl is unavailable')

	sync.restore()
	await page.getByRole('button', { name: 'Retry sync' }).click()

	// The retry stored the library; the current year simply has nothing in it
	await expect(page.getByRole('heading', { name: 'No posters for' })).toBeVisible()

	await page.goto('/dashboard?year=2022&types=movies,shows')

	await expect.poll(async () => await posterNames(page)).toEqual(['The Bear', 'Everything Everywhere'])
})

test('a failed refresh keeps the warm posters and can be retried', async ({ page }) => {
	const sync = await openDashboard(page)

	sync.failWith(502, 'Simkl is unavailable')

	await page.getByRole('button', { name: 'Dashboard settings' }).click()
	await page.getByRole('button', { name: 'Refresh now' }).click()

	const alert = page.getByRole('alert')

	await expect(alert).toContainText('Couldn\'t sync your Simkl library.')
	await expect(alert).toContainText('Simkl is unavailable')
	await expect.poll(async () => await posterNames(page)).toEqual(['The Bear', 'Everything Everywhere'])

	sync.restore()
	await alert.getByRole('button', { name: 'Retry' }).click()

	await expect(alert).toBeHidden()
	// Initial load, the failed refresh and the retry
	expect(sync.requests).toHaveLength(3)
	// The retry diffs against the anchor the client saved verbatim from the first response
	expect(syncAnchor(sync.requests.at(-1)!)).toEqual(ACTIVITIES)
})

test('an expired session offers a sign-in instead of a retry', async ({ page }) => {
	const sync = await openDashboard(page)

	sync.failWith(401, 'Your session expired. Sign in again to continue syncing.')

	await page.getByRole('button', { name: 'Dashboard settings' }).click()
	await page.getByRole('button', { name: 'Refresh now' }).click()

	const alert = page.getByRole('alert')

	const signInAgain = alert.getByRole('link', { name: 'Sign in again' })

	await expect(signInAgain).toHaveAttribute('href', '/sign-in?reconnect')
	await expect(alert.getByRole('button', { name: 'Retry' })).toHaveCount(0)

	// The Better Auth session survives a dead Simkl grant, so the page must still offer the handshake
	await signInAgain.click()
	await expect(page.getByRole('button', { name: 'Reconnect Simkl' })).toBeVisible()
})

test('an empty library still surfaces an expired session', async ({ page }) => {
	const sync = await stubSync(page, { movies: [], shows: [], anime: [] })

	await signIn(page)
	await page.goto('/dashboard?year=2022&types=movies,shows')

	// A successful sync of nothing means `hasSynced` is true, which must not hide a later failure
	await expect(page.getByRole('heading', { name: 'No posters for' })).toBeVisible()

	sync.failWith(401, 'Your session expired. Sign in again to continue syncing.')

	await page.getByRole('button', { name: 'Dashboard settings' }).click()
	await page.getByRole('button', { name: 'Refresh now' }).click()

	const alert = page.getByRole('alert')

	await expect(alert).toContainText('Your session expired')
	await expect(alert.getByRole('link', { name: 'Sign in again' })).toHaveAttribute('href', '/sign-in?reconnect')
})
