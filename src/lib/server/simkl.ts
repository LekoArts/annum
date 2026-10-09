import type { SimklActivities, SimklAllItemsResponse, SimklMediaType } from '#lib/types.js'
import type { RequestEvent } from '@sveltejs/kit'
import { auth } from '#lib/auth.js'
import { SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'
import { PUBLIC_SIMKL_CLIENT_ID } from '$app/env/public'

export const SIMKL_API_BASE_URL = 'https://api.simkl.com'
export const SIMKL_USER_AGENT = 'annum/1.0'
export const SIMKL_APP_NAME = 'annum'
export const SIMKL_APP_VERSION = '1.0'

/**
 * Episode-level data needs `extended=full`; `include_all_episodes` covers the completed/dropped
 * buckets. `original` is the lighter of its two values: `yes` adds a row for every episode of every
 * completed show, and those synthesized rows only ever carry the show's last-watched time, which
 * `last_watched_at` already provides.
 */
const EPISODE_ENRICHMENT = {
	extended: 'full',
	episode_watched_at: 'yes',
	include_all_episodes: 'original',
} as const

const MAX_ATTEMPTS = 5
const MAX_BACKOFF_MS = 60_000
/** Simkl asks for a short pause on a per-second `rate_limit`, not a backoff. */
const RATE_LIMIT_PAUSE_MS = 1000
const RATE_LIMIT_JITTER_MS = 250
const TRANSIENT_STATUSES = new Set([500, 502, 503])
const RATE_LIMIT_ERROR = 'rate_limit'
const DAILY_QUOTA_ERRORS = new Set(['user_limit_exceeded', 'app_limit_exceeded'])
const MAX_ITEMS_ERROR = 'max_items'
/** One status per call is the finest split Simkl offers, so a library that still refuses has no way back. */
const TOO_LARGE_MESSAGE = 'Your Simkl library is too large to sync. Simkl refuses to return it even one status at a time.'
/** The split buckets of `/sync/all-items/{type}/{status}`; movies have no `watching` or `hold`. */
const TYPE_STATUSES: Record<SimklMediaType, ReadonlyArray<string>> = {
	movies: ['plantowatch', 'completed', 'dropped'],
	shows: ['watching', 'plantowatch', 'hold', 'completed', 'dropped'],
	anime: ['watching', 'plantowatch', 'hold', 'completed', 'dropped'],
}

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

/** Simkl API URL with the `client_id`, `app-name` and `app-version` every request needs. */
export function simklUrl(path: string, params?: Record<string, string>): string {
	const url = new URL(path, SIMKL_API_BASE_URL)

	url.searchParams.set('client_id', PUBLIC_SIMKL_CLIENT_ID)
	url.searchParams.set('app-name', SIMKL_APP_NAME)
	url.searchParams.set('app-version', SIMKL_APP_VERSION)

	for (const [key, value] of Object.entries(params ?? {}))
		url.searchParams.set(key, value)

	return url.toString()
}

/** A single Simkl GET; the bearer token is only sent for user-data endpoints. */
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

/** Simkl's debugging contract: log the `error` value and status next to the URL that produced them. */
function logSimklFailure(url: string, status: number, code?: string): void {
	console.warn(`Simkl request failed: ${status}${code ? ` (${code})` : ''} ${url}`)
}

/**
 * Simkl GET with retries for transient failures: a per-second `rate_limit` 429 gets a short pause, 5xx
 * an exponential backoff (max 5 attempts, 60s). Daily-quota 429s reset at midnight and are surfaced.
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
			logSimklFailure(url, response.status, code)

			throw new SimklError(response.status, `The Simkl daily request quota is exhausted (${code}). Try again in ${retryAfterSeconds ?? 'an unknown number of'} seconds.`, { code, retryAfterSeconds })
		}

		const isRateLimit = response.status === 429 && code === RATE_LIMIT_ERROR
		const isTransient = TRANSIENT_STATUSES.has(response.status)

		attempt += 1

		if ((!isRateLimit && !isTransient) || attempt >= MAX_ATTEMPTS) {
			logSimklFailure(url, response.status, code)

			throw new SimklError(response.status, `Simkl request failed with HTTP ${response.status}${code ? ` (${code})` : ''}.`, { code, retryAfterSeconds })
		}

		// `Retry-After` on a `rate_limit` carries the daily reset, so it must not be honoured here
		const waitMs = isRateLimit
			? RATE_LIMIT_PAUSE_MS + Math.random() * RATE_LIMIT_JITTER_MS
			: Math.min(2 ** attempt * 1000 + Math.random() * 1000, MAX_BACKOFF_MS)

		// Retries are otherwise invisible in the logs, which made the earlier 429 investigation guesswork
		console.warn(`Simkl request retrying in ${Math.round(waitMs)}ms (attempt ${attempt}/${MAX_ATTEMPTS}) after HTTP ${response.status}${code ? ` (${code})` : ''} ${url}`)

		await sleep(waitMs)
	}
}

export async function simklJson<T>(url: string, accessToken?: string): Promise<T> {
	const response = await withRetry(url, accessToken)

	return await response.json() as T
}

function isMaxItemsError(e: unknown): boolean {
	return e instanceof SimklError && e.code === MAX_ITEMS_ERROR
}

/** A split response keeps the `{ type: [...] }` envelope and omits empty buckets, so only non-empty keys merge. */
function mergeAllItemsResponses(responses: Array<SimklAllItemsResponse>): SimklAllItemsResponse {
	const merged: SimklAllItemsResponse = {}

	for (const response of responses) {
		for (const type of SIMKL_MEDIA_TYPES) {
			const items = response[type]

			if (items?.length)
				merged[type] = [...(merged[type] ?? []), ...items]
		}
	}

	return merged
}

/**
 * Simkl's remedy for `400 max_items`: a retry returns the same refusal, so the request has to change to one
 * status per call. The params are replayed verbatim to keep the merged payload identical to the single call,
 * and only libraries Simkl refuses outright ever pay for these extra requests.
 */
async function fetchAllItemsByStatus({ types, params, token }: { types: ReadonlyArray<SimklMediaType>, params: Record<string, string> | undefined, token: string }): Promise<SimklAllItemsResponse> {
	const responses: Array<SimklAllItemsResponse> = []

	try {
		for (const type of types) {
			for (const status of TYPE_STATUSES[type])
				responses.push(await simklJson<SimklAllItemsResponse>(simklUrl(`/sync/all-items/${type}/${status}`, params), token))
		}
	}
	catch (e) {
		if (!isMaxItemsError(e))
			throw e

		throw new SimklError(400, TOO_LARGE_MESSAGE, { code: MAX_ITEMS_ERROR })
	}

	return mergeAllItemsResponses(responses)
}

/** Resolve (and refresh) the signed-in user's Simkl token from Better Auth's stateless account cookie. */
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

/** `GET /sync/activities` - the cheapest call and the gate for every repeat sync. */
export function fetchSimklActivities(token: string): Promise<SimklActivities> {
	return simklJson<SimklActivities>(simklUrl('/sync/activities'), token)
}

/** `GET /sync/all-items/{type}` - the full pull for one type; only shows and anime need episode data. */
export async function fetchSimklAllItems({ type, token }: { type: SimklMediaType, token: string }): Promise<SimklAllItemsResponse> {
	const params = type === 'movies' ? undefined : { ...EPISODE_ENRICHMENT }

	try {
		return await simklJson<SimklAllItemsResponse>(simklUrl(`/sync/all-items/${type}`, params), token)
	}
	catch (e) {
		if (!isMaxItemsError(e))
			throw e

		console.warn(`Simkl refused /sync/all-items/${type} with max_items; retrying one status per call`)

		return await fetchAllItemsByStatus({ types: [type], params, token })
	}
}

/** `GET /sync/all-items?date_from=...` - the delta across all three types. */
export async function fetchSimklDelta({ dateFrom, token }: { dateFrom: string, token: string }): Promise<SimklAllItemsResponse> {
	const params = { date_from: dateFrom, ...EPISODE_ENRICHMENT }

	try {
		return await simklJson<SimklAllItemsResponse>(simklUrl('/sync/all-items', params), token)
	}
	catch (e) {
		if (!isMaxItemsError(e))
			throw e

		// A delta after a long gap is the same oversized response, so it splits the same way
		console.warn('Simkl refused the date_from delta with max_items; retrying one status per call')

		return await fetchAllItemsByStatus({ types: SIMKL_MEDIA_TYPES, params, token })
	}
}

/** `GET /sync/all-items?extended=simkl_ids_only` - the ID-only payload used to diff deletions. */
export function fetchSimklIdSets(token: string): Promise<SimklAllItemsResponse> {
	return simklJson<SimklAllItemsResponse>(simklUrl('/sync/all-items', { extended: 'simkl_ids_only' }), token)
}
