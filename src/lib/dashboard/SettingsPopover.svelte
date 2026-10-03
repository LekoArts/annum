<script lang='ts'>
	import Secondary from '#lib/button/Secondary.svelte'
	import Spacer from '#lib/Spacer.svelte'
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

<svelte:window onresize={() => expanded && place()} onscroll={() => expanded && place()} />

<span class='trigger' bind:this={trigger}>
	<Secondary
		type='text'
		onclick={() => panel?.togglePopover()}
		aria-label='Dashboard settings'
		aria-controls='dashboard-settings'
		aria-expanded={expanded}>
		Settings
	</Secondary>
</span>

<div id='dashboard-settings' class='panel box' popover='auto' bind:this={panel} ontoggle={handleToggle}>
	<p class='title'>Color Hue</p>
	<p>Choose a color hue between <code>0deg</code> and <code>360deg</code> to change the appearance. Default is <code>240deg</code>.</p>
	<Spacer axis='vertical' size='xs' />
	<div class='range-wrapper flex align-center'>
		<label for='hue'>Color hue</label>
		<div class='current-color-hue'>{$settings.hue}</div>
		<input id='hue' type='range' min='0' max='360' step='1' list='markers' bind:value={$settings.hue} oninput={e => settings.set({ ...$settings, hue: Number.parseInt((e.target as HTMLInputElement).value) })} />
		<datalist id='markers'>
			{#each [0, 60, 120, 180, 240, 300, 360] as marker}
				<option value={marker} label={marker.toString()}></option>
			{/each}
		</datalist>
	</div>
	<Spacer axis='vertical' size='xs' />
	<Switch label='Grayscale Mode' bind:value={$settings.grayscaleMode} />

	<Spacer axis='vertical' size='s' />

	<p class='title'>Grouping</p>
	<p>Posters will be grouped by month indicated by individual headings.</p>
	<Spacer axis='vertical' size='xs' />
	<Switch label='Group by month' bind:value={$settings.groupByMonth} />

	<Spacer axis='vertical' size='s' />

	<p class='title'>Screenshot Mode</p>
	<p>Removes the gutters, rounding and shadows so the posters fill the page. Screenshot Mode only changes the grid - use the <code>Previous</code> and <code>Next</code> buttons to switch years.</p>
	<Spacer axis='vertical' size='xs' />
	<div class='screenshot-mode flex align-center'>
		{#if $settings.screenshotMode}
			<div class='flex align-center' transition:slide={{ axis: 'x' }}>
				<label for='grid-columns'>Columns</label>
				<input id='grid-columns' type='number' min='1' max='100' step='1' bind:value={$settings.columns} oninput={e => settings.set({ ...$settings, columns: Number.parseInt((e.target as HTMLInputElement).value) })} />
			</div>
		{/if}
		<Switch label='Screenshot Mode' bind:value={$settings.screenshotMode} />
	</div>
</div>

<style lang='postcss'>
	.trigger {
		--color-alpha: 1;
		display: inline-flex;
	}

	.panel {
		/* `inset`/`margin` cancel the UA centring; the position comes from `place()`. */
		inset: auto;
		margin: 0;
		--color-alpha: 1;
		width: min(28rem, calc(100vw - 2 * 8px));
		max-height: calc(100dvh - var(--space-m));
		overflow-y: auto;
	}

	.title {
		font-weight: 600;
		font-size: var(--step-1);
		margin-bottom: var(--space-2xs);
	}

	.range-wrapper {
		gap: var(--space-s);

		& input {
			flex-grow: 1;
			accent-color: white;
		}
	}

	.current-color-hue {
		--color-alpha: 1;
		min-width: 5ch;
		font-weight: 600;
		border: 2px solid var(--color-6);
		padding: var(--space-3xs) var(--space-2xs);
		line-height: 1;
		border-radius: var(--space-2xs);
		box-shadow: 0 0 8px var(--color-5);
		text-align: center;
	}

	.screenshot-mode {
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-2xs);

		& input[type="number"] {
			--color-alpha: 1;
			width: var(--space-xl);
			height: var(--space-m);
			position: relative;
			background: var(--color-0);
			border: none;
			border-radius: var(--space-3xs);
			margin-left: var(--space-2xs);
			padding-left: var(--space-2xs);
		}
	}
</style>
