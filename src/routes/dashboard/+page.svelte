<script lang='ts'>
	import type { PageData } from './$types'

	export let data: PageData

	export let navigation = [
		{ name: 'Home', href: '/dashboard' },
		{ name: 'All Movies', href: '/dashboard/movies/all' },
	]

	export let years = [2023, 2022, 2021, 2020]
</script>

<p>You watched {data.stats.movies.watched} movies & {data.stats.shows.watched} shows (with {data.stats.episodes.watched} episodes)</p>

<h2>Navigation</h2>
<ul>
	{#each navigation as nav}
		<li><a href={nav.href}>{nav.name}</a></li>
	{/each}
</ul>

<h2>Movies Years</h2>
<ul>
	{#each years as year}
		<li><a href='/dashboard/movies/{year}'>{year}</a></li>
	{/each}
</ul>

<h2>Shows Years</h2>
<ul>
	{#each years as year}
		<li><a href='/dashboard/shows/{year}'>{year}</a></li>
	{/each}
</ul>