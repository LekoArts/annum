import type { Handle } from '@sveltejs/kit'
import { building } from '$app/environment'
import { redirect } from '@sveltejs/kit'
import { svelteKitHandler } from 'better-auth/svelte-kit'
import { auth } from './auth'

export const handle: Handle = async ({ event, resolve }) => {
	// Populate session data in event.locals for server-side access
	const session = await auth.api.getSession({
		headers: event.request.headers,
	})

	if (session) {
		event.locals.session = session.session
		event.locals.user = session.user
	}

	// Protect all routes under /dashboard
	if (event.url.pathname.startsWith('/dashboard')) {
		if (!session)
			throw redirect(303, '/sign-in')
	}

	// Handle BetterAuth routes
	return svelteKitHandler({ event, resolve, auth, building })
}
