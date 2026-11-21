import { expect, test } from '@playwright/test'

// Clicking through to Simkl is the one auth path a unit test cannot reach: it needs the real Better Auth
// handler to build the authorize URL. Intercepting the outbound navigation keeps it offline while pinning
// the parts of the handshake that a dependency upgrade could quietly break (PKCE, state, callback route).
test('starts Simkl sign-in with PKCE and the registered callback', async ({ page }) => {
	let authorize: URL | undefined

	await page.route('https://simkl.com/**', async (route) => {
		authorize = new URL(route.request().url())
		await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Simkl</p>' })
	})

	await page.goto('/sign-in')
	await page.getByRole('button', { name: 'Connect with Simkl' }).click()

	await expect.poll(() => authorize?.pathname ?? '').toBe('/oauth2/authorize')

	const params = authorize!.searchParams
	expect(params.get('client_id')).toBeTruthy()
	expect(params.get('response_type')).toBe('code')
	expect(params.get('state')).toBeTruthy()
	expect(params.get('code_challenge')).toBeTruthy()
	expect(params.get('code_challenge_method')).toBe('S256')
	expect(params.get('scope')).toContain('media:read')
	expect(params.get('redirect_uri')).toMatch(/\/api\/auth\/callback\/simkl$/)
})
