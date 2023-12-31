<span class='visually-hidden' {...$$restProps}>
	<slot />
</span>

<style>
  .visually-hidden {
    position: absolute;
    overflow: hidden;
    clip: 'rect(0 0 0 0)';
    height: 1;
    width: 1;
    margin: -1;
    padding: 0;
    border: 0;
  }
</style>
