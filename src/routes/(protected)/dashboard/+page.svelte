<script lang='ts'>
	import type { PageData } from './$types'
	import { CURRENT_YEAR } from '#const'
	import Grid from '#lib/grid/Grid.svelte'
	import GridItem from '#lib/grid/Item.svelte'
	import GridSkeleton from '#lib/grid/Skeleton.svelte'
	import Image from '#lib/Image.svelte'
	import { library, sync, syncCompleted, syncState } from '#lib/store/library.js'
	import { settings } from '#lib/store/settings.js'
	import { dashboardSearch } from '#lib/utils/dashboard.js'
	import { groupBy } from '#lib/utils/index.js'
	import { itemsForTypes, simklItemUrl } from '#lib/utils/simkl.js'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const year = $derived(data.year)
	const types = $derived(data.types)
	const items = $derived(itemsForTypes($library, types, year))
	const grouped = $derived(groupBy(items, 'month'))
</script>

<h1 class='sr-only'>{data.meta.title}</h1>

{#if items.length > 0}
	<Grid screenshotMode={$settings.screenshotMode} columns={$settings.columns}>
		{#if $settings.groupByMonth}
			{#each Object.entries(grouped) as [month, monthItems]}
				<h2 class='col-span-full pt-6 pb-2 text-lg font-medium text-(--muted) first:pt-0'>{month}</h2>
				{#each monthItems as item, index (`${item.type}:${item.simklId}`)}
					<GridItem index={index} href={simklItemUrl(item.type, item.simklId, item.slug)}>
						<Image poster={item.poster} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
					</GridItem>
				{/each}
			{/each}
		{:else}
			{#each items as item, index (`${item.type}:${item.simklId}`)}
				<GridItem index={index} href={simklItemUrl(item.type, item.simklId, item.slug)}>
					<Image poster={item.poster} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
				</GridItem>
			{/each}
		{/if}
	</Grid>
{:else if $syncState === 'error' && !$syncCompleted}
	<div class='mx-auto max-w-md py-24 text-center' role='alert'>
		<h2 class='text-lg font-medium'>Couldn’t load your library</h2>
		<p class='mt-2 text-sm leading-relaxed text-(--muted)'>Your Simkl library is unavailable right now. Try syncing again.</p>
		<button type='button' onclick={() => sync()} class='mt-5 min-h-10 rounded-full bg-(--ink) px-4 text-sm font-medium text-(--page)'>Retry sync</button>
	</div>
{:else if !$syncCompleted}
	<GridSkeleton screenshotMode={$settings.screenshotMode} columns={$settings.columns} />
{:else if $syncCompleted}
	<div class='mx-auto max-w-md py-24 text-center'><h2 class='text-lg font-medium'>No posters for {year}</h2><p class='mt-2 text-sm leading-relaxed text-(--muted)'>Try another year or include more media types. Your watched titles will appear here when you track them on Simkl.</p>
		{#if types.length < 3}<a class='mt-5 inline-flex min-h-10 items-center rounded-full bg-(--ink) px-4 text-sm font-medium text-(--page)' href={`/dashboard${dashboardSearch({ year, types: ['movies', 'shows', 'anime'], currentYear: CURRENT_YEAR })}`}>Show all types</a>{/if}
	</div>
{/if}
