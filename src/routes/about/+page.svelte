<script lang='ts'>
	import { GITHUB_REPO_URL } from '#const'
</script>

<article class='home-typography pt-10 pb-8 sm:pt-16 sm:pb-12 [&_p_a]:font-medium [&_p_a]:text-(--ink) [&_p_a]:underline [&_p_a]:decoration-(--border) [&_p_a]:decoration-1 [&_p_a]:underline-offset-4 [&_p_a:hover]:decoration-(--accent) [&_p_a:hover]:text-(--accent)'>
	<h1 class='font-(family-name:--font-wordmark) text-[40px] leading-[1.1] font-bold tracking-[-0.03em] text-balance sm:text-[48px]'>Hi, thanks for using this app!</h1>

	<div class='mt-12 space-y-10 text-base leading-7 text-pretty text-(--muted) sm:text-lg sm:leading-relaxed'>
		<section aria-labelledby='about-origin'>
			<h2 id='about-origin' class='mb-3 font-(family-name:--font-wordmark) text-2xl leading-tight font-semibold tracking-[-0.02em] text-(--ink)'>Made by LekoArts</h2>
			<p>This website was created by <a href='https://www.lekoarts.de?utm_source=annum'>LekoArts</a> as a Christmas project to try out SvelteKit. LekoArts loves watching movies and shows — so why not have a great overview?</p>
		</section>
		<section aria-labelledby='about-source'>
			<h2 id='about-source' class='mb-3 font-(family-name:--font-wordmark) text-2xl leading-tight font-semibold tracking-[-0.02em] text-(--ink)'>Open source</h2>
			<p>It’s open source and available on GitHub at <a href={GITHUB_REPO_URL}>LekoArts/annum</a>. Contributions welcome!</p>
		</section>
		<section aria-labelledby='about-simkl'>
			<h2 id='about-simkl' class='mb-3 font-(family-name:--font-wordmark) text-2xl leading-tight font-semibold tracking-[-0.02em] text-(--ink)'>Powered by Simkl</h2>
			<p><a href='https://simkl.com'>Simkl</a> provides the metadata and posters for all movies, shows and anime you can see on this website.</p>
		</section>
	</div>

</article>
