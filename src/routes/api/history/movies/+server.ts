import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { TRAKT_BASE_URL } from '$lib/constants'
import { normalizeItem } from '$lib/utils'
import { traktHistoryUrl } from '$lib/utils/trakt'
import type { Movie, NormalizedItemResponse, TraktHistoryMovieItem } from '$lib/types'
import { TRAKT_FETCH_DEFAULTS } from '$lib/server/constants'

async function fetchData(customFetch: typeof fetch, m: TraktHistoryMovieItem): Promise<Movie | null> {
	const movie = normalizeItem(m) as NormalizedItemResponse

	if (!movie.tmdb_id) {
		console.warn(`No TMDB ID found for movie "${movie.title}" (TMDB ID: ${movie.tmdb_id})`)

		return null
	}

	const queryParams = new URLSearchParams({
		id: movie.tmdb_id.toString(),
		type: 'movies',
		title: movie.title,
	}).toString()

	return await customFetch(`/api/tmdb-image?${queryParams}`).then(res => {
		if (!res.ok) {
			console.warn(`No TMDB ID found for movie "${movie.title}" (TMDB ID: ${movie.tmdb_id})`)

			return null
		}

		return res.json()
	}).then(tmdb => {
		return {
			...movie,
			images: tmdb,
		}
	})
}

export const GET: RequestHandler = async ({ locals, url, fetch }) => {
	const session = await locals.getSession()

	if (!session?.user) {
		error(401, 'You must sign in to access this route.')
	}

	const page = url.searchParams.get('page') || '1'
	const limit = url.searchParams.get('limit') || '12'
	const start_at = url.searchParams.get('start_at') as string
	const end_at = url.searchParams.get('end_at') as string

	const queryParams = new URLSearchParams({
		start_at,
		end_at,
		limit,
		page,
	}).toString()

	try {
		const res = await fetch(`${TRAKT_BASE_URL}${traktHistoryUrl(session.user.id, 'movies')}?${queryParams}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok) {
			throw new Error(`Response not OK: ${res.status}`)
		}

		const pageCount = res.headers.get('x-pagination-page-count') as string
		const pageLimit = res.headers.get('x-pagination-limit') as string
		const itemCount = res.headers.get('x-pagination-item-count') as string

		const rawMovies = await res.json() as Array<TraktHistoryMovieItem>
		const moviesPromises = await Promise.allSettled(rawMovies.map(m => fetchData(fetch, m)))

		const movies = moviesPromises.map(p => {
			if (p.status === 'fulfilled') {
				return p.value
			}
		}).filter(Boolean) as Array<Movie>

		return json({
			page,
			total_pages: pageCount,
			page_limit: pageLimit,
			item_count: itemCount,
			movies,
		})
	} catch (e) {
		error(404, `Failed to fetch Trakt history for user: ${session.user.id}. Error: ${e}`)
	}
}