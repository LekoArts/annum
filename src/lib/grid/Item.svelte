<script lang='ts'>
	export let index: number
</script>

<div class='grid-item' data-num={index + 1}>
	<slot />
</div>

<style lang='postcss'>
  .grid-item {
		--switch: var(--default-mode, 1);
		--shadow: var(--default-mode, var(--shadow-elevation-medium));

    border-radius: calc(var(--switch) * var(--space-2xs));
		overflow: hidden;
		box-shadow: var(--shadow);
  }
</style>
