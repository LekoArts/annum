import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Item, Language, NormalizedItemResponse, TmdbImageUrlsWithDimensions, TraktHistoryItem, TraktMediaType } from '$lib/types'
import { DEFAULT_CACHE_HEADER, PAGINATION_LIMIT, TRAKT_BASE_URL } from '$const'
import { TRAKT_FETCH_DEFAULTS } from '$lib/server/const'
import { normalizeItem } from '$lib/utils'
import { filterUniqueShowsFromHistory, traktHistoryUrl } from '$lib/utils/trakt'

async function fetchData(customFetch: typeof fetch, item: NormalizedItemResponse, lang: Language, type: TraktMediaType): Promise<Item | null> {
	if (!item.tmdb_id) {
		console.warn(`No TMDB ID found for movie "${item.title}" (TMDB ID: ${item.tmdb_id})`)

		return null
	}

	const queryParams = new URLSearchParams({
		id: item.tmdb_id.toString(),
		type,
		title: item.title,
		lang,
	}).toString()

	return await customFetch(`/api/tmdb-image?${queryParams}`).then((res) => {
		if (!res.ok) {
			console.warn(`No TMDB ID found for movie "${item.title}" (TMDB ID: ${item.tmdb_id})`)

			return null
		}

		return res.json() as Promise<TmdbImageUrlsWithDimensions | null>
	}).then((tmdb) => {
		if (!tmdb)
			return null

		return {
			...item,
			images: tmdb,
		}
	})
}

export const GET: RequestHandler = async ({ locals, url, fetch, setHeaders, params }) => {
	const session = await locals.auth()

	if (!session?.user)
		error(401, 'You must sign in to access this route.')

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	const type = params.type as TraktMediaType
	const defaultLimit = type === 'shows' ? '100' : PAGINATION_LIMIT.toString()

	const page = url.searchParams.get('page') || '1'
	const limit = url.searchParams.get('limit') || defaultLimit
	const start_at = url.searchParams.get('start_at') as string
	const end_at = url.searchParams.get('end_at') as string
	const lang = url.searchParams.get('lang') as Language

	const queryParams = new URLSearchParams({
		start_at,
		end_at,
		limit,
		page,
	}).toString()

	try {
		const res = await fetch(`${TRAKT_BASE_URL}${traktHistoryUrl(session.user.id, type)}?${queryParams}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const pageCount = res.headers.get('x-pagination-page-count') as string
		const pageLimit = res.headers.get('x-pagination-limit') as string
		const itemCount = res.headers.get('x-pagination-item-count') as string

		const rawItems = await res.json() as Array<TraktHistoryItem>
		const normalizedItems = rawItems.map(normalizeItem)
		const uniqueItems = filterUniqueShowsFromHistory(normalizedItems)

		const itemsPromises = await Promise.allSettled(uniqueItems.map(i => fetchData(fetch, i, lang, type)))

		const items = itemsPromises.map((p) => {
			if (p.status === 'fulfilled')
				return p.value

			return null
		}).filter(Boolean) as Array<Item>

		return json({
			page,
			total_pages: pageCount,
			page_limit: pageLimit,
			item_count: itemCount,
			items,
		})
	}
	catch (e) {
		error(404, `Failed to fetch Trakt history for user: ${session.user.id}. ${e}`)
	}
}
