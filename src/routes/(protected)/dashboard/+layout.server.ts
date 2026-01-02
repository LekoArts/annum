import type { TraktStats } from '$lib/types'
import type { LayoutServerLoad } from './$types'
import { DEFAULT_CACHE_HEADER } from '$const'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ locals, fetch, setHeaders }) => {
	const user = locals.user

	if (!user)
		error(401, 'You must sign in to access this route.')

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	const statsRes = await fetch(`/api/user-stats/${user.slug}`)
	const { stats } = await statsRes.json() as { stats: TraktStats }

	return {
		stats,
	}
}
