import type { PageServerLoad } from './$types'
import { capitalize } from '$lib/utils'

export const load: PageServerLoad = ({ params }) => {
	return {
		type: params.type,
		year: params.year,
		meta: {
			title: `${capitalize(params.type)} from ${params.year}`,
			description: `${capitalize(params.type)} from ${params.year}`,
		},
	}
}
