import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	// Session is already populated in hooks.server.ts
	if (event.locals.session && event.locals.user) {
		return {
			session: {
				session: event.locals.session,
				user: event.locals.user,
			},
		}
	}

	return {
		session: null,
	}
}
