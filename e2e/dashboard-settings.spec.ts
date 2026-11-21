import { expect, test } from '@playwright/test'
import { openDashboard, posterNames } from './fixtures/dashboard'

test('settings survive a reload and the popover closes on Escape', async ({ page }) => {
	const sync = await openDashboard(page)

	const trigger = page.getByRole('button', { name: 'Dashboard settings' })

	await trigger.click()

	const groupByMonth = page.getByRole('switch', { name: 'Group by month' })
	const screenshotMode = page.getByRole('switch', { name: 'Screenshot mode' })

	await groupByMonth.click()
	await expect(groupByMonth).toHaveAttribute('aria-checked', 'true')
	await expect(page.getByRole('heading', { name: 'June' })).toBeVisible()
	await expect(page.getByRole('heading', { name: 'April' })).toBeVisible()

	await screenshotMode.click()
	// The radio input is visually hidden, so the label is what a user clicks
	await page.getByText('Dark', { exact: true }).click()

	// Screenshot columns are part of the same popover and apply to the grid immediately
	const columns = page.getByRole('spinbutton', { name: 'Columns' })

	await columns.fill('3')
	await expect(columns).toHaveValue('3')
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

	// Escape closes the popover and hands focus back to its trigger
	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog', { name: 'Dashboard settings' })).toBeHidden()
	await expect(trigger).toBeFocused()

	const before = await posterNames(page)

	await page.reload()

	await expect.poll(async () => await posterNames(page)).toEqual(before)
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	await expect(page.getByRole('heading', { name: 'June' })).toBeVisible()

	await trigger.click()
	await expect(page.getByRole('switch', { name: 'Group by month' })).toHaveAttribute('aria-checked', 'true')
	await expect(page.getByRole('switch', { name: 'Screenshot mode' })).toHaveAttribute('aria-checked', 'true')
	await expect(page.getByRole('spinbutton', { name: 'Columns' })).toHaveValue('3')

	// The stored cache is still fresh, so the reload must not spend another sync request
	expect(sync.requests).toHaveLength(1)
})
