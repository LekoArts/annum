<script lang='ts'>
	import { page } from '$app/state'
	import Meta from '$lib/Meta.svelte'
	import PlausibleAnalytics from '$lib/PlausibleAnalytics.svelte'
	import Content from '$lib/skip-to-content/Content.svelte'
	import SkipToContent from '$lib/skip-to-content/Nav.svelte'
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import './style.css'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()
</script>

<Meta />
<PlausibleAnalytics apiHost={`${page.url.protocol}//${page.url.host}`} domain={page.url.hostname} />
<SkipToContent />

<Header />

<Content class='container'>
	{@render children?.()}
</Content>

<Footer />
