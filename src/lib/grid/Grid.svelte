<div class='grid'>
	<slot />
</div>

<style lang='postcss'>
  .grid {
    display: grid;
    gap: var(--grid-gutter);
    grid-template-columns: repeat(auto-fill,minmax(calc(var(--space-m-l) * 5), 1fr));
  }
</style>
