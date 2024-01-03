import { type Writable, writable as internal } from 'svelte/store'

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
	parse(text: string): T
	stringify(object: T): string
}

export type StorageType = 'local' | 'session'

export interface Options {
	onError?: (e: unknown) => void
}

export function persisted<T>(key: string, initialValue: T, options?: Options): Writable<T> {
	const serializer = JSON
	const storageType = 'local'
	const syncTabs = true
	const onError = options?.onError ?? (e => console.error(`Error when writing value from persisted store "${key}" to ${storageType}`, e))
	const browser = typeof (window) !== 'undefined' && typeof (document) !== 'undefined'
	const storage = browser ? localStorage : null

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
			const json = storage?.getItem(key)

			if (json)
				set(<T>serializer.parse(json))

			if (browser && storageType === 'local' && syncTabs) {
				const handleStorage = (event: StorageEvent) => {
					if (event.key === key)
						set(event.newValue ? serializer.parse(event.newValue) : null)
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
