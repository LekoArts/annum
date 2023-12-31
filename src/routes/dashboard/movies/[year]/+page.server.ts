import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
	return {
		year: params.year,
		meta: {
			title: `Movies from ${params.year}`,
			description: `Movies from ${params.year}`,
		},
	}
}
