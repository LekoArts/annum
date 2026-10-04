<script lang='ts'>
	import { hasData, sync, syncState } from '#lib/store/library.js'
	import { untrack } from 'svelte'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	/** Grace period before a warm cache shows the chip, so a reload that syncs quickly stays still. */
	const SYNC_STATUS_DELAY = 400
	let showSyncStatus = $state(false)

	// `$effect` only runs in the browser (= on mount). `sync` writes the store it reads, so it must be
	// untracked - otherwise the write re-triggers this effect and it syncs forever.
	$effect(() => {
		untrack(() => sync())
	})

	// A cold library has nothing on screen yet, so its sync is announced right away; a warm one is a
	// background refresh that only speaks up after the grace period. The chip is fixed, so it never
	// shifts the page either way.
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

{#if $syncState === 'error' && $hasData}
	<div class='fixed right-4 bottom-4 z-10 flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-xl border border-(--border) bg-(--menu) px-4 py-3 text-sm shadow-(--menu-shadow)' role='alert'>
		Couldn't sync your Simkl library.
		<button class='rounded-md px-2 py-1 font-medium text-(--accent) hover:bg-(--active)' onclick={() => sync()}>Retry</button>
	</div>
{:else if showSyncStatus}
	<div class='fixed right-4 bottom-4 z-10 flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-xl border border-(--border) bg-(--menu) px-4 py-3 text-sm shadow-(--menu-shadow)' role='status'>
		Syncing your Simkl library…
	</div>
{/if}

{@render children?.()}
