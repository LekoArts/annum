import { persisted } from '#lib/store/persisted.js'

export type Theme = 'system' | 'light' | 'dark'

export const theme = persisted<Theme>('annum-theme', 'system')
