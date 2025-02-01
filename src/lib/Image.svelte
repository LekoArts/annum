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

	const maxWidth = images.w780.width
	const maxHeight = images.w780.height
	const src = images.w780.url

	const sizes = `(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`
	const srcset = [
		`${images.w780.url} ${images.w780.width}w`,
		`${images.w500.url} ${images.w500.width}w`,
		`${images.w342.url} ${images.w342.width}w`,
	].join(', ')
	const style = `object-fit: cover; max-width: ${maxWidth}px; max-height: ${maxHeight}px; aspect-ratio: 1 / 1.5; width: 100%;`
</script>

<img decoding='async' transition:fade {alt} {loading} {sizes} {srcset} {style} {src} />
