import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { traktStatsUrl } from '$lib/utils/trakt'
import { TRAKT_BASE_URL } from '$lib/constants'
import type { TraktStats } from '$lib/types'
import { TRAKT_FETCH_DEFAULTS } from '$lib/server/constants'

export const GET: RequestHandler = async ({ locals, params, fetch }) => {
	const session = await locals.getSession()

	if (!session?.user) {
		error(401, 'You must sign in to access this route.')
	}

	const { id } = params

	try {
		const res = await fetch(`${TRAKT_BASE_URL}${traktStatsUrl(id)}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok) {
			throw new Error(`Response not OK: ${res.status}`)
		}

		const stats = await res.json() as TraktStats

		return json({
			stats,
		})
	} catch (e) {    
		error(404, `Failed to fetch Trakt stats for user: ${id}. Error: ${e}`)
	}
}