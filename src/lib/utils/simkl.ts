import type {
	SimklAllItemsResponse,
	SimklLibrary,
	SimklMediaBlock,
	SimklMediaItem,
	SimklMediaType,
	SimklRawItem,
	SimklSyncResponse,
	SimklWatchEntry,
} from '#lib/types.js'

export const SIMKL_MEDIA_TYPES = ['movies', 'shows', 'anime'] as const satisfies ReadonlyArray<SimklMediaType>

/**
 * Narrow an arbitrary route param to a Simkl media type.
 * @example isSimklMediaType('shows') => true
 * @example isSimklMediaType('books') => false
 */
export function isSimklMediaType(value: string): value is SimklMediaType {
	return (SIMKL_MEDIA_TYPES as ReadonlyArray<string>).includes(value)
}

/**
 * Map a media type to its segment on simkl.com
 * @example simklItemTypeMap.shows => 'tv'
 */
export const simklItemTypeMap = {
	movies: 'movies',
	shows: 'tv',
	anime: 'anime',
} as const satisfies Record<SimklMediaType, string>

const SIMKL_ITEM_BASE_URL = 'https://simkl.com'
const SIMKL_POSTER_BASE_URL = 'https://simkl.in/posters'
const SIMKL_POSTER_FALLBACK = 'https://simkl.in/poster_no_pic.png'
const PLACEHOLDER_DATE_THRESHOLD = Date.parse('2000-01-01T00:00:00Z')

/**
 * Build the Simkl page URL for an item. The slug is not unique, so the numeric id is the stable part.
 * @example simklItemUrl('shows', 17465, 'game-of-thrones') => 'https://simkl.com/tv/17465/game-of-thrones'
 */
export function simklItemUrl(type: SimklMediaType, simklId: number, slug?: string | null): string {
	const base = `${SIMKL_ITEM_BASE_URL}/${simklItemTypeMap[type]}/${simklId}`

	return slug ? `${base}/${slug}` : base
}

/**
 * Build a poster URL for a Simkl `poster` path fragment.
 * @example simklPosterUrl('57/5742576cd8f59fcb0') => 'https://wsrv.nl/?url=https://simkl.in/posters/57/5742576cd8f59fcb0_m.webp&q=90'
 */
export function simklPosterUrl(poster: string | null | undefined, size = 'm'): string {
	if (!poster)
		return SIMKL_POSTER_FALLBACK

	return `https://wsrv.nl/?url=${SIMKL_POSTER_BASE_URL}/${poster}_${size}.webp&q=90`
}

/**
 * Simkl uses timestamps before 2000-01-01 (e.g. `1970-01-01T00:00:01Z`) to mean "watched, date unknown".
 * Missing and unparseable values count as unknown too.
 */
export function isPlaceholderDate(value: string | null | undefined): boolean {
	if (!value)
		return true

	const time = Date.parse(value)

	return Number.isNaN(time) || time < PLACEHOLDER_DATE_THRESHOLD
}

function watchedYear(iso: string): number {
	return new Date(iso).getUTCFullYear()
}

function watchedMonth(iso: string): string {
	return new Date(iso).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
}

/**
 * Pick the ID fields off an all-items entry. Full entries wrap them in a `movie`/`show` block,
 * while `extended=simkl_ids_only` may return a bare object.
 */
function entryMedia(item: SimklRawItem): SimklMediaBlock {
	return item.movie ?? item.show ?? item
}

/**
 * Collect the numeric Simkl IDs of a type from an `/sync/all-items` response.
 * Used for the `extended=simkl_ids_only` deletion diff.
 */
export function collectSimklIds(response: SimklAllItemsResponse, type: SimklMediaType): Array<number> {
	return (response[type] ?? [])
		.map(item => entryMedia(item).ids)
		.map(ids => ids?.simkl_id ?? ids?.simkl)
		.filter((id): id is number => typeof id === 'number')
}

/**
 * Normalize an all-items entry into the compact, cacheable shape used by the UI.
 * Movies carry `movie`, shows and anime carry `show`. Returns `null` when there is no numeric Simkl ID.
 *
 * The `watched` array may be empty (a `plantowatch` entry, or an item that was just un-watched). It is
 * intentionally not dropped here - the full pull filters those out, while the delta path uses them to
 * remove a cached item.
 */
export function normalizeSimklItem(item: SimklRawItem): SimklMediaItem | null {
	const media = entryMedia(item)
	const simklId = media.ids?.simkl_id ?? media.ids?.simkl

	if (typeof simklId !== 'number')
		return null

	const timestamps = [
		...(item.seasons ?? []).flatMap(season => (season.episodes ?? []).map(episode => episode.watched_at)),
		item.last_watched_at,
	].filter((value): value is string => !isPlaceholderDate(value))

	// Keep only the latest watch per year
	const latestPerYear = new Map<number, string>()
	for (const timestamp of timestamps) {
		const year = watchedYear(timestamp)
		const previous = latestPerYear.get(year)

		if (!previous || Date.parse(timestamp) > Date.parse(previous))
			latestPerYear.set(year, timestamp)
	}

	const watched: Array<SimklWatchEntry> = Array.from(latestPerYear.entries(), ([year, watchedAt]) => ({ year, month: watchedMonth(watchedAt), watchedAt }))
		.sort((a, b) => b.year - a.year)

	return {
		simklId,
		slug: media.ids?.slug ?? null,
		title: media.title ?? '',
		year: media.year ?? null,
		poster: media.poster ?? null,
		watched,
	}
}

function mergeType(cached: Array<SimklMediaItem>, incoming: Array<SimklMediaItem>): Array<SimklMediaItem> {
	const byId = new Map(cached.map(item => [item.simklId, item]))

	for (const item of incoming) {
		// An empty `watched` array means the item was un-watched
		if (item.watched.length === 0)
			byId.delete(item.simklId)
		else
			byId.set(item.simklId, item)
	}

	return [...byId.values()]
}

/**
 * Merge a sync response into the cached library.
 *
 * `full` replaces all three arrays. `delta` merges the changed items by `simklId` (Simkl's docs are
 * explicit that a delta must never replace the whole library) and then applies the deletion diff when
 * `currentIds` is present - a missing type key means the cache holds no IDs of that type any more.
 */
export function mergeSyncResponse(library: SimklLibrary, response: SimklSyncResponse): SimklLibrary {
	if (response.status === 'up-to-date')
		return library

	if (response.status === 'full') {
		return {
			movies: response.movies,
			shows: response.shows,
			anime: response.anime,
		}
	}

	const merged: SimklLibrary = {
		movies: mergeType(library.movies, response.movies),
		shows: mergeType(library.shows, response.shows),
		anime: mergeType(library.anime, response.anime),
	}

	if (response.currentIds) {
		for (const type of SIMKL_MEDIA_TYPES) {
			const ids = response.currentIds[type]
			const current = new Set(ids ?? [])

			merged[type] = merged[type].filter(item => current.has(item.simklId))
		}
	}

	return merged
}

export interface SimklYearItem extends SimklMediaItem {
	month: string
	watchedAt: string
}

/**
 * Project the library items of a type that have watching activity in a given year, newest first.
 * @example itemsForYear(library, 'shows', 2023) => Array<SimklYearItem>
 */
export function itemsForYear(library: SimklLibrary, type: SimklMediaType, year: number | string): Array<SimklYearItem> {
	const y = typeof year === 'string' ? Number.parseInt(year) : year

	return library[type]
		.map((item) => {
			const entry = item.watched.find(watched => watched.year === y)

			return entry ? { ...item, month: entry.month, watchedAt: entry.watchedAt } : null
		})
		.filter((item): item is SimklYearItem => item !== null)
		.sort((a, b) => Date.parse(b.watchedAt) - Date.parse(a.watchedAt))
}

/**
 * Total number of watched items in the library per type. List-only entries that were never watched do
 * not count.
 */
export function countByType(library: SimklLibrary): Record<SimklMediaType, number> {
	const count = (items: Array<SimklMediaItem>) => items.filter(item => item.watched.length > 0).length

	return {
		movies: count(library.movies),
		shows: count(library.shows),
		anime: count(library.anime),
	}
}

/**
 * Number of items of a type with watching activity in a given year.
 */
export function countForYear(library: SimklLibrary, type: SimklMediaType, year: number | string): number {
	const y = typeof year === 'string' ? Number.parseInt(year) : year

	return library[type].filter(item => item.watched.some(watched => watched.year === y)).length
}
