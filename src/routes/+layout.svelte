<script lang='ts'>
	import { PlausibleAnalytics } from '@accuser/svelte-plausible-analytics'
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import Content from '$lib/skip-to-content/Content.svelte'
	import SkipToContent from '$lib/skip-to-content/Nav.svelte'
	import Meta from '$lib/Meta.svelte'
	import { page } from '$app/stores'
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
