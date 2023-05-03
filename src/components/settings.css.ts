import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const settings = style({
  marginLeft: vars.spacing.auto,
  marginRight: vars.spacing.auto,
  maxWidth: vars.maxWidth['7xl'],
  marginTop: vars.spacing[12],
  marginBottom: vars.spacing[0],
  padding: vars.spacing[6],
  borderTop: `1px solid ${vars.color.primary}`,
  borderRadius: vars.borderRadius.DEFAULT,
  background: vars.color['zinc-900'],
})
