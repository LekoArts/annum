<script lang='ts'>
	import Icon from '#lib/dashboard/Icon.svelte'
	import { library, sync, syncState } from '#lib/store/library.js'
	import { formatSyncAge, SYNC_INTERVAL_MS } from '#lib/utils/sync.js'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let now = $state(Date.now())

	// The age would freeze while the popover stays open, so the clock only ticks while it is visible
	$effect(() => {
		if (!open)
			return

		now = Date.now()
		const timer = setInterval(() => {
			now = Date.now()
		}, 30_000)

		return () => clearInterval(timer)
	})

	const age = $derived(formatSyncAge($library.lastSyncedAt, now))
	const syncing = $derived($syncState.status === 'syncing')
	const failure = $derived($syncState.status === 'error' ? $syncState.message : null)
	const minutes = SYNC_INTERVAL_MS / 60_000
</script>

<p class='text-xs text-(--muted)'>{age ? `Synced ${age}` : 'Not synced yet'}</p>
{#if failure}
	<p class='mt-1 text-xs leading-relaxed text-(--accent)'>{failure}</p>
{/if}
<p class='mt-1 text-xs leading-relaxed text-(--muted)'>Checks for updates at most every {minutes} min.</p>
<button type='button' disabled={syncing} onclick={() => sync({ force: true })} class='mt-2 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-(--border) px-3 text-[0.8125rem] font-medium hover:bg-(--active) disabled:opacity-50'>
	<Icon name='refresh' class={`size-4 ${syncing ? 'animate-spin motion-reduce:animate-none' : ''}`} />
	{syncing ? 'Syncing…' : 'Refresh now'}
</button>
