import type { GatsbyNode } from 'gatsby'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  actions.createTypes(`
    type Movie implements Node {
      id: ID!
      title: String!
      poster_path: String!
      last_watched_at: Date! @dateformat
      release_year: Int!
      tmdb_id: Int!
    }

    type Show implements Node {
      id: ID!
      title: String!
      poster_path: String!
      last_watched_at: Date! @dateformat
      release_year: Int!
      tmdb_id: Int!
    }
  `)
}
