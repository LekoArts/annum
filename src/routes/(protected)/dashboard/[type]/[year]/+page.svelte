<script lang='ts'>
	import type { SimklMediaType } from '#lib/types.js'
	import type { PageData } from './$types'
	import { CURRENT_YEAR } from '#const'
	import Secondary from '#lib/button/Secondary.svelte'
	import Grid from '#lib/grid/Grid.svelte'
	import GridItem from '#lib/grid/Item.svelte'
	import Image from '#lib/Image.svelte'
	import Spacer from '#lib/Spacer.svelte'
	import { library, syncCompleted } from '#lib/store/library.js'
	import { settings } from '#lib/store/settings.js'
	import Svg from '#lib/Svg.svelte'
	import Switch from '#lib/Switch.svelte'
	import { groupBy } from '#lib/utils/index.js'
	import { itemsForYear, simklItemUrl } from '#lib/utils/simkl.js'
	import { page } from '$app/state'
	import { slide } from 'svelte/transition'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const TYPE_LABELS: Record<SimklMediaType, string> = {
		movies: 'Movies',
		shows: 'Shows',
		anime: 'Anime',
	}

	let { year, type } = $derived(data)

	let list = $derived(itemsForYear($library, type, year))
	let listGroupedByMonth = $derived(groupBy(list, 'month'))

	let segments = $derived(page.url.pathname.slice(1).split('/'))
	let isDashboard = $derived(segments.length === 1)
	let isDetailsPage = $derived(segments.length > 1)
</script>

<div class='wrapper flex'>
	<div class='flex align-center navigation'>
		<nav aria-label='Breadcrumbs' class='breadcrumb flex align-center box' lang='en-US' dir='ltr'>
			<ol role='list'>
				<li>
					<a href='/dashboard' aria-current={isDashboard ? 'page' : null}>Home</a>
				</li>
				{#if isDetailsPage}
					<li>
						<Svg id='chevron-right' />
						<span>{TYPE_LABELS[type]}</span>
					</li>
					<li>
						<Svg id='chevron-right' />
						<span class='font-semibold' aria-current='page'>{year}</span>
					</li>
				{/if}
			</ol>
		</nav>
		{#if isDetailsPage}
			<div class='prev-next'>
				<Secondary data-sveltekit-reload type='link' href={`/dashboard/${segments[1]}/${Number.parseInt(year) - 1}`} aria-label='Navigate to previous year'>Previous</Secondary>
				{#if !(Number.parseInt(year) === CURRENT_YEAR)}
					<Secondary data-sveltekit-reload type='link' href={`/dashboard/${segments[1]}/${Number.parseInt(year) + 1}`} aria-label='Navigate to next year'>Next</Secondary>
				{/if}
			</div>
		{/if}
	</div>
	{#if segments.length > 1}
		<div class='box flex align-center screenshot-mode'>
			{#if $settings.screenshotMode}
				<div class='flex align-center' transition:slide={{ axis: 'x' }}>
					<label for='grid-columns'>Columns</label>
					<input id='grid-columns' type='number' min='1' max='100' step='1' bind:value={$settings.columns} oninput={e => settings.set({ ...$settings, columns: Number.parseInt((e.target as HTMLInputElement).value) })} />
				</div>
			{/if}
			<Switch label='Screenshot Mode' bind:value={$settings.screenshotMode} />
		</div>
	{/if}
</div>

<Spacer axis='vertical' size='m' />

<h1 class='visually-hidden'>{TYPE_LABELS[type]} from {year}</h1>

{#if $syncCompleted && list.length === 0}
	<p class='no-results'>No {TYPE_LABELS[type].toLowerCase()} watched in {year}. Start watching and track your progress on Simkl! 🥳</p>
{:else}
	<Grid screenshotMode={$settings.screenshotMode} columns={$settings.columns}>
		{#if $settings.groupByMonth}
			{#each Object.entries(listGroupedByMonth) as [month, items]}
				<h2 class='month-heading'>{month}</h2>
				{#each items as item, index}
					<GridItem index={index} href={simklItemUrl(type, item.simklId, item.slug)}>
						<Image poster={item.poster} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
					</GridItem>
				{/each}
			{/each}
		{:else}
			{#each list as item, index}
				<GridItem index={index} href={simklItemUrl(type, item.simklId, item.slug)}>
					<Image poster={item.poster} alt={item.title} loading={index === 0 ? 'eager' : 'lazy'} />
				</GridItem>
			{/each}
		{/if}
	</Grid>
{/if}

<style lang='postcss'>
	.wrapper {
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--grid-gutter);
	}

	.navigation {
		gap: var(--grid-gutter);
		flex-wrap: wrap;
		justify-content: center;
		flex-grow: 1;

		@media (--sm) {
			flex-grow: initial;
		}
	}

	.breadcrumb {
		flex-grow: 1;
		justify-content: center;

		@media (--sm) {
			flex-grow: initial;
		}

		& ol {
			list-style-type: "";
			padding-left: 0;
			margin: 0;
			display: inline-flex;
			align-items: center;

			& li {
				display: inline-flex;
				align-items: center;
				--color-alpha: 0.75;
				--icon-color: var(--color-1);

				& span {
					padding-left: var(--space-3xs);
				}
			}
		}

		& a {
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.screenshot-mode {
		flex-grow: 1;
		justify-content: center;
		flex-wrap: wrap;

		@media (--sm) {
			flex-grow: initial;
		}

		& input[type="number"] {
			--color-alpha: 1;
			width: var(--space-xl);
			height: var(--space-m);
			position: relative;
			background: var(--color-0);
			border: none;
			border-radius: var(--space-3xs);
			margin-left: var(--space-2xs);
			padding-left: var(--space-2xs);
		}
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
