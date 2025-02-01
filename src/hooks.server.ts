import type { Handle, MaybePromise, RequestEvent, ResolveOptions } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { handle as authenticationHandle } from './auth'

async function authorization({ event, resolve }: { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> }) {
	// Protect all routes under /dashboard
	if (event.url.pathname.startsWith('/dashboard')) {
		const session = await event.locals.auth()
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
	authenticationHandle,
	authorization,
)
