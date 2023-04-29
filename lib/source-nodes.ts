import type { GatsbyNode } from 'gatsby'
import z from 'zod'
import { traktGotInstance } from './trakt-got'
import { filterForCurrentYear, flattenItem, traktStatsUrl, traktWatchedUrl } from './utils'
import type { TraktMovie, TraktShow, TraktStats } from './types'

const envSchema = z.object({
  TRAKT_CLIENT_ID: z.string(),
  TMDB_API_KEY: z.string(),
  TMDB_SESSION_ID: z.string(),
  TRAKT_USERNAME: z.string(),
})

const ENV = envSchema.parse(process.env)

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({ reporter, createNodeId, createContentDigest, actions }) => {
  const { createNode } = actions

  const traktGot = await traktGotInstance({ traktClientId: ENV.TRAKT_CLIENT_ID })

  const traktTimer = reporter.activityTimer(`Fetching Trakt data for ${ENV.TRAKT_USERNAME}`)
  traktTimer.start()

  const stats: TraktStats = await traktGot(traktStatsUrl(ENV.TRAKT_USERNAME)).json()
  const watchedMovies: Array<TraktMovie> = await traktGot(traktWatchedUrl(ENV.TRAKT_USERNAME, 'movies')).json()
  const watchedShows: Array<TraktShow> = await traktGot(traktWatchedUrl(ENV.TRAKT_USERNAME, 'shows')).json()

  const massagedMovies = watchedMovies.filter(filterForCurrentYear).map(flattenItem)
  const massagedShows = watchedShows.filter(filterForCurrentYear).map(flattenItem)

  traktTimer.end()

  console.log({ massagedMovies })
}
