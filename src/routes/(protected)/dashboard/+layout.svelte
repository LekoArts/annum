<script lang='ts'>
	import { style } from '#lib/actions.js'
	import { authClient } from '#lib/auth-client.js'
	import { hasData, sync, syncState } from '#lib/store/library.js'
	import { settings } from '#lib/store/settings.js'
	import { goto } from '$app/navigation'
	import { untrack } from 'svelte'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()
	const session = authClient.useSession()

	if (!session) {
		goto('/sign-in')
	}

	/** Grace period before a warm cache shows the chip, so a reload that syncs quickly stays still. */
	const SYNC_STATUS_DELAY = 400
	let showSyncStatus = $state(false)

	// `$effect` only runs in the browser, which is exactly the "on mount" semantics wanted here.
	// `sync` reads and then writes the library store, so the call has to be untracked - otherwise the
	// write would re-trigger this effect and it would sync forever.
	$effect(() => {
		untrack(() => sync())
	})

	// A cold library has nothing on screen yet, so its sync is announced right away; with a cached
	// library on screen the sync is a background refresh and only speaks up if it is still running
	// after the grace period. The chip is fixed, so it never shifts the page either way.
	$effect(() => {
		const state = $syncState
		const cold = !$hasData

		if (state !== 'syncing') {
			showSyncStatus = false
			return
		}

		if (cold) {
			showSyncStatus = true
			return
		}

		const timeout = setTimeout(() => {
			showSyncStatus = true
		}, SYNC_STATUS_DELAY)

		return () => clearTimeout(timeout)
	})
</script>

{#if $syncState === 'error'}
	<div class='sync-status box flex align-center' role='alert'>
		Couldn't sync your Simkl library.
		<button onclick={() => sync()}>Retry</button>
	</div>
{:else if showSyncStatus}
	<div class='sync-status box flex align-center' role='status'>
		<span class='sync-spinner'></span>
		Syncing your Simkl library…
	</div>
{/if}

{@render children?.()}

<svelte:body use:style={`--color-hue: ${$settings.hue};${$settings.grayscaleMode ? ' --color-chroma: 0;' : ''}`} />

<style lang='postcss'>
	.sync-status {
		position: fixed;
		inset-block-end: var(--space-s);
		inset-inline-start: var(--space-s);
		z-index: 10;
		--color-alpha: 1;

		& button {
			background: none;
			border: none;
			color: var(--color-0);
			font: inherit;
			padding: 0;
			cursor: pointer;
			text-decoration: underline;
			text-underline-offset: 2px;
		}
	}

	.sync-spinner {
		--color-alpha: 1;
		width: var(--space-xs-s);
		height: var(--space-xs-s);
		min-width: var(--space-xs-s);
		border: 2px solid var(--color-6);
		border-top-color: var(--color-1);
		border-radius: 50%;
		animation: sync-spin 0.75s linear infinite;
	}

	@keyframes sync-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
