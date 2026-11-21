import type { Page, Route } from '@playwright/test'
import { expect } from '@playwright/test'

export interface FixtureWatch {
	year: number
	month: string
	watchedAt: string
}

export interface FixtureItem {
	simklId: number
	slug: string
	title: string
	year: number
	poster: string | null
	watched: Array<FixtureWatch>
}

export interface FixtureLibrary {
	movies: Array<FixtureItem>
	shows: Array<FixtureItem>
	anime: Array<FixtureItem>
}

function item(simklId: number, title: string, year: number, month: string, watchedAt: string): FixtureItem {
	// Posters stay null so every tile uses the local placeholder and no image request leaves the browser
	return { simklId, slug: title.toLowerCase().replaceAll(' ', '-'), title, year, poster: null, watched: [{ year, month, watchedAt }] }
}

export const LIBRARY: FixtureLibrary = {
	movies: [
		item(101, 'Dune', 2021, 'October', '2021-10-22T00:00:00Z'),
		item(102, 'Everything Everywhere', 2022, 'April', '2022-04-08T00:00:00Z'),
	],
	shows: [item(201, 'The Bear', 2022, 'June', '2022-06-23T00:00:00Z')],
	anime: [item(301, 'Cowboy Bebop', 1998, 'April', '1998-04-03T00:00:00Z')],
}

/**
 * Shaped like the real `/sync/activities` payload, including the domains and fields the app ignores, so
 * the anchor the client echoes back is exercised at its real size and nesting.
 */
export const ACTIVITIES = {
	all: '2026-10-04T09:00:00Z',
	settings: { all: '2026-08-07T16:37:33Z' },
	tv_shows: {
		all: '2026-10-03T20:00:01Z',
		rated_at: '2026-09-20T05:49:12Z',
		playback: null,
		plantowatch: '2026-09-16T20:56:12Z',
		watching: '2026-10-03T20:00:01Z',
		completed: '2026-09-19T17:28:09Z',
		hold: null,
		dropped: null,
		removed_from_list: '2026-09-16T20:56:12Z',
	},
	anime: {
		all: '2026-10-04T17:00:01Z',
		rated_at: null,
		playback: null,
		plantowatch: null,
		watching: '2026-10-04T17:00:01Z',
		completed: null,
		hold: null,
		dropped: null,
		removed_from_list: null,
	},
	movies: {
		all: '2026-09-19T22:26:14Z',
		rated_at: '2026-09-19T22:26:14Z',
		playback: null,
		plantowatch: null,
		completed: '2026-09-19T22:26:14Z',
		dropped: null,
		removed_from_list: '2026-09-01T00:00:00Z',
	},
	custom_lists: { lists: { all: null, regular: null, favorites: null, recommendations: null, auto: null } },
}

/** The saved anchor a sync request asks the server to diff against. */
export function syncAnchor(url: string): unknown {
	return JSON.parse(new URL(url).searchParams.get('activities') ?? '{}')
}

export interface SyncStub {
	/** Every sync URL the page has requested, in order. */
	requests: Array<string>
	/** Make the remaining responses fail, as Simkl or the endpoint would. */
	failWith: (status: number, message: string) => void
	restore: () => void
	/** Hold every response so a test can observe what the page does while a sync is in flight. */
	hold: () => void
	release: () => void
}

/** Answers the dashboard's own sync endpoint, so the browser suite never talks to Simkl. */
export async function stubSync(page: Page, library: FixtureLibrary | ((accountId: string) => FixtureLibrary)): Promise<SyncStub> {
	const requests: Array<string> = []
	const waiting: Array<() => void> = []
	let failure: { status: number, message: string } | null = null
	let accountId: string | null = null
	let holding = false

	async function currentAccountId(): Promise<string> {
		if (accountId !== null)
			return accountId

		const response = await page.request.get('/api/auth/get-session')
		const body = await response.json() as { user?: { id?: string } } | null
		accountId = body?.user?.id ?? ''

		return accountId
	}

	await page.route('**/api/simkl/sync**', async (route: Route) => {
		requests.push(route.request().url())

		if (holding)
			await new Promise<void>(resolve => waiting.push(resolve))

		if (failure !== null) {
			await route.fulfill({ status: failure.status, contentType: 'application/json', body: JSON.stringify({ message: failure.message }) })

			return
		}

		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				accountId: await currentAccountId(),
				status: 'delta',
				activities: ACTIVITIES,
				...(typeof library === 'function' ? library(await currentAccountId()) : library),
			}),
		})
	})

	return {
		requests,
		failWith(status, message) {
			failure = { status, message }
		},
		restore() {
			failure = null
		},
		hold() {
			holding = true
		},
		release() {
			holding = false
			waiting.splice(0).forEach(resolve => resolve())
		},
	}
}

/**
 * Completes a real Better Auth sign-in without Simkl: the authorize redirect, code exchange and profile
 * read are intercepted, so the session cookie is issued by the shipped callback handler.
 */
export async function signIn(page: Page, { account = 8798305 } = {}): Promise<void> {
	await authenticate(page, account)
	await page.goto('/dashboard')
}

/**
 * Creates the session without mounting the dashboard, so a test can land on a deep link as the very first
 * dashboard render and see the cold path.
 */
export async function authenticate(page: Page, account = 8798305): Promise<void> {
	let authorize: URL | null = null

	await page.route('https://simkl.com/**', async (route) => {
		authorize = new URL(route.request().url())
		await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Simkl</p>' })
	})

	await page.goto('/sign-in')
	await page.getByRole('button', { name: 'Connect with Simkl' }).click()
	await expect.poll(() => authorize?.searchParams.get('state') ?? '').not.toBe('')

	const state = authorize!.searchParams.get('state')!

	// The mock reads the Simkl account out of the code, so parallel tests never share an account
	const callback = await page.request.get(`/api/auth/callback/simkl?code=e2e-${account}&state=${encodeURIComponent(state)}`, { maxRedirects: 0 })

	expect(callback.status()).toBe(302)
}

/** Signs in, lands on a year the fixture data covers, and waits for the grid to fill. */
export async function openDashboard(page: Page, { library = LIBRARY, year = 2022, types = 'movies,shows', account = 8798305 } = {}): Promise<SyncStub> {
	const sync = await stubSync(page, library)

	await signIn(page, { account })
	await page.goto(`/dashboard?year=${year}&types=${types}`)
	await expect.poll(async () => (await posterNames(page)).length).toBeGreaterThan(0)

	return sync
}

export function posterNames(page: Page): Promise<Array<string>> {
	return page.getByRole('main').getByRole('link').evaluateAll(links => links
		.map(link => link.querySelector('img')?.getAttribute('alt') ?? '')
		.filter(alt => alt !== ''))
}

/** Signs out through the account menu, which also drops the cached library. */
export async function signOut(page: Page): Promise<void> {
	await page.getByRole('button', { name: 'Account menu' }).click()
	await page.getByRole('button', { name: 'Sign out' }).click()
	await page.waitForURL(url => url.pathname === '/')
}

export function cachedLibrary(page: Page): Promise<string | null> {
	return page.evaluate(() => localStorage.getItem('annum-simkl-library'))
}
