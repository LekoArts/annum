import { PRIVATE_AUTH_SECRET, PRIVATE_TRAKT_CLIENT_ID, PRIVATE_TRAKT_CLIENT_SECRET } from '$env/static/private'
import { betterAuth } from 'better-auth'
import { customSession, genericOAuth } from 'better-auth/plugins'

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
	secret: PRIVATE_AUTH_SECRET,
	// Stateless mode - no database required
	// This will automatically enable JWT-based sessions in cookies
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 7 * 24 * 60 * 60, // 7 days (matching Auth.js default)
			strategy: 'jwe', // Encrypted JWT for security
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			// Required for providers that don't provide email (like Trakt)
			allowDifferentEmails: true,
		},
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
							// Using username as email for account identification
							email: user.username,
							emailVerified: false,
							// Store both display name and username
							name: user.name || user.username,
							image: user.images.avatar.full,
						}
					},
				},
			],
		}),
		// Add username field to the session
		customSession(async ({ session, user }) => {
			// Extract username from email (which we set to username for Trakt)
			const username = user.email
			return {
				user: {
					...user,
					username,
				},
				session,
			}
		}),
	],
})
