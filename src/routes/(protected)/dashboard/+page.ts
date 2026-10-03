import type { PageLoad } from './$types'
import { CURRENT_YEAR } from '#const'
import { library } from '#lib/store/library.js'
import { describeSelection, resolveSelectedTypes, resolveYear } from '#lib/utils/dashboard.js'
import { availableYears } from '#lib/utils/simkl.js'
import { get } from 'svelte/store'

/**
 * Universal rather than `+page.server.ts`: the dashboard renders on the client (`ssr = false`), so a
 * server load would cost a function round-trip on every query change for state the browser can compute
 * itself. Reading `?year=`/`?types=` through the helpers' `searchParams.get()` calls keeps SvelteKit's
 * per-parameter tracking intact, so changing one of them re-runs this load on the client.
 */
export const load: PageLoad = ({ url }) => {
	const types = resolveSelectedTypes(url.searchParams)
	const years = availableYears(get(library), CURRENT_YEAR)
	const year = resolveYear(url.searchParams, years, CURRENT_YEAR)
	const selection = describeSelection(types)

	return {
		types,
		year,
		meta: {
			title: `${selection} from ${year}`,
			description: `${selection} from ${year} in a poster grid.`,
		},
	}
}
