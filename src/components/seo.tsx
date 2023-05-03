import * as React from 'react'

export function Seo({ title, children }: { title: string; children?: React.ReactNode }) {
  return <>
    <title>{title}</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🎬</text></svg>" />
    {children}
  </>
}
