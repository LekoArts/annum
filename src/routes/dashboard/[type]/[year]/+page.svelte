<script lang='ts'>
	import { slide } from 'svelte/transition'
	import type { PageData } from './$types'
	import type { ApiHistoryResponse, InfiniteEvent, Item } from '$lib/types'
	import { page } from '$app/stores'
	import { CURRENT_YEAR } from '$const'
	import Secondary from '$lib/button/Secondary.svelte'
	import Grid from '$lib/grid/Grid.svelte'
	import GridItem from '$lib/grid/Item.svelte'
	import Image from '$lib/Image.svelte'
	import InfiniteLoading from '$lib/InfiniteLoading.svelte'
	import Spacer from '$lib/Spacer.svelte'
	import { settings } from '$lib/store/settings'
	import { stats } from '$lib/store/stats'
	import Svg from '$lib/Svg.svelte'
	import Switch from '$lib/Switch.svelte'
	import { capitalize, getStartAndEndOfYear, groupBy } from '$lib/utils'
	import { filterUniqueShowsFromHistory } from '$lib/utils/trakt'

	let reset: () => Promise<void>

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

	$: segments = $page.url.pathname.slice(1).split('/')
	$: isDashboard = segments.length === 1
	$: isDetailsPage = segments.length > 1
	$: isMovie = segments[1] === 'movies'
	$: isShow = segments[1] === 'shows'
	$: listGroupedByMonth = groupBy(list, 'last_wathed_at_month')
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
						{#if isMovie}
							<span>Movies</span>
						{:else if isShow}
							<span>Shows</span>
						{/if}
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
					<input id='grid-columns' type='number' min='1' max='100' step='1' bind:value={$settings.columns} on:input={e => settings.set({ ...$settings, columns: Number.parseInt((e.target as HTMLInputElement).value) })} />
				</div>
			{/if}
			<Switch label='Screenshot Mode' bind:value={$settings.screenshotMode} onClickWithValue={(value) => {
				if (value)
					reset()
			}} />
		</div>
	{/if}
</div>

<Spacer axis='vertical' size='m' />

<h1 class='visually-hidden'>{capitalize(type)} from {year}</h1>

<Grid screenshotMode={$settings.screenshotMode} columns={$settings.columns}>
	{#if $settings.groupByMonth}
		{#each Object.entries(listGroupedByMonth) as [month, items]}
			<h2 class='month-heading'>{month}</h2>
			{#each items as { images, title }, index}
				<GridItem {index}>
					<Image {images} alt={title} loading={index === 0 ? 'eager' : 'lazy'} />
				</GridItem>
			{/each}
		{/each}
	{:else}
		{#each list as { images, title }, index}
			<GridItem {index}>
				<Image {images} alt={title} loading={index === 0 ? 'eager' : 'lazy'} />
			</GridItem>
		{/each}
	{/if}
</Grid>

<InfiniteLoading bind:reset={reset} on:infinite={infiniteHandler}>
	<span slot='noMore'></span>
	<div slot='error' let:attemptLoad>
		Something went wrong 😢 <button on:click={() => attemptLoad()}>Retry</button>
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
