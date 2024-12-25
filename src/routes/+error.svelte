<script lang='ts'>
	import { page } from '$app/stores'
	import { GITHUB_REPO_URL } from '$const'
	import { pa } from '$lib/store/plausible'

	if ($page.status === 404) {
		pa.addEvent('404', {
			props: {
				path: $page.url.pathname,
			},
		})
	}
</script>

<div class='error-page'>
	{#if $page.error?.message}
		<h1>{$page.status}: {$page.error.message}</h1>
		{#if $page.status === 404}
			<p>Sorry, the page you are looking for does not exist.</p>
		{:else if $page.status === 401}
			<p>Sorry, you are not authorized to view this page.</p>
		{:else if $page.status === 403}
			<p>Sorry, you are forbidden to view this page.</p>
		{:else if $page.status === 500}
			<p>Sorry, something went wrong on our end. Please try again later.</p>
		{:else}
			<p>Something went wrong. Please try again, and if that doesn't help please create a bug report on <a href={GITHUB_REPO_URL}>GitHub</a>. Thanks!</p>
		{/if}
	{:else}
		<p>Something went wrong. Please try again, and if that doesn't help please create a bug report on <a href={GITHUB_REPO_URL}>GitHub</a>. Thanks!</p>
	{/if}
</div>

<style lang='postcss'>
	.error-page {
		text-align: center;
	}
</style>
