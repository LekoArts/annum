<script lang='ts'>
	export let screenshotMode = false
	export let columns = 5
</script>

<div class={`grid${screenshotMode ? ' screenshot' : ''}`} style={`${screenshotMode ? `--col: ${columns};` : ''}`}>
	<slot />
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
