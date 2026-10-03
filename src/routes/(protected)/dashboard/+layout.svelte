<script lang='ts'>
	import { style } from '#lib/actions.js'
	import { authClient } from '#lib/auth-client.js'
	import { settings } from '#lib/store/settings.js'
	import { goto } from '$app/navigation'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()
	const session = authClient.useSession()

	if (!session) {
		goto('/sign-in')
	}
</script>

{@render children?.()}

<svelte:body use:style={`--color-hue: ${$settings.hue};${$settings.grayscaleMode ? ' --color-chroma: 0;' : ''}`} />
