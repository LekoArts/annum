<script lang='ts'>
	import type { PageData } from './$types'
	import InfiniteLoading from '$lib/InfiniteLoading.svelte'
	import type { ApiHistoryResponse, InfiniteEvent, Item } from '$lib/types'
	import { getStartAndEndOfYear } from '$lib/utils'
	import Image from '$lib/Image.svelte'
	import Grid from '$lib/grid/Grid.svelte'
	import GridItem from '$lib/grid/Item.svelte'
	import { settings } from '$lib/store/settings'
	import { filterUniqueShowsFromHistory } from '$lib/utils/trakt'
	import { stats } from '$lib/store/stats'

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
					if (type === 'shows') {
						list = filterUniqueShowsFromHistory([...list, ...data.items])
						stats.setShows(list.length)
					}
					else {
						list = [...list, ...data.items]
						stats.setMovies(Number.parseInt(data.item_count))
					}

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

<InfiniteLoading on:infinite={infiniteHandler}>
	<span slot='noMore'></span>
	<div slot='error' let:attemptLoad>
		Something went wrong 😢 <button on:click={attemptLoad}>Retry</button>
	</div>
	<div slot='noResults' class='infinite-no-results'>
		No results found. Start watching and track your progress on Trakt! 🥳
	</div>
	<div slot='spinner'>
		<span class='loading-circles'>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
			<span class='circle-item'></span>
		</span>
	</div>
</InfiniteLoading>

<style lang='postcss'>
	.loading-circles {
		--size: 7px;
		--radius: 14px;
		--delay: 0.093s;
		--duration: 0.75s;
		--outer-size: 28px;
		--color-alpha: 1;

		display: inline-block;
		margin: 5px 0;
		width: var(--outer-size);
		height: var(--outer-size);
		font-size: var(--outer-size);
		line-height: var(--outer-size);
		border-radius: 50%;
		position: relative;
	}

	.loading-circles .circle-item {
		width: var(--size);
		height: var(--size);
		animation: loading-circles linear var(--duration) infinite;
	}

	.loading-circles .circle-item:first-child {
		margin-top: calc((-1 * var(--size) / 2) - var(--radius));
		margin-left: calc(-1 * var(--size) / 2);
	}

	.loading-circles .circle-item:nth-child(2) {
		margin-top: calc((-1 * var(--size) / 2) + (-1 * var(--radius)) * 0.73);
		margin-left: calc((-1 * var(--size) / 2) + var(--radius) * 0.73);
	}

	.loading-circles .circle-item:nth-child(3) {
		margin-top: calc(-1 * var(--size) / 2);
		margin-left: calc((-1 * var(--size) / 2) + var(--radius));
	}

	.loading-circles .circle-item:nth-child(4) {
		margin-top: calc((-1 * var(--size) / 2) + var(--radius) * 0.73);
		margin-left: calc((-1 * var(--size) / 2) + var(--radius) * 0.73);
	}

	.loading-circles .circle-item:nth-child(5) {
		margin-top: calc((-1 * var(--size) / 2) + var(--radius));
		margin-left: calc(-1 * var(--size) / 2);
	}

	.loading-circles .circle-item:nth-child(6) {
		margin-top: calc((-1 * var(--size) / 2) + var(--radius) * 0.73);
		margin-left: calc((-1 * var(--size) / 2) + (-1 * var(--radius)) * 0.73);
	}

	.loading-circles .circle-item:nth-child(7) {
		margin-top: calc(-1 * var(--size) / 2);
		margin-left: calc((-1 * var(--size) / 2) + (-1 * var(--radius)));
	}

	.loading-circles .circle-item:last-child {
		margin-top: calc((-1 * var(--size) / 2) + (-1 * var(--radius)) * 0.73);
		margin-left: calc((-1 * var(--size) / 2) + (-1 * var(--radius)) * 0.73);
	}

	@keyframes loading-circles {
		0% {
			background: var(--color-4);
		}
		90% {
			background: var(--color-12);
		}
		100% {
			background: var(--color-bright);
		}
	}

	.loading-circles .circle-item {
		position: absolute;
		top: 50%;
		left: 50%;
		display: inline-block;
		border-radius: 50%;
	}

	.loading-circles .circle-item:nth-child(2) {
		animation-delay: var(--delay);
	}

	.loading-circles .circle-item:nth-child(3) {
		animation-delay: calc(var(--delay) * 2);
	}

	.loading-circles .circle-item:nth-child(4) {
		animation-delay: calc(var(--delay) * 3);
	}

	.loading-circles .circle-item:nth-child(5) {
		animation-delay: calc(var(--delay) * 4);
	}

	.loading-circles .circle-item:nth-child(6) {
		animation-delay: calc(var(--delay) * 5);
	}

	.loading-circles .circle-item:nth-child(7) {
		animation-delay: calc(var(--delay) * 6);
	}

	.loading-circles .circle-item:last-child{
		animation-delay: calc(var(--delay) * 7);
	}
</style>
