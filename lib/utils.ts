import type { SourceNodesArgs } from 'gatsby'
import type { Got } from 'got'
import type { TmdbItemDetail, TraktMediaType, TraktMovie, TraktShow } from './types'
import type { TmdbPosterSize } from './constants'
import { CURRENT_YEAR, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_POSTER_SIZES } from './constants'

const traktTmdbMediaMap = {
  movies: 'movie',
  shows: 'tv',
} as const

export const traktUserUrl = (username: string) => `users/${username}`

export const traktWatchedUrl = (username: string, type: TraktMediaType) => `${traktUserUrl(username)}/watched/${type}${type === 'shows' ? '?extended=noseasons' : ''}`

export const traktStatsUrl = (username: string) => `${traktUserUrl(username)}/stats`

export const filterForCurrentYear = (item: TraktMovie | TraktShow) => new Date(item.last_watched_at).getFullYear() === CURRENT_YEAR

export function flattenItem(item: TraktMovie | TraktShow) {
  const last_watched_at = item.last_watched_at
  let title!: string
  let release_year!: number
  let tmdb_id: number | undefined

  if ('movie' in item) {
    title = item.movie.title
    release_year = item.movie.year
    tmdb_id = item.movie.ids.tmdb
  }

  if ('show' in item) {
    title = item.show.title
    release_year = item.show.year
    tmdb_id = item.show.ids.tmdb
  }

  return {
    last_watched_at,
    title,
    release_year,
    tmdb_id,
  }
}

export const tmdbItemDetailsUrl = (type: TraktMediaType, tmdb_id: number) => `${TMDB_BASE_URL}/${traktTmdbMediaMap[type]}/${tmdb_id}`

export const tmdbImageUrl = (poster_path: string, size: TmdbPosterSize = 'w342') => `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZES[size]}${poster_path}`

interface TmdbImageArgs {
  gatsbyApi: SourceNodesArgs
  tmdbGot: Got
  type: TraktMediaType
  tmdb_id: number
}

export async function tmdbImage({ gatsbyApi, tmdbGot, type, tmdb_id }: TmdbImageArgs): Promise<string | null> {
  const { cache } = gatsbyApi

  const cacheKey = `tmdb-image-${type}-${tmdb_id}`
  const cachedImage = await cache.get(cacheKey)

  if (cachedImage)
    return cachedImage

  const metadata: TmdbItemDetail = await tmdbGot(tmdbItemDetailsUrl(type, tmdb_id)).json()

  if (!metadata.poster_path)
    return null

  const image = tmdbImageUrl(metadata.poster_path)

  await cache.set(cacheKey, image)

  return image
}
