<script lang='ts'>
	import { GITHUB_REPO_URL } from '$const'
	import Spacer from '$lib/Spacer.svelte'
</script>

<h1>About</h1>
<Spacer axis='vertical' size='xs' />
<div class='prose'>
	<p>Hi, thanks for using this app!</p>
	<p>This website was created by <a href='https://www.lekoarts.de?utm_source=annuus'>LekoArts</a> as a christmas project to try out SvelteKit. LekoArts loves watching movies and shows ⸺ so why not have a great overview? It's open source and available on GitHub at <a href={GITHUB_REPO_URL}>LekoArts/annuus</a>. Contributions welcome! 🥳 You can also follow me on <a href='https://trakt.tv/users/arsaurea'>Trakt</a> if you want.</p>
	<p>All colors on this website are authored in the <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch'>Oklch Color Space</a>. The color wheel is the representation of the <a href='https://developer.mozilla.org/en-US/docs/Web/CSS/hue'>color hue angle</a>. By changing the color hue in your <a href='/dashboard'>dashboard</a> you can change the color scheme of the whole website.</p>
	<p>Trakt itself doesn't host any images but instead provides metadata for APIs like <a href='https://www.themoviedb.org/'>TMDB</a>. So all posters you can see on this website are sourced from TMDB. TMDB allows to fetch images in different languages, but as it's a community-led effort in most cases only the most popular languages have individual images. Thus the language selector in your <a href='/dashboard'>dashboard</a> only contains a subset of languages (if you're absolutely missing your language, please <a href={GITHUB_REPO_URL}>open an issue</a>).</p>
</div>
