<script lang='ts'>
	import type { SimklMediaType } from '#lib/types.js'
	import { CURRENT_YEAR } from '#const'

	import Icon from '#lib/dashboard/Icon.svelte'
	import Popover from '#lib/dashboard/Popover.svelte'
	import { dashboardSearch } from '#lib/utils/dashboard.js'
	import { goto } from '$app/navigation'

	interface Props {
		year: number
		years: Array<number>
		types: Array<SimklMediaType>
	}

	let { year, years, types }: Props = $props()
	// Bounds come from the offered range rather than the index, so a deep link to a year with no items is
	// still steppable instead of disabling both arrows.
	const newest = $derived(years.at(0) ?? year)
	const oldest = $derived(years.at(-1) ?? year)

	function choose(next: number, close?: () => void): void {
		goto(`/dashboard${dashboardSearch({ year: next, types, currentYear: CURRENT_YEAR })}`, { reset: false })
		close?.()
	}
</script>

<div class='flex items-center'>
	<button class='flex size-8 shrink-0 items-center justify-center rounded-full text-(--muted) hover:bg-(--active) hover:text-(--ink) disabled:cursor-default disabled:opacity-35' type='button' data-press aria-label='Previous year' disabled={year <= oldest} onclick={() => choose(year - 1)}>
		<Icon name='left' class='size-[18px]' />
	</button>
	<Popover label='Select year' width='w-44'>
		{#snippet trigger(open, toggle, id)}
			<button class={`flex h-10 items-center gap-1 rounded-full px-1 min-[360px]:px-2 text-sm font-medium tabular-nums sm:gap-2 sm:px-3 ${open ? 'bg-(--active)' : 'hover:bg-(--active)'}`} type='button' data-press onclick={toggle} popovertarget={id} aria-controls={id} aria-expanded={open} aria-haspopup='dialog' aria-label={`Select year, ${year}`}>
				{year}<Icon name='down' class={`hidden size-3.5 text-(--muted) min-[360px]:block transition-transform duration-150 ease-(--ease-out) motion-reduce:transition-none [[data-input=keyboard]_&]:transition-none ${open ? '[transform:rotate(180deg)]' : ''}`} />
			</button>
		{/snippet}
		{#snippet children(close)}
			<p class='px-3 pt-2 pb-1.5 text-xs text-(--muted)'>Year</p>
			<div class='max-h-80 space-y-px overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--border)_color-mix(in_srgb,var(--active)_40%,transparent)]'>
				{#each years as option}
					<button type='button' aria-current={option === year ? 'true' : undefined} onclick={() => choose(option, close)} class={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left tabular-nums focus-visible:outline-offset-[-2px] ${option === year ? 'bg-(--active)' : 'hover:bg-(--active)'}`}>
						{option}
						{#if option === year}<Icon name='check' class='size-4 text-(--accent)' />{/if}
					</button>
				{/each}
			</div>
		{/snippet}
	</Popover>
	<button class='flex size-8 shrink-0 items-center justify-center rounded-full text-(--muted) hover:bg-(--active) hover:text-(--ink) disabled:cursor-default disabled:opacity-35' type='button' data-press aria-label='Next year' disabled={year >= newest} onclick={() => choose(year + 1)}>
		<Icon name='right' class='size-[18px]' />
	</button>
</div>
