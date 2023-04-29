import * as React from 'react'
import { section } from './section.css'

export function Section({ children }: { children: React.ReactNode }) {
  return <section className={section}>{children}</section>
}
