import { accountInitials, accountName, membershipLabel } from '#lib/utils/account.js'
import { describe, expect, it } from 'vitest'

describe('account display', () => {
	it('normalizes empty and repeated whitespace', () => {
		expect(accountName('   ')).toBe('Simkl account')
		expect(accountName('  Sam   Lee ')).toBe('Sam Lee')
		expect(accountInitials(undefined)).toBe('A')
		expect(accountInitials('   ')).toBe('A')
	})
	it('preserves emoji graphemes and non-Latin initials', () => {
		expect(accountInitials('👩🏽‍💻 Priya')).toBe('👩🏽‍💻P')
		expect(accountInitials('王秀英')).toBe('王')
		expect(accountInitials('Đặng Thị Ngọc Hân')).toBe('ĐT')
		expect(accountInitials('J')).toBe('J')
	})
	it('omits missing, invalid and future join dates', () => {
		const now = Date.parse('2026-10-04T12:00:00Z')
		expect(membershipLabel(undefined, now)).toBeNull()
		expect(membershipLabel('not-a-date', now)).toBeNull()
		expect(membershipLabel('2099-01-01', now)).toBeNull()
		expect(membershipLabel('2020-07-01', now)).toBe('July 2020')
		expect(membershipLabel('2025-12-31T23:30:00-08:00', now)).toBe('January 2026')
	})
})
