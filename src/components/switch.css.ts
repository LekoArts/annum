import { style } from '@vanilla-extract/css'

export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.571rem',
  fontSize: '1.143rem',
  color: 'white',
})

export const indicator = style({
  width: '2rem',
  height: '1.143rem',
  border: '2px solid gray',
  background: 'gray',
  borderRadius: '1.143rem',
  transition: 'all 200ms',
  selectors: {
    '&:before': {
      content: '""',
      display: 'block',
      margin: '0.143rem',
      width: '0.857rem',
      height: '0.857rem',
      background: 'slateblue',
      borderRadius: '16px',
      transition: 'all 200ms',
    },
    '&[data-selected]': {
      borderColor: 'slateblue',
      background: 'slateblue',
    },
    [`${root}[data-selected] &:before`]: {
      background: 'red',
      transform: 'translateX(100%)',
    },
  },
})
