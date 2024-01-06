<script lang='ts'>
	export let type: 'text' | 'link' = 'text'
	export let href: string = ''
</script>

{#if type === 'text'}
	<button class='button-primary' on:click {...$$restProps}>
		<slot />
	</button>
{:else}
	<a {href} class='button-primary' {...$$restProps}>
		<slot />
	</a>
{/if}

<style lang='postcss'>
  .button-primary {
    display: inline-flex;
    appearance: none;
    align-items: center;
    justify-content: center;
    user-select: none;
    position: relative;
    white-space: nowrap;
    vertical-align: middle;
    text-decoration: none;
    border-radius: var(--space-2xs);
    background: var(--color-9);
    padding: var(--space-3xs-2xs) var(--space-xs-s);
    border: 1px solid var(--color-7);
    color: var(--color-0);
    box-shadow: var(--shadow-elevation-low);
    line-height: 1.25;
    transition: all .3s cubic-bezier(.73,.26,.42,1.24);
    text-shadow: 0px 2px 6px var(--color-4);

    &:hover {
      background: var(--color-8);
      cursor: pointer;
      box-shadow: var(--shadow-elevation-medium);
      transform: translate3d(0px, -2px, 0px);
    }
  }
</style>
