import type { Session, User } from 'better-auth/types'

declare global {
	// Netlify build-time environment variable (injected by Vite)
	const __DEPLOY_PRIME_URL__: string

	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null
			user: User | null
		}
		interface PageData {
			year?: string
			session?: {
				session: Session
				user: User
			} | null
			meta?: {
				title: string
				description: string
			}
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
