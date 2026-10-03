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

/**
 * Human-readable media type names, shared by the dashboard toolbar, the header counts and the page title.
 * @example MEDIA_TYPE_LABELS.shows => 'Shows'
 */
export const MEDIA_TYPE_LABELS = {
	movies: 'Movies',
	shows: 'Shows',
	anime: 'Anime',
} as const satisfies Record<SimklMediaType, string>

/**
 * The `static/icons.svg` symbol that represents each media type.
 * @example MEDIA_TYPE_ICONS.shows => 'tv'
 */
export const MEDIA_TYPE_ICONS = {
	movies: 'movie',
	shows: 'tv',
	anime: 'anime',
} as const satisfies Record<SimklMediaType, 'movie' | 'tv' | 'anime'>

const SIMKL_ITEM_BASE_URL = 'https://simkl.com'
const SIMKL_POSTER_BASE_URL = 'https://simkl.in/posters'
const SIMKL_AVATAR_BASE_URL = 'https://simkl.in/avatars'
const SIMKL_IMAGE_PROXY = 'https://wsrv.nl/?url='
const PLACEHOLDER_DATE_THRESHOLD = Date.parse('2000-01-01T00:00:00Z')
/** A leading slash and/or the `avatars/` segment, neither of which may be repeated in a built avatar URL. */
const AVATAR_PATH_PREFIX = /^\/?(avatars\/)?/

/**
 * Build an avatar URL for the `user.avatar` value Simkl returns.
 *
 * Simkl serves avatars straight from simkl.in (no image proxy) and the API is not consistent about the
 * shape: its `/users/settings` example shows a full URL while the image docs describe a path fragment.
 * Both are accepted, and a path fragment gets the documented size suffix. A path that already carries
 * the `avatars/` segment (with or without a leading slash) does not get a second one.
 * @example simklAvatarUrl('https://simkl.in/avatars/1/2_100.jpg') => the URL unchanged
 * @example simklAvatarUrl('1/2.jpg') => 'https://simkl.in/avatars/1/2_100.jpg'
 * @example simklAvatarUrl('avatars/1/2.jpg') => 'https://simkl.in/avatars/1/2_100.jpg'
 */
export function simklAvatarUrl(avatar: string | null | undefined, size = '100'): string | null {
	if (!avatar)
		return null

	if (avatar.startsWith('http'))
		return avatar

	const path = avatar.replace(AVATAR_PATH_PREFIX, '')
	const dot = path.lastIndexOf('.')
	const stem = dot === -1 ? path : path.slice(0, dot)
	const extension = dot === -1 ? '' : path.slice(dot)

	return `${SIMKL_AVATAR_BASE_URL}/${stem}_${size}${extension}`
}

/**
 * The Simkl poster sizes we serve, smallest first, with the exact widths documented for each.
 * `_w` is deliberately absent: it is a 600x338 landscape crop, not a portrait poster.
 */
export const SIMKL_POSTER_SIZES = [
	{ size: 's', width: 40 },
	{ size: 'cm', width: 84 },
	{ size: 'c', width: 170 },
	{ size: 'ca', width: 190 },
	{ size: 'm', width: 340 },
] as const

/** Missing-poster placeholder, proxied and cut to `_c` so it matches the default `src` above. */
export const SIMKL_POSTER_PLACEHOLDER = `${SIMKL_IMAGE_PROXY}https://simkl.in/poster_no_pic_c.png`

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
 *
 * The default is the size used as `src` — the smallest card size, so a browser that ignores `srcset`
 * still gets a crisp-enough poster without downloading the large one.
 * @example simklPosterUrl('57/5742576cd8f59fcb0') => 'https://wsrv.nl/?url=https://simkl.in/posters/57/5742576cd8f59fcb0_c.webp&q=90'
 */
export function simklPosterUrl(poster: string | null | undefined, size = 'c'): string {
	if (!poster)
		return SIMKL_POSTER_PLACEHOLDER

	return `${SIMKL_IMAGE_PROXY}${SIMKL_POSTER_BASE_URL}/${poster}_${size}.webp&q=90`
}

/**
 * Build the `srcset` for a poster so the browser can pick the size that matches the rendered tile.
 *
 * Simkl's sizes are fixed widths, hence width descriptors — no guessing. Grid tiles are only ever a
 * couple of hundred pixels wide, so this mostly saves bytes on 1x displays, which otherwise get the
 * `_m` poster at roughly twice the file size.
 *
 * Returns `undefined` for a missing poster: the placeholder has nothing to scale.
 * @example simklPosterSrcset('57/5742576cd8f59fcb0') => 'https://wsrv.nl/?url=...posters/57/5742576cd8f59fcb0_s.webp&q=90 40w, …, ..._m.webp&q=90 340w'
 */
export function simklPosterSrcset(poster: string | null | undefined): string | undefined {
	if (!poster)
		return undefined

	return SIMKL_POSTER_SIZES
		.map(({ size, width }) => `${simklPosterUrl(poster, size)} ${width}w`)
		.join(', ')
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
 * Number of items of a type with watching activity in a given year.
 * @example countForYear(library, 'movies', 2024) => 12
 */
export function countForYear(library: SimklLibrary, type: SimklMediaType, year: number | string): number {
	const y = typeof year === 'string' ? Number.parseInt(year) : year

	return library[type].filter(item => item.watched.some(watched => watched.year === y)).length
}

export interface SimklTypedYearItem extends SimklYearItem {
	type: SimklMediaType
}

/**
 * Project the items of several types with watching activity in a year into one mixed, newest-first list.
 * Each item keeps its own `type`, which a tile needs to link to its Simkl page.
 * @example itemsForTypes(library, ['movies', 'shows'], 2023) => Array<SimklTypedYearItem>
 */
export function itemsForTypes(library: SimklLibrary, types: ReadonlyArray<SimklMediaType>, year: number | string): Array<SimklTypedYearItem> {
	return types
		.flatMap(type => itemsForYear(library, type, year).map(item => ({ ...item, type })))
		.sort((a, b) => Date.parse(b.watchedAt) - Date.parse(a.watchedAt))
}

/**
 * The contiguous year range the dashboard offers: `currentYear` down to the earliest watched year.
 *
 * Years after `currentYear` are ignored so one future-dated row cannot invert the range, and an empty
 * library still offers the current year.
 * @example availableYears(library, 2024) => [2024, 2023, ..., 2015]
 */
export function availableYears(library: SimklLibrary, currentYear: number): Array<number> {
	const watchedYears = SIMKL_MEDIA_TYPES
		.flatMap(type => library[type].flatMap(item => item.watched.map(watched => watched.year)))
		.filter(year => year <= currentYear)

	if (watchedYears.length === 0)
		return [currentYear]

	const earliest = Math.min(...watchedYears)

	return Array.from({ length: currentYear - earliest + 1 }, (_, index) => currentYear - index)
}
