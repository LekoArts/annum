import type { PageServerLoad } from './$types';
import type { TraktStats } from '$lib/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const session = await locals.getSession()
	const id = session!.user.id

	const statsRes = await fetch(`/api/user-stats/${id}`)
	const { stats } = await statsRes.json() as { stats: TraktStats }

	return {
		stats,
	}
}