import {
	PRIVATE_BETTER_AUTH_SECRET,
	PRIVATE_SIMKL_CLIENT_ID,
} from '$app/env/private'

import { PUBLIC_BETTER_AUTH_URL } from '$app/env/public'

import { getRequestEvent } from '$app/server'
import { betterAuth } from 'better-auth'
import { customSession, genericOAuth, oAuthProxy } from 'better-auth/plugins'
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
	// Stateless mode - no database required
	// This will automatically enable JWT-based sessions in cookies
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
					clientId: PRIVATE_SIMKL_CLIENT_ID,
					// Simkl's browser sign-in apps are public clients, so PKCE is
					// mandatory and no client secret is configured.
					pkce: true,
					issuer: 'https://simkl.com',
					requireIssuerValidation: true,
					authorizationUrl: 'https://simkl.com/oauth2/authorize',
					tokenUrl: 'https://api.simkl.com/oauth2/token',
					scopes: ['media:read'],
					authorizationHeaders: {
						'User-Agent': 'annum/1.0',
					},
					getUserInfo: async (tokens) => {
						const queryParams = new URLSearchParams({
							'client_id': PRIVATE_SIMKL_CLIENT_ID,
							'app-name': 'annum',
							'app-version': '1.0',
						}).toString()

						const { user, account } = await fetch(`https://api.simkl.com/users/settings?${queryParams}`, {
							method: 'GET',
							headers: {
								'Authorization': `Bearer ${tokens.accessToken}`,
								'User-Agent': 'annum/1.0',
							},
						}).then(res => res.json()) as SimklSettings

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
		customSession(async ({ session, user }) => {
			const slug = user.email
			return {
				user: {
					...user,
					slug,
				},
				session,
			}
		}),
		sveltekitCookies(getRequestEvent),
		oAuthProxy({
			productionURL: PUBLIC_BETTER_AUTH_URL,
		}),
	],
})
