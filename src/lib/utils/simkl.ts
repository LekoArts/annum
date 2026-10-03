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

/** Narrow an arbitrary route param to a Simkl media type. */
export function isSimklMediaType(value: string): value is SimklMediaType {
	return (SIMKL_MEDIA_TYPES as ReadonlyArray<string>).includes(value)
}

/** Map a media type to its segment on simkl.com: `shows` -> `tv`. */
export const simklItemTypeMap = {
	movies: 'movies',
	shows: 'tv',
	anime: 'anime',
} as const satisfies Record<SimklMediaType, string>

/** Human-readable media type names, shared by the toolbar, the header counts and the page title. */
export const MEDIA_TYPE_LABELS = {
	movies: 'Movies',
	shows: 'Shows',
	anime: 'Anime',
} as const satisfies Record<SimklMediaType, string>

/** The `static/icons.svg` symbol for each media type: `shows` -> `tv`. */
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
/** A leading slash and/or `avatars/` segment, which must not be repeated in a built avatar URL. */
const AVATAR_PATH_PREFIX = /^\/?(avatars\/)?/

/** Build an avatar URL for Simkl's `user.avatar`: full URLs pass through, paths get the `_<size>` suffix. */
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

/** The poster widths Simkl documents; `_w` is a 600x338 landscape crop and deliberately absent. */
export const SIMKL_POSTER_SIZES = [
	{ size: 's', width: 40 },
	{ size: 'cm', width: 84 },
	{ size: 'c', width: 170 },
	{ size: 'ca', width: 190 },
	{ size: 'm', width: 340 },
] as const

/** Missing-poster placeholder, cut to `_c` so it matches the default `src`. */
export const SIMKL_POSTER_PLACEHOLDER = `${SIMKL_IMAGE_PROXY}https://simkl.in/poster_no_pic_c.png`

/** Simkl page URL for an item; the slug is not unique, the numeric id is the stable part. */
export function simklItemUrl(type: SimklMediaType, simklId: number, slug?: string | null): string {
	const base = `${SIMKL_ITEM_BASE_URL}/${simklItemTypeMap[type]}/${simklId}`

	return slug ? `${base}/${slug}` : base
}

/** Poster URL for a Simkl `poster` path, defaulting to `_c`, the size a `<img>` uses as `src`. */
export function simklPosterUrl(poster: string | null | undefined, size = 'c'): string {
	if (!poster)
		return SIMKL_POSTER_PLACEHOLDER

	return `${SIMKL_IMAGE_PROXY}${SIMKL_POSTER_BASE_URL}/${poster}_${size}.webp&q=90`
}

/** Width-descriptor `srcset` over Simkl's fixed poster sizes, so the browser picks the tile's size. */
export function simklPosterSrcset(poster: string | null | undefined): string | undefined {
	if (!poster)
		return undefined

	return SIMKL_POSTER_SIZES
		.map(({ size, width }) => `${simklPosterUrl(poster, size)} ${width}w`)
		.join(', ')
}

/** Simkl uses timestamps before 2000-01-01 to mean "watched, date unknown"; missing counts as unknown. */
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

/** Full entries wrap the ids in a `movie`/`show` block; `extended=simkl_ids_only` may return them bare. */
function entryMedia(item: SimklRawItem): SimklMediaBlock {
	return item.movie ?? item.show ?? item
}

/** The numeric Simkl ids of a type, for the `extended=simkl_ids_only` deletion diff. */
export function collectSimklIds(response: SimklAllItemsResponse, type: SimklMediaType): Array<number> {
	return (response[type] ?? [])
		.map(item => entryMedia(item).ids)
		.map(ids => ids?.simkl_id ?? ids?.simkl)
		.filter((id): id is number => typeof id === 'number')
}

// Normalize an entry into the cached shape; `null` without a numeric Simkl id. An empty `watched` array
// is kept: the full pull drops those, the delta uses them to remove an item.
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

/** `full` replaces the cache, a `delta` merges by id (never replaces) and applies the `currentIds` diff. */
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

/** Project the items of a type with watching activity in a year, newest first. */
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

/** Number of items of a type with watching activity in a year. */
export function countForYear(library: SimklLibrary, type: SimklMediaType, year: number | string): number {
	const y = typeof year === 'string' ? Number.parseInt(year) : year

	return library[type].filter(item => item.watched.some(watched => watched.year === y)).length
}

export interface SimklTypedYearItem extends SimklYearItem {
	type: SimklMediaType
}

/** Several types in one newest-first list, each item tagged with the `type` its Simkl link needs. */
export function itemsForTypes(library: SimklLibrary, types: ReadonlyArray<SimklMediaType>, year: number | string): Array<SimklTypedYearItem> {
	return types
		.flatMap(type => itemsForYear(library, type, year).map(item => ({ ...item, type })))
		.sort((a, b) => Date.parse(b.watchedAt) - Date.parse(a.watchedAt))
}

/** Every year from `currentYear` down to the earliest watched year; future years would invert the range. */
export function availableYears(library: SimklLibrary, currentYear: number): Array<number> {
	const watchedYears = SIMKL_MEDIA_TYPES
		.flatMap(type => library[type].flatMap(item => item.watched.map(watched => watched.year)))
		.filter(year => year <= currentYear)

	if (watchedYears.length === 0)
		return [currentYear]

	const earliest = Math.min(...watchedYears)

	return Array.from({ length: currentYear - earliest + 1 }, (_, index) => currentYear - index)
}
