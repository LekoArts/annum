import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const settings = style({
  padding: vars.spacing[6],
  borderRadius: vars.borderRadius.xl,
  background: vars.color['zinc-900'],
  boxShadow: vars.boxShadow.xl,
})
