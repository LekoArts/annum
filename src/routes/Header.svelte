<script lang='ts'>
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { page } from '$app/stores'
	import Svg from '$lib/Svg.svelte'
	import Primary from '$lib/button/Primary.svelte'
	import type { TraktStats } from '$lib/types'

	$: stats = $page.data?.stats as TraktStats | undefined
	$: user = $page.data?.session?.user
	$: isSignedIn = Boolean(user)
</script>

<header>
	<div class='container'>
		<div class='wrapper flex'>
			<div class='title text-md-lg font-semibold'>
				Trakt Yearly Posters
			</div>
			<div class='cta flex align-center'>
				{#if isSignedIn}
					{#if $page.url.pathname === '/'}
						<Primary type='link' href='/dashboard'>
							Dashboard
						</Primary>
					{:else}
						<div class='profile text-sm-base'>
							{#if stats}
								<div class='stats' aria-label='User statistics and information'>
									<div class='stats-item'>
										<Svg id='movie' aria-label='Movies' /> {stats.movies.watched}
									</div>
									<div class='stats-item'>
										<Svg id='tv' aria-label='Shows' /> {stats.shows.watched}
									</div>
								</div>
							{/if}
							<div class='font-semibold username'>{user.username}</div>
						</div>
						<Primary type='text' on:click={() => signOut({ callbackUrl: '/' })}>
							Sign Out
						</Primary>
					{/if}
				{:else}
					<Primary type='text' on:click={() => signIn('trakt', { callbackUrl: '/dashboard' })}>
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
    flex-grow: 1;
    min-width: 100%;
    --color-alpha: 1;
    color: var(--color-1);
    @media (--sm) {
      flex-grow: initial;
      min-width: initial;
    }
  }

  .cta {
    gap: var(--space-s-l);
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

  .profile {
    --color-alpha: 0.25;
    gap: var(--space-xs-s);
    background: var(--color-4);
    border: 1px solid var(--color-2);
    padding: var(--space-3xs) var(--space-xs);
    border-radius: var(--space-2xs);
    box-shadow: var(--shadow-elevation-low);
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
