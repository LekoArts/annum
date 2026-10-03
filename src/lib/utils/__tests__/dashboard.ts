import type { SimklMediaType } from '#lib/types.js'
import { describe, expect, it } from 'vitest'
import { dashboardSearch, describeSelection, resolveSelectedTypes, resolveYear } from '../dashboard'

const ALL_TYPES: Array<SimklMediaType> = ['movies', 'shows', 'anime']
const YEARS = [2024, 2023, 2022]

function params(search = ''): URLSearchParams {
	return new URLSearchParams(search)
}

describe('resolveSelectedTypes', () => {
	it('defaults to all three types when the parameter is absent', () => {
		expect(resolveSelectedTypes(params())).toEqual(ALL_TYPES)
	})

	it('defaults to all three for an empty parameter', () => {
		expect(resolveSelectedTypes(params('types='))).toEqual(ALL_TYPES)
	})

	it('defaults to all three when only unknown values are given', () => {
		expect(resolveSelectedTypes(params('types=books,music'))).toEqual(ALL_TYPES)
	})

	it('keeps a single valid type', () => {
		expect(resolveSelectedTypes(params('types=anime'))).toEqual(['anime'])
	})

	it('keeps a pair and returns it in canonical order', () => {
		expect(resolveSelectedTypes(params('types=anime,movies'))).toEqual(['movies', 'anime'])
	})

	it('deduplicates repeated types', () => {
		expect(resolveSelectedTypes(params('types=shows,shows,movies'))).toEqual(['movies', 'shows'])
	})

	it('drops unknown values next to valid ones', () => {
		expect(resolveSelectedTypes(params('types=movies,books'))).toEqual(['movies'])
	})

	it('returns all three in canonical order for an explicit full selection', () => {
		expect(resolveSelectedTypes(params('types=anime,movies,shows'))).toEqual(ALL_TYPES)
	})
})

describe('resolveYear', () => {
	it('defaults to the current year when absent', () => {
		expect(resolveYear(params(), YEARS, 2024)).toBe(2024)
	})

	it('defaults to the current year for an empty value', () => {
		expect(resolveYear(params('year='), YEARS, 2024)).toBe(2024)
	})

	it('defaults to the current year for a non-numeric value', () => {
		expect(resolveYear(params('year=abc'), YEARS, 2024)).toBe(2024)
	})

	it('accepts a year inside the available range', () => {
		expect(resolveYear(params('year=2022'), YEARS, 2024)).toBe(2022)
	})

	it('falls back to the current year below the available range', () => {
		expect(resolveYear(params('year=1999'), YEARS, 2024)).toBe(2024)
	})

	it('falls back to the current year above the current year', () => {
		expect(resolveYear(params('year=2030'), YEARS, 2024)).toBe(2024)
	})

	it('accepts the current year itself', () => {
		expect(resolveYear(params('year=2024'), YEARS, 2024)).toBe(2024)
	})
})

describe('dashboardSearch', () => {
	it('returns an empty string for the current year with all three types', () => {
		expect(dashboardSearch({ year: 2024, types: ALL_TYPES, currentYear: 2024 })).toBe('')
	})

	it('writes the year for anything other than the current year', () => {
		expect(dashboardSearch({ year: 2015, types: ALL_TYPES, currentYear: 2024 })).toBe('?year=2015')
	})

	it('writes a subset of types in canonical order', () => {
		expect(dashboardSearch({ year: 2024, types: ['anime', 'movies'], currentYear: 2024 })).toBe('?types=movies,anime')
	})

	it('writes both parameters with the year first', () => {
		expect(dashboardSearch({ year: 2015, types: ['anime'], currentYear: 2024 })).toBe('?year=2015&types=anime')
	})

	it('omits types for a reordered full selection', () => {
		expect(dashboardSearch({ year: 2015, types: ['anime', 'movies', 'shows'], currentYear: 2024 })).toBe('?year=2015')
	})

	it('cannot express an empty selection', () => {
		expect(dashboardSearch({ year: 2024, types: [], currentYear: 2024 })).toBe('')
		expect(dashboardSearch({ year: 2015, types: [], currentYear: 2024 })).toBe('?year=2015')
	})
})

describe('describeSelection', () => {
	it('names a single type', () => {
		expect(describeSelection(['movies'])).toBe('Movies')
		expect(describeSelection(['shows'])).toBe('Shows')
		expect(describeSelection(['anime'])).toBe('Anime')
	})

	it('joins two types with an ampersand', () => {
		expect(describeSelection(['movies', 'shows'])).toBe('Movies & Shows')
		expect(describeSelection(['shows', 'anime'])).toBe('Shows & Anime')
	})

	it('joins three types with commas and a final ampersand', () => {
		expect(describeSelection(ALL_TYPES)).toBe('Movies, Shows & Anime')
	})

	it('uses canonical order whatever the input order', () => {
		expect(describeSelection(['anime', 'movies', 'shows'])).toBe('Movies, Shows & Anime')
		expect(describeSelection(['anime', 'movies'])).toBe('Movies & Anime')
	})
})
