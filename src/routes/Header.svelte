<script lang='ts'>
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { pa } from '@accuser/svelte-plausible-analytics'
	import { page } from '$app/stores'
	import Svg from '$lib/Svg.svelte'
	import Primary from '$lib/button/Primary.svelte'
	import type { TraktStats } from '$lib/types'
	import { TITLE } from '$const'

	$: stats = $page.data?.stats as TraktStats | undefined
	$: user = $page.data?.session?.user
	$: isSignedIn = Boolean(user)
</script>

<header>
	<div class='container'>
		<div class='wrapper flex'>
			<div class='title text-md-lg font-semibold'>
				{#if $page.url.pathname.includes('/dashboard')}
					{TITLE}
				{:else}
					<a class='title-link' href='/' aria-label='Back to homepage'>{TITLE}</a>
				{/if}
			</div>
			<div class='cta flex align-center'>
				{#if isSignedIn}
					{#if $page.url.pathname.includes('/dashboard')}
						<div class='profile text-sm-base box'>
							{#if stats}
								<div class='stats' aria-label='User statistics and information'>
									<div class='stats-item'>
										<Svg id='movie' aria-label='Movies' /> {stats?.movies?.watched}
									</div>
									<div class='stats-item'>
										<Svg id='tv' aria-label='Shows' /> {stats?.shows?.watched}
									</div>
								</div>
							{/if}
							<div class='font-semibold username'>{user.username}</div>
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
    gap: var(--space-2xs);
    --icon-color: var(--color-1);
    --color-alpha: 0.75;
  }
</style>
