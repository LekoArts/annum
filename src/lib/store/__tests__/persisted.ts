// @vitest-environment happy-dom
import { get } from 'svelte/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const KEY = 'annum-test-store'
const originalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage')

interface Counter {
	value: number
}

function isCounter(value: unknown): value is Counter {
	return typeof value === 'object' && value !== null && typeof (value as Counter).value === 'number'
}

beforeEach(() => {
	vi.resetModules()
	localStorage.clear()
})

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()

	// Restoring the descriptor matters when a test made the property itself throw
	if (originalStorage)
		Object.defineProperty(window, 'localStorage', originalStorage)
})

describe('persisted', () => {
	it('falls back to the initial value when the stored payload is unreadable', async () => {
		localStorage.setItem(KEY, '{not json')
		const { persisted } = await import('../persisted')
		const errors: Array<unknown> = []
		const store = persisted(KEY, { value: 1 }, { onError: e => errors.push(e) })

		expect(get(store)).toEqual({ value: 1 })
		expect(errors).toHaveLength(1)
	})

	it('keeps working when reading localStorage throws at import time', async () => {
		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			get() {
				throw new Error('storage blocked')
			},
		})
		const { persisted } = await import('../persisted')
		const store = persisted(KEY, { value: 1 })

		expect(get(store)).toEqual({ value: 1 })

		store.set({ value: 2 })

		expect(get(store)).toEqual({ value: 2 })
	})

	it('restores the initial value when another tab removes the key', async () => {
		const { persisted } = await import('../persisted')
		const store = persisted(KEY, { value: 1 })
		const seen: Array<Counter> = []
		// A mounted component holds the subscription, which is what keeps the cross-tab listener alive
		const unsubscribe = store.subscribe((value) => {
			seen.push(value)
		})

		store.set({ value: 2 })
		localStorage.removeItem(KEY)
		window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: null }))
		unsubscribe()

		expect(seen.at(-1)).toEqual({ value: 1 })
	})

	it('rejects an obsolete payload shape', async () => {
		localStorage.setItem(KEY, JSON.stringify({ legacy: true }))
		const { persisted } = await import('../persisted')
		const store = persisted<Counter>(KEY, { value: 1 }, { isValid: isCounter })

		expect(get(store)).toEqual({ value: 1 })
	})
})

describe('library cache shape', () => {
	it('ignores a stored cache that predates the current shape', async () => {
		localStorage.setItem('annum-simkl-library', JSON.stringify({ accountId: '12345', watched: [] }))
		const { claimLibrary, library } = await import('../library')

		claimLibrary('12345')

		expect(get(library).accountId).toBeNull()
		expect(get(library).movies).toEqual([])
	})
})
