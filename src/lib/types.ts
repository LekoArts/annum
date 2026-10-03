import type { LANGUAGES, TMDB_POSTER_SIZES } from '#const'

export type TmdbPosterSize = keyof typeof TMDB_POSTER_SIZES
export type Language = typeof LANGUAGES[number]['id']
export type TraktMediaType = 'movies' | 'shows'

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
			1: number
			2: number
			3: number
			4: number
			5: number
			6: number
			7: number
			8: number
			9: number
			10: number
		}
	}
}

interface ItemMeta {
	title: string
	year: number
	ids: {
		trakt: number
		slug: string
		imdb?: string
		tmdb?: number
	}
}

interface EpisodeMeta {
	season: number
	number: number
	title: string
	ids: {
		trakt: number
		tvdb?: number
		imdb?: string
		tmdb?: number
		tvrage?: number
	}
}

interface TraktWatchedItemBase {
	plays: number
	last_watched_at: string
	last_updated_at: string
}

export interface TraktWatchedMovieItem extends TraktWatchedItemBase {
	movie: ItemMeta
}

export interface TraktWatchedShowItem extends TraktWatchedItemBase {
	show: ItemMeta
}

export type TraktWatchedItem = TraktWatchedMovieItem | TraktWatchedShowItem

interface TraktHistoryItemBase {
	id: number
	watched_at: string
	action: 'watch' | 'scrobble' | 'checkin'
}

export interface TraktHistoryMovieItem extends TraktHistoryItemBase {
	type: 'movie'
	movie: ItemMeta
}

export interface TraktHistoryEpisodeItem extends TraktHistoryItemBase {
	type: 'episode'
	episode: EpisodeMeta
	show: ItemMeta
}

export type TraktHistoryItem = TraktHistoryMovieItem | TraktHistoryEpisodeItem

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
	last_wathed_at_month: string
	title: string
	release_year: number
	trakt_id: number
	tmdb_id?: number
	plays?: number
}

export type TmdbImageUrlsWithDimensions = Record<TmdbPosterSize, { url: string, width: number, height: number }>

export interface Item extends NormalizedItemResponse {
	images: TmdbImageUrlsWithDimensions
}

export interface ApiHistoryResponse {
	page: string
	total_pages: string
	page_limit: string
	item_count: string
	items: Array<Item>
}

export interface StateChanger {
	/**
	 * Inform the component that this loading has been successful. The infinite event will be fired again if the first screen was not be
	 * filled up, otherwise, the component will hide the loading animation and continue to listen to scroll events.
	 */
	loaded: () => void

	/**
	 * Inform the component that all the data has been loaded successfully. If the InfiniteEvent.details.loaded method has not
	 * been called before this, the content of the noResults slot will be
	 * displayed, otherwise, the content of the noMore slot will be displayed.
	 */
	complete: () => void

	/**
	 * Inform the component that loading the data has failed. The content of the error slot will be displayed.
	 */
	error: () => void

	/**
	 * Reset the component. Same as changing the identifier property.
	 */
	reset: () => void
}

export type SimklMediaType = 'movies' | 'shows' | 'anime'

/**
 * Watch activity for a single year. `watchedAt` is the latest watch in that year.
 */
export interface SimklWatchEntry {
	year: number
	month: string
	watchedAt: string
}

/**
 * A normalized Simkl library item - deliberately small so the whole library fits in localStorage.
 */
export interface SimklMediaItem {
	simklId: number
	slug: string | null
	title: string
	year: number | null
	poster: string | null
	watched: Array<SimklWatchEntry>
}

export interface SimklLibrary {
	movies: Array<SimklMediaItem>
	shows: Array<SimklMediaItem>
	anime: Array<SimklMediaItem>
}

export interface SimklActivityDomain {
	all?: string | null
	removed_from_list?: string | null
}

/**
 * The `/sync/activities` response. `all` is the top-level timestamp used for the sync stop check.
 */
export type SimklActivities = Record<string, unknown> & {
	all?: string | null
	settings?: SimklActivityDomain
	tv_shows?: SimklActivityDomain
	anime?: SimklActivityDomain
	movies?: SimklActivityDomain
}

export interface SimklSyncResponse {
	status: 'up-to-date' | 'delta' | 'full'
	activities: SimklActivities
	/** `delta`: only the changed items; `full`: the entire type. */
	movies: Array<SimklMediaItem>
	shows: Array<SimklMediaItem>
	anime: Array<SimklMediaItem>
	/** Present when any domain's `removed_from_list` moved; a missing type key means an empty set. */
	currentIds?: Partial<Record<SimklMediaType, Array<number>>>
}

// Raw Simkl API shapes - only the fields the normalizer reads

export interface SimklMediaIds {
	simkl?: number
	simkl_id?: number
	slug?: string
}

export interface SimklMediaBlock {
	title?: string
	poster?: string | null
	year?: number | null
	anime_type?: string | null
	ids?: SimklMediaIds
}

export interface SimklEpisode {
	number?: number
	watched_at?: string | null
}

export interface SimklSeason {
	number?: number
	episodes?: Array<SimklEpisode>
}

export interface SimklRawItem {
	last_watched_at?: string | null
	status?: string
	anime_type?: string | null
	/** Present for movies. */
	movie?: SimklMediaBlock
	/** Present for shows and anime (anime additionally carries `anime_type`). */
	show?: SimklMediaBlock
	/** Present when `extended=simkl_ids_only` returns bare ID entries. */
	ids?: SimklMediaIds
	seasons?: Array<SimklSeason>
}

export interface SimklAllItemsResponse {
	shows?: Array<SimklRawItem>
	movies?: Array<SimklRawItem>
	anime?: Array<SimklRawItem>
}
