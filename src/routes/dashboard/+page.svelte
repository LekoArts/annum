<script lang='ts'>
	import type { PageData } from './$types'
	import { settings } from '$lib/store/settings'
	import { CURRENT_YEAR, LANGUAGES } from '$const'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'
	import Secondary from '$lib/button/Secondary.svelte'
	import Switch from '$lib/Switch.svelte'

	export let data: PageData

	let years = [CURRENT_YEAR, CURRENT_YEAR - 1]
</script>

<h1 class='visually-hidden'>Dashboard</h1>

<div class='prose'>
	<p class='welcome'>Hello {data.session?.user.username} 👋🏻</p>
	<p>In total, you watched <Svg id='movie' /> <strong>{data.stats?.movies?.watched} movies</strong> and <strong><Svg id='tv' /> {data.stats?.shows?.watched} shows</strong>. You can use this app to view your movies and shows year by year in a poster grid. Here are some quick links to the current and previous year:</p>
</div>

<div class='flex quicklinks'>
	{#each years as year}
		<Secondary type='link' href={`/dashboard/movies/${year}`}>Movies {year}</Secondary>
		<Secondary type='link' href={`/dashboard/shows/${year}`}>Shows {year}</Secondary>
	{/each}
</div>

<Spacer axis='vertical' size='xs' />

<div class='prose'>
	<p>On each page you will find a <code>Previous</code> and <code>Next</code> button to switch years. Next to the "Sign Out" button you'll see the count for the current year and total count in parentheses. You can also manually change the year in the URL as the format is always the same, for example: <code>/dashboard/movies/{CURRENT_YEAR}</code>.</p>
</div>

<Spacer axis='vertical' size='m' />

<section>
	<h2>Settings</h2>
	<Spacer axis='vertical' size='xs' />
	<div class='settings-wrapper'>
		<div class='box'>
			<p class='title'>Color Hue</p>
			<p>Choose a color hue between <code>0deg</code> and <code>360deg</code> to change the appearance. Default is <code>240deg</code>.</p>
			<Spacer axis='vertical' size='xs' />
			<div class='range-wrapper flex align-center'>
				<label for='hue'>Color hue</label>
				<div class='current-color-hue'>{$settings.hue}</div>
				<input id='hue' type='range' min='0' max='360' step='1' list='markers' bind:value={$settings.hue} on:input={e => settings.set({ ...$settings, hue: Number.parseInt((e.target as HTMLInputElement).value) })} />
				<datalist id='markers'>
					{#each [0, 60, 120, 180, 240, 300, 360] as marker}
						<option value={marker} label={marker.toString()}></option>
					{/each}
				</datalist>
			</div>
			<Spacer axis='vertical' size='xs' />
			<Switch label='Grayscale Mode' bind:value={$settings.grayscaleMode} />
			<Spacer axis='vertical' size='2xs' />
		</div>
		<div class='box'>
			<p class='title'>Language</p>
			<p>By default, all posters are in English. You can choose another language below.</p>
			<Spacer axis='vertical' size='xs' />
			<div class='lang-wrapper flex align-center'>
				<label for='lang'>Poster Language</label>
				<select id='lang' name='lang' bind:value={$settings.lang} on:change={(e) => {
					// @ts-expect-error - TODO: Fix this
					settings.set({ ...$settings, lang: (e.target as HTMLSelectElement).value })
				}}>
					{#each LANGUAGES as lang}
						<option value={lang.id} selected={$settings.lang ? lang.id === $settings.lang : lang.id === 'en'}>{lang.name}</option>
					{/each}
				</select>
			</div>
			<Spacer axis='vertical' size='2xs' />
		</div>
		<div class='box'>
			<p class='title'>Grouping</p>
			<p>Posters will be grouped by month indicated by individual headings.</p>
			<Spacer axis='vertical' size='xs' />
			<Switch label='Group by month' bind:value={$settings.groupByMonth} />
			<Spacer axis='vertical' size='2xs' />
		</div>
	</div>
</section>

<style lang='postcss'>
	.settings-wrapper {
		display: grid;
		gap: var(--grid-gutter);
		grid-template-columns: 1;

		@media (--md) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.title, .welcome {
		font-weight: 600;
		font-size: var(--step-1);
		margin-bottom: var(--space-2xs);
	}

	.quicklinks {
		flex-wrap: wrap;
		gap: var(--space-2xs-xs);
	}

	.range-wrapper {
		gap: var(--space-s);
		& input {
			flex-grow: 1;
			accent-color: white;
		}
	}

	.lang-wrapper {
		gap: var(--space-s);
	}

	.current-color-hue {
		--color-alpha: 1;
		min-width: 5ch;
		font-weight: 600;
		border: 2px solid var(--color-6);
		padding: var(--space-3xs) var(--space-2xs);
		line-height: 1;
		border-radius: var(--space-2xs);
		box-shadow: 0 0 8px var(--color-5);
		text-align: center;
	}
</style>
