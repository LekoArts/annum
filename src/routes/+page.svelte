<script lang='ts'>
	import { TITLE } from '#const'
	import { authClient } from '#lib/auth-client.js'
	import Primary from '#lib/button/Primary.svelte'
	import { pa } from '#lib/store/plausible.js'
	import Svg from '#lib/Svg.svelte'

	const session = authClient.useSession()
</script>

<h1 class='sr-only'>{TITLE}</h1>

<div class='mx-auto flex w-full max-w-xl flex-col items-start gap-6'>
	<h2 class='text-2xl font-semibold'>Visualize Your Simkl History</h2>
	{#if $session.data}
		<Primary type='link' href='/dashboard'>
			Show me my Poster Grid <Svg id='arrow-right' />
		</Primary>
	{:else}
		<Primary type='text' onclick={async () => {
			pa.addEvent('login', { props: { position: 'hero' } })
			await authClient.signIn.social({
				provider: 'simkl',
				callbackURL: '/dashboard',
			})
		}}>
			Show me my Poster Grid <Svg id='arrow-right' />
		</Primary>
	{/if}
</div>
