import { createGlobalTheme } from '@vanilla-extract/css'
import { modularScale } from 'polished'

const createScale = (ratio: number, base: number) => (steps: number) => `${modularScale(steps, base, ratio)}px`

const spaceScale = createScale(1.4, 4)

export const vars = createGlobalTheme(':root', {
  space: {
    'none': '0',
    '0x': spaceScale(0),
    '1x': spaceScale(1),
    '2x': spaceScale(2),
    '3x': spaceScale(3),
    '4x': spaceScale(4),
    '5x': spaceScale(5),
    '6x': spaceScale(6),
    '7x': spaceScale(7),
    '8x': spaceScale(8),
    'point': '0.1rem',
  },
})
