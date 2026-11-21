import { createServer } from 'node:http'

// Stands in for api.simkl.com during the browser suite. The dev server's fetch is rewritten here by
// intercept-fetch.mjs, so sign-in completes with a real Better Auth session and no Simkl traffic.
// The account id travels in the authorization code, which keeps parallel tests from sharing state.
const PORT = Number(process.env.SIMKL_MOCK_PORT ?? 5199)
const CODE_PREFIX = 'e2e-'

function send(response, status, body) {
	response.writeHead(status, { 'content-type': 'application/json' })
	response.end(JSON.stringify(body))
}

function readBody(request) {
	return new Promise((resolve) => {
		let body = ''

		request.on('data', (chunk) => {
			body += chunk
		})
		request.on('end', () => resolve(body))
	})
}

const server = createServer(async (request, response) => {
	const url = new URL(request.url ?? '/', `http://127.0.0.1:${PORT}`)

	if (url.pathname === '/health') {
		send(response, 200, { ok: true })

		return
	}

	if (url.pathname === '/oauth2/token') {
		const code = new URLSearchParams(await readBody(request)).get('code') ?? ''
		const account = code.startsWith(CODE_PREFIX) ? code.slice(CODE_PREFIX.length) : '8798305'

		send(response, 200, {
			access_token: `token-${account}`,
			token_type: 'bearer',
			expires_in: 604_800,
			refresh_token: `refresh-${account}`,
		})

		return
	}

	if (url.pathname === '/users/settings') {
		const token = String(request.headers.authorization ?? '').replace(/^Bearer token-/, '')
		const id = Number(token) || 8798305

		// The fields and nesting api.simkl.com really returns. The avatar stays null: a real URL would make
		// the browser fetch simkl.in, which the suite must never do
		send(response, 200, {
			user: { name: `Account ${id}`, joined_at: '2015-04-01T15:47:07Z', gender: 'male', avatar: null, bio: '', loc: '', age: '' },
			account: { id, timezone: 'Europe/Berlin', type: 'pro', anime_title_language: 'en' },
		})

		return
	}

	send(response, 404, { error: `Unhandled Simkl path ${url.pathname}` })
})

server.listen(PORT, () => {
	process.stdout.write(`Simkl mock listening on ${PORT}\n`)
})
