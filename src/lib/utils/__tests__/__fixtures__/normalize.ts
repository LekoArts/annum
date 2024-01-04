export const historyShows = {
	id: 9434810476,
	watched_at: '2023-12-30T19:13:09.000Z',
	action: 'watch' as 'watch' | 'scrobble' | 'checkin',
	type: 'episode' as const,
	episode: {
		season: 1,
		number: 4,
		title: 'The Land Where Souls Rest',
		ids: {
			trakt: 10860108,
			tvdb: 9993739,
			imdb: 'tt29277817',
			tmdb: 4698539,
			tvrage: undefined,
		},
	},
	show: {
		title: 'Frieren: Beyond Journey\'s End',
		year: 2023,
		ids: {
			trakt: 198225,
			slug: 'frieren-beyond-journey-s-end',
			tvdb: 424536,
			imdb: 'tt22248376',
			tmdb: 209867,
			tvrage: undefined,
		},
	},
}

export const historyMovies = {
	id: 9435074612,
	watched_at: '2023-12-30T21:42:56.000Z',
	action: 'watch' as 'watch' | 'scrobble' | 'checkin',
	type: 'movie' as const,
	movie: {
		title: 'Scarface',
		year: 1983,
		ids: {
			trakt: 80,
			slug: 'scarface-1983',
			imdb: 'tt0086250',
			tmdb: 111,
		},
	},
}

export const watchedShows = {
	plays: 45,
	last_watched_at: '2024-01-04T10:51:27.000Z',
	last_updated_at: '2024-01-04T10:51:28.000Z',
	reset_at: null,
	show: {
		title: 'Jet Lag: The Game',
		year: 2022,
		ids: {
			trakt: 202731,
			slug: 'jet-lag-the-game',
			tvdb: 425498,
			imdb: 'tt23030000',
			tmdb: 237761,
			tvrage: null,
		},
	},
}

export const watchedMovies = {
	plays: 3,
	last_watched_at: '2019-12-22T13:25:00.000Z',
	last_updated_at: '2022-12-22T13:25:55.000Z',
	movie: {
		title: 'Harry Potter and the Philosopher\'s Stone',
		year: 2001,
		ids: {
			trakt: 545,
			slug: 'harry-potter-and-the-philosopher-s-stone-2001',
			imdb: 'tt0241527',
			tmdb: 671,
		},
	},
}
