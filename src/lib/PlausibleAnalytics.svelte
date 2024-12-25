<script module lang='ts'>
	interface Options {
		props?: Record<string, string>
	}

	interface PlausibleTracker {
		(event: string, options?: Options): void
	}

	interface PlausibleWindow extends Window {
		plausible: PlausibleTracker
	}

	declare let window: PlausibleWindow

	const plausible: PlausibleTracker = (event, options) => window.plausible(event, options)
</script>

<script lang='ts'>
	/**
	 * Adjusted from https://github.com/accuser/svelte-plausible-analytics/blob/main/src/lib/PlausibleAnalytics.svelte
	 * LICENSE: MIT
	 */

	import { onMount } from 'svelte'
	import { dev } from '$app/environment'
	import { page } from '$app/state'
	import { pa } from '$lib/store/plausible'

	onMount(() => {
		pa.subscribe((events) => {
			let next = events.length && events.shift()

			while (next) {
				const { event, data } = next

				if (!dev)
					plausible(event, data)

				next = events.shift()
			}
		})
	})

	interface Props {
		/**
		 * The API host.
		 *
		 * @defaultValue 'https://plausible.io'
		 */
		apiHost?: string
		/**
		 * The domain name(s) of the website(s) to track.
		 *
		 * @defaultValue current hostname.
		 */
		domain?: string | Array<string>
		/**
		 * Enable analytics.
		 *
		 * @defaultValue `true` in production mode, `false` in development mode.
		 */
		enabled?: boolean
	}

	let { apiHost = 'https://plausible.io', domain = page.url.hostname, enabled = !dev }: Props = $props()

	let api = $derived(`${apiHost}/api/event`)
	let src = $derived([
		`${apiHost}/js/script`,
		'js',
	]
		.filter(Boolean)
		.join('.'))
</script>

<svelte:head>
	{#if enabled}
		<script data-api={api} data-domain={domain.toString()} defer {src}></script>
		<script>
			window.plausible =
			window.plausible ||
			function () {
			(window.plausible.q = window.plausible.q || []).push(arguments);
			};
		</script>
	{/if}
</svelte:head>
