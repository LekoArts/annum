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
	import Spacer from '#lib/Spacer.svelte'
	import { library, syncCompleted, syncState } from '#lib/store/library.js'
	import { settings } from '#lib/store/settings.js'
	import { dashboardSearch } from '#lib/utils/dashboard.js'
	import { groupBy } from '#lib/utils/index.js'
	import { availableYears, countForTypes, itemsForTypes, simklItemUrl } from '#lib/utils/simkl.js'

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

	/** One option per offered year, each with the count the current selection would show (D4). */
	const yearOptions = $derived(years.map(candidate => ({ year: candidate, count: countForTypes($library, types, candidate) })))
</script>

<h1 class='visually-hidden'>{data.meta.title}</h1>

<div class='wrapper flex'>
	<div class='flex align-center navigation'>
		<TypeToggles {types} {year} />
		<YearSelect {year} options={yearOptions} />
		<!--
			Plain links on purpose: `data-sveltekit-reload` would send these through `native_navigation`
			and reload the whole document. The year's items come from the cached library, so a client-side
			navigation re-renders the grid instantly.
		-->
		<div class='prev-next flex align-center'>
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

<Spacer axis='vertical' size='m' />

{#if items.length > 0}
	<Grid screenshotMode={$settings.screenshotMode} columns={$settings.columns}>
		{#if $settings.groupByMonth}
			{#each Object.entries(grouped) as [month, monthItems]}
				<h2 class='month-heading'>{month}</h2>
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
	<p class='no-results'>Nothing watched in {year} for the selected categories. Start watching and track your progress on Simkl! 🥳</p>
{/if}

<style lang='postcss'>
	.wrapper {
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--grid-gutter);
	}

	.navigation {
		gap: var(--space-2xs-xs);
		flex-wrap: wrap;
		justify-content: center;
		flex-grow: 1;

		@media (--sm) {
			flex-grow: initial;
		}
	}

	.prev-next {
		gap: var(--space-3xs);
	}

	.month-heading {
		grid-column: 1 / -1;
	}

	.no-results {
		--color-alpha: 0.75;
		text-align: center;
		padding: var(--space-m-l) 0;
	}
</style>
