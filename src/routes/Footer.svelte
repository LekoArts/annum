<script lang='ts'>
	import { CURRENT_YEAR, GITHUB_REPO_URL } from '#const'
	import { homepageMotionPaused } from '#lib/store/homepage-motion.js'
	import Svg from '#lib/Svg.svelte'
	import { page } from '$app/state'
</script>

{#if page.url.pathname === '/'}
	<footer class='mx-auto mt-[72px] flex w-full max-w-[1600px] items-start justify-between gap-5 px-9 pt-6 pb-8 text-[11px] text-(--muted) max-[1050px]:mt-[52px] max-[1050px]:px-6 max-[600px]:mt-[34px] max-[600px]:block max-[600px]:px-[22px] [&_a]:underline [&_a]:decoration-(--border) [&_a]:underline-offset-3 [&_a:hover]:text-(--ink)'>
		<div>
			<p>&copy; {CURRENT_YEAR} by <a href='https://www.lekoarts.de?utm_source=annum'>LekoArts</a> · <a href='/about'>About</a> · <a href={GITHUB_REPO_URL}>Source code</a></p>
			<button type='button' aria-pressed={$homepageMotionPaused} onclick={() => homepageMotionPaused.update(value => !value)} class='mt-3 min-h-8 text-[11px] hover:text-(--ink) motion-reduce:hidden'>{$homepageMotionPaused ? 'Resume animations' : 'Pause animations'}</button>
		</div>
		<div class='max-w-80 text-right text-[10px] max-[600px]:mt-[18px] max-[600px]:text-left'>
			<p>Read-only access to your Simkl history</p>
			<p class='mt-1'>Powered by Simkl · Not endorsed or certified by Simkl.</p>
		</div>
	</footer>
{:else}
	<footer class='mx-auto w-full space-y-2 px-4 pt-16 pb-8 text-center text-xs leading-relaxed text-(--muted) [&_a]:underline [&_a]:decoration-(--border) [&_a]:underline-offset-3 [&_a:hover]:text-(--ink)'>
		<p>&copy; {CURRENT_YEAR} by <a href='https://www.lekoarts.de?utm_source=annum'>LekoArts</a> • <a href='/about'>About</a> • <a href={GITHUB_REPO_URL}>Source Code</a></p>
		<div class='flex items-center justify-center gap-2'>
			Powered by <Svg id='simkl' aria-label='Simkl' />
		</div>
		<p>This website uses the Simkl API but is not endorsed or certified by Simkl.</p>
	</footer>
{/if}
