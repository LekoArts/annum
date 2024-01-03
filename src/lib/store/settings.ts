import { persisted } from './persisted'
import type { Languages } from '$lib/types'

interface Settings {
	hue: number
	screenshotMode: boolean
	columns: number
	lang: Languages
}

export const settings = persisted<Settings>('trakt-yearly-posters-settings', {
	hue: 240,
	screenshotMode: false,
	columns: 5,
	lang: 'en',
})
