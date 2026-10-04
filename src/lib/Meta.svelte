<script lang='ts'>
	import { TITLE } from '#const'
	import { page } from '$app/state'

	const title = TITLE

	let meta = $derived({
		description: 'Visualize your Simkl history. Display your watched movies, shows and anime in a poster grid. Easily switch between years and categories to browse everything you watched.',
		image: `${page.url.protocol}//${page.url.host}/og-image.png?v2`,
		title,
		...page.data.meta,
	})

	function generateTitle(t: string) {
		if (t === title)
			return `${t} - Visualize your Simkl history`
		return `${t} | ${title}`
	}
</script>

<svelte:head>
	<title>{generateTitle(meta.title)}</title>
	<meta name='image' property='og:image' content={meta.image} />
	<meta name='description' content={meta.description} />
	<meta property='og:type' content='website' />
	<meta property='og:title' content={generateTitle(meta.title)} />
	<meta property='og:description' content={meta.description} />
	<meta name='twitter:card' content='summary_large_image' />
	<meta name='twitter:title' content={generateTitle(meta.title)} />
	<meta name='twitter:description' content={meta.description} />
	<meta name='twitter:image' content={meta.image} />
</svelte:head>
