<script lang='ts'>
	import { signIn, signOut } from '@auth/sveltekit/client'
	import type { TraktStats } from '$lib/types'
	import { page } from '$app/state'
	import { CURRENT_YEAR, TITLE } from '$const'
	import Primary from '$lib/button/Primary.svelte'
	import Spacer from '$lib/Spacer.svelte'
	import { pa } from '$lib/store/plausible'
	import { stats } from '$lib/store/stats'
	import Svg from '$lib/Svg.svelte'

	let traktStats = $derived(page.data?.stats as TraktStats | undefined)
	let user = $derived(page.data?.session?.user)
	let isSignedIn = $derived(Boolean(user))
	let isDetailPage = $derived(page.url.pathname.includes('/movies') || page.url.pathname.includes('/shows'))
</script>

<header>
	<div class='container'>
		<div class='wrapper flex'>
			<div class='title text-md-lg font-semibold'>
				{#if page.url.pathname.includes('/dashboard')}
					<a class='title-link' href='/dashboard' aria-label='Back to dashboard overview'>{TITLE}</a>
				{:else}
					<a class='title-link' href='/' aria-label='Back to homepage'>{TITLE}</a>
				{/if}
			</div>
			<div class='cta flex align-center'>
				{#if isSignedIn}
					{#if page.url.pathname.includes('/dashboard')}
						<div class='profile text-sm-base box'>
							{#if traktStats && isDetailPage}
								<div class='stats' aria-label='User statistics and information'>
									{#if page.url.pathname.includes('/movies')}
										<div class='stats-item'>
											<Svg id='movie' /> {$stats.movies > 0 ? $stats.movies : null} <span class='visually-hidden'>movies in {CURRENT_YEAR}</span><Spacer axis='horizontal' size='3xs' />({traktStats?.movies?.watched} <span class='visually-hidden'>movies in total</span>)
										</div>
									{/if}
									{#if page.url.pathname.includes('/shows')}
										<div class='stats-item'>
											<Svg id='tv' /> {$stats.shows > 0 ? $stats.shows : null} <span class='visually-hidden'>shows in {CURRENT_YEAR}</span><Spacer axis='horizontal' size='3xs' />({traktStats?.shows?.watched} <span class='visually-hidden'>shows in total</span>)
										</div>
									{/if}
								</div>
							{/if}
							<div class='font-semibold username'>{user?.username}</div>
						</div>
						<Primary type='text' on:click={() => {
							pa.addEvent('logout', { props: { position: 'header' } })
							signOut({ callbackUrl: '/' })
						}}>
							Sign Out
						</Primary>
					{:else}
						<Primary type='link' href='/dashboard'>
							Dashboard
						</Primary>
					{/if}
				{:else}
					<Primary type='text' on:click={() => {
						pa.addEvent('login', { props: { position: 'header' } })
						signIn('trakt', { callbackUrl: '/dashboard' })
					}}>
						Sign In With Trakt
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
</style>
