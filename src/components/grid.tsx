import * as React from 'react'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { grid, gridColumns, gridGap } from './grid.css'

interface GridProps {
  children: React.ReactNode
  columns: number
  gap: boolean
}

export function Grid({ children, columns = 3, gap = false }: GridProps) {
  return <div className={grid} style={assignInlineVars({ [gridColumns]: columns.toString(), [gridGap]: gap ? '1' : '0' })}>
    {children}
  </div>
}
