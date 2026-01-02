<script lang='ts'>
	import type { TmdbImageUrlsWithDimensions } from '$lib/types'
	import type { HTMLImgAttributes } from 'svelte/elements'
	import { fade } from 'svelte/transition'

	interface Props {
		alt: string
		loading: HTMLImgAttributes['loading']
		images: TmdbImageUrlsWithDimensions
	}

	let { alt, loading, images }: Props = $props()

	const maxWidth = $derived(images.w780.width)
	const maxHeight = $derived(images.w780.height)
	const src = $derived(images.w780.url)

	const sizes = $derived(`(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`)
	const srcset = $derived([
		`${images.w780.url} ${images.w780.width}w`,
		`${images.w500.url} ${images.w500.width}w`,
		`${images.w342.url} ${images.w342.width}w`,
	].join(', '))
	const style = $derived(`object-fit: cover; max-width: ${maxWidth}px; max-height: ${maxHeight}px; aspect-ratio: 1 / 1.5; width: 100%;`)
</script>

<img decoding='async' transition:fade {alt} {loading} {sizes} {srcset} {style} {src} />
