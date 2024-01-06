import { SvelteKitAuth } from '@auth/sveltekit'
import Trakt from '@auth/core/providers/trakt'
import { type Handle, type MaybePromise, type RequestEvent, type ResolveOptions, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { PRIVATE_AUTH_SECRET, PRIVATE_TRAKT_CLIENT_ID, PRIVATE_TRAKT_CLIENT_SECRET } from '$env/static/private'
import type { TraktProfile } from '$lib/types'

async function authorization({ event, resolve }: { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> }) {
	// Protect all routes under /dashboard
	if (event.url.pathname.startsWith('/dashboard')) {
		const session = await event.locals.getSession()
		if (!session)
			throw redirect(303, '/sign-in')
	}

	return resolve(event)
}

/**
 * First handle authentication, then authorization.
 * Each function acts as a middleware, receiving the request handle. And returning a handle which gets passed to the next function.
 */
export const handle: Handle = sequence(
	SvelteKitAuth({
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
			// @ts-expect-error - Incorrect type
			session: async ({ session, token }) => {
				if (session.user) {
					const { id, username } = token
					session.user.id = id
					session.user.username = username
				}

				return session
			},
		},
	}),
	authorization,
)
