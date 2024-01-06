import type { PageServerLoad } from './$types'

function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1)
}

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
