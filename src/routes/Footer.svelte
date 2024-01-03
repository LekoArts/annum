<script lang='ts'>
	import { CURRENT_YEAR } from '$const'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'
</script>
<footer class='container'>
	<p>&copy; {CURRENT_YEAR} by <a href='https://www.lekoarts.de?utm_source=trakt-yearly-posters'>LekoArts</a> • <a href='/about'>About</a></p>
	<Spacer axis='vertical' size='xs' />
	<div class='logos flex align-center'>
		Powered by <Svg id='trakt' aria-label='Trakt' /> and <Svg id='tmdb' aria-label='TMDB' />
	</div>
	<Spacer axis='vertical' size='xs' />
	<div class='attribution'>
		<p>This website uses TMDB & Trakt and the TMDB APIs & Trakt APIs but is not endorsed, certified, or otherwise approved by TMDB or Trakt.</p>
	</div>
</footer>

<style lang='postcss'>
	footer {
		padding-top: var(--space-3xl);
		padding-bottom: var(--space-xl);
		text-align: center;
	}

	.logos {
		font-size: var(--step--1);
		justify-content: center;
	}

	.logos :global(svg) {
		margin: 0 var(--space-2xs);
		height: var(--space-s-m);
		width: var(--space-s-m);
		color: var(--color-2);
	}

	.attribution {
		& p {
			font-size: var(--step--1);
			color: var(--color-2);
		}
	}
</style>
