<script lang='ts'>
	import { CURRENT_YEAR } from '#const'
	import Svg from '#lib/Svg.svelte'
	import { dashboardSearch, resolveSelectedTypes } from '#lib/utils/dashboard.js'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	interface Props {
		year: number
		options: Array<{ year: number, count: number }>
	}

	let { year, options }: Props = $props()

	/**
	 * Changing the year must not lose the media selection, so it is read back from the URL (per-parameter
	 * tracking keeps this reactive to `?types=`) and written together with the new year.
	 */
	function handleChange(event: Event) {
		const next = Number.parseInt((event.currentTarget as HTMLSelectElement).value)
		const types = resolveSelectedTypes(page.url.searchParams)

		goto(`/dashboard${dashboardSearch({ year: next, types, currentYear: CURRENT_YEAR })}`, { reset: false })
	}
</script>

<div class='year-select flex align-center'>
	<label for='year'>Year</label>
	<select id='year' value={year} onchange={handleChange}>
		{#each options as option (option.year)}
			<option value={option.year}>{option.year} ({option.count})</option>
		{/each}
	</select>
	<Svg id='chevron-right' />
</div>

<style lang='postcss'>
	.year-select {
		--color-alpha: 1;
		position: relative;

		& label {
			--color-alpha: 0.75;
			margin-right: var(--space-2xs);
		}

		& select {
			appearance: none;
			background: var(--color-0);
			color: var(--color-13);
			border: 1px solid var(--color-6);
			border-radius: var(--space-2xs);
			padding: var(--space-3xs) var(--space-l) var(--space-3xs) var(--space-xs);
			font: inherit;
			line-height: 1.25;
			cursor: pointer;

			&:hover {
				border-color: var(--color-4);
			}
		}

		& :global(svg) {
			--icon-color: var(--color-13);
			position: absolute;
			right: var(--space-2xs);
			top: 50%;
			transform: translateY(-50%) rotate(90deg);
			pointer-events: none;
		}
	}
</style>
