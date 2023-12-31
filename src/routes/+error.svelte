<script lang='ts'>
	import { page } from '$app/stores'
	import { GITHUB_REPO_URL } from '$const'
</script>

<div class='error-page'>
	<h1>Error</h1>
	{#if $page.error?.message}
		<p>{$page.error.message}</p>
	{:else}
		<p>Something went wrong. Please try again, and if that doesn't help please create a bug report on <a href={GITHUB_REPO_URL}>GitHub</a>. Thanks!</p>
	{/if}
</div>
