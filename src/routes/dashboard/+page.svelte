<script lang='ts'>
	import type { PageData } from './$types'
	import { settings } from '$lib/store/settings'
	import { CURRENT_YEAR, LANGUAGES } from '$const'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'
	import Secondary from '$lib/button/Secondary.svelte'

	export let data: PageData

	let years = [CURRENT_YEAR, CURRENT_YEAR - 1]
</script>

<h1 class='visually-hidden'>Dashboard</h1>

<div class='prose'>
	<p class='welcome'>Welcome to your Dashboard 👋🏻</p>
	<p>So far you watched <code><Svg id='movie' /> {data.stats.movies.watched} movies</code> and <code><Svg id='tv' /> {data.stats.shows.watched} shows</code>. You can use this app to view your movies and shows year by year in a poster grid. Here are some quick links to the current and previous year:</p>
</div>

<div class='flex quicklinks'>
	{#each years as year}
		<Secondary type='link' href={`/dashboard/movies/${year}`}>Movies {year}</Secondary>
		<Secondary type='link' href={`/dashboard/shows/${year}`}>Shows {year}</Secondary>
	{/each}
</div>

<Spacer axis='vertical' size='xs' />

<div class='prose'>
	<p>On each page you will find a <code>Previous</code> and <code>Next</code> button to switch years. You can also manually change the year in the URL as the format is always the same, for example: <code>/dashboard/movies/{CURRENT_YEAR}</code>.</p>
</div>

<Spacer axis='vertical' size='m' />

<section>
	<h2>Settings</h2>
	<Spacer axis='vertical' size='xs' />
	<div class='settings-wrapper'>
		<div class='box'>
			<p class='title'>Color Hue</p>
			<p>Red is at <code>0deg</code>, yellow is at <code>60deg</code>, lime is at <code>120deg</code>, cyan is at <code>180deg</code>, blue is at <code>240deg</code>, and magenta is at <code>300deg</code>. Choose a color hue to change the website's appearance.</p>
			<Spacer axis='vertical' size='xs' />
			<div class='range-wrapper'>
				<label for='hue'>Color hue:</label>
				<input id='hue' type='range' min='0' max='360' step='1' bind:value={$settings.hue} on:input={e => settings.set({ ...$settings, hue: Number.parseInt((e.target as HTMLInputElement).value) })} />
			</div>
		</div>
		<div class='box'>
			<p class='title'>Language</p>
			<p>By default, all posters are in English. You can choose another language below.</p>
			<div class='lang-wrapper'>
				<label for='lang'>Language:</label>
				<select id='lang' name='lang' bind:value={$settings.lang} on:change={(e) => {
					// @ts-expect-error - TODO: Fix this
					settings.set({ ...$settings, lang: (e.target as HTMLSelectElement).value })
				}}>
					{#each LANGUAGES as lang}
						<option value={lang.id} selected={$settings.lang ? lang.id === $settings.lang : lang.id === 'en'}>{lang.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
</section>

<style lang='postcss'>
	.settings-wrapper {
		display: grid;
		gap: var(--grid-gutter);
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--grid-max-width) / 3), 1fr));
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
</style>
