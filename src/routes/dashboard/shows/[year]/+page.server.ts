import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
	return {
		year: params.year,
		meta: {
			title: `Shows from ${params.year}`,
			description: `Shows from ${params.year}`,
		},
	}
}
