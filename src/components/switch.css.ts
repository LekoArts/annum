import { style } from '@vanilla-extract/css'
import { vars } from '../styles/vars.css'

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing[3],
  fontSize: vars.fontSize.lg,
})

export const indicator = style({
  width: vars.spacing[8],
  height: vars.spacing[5],
  background: vars.color['zinc-100'],
  borderRadius: vars.borderRadius.full,
  padding: vars.spacing[0.5],
  transition: 'all 200ms',
  selectors: {
    '&:before': {
      content: '""',
      display: 'block',
      // margin: '0.143rem',
      width: vars.spacing[4],
      height: vars.spacing[4],
      background: vars.color['zinc-600'],
      borderRadius: vars.borderRadius.full,
      transition: 'all 200ms',
    },
    '&[data-selected]': {
      borderColor: 'slateblue',
      background: 'slateblue',
    },
    [`${root}[data-selected] &:before`]: {
      background: vars.color.primary,
      transform: 'translateX(0.7rem)',
    },
  },
})
