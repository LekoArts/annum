import { persisted } from './persisted'

interface Settings {
	screenshotMode: boolean
	columns: number
	groupByMonth: boolean
}

export const settings = persisted<Settings>('annum-settings', {
	screenshotMode: false,
	columns: 0,
	groupByMonth: false,
})
