<script lang='ts'>
	import InfiniteLoading from 'svelte-infinite-loading'
	import type { InfiniteEvent } from 'svelte-infinite-loading'
	import type { PageData } from './$types'
	import type { ApiHistoryMoviesResponse, Movie } from '$lib/types'
	import { getStartAndEndOfYear } from '$lib/utils'
	import Image from '$lib/components/image.svelte'

	let p = 1
	let list: Array<Movie> = []
	export let data: PageData

	$: year = data.year
	$: ({ start, end } = getStartAndEndOfYear(year))

	$: queryParams = new URLSearchParams({
		page: p.toString(),
		start_at: start,
		end_at: end,
	}).toString()

	function infiniteHandler({ detail: { loaded, complete, error } }: InfiniteEvent) {
		fetch(`/api/history/movies/?${queryParams}`)
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

<h1>{year}</h1>

<main class='content'>
	<div class='grid'>
		{#each list as item, index}
			<div class='grid-item' data-num={index + 1}>
				<Image images={item.images} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
			</div>
		{/each}
	</div>
	<InfiniteLoading on:infinite={infiniteHandler} spinner='circles'>
		<span slot='noMore'></span>
		<span slot='error' let:attemptLoad>
			Something went wrong. <button on:click={attemptLoad}>Retry</button>
		</span>
	</InfiniteLoading>
</main>

<style>
	.content {
		padding: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-gap: 1rem;
	}
</style>
