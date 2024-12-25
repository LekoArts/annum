<script lang='ts'>
	interface Props {
		id: 'movie' | 'tv' | 'home' | 'chevron-right' | 'tmdb' | 'trakt' | 'arrow-right'
		[key: string]: unknown
	}

	let { id, ...rest }: Props = $props()
</script>

<svg aria-hidden='true' focusable='false' class='icon' data-icon-name={id} {...rest}>
	<use href={`/icons.svg#${id}`} />
</svg>

<style lang='ts'>
	.icon {
		height: var(--space-xs-s);
		width: var(--space-xs-s);
		min-height: var(--space-xs-s);
		min-width: var(--space-xs-s);
		color: var(--icon-color, inherit);
	}
</style>
