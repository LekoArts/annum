import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { DEFAULT_CACHE_HEADER, PAGINATION_LIMIT, TRAKT_BASE_URL } from '$const'
import { chunks, filterForYear, normalizeItem } from '$lib/utils'
import { traktWatchedUrl } from '$lib/utils/trakt'
import type { TraktWatchedShowsItem } from '$lib/types'
import { TRAKT_FETCH_DEFAULTS } from '$lib/server/const'

export const GET: RequestHandler = async ({ url, locals, fetch, setHeaders }) => {
	const session = await locals.getSession()

	if (!session?.user)
		error(401, 'You must sign in to access this route.')

	const id = url.searchParams.get('id') as string
	const year = url.searchParams.get('year') as string

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	try {
		const res = await fetch(`${TRAKT_BASE_URL}${traktWatchedUrl(id, 'shows')}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const rawShows = await res.json() as Array<TraktWatchedShowsItem>
		const normalizedShows = rawShows.map(normalizeItem).filter(i => filterForYear(i, year))
		const showsChunks = chunks(normalizedShows, PAGINATION_LIMIT)

		return json({
			total_chunks: showsChunks.length,
			chunks: showsChunks,
		})
	}
	catch (e) {
		error(404, `Failed to fetch Trakt watched shows for user: ${id}. ${e}`)
	}
}
