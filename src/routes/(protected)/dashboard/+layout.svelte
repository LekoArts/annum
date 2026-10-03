<script lang='ts'>
	import { style } from '#lib/actions.js'
	import { authClient } from '#lib/auth-client.js'
	import { sync, syncState } from '#lib/store/library.js'
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

	// `$effect` only runs in the browser, which is exactly the "on mount" semantics wanted here.
	// `sync` reads and then writes the library store, so the call has to be untracked - otherwise the
	// write would re-trigger this effect and it would sync forever.
	$effect(() => {
		untrack(() => sync())
	})
</script>

{#if $syncState === 'syncing'}
	<div class='sync-status box flex align-center' role='status'>
		<span class='sync-spinner'></span>
		Syncing your Simkl library…
	</div>
{:else if $syncState === 'error'}
	<div class='sync-status box flex align-center' role='alert'>
		Couldn't sync your Simkl library.
		<button onclick={() => sync()}>Retry</button>
	</div>
{/if}

{@render children?.()}

<svelte:body use:style={`--color-hue: ${$settings.hue};${$settings.grayscaleMode ? ' --color-chroma: 0;' : ''}`} />

<style lang='postcss'>
	.sync-status {
		gap: var(--space-2xs);
		padding: var(--space-3xs) var(--space-2xs);
		margin-bottom: var(--space-m);
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
