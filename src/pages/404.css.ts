import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const notFound = style({
  textAlign: 'center',
  padding: vars.spacing[12],
  fontSize: vars.fontSize['2xl'],
})
