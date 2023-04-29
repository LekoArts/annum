import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const title = style({
  fontSize: vars.fontSize['3xl'],
  lineHeight: vars.lineHeight['3xl'],
  color: vars.color.white,
  fontWeight: vars.fontWeight.bold,
})

export const subTitle = style({
  fontSize: vars.fontSize['2xl'],
  lineHeight: vars.lineHeight['2xl'],
  color: vars.color.white,
  paddingLeft: vars.spacing[4],
  paddingRight: vars.spacing[4],
  paddingTop: vars.spacing[1],
  paddingBottom: vars.spacing[1],
  background: vars.color.primaryGradient,
  display: 'inline-block',
  borderRadius: vars.borderRadius.xl,
})
