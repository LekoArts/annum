<script lang='ts'>
	type SvgIconNames = 'movie' | 'tv' | 'home' | 'chevron-right'

	export let id: SvgIconNames
</script>

<svg aria-hidden focusable='false' class='icon' {...$$restProps}>
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
