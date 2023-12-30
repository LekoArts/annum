import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { TmdbItemDetail, TraktMediaType } from '$lib/types'
import { traktTmdbMediaMap } from '$lib/utils'
import { tmdbImageUrlsWithDimensions, tmdbItemDetailsUrl } from '$lib/utils/tmdb'
import { DEFAULT_CACHE_HEADER, TMDB_FETCH_DEFAULTS } from '$lib/constants'
import { TMDB_QUERY_DEFAULTS } from '$lib/server/constants'

export const GET: RequestHandler = async ({ url, locals, fetch, setHeaders }) => {
	const session = await locals.getSession()

	if (!session?.user)
		error(401, 'You must sign in to access this route.')

	const id = url.searchParams.get('id')
	const type = url.searchParams.get('type') as TraktMediaType | null
	const title = url.searchParams.get('title')

	if (!id || !type || !title)
		error(400, 'Missing required query params')

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	try {
		const res = await fetch(`${tmdbItemDetailsUrl(type, id)}?${TMDB_QUERY_DEFAULTS}`, TMDB_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const meta = await res.json() as TmdbItemDetail

		if (!meta.poster_path)
			throw new Error('No poster path found')

		const images = tmdbImageUrlsWithDimensions(meta.poster_path)

		return json({
			...images,
		})
	}
	catch (e) {
		error(404, `Failed to fetch TMDB metadata for ${traktTmdbMediaMap[type]} "${title}" (TMDB ID: ${id}). Error: ${e}`)
	}
}
