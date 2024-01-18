/**
 * Adjusted from https://github.com/accuser/svelte-plausible-analytics/blob/main/src/lib/store.ts
 * LICENSE: MIT
 */

import { writable } from 'svelte/store'

interface Data {
	props?: Record<string, string>
}

interface PlausibleEvent {
	event: string
	data?: Data
}

/**
 * Plausible Analytics event store.
 */
export const pa = (() => {
	const { subscribe, update } = writable<Array<PlausibleEvent>>([])

	const addEvent = (event: string, data?: Data) => {
		update(events => [...events, { event, data }])
	}

	return {
		subscribe,
		addEvent,
	}
})()
