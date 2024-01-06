<script lang='ts'>
	import { SKIP_TO_CONTENT_ID } from '$const'

	export let id = SKIP_TO_CONTENT_ID
</script>

<a {...$$restProps} class='skip-to-content-nav' href={`#${id}`}>
	<slot name='text'>
		Skip to content
	</slot>
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
