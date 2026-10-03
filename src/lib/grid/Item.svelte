<script lang='ts'>
	interface Props {
		index: number
		href: string
		children?: import('svelte').Snippet
	}

	let { index, href, children }: Props = $props()
</script>

<a class='grid-item' {href} target='_blank' rel='noopener noreferrer' data-num={index + 1}>
	{@render children?.()}
</a>

<style lang='postcss'>
  .grid-item {
		--switch: var(--default-mode, 1);
		--shadow: var(--default-mode, var(--shadow-elevation-medium));

    display: block;
    border-radius: calc(var(--switch) * var(--space-2xs));
		overflow: hidden;
		box-shadow: var(--shadow);
  }
</style>
