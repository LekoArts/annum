<script lang='ts'>
	import { TITLE } from '#const'
	import { authClient } from '#lib/auth-client.js'

	import Dock from '#lib/dashboard/Dock.svelte'
	import Icon from '#lib/dashboard/Icon.svelte'
	import Popover from '#lib/dashboard/Popover.svelte'
	import { pa } from '#lib/store/plausible.js'
	import { accountInitials, accountName, membershipLabel } from '#lib/utils/account.js'
	import { simklAvatarUrl } from '#lib/utils/simkl.js'
	import { page } from '$app/state'

	const session = authClient.useSession()
	const user = $derived($session.data?.user)
	const dashboard = $derived(page.url.pathname === '/dashboard')
	const avatar = $derived(simklAvatarUrl(user?.image))
	const plan = $derived(user?.simklPlan)
	const joinedAt = $derived(user?.simklJoinedAt)
	const joinedLabel = $derived(membershipLabel(joinedAt))
	const name = $derived(accountName(user?.name))
	const initials = $derived(accountInitials(user?.name))
	let failedAvatar = $state<string | null>(null)
	let signingOut = $state(false)
	let signOutError = $state(false)

	async function signOut(): Promise<void> {
		signingOut = true
		signOutError = false
		try {
			pa.addEvent('logout', { props: { position: 'header' } })
			const result = await authClient.signOut()
			if (result.error)
				throw new Error('Sign out failed')
			window.location.href = '/'
		}
		catch {
			signingOut = false
			signOutError = true
		}
	}
</script>

<header class={`mx-auto flex w-full flex-wrap items-center justify-between gap-2 px-3 pt-4 pb-7 sm:px-6 sm:pt-5 sm:pb-10 lg:px-9 ${dashboard ? 'max-w-[1800px] sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]' : 'max-w-5xl'}`}>
	<a href={dashboard ? '/dashboard' : '/'} aria-label={dashboard ? 'Dashboard' : 'Back to homepage'} class={`w-fit font-(family-name:--font-wordmark) text-[23px] font-semibold tracking-[-0.03em] ${dashboard ? 'hidden sm:block' : ''}`}>{TITLE}</a>
	{#if dashboard}<Dock />{/if}
	<div class='flex shrink-0 justify-end'>
		{#if user}
			<Popover label='Account' align='end' width='w-60'>
				{#snippet trigger(open, toggle, id)}
					<button type='button' onclick={toggle} data-press aria-label='Account menu' popovertarget={id} aria-controls={id} aria-expanded={open} aria-haspopup='dialog' class='flex size-10 items-center justify-center rounded-full hover:bg-(--active)'>
						{#if avatar && failedAvatar !== avatar}<img onerror={() => { failedAvatar = avatar }} src={avatar} alt='' width='32' height='32' class='size-8 rounded-full object-cover outline-1 -outline-offset-1 outline-(--image-edge)' />{:else}<span class='flex size-8 items-center justify-center rounded-full bg-(--active) text-xs font-medium'>{initials}</span>{/if}
					</button>
				{/snippet}
				{#snippet children(close)}
					<div class='px-3 py-2.5'>
						<div class='flex items-start gap-2'>
							<p dir='auto' class='min-w-0 flex-1 font-medium [overflow-wrap:anywhere]'>{name}</p>
							{#if plan === 'pro' || plan === 'vip'}
								<span aria-label={`Simkl ${plan.toUpperCase()} plan`} class='shrink-0 rounded-md bg-(--active) px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wide text-(--muted)'>{plan.toUpperCase()}</span>
							{/if}
						</div>
						<p class='mt-1 text-xs text-(--muted)'>Connected to Simkl</p>
					</div>
					{#if joinedLabel}
						<p class='px-3 pt-1 pb-3 text-xs leading-relaxed text-(--muted)'>Member since <time datetime={joinedAt}>{joinedLabel}</time></p>
					{/if}
					{#if !dashboard}<a href='/dashboard' onclick={close} class='flex min-h-11 items-center gap-3 rounded-lg px-3 hover:bg-(--active)'><Icon name='filter' />Dashboard</a>{/if}
					<div class='border-t border-(--border)'>
						<button type='button' disabled={signingOut} onclick={signOut} class='mt-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left hover:bg-(--active) disabled:opacity-50'><Icon name='exit' />{signingOut ? 'Signing out…' : 'Sign out'}</button>
					</div>
					{#if signOutError}<p role='alert' class='px-3 py-2 text-xs text-(--muted)'>Couldn’t sign out. Please try again.</p>{/if}
				{/snippet}
			</Popover>
		{:else}
			<button type='button' class='min-h-10 rounded-full bg-(--ink) px-4 text-sm font-medium text-(--page) hover:opacity-85' onclick={async () => {
				pa.addEvent('login', { props: { position: 'header' } })
				await authClient.signIn.social({ provider: 'simkl', callbackURL: '/dashboard' })
			}}>Sign in with Simkl</button>
		{/if}
	</div>
</header>
