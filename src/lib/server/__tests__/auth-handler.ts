import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The handler is exercised against the real Better Auth instance: only Simkl's network calls are stubbed,
// so the authorize URL, PKCE exchange, callback route and session cookie are all the shipped code path.
vi.mock('$app/env/private', () => ({ PRIVATE_BETTER_AUTH_SECRET: 'handler-test-secret-value-at-least-32-characters' }))
vi.mock('$app/env/public', () => ({
	PUBLIC_BETTER_AUTH_URL: 'http://localhost:5173',
	PUBLIC_SIMKL_CLIENT_ID: 'handler-test-client',
}))
vi.mock('$app/server', () => ({ getRequestEvent: () => undefined }))

const ORIGIN = 'http://localhost:5173'
const SIMKL_TOKEN = 'simkl-access-token'

function setCookies(response: Response): string {
	return response.headers.getSetCookie().map(cookie => cookie.split(';')[0]).join('; ')
}

/** The Simkl calls a sign-in makes once the user approves: the code exchange and the profile read. */
function stubSimkl(profile: { id: number, name: string }): void {
	vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)

		if (url.pathname === '/oauth2/token') {
			expect(new URLSearchParams(String(init?.body)).get('code')).toBe('test-code')

			return Response.json({ access_token: SIMKL_TOKEN, token_type: 'bearer', expires_in: 604_800, refresh_token: 'refresh' })
		}

		if (url.pathname === '/users/settings') {
			expect(new Headers(init?.headers).get('authorization')).toBe(`Bearer ${SIMKL_TOKEN}`)

			// The shape `/users/settings` really returns, including the cache-busting query on the avatar
			return Response.json({
				user: {
					name: profile.name,
					joined_at: '2015-04-01T15:47:07Z',
					gender: 'male',
					avatar: 'https://simkl.in/avatars/87/8798305_100.jpg?1785154082',
					bio: '',
					loc: '',
					age: '',
				},
				account: { id: profile.id, timezone: 'Europe/Berlin', type: 'pro', anime_title_language: 'en' },
			})
		}

		throw new Error(`Unexpected Simkl request: ${url.href}`)
	})
}

beforeEach(() => {
	vi.resetModules()
	vi.stubGlobal('fetch', async () => {
		throw new Error('No Simkl stub installed')
	})
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('better Auth handler', () => {
	it('turns a Simkl approval into a session on the callback route', async () => {
		const { auth } = await import('#lib/auth.js')

		const signIn = await auth.handler(new Request(`${ORIGIN}/api/auth/sign-in/social`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'origin': ORIGIN },
			body: JSON.stringify({ provider: 'simkl', callbackURL: '/dashboard' }),
		}))
		const { url } = await signIn.json() as { url: string }
		const authorize = new URL(url)

		expect(authorize.origin).toBe('https://simkl.com')
		expect(authorize.searchParams.get('code_challenge_method')).toBe('S256')
		expect(authorize.searchParams.get('redirect_uri')).toBe(`${ORIGIN}/api/auth/callback/simkl`)

		const state = authorize.searchParams.get('state')
		const cookies = setCookies(signIn)

		expect(state).toBeTruthy()
		expect(cookies).toContain('better-auth')

		stubSimkl({ id: 8798305, name: 'Ada Lovelace' })

		const callback = await auth.handler(new Request(`${ORIGIN}/api/auth/callback/simkl?code=test-code&state=${encodeURIComponent(state!)}`, {
			headers: { cookie: cookies },
		}))

		expect(callback.status).toBeGreaterThanOrEqual(300)
		expect(callback.status).toBeLessThan(400)
		expect(setCookies(callback)).toMatch(/better-auth/)

		const session = await auth.api.getSession({
			headers: new Headers({ cookie: `${cookies}; ${setCookies(callback)}` }),
		})

		expect(session?.user).toMatchObject({
			name: 'Ada Lovelace',
			simklPlan: 'pro',
			simklJoinedAt: new Date('2015-04-01T15:47:07Z'),
			// The avatar is already an absolute URL with its size suffix and query, so it must survive as-is
			image: 'https://simkl.in/avatars/87/8798305_100.jpg?1785154082',
		})
	})

	it('rejects a callback whose state was not issued by this browser', async () => {
		const { auth } = await import('#lib/auth.js')

		const callback = await auth.handler(new Request(`${ORIGIN}/api/auth/callback/simkl?code=test-code&state=forged`))

		// Browser callbacks report the failure as a redirect to the error route, which must carry a state error
		expect(callback.status).toBe(302)
		expect(callback.headers.get('location')).toContain('error=')
		expect(callback.headers.get('location')).toContain('state')
	})
})
