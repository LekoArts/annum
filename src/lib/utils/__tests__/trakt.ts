import { describe, expect, it } from 'vitest'
import { filterUniqueShowsFromHistory, traktHistoryUrl, traktStatsUrl, traktUserUrl, traktWatchedUrl } from '../trakt'
import { normalizeItem } from '..'
import { mergedNames, showsPageOne, showsPageOneNames, showsPageTwo, showsPageTwoNames } from './__fixtures__/history.shows'

const normalizedShowsPageOne = showsPageOne.map(normalizeItem as any)
const normalizedShowsPageTwo = showsPageTwo.map(normalizeItem as any)

describe('traktUserUrl', () => {
	it('should return URL with user prefix', () => {
		expect(traktUserUrl('arsaurea')).toBe('/users/arsaurea')
	})
})

describe('traktHistoryUrl', () => {
	it('should return URL for movies', () => {
		expect(traktHistoryUrl('arsaurea', 'movies')).toBe('/users/arsaurea/history/movies')
	})
	it('should return URL for shows', () => {
		expect(traktHistoryUrl('arsaurea', 'shows')).toBe('/users/arsaurea/history/shows')
	})
})

describe('traktStatsUrl', () => {
	it('should return URL with stats prefix', () => {
		expect(traktStatsUrl('arsaurea')).toBe('/users/arsaurea/stats')
	})
})

describe('traktWatchedUrl', () => {
	it('should return URL for movies', () => {
		expect(traktWatchedUrl('arsaurea', 'movies')).toBe('/users/arsaurea/watched/movies')
	})
	it('should return URL for shows', () => {
		expect(traktWatchedUrl('arsaurea', 'shows')).toBe('/users/arsaurea/watched/shows?extended=noseasons')
	})
})

describe('filterUniqueShowsFromHistory', () => {
	describe('error handling', () => {
		it('should return empty array if no history is passed', () => {
			expect(filterUniqueShowsFromHistory(undefined as any)).toEqual([])
		})
		it('should return empty array if history is not an array', () => {
			expect(filterUniqueShowsFromHistory({} as any)).toEqual([])
		})
		it('should return empty array if history is empty', () => {
			expect(filterUniqueShowsFromHistory([])).toEqual([])
		})
	})
	describe('functionality', () => {
		it('should return unique shows from history', () => {
			const o = filterUniqueShowsFromHistory(normalizedShowsPageOne as any)
			expect(o.map(i => i.title)).toEqual(expect.arrayContaining([...showsPageOneNames]))

			const v = filterUniqueShowsFromHistory(normalizedShowsPageTwo as any)
			expect(v.map(i => i.title)).toEqual(expect.arrayContaining([...showsPageTwoNames]))
		})
		it('should return unique shows in correct order', () => {
			const o = filterUniqueShowsFromHistory(normalizedShowsPageOne as any)
			expect(o.map(i => i.title)).toEqual(showsPageOneNames)

			const v = filterUniqueShowsFromHistory(normalizedShowsPageTwo as any)
			expect(v.map(i => i.title)).toEqual(showsPageTwoNames)
		})
		it('should return unique shows from merged history', () => {
			const o = filterUniqueShowsFromHistory([...normalizedShowsPageOne, ...normalizedShowsPageTwo] as any)
			expect(o.map(i => i.title)).toEqual(mergedNames)
		})
	})
})
