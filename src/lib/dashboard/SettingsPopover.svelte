<script lang='ts'>
	import Secondary from '#lib/button/Secondary.svelte'
	import { settings } from '#lib/store/settings.js'
	import Switch from '#lib/Switch.svelte'
	import { slide } from 'svelte/transition'

	/** Distance kept between the panel and its trigger, and between the panel and the viewport edges. */
	const GUTTER = 8

	let trigger: HTMLSpanElement | undefined
	let panel: HTMLDivElement | undefined
	let expanded = $state(false)

	/**
	 * The UA stylesheet centres `[popover]` in the viewport, so anchoring it under the trigger is our job:
	 * compute the position when it opens and keep it there while the page scrolls or resizes beneath it.
	 * The horizontal position is clamped so a narrow window cannot push the panel off-screen.
	 */
	function place() {
		if (!trigger || !panel)
			return

		const rect = trigger.getBoundingClientRect()
		const left = Math.max(GUTTER, Math.min(rect.left, window.innerWidth - panel.offsetWidth - GUTTER))

		panel.style.left = `${left}px`
		panel.style.top = `${rect.bottom + GUTTER}px`
	}

	// The `toggle` event also covers light-dismiss and Escape, so `aria-expanded` stays truthful without
	// listening for outside clicks ourselves.
	function handleToggle(event: ToggleEvent) {
		expanded = event.newState === 'open'

		if (expanded)
			place()
	}
</script>

<!-- Capture phase: `scroll` does not bubble, so a nested scroller would otherwise leave the panel behind. -->
<svelte:window onresize={() => expanded && place()} onscrollcapture={() => expanded && place()} />

<span bind:this={trigger}>
	<Secondary
		type='text'
		onclick={() => panel?.togglePopover()}
		aria-label='Dashboard settings'
		aria-controls='dashboard-settings'
		aria-expanded={expanded}>
		Settings
	</Secondary>
</span>

<!--
	`inset-auto` and `m-0` undo the UA centring of `[popover]`: the panel is positioned by `place()`
	instead, so those declarations must not fight it.
-->
<div id='dashboard-settings' class='inset-auto m-0 space-y-3' popover='auto' bind:this={panel} ontoggle={handleToggle}>
	<div>
		<p>Posters will be grouped by month indicated by individual headings.</p>
		<Switch label='Group by month' bind:value={$settings.groupByMonth} />
	</div>

	<div>
		<p>Removes the gutters and pins the number of columns so the posters fill the page. Screenshot Mode only changes the grid - use the <code>Previous</code> and <code>Next</code> buttons to switch years.</p>
		<div class='flex items-center gap-2'>
			{#if $settings.screenshotMode}
				<div class='flex items-center gap-2' transition:slide={{ axis: 'x' }}>
					<label for='grid-columns'>Columns</label>
					<input id='grid-columns' type='number' min='1' max='100' step='1' bind:value={$settings.columns} oninput={e => settings.set({ ...$settings, columns: Number.parseInt((e.target as HTMLInputElement).value) })} />
				</div>
			{/if}
			<Switch label='Screenshot Mode' bind:value={$settings.screenshotMode} />
		</div>
	</div>
</div>
