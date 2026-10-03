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

<!--
	Placeholder tiles for the first sync, when the library is not in `localStorage` yet. They reuse
	`Grid`, so the skeleton has the same geometry as the grid it stands in for - including in screenshot
	mode, where the same `--default-mode` flag drops the rounding and shadow.
-->
<div class='skeleton' aria-busy='true'>
	<p class='visually-hidden'>Loading your library…</p>
	<Grid {screenshotMode} {columns}>
		{#each tiles as tile (tile)}
			<div class='tile' aria-hidden='true'></div>
		{/each}
	</Grid>
</div>

<style lang='postcss'>
	.tile {
		--switch: var(--default-mode, 1);
		--shadow: var(--default-mode, var(--shadow-elevation-medium));
		--color-alpha: 1;

		position: relative;
		overflow: hidden;
		aspect-ratio: 1 / 1.5;
		width: 100%;
		border-radius: calc(var(--switch) * var(--space-2xs));
		box-shadow: var(--shadow);
		background: var(--color-13);
	}

	@media (prefers-reduced-motion: no-preference) {
		.tile::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(100deg, transparent 30%, var(--color-9) 50%, transparent 70%);
			opacity: 0.4;
			animation: shimmer 1.6s ease-in-out infinite;
		}

		@keyframes shimmer {
			from {
				transform: translateX(-100%);
			}

			to {
				transform: translateX(100%);
			}
		}
	}
</style>
