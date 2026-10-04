<script lang='ts'>
	interface Props {
		'id': 'movie' | 'tv' | 'anime' | 'chevron-right' | 'simkl' | 'arrow-right'
		'aria-label'?: string
		[key: string]: unknown
	}

	let { id, 'aria-label': label, ...rest }: Props = $props()
</script>

<svg aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label} focusable='false' class='size-[1.25em]' data-icon-name={id} {...rest}>
	<use href={`/icons.svg#${id}`} />
</svg>
