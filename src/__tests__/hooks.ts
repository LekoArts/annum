import type { RequestEvent } from '@sveltejs/kit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Better Auth needs a real environment secret and issues a cookie-coupled session, so the gate is tested
// against the two things it actually decides: whether a session exists, and whether to redirect.
const getSession = vi.fn(async (..._args: Array<unknown>): Promise<unknown> => null)

vi.mock('#lib/auth.js', () => ({
	auth: { api: { getSession: (...args: Array<unknown>) => getSession(...args) } },
}))

const svelteKitHandler = vi.fn(async (..._args: Array<unknown>): Promise<Response> => new Response('handled'))
vi.mock('better-auth/svelte-kit', () => ({
	svelteKitHandler: (...args: Array<unknown>) => svelteKitHandler(...args),
}))

vi.mock('$app/env', () => ({ building: false }))

const { handle } = await import('../hooks.server')

const SESSION = { session: { id: 'session-1' }, user: { id: 'user-1', name: 'Ada' } }

function createEvent(routeId: string | null): { event: RequestEvent, resolve: () => Promise<Response> } {
	return {
		event: {
			route: { id: routeId },
			request: new Request('https://annum.app/dashboard'),
			locals: {},
		} as unknown as RequestEvent,
		resolve: vi.fn(async () => new Response('page')),
	}
}

beforeEach(() => {
	getSession.mockReset()
	getSession.mockResolvedValue(null)
	svelteKitHandler.mockClear()
})

describe('handle', () => {
	it('lets a signed-in request through and exposes the session on locals', async () => {
		getSession.mockResolvedValue(SESSION)
		const { event, resolve } = createEvent('/(protected)/dashboard')

		await handle({ event, resolve })

		expect(event.locals.session).toEqual(SESSION.session)
		expect(event.locals.user).toEqual(SESSION.user)
		expect(svelteKitHandler).toHaveBeenCalledOnce()
	})

	it('redirects a signed-out request to sign-in without resolving the page', async () => {
		const { event, resolve } = createEvent('/(protected)/dashboard')

		await expect(handle({ event, resolve })).rejects.toMatchObject({ status: 303, location: '/sign-in' })
		expect(resolve).not.toHaveBeenCalled()
		expect(svelteKitHandler).not.toHaveBeenCalled()
	})

	it('passes an unprotected request through without checking the session', async () => {
		const { event, resolve } = createEvent('/about')

		await handle({ event, resolve })

		expect(getSession).not.toHaveBeenCalled()
		expect(svelteKitHandler).toHaveBeenCalledOnce()
	})
})
