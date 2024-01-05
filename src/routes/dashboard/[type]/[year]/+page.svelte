<script lang='ts'>
	import InfiniteLoading, { type InfiniteEvent } from 'svelte-infinite-loading'
	import type { PageData } from './$types'
	import type { ApiHistoryResponse, Item } from '$lib/types'
	import { getStartAndEndOfYear } from '$lib/utils'
	import Image from '$lib/Image.svelte'
	import Grid from '$lib/grid/Grid.svelte'
	import GridItem from '$lib/grid/Item.svelte'
	import { settings } from '$lib/store/settings'
	import { filterUniqueShowsFromHistory } from '$lib/utils/trakt'

	let p = 1
	let list: Array<Item> = []
	export let data: PageData

	$: ({ year, type } = data)
	$: ({ start, end } = getStartAndEndOfYear(year))

	$: queryParams = new URLSearchParams({
		page: p.toString(),
		start_at: start,
		end_at: end,
		lang: $settings?.lang,
	}).toString()

	function infiniteHandler({ detail: { loaded, complete, error } }: InfiniteEvent) {
		fetch(`/api/history/${type}?${queryParams}`)
			.then<ApiHistoryResponse>(res => res.json())
			.then((data) => {
				if (p > Number(data.total_pages) || data.items?.length === 0) {
					complete()
				}
				else {
					p++

					// The /history/shows endpoint returns normalized episodes, not shows. So we need to deduplicate the list to only have unique shows.
					if (type === 'shows')
						list = filterUniqueShowsFromHistory([...list, ...data.items])

					else
						list = [...list, ...data.items]

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
		Something went wrong 😢 <button on:click={attemptLoad}>Retry</button>
	</span>
	<span slot='noResults' class='infinite-no-results'>
		No results found. Start watching and track your progress on Trakt! 🥳
	</span>
</InfiniteLoading>
