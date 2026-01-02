import type { auth } from '$lib/auth'
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public'
import { customSessionClient, genericOAuthClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/svelte'
import { browser } from '$app/environment'

// Use current origin in browser (supports preview deployments), fallback to PUBLIC_BETTER_AUTH_URL for SSR
const baseURL = browser ? window.location.origin : PUBLIC_BETTER_AUTH_URL

export const authClient = createAuthClient({
	baseURL,
	plugins: [
		genericOAuthClient(),
		customSessionClient<typeof auth>(),
	],
})

export const { signIn, signOut, useSession } = authClient
