<script lang='ts'>
	import { CURRENT_YEAR } from '#const'
	import SettingsPopover from '#lib/dashboard/SettingsPopover.svelte'

	import TypeToggles from '#lib/dashboard/TypeToggles.svelte'
	import YearSelect from '#lib/dashboard/YearSelect.svelte'
	import { library } from '#lib/store/library.js'
	import { resolveSelectedTypes, resolveYear } from '#lib/utils/dashboard.js'
	import { availableYears } from '#lib/utils/simkl.js'
	import { page } from '$app/state'

	const years = $derived(availableYears($library, CURRENT_YEAR))
	const year = $derived(resolveYear(page.url.searchParams, CURRENT_YEAR))
	const types = $derived(resolveSelectedTypes(page.url.searchParams))
</script>

<div class='flex max-w-full min-w-0 flex-wrap items-center justify-center gap-y-1 rounded-[1.5rem] border border-(--border) bg-(--dock) p-[3px] shadow-(--dock-shadow)' aria-label='Collection controls' role='group'>
	<TypeToggles {types} {year} />
	<span aria-hidden='true' class='mx-0.5 h-6 w-px bg-(--border) sm:mx-1.5'></span>
	<YearSelect {year} {years} {types} />
	<span aria-hidden='true' class='mx-0.5 h-6 w-px bg-(--border) sm:mx-1.5'></span>
	<SettingsPopover />
</div>
