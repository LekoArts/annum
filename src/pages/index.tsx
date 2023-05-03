import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { graphql } from 'gatsby'
import { Image } from '../components/image'
import '../styles/global.css'
import { Layout } from '../components/layout'
import { Grid } from '../components/grid'
import { Seo } from '../components/seo'
import { Settings } from '../components/settings'
import { Section } from '../components/section'

const IndexPage: React.FC<PageProps<Queries.IndexPageQueryQuery>> = ({ data: { movies, shows } }) => {
  const [columns, setColumns] = React.useState(3)
  const [gap, setGap] = React.useState(false)

  return (
    <>
      <Settings columns={columns} gap={gap} setColumns={setColumns} setGap={setGap} />
      <Layout>
        <Section>
          <Grid gap={gap} columns={columns}>
            {movies.nodes.map(movie => (
              <Image src={movie.poster_path} alt={movie.title} key={movie.tmdb_id} />
            ))}
          </Grid>
        </Section>
        <Section>
          <Grid gap={gap} columns={columns}>
            {shows.nodes.map(show => (
              <Image src={show.poster_path} alt={show.title} key={show.tmdb_id} />
            ))}
          </Grid>
        </Section>
      </Layout>
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => <Seo title="Home Page" />

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
