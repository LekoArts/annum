import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Link } from 'gatsby'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <h1>404: Page Not found</h1>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <Seo title="404: Page Not found" />
