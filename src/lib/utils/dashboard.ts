import type { SimklMediaType } from '#lib/types.js'
import { isSimklMediaType, MEDIA_TYPE_LABELS, SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'

// Both `URLSearchParams` and SvelteKit's readonly `page.url.searchParams` satisfy this; going through
// `get()` keeps SvelteKit's per-parameter tracking intact.
export interface SearchParamsReader {
	get: (name: string) => string | null
}

/** Canonical media selection from `?types=`: absent, empty or unknown-only all mean all three types. */
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

/** Simkl treats timestamps before 2000-01-01 as "watched, date unknown", so no earlier year has items. */
const EARLIEST_YEAR = 2000

/**
 * Validated year from `?year=`. Deliberately independent of the cached library: the load function runs once
 * per navigation while the controls re-derive on every store write, so a library-dependent range would let
 * a deep link resolve to one year in the grid and another in the header after the first sync.
 */
export function resolveYear(searchParams: SearchParamsReader, currentYear: number): number {
	const raw = searchParams.get('year')
	// Base 10 explicitly: `parseInt` would otherwise read a `0x`-prefixed value as hexadecimal
	const year = raw === null ? Number.NaN : Number.parseInt(raw, 10)

	return Number.isInteger(year) && year >= EARLIEST_YEAR && year <= currentYear ? year : currentYear
}

/** Canonical search string for a selection, or `''` when the URL already implies it (`/dashboard`). */
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

/** Readable name of a selection, e.g. `Movies, Shows & Anime`, for the title, `<h1>` and description. */
export function describeSelection(types: ReadonlyArray<SimklMediaType>): string {
	const labels = SIMKL_MEDIA_TYPES.filter(type => types.includes(type)).map(type => MEDIA_TYPE_LABELS[type])

	return labels.length <= 1 ? labels.join('') : `${labels.slice(0, -1).join(', ')} & ${labels.at(-1)}`
}
