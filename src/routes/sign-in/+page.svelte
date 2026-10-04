<script lang='ts'>
	import { GITHUB_REPO_URL } from '#const'
	import { authClient } from '#lib/auth-client.js'
	import { pa } from '#lib/store/plausible.js'

	const session = authClient.useSession()
	let signingIn = $state(false)
	let signInError = $state(false)

	async function signIn(): Promise<void> {
		signingIn = true
		signInError = false
		try {
			pa.addEvent('login', { props: { position: 'sign-in' } })
			const result = await authClient.signIn.social({ provider: 'simkl', callbackURL: '/dashboard' })
			if (result.error)
				throw new Error('Simkl sign-in failed')
		}
		catch {
			signingIn = false
			signInError = true
		}
	}
</script>

<section aria-labelledby='sign-in-heading' class='home-typography pt-10 pb-8 sm:pt-16 sm:pb-12 [&_p_a]:font-medium [&_p_a]:text-(--ink) [&_p_a]:underline [&_p_a]:decoration-(--border) [&_p_a]:underline-offset-4 [&_p_a:hover]:text-(--accent)'>
	<h1 id='sign-in-heading' class='font-(family-name:--font-wordmark) text-[40px] leading-[1.1] font-bold tracking-[-0.03em] text-balance sm:text-[48px]'>Your collection starts here.</h1>
	<p class='mt-6 max-w-[55ch] text-base leading-7 text-pretty text-(--muted) sm:text-lg sm:leading-relaxed'>Connect your Simkl account to see the movies, shows, and anime you’ve watched, collected year by year.</p>
	<div class='mt-8'>
		{#if $session.data}
			<a href='/dashboard' data-press class='home-cta inline-flex min-h-12 items-center justify-center rounded-full bg-(--accent) px-7 py-3 text-base font-semibold text-(--on-accent)'>Dashboard</a>
		{:else}
			<button type='button' onclick={signIn} disabled={signingIn || $session.isPending} data-press class='home-cta inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-(--accent) px-7 py-3 text-base font-semibold text-(--on-accent) disabled:cursor-wait disabled:opacity-60'>
				<svg class='home-cta-icon size-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='m10 13 4-4m-6 2-2 2a4 4 0 0 0 6 6l2-2m-4-10 2-2a4 4 0 0 1 6 6l-2 2' /></svg>
				{signingIn ? 'Connecting…' : 'Connect with Simkl'}
			</button>
		{/if}
		{#if signInError}<p role='alert' class='mt-4 max-w-[55ch] text-base leading-7 text-(--ink)'>Couldn’t connect to Simkl. Please try again.</p>{/if}
	</div>
	<div class='mt-10 max-w-[55ch] space-y-3 text-sm leading-6 text-(--muted) sm:text-base sm:leading-7'>
		<p>New to Simkl? <a href='https://simkl.com'>Create an account</a> and start tracking what you watch.</p>
		<p>Having trouble connecting? <a href={GITHUB_REPO_URL}>Open an issue on GitHub</a>.</p>
	</div>
</section>
