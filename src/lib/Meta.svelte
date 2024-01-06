<script lang='ts'>
	import { page } from '$app/stores'
	import { TITLE } from '$const'

	let title = TITLE

	$: meta = {
		description: 'Visualize your Trakt.tv history. Display your watched movies and shows in a poster grid. Easily switch between years and get an overview of all your history.',
		image: `${$page.url.protocol}//${$page.url.host}/og-image.png?v1`,
		title,
		...$page.data.meta,
	}

	function generateTitle(t: string) {
		if (t === title)
			return t
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
	<link rel='preload' href='/icons.svg' as='image' type='image/svg+xml' />
</svelte:head>
