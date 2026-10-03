import type { SimklActivities, SimklAllItemsResponse, SimklMediaType } from '#lib/types.js'
import type { RequestEvent } from '@sveltejs/kit'
import { auth } from '#lib/auth.js'
import { PUBLIC_SIMKL_CLIENT_ID } from '$app/env/public'

export const SIMKL_API_BASE_URL = 'https://api.simkl.com'
export const SIMKL_USER_AGENT = 'annum/1.0'
export const SIMKL_APP_NAME = 'annum'
export const SIMKL_APP_VERSION = '1.0'

/** Episode-level data needs `extended=full`; `include_all_episodes` covers the completed/dropped buckets. */
const EPISODE_ENRICHMENT = {
	extended: 'full',
	episode_watched_at: 'yes',
	include_all_episodes: 'yes',
} as const

const MAX_ATTEMPTS = 5
const MAX_BACKOFF_MS = 60_000
const TRANSIENT_STATUSES = new Set([500, 502, 503])
const RATE_LIMIT_ERROR = 'rate_limit'
const DAILY_QUOTA_ERRORS = new Set(['user_limit_exceeded', 'app_limit_exceeded'])

export class SimklError extends Error {
	readonly status: number
	readonly code: string | undefined
	readonly retryAfterSeconds: number | undefined

	constructor(status: number, message: string, options?: { code?: string, retryAfterSeconds?: number }) {
		super(message)
		this.name = 'SimklError'
		this.status = status
		this.code = options?.code
		this.retryAfterSeconds = options?.retryAfterSeconds
	}
}

/**
 * Build a Simkl API URL. Every request needs `client_id`, `app-name`, and `app-version`.
 * @example simklUrl('/sync/activities') => 'https://api.simkl.com/sync/activities?client_id=...&app-name=annum&app-version=1.0'
 */
export function simklUrl(path: string, params?: Record<string, string>): string {
	const url = new URL(path, SIMKL_API_BASE_URL)

	url.searchParams.set('client_id', PUBLIC_SIMKL_CLIENT_ID)
	url.searchParams.set('app-name', SIMKL_APP_NAME)
	url.searchParams.set('app-version', SIMKL_APP_VERSION)

	for (const [key, value] of Object.entries(params ?? {}))
		url.searchParams.set(key, value)

	return url.toString()
}

/**
 * Perform a single Simkl GET request. The bearer token is only sent for user-data endpoints.
 */
export function simklFetch(url: string, accessToken?: string): Promise<Response> {
	const headers: Record<string, string> = {
		'User-Agent': SIMKL_USER_AGENT,
	}

	if (accessToken)
		headers.Authorization = `Bearer ${accessToken}`

	return fetch(url, { method: 'GET', headers })
}

function parseRetryAfter(value: string | null): number | undefined {
	if (!value)
		return undefined

	const seconds = Number(value)

	if (Number.isFinite(seconds))
		return seconds

	const date = Date.parse(value)

	return Number.isNaN(date) ? undefined : Math.max(0, Math.round((date - Date.now()) / 1000))
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Run a Simkl GET request, retrying genuinely transient failures.
 *
 * A per-second `rate_limit` 429 clears almost immediately, so it gets a short pause. Daily-quota 429s
 * (`user_limit_exceeded` / `app_limit_exceeded`) reset at midnight and are surfaced instead of retried.
 * Transient 5xx responses use exponential backoff (max 5 attempts, 60s cap).
 */
export async function withRetry(url: string, accessToken?: string): Promise<Response> {
	let attempt = 0

	while (true) {
		const response = await simklFetch(url, accessToken)

		if (response.ok)
			return response

		const body = await response.json().catch(() => null) as { error?: string } | null
		const code = typeof body?.error === 'string' ? body.error : undefined
		const retryAfterSeconds = parseRetryAfter(response.headers.get('retry-after'))

		if (response.status === 429 && code && DAILY_QUOTA_ERRORS.has(code)) {
			throw new SimklError(response.status, `The Simkl daily request quota is exhausted (${code}). Try again in ${retryAfterSeconds ?? 'an unknown number of'} seconds.`, { code, retryAfterSeconds })
		}

		const isRateLimit = response.status === 429 && code === RATE_LIMIT_ERROR
		const isTransient = TRANSIENT_STATUSES.has(response.status)

		attempt += 1

		if ((!isRateLimit && !isTransient) || attempt >= MAX_ATTEMPTS) {
			throw new SimklError(response.status, `Simkl request failed with HTTP ${response.status}${code ? ` (${code})` : ''}.`, { code, retryAfterSeconds })
		}

		const waitMs = isRateLimit
			? Math.min((retryAfterSeconds ?? 1) * 1000, MAX_BACKOFF_MS)
			: Math.min(2 ** attempt * 1000 + Math.random() * 1000, MAX_BACKOFF_MS)

		await sleep(waitMs)
	}
}

export async function simklJson<T>(url: string, accessToken?: string): Promise<T> {
	const response = await withRetry(url, accessToken)

	return await response.json() as T
}

/**
 * Resolve a valid Simkl access token for the signed-in user.
 *
 * `auth.api.getAccessToken` selects the account from the stateless account cookie (Better Auth 1.7
 * resolves the provider from the stored account, so the body names the cookie rather than a provider
 * id) and refreshes an expired token when a refresh token is available; because `storeAccountCookie`
 * is enabled, the SvelteKit cookie plugin applies the refreshed cookie to the response.
 */
export async function getSimklAccessToken(event: RequestEvent): Promise<string | null> {
	try {
		const { accessToken } = await auth.api.getAccessToken({
			body: { useAccountCookie: true },
			headers: event.request.headers,
		})

		return accessToken || null
	}
	catch (e) {
		console.warn(`Failed to obtain a Simkl access token: ${e}`)

		return null
	}
}

/**
 * `GET /sync/activities` - the cheapest call, and the gate for every repeat sync.
 */
export function fetchSimklActivities(token: string): Promise<SimklActivities> {
	return simklJson<SimklActivities>(simklUrl('/sync/activities'), token)
}

/**
 * `GET /sync/all-items/{type}` - the phase 1 full pull for one type. Shows and anime request episode data;
 * movies are atomic and use the default summary.
 */
export function fetchSimklAllItems({ type, token }: { type: SimklMediaType, token: string }): Promise<SimklAllItemsResponse> {
	const params = type === 'movies' ? undefined : { ...EPISODE_ENRICHMENT }

	return simklJson<SimklAllItemsResponse>(simklUrl(`/sync/all-items/${type}`, params), token)
}

/**
 * `GET /sync/all-items?date_from=...` - the phase 2 delta across all three types.
 */
export function fetchSimklDelta({ dateFrom, token }: { dateFrom: string, token: string }): Promise<SimklAllItemsResponse> {
	return simklJson<SimklAllItemsResponse>(simklUrl('/sync/all-items', { date_from: dateFrom, ...EPISODE_ENRICHMENT }), token)
}

/**
 * `GET /sync/all-items?extended=simkl_ids_only` - the tiny ID-only payload used to diff deletions.
 */
export function fetchSimklIdSets(token: string): Promise<SimklAllItemsResponse> {
	return simklJson<SimklAllItemsResponse>(simklUrl('/sync/all-items', { extended: 'simkl_ids_only' }), token)
}
