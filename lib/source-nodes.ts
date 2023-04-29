import type { GatsbyNode, NodeInput, SourceNodesArgs } from 'gatsby'
import { tmdbGotInstance, traktGotInstance } from './got'
import { flattenItem, tmdbImage, traktStatsUrl, traktWatchedUrl } from './utils'
import type { TraktMovie, TraktShow, TraktStats } from './types'
import { ENV } from './env'
import { TYPE_NAMES } from './constants'

export const sourceNodes: GatsbyNode['sourceNodes'] = async (gatsbyApi: SourceNodesArgs) => {
  const { reporter, createNodeId, createContentDigest, actions } = gatsbyApi
  const { createNode } = actions

  const traktGot = traktGotInstance({ traktClientId: ENV.TRAKT_CLIENT_ID })
  const tmdbGot = tmdbGotInstance({ apiKey: ENV.TMDB_API_KEY, sessionId: ENV.TMDB_SESSION_ID, language: ENV.TMDB_LANGUAGE })

  const traktTimer = reporter.activityTimer(`Fetching Trakt data for ${ENV.GATSBY_TRAKT_USERNAME}`)
  traktTimer.start()

  let stats!: TraktStats
  let watchedMovies!: Array<TraktMovie>
  let watchedShows!: Array<TraktShow>

  try {
    stats = await traktGot(traktStatsUrl(ENV.GATSBY_TRAKT_USERNAME)).json()
    watchedMovies = await traktGot(traktWatchedUrl(ENV.GATSBY_TRAKT_USERNAME, 'movies')).json()
    watchedShows = await traktGot(traktWatchedUrl(ENV.GATSBY_TRAKT_USERNAME, 'shows')).json()
  }
  catch (error) {
    if (error instanceof Error)
      reporter.panicOnBuild(`Failed to fetch Trakt data for ${ENV.GATSBY_TRAKT_USERNAME}`, error)
  }

  traktTimer.end()

  createNode({
    ...stats,
    id: createNodeId(`trakt-stats-${ENV.GATSBY_TRAKT_USERNAME}`),
    internal: {
      type: 'Stats',
      contentDigest: createContentDigest(stats),
    },
  })

  const massagedMovies = watchedMovies.map(flattenItem)
  const massagedShows = watchedShows.map(flattenItem)

  const tmdbTimer = reporter.activityTimer('Fetching additional TMDb data & creating nodes')
  tmdbTimer.start()

  for (const movie of massagedMovies) {
    if (!movie.tmdb_id)
      continue

    const poster_path = await tmdbImage({ gatsbyApi, tmdbGot, type: 'movies', tmdb_id: movie.tmdb_id, debugTitle: movie.title })

    if (!poster_path)
      continue

    const nodeMeta = {
      ...movie,
      poster_path,
      id: createNodeId(`trakt-${TYPE_NAMES.movie}-${movie.tmdb_id}`),
      internal: {
        type: TYPE_NAMES.movie,
        contentDigest: createContentDigest(movie),
      },
    } satisfies NodeInput

    createNode(nodeMeta)
  }

  for (const show of massagedShows) {
    if (!show.tmdb_id)
      continue

    const poster_path = await tmdbImage({ gatsbyApi, tmdbGot, type: 'shows', tmdb_id: show.tmdb_id, debugTitle: show.title })

    if (!poster_path)
      continue

    const nodeMeta = {
      ...show,
      poster_path,
      id: createNodeId(`trakt-${TYPE_NAMES.show}-${show.tmdb_id}`),
      internal: {
        type: TYPE_NAMES.show,
        contentDigest: createContentDigest(show),
      },
    } satisfies NodeInput

    createNode(nodeMeta)
  }

  tmdbTimer.end()
}
