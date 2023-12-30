<script lang='ts'>
	import { signOut } from '@auth/sveltekit/client'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<p>Signed in as {data.session?.user.name}</p>
<p>User slug: {data.session?.user.id}</p>
<button on:click={() => signOut({ callbackUrl: '/' })}>Sign out</button>

<slot />
