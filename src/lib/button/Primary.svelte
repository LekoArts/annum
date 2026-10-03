<script lang='ts'>
	import type { MouseEventHandler } from 'svelte/elements'

	type Props = {
		type: 'text'
		href?: never
		onclick: MouseEventHandler<HTMLButtonElement>
		children?: import('svelte').Snippet
		[key: string]: unknown
	} | {
		type: 'link'
		href: string
		onclick?: never
		children?: import('svelte').Snippet
		[key: string]: unknown
	}

	let {
		type = 'text',
		href = '',
		onclick,
		children,
		...rest
	}: Props = $props()
</script>

{#if type === 'text'}
	<button {onclick} {...rest}>
		{@render children?.()}
	</button>
{:else}
	<a {href} {...rest}>
		{@render children?.()}
	</a>
{/if}
