<script lang='ts'>
	interface Props {
		index: number
		href: string
		children?: import('svelte').Snippet
	}

	let { index, href, children }: Props = $props()
</script>

<a class='block' {href} target='_blank' rel='noopener noreferrer' data-num={index + 1}>
	{@render children?.()}
</a>
