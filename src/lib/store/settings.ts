import { persisted } from './persisted'

interface Settings {
	hue: number
	screenshotMode: boolean
	columns: number
	grayscaleMode: boolean
	groupByMonth: boolean
}

export const settings = persisted<Settings>('annum-settings', {
	hue: 240,
	screenshotMode: false,
	columns: 5,
	grayscaleMode: false,
	groupByMonth: false,
})
