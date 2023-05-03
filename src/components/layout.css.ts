import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const layout = style({
  marginTop: vars.spacing[0],
  marginBottom: vars.spacing[0],
  marginLeft: vars.spacing.auto,
  marginRight: vars.spacing.auto,
  maxWidth: vars.maxWidth['7xl'],
})
