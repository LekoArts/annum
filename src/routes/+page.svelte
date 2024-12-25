<script lang='ts'>
	import { signIn } from '@auth/sveltekit/client'
	import { page } from '$app/state'
	import { GITHUB_REPO_URL, TITLE } from '$const'
	import { classList } from '$lib/actions'
	import Primary from '$lib/button/Primary.svelte'
	import Spacer from '$lib/Spacer.svelte'
	import { pa } from '$lib/store/plausible'
	import Svg from '$lib/Svg.svelte'
</script>

<h1 class='visually-hidden'>{TITLE}</h1>

<Spacer axis='vertical' size='m' />

<section class='hero'>
	<div class='text'>
		<h2 class='text-xl'>Visualize Your Trakt.tv History</h2>
		<Spacer axis='vertical' size='2xs' />
		<p class='text-md'>Display your watched movies and shows in a poster grid. Easily switch between years and get an overview of all your history.</p>
		<Spacer axis='vertical' size='m' />
		{#if page.data?.session?.user}
			<Primary type='link' href='/dashboard'>
				Show me my Poster Grid <Svg id='arrow-right' />
			</Primary>
		{:else}
			<Primary type='text' on:click={() => {
				pa.addEvent('login', { props: { position: 'hero' } })
				signIn('trakt', { callbackUrl: '/dashboard' })
			}}>
				Show me my Poster Grid <Svg id='arrow-right' />
			</Primary>
		{/if}
	</div>
	<enhanced:img src='../assets/default-preview.png' sizes='(min-width: 1374px) 1374px, 100vw' alt='Screenshot of the dashboard you will see once logged in. Shown is the movie overview for the year 2023, with all movie posters in a 5 column grid. You can use previous/next buttons to switch years and enable a "Screenshot Mode" to remove the gaps between the columns and rows.' loading='eager' />
</section>

<Spacer axis='vertical' size='3xl' />

<section class='features'>
	<h2 class='text-xl'>Features</h2>
	<Spacer axis='vertical' size='m' />
	<div class='bento'>
		<div>
			<h3>Poster Grid</h3>
			<p>Your Trakt History is used to display posters of movies and shows you watched in a minimalistic layout. No distractions, just posters.</p>
		</div>
		<div>
			<h3>Screenshot Mode</h3>
			<p>Want to create your own “Year in Review”? Enable Screenshot Mode and take a picture 📸</p>
		</div>
		<div>
			<h3>Adjustable</h3>
			<p>Change the color scheme of the whole website by changing its color hue. You can also switch the language for your posters.</p>
		</div>
		<div>
			<h3>Open Source</h3>
			<p>The whole website is available on <a href={GITHUB_REPO_URL}>GitHub</a> for you to read. Contributions welcome 🥳</p>
		</div>
	</div>
</section>

<Spacer axis='vertical' size='2xl' />

<section class='screenshots'>
	<h2 class='text-xl'>Screenshots</h2>
	<Spacer axis='vertical' size='m' />
	<div class='screenshots-img'>
		<enhanced:img src='../assets/color-modes.png' sizes='(min-width: 768px) 768px, 100vw' alt='Screenshot of the dashboard divided into 4 equal columns. Each column shows the dashboard in a different color (the first one is grayscale) to highlight that you can change the color mode for the whole app.' loading='lazy' />
		<enhanced:img src='../assets/screenshot-mode.png' sizes='(min-width: 768px) 768px, 100vw' alt='Showcasing the "Screenshot Mode". The gutters from the poster grid are removed and you can choose how many columns you want to display.' loading='lazy' />
	</div>
</section>

<Spacer axis='vertical' size='2xl' />

<svelte:body use:classList={'homepage'} />

<style lang='postcss'>
  :global(body.homepage) {
    --color-chroma: 0.09;
  }
  :global(body.homepage > div) {
    --color-chroma: initial;
  }

  :global(.hero svg[data-icon-name='arrow-right']) {
    height: var(--space-s-m);
    width: var(--space-s-m);
    margin-left: var(--space-2xs);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(.hero .button-primary:hover svg[data-icon-name='arrow-right']) {
    transform: translateX(3px);
  }

  .hero {
    display: grid;
    gap: calc(var(--grid-gutter) * 2);
    grid-template-columns: repeat(1, 1fr);

    @media (--md) {
      grid-template-columns: 1.75fr 2fr;
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);

      & p {
        line-height: 1.25;
      }

      & h2 {
        line-height: 1.2;
      }
    }

    & img {
      height: auto;
      box-shadow: var(--shadow-elevation-medium);
      border-radius: var(--space-xs);
    }
  }

  .features, .screenshots {
    & h2 {
      text-align: center;
    }
  }

  .bento {
    display: grid;
    gap: var(--grid-gutter);
    grid-template-columns: repeat(1, 1fr);

    & > div {
      --color-alpha: 0.5;
      border: 1px solid var(--color-9);
      background: linear-gradient(0deg, var(--color-12) 0%, var(--color-13) 8%, var(--color-13) 92%, var(--color-14) 100%);
      padding: var(--space-s);
      border-radius: var(--space-xs);
      box-shadow: var(--shadow-elevation-medium);
    }

    & h3 {
      margin-top: 0;
    }

    @media (--md) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .screenshots-img {
    display: grid;
    gap: var(--grid-gutter);
    grid-template-columns: repeat(1, 1fr);

    @media (--md) {
      grid-template-columns: repeat(2, 1fr);
    }

    & img {
      height: auto;
      box-shadow: var(--shadow-elevation-medium);
      border-radius: var(--space-xs);
    }
  }
</style>
