<script lang='ts'>
	import { SKIP_TO_CONTENT_ID } from '#const'

	interface Props {
		id?: string
		text?: import('svelte').Snippet
		[key: string]: unknown
	}

	let { id = SKIP_TO_CONTENT_ID, text, ...rest }: Props = $props()
</script>

<a {...rest} class='sr-only focus:not-sr-only' href={`#${id}`}>
	{#if text}{@render text()}{:else}
		Skip to content
	{/if}
</a>
