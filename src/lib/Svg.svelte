<script lang='ts'>
	interface Props {
		id: 'movie' | 'tv' | 'anime' | 'chevron-right' | 'simkl' | 'arrow-right'
		[key: string]: unknown
	}

	let { id, ...rest }: Props = $props()
</script>

<svg aria-hidden='true' focusable='false' class='size-[1.25em]' data-icon-name={id} {...rest}>
	<use href={`/icons.svg#${id}`} />
</svg>
