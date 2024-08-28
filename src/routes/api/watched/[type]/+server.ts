import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { DEFAULT_CACHE_HEADER, TRAKT_BASE_URL } from '$const'
import { filterForYear, normalizeItem } from '$lib/utils'
import { traktWatchedUrl } from '$lib/utils/trakt'
import type { TraktMediaType, TraktWatchedItem } from '$lib/types'
import { TRAKT_FETCH_DEFAULTS } from '$lib/server/const'

export const GET: RequestHandler = async ({ url, locals, fetch, setHeaders, params }) => {
	const session = await locals.auth()

	if (!session?.user)
		error(401, 'You must sign in to access this route.')

	const id = url.searchParams.get('id') as string
	const year = url.searchParams.get('year') as string
	const type = params.type as TraktMediaType

	setHeaders({
		...DEFAULT_CACHE_HEADER,
	})

	try {
		const res = await fetch(`${TRAKT_BASE_URL}${traktWatchedUrl(id, type)}`, TRAKT_FETCH_DEFAULTS)

		if (!res.ok)
			throw new Error(`Response not OK: ${res.status}`)

		const rawRes = await res.json() as Array<TraktWatchedItem>
		const normalized = rawRes.map(normalizeItem).filter(i => filterForYear(i, year))

		return json({
			result: normalized,
		})
	}
	catch (e) {
		error(404, `Failed to fetch Trakt watched ${type} for user: ${id}. ${e}`)
	}
}
