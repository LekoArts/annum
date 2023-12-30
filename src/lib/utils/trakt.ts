import type { TraktHistoryType, TraktMediaType } from '../types'

export function traktUserUrl(id: string) {
	return `/users/${id}`
}

export function traktWatchedUrl(id: string, type: TraktMediaType) {
	return `/${traktUserUrl(id)}/watched/${type}${type === 'shows' ? '?extended=noseasons' : ''}`
}

export function traktStatsUrl(id: string) {
	return `/${traktUserUrl(id)}/stats`
}

export function traktHistoryUrl(id: string, type: TraktHistoryType) {
	return `/${traktUserUrl(id)}/history/${type}`
}
