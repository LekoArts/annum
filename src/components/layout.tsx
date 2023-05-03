import * as React from 'react'
import { layout } from './layout.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return <main className={layout}>
    {children}
  </main>
}
