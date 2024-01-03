import { persisted } from './persisted'
import type { Language } from '$lib/types'

interface Settings {
	hue: number
	screenshotMode: boolean
	columns: number
	lang: Language
}

export const settings = persisted<Settings>('trakt-yearly-posters-settings', {
	hue: 240,
	screenshotMode: false,
	columns: 5,
	lang: 'en',
})
