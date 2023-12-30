<script lang="ts">
	import type { TmdbImageUrlsWithDimensions } from '$lib/types';
	import type { HTMLImgAttributes } from 'svelte/elements';

	export let alt: string
	export let loading: HTMLImgAttributes['loading']
	export let images: TmdbImageUrlsWithDimensions

	let maxWidth = images.w780.width
	let maxHeight = images.w780.height
	let src = images.w780.url

	let sizes = `(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`
	let srcset = [
		`${images.w780.url} ${images.w780.width}w`,
		`${images.w500.url} ${images.w500.width}w`,
		`${images.w342.url} ${images.w342.width}w`,
	].join(', ')
	let style = `object-fit: cover; max-width: ${maxWidth}px; max-height: ${maxHeight}px; aspect-ratio: 1 / 1.5; width: 100%;`
</script>

<img {alt} {loading} decoding="async" {sizes} {srcset} {style} {src} />