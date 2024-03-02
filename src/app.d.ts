import type { Session as AuthSession } from '@auth/core/types'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface PageData {
			year?: string
			meta?: {
				title: string
				description: string
			}
		}
		interface Session extends AuthSession {
			user: {
				id: string
				name: string
				email: null
				image: string
				username: string
			}
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
