import type { PageLoad } from './$types'

export const load: PageLoad = () => ({
	meta: {
		title: 'About',
		description: 'Meet the project behind annum, an open-source way to explore your Simkl watch history. Created by LekoArts, with metadata and posters from Simkl.',
	},
})
