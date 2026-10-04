<script lang='ts'>
	import { SKIP_TO_CONTENT_ID } from '#const'

	interface Props {
		id?: string
		text?: import('svelte').Snippet
		[key: string]: unknown
	}

	let { id = SKIP_TO_CONTENT_ID, text, ...rest }: Props = $props()
</script>

<a {...rest} class='fixed top-3 left-3 z-50 -translate-y-[calc(100%+1rem)] rounded-lg border border-(--border) bg-(--menu) px-4 py-3 text-sm font-medium text-(--ink) shadow-(--menu-shadow) focus:translate-y-0' href={`#${id}`}>
	{#if text}{@render text()}{:else}
		Skip to content
	{/if}
</a>
