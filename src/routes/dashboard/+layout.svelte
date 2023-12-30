<script lang="ts">
	import type { LayoutData } from './$types'
	import { signOut } from '@auth/sveltekit/client'
	import { page } from '$app/stores'

	export let data: LayoutData
</script>

<p>Signed in as {$page.data.session?.user.name}</p>
<p>User slug: {$page.data.session?.user.id}</p>
<button on:click={() => signOut({ callbackUrl: '/' })}>Sign out</button>

<slot />
