<script lang='ts'>
	import { style } from '$lib/actions'
	import { settings } from '$lib/store/settings'
</script>

<slot />

<svelte:body use:style={`--color-hue: ${$settings.hue};${$settings.grayscaleMode ? ' --color-chroma: 0;' : ''}`} />
