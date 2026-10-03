<script lang='ts'>
	import { GITHUB_REPO_URL } from '#const'
	import Spacer from '#lib/Spacer.svelte'
</script>

<h1>About</h1>
<Spacer axis='vertical' size='xs' />
<div class='prose'>
	<p>Hi, thanks for using this app!</p>
	<p>This website was created by <a href='https://www.lekoarts.de?utm_source=annum'>LekoArts</a> as a christmas project to try out SvelteKit. LekoArts loves watching movies and shows ⸺ so why not have a great overview? It's open source and available on GitHub at <a href={GITHUB_REPO_URL}>LekoArts/annum</a>. Contributions welcome! 🥳</p>
	<p>All colors on this website are authored in the <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch'>Oklch Color Space</a>. The color wheel is the representation of the <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/hue'>color hue angle</a>. By changing the color hue in your <a href='/dashboard'>dashboard</a> you can change the color scheme of the whole website.</p>
	<p><a href='https://simkl.com'>Simkl</a> provides the metadata and posters for all movies, shows and anime you can see on this website.</p>
</div>
