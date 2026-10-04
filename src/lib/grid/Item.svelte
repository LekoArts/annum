<script lang='ts'>
	interface Props {
		index: number
		href: string
		children?: import('svelte').Snippet
	}

	let { index, href, children }: Props = $props()
</script>

<a class='relative block overflow-hidden rounded-(--poster-radius) bg-(--active) shadow-(--poster-shadow) outline-offset-4 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[inset_0_0_0_1px_var(--poster-outline)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_2px_var(--poster-hover-edge)] after:opacity-0 hover:after:opacity-100' {href} target='_blank' rel='noopener noreferrer' data-num={index + 1}>
	{@render children?.()}
</a>
