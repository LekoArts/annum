<script lang='ts'>
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import { page } from '$app/stores'
	import Meta from '$lib/Meta.svelte'
	import PlausibleAnalytics from '$lib/PlausibleAnalytics.svelte'
	import Content from '$lib/skip-to-content/Content.svelte'
	import SkipToContent from '$lib/skip-to-content/Nav.svelte'
	import './style.css'
</script>

<Meta />
<PlausibleAnalytics apiHost={`${$page.url.protocol}//${$page.url.host}`} domain={$page.url.hostname} />
<SkipToContent />

<Header />

<Content class='container'>
	<slot></slot>
</Content>

<Footer />
