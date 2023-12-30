import type { TraktHistoryMovieItem, TraktWatchedShowsItem } from './types'

export const traktTmdbMediaMap = {
	movies: 'movie',
	shows: 'tv'
} as const

export function normalizeItem(item: TraktHistoryMovieItem | TraktWatchedShowsItem) {
	const result = {} as {
		title: string
		release_year: number
		tmdb_id?: number
		plays?: number
		last_watched_at: string
		last_watched_at_year: number
	}

	if ('movie' in item) {
		result.title = item.movie.title
		result.release_year = item.movie.year
		result.tmdb_id = item.movie.ids?.tmdb
		result.last_watched_at = item.watched_at
		result.last_watched_at_year = new Date(item.watched_at).getFullYear()
	}

	if ('show' in item) {
		result.title = item.show.title
		result.release_year = item.show.year
		result.tmdb_id = item.show.ids?.tmdb
		result.last_watched_at = item.last_watched_at
		result.last_watched_at_year = new Date(item.last_watched_at).getFullYear()
		result.plays = item.plays
	}

	return {
		...result,
	}
}

export function chunks<T>(array: Array<T>, n: number): Array<Array<T>> {
	const result = []
	for (let i = 0; i < array.length; i += n) {
		result.push(array.slice(i, i + n))
	}
	return result
}

export function getStartAndEndOfYear(y: number | string) {
	const year = typeof y === 'string' ? parseInt(y) : y
	return {
		start: new Date(year, 0, 1).toISOString(),
		end: new Date(year, 11, 31).toISOString(),
	}
}
