import { uniqBy } from 'lodash-es'
import type { NormalizedItemResponse, TraktHistoryEpisodeItem, TraktHistoryItem, TraktMediaType } from '../types'

export function traktUserUrl(id: string) {
	return `/users/${id}`
}

export function traktWatchedUrl(id: string, type: TraktMediaType) {
	return `${traktUserUrl(id)}/watched/${type}${type === 'shows' ? '?extended=noseasons' : ''}`
}

export function traktStatsUrl(id: string) {
	return `${traktUserUrl(id)}/stats`
}

export function traktHistoryUrl(id: string, type: TraktMediaType) {
	return `${traktUserUrl(id)}/history/${type}`
}

/**
 * Filter the response of /history/shows to unique shows since the endpoint returns episodes, not only shows. The returned result only contains unique values (so no duplicated) and is ordered by the order they originally appeared in the response.
 * The order will be by the last watched episode of each show.
 */
export function filterUniqueShowsFromHistory<T extends NormalizedItemResponse>(history: Array<T>): Array<T> {
	if (!history)
		return []
	if (!Array.isArray(history))
		return []

	return uniqBy(history, 'trakt_id')
}
