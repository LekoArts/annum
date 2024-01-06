import adapter from '@sveltejs/adapter-netlify'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		env: {
			privatePrefix: 'PRIVATE_',
		},
		alias: {
			$assets: 'src/assets',
			$const: 'src/const.ts',
		},
	},
}

export default config
