<script lang='ts'>
	import type { PageData } from './$types'
	import { CURRENT_YEAR } from '#const'
	import Secondary from '#lib/button/Secondary.svelte'
	import SettingsPopover from '#lib/dashboard/SettingsPopover.svelte'
	import TypeToggles from '#lib/dashboard/TypeToggles.svelte'
	import YearSelect from '#lib/dashboard/YearSelect.svelte'
	import Grid from '#lib/grid/Grid.svelte'
	import GridItem from '#lib/grid/Item.svelte'
	import GridSkeleton from '#lib/grid/Skeleton.svelte'
	import Image from '#lib/Image.svelte'
	import { library, syncCompleted, syncState } from '#lib/store/library.js'
	import { settings } from '#lib/store/settings.js'
	import { dashboardSearch } from '#lib/utils/dashboard.js'
	import { groupBy } from '#lib/utils/index.js'
	import { availableYears, itemsForTypes, simklItemUrl } from '#lib/utils/simkl.js'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const years = $derived(availableYears($library, CURRENT_YEAR))
	const year = $derived(data.year)
	const types = $derived(data.types)
	const items = $derived(itemsForTypes($library, types, year))
	const grouped = $derived(groupBy(items, 'month'))
	const earliestYear = $derived(years.at(-1) ?? CURRENT_YEAR)
</script>

<h1 class='sr-only'>{data.meta.title}</h1>

<div class='mb-6 flex flex-wrap items-center justify-between gap-4'>
	<div class='flex flex-wrap items-center gap-4'>
		<TypeToggles {types} {year} />
		<YearSelect {year} {years} />
		<!-- Plain links on purpose: `data-sveltekit-reload` would reload the whole document, while the year's
			items come from the cached library and re-render instantly on a client-side navigation -->
		<div class='flex items-center gap-2'>
			{#if year > earliestYear}
				<Secondary type='link' href={`/dashboard${dashboardSearch({ year: year - 1, types, currentYear: CURRENT_YEAR })}`} aria-label='Navigate to previous year'>Previous</Secondary>
			{/if}
			{#if year < CURRENT_YEAR}
				<Secondary type='link' href={`/dashboard${dashboardSearch({ year: year + 1, types, currentYear: CURRENT_YEAR })}`} aria-label='Navigate to next year'>Next</Secondary>
			{/if}
		</div>
	</div>
	<SettingsPopover />
</div>

{#if items.length > 0}
	<Grid screenshotMode={$settings.screenshotMode} columns={$settings.columns}>
		{#if $settings.groupByMonth}
			{#each Object.entries(grouped) as [month, monthItems]}
				<h2 class='col-span-full'>{month}</h2>
				{#each monthItems as item, index}
					<GridItem index={index} href={simklItemUrl(item.type, item.simklId, item.slug)}>
						<Image poster={item.poster} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
					</GridItem>
				{/each}
			{/each}
		{:else}
			{#each items as item, index}
				<GridItem index={index} href={simklItemUrl(item.type, item.simklId, item.slug)}>
					<Image poster={item.poster} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
				</GridItem>
			{/each}
		{/if}
	</Grid>
{:else if $syncState !== 'error' && !$syncCompleted}
	<GridSkeleton screenshotMode={$settings.screenshotMode} columns={$settings.columns} />
{:else if $syncCompleted}
	<p>Nothing watched in {year} for the selected categories. Start watching and track your progress on Simkl! 🥳</p>
{/if}
