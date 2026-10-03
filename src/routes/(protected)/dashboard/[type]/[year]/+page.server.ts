import type { PageServerLoad } from './$types'
import { capitalize } from '#lib/utils/index.js'
import { isSimklMediaType } from '#lib/utils/simkl.js'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = ({ params }) => {
	if (!isSimklMediaType(params.type))
		error(404, `Unknown media type "${params.type}".`)

	return {
		type: params.type,
		year: params.year,
		meta: {
			title: `${capitalize(params.type)} from ${params.year}`,
			description: `${capitalize(params.type)} from ${params.year}`,
		},
	}
}
