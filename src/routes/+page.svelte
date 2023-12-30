<script lang='ts'>
	import { page } from '$app/stores'
	import Homepage from '$lib/pages/homepage.svelte'

	// eslint-disable-next-line svelte/valid-compile
	export let isSignedIn = Boolean($page.data.session?.user)
</script>

<Homepage {isSignedIn} />
