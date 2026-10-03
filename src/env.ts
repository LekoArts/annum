import { defineEnvVars } from '@sveltejs/kit/env'

export const variables = defineEnvVars({
	PUBLIC_BETTER_AUTH_URL: { public: true, static: true },
	PRIVATE_BETTER_AUTH_SECRET: { static: true },
	PRIVATE_TRAKT_CLIENT_ID: { static: true },
	PRIVATE_TRAKT_CLIENT_SECRET: { static: true },
	PRIVATE_TMDB_API_KEY: { static: true },
})
