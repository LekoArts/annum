import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { graphql } from 'gatsby'
import { Image } from '../components/image'

const IndexPage: React.FC<PageProps<Queries.IndexPageQueryQuery>> = ({ data: { movies, shows } }) => {
  return (
    <main>
      <div>
        {movies.nodes.map(movie => (
          <Image src={movie.poster_path} alt={movie.title} key={movie.tmdb_id} />
        ))}
      </div>
      <div>
        {shows.nodes.map(show => (
          <Image src={show.poster_path} alt={show.title} key={show.tmdb_id} />
        ))}
      </div>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

export const query = graphql`
  query IndexPageQuery {
    movies: allMovie(sort: {last_watched_at: DESC}) {
      nodes {
        ...MovieDetails
      }
    }
    shows: allShow(sort: {last_watched_at: DESC}) {
      nodes {
        ...ShowDetails
      }
    }
  }
`
