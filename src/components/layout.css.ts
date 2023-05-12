import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const widthSetup = style({
  marginLeft: vars.spacing.auto,
  marginRight: vars.spacing.auto,
  maxWidth: vars.maxWidth['7xl'],
  paddingLeft: vars.spacing[4],
  paddingRight: vars.spacing[4],
})

export const fullHeight = style({
  minHeight: '100vh',
})

export const header = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: vars.spacing[4],
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const nav = style({
  display: 'flex',
  gap: vars.spacing[4],
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.lg,
})

export const footer = style({
  textAlign: 'center',
})

globalStyle(`${footer} a`, {
  color: vars.color.primary,
})

globalStyle(`${footer} img`, {
  display: 'inline-block',
  width: '24px',
  verticalAlign: 'top',
})

export const activeClassName = style({
  color: vars.color.primary,
})

const wave = keyframes({
  '0%, 100%': {
    transform: 'rotate(0)',
  },
  '20%, 60%': {
    transform: 'rotate(-25deg)',
  },
  '40%, 80%': {
    transform: 'rotate(10deg)',
  },
})

export const githubCornerStyle = style({})

export const githubCornerSvgStyle = style({
  top: 0,
  border: 0,
  right: 0,
  fill: vars.color.primary,
  color: vars.color.white,
  position: 'absolute',
  selectors: {
    [`${githubCornerStyle}:focus &`]: {
      outline: '-webkit-focus-ring-color auto 1px',
    },
  },
})

export const octoArmStyle = style({
  selectors: {
    [`${githubCornerStyle}:hover &`]: {
      animation: `${wave} 560ms ease-in-out`,
    },
  },
})
