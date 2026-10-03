<script lang='ts'>
	import type { HTMLImgAttributes } from 'svelte/elements'
	import { simklPosterUrl } from '#lib/utils/simkl.js'
	import { fade } from 'svelte/transition'

	interface Props {
		alt: string
		loading: HTMLImgAttributes['loading']
		poster: string | null
	}

	let { alt, loading, poster }: Props = $props()

	const src = $derived(simklPosterUrl(poster))
	const style = $derived('object-fit: cover; aspect-ratio: 1 / 1.5; width: 100%;')
</script>

<img decoding='async' transition:fade {alt} {loading} {src} {style} />
