type MapValuesToKeysIfAllowed<T> = {
	[K in keyof T]: T[K] extends PropertyKey ? K : never;
}
type Filter<T> = MapValuesToKeysIfAllowed<T>[keyof T]

export function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
	arr: Array<T>,
	key: Key,
): Record<T[Key], Array<T>> {
	return arr.reduce((accumulator, val) => {
		const groupedKey = val[key]
		if (!accumulator[groupedKey])
			accumulator[groupedKey] = []

		accumulator[groupedKey].push(val)
		return accumulator
	}, {} as Record<T[Key], Array<T>>)
}
