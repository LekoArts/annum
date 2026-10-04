import adapter from '@sveltejs/adapter-netlify'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import { defineConfig } from 'vitest/config'

const DEPLOY_PRIME_URL = JSON.stringify(process.env.DEPLOY_PRIME_URL || '')

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter(),
		}),
		devtoolsJson(),
	],
	define: {
		__DEPLOY_PRIME_URL__: process.env.CONTEXT === 'deploy-preview' ? DEPLOY_PRIME_URL : '""',
	},
	test: {
		include: ['src/**/__tests__/*.ts'],
		coverage: { include: ['src/lib/utils/*.ts'] },
	},
})
