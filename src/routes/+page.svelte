<script lang='ts'>
	import { authClient } from '#lib/auth-client.js'
	import akira from '#lib/homepage/assets/akira.svg?raw'
	import blade_runner from '#lib/homepage/assets/blade-runner.svg?raw'
	import breaking_bad from '#lib/homepage/assets/breaking-bad.svg?raw'
	import cowboy_bebop from '#lib/homepage/assets/cowboy-bebop.svg?raw'
	import dune from '#lib/homepage/assets/dune.svg?raw'
	import interstellar from '#lib/homepage/assets/interstellar.svg?raw'
	import jurassic_park from '#lib/homepage/assets/jurassic-park.svg?raw'
	import lord_of_the_rings from '#lib/homepage/assets/lord-of-the-rings.svg?raw'
	import my_neighbor_totoro from '#lib/homepage/assets/my-neighbor-totoro.svg?raw'
	import severance from '#lib/homepage/assets/severance.svg?raw'
	import spirited_away from '#lib/homepage/assets/spirited-away.svg?raw'
	import stranger_things from '#lib/homepage/assets/stranger-things.svg?raw'
	import the_matrix from '#lib/homepage/assets/the-matrix.svg?raw'
	import twin_peaks from '#lib/homepage/assets/twin-peaks.svg?raw'
	import { homepageMotionPaused } from '#lib/store/homepage-motion.js'
	import { pa } from '#lib/store/plausible.js'
	import '#lib/homepage/illustrations.css'

	const session = authClient.useSession()
	let signingIn = $state(false)
	let signInError = $state(false)
	const covers = [
		{ artwork: interstellar, position: 'left-0 top-[8%] max-[600px]:left-0 max-[600px]:top-6' },
		{ artwork: dune, position: 'left-[13%] top-[32%] max-[600px]:left-[20%] max-[600px]:top-[66px]' },
		{ artwork: breaking_bad, position: 'left-[20%] top-0 max-[600px]:left-[43%] max-[600px]:top-[7px]' },
		{ artwork: spirited_away, position: 'left-[34%] top-[3%] max-[600px]:left-[65%] max-[600px]:top-[125px]' },
		{ artwork: my_neighbor_totoro, position: 'left-[57%] top-[5%] max-[600px]:left-auto max-[600px]:right-0 max-[600px]:top-0' },
		{ artwork: the_matrix, position: 'left-[71%] top-0 max-[1050px]:left-[68%] max-[600px]:hidden' },
		{ artwork: stranger_things, position: 'left-[81%] top-[10%] max-[1050px]:left-[79%] max-[600px]:hidden' },
		{ artwork: jurassic_park, position: 'right-0 top-[13%] max-[600px]:hidden' },
		{ artwork: blade_runner, position: 'left-[79%] top-[47%] max-[1050px]:left-[78%] max-[600px]:hidden' },
		{ artwork: lord_of_the_rings, position: 'right-0 top-[50%] max-[600px]:right-auto max-[600px]:left-[2%] max-[600px]:top-[566px]' },
		{ artwork: twin_peaks, position: 'left-0 top-[60%] max-[600px]:left-[27%] max-[600px]:top-[615px]' },
		{ artwork: severance, position: 'left-[13%] top-[65%] max-[600px]:left-[53%] max-[600px]:top-[555px]' },
		{ artwork: akira, position: 'left-[25%] top-[78%] max-[600px]:hidden' },
		{ artwork: cowboy_bebop, position: 'left-[88%] top-[80%] max-[1050px]:left-[87%] max-[600px]:left-auto max-[600px]:right-0 max-[600px]:top-[639px]' },
	]

	async function signIn(): Promise<void> {
		signingIn = true
		signInError = false
		try {
			pa.addEvent('login', { props: { position: 'hero' } })
			const result = await authClient.signIn.social({ provider: 'simkl', callbackURL: '/dashboard' })
			if (result.error)
				throw new Error('Simkl sign-in failed')
		}
		catch {
			signInError = true
			signingIn = false
		}
	}
</script>

<div class='px-9 pt-5 max-[1050px]:px-6 max-[600px]:px-4 max-[600px]:pt-0'>
	<div class='home-illustrations relative isolate h-[clamp(650px,53vw,790px)] max-[1050px]:h-[660px] max-[600px]:h-[790px]' data-paused={$homepageMotionPaused}>
		{#each covers as cover, i (i)}
			<div class={`absolute w-[9.2%] max-w-[137px] overflow-hidden rounded-[7px] shadow-(--home-cover-shadow) max-[1050px]:w-[9.5%] max-[600px]:w-[20%] max-[600px]:max-w-20 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full ${cover.position}`}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- SVG is authored and bundled, never user content. -->
				{@html cover.artwork}
			</div>
		{/each}
		<div aria-hidden='true' class='home-guides pointer-events-none absolute inset-0 -z-10'>
			<span class='home-guide absolute left-[46%] top-[17%] max-[600px]:left-[38%] max-[600px]:top-[203px]' style='--line-x:150px;--line-y:160px'><i></i></span>
			<span class='home-guide absolute left-[24%] top-[28%] max-[600px]:hidden' style='--line-x:110px;--line-y:240px'><i></i></span>
			<span class='home-guide absolute left-[77%] top-[64%] max-[600px]:left-[40%] max-[600px]:top-[539px]' style='--line-x:150px;--line-y:255px'><i></i></span>
			<span class='home-guide absolute left-[40%] top-[88%] max-[600px]:hidden' style='--line-x:210px;--line-y:90px'><i></i></span>
			<span class='home-guide absolute left-[9%] top-[44%] max-[600px]:hidden' style='--line-x:140px;--line-y:120px'><i></i></span>
			<span class='home-guide absolute left-[76%] top-[90%] max-[600px]:hidden' style='--line-x:170px;--line-y:100px'><i></i></span>
		</div>
		<div class='absolute top-[35%] left-1/4 z-2 w-1/2 text-center max-[1050px]:top-[36%] max-[1050px]:left-[24%] max-[1050px]:w-[52%] max-[600px]:top-[235px] max-[600px]:left-0 max-[600px]:w-full max-[600px]:px-[7px]'>
			<h1 class='m-0 font-(family-name:--font-wordmark) text-[clamp(34px,4.15vw,60px)] leading-[1.06] font-[750] tracking-[-0.035em] text-balance max-[1050px]:text-[38px] max-[600px]:text-[36px] max-[600px]:leading-[1.09]'><span class='block'>Everything you</span><span class='block'>watched. Collected.</span></h1>
			<p class='mx-auto mt-6 mb-7 max-w-[530px] text-[clamp(16px,1.4vw,20px)] leading-[1.55] text-balance text-(--muted) max-[1050px]:text-base max-[600px]:mt-[22px] max-[600px]:mb-[26px] max-[600px]:max-w-[330px] max-[600px]:leading-normal'>Explore your Simkl history as a yearly collection of movies, shows, and anime.</p>
			{#snippet actionIcon()}
				<svg class='size-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='m10 13 4-4m-6 2-2 2a4 4 0 0 0 6 6l2-2m-4-10 2-2a4 4 0 0 1 6 6l-2 2' /></svg>
			{/snippet}
			{#if $session.data}
				<a class='inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-(--accent) px-[27px] py-[13px] text-base font-[550] text-(--on-accent) hover:brightness-95 max-[600px]:min-h-[46px] max-[600px]:text-[15px]' href='/dashboard'>Dashboard</a>
			{:else}
				<button type='button' disabled={signingIn || $session.isPending} onclick={signIn} data-press class='inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-(--accent) px-[27px] py-[13px] text-base font-[550] text-(--on-accent) hover:brightness-95 disabled:cursor-wait disabled:opacity-60 max-[600px]:min-h-[46px] max-[600px]:text-[15px]'>{@render actionIcon()}{signingIn ? 'Connecting…' : 'Connect with Simkl'}</button>
			{/if}
			{#if signInError}<p role='alert' class='mt-4 text-sm text-(--muted)'>Couldn’t connect to Simkl. Please try again.</p>{/if}
		</div>
	</div>
</div>
