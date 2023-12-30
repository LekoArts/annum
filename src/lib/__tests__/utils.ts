import { describe, expect, it } from 'vitest'
import { chunks, getStartAndEndOfYear } from '../utils'

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
})

describe('getStartAndEndOfYear', () => {
	it('should return start and end of year', () => {
		const result = getStartAndEndOfYear(2023)
		expect(result).toMatchInlineSnapshot(`
      {
        "end": "2023-12-30T23:00:00.000Z",
        "start": "2022-12-31T23:00:00.000Z",
      }
    `)
	})
})