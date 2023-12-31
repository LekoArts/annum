<script lang='ts'>
	import { signIn } from '@auth/sveltekit/client'
	import { page } from '$app/stores'

	// eslint-disable-next-line svelte/valid-compile
	let isSignedIn = Boolean($page.data.session?.user)
</script>

<h1>Home</h1>
<p>Welcome to Trakt Yearly Posters</p>
{#if isSignedIn}
	<p>Go to <a href='/dashboard'>Dashboard</a></p>
{:else}
	<p>Not signed in.</p>
	<button on:click={() => signIn('trakt', { callbackUrl: '/dashboard' })}>Sign in</button>
{/if}
