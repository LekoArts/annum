<script lang='ts'>
	export let index: number
</script>

<div class='grid-item' data-num={index + 1}>
	<slot />
</div>

<style lang='postcss'>
  .grid-item {
    border-radius: var(--space-2xs);
		overflow: hidden;
		box-shadow: var(--shadow-elevation-medium);
  }
</style>
