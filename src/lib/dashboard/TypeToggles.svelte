<script lang='ts'>
	import type { SimklMediaType } from '#lib/types.js'
	import { CURRENT_YEAR } from '#const'
	import Svg from '#lib/Svg.svelte'
	import { dashboardSearch } from '#lib/utils/dashboard.js'
	import { MEDIA_TYPE_ICONS, MEDIA_TYPE_LABELS, SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'
	import { goto } from '$app/navigation'

	interface Props {
		types: Array<SimklMediaType>
		year: number
	}

	let { types, year }: Props = $props()

	/**
	 * The selection lives in the URL, so a toggle is a navigation. `reset: false` keeps the scroll
	 * position and focus where they were - the grid swaps underneath without the page jumping.
	 */
	function toggle(type: SimklMediaType) {
		const next = types.includes(type)
			? types.filter(selected => selected !== type)
			: [...types, type]

		goto(`/dashboard${dashboardSearch({ year, types: next, currentYear: CURRENT_YEAR })}`, { reset: false })
	}
</script>

<div class='flex flex-wrap items-center gap-2' role='group' aria-label='Media types'>
	{#each SIMKL_MEDIA_TYPES as type}
		{@const selected = types.includes(type)}
		<!-- The last selected type is disabled: an empty selection is not a state this page has. -->
		<button
			class='flex items-center gap-2'
			type='button'
			aria-pressed={selected}
			disabled={selected && types.length === 1}
			onclick={() => toggle(type)}>
			<Svg id={MEDIA_TYPE_ICONS[type]} />
			{MEDIA_TYPE_LABELS[type]}
		</button>
	{/each}
</div>
