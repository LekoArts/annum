<script lang='ts'>
	import { SVG_ICON_IDS } from '#const'

	interface Props {
		'id': (typeof SVG_ICON_IDS)[number]
		'aria-label'?: string
		[key: string]: unknown
	}

	let { id, 'aria-label': label, ...rest }: Props = $props()
</script>

<svg aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label} focusable='false' class='size-[1.25em]' data-icon-name={id} {...rest}>
	<use href={`/icons.svg#${id}`} />
</svg>
