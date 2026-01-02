import { getRequestEvent } from '$app/server'
import { PRIVATE_BETTER_AUTH_SECRET, PRIVATE_TRAKT_CLIENT_ID, PRIVATE_TRAKT_CLIENT_SECRET } from '$env/static/private'
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public'
import { betterAuth } from 'better-auth'
import { customSession, genericOAuth, oAuthProxy } from 'better-auth/plugins'
import { sveltekitCookies } from 'better-auth/svelte-kit'

interface TraktUser {
	username: string
	name: string
	ids: {
		slug: string
	}
	about: string
	images: {
		avatar: {
			full: string
		}
	}
}

export const auth = betterAuth({
	secret: PRIVATE_BETTER_AUTH_SECRET,
	baseURL: PUBLIC_BETTER_AUTH_URL,
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
			// Required for providers that don't provide email (like Trakt)
			allowDifferentEmails: true,
		},
		storeStateStrategy: 'cookie',
		storeAccountCookie: true,
	},
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'trakt',
					clientId: PRIVATE_TRAKT_CLIENT_ID,
					clientSecret: PRIVATE_TRAKT_CLIENT_SECRET,
					authorizationUrl: 'https://trakt.tv/oauth/authorize',
					tokenUrl: 'https://api.trakt.tv/oauth/token',
					getUserInfo: async (tokens) => {
						const user = await fetch('https://api.trakt.tv/users/me?extended=full', {
							method: 'GET',
							headers: {
								'Authorization': `Bearer ${tokens.accessToken}`,
								'trakt-api-version': '2',
								'trakt-api-key': PRIVATE_TRAKT_CLIENT_ID,
							},
						}).then(res => res.json()) as TraktUser

						return {
							id: user.ids.slug,
							// Trakt does not provide user emails
							email: user.ids.slug,
							emailVerified: false,
							name: user.name || user.username,
							image: user.images.avatar.full,
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
		})
	],
})
