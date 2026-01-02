import type { auth } from '$lib/../auth'
import { customSessionClient, genericOAuthClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/svelte'

export const authClient = createAuthClient({
	plugins: [
		genericOAuthClient(),
		customSessionClient<typeof auth>(),
	],
})

export const { signIn, signOut, useSession } = authClient
