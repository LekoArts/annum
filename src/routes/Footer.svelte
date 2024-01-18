<script lang='ts'>
	import { CURRENT_YEAR, GITHUB_REPO_URL } from '$const'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'
</script>
<footer class='container'>
	<p>&copy; {CURRENT_YEAR} by <a href='https://www.lekoarts.de?utm_source=annum'>LekoArts</a> • <a href='/about'>About</a> • <a href={GITHUB_REPO_URL}>Source Code</a></p>
	<Spacer axis='vertical' size='xs' />
	<div class='logos flex align-center'>
		Powered by <div class='svg-wrapper'><Svg id='trakt' aria-label='Trakt' /></div> and <div class='svg-wrapper'><Svg id='tmdb' aria-label='TMDB' /></div>
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
		height: var(--space-s-m);
		width: var(--space-s-m);
	}

	.logos :global(svg[data-icon-name='trakt']) {
		color: #ED2225;
	}

	.logos :global(svg[data-icon-name='tmdb']) {
		color: #0d253f;
	}

	.svg-wrapper {
		margin: 0 var(--space-2xs);
		background: var(--color-1);
		box-shadow: 0 0 0 2px var(--color-1);
		border-radius: 100%;

		@media (--sm) {
			box-shadow: 0 0 0 4px var(--color-1);
		}
	}

	.attribution {
		& p {
			font-size: var(--step--1);
			color: var(--color-2);
		}
	}
</style>
