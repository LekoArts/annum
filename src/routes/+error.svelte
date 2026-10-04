<script lang='ts'>
	import { GITHUB_REPO_URL } from '#const'
	import { pa } from '#lib/store/plausible.js'
	import { page } from '$app/state'

	const heading = $derived(page.status === 404 ? 'Page not found.' : page.status === 401 ? 'Sign in to continue.' : page.status === 403 ? 'This page is unavailable to you.' : 'Something went wrong.')

	if (page.status === 404) {
		pa.addEvent('404', {
			props: {
				path: page.url.pathname,
			},
		})
	}
</script>

<section aria-labelledby='error-heading' class='home-typography pt-10 pb-8 sm:pt-16 sm:pb-12 [&_p_a]:font-medium [&_p_a]:text-(--ink) [&_p_a]:underline [&_p_a]:decoration-(--border) [&_p_a]:underline-offset-4 [&_p_a:hover]:text-(--accent)'>
	<h1 id='error-heading' class='max-w-[24ch] font-(family-name:--font-wordmark) text-[40px] leading-[1.1] font-bold tracking-[-0.03em] text-balance sm:text-[48px]'>{heading}</h1>
	<div class='mt-6 max-w-[55ch] text-base leading-7 text-pretty text-(--muted) sm:text-lg sm:leading-relaxed'>
		{#if page.status === 404}
			<p>The page you’re looking for doesn’t exist. Head back home to find your way.</p>
		{:else if page.status === 401}
			<p>You need to be signed in to view this page. Connect your Simkl account to continue.</p>
		{:else if page.status === 403}
			<p>You don’t have permission to view this page. You can return to the homepage.</p>
		{:else}
			<p>We couldn’t load this page. Please try again later. If the problem continues, <a href={GITHUB_REPO_URL}>open an issue on GitHub</a>.</p>
		{/if}
	</div>
	<div class='mt-8 flex flex-wrap items-center gap-x-6 gap-y-3'>
		<a href={page.status === 401 ? '/sign-in' : '/'} data-press class='home-cta inline-flex min-h-12 items-center justify-center rounded-full bg-(--accent) px-7 py-3 text-base font-semibold text-(--on-accent)'>{page.status === 401 ? 'Sign in with Simkl' : 'Back to home'}</a>
		{#if page.status !== 401}
			<a href='/dashboard' class='inline-flex min-h-12 items-center gap-2 text-base font-medium text-(--muted) hover:text-(--ink)'>Dashboard <svg viewBox='0 0 24 24' class='size-4' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M4 12h16m-6-6 6 6-6 6' /></svg></a>
		{/if}
	</div>
	<p class='mt-10 text-sm leading-6 text-(--muted)'>Error {page.status}</p>
</section>
