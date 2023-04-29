import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const img = style({
  objectFit: 'cover',
  width: vars.spacing.full,
  height: vars.spacing.full,
  boxShadow: vars.boxShadow.xl,
})
