import type { PageLoad } from './$types'
import { capitalize } from '#lib/utils/index.js'
import { isSimklMediaType } from '#lib/utils/simkl.js'
import { error } from '@sveltejs/kit'

/**
 * Universal rather than `+page.server.ts`: the dashboard renders on the client (`ssr = false`), so a
 * server load would cost a function round-trip on every year navigation for data the browser can
 * compute itself. Nothing here needs the server - `Meta.svelte` reads `page.data.meta` either way.
 */
export const load: PageLoad = ({ params }) => {
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
