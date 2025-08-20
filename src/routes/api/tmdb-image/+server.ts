import type { TmdbItemDetails, TraktMediaType } from '$lib/types'
import type { RequestHandler } from './$types'
import { TMDB_FETCH_DEFAULTS } from '$const'
import { TMDB_QUERY_DEFAULTS } from '$lib/server/const'
import { traktTmdbMediaMap } from '$lib/utils'
import { tmdbImageUrlsWithDimensions, tmdbItemDetailsUrl } from '$lib/utils/tmdb'
import { error, json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, locals, fetch, setHeaders }) => {
	const session = await locals.auth()

	if (!session?.user)
		error(401, 'You must sign in to access this route.')

	const id = url.searchParams.get('id')
	const type = url.searchParams.get('type') as TraktMediaType | null
	const title = url.searchParams.get('title')
	const lang = url.searchParams.get('lang')

	if (!id || !type || !title)
		error(400, 'Missing required query params')

	setHeaders({
		'cache-control': 'max-age=31536000',
	})

	try {
		let additionalQueryParams = ''
		if (lang)
			additionalQueryParams = `&append_to_response=images&include_image_language=${lang}`

		const res = await fetch(`${tmdbItemDetailsUrl(type, id)}?${TMDB_QUERY_DEFAULTS}${additionalQueryParams}`, TMDB_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const meta = await res.json() as TmdbItemDetails

		if (!meta.poster_path)
			throw new Error('No poster found')

		let poster_path = meta.poster_path

		// If an additional language was requested (because the user set a different language than English in the settings), the meta will have the "images" key on the response. If there are images in the language, use the first one
		if (meta.images?.posters?.length) {
			const topRatedLocalizedImg = meta.images.posters[0]
			poster_path = topRatedLocalizedImg.file_path
		}

		const images = tmdbImageUrlsWithDimensions(poster_path)

		return json({
			...images,
		})
	}
	catch (e) {
		error(404, `Failed to fetch TMDB image for "${title}" (TMDB ID: ${id}, Type: ${traktTmdbMediaMap[type]}). ${e}`)
	}
}
