<script>
	import { SKIP_TO_CONTENT_ID } from '$const'

	export let id = SKIP_TO_CONTENT_ID
</script>

<main {...$$restProps} {id}>
	<slot />
</main>
