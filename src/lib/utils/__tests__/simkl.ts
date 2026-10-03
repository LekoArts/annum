import type { SimklAllItemsResponse, SimklLibrary, SimklMediaItem, SimklRawItem, SimklSyncResponse, SimklWatchEntry } from '#lib/types.js'
import { describe, expect, it } from 'vitest'
import { availableYears, collectSimklIds, countForYear, isPlaceholderDate, itemsForTypes, itemsForYear, mergeSyncResponse, normalizeSimklItem, simklAvatarUrl, simklItemUrl, simklPosterSrcset, simklPosterUrl } from '../simkl'

function media(simklId: number, watched: Array<SimklWatchEntry> = []): SimklMediaItem {
	return {
		simklId,
		slug: `slug-${simklId}`,
		title: `Title ${simklId}`,
		year: 2000,
		poster: null,
		watched,
	}
}

function watch(year: number, month = 'January', watchedAt = `${year}-01-01T00:00:00Z`): SimklWatchEntry {
	return { year, month, watchedAt }
}

function movieEntry(simklId: number, lastWatchedAt: string | null): SimklRawItem {
	return {
		last_watched_at: lastWatchedAt,
		status: 'completed',
		movie: {
			title: `Movie ${simklId}`,
			year: 2000,
			poster: 'aa/bb',
			ids: { simkl: simklId, slug: `movie-${simklId}` },
		},
	}
}

function syncResponse(overrides: Partial<SimklSyncResponse>): SimklSyncResponse {
	return {
		status: 'delta',
		activities: {},
		movies: [],
		shows: [],
		anime: [],
		...overrides,
	}
}

function makeLibrary(): SimklLibrary {
	return {
		movies: [media(1, [watch(2020)])],
		shows: [media(10, [watch(2021, 'May', '2021-05-05T00:00:00Z')]), media(11, [watch(2022)])],
		anime: [],
	}
}

describe('simklItemUrl', () => {
	it('builds movie, tv and anime URLs', () => {
		expect(simklItemUrl('movies', 53536, 'the-movie')).toBe('https://simkl.com/movies/53536/the-movie')
		expect(simklItemUrl('shows', 17465, 'game-of-thrones')).toBe('https://simkl.com/tv/17465/game-of-thrones')
		expect(simklItemUrl('anime', 39687, 'attack-on-titan')).toBe('https://simkl.com/anime/39687/attack-on-titan')
	})

	it('omits the slug segment when there is no slug', () => {
		expect(simklItemUrl('movies', 53536)).toBe('https://simkl.com/movies/53536')
		expect(simklItemUrl('shows', 17465, null)).toBe('https://simkl.com/tv/17465')
	})
})

describe('simklPosterUrl', () => {
	it('builds a wsrv.nl URL from a poster fragment', () => {
		expect(simklPosterUrl('aa/bb')).toBe('https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_c.webp&q=90')
	})

	it('supports a size override', () => {
		expect(simklPosterUrl('aa/bb', 'm')).toBe('https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_m.webp&q=90')
		expect(simklPosterUrl('aa/bb', 'cm')).toBe('https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_cm.webp&q=90')
	})

	it('falls back to the proxied missing-poster image', () => {
		expect(simklPosterUrl(null)).toBe('https://wsrv.nl/?url=https://simkl.in/poster_no_pic_c.png')
		expect(simklPosterUrl(undefined)).toBe('https://wsrv.nl/?url=https://simkl.in/poster_no_pic_c.png')
	})
})

describe('simklPosterSrcset', () => {
	it('offers every documented poster size with its exact width', () => {
		expect(simklPosterSrcset('aa/bb')).toBe([
			'https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_s.webp&q=90 40w',
			'https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_cm.webp&q=90 84w',
			'https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_c.webp&q=90 170w',
			'https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_ca.webp&q=90 190w',
			'https://wsrv.nl/?url=https://simkl.in/posters/aa/bb_m.webp&q=90 340w',
		].join(', '))
	})

	it('has no srcset for a missing poster, so the placeholder is not scaled', () => {
		expect(simklPosterSrcset(null)).toBeUndefined()
		expect(simklPosterSrcset(undefined)).toBeUndefined()
	})
})

describe('isPlaceholderDate', () => {
	it('treats missing values as placeholder dates', () => {
		expect(isPlaceholderDate(null)).toBe(true)
		expect(isPlaceholderDate(undefined)).toBe(true)
		expect(isPlaceholderDate('')).toBe(true)
	})

	it('treats pre-2000 timestamps as placeholder dates', () => {
		expect(isPlaceholderDate('1970-01-01T00:00:01Z')).toBe(true)
		expect(isPlaceholderDate('1999-12-31T23:59:59Z')).toBe(true)
	})

	it('accepts timestamps from 2000 onwards', () => {
		expect(isPlaceholderDate('2000-01-01T00:00:00Z')).toBe(false)
		expect(isPlaceholderDate('2001-01-01T00:00:00Z')).toBe(false)
	})

	it('treats unparseable values as placeholder dates', () => {
		expect(isPlaceholderDate('not a date')).toBe(true)
	})
})

describe('normalizeSimklItem', () => {
	it('normalizes a movie', () => {
		const result = normalizeSimklItem(movieEntry(53536, '2023-12-30T21:42:56Z'))

		expect(result).toEqual({
			simklId: 53536,
			slug: 'movie-53536',
			title: 'Movie 53536',
			year: 2000,
			poster: 'aa/bb',
			watched: [{ year: 2023, month: 'December', watchedAt: '2023-12-30T21:42:56Z' }],
		})
	})

	it('keeps one entry per year for a show spanning two years', () => {
		const result = normalizeSimklItem({
			last_watched_at: '2023-02-20T10:00:00Z',
			show: { title: 'A Show', ids: { simkl: 1, slug: 'a-show' } },
			seasons: [
				{
					number: 1,
					episodes: [
						{ number: 1, watched_at: '2021-05-01T10:00:00Z' },
						{ number: 2, watched_at: '2021-06-15T10:00:00Z' },
					],
				},
				{ number: 2, episodes: [{ number: 1, watched_at: '2023-02-20T10:00:00Z' }] },
			],
		})

		expect(result?.watched).toEqual([
			{ year: 2023, month: 'February', watchedAt: '2023-02-20T10:00:00Z' },
			{ year: 2021, month: 'June', watchedAt: '2021-06-15T10:00:00Z' },
		])
	})

	it('normalizes an anime entry, which uses the show block', () => {
		const result = normalizeSimklItem({
			last_watched_at: '2022-04-01T00:00:00Z',
			anime_type: 'tv',
			show: {
				title: 'Attack on Titan',
				year: 2013,
				poster: '39/396870bc78f2ba7e',
				anime_type: 'tv',
				ids: { simkl: 39687, slug: 'attack-on-titan' },
			},
		})

		expect(result).toMatchObject({
			simklId: 39687,
			slug: 'attack-on-titan',
			title: 'Attack on Titan',
			year: 2013,
			watched: [{ year: 2022, month: 'April', watchedAt: '2022-04-01T00:00:00Z' }],
		})
	})

	it('returns an empty watched array when the only date is a placeholder', () => {
		const result = normalizeSimklItem(movieEntry(1, '1970-01-01T00:00:01Z'))

		expect(result?.watched).toEqual([])
	})

	it('handles missing slug and poster', () => {
		const result = normalizeSimklItem({ movie: { title: 'No Extras', ids: { simkl: 7 } } })

		expect(result).toEqual({
			simklId: 7,
			slug: null,
			title: 'No Extras',
			year: null,
			poster: null,
			watched: [],
		})
	})

	it('reads ids.simkl when ids.simkl_id is absent', () => {
		const result = normalizeSimklItem({ movie: { title: 'A', ids: { simkl: 42 } } })

		expect(result?.simklId).toBe(42)
	})

	it('prefers ids.simkl_id over ids.simkl', () => {
		const result = normalizeSimklItem({ movie: { title: 'A', ids: { simkl: 1, simkl_id: 2 } } })

		expect(result?.simklId).toBe(2)
	})

	it('returns null when there is no numeric Simkl ID', () => {
		expect(normalizeSimklItem({ movie: { title: 'A' } })).toBeNull()
		expect(normalizeSimklItem({})).toBeNull()
	})
})

describe('collectSimklIds', () => {
	it('collects IDs from wrapped entries', () => {
		const response: SimklAllItemsResponse = {
			movies: [movieEntry(1, null), movieEntry(2, null)],
			shows: [{ show: { ids: { simkl: 10 } } }],
		}

		expect(collectSimklIds(response, 'movies')).toEqual([1, 2])
		expect(collectSimklIds(response, 'shows')).toEqual([10])
	})

	it('collects IDs from bare ids-only entries', () => {
		const response: SimklAllItemsResponse = {
			movies: [{ ids: { simkl: 3 } }, { ids: {} }],
		}

		expect(collectSimklIds(response, 'movies')).toEqual([3])
	})

	it('returns an empty array for a missing type key', () => {
		expect(collectSimklIds({}, 'anime')).toEqual([])
	})
})

describe('itemsForYear', () => {
	it('projects items with the year month and newest-first order', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2020)]), media(2, [])],
			shows: [media(3, [watch(2020, 'March', '2020-03-03T00:00:00Z'), watch(2022)])],
			anime: [],
		}

		expect(itemsForYear(library, 'movies', 2020).map(item => item.simklId)).toEqual([1])
		expect(itemsForYear(library, 'movies', 2021)).toEqual([])
		expect(itemsForYear(library, 'shows', 2020)[0]).toMatchObject({ simklId: 3, month: 'March', watchedAt: '2020-03-03T00:00:00Z' })
	})

	it('accepts a string year', () => {
		expect(itemsForYear(makeLibrary(), 'movies', '2020').map(item => item.simklId)).toEqual([1])
	})

	it('sorts the same year newest first', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2020, 'January', '2020-01-01T00:00:00Z')]), media(2, [watch(2020, 'December', '2020-12-01T00:00:00Z')])],
			shows: [],
			anime: [],
		}

		expect(itemsForYear(library, 'movies', 2020).map(item => item.simklId)).toEqual([2, 1])
	})
})

describe('countForYear', () => {
	it('counts only the items with watching activity in that year', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2020)]), media(2, [])],
			shows: [media(3, [watch(2020)])],
			anime: [],
		}

		expect(countForYear(library, 'movies', 2020)).toBe(1)
		expect(countForYear(library, 'movies', 2019)).toBe(0)
		expect(countForYear(library, 'shows', '2020')).toBe(1)
	})
})

describe('mergeSyncResponse', () => {
	it('returns the library unchanged for an up-to-date response', () => {
		const library = makeLibrary()
		const result = mergeSyncResponse(library, syncResponse({ status: 'up-to-date' }))

		expect(result).toBe(library)
	})

	it('replaces all three arrays for a full response', () => {
		const result = mergeSyncResponse(makeLibrary(), syncResponse({
			status: 'full',
			movies: [media(99, [watch(2024)])],
			shows: [],
			anime: [media(50, [watch(2020)])],
		}))

		expect(result).toEqual({
			movies: [media(99, [watch(2024)])],
			shows: [],
			anime: [media(50, [watch(2020)])],
		})
	})

	it('is a no-op for an empty delta (the custom-list wake-up)', () => {
		const library = makeLibrary()

		expect(mergeSyncResponse(library, syncResponse({}))).toEqual(library)
	})

	it('replaces an existing item by simklId and appends new ones', () => {
		const updated = media(1, [watch(2022)])
		const result = mergeSyncResponse(makeLibrary(), syncResponse({
			movies: [updated, media(2, [watch(2023)])],
		}))

		expect(result.movies).toEqual([updated, media(2, [watch(2023)])])
	})

	it('preserves the years of an untouched item', () => {
		const library = makeLibrary()
		const result = mergeSyncResponse(library, syncResponse({ movies: [media(1, [watch(2021)])] }))

		expect(result.shows).toEqual(library.shows)
	})

	it('removes a cached item when a delta row carries no watch activity', () => {
		const result = mergeSyncResponse(makeLibrary(), syncResponse({ movies: [media(1, [])] }))

		expect(result.movies).toEqual([])
	})

	it('drops exactly the cached IDs missing from currentIds', () => {
		const library = makeLibrary()
		const result = mergeSyncResponse(library, syncResponse({
			currentIds: { movies: [1], shows: [10], anime: [] },
		}))

		expect(result.movies.map(item => item.simklId)).toEqual([1])
		expect(result.shows.map(item => item.simklId)).toEqual([10])
	})

	it('keeps a re-sent delta item that currentIds still lists', () => {
		const result = mergeSyncResponse(makeLibrary(), syncResponse({
			movies: [media(1, [watch(2022)])],
			currentIds: { movies: [1], shows: [10, 11], anime: [] },
		}))

		expect(result.movies.map(item => item.simklId)).toEqual([1])
	})

	it('drops a re-sent delta item that currentIds omits', () => {
		const result = mergeSyncResponse(makeLibrary(), syncResponse({
			movies: [media(7, [watch(2022)])],
			currentIds: { movies: [1], shows: [10, 11], anime: [] },
		}))

		expect(result.movies.map(item => item.simklId)).toEqual([1])
	})

	it('treats a missing type key in currentIds as an empty set', () => {
		const result = mergeSyncResponse(makeLibrary(), syncResponse({ currentIds: { shows: [10, 11] } }))

		expect(result.movies).toEqual([])
		expect(result.shows.map(item => item.simklId)).toEqual([10, 11])
		expect(result.anime).toEqual([])
	})
})

describe('itemsForTypes', () => {
	it('tags each item with its own type and interleaves the types newest first', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2020, 'January', '2020-01-01T00:00:00Z')])],
			shows: [media(2, [watch(2020, 'June', '2020-06-01T00:00:00Z')])],
			anime: [media(3, [watch(2020, 'March', '2020-03-01T00:00:00Z')])],
		}

		expect(itemsForTypes(library, ['movies', 'shows', 'anime'], 2020).map(item => `${item.type}:${item.simklId}`))
			.toEqual(['shows:2', 'anime:3', 'movies:1'])
	})

	it('preserves the year month and watchedAt of each projected item', () => {
		const library: SimklLibrary = {
			movies: [],
			shows: [],
			anime: [media(3, [watch(2020, 'March', '2020-03-03T00:00:00Z')])],
		}

		expect(itemsForTypes(library, ['anime'], 2020)[0]).toMatchObject({
			simklId: 3,
			type: 'anime',
			month: 'March',
			watchedAt: '2020-03-03T00:00:00Z',
		})
	})

	it('projects only the selected types', () => {
		expect(itemsForTypes(makeLibrary(), ['movies', 'shows'], 2020).map(item => item.simklId)).toEqual([1])
		expect(itemsForTypes(makeLibrary(), ['movies', 'shows'], 2022).map(item => item.simklId)).toEqual([11])
		expect(itemsForTypes(makeLibrary(), ['anime'], 2021)).toEqual([])
	})

	it('returns an empty array for a year with no activity', () => {
		expect(itemsForTypes(makeLibrary(), ['movies', 'shows', 'anime'], 1999)).toEqual([])
	})
})

describe('availableYears', () => {
	it('returns a contiguous descending range from the current year to the earliest watched year', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2018)])],
			shows: [media(2, [watch(2022)])],
			anime: [media(3, [watch(2020)])],
		}

		expect(availableYears(library, 2023)).toEqual([2023, 2022, 2021, 2020, 2019, 2018])
	})

	it('lists the gap years even when nothing was watched in them', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2019)]), media(2, [watch(2021)])],
			shows: [],
			anime: [],
		}

		expect(availableYears(library, 2021)).toEqual([2021, 2020, 2019])
	})

	it('returns only the current year for an empty library', () => {
		expect(availableYears({ movies: [], shows: [], anime: [] }, 2024)).toEqual([2024])
	})

	it('includes the current year even when nothing was watched in it', () => {
		const library: SimklLibrary = { movies: [media(1, [watch(2015)])], shows: [], anime: [] }

		expect(availableYears(library, 2024)).toEqual([2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015])
	})

	it('ignores years after the current year so the range cannot invert', () => {
		const library: SimklLibrary = {
			movies: [media(1, [watch(2030)]), media(2, [watch(2016)])],
			shows: [],
			anime: [],
		}

		expect(availableYears(library, 2024)).toEqual([2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016])
	})
})

describe('simklAvatarUrl', () => {
	it('passes a full URL through unchanged', () => {
		expect(simklAvatarUrl('https://simkl.in/avatars/12/34567_100.jpg')).toBe('https://simkl.in/avatars/12/34567_100.jpg')
	})

	it('appends the documented 100px suffix to a bare path', () => {
		expect(simklAvatarUrl('12/34567.png')).toBe('https://simkl.in/avatars/12/34567_100.png')
	})

	it('honours an explicit size', () => {
		expect(simklAvatarUrl('12/34567.jpg', '256')).toBe('https://simkl.in/avatars/12/34567_256.jpg')
	})

	it('returns null when there is no avatar', () => {
		expect(simklAvatarUrl(null)).toBeNull()
		expect(simklAvatarUrl(undefined)).toBeNull()
		expect(simklAvatarUrl('')).toBeNull()
	})
})
