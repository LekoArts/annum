import type {
	SimklActivities,
	SimklActivityDomain,
	SimklAllItemsResponse,
	SimklMediaItem,
	SimklMediaType,
	SimklRawItem,
	SimklSyncResponse,
} from '#lib/types.js'
import type { RequestHandler } from './$types'
import { fetchSimklActivities, fetchSimklAllItems, fetchSimklDelta, fetchSimklIdSets, getSimklAccessToken, SimklError } from '#lib/server/simkl.js'
import { collectSimklIds, normalizeSimklItem, SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'
import { error } from '@sveltejs/kit'

function parseActivities(value: string | null): SimklActivities | null {
	if (!value)
		return null

	try {
		const parsed: unknown = JSON.parse(value)

		if (parsed && typeof parsed === 'object')
			return parsed as SimklActivities
	}
	catch {
		// Malformed client state is treated as "no saved activities" and re-seeded with a full pull
	}

	return null
}

function activitiesAll(activities: SimklActivities | null | undefined): string | null {
	return activities?.all ?? null
}

function domainActivities(activities: SimklActivities | null, type: SimklMediaType): SimklActivityDomain | undefined {
	if (!activities)
		return undefined

	switch (type) {
		case 'movies': return activities.movies
		case 'shows': return activities.tv_shows
		case 'anime': return activities.anime
	}
}

/**
 * `date_from` never surfaces removals, so the only cue is a moved `removed_from_list` timestamp.
 */
function removalMoved(previous: SimklActivities | null, current: SimklActivities): boolean {
	return SIMKL_MEDIA_TYPES.some(type =>
		(domainActivities(previous, type)?.removed_from_list ?? null) !== (domainActivities(current, type)?.removed_from_list ?? null),
	)
}

// The full pull drops never-watched (list-only) entries; the delta keeps them so the client can remove a
// cached item that was un-watched.
function normalizeItems(items: Array<SimklRawItem> | undefined, { dropUnwatched }: { dropUnwatched: boolean }): Array<SimklMediaItem> {
	return (items ?? [])
		.map(normalizeSimklItem)
		.filter((item): item is SimklMediaItem => item !== null)
		.filter(item => !dropUnwatched || item.watched.length > 0)
}

export const GET: RequestHandler = async (event) => {
	const { url } = event

	if (!event.locals.user)
		error(401, 'You must sign in to access this route.')

	const token = await getSimklAccessToken(event)

	if (!token)
		error(401, 'Your Simkl session has expired. Please sign in again.')

	try {
		const saved = parseActivities(url.searchParams.get('activities'))
		const savedAll = saved ? activitiesAll(saved) : null

		// Without a saved `activities.all` there is no delta anchor, so this is the first sync
		if (!saved || savedAll === null) {
			// Simkl asks for the three types sequentially, never in parallel
			const movies = await fetchSimklAllItems({ type: 'movies', token })
			const shows = await fetchSimklAllItems({ type: 'shows', token })
			const anime = await fetchSimklAllItems({ type: 'anime', token })
			// The bootstrap timestamp is read *after* the pulls, so nothing that lands mid-pull is missed
			const activities = await fetchSimklActivities(token)

			return Response.json({
				status: 'full',
				activities,
				movies: normalizeItems(movies.movies, { dropUnwatched: true }),
				shows: normalizeItems(shows.shows, { dropUnwatched: true }),
				anime: normalizeItems(anime.anime, { dropUnwatched: true }),
			} satisfies SimklSyncResponse)
		}

		const activities = await fetchSimklActivities(token)

		// Nothing moved - skip `/sync/all-items` entirely
		if (activitiesAll(activities) === savedAll) {
			return Response.json({
				status: 'up-to-date',
				activities,
				movies: [],
				shows: [],
				anime: [],
			} satisfies SimklSyncResponse)
		}

		const delta = await fetchSimklDelta({ dateFrom: savedAll, token })
		const response: SimklSyncResponse = {
			status: 'delta',
			activities,
			movies: normalizeItems(delta.movies, { dropUnwatched: false }),
			shows: normalizeItems(delta.shows, { dropUnwatched: false }),
			anime: normalizeItems(delta.anime, { dropUnwatched: false }),
		}

		// A deletion leaves no trace in the delta, so diff the full ID list instead
		if (removalMoved(saved, activities)) {
			const idSets: SimklAllItemsResponse = await fetchSimklIdSets(token)

			response.currentIds = {
				movies: collectSimklIds(idSets, 'movies'),
				shows: collectSimklIds(idSets, 'shows'),
				anime: collectSimklIds(idSets, 'anime'),
			}
		}

		return Response.json(response)
	}
	catch (e) {
		if (e instanceof SimklError)
			error(e.status === 429 ? 429 : 502, e.message)

		// The response carries only the reason; the log keeps the whole error for diagnosis
		console.warn('[simkl] sync failed unexpectedly', e)
		error(502, `Failed to sync your Simkl library. ${e instanceof Error ? e.message : String(e)}`)
	}
}
