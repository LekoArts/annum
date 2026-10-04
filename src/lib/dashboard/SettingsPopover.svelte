<script lang='ts'>
	import type { Theme } from '#lib/store/theme.js'
	import Icon from '#lib/dashboard/Icon.svelte'

	import Popover from '#lib/dashboard/Popover.svelte'
	import SyncControl from '#lib/dashboard/SyncControl.svelte'
	import { settings } from '#lib/store/settings.js'
	import { theme } from '#lib/store/theme.js'

	const descriptionPrefix = $props.id()
	const themes: Array<{ value: Theme, label: string }> = [{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]

	let viewportWidth = $state(0)
	const screenColumns = $derived(viewportWidth >= 1536 ? 6 : viewportWidth >= 1024 ? 5 : viewportWidth >= 768 ? 4 : viewportWidth >= 640 ? 3 : 2)
	const displayColumns = $derived($settings.columns > 0 ? $settings.columns : screenColumns)

	function updateColumns(value: number): void {
		settings.set({ ...$settings, columns: Math.max(1, Math.min(100, Math.trunc(value))) })
	}

	function setColumns(event: Event): void {
		const input = event.currentTarget as HTMLInputElement
		const value = input.valueAsNumber
		if (Number.isFinite(value))
			updateColumns(value)
	}

</script>

<svelte:window bind:innerWidth={viewportWidth} />

<Popover label='Dashboard settings' align='end' width='w-[19rem]'>
	{#snippet trigger(open, toggle, id)}
		<button class={`flex size-10 items-center justify-center rounded-full ${open ? 'bg-(--active)' : 'hover:bg-(--active)'}`} type='button' data-press onclick={toggle} aria-label='Dashboard settings' popovertarget={id} aria-controls={id} aria-expanded={open} aria-haspopup='dialog'>
			<Icon name='sliders' class='size-5' />
		</button>
	{/snippet}
	{#snippet children(_close, expanded)}
		<div class='p-2.5'>
			<h2 class='mb-4 font-medium'>Display</h2>
			<div class='mb-4 flex flex-wrap items-center justify-between gap-3'>
				<span class='text-[0.8125rem]'>Theme</span>
				<div class='flex max-w-full flex-wrap rounded-lg border border-(--border) bg-(--page) p-0.5' role='radiogroup' aria-label='Theme'>
					{#each themes as option}
						<label class='relative flex cursor-pointer items-center'>
							<input type='radio' name='dashboard-theme' value={option.value} checked={($theme ?? 'system') === option.value} onchange={() => theme.set(option.value)} class='peer sr-only' />
							<span class='flex min-h-7 items-center rounded-[5px] px-2.5 text-xs text-(--muted) peer-not-checked:hover:bg-(--active) peer-checked:bg-(--accent) peer-checked:text-(--on-accent) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--accent)'>{option.label}</span>
						</label>
					{/each}
				</div>
			</div>
			<div class='space-y-3 border-t border-(--border) pt-3'>
				{#each [{ key: 'groupByMonth', label: 'Group by month', description: 'Add month headings' }, { key: 'screenshotMode', label: 'Screenshot mode', description: 'Remove gaps and set columns' }] as option}
					{@const key = option.key as 'groupByMonth' | 'screenshotMode'}
					<button type='button' role='switch' aria-checked={$settings[key]} aria-label={option.label} aria-describedby={`${descriptionPrefix}-${key}-description`} onclick={() => settings.set({ ...$settings, [key]: !$settings[key] })} class='-mx-2 flex min-h-12 w-[calc(100%+1rem)] items-center justify-between gap-4 rounded-lg px-2 text-left hover:bg-(--active)'>
						<span class='min-w-0 [overflow-wrap:anywhere]'><span class='block text-[0.8125rem] font-medium'>{option.label}</span><span id={`${descriptionPrefix}-${key}-description`} class='mt-1 block text-xs text-(--muted)'>{option.description}</span></span>
						<span aria-hidden='true' class={`flex h-5.5 w-9.5 shrink-0 items-center rounded-full p-[3px] transition-colors ${$settings[key] ? 'bg-(--accent)' : 'bg-(--switch-track)'}`}><span class={`size-4 rounded-full shadow-sm transition-transform motion-reduce:transition-none ${$settings[key] ? 'translate-x-4 bg-(--on-accent)' : 'bg-white'}`}></span></span>
					</button>
				{/each}
				{#if $settings.screenshotMode}
					<div class='flex min-h-11 flex-wrap items-center justify-between gap-4 text-[0.8125rem]'>
						<label for='screenshot-columns'>Columns</label>
						<div class='flex max-w-full items-center rounded-lg border border-(--border) bg-(--page) p-0.5'>
							<button type='button' aria-label='Fewer columns' disabled={displayColumns <= 1} onclick={() => updateColumns(displayColumns - 1)} class='flex size-8 shrink-0 items-center justify-center rounded-[5px] hover:bg-(--active) disabled:opacity-35'><span aria-hidden='true'>−</span></button>
							<input id='screenshot-columns' type='number' min='1' max='100' step='1' value={displayColumns} oninput={setColumns} onblur={(event) => { event.currentTarget.value = String(displayColumns) }} class='h-8 w-12 min-w-0 appearance-none bg-transparent text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none' />
							<button type='button' aria-label='More columns' disabled={displayColumns >= 100} onclick={() => updateColumns(displayColumns + 1)} class='flex size-8 shrink-0 items-center justify-center rounded-[5px] hover:bg-(--active) disabled:opacity-35'><span aria-hidden='true'>+</span></button>
						</div>
					</div>
					<button type='button' onclick={() => settings.set({ ...$settings, columns: 0 })} class='min-h-8 rounded-md px-2 text-xs text-(--muted) hover:bg-(--active)'>Match screen · {screenColumns} columns</button>
					<p class='text-xs leading-relaxed text-(--muted)'>Controls stay above the grid. Take a screenshot using your device.</p>
				{/if}
			</div>
			<div class='mt-3 border-t border-(--border) pt-3'>
				<h2 class='mb-2 font-medium'>Library</h2>
				<SyncControl open={expanded} />
			</div>
		</div>
	{/snippet}
</Popover>
