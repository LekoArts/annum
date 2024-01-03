<script lang='ts'>
	import InfiniteLoading, { type InfiniteEvent } from 'svelte-infinite-loading'
	import type { PageData } from './$types'
	import type { ApiHistoryMoviesResponse, Movie } from '$lib/types'
	import { getStartAndEndOfYear } from '$lib/utils'
	import Image from '$lib/Image.svelte'
	import Grid from '$lib/grid/Grid.svelte'
	import GridItem from '$lib/grid/Item.svelte'
	import { settings } from '$lib/store/settings'

	let p = 1
	let list: Array<Movie> = []
	export let data: PageData

	$: ({ year } = data)
	$: ({ start, end } = getStartAndEndOfYear(year))

	$: queryParams = new URLSearchParams({
		page: p.toString(),
		start_at: start,
		end_at: end,
		lang: $settings?.lang,
	}).toString()

	function infiniteHandler({ detail: { loaded, complete, error } }: InfiniteEvent) {
		fetch(`/api/history/movies?${queryParams}`)
			.then<ApiHistoryMoviesResponse>(res => res.json())
			.then((data) => {
				if (p > Number(data.total_pages)) {
					complete()
				}
				else {
					p++
					list = [...list, ...data.movies]
					loaded()
				}
			})
			.catch((err) => {
				console.error(err)
				error()
			})
	}
</script>

<h1 class='visually-hidden'>Movies from {year}</h1>

<Grid screenshotMode={$settings.screenshotMode} columns={$settings.columns}>
	{#each list as { images, title }, index}
		<GridItem {index}>
			<Image {images} alt={title} loading={index === 0 ? 'eager' : 'lazy'} />
		</GridItem>
	{/each}
</Grid>
<InfiniteLoading on:infinite={infiniteHandler} spinner='circles'>
	<span slot='noMore'></span>
	<span slot='error' let:attemptLoad>
		Something went wrong. <button on:click={attemptLoad}>Retry</button>
	</span>
	<span slot='noResults'>
		No results found. Start watching! 🥳
	</span>
</InfiniteLoading>
