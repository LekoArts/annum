import devtoolsJson from 'vite-plugin-devtools-json';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), devtoolsJson()],
	define: {
		'__DEPLOY_PRIME_URL__': JSON.stringify(process.env.DEPLOY_PRIME_URL || ''),
	},
	test: {
		include: ['src/**/__tests__/*.ts'],
		coverage: { include: ['src/lib/utils/*.ts', 'src/lib/actions.ts'] }
	}
});
