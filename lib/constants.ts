export const TRAKT_BASE_URL = 'https://api.trakt.tv'
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3/'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'
export const CURRENT_YEAR = new Date().getFullYear()
export const TYPE_NAMES = {
  movie: 'Movie',
  show: 'Show',
} as const
export const TMDB_POSTER_SIZES = {
  w92: 'w92',
  w154: 'w154',
  w185: 'w185',
  w342: 'w342',
  w500: 'w500',
  w780: 'w780',
  original: 'original',
} as const

export type TmdbPosterSize = keyof typeof TMDB_POSTER_SIZES
