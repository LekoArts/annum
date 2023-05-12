import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { graphql } from 'gatsby'
import { Image } from '../components/image'
import { Layout } from '../components/layout'
import { Grid } from '../components/grid'
import { Seo } from '../components/seo'
import { Settings } from '../components/settings'
import { Section } from '../components/section'
import { SubTitle } from '../components/text'
import '../styles/global.css'
import { Spacer } from '../components/spacer'

interface IndexPageContext {
  currentYear: number
}

const IndexPage: React.FC<PageProps<Queries.IndexPageQueryQuery, IndexPageContext>> = ({ data: { movies, shows }, pageContext: { currentYear } }) => {
  const [columns, setColumns] = React.useState(4)
  const [gap, setGap] = React.useState(false)
  const traktUsername = process.env.GATSBY_TRAKT_USERNAME as string
  const title = `${traktUsername}${traktUsername.endsWith('s') ? '\'' : '\'s'} movies & shows in ${currentYear}`

  return (
    <Layout title={title}>
      <Settings columns={columns} setColumns={setColumns} setGap={setGap} />
      <Spacer size={12} />
      <SubTitle>Movies - {currentYear}</SubTitle>
      <Spacer size={4} />
      <Section>
        <Grid gap={gap} columns={columns}>
          {movies.nodes.map(movie => (
            <Image src={movie.poster_path} alt={movie.title} key={movie.tmdb_id} />
          ))}
        </Grid>
      </Section>
      <Spacer size={12} />
      <SubTitle>Shows - {currentYear}</SubTitle>
      <Spacer size={4} />
      <Section>
        <Grid gap={gap} columns={columns}>
          {shows.nodes.map(show => (
            <Image src={show.poster_path} alt={show.title} key={show.tmdb_id} />
          ))}
        </Grid>
      </Section>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <Seo title="Home Page" />

export const query = graphql`
  query IndexPageQuery($currentYear: Int!) {
    movies: allMovie(sort: {last_watched_at: DESC}, filter: {last_watched_at_year: {eq: $currentYear}}) {
      nodes {
        ...MovieDetails
      }
    }
    shows: allShow(sort: {last_watched_at: DESC}, filter: {last_watched_at_year: {eq: $currentYear}}) {
      nodes {
        ...ShowDetails
      }
    }
  }
`
