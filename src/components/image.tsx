import * as React from 'react'
import { graphql } from 'gatsby'

export function Image({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" />
}

export const query = graphql`
  fragment MovieDetails on Movie {
    title
    poster_path
    last_watched_at(formatString: "YYYY/MM/DD")
    release_year
    tmdb_id
  }
  fragment ShowDetails on Show {
    title
    poster_path
    last_watched_at(formatString: "YYYY/MM/DD")
    release_year
    tmdb_id
  }
`
