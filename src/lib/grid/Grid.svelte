<script lang='ts'>
	interface Props {
		screenshotMode?: boolean
		columns?: number
		children?: import('svelte').Snippet
	}

	let { screenshotMode = false, columns = 5, children }: Props = $props()
</script>

<div class={`grid${screenshotMode ? ' screenshot' : ''}`} style={`${screenshotMode ? `--col: ${columns};` : ''}`}>
	{@render children?.()}
</div>

<style lang='postcss'>
  .grid {
    --gap: var(--grid-gutter);
    --columns: repeat(auto-fill, minmax(calc(var(--space-m-l) * 5), 1fr));

    display: grid;
    gap: var(--gap);
    grid-template-columns: var(--columns);
  }

  .screenshot {
    --gap: 0 !important;
    --columns: repeat(var(--col), 1fr) !important;
    --default-mode: 0;
  }
</style>
