import type { TraktStats } from '#lib/types.js'
import type { RequestHandler } from './$types'
import { DEFAULT_CACHE_HEADER, TRAKT_BASE_URL } from '#const'
import { TRAKT_FETCH_DEFAULTS } from '#lib/server/const.js'
import { traktStatsUrl } from '#lib/utils/trakt.js'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params, fetch, setHeaders }) => {
	const { id } = params

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	try {
		const res = await fetch(`${TRAKT_BASE_URL}${traktStatsUrl(id)}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const stats = await res.json() as TraktStats

		return Response.json({
			stats,
		})
	}
	catch (e) {
		error(404, `Failed to fetch Trakt stats for user: ${id}. ${e}`)
	}
}
