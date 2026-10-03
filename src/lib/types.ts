export type SimklMediaType = 'movies' | 'shows' | 'anime'

/** Watch activity in one year; `watchedAt` is the latest watch that year. */
export interface SimklWatchEntry {
	year: number
	month: string
	watchedAt: string
}

/** A normalized item - deliberately small so the whole library fits in localStorage. */
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

/** The `/sync/activities` response; `all` is the timestamp the sync stop check compares. */
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
