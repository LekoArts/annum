<script lang="ts">
	import { page } from '$app/stores'
	import Homepage from '$lib/pages/homepage.svelte';

	export let isSignedIn = Boolean($page.data.session?.user)
</script>

<Homepage {isSignedIn} />
