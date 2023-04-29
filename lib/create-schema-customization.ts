import type { GatsbyNode } from 'gatsby'
import { TYPE_NAMES } from './constants'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  actions.createTypes(`
    type ${TYPE_NAMES.movie} implements Node {
      id: ID!
      title: String!
      poster_path: String!
      last_watched_at: Date! @dateformat
      release_year: Int!
      tmdb_id: Int!
    }

    type ${TYPE_NAMES.show} implements Node {
      id: ID!
      title: String!
      poster_path: String!
      last_watched_at: Date! @dateformat
      release_year: Int!
      tmdb_id: Int!
    }
  `)
}
