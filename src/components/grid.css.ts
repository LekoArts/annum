import { createVar, style } from '@vanilla-extract/css'

export const gridColumns = createVar()

export const gridGap = createVar()

export const grid = style({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  gap: `calc(${gridGap} * (6rem * (1 / ${gridColumns})))`,
})
