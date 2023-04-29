import type { GatsbyConfig } from 'gatsby'
import 'dotenv/config'
import { CURRENT_YEAR } from './lib/constants'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `LekoArts: Trakt.tv History of ${CURRENT_YEAR}`,
    siteUrl: 'https://www.yourdomain.tld',
    siteDescription: 'Yearly posters of your watched movies & TV shows',
  },
  graphqlTypegen: true,
  plugins: ['gatsby-plugin-vanilla-extract'],
}

export default config
