<script lang='ts'>
	import { signIn } from '@auth/sveltekit/client'
</script>

<p>Not signed in.</p>
<button on:click={() => signIn('trakt', { callbackUrl: '/dashboard' })}>Sign in</button>
