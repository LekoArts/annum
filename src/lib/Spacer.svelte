<script lang='ts'>
	export let size: '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl'
	export let axis: 'vertical' | 'horizontal'

	const width = axis === 'vertical' ? '1px' : `var(--space-${size})`
	const height = axis === 'horizontal' ? '1px' : `var(--space-${size})`
</script>

<span style:width={width} style:height={height} style:min-width={width} style:min-height={height} style:display='block' {...$$restProps}></span>
