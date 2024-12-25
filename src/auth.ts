import type { DefaultSession } from '@auth/sveltekit'
import { SvelteKitAuth } from '@auth/sveltekit'
import Trakt from '@auth/sveltekit/providers/trakt'
import { PRIVATE_AUTH_SECRET, PRIVATE_TRAKT_CLIENT_ID, PRIVATE_TRAKT_CLIENT_SECRET } from '$env/static/private'
import type { TraktProfile } from '$lib/types'

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			id: string
			name: string
			email?: string | null
			image: string
			username: string
		} & DefaultSession['user']
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		id: string
		username: string
	}
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Trakt({ clientId: PRIVATE_TRAKT_CLIENT_ID, clientSecret: PRIVATE_TRAKT_CLIENT_SECRET })],
	secret: PRIVATE_AUTH_SECRET,
	trustHost: true,
	callbacks: {
		jwt: async ({ token, profile }) => {
			if (profile) {
				const { ids, username } = profile as unknown as TraktProfile
				token.id = ids.slug
				token.username = username
			}

			return token
		},
		session: async ({ session, token }) => {
			if (session.user) {
				const { id, username } = token
				session.user.id = id
				session.user.username = username
			}

			return session
		},
	},
})
