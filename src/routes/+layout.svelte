<script lang='ts'>
	import Meta from '#lib/Meta.svelte'
	import PlausibleAnalytics from '#lib/PlausibleAnalytics.svelte'
	import Content from '#lib/skip-to-content/Content.svelte'
	import SkipToContent from '#lib/skip-to-content/Nav.svelte'
	import Theme from '#lib/Theme.svelte'
	import { page } from '$app/state'
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import './layout.css'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	const proseShell = 'max-w-5xl px-3 sm:px-6 lg:px-9'

	// The dashboard grid wants the full viewport, the homepage spreads wider than prose; everything else reads at prose width.
	const shellWidth = $derived.by(() => {
		if (page.error)
			return proseShell
		if (page.url.pathname === '/')
			return 'max-w-[1600px]'
		if (page.url.pathname.startsWith('/dashboard'))
			return 'max-w-[1800px] px-3 sm:px-6 lg:px-9'
		return proseShell
	})
</script>

<svelte:window
	onpointerdown={() => { document.documentElement.dataset.input = 'pointer' }}
	onkeydown={() => { document.documentElement.dataset.input = 'keyboard' }} />

<Theme />
<Meta />
<PlausibleAnalytics apiHost={`${page.url.protocol}//${page.url.host}`} domain={page.url.hostname} />
<SkipToContent />

<div class='flex min-h-dvh flex-col'>
	<Header />

	<Content class={`mx-auto w-full grow ${shellWidth}`}>
		{@render children?.()}
	</Content>

	<Footer />
</div>
