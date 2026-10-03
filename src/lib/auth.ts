import {
	PRIVATE_BETTER_AUTH_SECRET,
} from '$app/env/private'

import { PUBLIC_BETTER_AUTH_URL, PUBLIC_SIMKL_CLIENT_ID } from '$app/env/public'

import { getRequestEvent } from '$app/server'
import { betterAuth } from 'better-auth'
import { genericOAuth, oAuthProxy } from 'better-auth/plugins'
import { sveltekitCookies } from 'better-auth/svelte-kit'

interface SimklSettings {
	user: {
		name: string
		avatar?: string
	}
	account: {
		id: number
		type: 'free' | 'pro' | 'vip'
	}
}

// Use the preview deployment URL if available, otherwise fall back to PUBLIC_BETTER_AUTH_URL
const baseURL = __DEPLOY_PRIME_URL__ || PUBLIC_BETTER_AUTH_URL

export const auth = betterAuth({
	secret: PRIVATE_BETTER_AUTH_SECRET,
	baseURL,
	trustedOrigins: [
		PUBLIC_BETTER_AUTH_URL,
		...__DEPLOY_PRIME_URL__ ? [__DEPLOY_PRIME_URL__] : [],
	],
	// Stateless: no database, so sessions are encrypted JWT cookies
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 7 * 24 * 60 * 60, // 7 days
			strategy: 'jwe', // Encrypted JWT for security
			refreshCache: true, // Enable stateless refresh
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			// Required for providers that don't provide email (like Simkl)
			allowDifferentEmails: true,
		},
		storeStateStrategy: 'cookie',
		storeAccountCookie: true,
	},
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'simkl',
					clientId: PUBLIC_SIMKL_CLIENT_ID,
					// Public client: PKCE is mandatory and no client secret exists
					pkce: true,
					authorizationUrl: 'https://simkl.com/oauth2/authorize',
					tokenUrl: 'https://api.simkl.com/oauth2/token',
					scopes: ['media:read'],
					authorizationHeaders: {
						'User-Agent': 'annum/1.0',
					},
					getUserInfo: async (tokens) => {
						const queryParams = new URLSearchParams({
							'client_id': PUBLIC_SIMKL_CLIENT_ID,
							'app-name': 'annum',
							'app-version': '1.0',
						}).toString()

						const response = await fetch(`https://api.simkl.com/users/settings?${queryParams}`, {
							method: 'GET',
							headers: {
								'Authorization': `Bearer ${tokens.accessToken}`,
								'User-Agent': 'annum/1.0',
							},
						})

						// Fail here so the status is visible instead of an opaque sign-in error
						if (!response.ok)
							throw new Error(`Simkl profile request failed with HTTP ${response.status}`)

						const { user, account } = await response.json() as SimklSettings

						return {
							id: String(account.id),
							// Simkl does not provide user emails
							email: String(account.id),
							emailVerified: false,
							name: user.name,
							image: user.avatar,
						}
					},
				},
			],
		}),
		oAuthProxy({
			productionURL: PUBLIC_BETTER_AUTH_URL,
		}),
		// The cookie integration must be last: a later `hooks.after` (the oauth proxy rewrites the
		// account cookie) would otherwise set cookies that never reach SvelteKit's cookie store.
		sveltekitCookies(getRequestEvent),
	],
})
