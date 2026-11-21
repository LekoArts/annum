import { expect, test } from '@playwright/test'
import { authenticate, LIBRARY, openDashboard, posterNames, stubSync } from './fixtures/dashboard'

test('first sync fills a deep-linked year and browsing issues no further sync', async ({ page }) => {
	const sync = await openDashboard(page)

	expect(sync.requests).toHaveLength(1)
	await expect.poll(async () => await posterNames(page)).toEqual(['The Bear', 'Everything Everywhere'])

	// A deep link keeps its year and its selection
	await page.goto('/dashboard?year=2021&types=movies')
	await expect.poll(async () => await posterNames(page)).toEqual(['Dune'])
	await expect(page.getByRole('button', { name: 'Select year, 2021' })).toBeVisible()

	// The year control steps by one year and keeps the selected types
	await page.getByRole('button', { name: 'Next year' }).click()
	await expect(page).toHaveURL(/year=2022&types=movies/)
	await expect.poll(async () => await posterNames(page)).toEqual(['Everything Everywhere'])

	// Back and forward restore the browsing state
	await page.goBack()
	await expect(page).toHaveURL(/year=2021/)
	await page.goForward()
	await expect(page).toHaveURL(/year=2022/)

	// Browsing is query navigation over the cached library, so it must never start another sync
	expect(sync.requests).toHaveLength(1)
})

test('locks the last selected media type instead of emptying the grid', async ({ page }) => {
	await openDashboard(page, { year: 2022, types: 'movies,shows' })

	// The first control in the dock is the media-type trigger
	await page.getByRole('group', { name: 'Collection controls' }).getByRole('button').first().click()

	const shows = page.getByRole('checkbox', { name: 'Shows' })
	const movies = page.getByRole('checkbox', { name: 'Movies' })

	await shows.uncheck()

	await expect.poll(async () => await posterNames(page)).toEqual(['Everything Everywhere'])
	await expect(shows).not.toBeChecked()
	// The last remaining type cannot be switched off, so the grid can never go blank by accident
	await expect(movies).toBeChecked()
	await expect(movies).toBeDisabled()
	await expect(page.getByText('Keep at least one type selected.')).toBeVisible()
})
test('a cold deep link keeps its year while the first sync lands', async ({ page }) => {
	const sync = await stubSync(page, LIBRARY)

	// Signing in through the API leaves the dashboard unmounted, so the deep link is the first cold render
	await authenticate(page)
	sync.hold()
	await page.goto('/dashboard?year=2021&types=movies')

	await expect(page.getByText('Loading your library…')).toBeAttached()

	sync.release()

	// The requested year survives a library that arrives after the URL was resolved
	await expect.poll(async () => await posterNames(page)).toEqual(['Dune'])
	await expect(page.getByRole('button', { name: 'Select year, 2021' })).toBeVisible()
	expect(sync.requests).toHaveLength(1)
})
