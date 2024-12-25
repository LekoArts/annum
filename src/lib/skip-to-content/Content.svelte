<script lang='ts'>
	import { SKIP_TO_CONTENT_ID } from '$const'

	interface Props {
		id?: string
		children?: import('svelte').Snippet
		[key: string]: unknown
	}

	let { id = SKIP_TO_CONTENT_ID, children, ...rest }: Props = $props()
</script>

<main {...rest} {id}>
	{@render children?.()}
</main>
