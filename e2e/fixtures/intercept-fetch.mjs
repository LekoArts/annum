// Loaded into the dev server with `--import`, so Better Auth's server-side Simkl calls reach the local
// mock instead of the network. Only api.simkl.com is rewritten; every other fetch is untouched.
const MOCK = `http://127.0.0.1:${process.env.SIMKL_MOCK_PORT ?? 5199}`
const SIMKL = 'https://api.simkl.com'
const originalFetch = globalThis.fetch

globalThis.fetch = async (input, init) => {
	const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

	if (!url.startsWith(SIMKL))
		return await originalFetch(input, init)

	const rewritten = `${MOCK}${url.slice(SIMKL.length)}`

	if (input instanceof Request)
		return await originalFetch(new Request(rewritten, input), init)

	return await originalFetch(rewritten, init)
}
