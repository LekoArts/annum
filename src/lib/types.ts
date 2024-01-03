import type { LANGUAGES, TMDB_POSTER_SIZES } from '$const'

export type TmdbPosterSize = keyof typeof TMDB_POSTER_SIZES
export type Language = typeof LANGUAGES[number]['id']

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

interface HistoryItemDetails {
	title: string
	year: number
	ids: {
		trakt: number
		slug: string
		imdb?: string
		tmdb?: number
	}
}

export interface TraktHistoryMovieItem {
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

export interface TmdbImagesDetail {
	aspect_ratio: number
	height: number
	iso_639_1: string
	file_path: string
	vote_average: number
	vote_count: number
	width: number
}
export interface TmdbImagesResponse {
	backdrops: Array<TmdbImagesDetail>
	posters: Array<TmdbImagesDetail>
	logos: Array<TmdbImagesDetail>
}

export interface TmdbItemDetails {
	id: number
	poster_path?: string
	images?: TmdbImagesResponse
}

export interface NormalizedItemResponse {
	last_watched_at: string
	last_watched_at_year: number
	title: string
	release_year: number
	tmdb_id?: number
	plays?: number
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

export interface ApiWatchedShowsResponse {
	total_chunks: number
	chunks: Array<Array<NormalizedItemResponse>>
}

export type Movie = WithTmdbImages<NormalizedItemResponse>
export type Show = WithTmdbImages<NormalizedItemResponse>
