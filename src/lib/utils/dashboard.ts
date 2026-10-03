import type { SimklMediaType } from '#lib/types.js'
import { isSimklMediaType, MEDIA_TYPE_LABELS, SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'

/**
 * The read surface the URL contract needs.
 *
 * Both a `URLSearchParams` (load functions, `window.location`) and SvelteKit's readonly
 * `page.url.searchParams` satisfy it, and going through `get()` is what keeps SvelteKit's
 * per-parameter tracking — and with it the client-side re-run of the load — intact.
 */
export interface SearchParamsReader {
	get: (name: string) => string | null
}

/**
 * Canonical, validated media selection from `?types=`.
 *
 * Absent, empty and unknown-only values all mean "everything": the dashboard has no zero-type state,
 * so an unusable value degrades to the default instead of an error.
 * @example resolveSelectedTypes(new URLSearchParams('types=anime,movies')) => ['movies', 'anime']
 */
export function resolveSelectedTypes(searchParams: SearchParamsReader): Array<SimklMediaType> {
	const raw = searchParams.get('types')

	const requested = (raw ?? '')
		.split(',')
		.map(value => value.trim())
		.filter(isSimklMediaType)

	const unique = new Set(requested)
	const canonical = SIMKL_MEDIA_TYPES.filter(type => unique.has(type))

	return canonical.length === 0 ? [...SIMKL_MEDIA_TYPES] : canonical
}

/**
 * Validated year from `?year=`.
 *
 * Anything that is not an integer inside the offered range falls back to `currentYear`, so a stale or
 * hand-edited link still renders a valid view (no redirect, no error page).
 * @example resolveYear(new URLSearchParams('year=2015'), [2024, 2023], 2024) => 2024
 */
export function resolveYear(searchParams: SearchParamsReader, availableYears: ReadonlyArray<number>, currentYear: number): number {
	const raw = searchParams.get('year')
	// Base 10 explicitly: `parseInt` would otherwise read a `0x`-prefixed value as hexadecimal
	const year = raw === null ? Number.NaN : Number.parseInt(raw, 10)

	return Number.isInteger(year) && availableYears.includes(year) ? year : currentYear
}

/**
 * Canonical search string for a dashboard selection, or `''` when the URL already implies it.
 *
 * The current year and a full selection are the defaults, so they stay out of the URL: `/dashboard`
 * is the plain link, and only a deviation from the default needs writing.
 * @example dashboardSearch({ year: 2015, types: ['anime'], currentYear: 2024 }) => '?year=2015&types=anime'
 */
export function dashboardSearch(input: { year: number, types: ReadonlyArray<SimklMediaType>, currentYear: number }): string {
	const parts: Array<string> = []
	const selected = SIMKL_MEDIA_TYPES.filter(type => input.types.includes(type))

	if (input.year !== input.currentYear)
		parts.push(`year=${input.year}`)

	// An empty selection is not expressible, so it is written as the default too
	if (selected.length > 0 && selected.length < SIMKL_MEDIA_TYPES.length)
		parts.push(`types=${selected.join(',')}`)

	return parts.length === 0 ? '' : `?${parts.join('&')}`
}

/**
 * Readable name of a selection, used for the page title, the `<h1>` and the meta description.
 * @example describeSelection(['movies']) => 'Movies'
 * @example describeSelection(['movies', 'shows']) => 'Movies & Shows'
 * @example describeSelection(['movies', 'shows', 'anime']) => 'Movies, Shows & Anime'
 */
export function describeSelection(types: ReadonlyArray<SimklMediaType>): string {
	const labels = SIMKL_MEDIA_TYPES.filter(type => types.includes(type)).map(type => MEDIA_TYPE_LABELS[type])

	return labels.length <= 1 ? labels.join('') : `${labels.slice(0, -1).join(', ')} & ${labels.at(-1)}`
}
