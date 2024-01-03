<script lang='ts'>
	import InfiniteLoading, { type InfiniteEvent } from 'svelte-infinite-loading'
	import type { PageData } from './$types'
	import type { ApiWatchedShowsResponse, NormalizedItemResponse, Show, TmdbImageUrlsWithDimensions } from '$lib/types'
	import Image from '$lib/Image.svelte'
	import VisuallyHidden from '$lib/VisuallyHidden.svelte'
	import Grid from '$lib/grid/Grid.svelte'
	import GridItem from '$lib/grid/Item.svelte'

	let c = 1
	let total_chunks = 1
	let list: Array<Show> = []
	export let data: PageData

	$: year = data.year

	$: queryParams = new URLSearchParams({
		id: data.session?.user.id as string,
		year,
	}).toString()

	async function fetchData(show: NormalizedItemResponse): Promise<Show | null> {
		if (!show.tmdb_id) {
			console.warn(`No TMDB ID found for movie "${show.title}" (TMDB ID: ${show.tmdb_id})`)

			return null
		}

		const queryParams = new URLSearchParams({
			id: show.tmdb_id.toString(),
			type: 'shows',
			title: show.title,
		}).toString()

		return await fetch(`/api/tmdb-image?${queryParams}`).then((res) => {
			if (!res.ok) {
				console.warn(`No TMDB ID found for movie "${show.title}" (TMDB ID: ${show.tmdb_id})`)

				return null
			}

			return res.json() as Promise<TmdbImageUrlsWithDimensions | null>
		}).then((tmdb) => {
			if (!tmdb)
				return null

			return {
				...show,
				images: tmdb,
			}
		})
	}

	function infiniteHandler({ detail: { loaded, complete, error } }: InfiniteEvent) {
		fetch(`/api/watched/shows?${queryParams}`)
			.then<ApiWatchedShowsResponse>(res => res.json())
			.then((data) => {
				const cIndex = c - 1
				total_chunks = Number(data.total_chunks)

				if (c > total_chunks) {
					complete()
				}
				else {
					c++

					return Promise.allSettled(data.chunks[cIndex].map(fetchData))
				}
			})
			.then((results) => {
				if (c > total_chunks)
					complete()

				if (!results)
					throw new Error('No results')

				const shows = results.map((p) => {
					if (p.status === 'fulfilled')
						return p.value

					return null
				}).filter(Boolean) as Array<Show>

				list = [...list, ...shows]
				loaded()
			})
			.catch((err) => {
				console.error(err)
				error()
			})
	}
</script>

<VisuallyHidden>
	<h1>Shows from {year}</h1>
</VisuallyHidden>

<Grid>
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
</InfiniteLoading>
