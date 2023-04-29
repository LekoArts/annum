import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const section = style({
  padding: vars.spacing[6],
  border: `1px dashed ${vars.color['zinc-700']}`,
  borderRadius: vars.borderRadius.xl,
})
