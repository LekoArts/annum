import type { auth } from '$lib/auth'
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public'
import { customSessionClient, genericOAuthClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/svelte'

const baseURL = __DEPLOY_PRIME_URL__ || PUBLIC_BETTER_AUTH_URL

export const authClient = createAuthClient({
	baseURL,
	plugins: [
		genericOAuthClient(),
		customSessionClient<typeof auth>(),
	],
})

export const { signIn, signOut, useSession } = authClient
