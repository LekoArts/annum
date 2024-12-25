<script lang='ts'>
	import { style } from '$lib/actions'
	import { settings } from '$lib/store/settings'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()
</script>

{@render children?.()}

<svelte:body use:style={`--color-hue: ${$settings.hue};${$settings.grayscaleMode ? ' --color-chroma: 0;' : ''}`} />
