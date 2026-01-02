import type { auth } from '$lib/auth'
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public'
import { customSessionClient, genericOAuthClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/svelte'

export const authClient = createAuthClient({
	baseURL: PUBLIC_BETTER_AUTH_URL,
	plugins: [
		genericOAuthClient(),
		customSessionClient<typeof auth>(),
	],
})

export const { signIn, signOut, useSession } = authClient
