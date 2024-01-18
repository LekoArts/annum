import { writable } from 'svelte/store'

interface StatsEvent {
	movies: number
	shows: number
}

export const stats = (() => {
	const { subscribe, update } = writable<StatsEvent>({ movies: 0, shows: 0 })

	const setMovies = (movies: number) => {
		update(stats => ({ ...stats, movies }))
	}
	const setShows = (shows: number) => {
		update(stats => ({ ...stats, shows }))
	}

	return {
		subscribe,
		setMovies,
		setShows,
	}
})()
