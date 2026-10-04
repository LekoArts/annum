import type { PageLoad } from './$types'
import { CURRENT_YEAR } from '#const'
import { describeSelection, resolveSelectedTypes, resolveYear } from '#lib/utils/dashboard.js'

// Universal, not `+page.server.ts`: the dashboard renders on the client (`ssr = false`), so a server load
// would cost a function round-trip per query change for state the browser can compute itself. Reading
// `?year=`/`?types=` through `searchParams.get()` keeps SvelteKit's per-parameter tracking intact.
export const load: PageLoad = ({ url }) => {
	const types = resolveSelectedTypes(url.searchParams)
	const year = resolveYear(url.searchParams, CURRENT_YEAR)
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
