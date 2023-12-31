<script lang="ts">
	import "../app.pcss";
    import Footer from './Footer.svelte'
    import Content from '$lib/skip-to-content/Content.svelte'
    import SkipToContent from '$lib/skip-to-content/Nav.svelte'
    import Meta from '$lib/Meta.svelte'
    import './style.css'
</script>

<Meta></Meta>

<SkipToContent></SkipToContent>

<Content>
	<slot></slot>
</Content>

<Footer></Footer>
