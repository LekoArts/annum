<script lang='ts'>
	import { CURRENT_YEAR } from '#const'
	import Svg from '#lib/Svg.svelte'
	import { dashboardSearch, resolveSelectedTypes } from '#lib/utils/dashboard.js'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	interface Props {
		year: number
		years: Array<number>
	}

	let { year, years }: Props = $props()

	/**
	 * Changing the year must not lose the media selection, so it is read back from the URL (per-parameter
	 * tracking keeps this reactive to `?types=`) and written together with the new year.
	 */
	function handleChange(event: Event) {
		const next = Number.parseInt((event.currentTarget as HTMLSelectElement).value, 10)
		const types = resolveSelectedTypes(page.url.searchParams)

		goto(`/dashboard${dashboardSearch({ year: next, types, currentYear: CURRENT_YEAR })}`, { reset: false })
	}
</script>

<div class='flex items-center gap-2'>
	<label for='year'>Year</label>
	<select id='year' value={year} onchange={handleChange}>
		{#each years as option (option)}
			<option value={option}>{option}</option>
		{/each}
	</select>
	<Svg id='chevron-right' />
</div>
