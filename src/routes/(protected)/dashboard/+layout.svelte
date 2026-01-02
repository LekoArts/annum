<script lang='ts'>
	import { goto } from '$app/navigation'
	import { style } from '$lib/actions'
	import { authClient } from '$lib/auth-client'
	import { settings } from '$lib/store/settings'

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
