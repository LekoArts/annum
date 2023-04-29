import * as React from 'react'
import { subTitle, title } from './text.css'

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className={title}>{children}</h1>
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={subTitle}>{children}</h2>
}
