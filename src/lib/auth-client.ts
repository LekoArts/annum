import { PUBLIC_BETTER_AUTH_URL } from '$app/env/public'
import { createAuthClient } from 'better-auth/svelte'

const baseURL = __DEPLOY_PRIME_URL__ || PUBLIC_BETTER_AUTH_URL

export const authClient = createAuthClient({
	baseURL,
})

export const { signIn, signOut, useSession } = authClient
