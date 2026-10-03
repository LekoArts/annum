import { defineEnvVars } from '@sveltejs/kit/env'

export const variables = defineEnvVars({
	PUBLIC_BETTER_AUTH_URL: { public: true, static: true },
	PUBLIC_SIMKL_CLIENT_ID: { public: true, static: true },
	PRIVATE_BETTER_AUTH_SECRET: { static: true },
})
