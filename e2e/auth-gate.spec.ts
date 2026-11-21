import { expect, test } from '@playwright/test'

test('sends a signed-out visitor from the dashboard to sign-in', async ({ page }) => {
	await page.goto('/dashboard')

	await expect(page).toHaveURL(/\/sign-in$/)
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your collection starts here.')
})
