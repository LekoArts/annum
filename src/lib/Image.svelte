<script lang='ts'>
	import type { HTMLImgAttributes } from 'svelte/elements'
	import { SIMKL_POSTER_PLACEHOLDER, simklPosterSrcset, simklPosterUrl } from '#lib/utils/simkl.js'

	interface Props {
		alt: string
		loading: HTMLImgAttributes['loading']
		poster: string | null
	}

	let { alt, loading, poster }: Props = $props()

	const src = $derived(simklPosterUrl(poster))
	const srcset = $derived(simklPosterSrcset(poster))
	// `auto` is only legal on lazy images, so the eager first poster keeps no `sizes` (100vw, i.e. the largest)
	const sizes = $derived(loading === 'lazy' ? 'auto' : undefined)
	let failed = $state(false)

	// Stale poster paths (Simkl merges titles) fall back to the placeholder with its `srcset` dropped;
	// the flag keeps a failing placeholder from looping
	function handleError(event: Event) {
		if (failed)
			return

		failed = true

		const img = event.currentTarget as HTMLImageElement

		img.removeAttribute('srcset')
		img.src = SIMKL_POSTER_PLACEHOLDER
	}
</script>

<!-- `sizes='auto'` lets the browser measure the tile, which only the fluid grid knows. The browser
     multiplies the CSS width by the device pixel ratio, so high-DPI screens get Simkl's largest (340px) -->
<img class='aspect-2/3 w-full object-cover' decoding='async' {alt} {loading} {src} {srcset} {sizes} onerror={handleError} />
