import type { GatsbyNode, NodeInput, SourceNodesArgs } from 'gatsby'
import { tmdbGotInstance, traktGotInstance } from './got'
import { filterForCurrentYear, flattenItem, tmdbImage, traktStatsUrl, traktWatchedUrl } from './utils'
import type { TraktMovie, TraktShow, TraktStats } from './types'
import { ENV } from './env'

export const sourceNodes: GatsbyNode['sourceNodes'] = async (gatsbyApi: SourceNodesArgs) => {
  const { reporter, createNodeId, createContentDigest, actions } = gatsbyApi
  const { createNode } = actions

  const traktGot = traktGotInstance({ traktClientId: ENV.TRAKT_CLIENT_ID })
  const tmdbGot = tmdbGotInstance({ apiKey: ENV.TMDB_API_KEY, sessionId: ENV.TMDB_SESSION_ID, language: ENV.TMDB_LANGUAGE })

  const traktTimer = reporter.activityTimer(`Fetching Trakt data for ${ENV.TRAKT_USERNAME}`)
  traktTimer.start()

  const stats: TraktStats = await traktGot(traktStatsUrl(ENV.TRAKT_USERNAME)).json()
  const watchedMovies: Array<TraktMovie> = await traktGot(traktWatchedUrl(ENV.TRAKT_USERNAME, 'movies')).json()
  const watchedShows: Array<TraktShow> = await traktGot(traktWatchedUrl(ENV.TRAKT_USERNAME, 'shows')).json()

  traktTimer.end()

  createNode({
    ...stats,
    id: createNodeId(`trakt-stats-${ENV.TRAKT_USERNAME}`),
    internal: {
      type: 'Stats',
      contentDigest: createContentDigest(stats),
    },
  })

  const massagedMovies = watchedMovies.filter(filterForCurrentYear).map(flattenItem)
  const massagedShows = watchedShows.filter(filterForCurrentYear).map(flattenItem)

  const tmdbTimer = reporter.activityTimer('Fetching additional TMDb data & creating nodes')
  tmdbTimer.start()

  for (const movie of massagedMovies) {
    if (!movie.tmdb_id)
      continue

    const poster_path = await tmdbImage({ gatsbyApi, tmdbGot, type: 'movies', tmdb_id: movie.tmdb_id })

    if (!poster_path)
      continue

    const nodeMeta = {
      ...movie,
      poster_path,
      id: createNodeId(`trakt-movie-${movie.tmdb_id}`),
      internal: {
        type: 'Movie',
        contentDigest: createContentDigest(movie),
      },
    } satisfies NodeInput

    createNode(nodeMeta)
  }

  for (const show of massagedShows) {
    if (!show.tmdb_id)
      continue

    const poster_path = await tmdbImage({ gatsbyApi, tmdbGot, type: 'shows', tmdb_id: show.tmdb_id })

    if (!poster_path)
      continue

    const nodeMeta = {
      ...show,
      poster_path,
      id: createNodeId(`trakt-show-${show.tmdb_id}`),
      internal: {
        type: 'Show',
        contentDigest: createContentDigest(show),
      },
    } satisfies NodeInput

    createNode(nodeMeta)
  }

  tmdbTimer.end()
}
