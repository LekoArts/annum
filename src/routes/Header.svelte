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
	<div class='container'>
		<div class='wrapper flex'>
			<div class='title text-md-lg font-semibold'>
				{#if page.url.pathname.includes('/dashboard')}
					<a class='title-link' href='/dashboard' aria-label='Dashboard'>{TITLE}</a>
				{:else}
					<a class='title-link' href='/' aria-label='Back to homepage'>{TITLE}</a>
				{/if}
			</div>
			<div class='cta flex align-center'>
				{#if $session.data}
					{#if page.url.pathname.includes('/dashboard')}
						<div class='profile text-sm-base box'>
							<div class='stats' aria-label='User statistics and information'>
								{#each types as type (type)}
									<!--
										The count is rendered even when it is 0: with the all-time total gone, an
										icon followed by nothing would read as a rendering bug rather than as "none".
									-->
									<div class='stats-item'>
										<Svg id={MEDIA_TYPE_ICONS[type]} /> {countForYear($library, type, year)} <span class='visually-hidden'>{MEDIA_TYPE_LABELS[type].toLowerCase()} in {year}</span>
									</div>
								{/each}
							</div>
							{#if avatar}
								<img class='avatar' src={avatar} alt='' width='24' height='24' />
							{:else}
								<span class='initials' aria-hidden='true'>{initials}</span>
							{/if}
							<div class='font-semibold username'>{$session.data.user.name}</div>
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
						await authClient.signIn.oauth2({
							providerId: 'simkl',
							callbackURL: '/dashboard',
						})
					}}>
						Sign In With Simkl
					</Primary>
				{/if}
			</div>
		</div>
	</div>
</header>

<style lang='postcss'>
	header {
		padding-top: var(--space-m);
		padding-bottom: var(--space-m);
	}

  .wrapper {
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-2xs);

    @media (--sm) {
      gap: 0;
    }
  }

  .title {
    --color-alpha: 1;
    flex-grow: 1;
    min-width: 100%;
    color: var(--color-1);
    letter-spacing: -0.02em;
    @media (--sm) {
      flex-grow: initial;
      min-width: initial;
    }
  }

  .title-link {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .cta {
    gap: var(--space-s-m);
    line-height: 1.25;
    justify-content: space-between;
    flex-grow: 1;

    @media (--sm) {
      flex-grow: initial;
    }
  }

  .username {
    --color-alpha: 1;
    color: var(--color-0);
    position: relative;
    top: -1px;
  }

  .profile, .stats, .stats-item {
    display: flex;
    align-items: center;
    line-height: 1.25;
  }

  /* Only the profile box spaces its children; `.stats-item` spaces its icon through the `svg` margin. */
  .profile {
    gap: var(--space-xs-s);
  }

  .stats {
    --color-alpha: 1;
    gap: var(--space-xs-s);
    color: var(--color-1);
  }

  .stats-item {
    --icon-color: var(--color-1);
    --color-alpha: 0.75;
  }

	.stats-item :global(svg) {
		margin-right: var(--space-2xs);
	}

	.avatar {
		--color-alpha: 1;
		border-radius: 50%;
	}

	.initials {
		--color-alpha: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-8);
		color: var(--color-0);
		font-size: var(--step--1);
		font-weight: 600;
		line-height: 1;
	}
</style>
