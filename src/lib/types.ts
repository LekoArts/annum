import type { TMDB_POSTER_SIZES } from './constants'

export type TmdbPosterSize = keyof typeof TMDB_POSTER_SIZES

export interface TraktProfile {
	username: string
	private: boolean
	name: string
	vip: boolean
	vip_ep: boolean
	ids: {
		slug: string
	}
	joined_at: string
	location: string
	about: string
	gender: string
	age?: number
	images: {
		avatar: {
			full: string
		}
	}
}

export interface TraktStats {
	movies: {
		plays: number
		watched: number
		minutes: number
		collected: number
		ratings: number
		comments: number
	}
	shows: {
		watched: number
		collected: number
		ratings: number
		comments: number
	}
	seasons: {
		ratings: number
		comments: number
	}
	episodes: {
		plays: number
		watched: number
		minutes: number
		collected: number
		ratings: number
		comments: number
	}
	network: {
		friends: number
		followers: number
		following: number
	}
	ratings: {
		total: number
		distribution: {
			'1': number
			'2': number
			'3': number
			'4': number
			'5': number
			'6': number
			'7': number
			'8': number
			'9': number
			'10': number
		}
	}
}

type HistoryItemDetails = {
	title: string
	year: number
	ids: {
		trakt: number
		slug: string
		imdb?: string
		tmdb?: number
	}
}

export type TraktHistoryMovieItem = {
	plays: number
	watched_at: string
	type: 'movie'
	movie: HistoryItemDetails
}

export interface TraktWatchedShowsItem {
	plays: number
	last_watched_at: string
	last_updated_at: string
	reset_at: string
	show: HistoryItemDetails
}

export type TraktMediaType = 'movies' | 'shows'

export type TraktHistoryType = 'movies' | 'episodes'

export interface TmdbItemDetail {
	id: number
	poster_path?: string
	backdrop_path?: string
}

export interface NormalizedItemResponse {
	last_watched_at: string
	last_watched_at_year: number
	title: string
	release_year: number
	tmdb_id: number | undefined
	plays: number
}

export type TmdbImageUrlsWithDimensions = Record<TmdbPosterSize, { url: string, width: number, height: number }>

export type WithTmdbImages<T> = T & {
	images: TmdbImageUrlsWithDimensions
}

export interface ApiHistoryMoviesResponse {
	page: string
	total_pages: string
	page_limit: string
	item_count: string
	movies: Array<Movie>
}

export type Movie = WithTmdbImages<NormalizedItemResponse>