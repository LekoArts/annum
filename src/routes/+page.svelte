<script lang='ts'>
	import { signIn } from '@auth/sveltekit/client'
	import Spacer from '$lib/Spacer.svelte'
	import { classList } from '$lib/actions'
	import Primary from '$lib/button/Primary.svelte'
	import { GITHUB_REPO_URL } from '$const'
</script>

<h1 class='visually-hidden'>Trakt Yearly Posters</h1>

<Spacer axis='vertical' size='m' />

<section class='hero'>
	<div class='text'>
		<h2 class='text-xl'>Visualize Your Trakt History</h2>
		<Spacer axis='vertical' size='2xs' />
		<p class='text-md'>Display your watched movies and shows in a poster grid. Easily switch between years and get an overview of all your history.</p>
		<Spacer axis='vertical' size='m' />
		<Primary type='text' on:click={() => signIn('trakt', { callbackUrl: '/dashboard' })}>
			Start Using for Free
		</Primary>
	</div>
	<div class='img'>
		<enhanced:img src='../assets/screenshot-overview.png' sizes='(min-width: 1374px) 1374px, 100vw' alt='Screenshot of the dashboard you will see once logged in. Shown is the movie overview for the year 2023, with all movie posters in a 5 column grid. You can use previous/next buttons to switch years and enable a "Screenshot Mode" to remove the gaps between the columns and rows.' loading='eager' />
	</div>
</section>

<Spacer axis='vertical' size='3xl' />

<!-- - movies and shows by year in poster grid
	- screenshot mode
	- adjustable color hue language
	- open source
-->

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
			<p>The whole website is available on <a href={GITHUB_REPO_URL}>GitHub</a>.</p>
		</div>
	</div>
</section>

<svelte:body use:classList={'homepage'} />

<style lang='postcss'>
  :global(body.homepage) {
    --color-chroma: 0.09;
  }
  :global(body.homepage > div) {
    --color-chroma: initial;
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

    .img img {
      height: auto;
      box-shadow: var(--shadow-elevation-medium);
      border-radius: var(--space-xs);
    }
  }

  .features {
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
      background: var(--color-13);
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
</style>
