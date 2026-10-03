<script lang='ts'>
	import Grid from '#lib/grid/Grid.svelte'

	interface Props {
		screenshotMode?: boolean
		columns?: number
		count?: number
	}

	let { screenshotMode = false, columns = 5, count = 24 }: Props = $props()

	/** A rough screenful of tiles; the exact number does not matter while the library is unknown. */
	const tiles = $derived(Array.from({ length: count }, (_, index) => index))
</script>

<!-- Placeholders for the first sync, drawn through `Grid` so they share its geometry. The tiles keep the
     poster aspect ratio, so the grid does not reflow when the real posters arrive. -->
<div aria-busy='true'>
	<p class='sr-only'>Loading your library…</p>
	<Grid {screenshotMode} {columns}>
		{#each tiles as tile (tile)}
			<div class='aspect-[2/3] w-full bg-current/10' aria-hidden='true'></div>
		{/each}
	</Grid>
</div>
