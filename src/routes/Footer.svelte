<script lang='ts'>
	import { CURRENT_YEAR, GITHUB_REPO_URL } from '#const'
	import Svg from '#lib/Svg.svelte'
</script>

<footer class='mx-auto w-full space-y-2 px-4 pt-16 pb-8 text-center text-xs leading-relaxed text-(--muted) [&_a]:underline [&_a]:decoration-(--border) [&_a]:underline-offset-3 [&_a:hover]:text-(--ink)'>
	<p>&copy; {CURRENT_YEAR} by <a href='https://www.lekoarts.de?utm_source=annum'>LekoArts</a> • <a href='/about'>About</a> • <a href={GITHUB_REPO_URL}>Source Code</a></p>
	<div class='flex items-center justify-center gap-2'>
		Powered by <Svg id='simkl' aria-label='Simkl' />
	</div>
	<p>This website uses the Simkl API but is not endorsed or certified by Simkl.</p>
</footer>
