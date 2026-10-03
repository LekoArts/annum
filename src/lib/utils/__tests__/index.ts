import { describe, expect, it } from 'vitest'
import { groupBy } from '../index'

describe('groupBy', () => {
	it('should group array elements by the specified key', () => {
		const arr = [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
			{ id: 3, name: 'John' },
			{ id: 4, name: 'Jane' },
		]

		const result = groupBy(arr, 'name')

		expect(result).toEqual({
			John: [
				{ id: 1, name: 'John' },
				{ id: 3, name: 'John' },
			],
			Jane: [
				{ id: 2, name: 'Jane' },
				{ id: 4, name: 'Jane' },
			],
		})
	})
	it('should return an empty object if the array is empty', () => {
		const arr: Array<any> = []
		const result = groupBy(arr, 'name')
		expect(result).toEqual({})
	})
	it('should handle arrays with duplicate keys', () => {
		const arr = [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'John' },
			{ id: 3, name: 'John' },
		]

		const result = groupBy(arr, 'name')

		expect(result).toEqual({
			John: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'John' },
				{ id: 3, name: 'John' },
			],
		})
	})
})
