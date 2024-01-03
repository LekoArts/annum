export const TRAKT_BASE_URL = 'https://api.trakt.tv'
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3/'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'
export const GITHUB_REPO_URL = 'https://github.com/LekoArts/trakt-yearly-posters'
export const CURRENT_YEAR = new Date().getFullYear()
export const SKIP_TO_CONTENT_ID = 'skip-to-content'

export const TYPE_NAMES = {
	movie: 'Movie',
	show: 'Show',
} as const

export const TMDB_POSTER_SIZES = {
	w92: 'w92',
	w154: 'w154',
	w185: 'w185',
	w342: 'w342',
	w500: 'w500',
	w780: 'w780',
} as const

export const TMDB_FETCH_DEFAULTS = {
	method: 'GET',
	headers: {
		'user-agent': 'trakt-yearly-posters',
	},
} satisfies RequestInit

export const DEFAULT_CACHE_HEADER = {
	'cache-control': 'max-age=3600',
} as const

export const PAGINATION_LIMIT = '10'

export const LANGUAGES = [
	{
		id: 'ar',
		name: 'العربية',
	},
	{
		id: 'cn',
		name: '广州话 / 廣州話',
	},
	{
		id: 'de',
		name: 'Deutsch',
	},
	{
		id: 'el',
		name: 'ελληνικά',
	},
	{
		id: 'en',
		name: 'English',
	},
	{
		id: 'es',
		name: 'Español',
	},
	{
		id: 'fr',
		name: 'Français',
	},
	{
		id: 'it',
		name: 'Italiano',
	},
	{
		id: 'ja',
		name: '日本語',
	},
	{
		id: 'ko',
		name: '한국어/조선말',
	},
	{
		id: 'pl',
		name: 'Polski',
	},
	{
		id: 'pt',
		name: 'Português',
	},
	{
		id: 'ru',
		name: 'Pусский',
	},
	{
		id: 'uk',
		name: 'Український',
	},
	{
		id: 'zh',
		name: '普通话',
	},
] as const
