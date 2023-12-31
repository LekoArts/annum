import type { TmdbPosterSize, TraktMediaType } from '../types'
import { traktTmdbMediaMap } from '../utils'
import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_POSTER_SIZES } from '$const'

/**
 * Returns the URL to fetch TMDB details given a type and id
 */
export function tmdbItemDetailsUrl(type: TraktMediaType, tmdb_id: string) {
	return `${TMDB_BASE_URL}/${traktTmdbMediaMap[type]}/${tmdb_id}`
}

export function calculateSizeWithRatio(width: TmdbPosterSize, ratio = 1.5) {
	const w = Number.parseInt(width.slice(1))
	const h = w * ratio

	return {
		width: w,
		height: h,
	}
}

export function tmdbImageUrl(poster_path: string, size: TmdbPosterSize = 'w780') {
	return `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZES[size]}${poster_path}`
}

export function tmdbImageUrlsWithDimensions(poster_path: string) {
	return Object.values(TMDB_POSTER_SIZES).reduce((acc, size) => {
		const { width, height } = calculateSizeWithRatio(size)
		acc[size] = {
			url: tmdbImageUrl(poster_path, size),
			width,
			height,
		}
		return acc
	}, {} as Record<TmdbPosterSize, { url: string, width: number, height: number }>)
}
