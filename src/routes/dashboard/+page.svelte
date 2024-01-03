<script lang='ts'>
	import type { PageData } from './$types'
	import { settings } from '$lib/store/settings'
	import { GITHUB_REPO_URL, LANGUAGES } from '$const'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'

	export let data: PageData

	let years = [2024, 2023, 2022, 2021, 2020]
</script>

<h1 class='visually-hidden'>Dashboard</h1>

<div class='prose'>
	<p class='welcome'>Welcome to your Dashboard 👋🏻</p>
	<p>So far you watched <Svg id='movie' /> {data.stats.movies.watched} movies and <Svg id='tv' /> {data.stats.shows.watched} shows.</p>
</div>

<ul>
	{#each years as year}
		<li>
			<a href={`/dashboard/movies/${year}`}>Movies {year}</a>
		</li>
		<li>
			<a href={`/dashboard/shows/${year}`}>Shows {year}</a>
		</li>
	{/each}
</ul>

<Spacer axis='vertical' size='m' />

<section>
	<h2>Settings</h2>
	<Spacer axis='vertical' size='xs' />
	<div class='settings-wrapper'>
		<div class='box'>
			<p class='title'>Color Hue</p>
			<p>Red is at <code>0deg</code>, yellow is at <code>60deg</code>, lime is at <code>120deg</code>, cyan is at <code>180deg</code>, blue is at <code>240deg</code>, and magenta is at <code>300deg</code>.</p>
			<Spacer axis='vertical' size='xs' />
			<div class='range-wrapper'>
				<label for='hue'>Choose a color hue:</label>
				<input id='hue' type='range' min='0' max='360' step='1' bind:value={$settings.hue} on:input={e => settings.set({ ...$settings, hue: Number.parseInt((e.target as HTMLInputElement).value) })} />
			</div>
		</div>
		<div class='box'>
			<p class='title'>Language</p>
			<p>this is a text blabla</p>
			<div class='lang-wrapper'>
				<label for='lang'>Choose a language for your posters:</label>
				<select id='lang' name='lang'>
					{#each LANGUAGES as lang}
						<option value={lang.id}>{lang.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
</section>

<Spacer axis='vertical' size='m' />

<h2>Background information</h2>
<Spacer axis='vertical' size='xs' />
<div class='prose'>
	<p>All colors on this website are authored in the <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch'>Oklch Color Space</a>. The color wheel is the representation of the <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/hue'>color hue angle</a>. By changing the color hue you can change the color scheme of the whole website.</p>
	<p>Trakt itself doesn't host any images (like posters) but instead provides metadata to for APIs like <a href='https://www.themoviedb.org/'>TMDB</a>. So all posters you can see on this website are sourced from TMDB. TMDB allows to fetch images in different languages, but as it's a community-led effort in most cases only the most popular languages have individual images. Thus the language selector below only contains a subset of languages (if you're absolutely missing your language, please <a href={GITHUB_REPO_URL}>open an issue</a>).</p>
</div>

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
</style>
