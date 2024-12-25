import { enhancedImages } from '@sveltejs/enhanced-img'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
	],
	test: {
		include: ['src/**/__tests__/*.ts'],
		coverage: {
			include: ['src/lib/utils/*.ts', 'src/lib/actions.ts'],
		},
	},
})
