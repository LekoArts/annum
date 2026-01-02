import type { auth } from '$lib/auth'
import { customSessionClient, genericOAuthClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/svelte'
import { browser } from "$app/environment";

export const authClient = createAuthClient({
	baseURL: browser ? window.location.origin : undefined,
	plugins: [
		genericOAuthClient(),
		customSessionClient<typeof auth>(),
	],
})

export const { signIn, signOut, useSession } = authClient
