<script lang='ts'>
	import { SKIP_TO_CONTENT_ID } from '$const'

	interface Props {
		id?: string
		text?: import('svelte').Snippet
		[key: string]: unknown
	}

	let { id = SKIP_TO_CONTENT_ID, text, ...rest }: Props = $props()
</script>

<a {...rest} class='skip-to-content-nav' href={`#${id}`}>
	{#if text}{@render text()}{:else}
		Skip to content
	{/if}
</a>

<style>
  .skip-to-content-nav {
    border: 0;
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    clip: rect(0 0 0 0);

    &:focus {
      padding: 1rem;
      position: fixed;
      top: 10px;
      left: 10px;
      background: white;
      color: black;
      border: 2px solid black;
      text-decoration: none;
      border-radius: 5px;
      z-index: 1000;
      width: auto;
      height: auto;
      clip: auto;
    }
  }
</style>
