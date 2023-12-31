<script lang='ts'>
	import { page } from '$app/stores'

	let title = 'Trakt.tv Yearly Posters'

	$: meta = {
		description: 'Get an overview of your watched movies & shows on Trakt.tv in a poster grid',
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
	<meta name='description' content={meta.description} />
	<meta property='og:type' content='website' />
	<meta property='og:title' content={generateTitle(meta.title)} />
	<meta property='og:description' content={meta.description} />
	<meta name='twitter:card' content='summary_large_image' />
	<meta name='twitter:title' content={generateTitle(meta.title)} />
	<meta name='twitter:description' content={meta.description} />
</svelte:head>
