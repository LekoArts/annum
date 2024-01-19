import type { NormalizedItemResponse, TraktHistoryItem, TraktWatchedItem } from '../types'

/**
 * Translate Trakt media type to TMDB media type
 * @example Trakt: shows => TMDB: tv
 */
export const traktTmdbMediaMap = {
	movies: 'movie',
	shows: 'tv',
} as const

/**
 * Check if the item does not have the 'type' property, which means it's a TraktWatchedItem
 * @example isTraktWatchedItem({ movie: { ... }}) => true
 */
function isTraktWatchedItem(item: TraktHistoryItem | TraktWatchedItem): item is TraktWatchedItem {
	return !('type' in item)
}

/**
 * Extract the full year from a date string
 * @example lastWatchedYear('2020-01-01') => 2020
 */
export function lastWatchedYear(date: string): number {
	return new Date(date).getFullYear()
}

/**
 * Extract the month from a date string and return the name
 * @example lastWatchedMonth('2020-01-01') => 'January'
 */
export function lastWatchedMonth(date: string): string {
	return new Date(date).toLocaleString('en-US', { month: 'long' })
}

/**
 * Normalize an incoming item (either from /history or /watched endpoint) to a common format since they are slightly different in what data they hold.
 * This function's response is used on the frontend.
 * @example normalizeItem({ movie: { ... }}) => { title: '...', ... }
 */
export function normalizeItem(item: TraktHistoryItem | TraktWatchedItem): NormalizedItemResponse {
	const result = {} as NormalizedItemResponse

	if (isTraktWatchedItem(item)) {
		// /watched endpoint
		if ('movie' in item) {
			result.title = item.movie.title
			result.release_year = item.movie.year
			result.trakt_id = item.movie.ids.trakt
			result.tmdb_id = item.movie.ids?.tmdb
			result.last_watched_at = item.last_watched_at
			result.last_watched_at_year = lastWatchedYear(item.last_watched_at)
			result.last_wathed_at_month = lastWatchedMonth(item.last_watched_at)
		}

		if ('show' in item) {
			result.title = item.show.title
			result.release_year = item.show.year
			result.trakt_id = item.show.ids.trakt
			result.tmdb_id = item.show.ids?.tmdb
			result.last_watched_at = item.last_watched_at
			result.last_watched_at_year = lastWatchedYear(item.last_watched_at)
			result.last_wathed_at_month = lastWatchedMonth(item.last_watched_at)
			result.plays = item.plays
		}
	}
	else {
		// /history endpoint
		switch (item.type) {
			case 'movie': {
				result.title = item.movie.title
				result.release_year = item.movie.year
				result.trakt_id = item.movie.ids.trakt
				result.tmdb_id = item.movie.ids?.tmdb
				result.last_watched_at = item.watched_at
				result.last_watched_at_year = lastWatchedYear(item.watched_at)
				result.last_wathed_at_month = lastWatchedMonth(item.watched_at)

				break
			}
			case 'episode': {
				result.title = item.show.title
				result.release_year = item.show.year
				result.trakt_id = item.show.ids.trakt
				result.tmdb_id = item.show.ids?.tmdb
				result.last_watched_at = item.watched_at
				result.last_watched_at_year = lastWatchedYear(item.watched_at)
				result.last_wathed_at_month = lastWatchedMonth(item.watched_at)

				break
			}
		}
	}

	return result
}

/**
 * Split an array into chunks of a given size
 * @example chunks([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
 */
export function chunks<T>(array: Array<T>, number: number | string): Array<Array<T>> {
	const n = typeof number === 'string' ? Number.parseInt(number) : number
	const result = []
	for (let i = 0; i < array.length; i += n)
		result.push(array.slice(i, i + n))

	return result
}

/**
 * Given a year, return the start and end date of that year in ISO format
 * @example getStartAndEndOfYear(2023) => { start: '2022-12-31T23:00:00.000Z', end: '2023-12-30T23:00:00.000Z' }
 */
export function getStartAndEndOfYear(year: number | string) {
	const y = typeof year === 'string' ? Number.parseInt(year) : year
	return {
		start: new Date(Date.UTC(y, 0, 1)).toISOString(),
		end: new Date(Date.UTC(y, 11, 31)).toISOString(),
	}
}

/**
 * Parse the last_watched_at_year property and check if it matches the given year
 * Should be used with Array.filter()
 * @example filterForYear({ last_watched_at_year: 2020 }, 2020) => true
 * @example arr.filter(item => filterForYear(item, 2020)
 */
export function filterForYear(item: NormalizedItemResponse, year: number | string) {
	const y = typeof year === 'string' ? Number.parseInt(year) : year
	return item.last_watched_at_year === y
}

export function capitalize(str: string): string {
	return str.slice(0, 1).toUpperCase() + str.slice(1)
}
