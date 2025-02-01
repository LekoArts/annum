import type { Language } from '$lib/types'
import { persisted } from './persisted'

interface Settings {
	hue: number
	screenshotMode: boolean
	columns: number
	lang: Language
	grayscaleMode: boolean
	groupByMonth: boolean
}

export const settings = persisted<Settings>('annum-settings', {
	hue: 240,
	screenshotMode: false,
	columns: 5,
	lang: 'en',
	grayscaleMode: false,
	groupByMonth: false,
})
