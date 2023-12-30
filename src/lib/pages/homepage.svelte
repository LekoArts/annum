<script lang="ts">
	import { signIn } from '@auth/sveltekit/client'

	export let isSignedIn: boolean
</script>

<main>
	<h1>Home</h1>
	<p>Welcome to Trakt Yearly Posters</p>
	{#if isSignedIn}
		<p>Go to <a href="/dashboard">Dashboard</a></p>
	{:else}
		<p>Not signed in.</p>
		<button on:click={() => signIn('trakt', { callbackUrl: '/dashboard' })}>Sign in</button>
	{/if}
</main>