import type { StyleRule } from '@vanilla-extract/css'
import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

const spacerBaseStyle = style({
  width: vars.spacing.px,
  display: 'block',
  minWidth: vars.spacing.px,
})

export type SpacerSize = 4 | 8 | 12 | 16 | 20 | 24

const spacers: Record<SpacerSize, StyleRule> = {
  4: {
    height: vars.spacing[4],
    minHeight: vars.spacing[4],
  },
  8: {
    height: vars.spacing[8],
    minHeight: vars.spacing[8],
  },
  12: {
    height: vars.spacing[12],
    minHeight: vars.spacing[12],
  },
  16: {
    height: vars.spacing[16],
    minHeight: vars.spacing[16],
  },
  20: {
    height: vars.spacing[20],
    minHeight: vars.spacing[20],
  },
  24: {
    height: vars.spacing[24],
    minHeight: vars.spacing[24],
  },
}

export const spacerVariants = styleVariants(spacers, s => [spacerBaseStyle, s])
