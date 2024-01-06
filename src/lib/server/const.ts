import { PRIVATE_TMDB_API_KEY, PRIVATE_TRAKT_CLIENT_ID } from '$env/static/private'

export const TRAKT_FETCH_DEFAULTS = {
	method: 'GET',
	headers: {
		'user-agent': 'annum',
		'Content-Type': 'application/json',
		'trakt-api-key': PRIVATE_TRAKT_CLIENT_ID,
		'trakt-api-version': '2',
	},
} satisfies RequestInit

export const TMDB_QUERY_DEFAULTS = new URLSearchParams({
	language: 'en-US',
	api_key: PRIVATE_TMDB_API_KEY,
}).toString()
