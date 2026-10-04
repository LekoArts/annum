import { persisted } from '#lib/store/persisted.js'

export type Theme = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'annum-theme'

export const theme = persisted<Theme>(THEME_STORAGE_KEY, 'system')
