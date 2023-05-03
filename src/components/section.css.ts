import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const section = style({
  marginTop: vars.spacing[12],
  marginBottom: vars.spacing[12],
  padding: vars.spacing[6],
  border: `1px dashed ${vars.color['zinc-700']}`,
  borderRadius: vars.borderRadius.xl,
})
