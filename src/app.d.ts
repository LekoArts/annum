import type { Session, User } from 'better-auth/types'

// Extend BetterAuth User type to include username
interface CustomUser extends User {
	username: string
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null
			user: CustomUser | null
		}
		interface PageData {
			year?: string
			session?: {
				session: Session
				user: CustomUser
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
