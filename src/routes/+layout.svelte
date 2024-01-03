<script lang='ts'>
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import Content from '$lib/skip-to-content/Content.svelte'
	import SkipToContent from '$lib/skip-to-content/Nav.svelte'
	import Meta from '$lib/Meta.svelte'
	import './style.css'
</script>

<Meta />
<SkipToContent />

<Header />

<Content class='container'>
	<slot></slot>
</Content>

<Footer />
