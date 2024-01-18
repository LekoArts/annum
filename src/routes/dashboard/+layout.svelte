<script lang='ts'>
	import { slide } from 'svelte/transition'
	import { page } from '$app/stores'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'
	import Switch from '$lib/Switch.svelte'
	import { style } from '$lib/actions'
	import { settings } from '$lib/store/settings'
	import Secondary from '$lib/button/Secondary.svelte'
	import { CURRENT_YEAR } from '$const'

	$: segments = $page.url.pathname.slice(1).split('/')
	$: isDashboard = segments.length === 1
	$: isDetailsPage = segments.length > 1
	$: isMovie = segments[1] === 'movies'
	$: isShow = segments[1] === 'shows'
	$: year = Number.parseInt(segments[2])
</script>

<div class='wrapper flex'>
	<div class='flex align-center navigation'>
		<nav aria-label='Breadcrumbs' class='breadcrumb flex align-center box' lang='en-US' dir='ltr'>
			<ol role='list'>
				<li>
					<Svg id='home' />
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
				<Secondary data-sveltekit-reload type='link' href={`/dashboard/${segments[1]}/${year - 1}`} aria-label='Navigate to previous year'>Previous</Secondary>
				{#if !(year === CURRENT_YEAR)}
					<Secondary data-sveltekit-reload type='link' href={`/dashboard/${segments[1]}/${year + 1}`} aria-label='Navigate to next year'>Next</Secondary>
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
			<Switch label='Screenshot Mode' bind:value={$settings.screenshotMode} />
		</div>
	{/if}
</div>

<Spacer axis='vertical' size='m' />

<slot />

<svelte:body use:style={`--color-hue: ${$settings.hue};${$settings.grayscaleMode ? ' --color-chroma: 0;' : ''}`} />

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

				& a, span {
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
</style>
