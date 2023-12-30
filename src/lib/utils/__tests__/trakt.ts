import { describe, expect, it } from 'vitest'
import { traktUserUrl } from '../trakt'

describe('traktUserUrl', () => {
	it('should return URL with user prefix', () => {
		expect(traktUserUrl('arsaurea')).toBe('/users/arsaurea')
	})
})
