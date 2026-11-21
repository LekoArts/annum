import { expect, test } from '@playwright/test'

test('renders the landing page and its sign-in call to action', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { level: 1 })).toContainText('watched')
	await expect(page.getByRole('button', { name: 'Connect with Simkl' }).first()).toBeVisible()
})
