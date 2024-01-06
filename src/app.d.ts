// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import('@auth/core/types').Session
		}
		interface PageData {
			year?: string
			meta?: {
				title: string
				description: string
			}
			session: import('@auth/core/types').Session
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string
			name: string
			email: null
			image: string
			username: string
		}
	}
}

export {}
