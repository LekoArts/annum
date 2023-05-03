import { createGlobalTheme } from '@vanilla-extract/css'
import t from 'tinycolor2'

const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  full: '100%',
  auto: 'auto',
}

const maxWidth = {
  'none': 'none',
  '0': '0rem',
  'xs': '20rem',
  'sm': '24rem',
  'md': '28rem',
  'lg': '32rem',
  'xl': '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
  'full': '100%',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'prose': '65ch',
}

const fontFamily = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\'',
  serif: 'ui-serif, Georgia, Cambria, \'Times New Roman\', Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \'Liberation Mono\', \'Courier New\', monospace',
}

const fontSize = {
  'sm': '0.875rem',
  'base': '1rem',
  'lg': '1.125rem',
  'xl': '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
}

const lineHeight = {
  'sm': '1.25rem',
  'base': '1.5rem',
  'lg': '1.75rem',
  'xl': '1.75rem',
  '2xl': '2rem',
  '3xl': '2.25rem',
}

const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

const palette = {
  'inherit': 'inherit',
  'current': 'currentColor',
  'transparent': 'transparent',
  'black': '#000',
  'white': '#fff',
  'zinc-50': '#fafafa',
  'zinc-100': '#f4f4f5',
  'zinc-200': '#e4e4e7',
  'zinc-300': '#d4d4d8',
  'zinc-400': '#a1a1aa',
  'zinc-500': '#71717a',
  'zinc-600': '#52525b',
  'zinc-700': '#3f3f46',
  'zinc-800': '#27272a',
  'zinc-900': '#18181b',
  'zinc-950': '#09090b',
  'rose-50': '#fff1f2',
  'rose-100': '#ffe4e6',
  'rose-200': '#fecdd3',
  'rose-300': '#fda4af',
  'rose-400': '#fb7185',
  'rose-500': '#f43f5e',
  'rose-600': '#e11d48',
  'rose-700': '#be123c',
  'rose-800': '#9f1239',
  'rose-900': '#881337',
  'rose-950': '#4c0519',
}

const boxShadow = {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
  'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  'none': 'none',
}

const borderRadius = {
  'none': '0px',
  'sm': '0.125rem',
  'DEFAULT': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  'full': '9999px',
}

export const vars = createGlobalTheme(':root', {
  color: {
    ...palette,
    primary: palette['rose-600'],
    text: palette['zinc-100'],
    background: `linear-gradient(0deg, ${t(palette['zinc-950']).toRgbString()} 0%, ${t(palette['zinc-800']).toRgbString()} 100%)`,
  },
  spacing,
  maxWidth,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  boxShadow,
  borderRadius,
})
