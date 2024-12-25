<script lang='ts'>
	interface Props {
		type: 'text' | 'link'
		href: string
		children?: import('svelte').Snippet
		[key: string]: any
	}

	let {
		type = 'text',
		href = '',
		onclick,
		children,
		...rest
	}: Props = $props()
</script>

{#if type === 'text'}
	<button class='button-secondary' {onclick} {...rest}>
		{@render children?.()}
	</button>
{:else}
	<a {href} class='button-secondary' {...rest}>
		{@render children?.()}
	</a>
{/if}

<style lang='postcss'>
  .button-secondary {
    background: none;
    border: 1px solid var(--color-6);
    padding: var(--space-3xs) var(--space-xs);
    border-radius: var(--space-2xs);
    color: var(--color-0);
    box-shadow: var(--shadow-elevation-low);
    display: inline-flex;
    appearance: none;
    align-items: center;
    justify-content: center;
    user-select: none;
    position: relative;
    white-space: nowrap;
    vertical-align: middle;
    text-decoration: none;
    line-height: 1.25;
    transition: background .3s cubic-bezier(.73,.26,.42,1.24), border .3s cubic-bezier(.73,.26,.42,1.24);
    text-shadow: 0px 2px 6px var(--color-5);

    &:hover {
      background: var(--color-8);
      cursor: pointer;
      border: 1px solid var(--color-4);
    }
  }
</style>
