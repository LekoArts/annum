<script lang='ts'>
	import { CURRENT_YEAR, TITLE } from '#const'
	import { authClient } from '#lib/auth-client.js'
	import Primary from '#lib/button/Primary.svelte'
	import { library } from '#lib/store/library.js'
	import { pa } from '#lib/store/plausible.js'
	import Svg from '#lib/Svg.svelte'
	import { resolveSelectedTypes, resolveYear } from '#lib/utils/dashboard.js'
	import { availableYears, countForYear, MEDIA_TYPE_ICONS, MEDIA_TYPE_LABELS, simklAvatarUrl } from '#lib/utils/simkl.js'
	import { page } from '$app/state'

	const session = authClient.useSession()

	/** Display names come from Simkl as words; be lenient about runs of whitespace between them. */
	const NAME_WORD_SEPARATOR = /\s+/

	/**
	 * The dashboard's selection lives in the query string, so the header reads it from the URL instead of
	 * from a route segment: the counts must follow the grid the user is actually looking at. Derived here
	 * rather than passed down, so the header stays reactive to `page.url` on every navigation.
	 */
	const types = $derived(resolveSelectedTypes(page.url.searchParams))
	const year = $derived(resolveYear(page.url.searchParams, availableYears($library, CURRENT_YEAR), CURRENT_YEAR))

	/** Simkl serves avatars directly; when there is none, the initials of the name stand in for it. */
	const avatar = $derived(simklAvatarUrl($session.data?.user.image))
	const initials = $derived.by(() => {
		const words = ($session.data?.user.name ?? '').trim().split(NAME_WORD_SEPARATOR).filter(Boolean)

		return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
	})
</script>

<header>
	<div class='flex flex-wrap items-center justify-between gap-4 py-4'>
		<div class='font-semibold'>
			{#if page.url.pathname.includes('/dashboard')}
				<a href='/dashboard' aria-label='Dashboard'>{TITLE}</a>
			{:else}
				<a href='/' aria-label='Back to homepage'>{TITLE}</a>
			{/if}
		</div>
		<div class='flex items-center gap-4'>
			{#if $session.data}
				{#if page.url.pathname.includes('/dashboard')}
					<div class='flex items-center gap-4'>
						<div class='flex items-center gap-2' aria-label='User statistics and information'>
							{#each types as type (type)}
								<!--
									The count is rendered even when it is 0: with the all-time total gone, an
									icon followed by nothing would read as a rendering bug rather than as "none".
								-->
								<div>
									<Svg id={MEDIA_TYPE_ICONS[type]} /> {countForYear($library, type, year)} <span class='sr-only'>{MEDIA_TYPE_LABELS[type].toLowerCase()} in {year}</span>
								</div>
							{/each}
						</div>
						<div class='flex items-center gap-2'>
							{#if avatar}
								<img src={avatar} alt='' width='24' height='24' />
							{:else}
								<span aria-hidden='true'>{initials}</span>
							{/if}
							<span class='font-semibold'>{$session.data.user.name}</span>
						</div>
					</div>
					<Primary type='text' onclick={async () => {
						pa.addEvent('logout', { props: { position: 'header' } })
						await authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									window.location.href = '/'
								},
							},
						})
					}}>
						Sign Out
					</Primary>
				{:else}
					<Primary type='link' href='/dashboard'>
						Dashboard
					</Primary>
				{/if}
			{:else}
				<Primary type='text' onclick={async () => {
					pa.addEvent('login', { props: { position: 'header' } })
					await authClient.signIn.social({
						provider: 'simkl',
						callbackURL: '/dashboard',
					})
				}}>
					Sign In With Simkl
				</Primary>
			{/if}
		</div>
	</div>
</header>
