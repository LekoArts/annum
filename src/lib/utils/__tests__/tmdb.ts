import { describe, expect, it } from 'vitest'
import { calculateSizeWithRatio, tmdbImageUrlsWithDimensions } from '../tmdb'

describe('calculateSizeWithRatio', () => {
	it('should calculate size with ratio', () => {
		const result = calculateSizeWithRatio('w780', 1.5)
		expect(result).toEqual({
			width: 780,
			height: 1170
		})
	})
})

describe('tmdbImageUrlsWithDimensions', () => {
	it('should return image URLs with dimensions', () => {
		const result = tmdbImageUrlsWithDimensions('/abc.jpg')
		expect(result).toEqual({
			w92: {
				url: 'https://image.tmdb.org/t/p/w92/abc.jpg',
				width: 92,
				height: 138
			},
			w154: {
				url: 'https://image.tmdb.org/t/p/w154/abc.jpg',
				width: 154,
				height: 231
			},
			w185: {
				url: 'https://image.tmdb.org/t/p/w185/abc.jpg',
				width: 185,
				height: 277.5
			},
			w342: {
				url: 'https://image.tmdb.org/t/p/w342/abc.jpg',
				width: 342,
				height: 513
			},
			w500: {
				url: 'https://image.tmdb.org/t/p/w500/abc.jpg',
				width: 500,
				height: 750
			},
			w780: {
				url: 'https://image.tmdb.org/t/p/w780/abc.jpg',
				width: 780,
				height: 1170
			}
		})
	})
})