<script lang='ts'>
	import type { Snippet } from 'svelte'
	import { faqs, HOMEPAGE_URL, homepageStructuredDataTag } from '#lib/homepage/content.js'

	interface Props {
		children: Snippet
	}

	let { children }: Props = $props()
</script>

<svelte:head>
	<link rel='canonical' href={HOMEPAGE_URL} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- authored JSON-LD, escaped in content.ts. -->
	{@html homepageStructuredDataTag}
</svelte:head>

<section aria-labelledby='how-it-works' class='home-typography mx-auto mt-36 max-w-[1040px] px-6 sm:mt-48 sm:px-9'>
	<div class='mx-auto max-w-[640px] text-center'>
		<h2 id='how-it-works' class='font-(family-name:--font-wordmark) text-[28px] leading-[1.2] font-semibold tracking-[-0.025em] text-balance sm:text-[32px] lg:text-[36px]'>Your watch history, at a glance.</h2>
		<p class='mt-5 text-base leading-7 text-pretty text-(--muted) sm:text-lg sm:leading-relaxed'>Connect your Simkl account and annum gathers the movies, shows, and anime you’ve watched into a yearly poster collection. Pick a year, choose your media types, and rediscover the stories you spent it with.</p>
		<p class='mt-4 text-base leading-7 text-pretty text-(--muted) sm:text-lg sm:leading-relaxed'>Keep it all together or group it by month. When you’re ready to capture your year, switch to screenshot mode and make the grid your own.</p>
	</div>

	<figure class='mt-10 sm:mt-12'>
		<button type='button' popovertarget='dashboard-preview' aria-label='Enlarge dashboard preview' class='home-preview group relative block w-full overflow-hidden rounded-xl shadow-(--menu-shadow)'>
			<img src='/dashboard-preview.svg' alt='Illustrative dashboard preview: a compact year and media selector above a grid of cover artwork.' width='960' height='576' loading='lazy' decoding='async' class='block h-auto w-full' />
			<span aria-hidden='true' class='absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-(--menu) text-(--ink) shadow-(--dock-shadow) group-hover:bg-(--active) sm:right-5 sm:bottom-5 sm:size-10'>
				<svg viewBox='0 0 24 24' class='size-4 sm:size-5' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M14 4h6v6m0-6-7 7M10 20H4v-6m0 6 7-7' /></svg>
			</span>
		</button>
		<figcaption class='mt-4 text-center text-sm leading-6 text-(--muted)'>Illustrative preview. Your collection uses the posters from your Simkl history.</figcaption>
	</figure>

	<div class='mx-auto mt-20 max-w-[480px] text-center sm:mt-28'>
		<h3 class='font-(family-name:--font-wordmark) text-[24px] leading-[1.2] font-semibold tracking-[-0.025em] text-balance sm:text-[28px]'>Your year is worth a second look.</h3>
		<p class='mt-4 text-base leading-7 text-pretty text-(--muted) sm:text-lg sm:leading-relaxed'>Revisit old favorites, rediscover forgotten gems, and see your Simkl watch history come together.</p>
		<div class='mt-6'>
			{@render children()}
		</div>
	</div>
</section>

<div id='dashboard-preview' popover='auto' role='dialog' aria-label='Enlarged dashboard preview' class='home-typography fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[min(1200px,calc(100%-2rem))] overflow-auto rounded-2xl border border-(--border) bg-(--menu) p-3 text-(--ink) shadow-(--menu-shadow) backdrop:bg-black/65 sm:p-5'>
	<div class='mb-3 flex items-center justify-between gap-4'>
		<p class='pl-1 text-sm font-medium'>Dashboard preview</p>
		<button type='button' popovertarget='dashboard-preview' popovertargetaction='hide' data-press aria-label='Close dashboard preview' class='flex size-11 shrink-0 items-center justify-center rounded-full bg-(--active) hover:bg-(--border)'>
			<svg viewBox='0 0 24 24' class='size-5' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' aria-hidden='true'><path d='m6 6 12 12M18 6 6 18' /></svg>
		</button>
	</div>
	<!-- Focusable scroll region: the preview overflows the dialog at narrow widths, so keyboard users need to pan it. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div tabindex='0' role='region' aria-label='Scrollable enlarged dashboard image' class='overflow-auto rounded-lg'>
		<img src='/dashboard-preview.svg' alt='Enlarged illustrative dashboard with a year selector and a six-column cover grid.' width='960' height='576' loading='lazy' class='block h-auto w-full min-w-[960px]' />
	</div>
	<p class='mt-3 text-center text-sm leading-6 text-(--muted)'>Illustrative preview. Your own watched titles appear after connecting.</p>
</div>

<section aria-labelledby='faq-heading' class='home-typography mx-auto mt-24 mb-12 max-w-[800px] px-6 sm:mt-32 sm:mb-20 sm:px-9'>
	<h2 id='faq-heading' class='mx-auto mb-9 max-w-[24ch] text-center font-(family-name:--font-wordmark) text-[28px] leading-[1.2] font-semibold tracking-[-0.025em] text-balance sm:mb-12 sm:text-[32px] lg:text-[36px]'>A few things you might be wondering.</h2>
	<div class='border-t border-(--border)'>
		{#each faqs as faq (faq.question)}
			<details class='home-faq border-b border-(--border)'>
				<summary class='flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base leading-6 font-medium hover:text-(--accent) sm:py-6 sm:text-lg sm:leading-7 [&::-webkit-details-marker]:hidden'>
					{faq.question}
					<svg viewBox='0 0 24 24' class='mt-0.5 size-5 shrink-0 text-(--muted) sm:mt-1' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' aria-hidden='true'><path d='M5 12h14' /><path d='M12 5v14' class='home-faq-indicator' /></svg>
				</summary>
				<p class='max-w-[65ch] pb-6 pr-6 text-base leading-7 text-pretty text-(--muted) sm:pr-12'>{faq.answer}</p>
			</details>
		{/each}
	</div>
</section>
