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
		// interface Session {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
