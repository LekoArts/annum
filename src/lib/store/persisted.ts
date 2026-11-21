import type { Writable } from 'svelte/store'
import { writable as internal } from 'svelte/store'

// Adapted from https://github.com/joshnuss/svelte-persisted-store
// License: MIT

declare type Updater<T> = (value: T) => T
declare interface StoreDict<T> { [key: string]: Writable<T> }

interface Stores {
	local: StoreDict<any>
}

const stores: Stores = {
	local: {},
}

export interface Serializer<T> {
	parse: (text: string) => T
	stringify: (object: T) => string
}

export type StorageType = 'local' | 'session'

export interface Options<T> {
	onError?: (e: unknown) => void
	/** Rejects an obsolete payload so an older stored shape falls back to the initial value. */
	isValid?: (value: unknown) => value is T
	/** Reports a value another tab wrote, so callers can invalidate work that predates it. */
	onExternalChange?: (value: T) => void
}

export function persisted<T>(key: string, initialValue: T, options?: Options<T>): Writable<T> {
	const serializer = JSON
	const storageType = 'local'
	const syncTabs = true
	const onError = options?.onError ?? (e => console.error(`Error when writing value from persisted store "${key}" to ${storageType}`, e))
	const isValid = options?.isValid
	const onExternalChange = options?.onExternalChange

	function readStorage(): Storage | null {
		try {
			return typeof window !== 'undefined' && typeof document !== 'undefined' ? localStorage : null
		}
		catch {
			// Private modes and blocked site data throw on the property itself, not just on writes
			return null
		}
	}

	const storage = readStorage()

	function parse(json: string): T | null {
		try {
			const value: unknown = serializer.parse(json)

			return isValid && !isValid(value) ? null : value as T
		}
		catch (e) {
			onError(e)

			return null
		}
	}

	function read(key: string): T | null {
		try {
			const json = storage?.getItem(key)

			return json ? parse(json) : null
		}
		catch (e) {
			onError(e)

			return null
		}
	}

	function updateStorage(key: string, value: T) {
		try {
			storage?.setItem(key, serializer.stringify(value))
		}
		catch (e) {
			onError(e)
		}
	}

	if (!stores[storageType][key]) {
		const store = internal(initialValue, (set) => {
			const stored = read(key)

			if (stored !== null)
				set(stored)

			if (storage !== null && storageType === 'local' && syncTabs) {
				const handleStorage = (event: StorageEvent) => {
					// `clear()` reports a null key for every entry, so it counts as this store's removal
					if (event.key !== key && event.key !== null)
						return

					// A removed or cleared key means "no stored value", which is the initial value
					const next = event.newValue === null ? initialValue : parse(event.newValue) ?? initialValue

					set(next)
					onExternalChange?.(next)
				}

				window.addEventListener('storage', handleStorage)

				return () => window.removeEventListener('storage', handleStorage)
			}
		})

		const { subscribe, set } = store

		stores[storageType][key] = {
			set(value: T) {
				set(value)
				updateStorage(key, value)
			},
			update(callback: Updater<T>) {
				return store.update((last) => {
					const value = callback(last)

					updateStorage(key, value)

					return value
				})
			},
			subscribe,
		}
	}

	return stores[storageType][key]
}
