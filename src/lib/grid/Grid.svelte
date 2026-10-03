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
		? '[grid-template-columns:repeat(var(--columns),1fr)]'
		: '[grid-template-columns:repeat(auto-fill,minmax(10rem,1fr))]')
</script>

<div
	class={`grid gap-[var(--gap)] ${layout}`}
	style={`--gap: ${screenshotMode ? '0px' : '1rem'}; --columns: ${columns};`}>
	{@render children?.()}
</div>
