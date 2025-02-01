import type { TraktStats } from '$lib/types'
import type { LayoutServerLoad } from './$types'
import { DEFAULT_CACHE_HEADER } from '$const'

export const load: LayoutServerLoad = async ({ locals, fetch, setHeaders }) => {
	const session = await locals.auth()
	const id = session!.user.id

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	const statsRes = await fetch(`/api/user-stats/${id}`)
	const { stats } = await statsRes.json() as { stats: TraktStats }

	return {
		stats,
	}
}
