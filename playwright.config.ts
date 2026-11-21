import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const PORT = 5173
const MOCK_PORT = 5199
const preload = pathToFileURL(resolve(import.meta.dirname, 'e2e/fixtures/intercept-fetch.mjs')).href

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['list']] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	// The Netlify adapter has no `vite preview`, and these checks are about routing, SSR and the auth
	// handshake rather than build output, so the dev server is the server under test.
	webServer: [
		{
			command: 'node e2e/fixtures/simkl-mock.mjs',
			url: `http://127.0.0.1:${MOCK_PORT}/health`,
			env: { SIMKL_MOCK_PORT: String(MOCK_PORT) },
			// A reused mock would carry the previous run's account state into the next one
			reuseExistingServer: false,
			timeout: 30_000,
		},
		{
			command: `pnpm dev --port ${PORT}`,
			url: `http://localhost:${PORT}`,
			// Sign-in completes through the mock, so the suite needs a real session but never Simkl itself
			env: {
				NODE_OPTIONS: [process.env.NODE_OPTIONS, `--import=${preload}`].filter(Boolean).join(' '),
				SIMKL_MOCK_PORT: String(MOCK_PORT),
			},
			// Only the server started here gets the interception preload, so a stray `pnpm dev` must not be reused
			reuseExistingServer: false,
			timeout: 120_000,
		},
	],
})
