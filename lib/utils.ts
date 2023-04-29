import type { TraktMovie, TraktShow } from './types'
import { CURRENT_YEAR } from './constants'

export const traktUserUrl = (username: string) => `users/${username}`

export const traktWatchedUrl = (username: string, type: 'movies' | 'shows') => `${traktUserUrl(username)}/watched/${type}${type === 'shows' ? '?extended=noseasons' : ''}`

export const traktStatsUrl = (username: string) => `${traktUserUrl(username)}/stats`

export const filterForCurrentYear = (item: TraktMovie | TraktShow) => new Date(item.last_watched_at).getFullYear() === CURRENT_YEAR

export function flattenItem(item: TraktMovie | TraktShow) {
  const last_watched_at = item.last_watched_at
  let title!: string
  let release_year!: number
  let tmdb_id!: number

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
