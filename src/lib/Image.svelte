<script lang='ts'>
	import type { HTMLImgAttributes } from 'svelte/elements'
	import { SIMKL_POSTER_PLACEHOLDER, simklPosterSrcset, simklPosterUrl } from '#lib/utils/simkl.js'
	import { fade } from 'svelte/transition'

	interface Props {
		alt: string
		loading: HTMLImgAttributes['loading']
		poster: string | null
	}

	let { alt, loading, poster }: Props = $props()

	const src = $derived(simklPosterUrl(poster))
	const srcset = $derived(simklPosterSrcset(poster))
	/**
	 * `auto` is only legal on lazy images — the HTML spec defines an `<img>` as "allows auto-sizes"
	 * when its `loading` is in the lazy state — so the eagerly loaded first poster of a page keeps the
	 * pre-`srcset` behaviour: no `sizes` means 100vw, which selects the largest available poster.
	 */
	const sizes = $derived(loading === 'lazy' ? 'auto' : undefined)
	const style = $derived('object-fit: cover; aspect-ratio: 1 / 1.5; width: 100%;')
	let failed = $state(false)

	/**
	 * Poster paths can go stale (Simkl merges titles), which would leave a broken image. Swap in the
	 * placeholder and drop the `srcset` so it cannot pick a stale path again; the flag keeps a failing
	 * placeholder from looping.
	 */
	function handleError(event: Event) {
		if (failed)
			return

		failed = true

		const img = event.currentTarget as HTMLImageElement

		img.removeAttribute('srcset')
		img.src = SIMKL_POSTER_PLACEHOLDER
	}
</script>

<!--
	`sizes='auto'` lets the browser measure the tile itself: the grid is fluid (auto-fill in normal
	mode, a user-chosen column count in screenshot mode), so only the layout knows how wide a poster
	ends up. The source size is in CSS pixels and the browser multiplies it by the device pixel ratio
	when picking a candidate, so high-DPI screens get the largest poster Simkl has (340px) rather than
	one matching the tile in CSS pixels.
-->
<img decoding='async' transition:fade {alt} {loading} {src} {srcset} {sizes} {style} onerror={handleError} />
