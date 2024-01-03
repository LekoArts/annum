import { persisted } from './persisted'

export const settings = persisted('trakt-yearly-posters-settings', {
	hue: 240,
})
