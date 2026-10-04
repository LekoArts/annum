<script lang='ts'>
	import type { SimklMediaType } from '#lib/types.js'
	import { CURRENT_YEAR } from '#const'

	import Icon from '#lib/dashboard/Icon.svelte'
	import Popover from '#lib/dashboard/Popover.svelte'
	import { library } from '#lib/store/library.js'
	import { dashboardSearch } from '#lib/utils/dashboard.js'
	import { countForYear, MEDIA_TYPE_LABELS, SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'
	import { goto } from '$app/navigation'

	interface Props {
		types: Array<SimklMediaType>
		year: number
	}

	let { types, year }: Props = $props()
	const countFormatter = new Intl.NumberFormat()
	const summary = $derived(types.length === 3 ? 'All types' : types.length === 1 ? MEDIA_TYPE_LABELS[types[0]] : '2 types')

	function toggle(type: SimklMediaType): void {
		const next = types.includes(type) ? types.filter(selected => selected !== type) : [...types, type]
		if (next.length)
			goto(`/dashboard${dashboardSearch({ year, types: next, currentYear: CURRENT_YEAR })}`, { reset: false })
	}
</script>

<Popover label='Media types' width='w-60'>
	{#snippet trigger(open, toggleMenu, id)}
		<button type='button' data-press onclick={toggleMenu} popovertarget={id} aria-controls={id} aria-expanded={open} aria-haspopup='dialog' aria-label={`Media types: ${types.map(type => MEDIA_TYPE_LABELS[type]).join(', ')}`}
			class={`flex h-10 min-w-[4.5rem] min-[360px]:min-w-[6.125rem] items-center justify-center gap-1.5 rounded-full whitespace-nowrap text-sm sm:min-w-[8.25rem] sm:gap-2 ${open ? 'bg-(--active)' : 'hover:bg-(--active)'}`}>
			<Icon name='filter' class='hidden size-[18px] min-[360px]:block' />
			<span class='sm:hidden'>{types.length === 1 ? summary : types.length === 2 ? 'Types (2)' : 'Types'}</span>
			<span class='hidden sm:inline'>{summary}</span>
			<Icon name='down' class={`size-3.5 text-(--muted) transition-transform duration-150 ease-(--ease-out) motion-reduce:transition-none [[data-input=keyboard]_&]:transition-none ${open ? '[transform:rotate(180deg)]' : ''}`} />
		</button>
	{/snippet}
	{#snippet children()}
		<div role='group' aria-label='Include media types'>
			{#each SIMKL_MEDIA_TYPES as type}
				{@const selected = types.includes(type)}
				<label class='flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 hover:bg-(--active) has-disabled:cursor-default has-disabled:hover:bg-transparent has-disabled:opacity-60'>
					<input class='size-4.5 shrink-0 accent-(--accent)' type='checkbox' checked={selected} disabled={selected && types.length === 1} onchange={() => toggle(type)} />
					<span class='text-[0.9375rem]'>{MEDIA_TYPE_LABELS[type]}</span>
					<span class='ml-auto text-[0.8125rem] text-(--muted) tabular-nums'>{countFormatter.format(countForYear($library, type, year))}</span>
				</label>
			{/each}
		</div>
		{#if types.length === 1}<p class='px-3 pt-2 pb-1 text-xs text-(--muted)'>Keep at least one type selected.</p>{/if}
	{/snippet}
</Popover>
