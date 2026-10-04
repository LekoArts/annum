<script lang='ts'>
	interface Props {
		screenshotMode?: boolean
		columns?: number
		children?: import('svelte').Snippet
	}

	let { screenshotMode = false, columns = 5, children }: Props = $props()

	// Geometry travels in CSS variables (`--gap`, `--columns`), which any future design can read. Screenshot
	// mode drops the gutters and pins the column count so posters fill the page.
	const layout = $derived(screenshotMode
		? '[grid-template-columns:repeat(var(--columns),minmax(0,1fr))]'
		: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6')
</script>

<div
	class={`grid gap-[var(--gap)] [--responsive-columns:2] sm:[--responsive-columns:3] md:[--responsive-columns:4] lg:[--responsive-columns:5] 2xl:[--responsive-columns:6] ${layout}`}
	style:--poster-shadow={screenshotMode ? 'none' : 'var(--poster-elevation)'}
	style:--poster-outline={screenshotMode ? 'transparent' : 'var(--image-edge)'}
	style:--poster-radius={screenshotMode ? '0px' : '8px'}
	style={`--gap: ${screenshotMode ? '0px' : 'clamp(8px, 1vw, 12px)'}; --columns: ${columns > 0 ? columns : 'var(--responsive-columns)'};`}>
	{@render children?.()}
</div>
