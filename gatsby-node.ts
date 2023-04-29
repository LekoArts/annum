import path from 'node:path'
import type { GatsbyNode } from 'gatsby'
import { CURRENT_YEAR } from './lib/constants'

export { sourceNodes } from './lib/source-nodes'
export { createSchemaCustomization } from './lib/create-schema-customization'

const routes = {
  index: path.resolve('./src/routes/index.tsx'),
}

export const createPages: GatsbyNode['createPages'] = ({ actions }) => {
  const { createPage } = actions

  createPage({
    path: '/',
    component: routes.index,
    context: {
      currentYear: CURRENT_YEAR,
    },
  })
}
