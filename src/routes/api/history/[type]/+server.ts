import type { Item, Language, NormalizedItemResponse, TmdbImageUrlsWithDimensions, TraktHistoryItem, TraktMediaType } from '$lib/types'
import type { RequestHandler } from './$types'
import { DEFAULT_CACHE_HEADER, PAGINATION_LIMIT, TRAKT_BASE_URL } from '$const'
import { TRAKT_FETCH_DEFAULTS } from '$lib/server/const'
import { normalizeItem } from '$lib/utils'
import { filterUniqueItemsFromHistory, traktHistoryUrl } from '$lib/utils/trakt'
import { error, json } from '@sveltejs/kit'

async function fetchData(customFetch: typeof fetch, item: NormalizedItemResponse, lang: Language, type: TraktMediaType): Promise<Item | null> {
	if (!item.tmdb_id) {
		console.warn(`No TMDB ID found for ${type} "${item.title}" (TMDB ID: ${item.tmdb_id})`)

		return null
	}

	const queryParams = new URLSearchParams({
		id: item.tmdb_id.toString(),
		type,
		title: item.title,
		lang,
	}).toString()

	return await customFetch(`/api/tmdb-image?${queryParams}`).then(async (res) => {
		if (!res.ok) {
			const errorBody = await res.json().catch(() => null)
			const errorMsg = errorBody?.message || `Failed to fetch TMDB image for "${item.title}" (TMDB ID: ${item.tmdb_id}, Type: ${type})`

			console.warn(errorMsg)

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
	// Session is already populated in hooks.server.ts
	const user = locals.user

	if (!user)
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
		const res = await fetch(`${TRAKT_BASE_URL}${traktHistoryUrl(user.id, type)}?${queryParams}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const pageCount = res.headers.get('x-pagination-page-count') as string
		const pageLimit = res.headers.get('x-pagination-limit') as string
		const itemCount = res.headers.get('x-pagination-item-count') as string

		const rawItems = await res.json() as Array<TraktHistoryItem>
		const normalizedItems = rawItems.map(normalizeItem)
		const uniqueItems = filterUniqueItemsFromHistory(normalizedItems)

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
		error(404, `Failed to fetch Trakt history for user: ${user.id}. ${e}`)
	}
}
