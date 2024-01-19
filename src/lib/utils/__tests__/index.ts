import { describe, expect, it } from 'vitest'
import { capitalize, chunks, filterForYear, getStartAndEndOfYear, lastWatchedMonth, lastWatchedYear, normalizeItem } from '../index'
import { historyMovies, historyShows, watchedMovies, watchedShows } from './__fixtures__/normalize'

describe('chunks', () => {
	it('should split array into chunks', () => {
		const array = [1, 2, 3, 4, 5, 6]
		const n = 2
		const result = chunks(array, n)
		expect(result).toEqual([[1, 2], [3, 4], [5, 6]])
	})
	it('should split odd array into chunks', () => {
		const array = [1, 2, 3, 4, 5]
		const n = 2
		const result = chunks(array, n)
		expect(result).toEqual([[1, 2], [3, 4], [5]])
	})
	it('should handle empty array', () => {
		const array: [] = []
		const n = 2
		const result = chunks(array, n)
		expect(result).toEqual([])
	})
	it('should handle n as string', () => {
		const array = [1, 2, 3, 4, 5]
		const n = '2'
		const result = chunks(array, n)
		expect(result).toEqual([[1, 2], [3, 4], [5]])
	})
})

describe('getStartAndEndOfYear', () => {
	it('should return start and end of year', () => {
		const result = getStartAndEndOfYear(2023)
		expect(result).toMatchInlineSnapshot(`
      {
        "end": "2023-12-31T00:00:00.000Z",
        "start": "2023-01-01T00:00:00.000Z",
      }
    `)
	})
	it('handles year as string', () => {
		const result = getStartAndEndOfYear('2023')
		expect(result).toMatchInlineSnapshot(`
			{
			  "end": "2023-12-31T00:00:00.000Z",
			  "start": "2023-01-01T00:00:00.000Z",
			}
		`)
	})
})

describe('filterForYear', () => {
	it('should return true if item matches year', () => {
		const item: any = {
			last_watched_at_year: 2020,
		}
		const year = 2020
		const result = filterForYear(item, year)
		expect(result).toBe(true)
	})
	it('should return false if item does not match year', () => {
		const item: any = {
			last_watched_at_year: 2020,
		}
		const year = 2021
		const result = filterForYear(item, year)
		expect(result).toBe(false)
	})
	it('should handle year as string', () => {
		const item: any = {
			last_watched_at_year: 2020,
		}
		const year = '2020'
		const result = filterForYear(item, year)
		expect(result).toBe(true)
	})
})

describe('normalizeItem', () => {
	it('returns an empty object if the input is invalid', () => {
		const result = normalizeItem({} as any)
		expect(result).toEqual({})
	})
	it('transforms a /watched/shows response', () => {
		const result = normalizeItem(watchedShows)
		expect(result).toMatchInlineSnapshot(`
			{
			  "last_watched_at": "2024-01-04T10:51:27.000Z",
			  "last_watched_at_year": 2024,
			  "plays": 45,
			  "release_year": 2022,
			  "title": "Jet Lag: The Game",
			  "tmdb_id": 237761,
			  "trakt_id": 202731,
			}
		`)
		expect(result.title).toBe(watchedShows.show.title)
	})
	it('transforms a /watched/movies response', () => {
		const result = normalizeItem(watchedMovies)
		expect(result).toMatchInlineSnapshot(`
			{
			  "last_watched_at": "2019-12-22T13:25:00.000Z",
			  "last_watched_at_year": 2019,
			  "release_year": 2001,
			  "title": "Harry Potter and the Philosopher's Stone",
			  "tmdb_id": 671,
			  "trakt_id": 545,
			}
		`)
		expect(result.title).toBe(watchedMovies.movie.title)
	})
	it('transforms a /history/movies response', () => {
		const result = normalizeItem(historyMovies)
		expect(result).toMatchInlineSnapshot(`
			{
			  "last_watched_at": "2023-12-30T21:42:56.000Z",
			  "last_watched_at_year": 2023,
			  "release_year": 1983,
			  "title": "Scarface",
			  "tmdb_id": 111,
			  "trakt_id": 80,
			}
		`)
		expect(result.title).toBe(historyMovies.movie.title)
	})
	it('transforms a /history/shows response', () => {
		const result = normalizeItem(historyShows)
		expect(result).toMatchInlineSnapshot(`
			{
			  "last_watched_at": "2023-12-30T19:13:09.000Z",
			  "last_watched_at_year": 2023,
			  "release_year": 2023,
			  "title": "Frieren: Beyond Journey's End",
			  "tmdb_id": 209867,
			  "trakt_id": 198225,
			}
		`)
		expect(result.title).toBe(historyShows.show.title)
	})
})

describe('capitalize', () => {
	it('should capitalize a string', () => {
		const result = capitalize('hello')
		expect(result).toBe('Hello')
	})
	it('should handle empty string', () => {
		const result = capitalize('')
		expect(result).toBe('')
	})
	it('should leave rest of string untouched', () => {
		const result = capitalize('hello world')
		expect(result).toBe('Hello world')
	})
})

describe('lastWatchedYear', () => {
	it('should return the correct year', () => {
		const year = lastWatchedYear('2022-01-01')
		expect(year).toBe(2022)
	})
	it('should handle different date formats', () => {
		const year = lastWatchedYear('12/31/2021')
		expect(year).toBe(2021)

		const year2 = lastWatchedYear('2023-11-30T21:42:56.000Z')
		expect(year2).toBe(2023)
	})
	it('should handle invalid dates', () => {
		const year = lastWatchedYear('invalid date')
		expect(year).toBeNaN()
	})
})

describe('lastWatchedMonth', () => {
	it('should return the correct year', () => {
		const year = lastWatchedMonth('2022-01-01')
		expect(year).toBe('January')
	})
	it('should handle different date formats', () => {
		const year = lastWatchedMonth('12/31/2021')
		expect(year).toBe('December')

		const year2 = lastWatchedMonth('2023-11-30T21:42:56.000Z')
		expect(year2).toBe('November')
	})
	it('should handle invalid dates', () => {
		const year = lastWatchedMonth('invalid date')
		expect(year).toBe('Invalid Date')
	})
})
