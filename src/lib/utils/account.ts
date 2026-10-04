const WHITESPACE = /\s+/g

export function accountName(name: string | null | undefined): string {
	return name?.trim().replace(WHITESPACE, ' ') || 'Simkl account'
}

export function accountInitials(name: string | null | undefined): string {
	const words = name?.trim().split(WHITESPACE).filter(Boolean) ?? []
	if (!words.length)
		return 'A'
	const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
	return words.slice(0, 2).map(word => Array.from(segmenter.segment(word))[0]?.segment.toUpperCase() ?? '').join('')
}

export function membershipLabel(joinedAt: string | null | undefined, now = Date.now()): string | null {
	if (!joinedAt)
		return null
	const date = new Date(joinedAt)
	if (!Number.isFinite(date.getTime()) || date.getTime() > now)
		return null
	return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}
