import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Link } from 'gatsby'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'
import { notFound } from './404.css'

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout title="404" fh>
      <div className={notFound}>
        <Link to="/">Go back to Home</Link>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <Seo title="404: Page Not found" />
