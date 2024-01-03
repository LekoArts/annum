<script lang='ts'>
	import { page } from '$app/stores'
	import Spacer from '$lib/Spacer.svelte'
	import Svg from '$lib/Svg.svelte'
	import { style } from '$lib/actions'
	import { settings } from '$lib/store/settings'

	$: segments = $page.url.pathname.slice(1).split('/')
	let value = $settings.hue
</script>

<div class='wrapper flex'>
	<nav aria-label='Breadcrumb' class='breadcrumb flex align-center box'>
		<ol>
			<li>
				<Svg id='home' />
				<a href='/dashboard' aria-current={segments.length === 1 ? 'page' : null}>Home</a>
			</li>
			{#if segments.length > 1}
				<li>
					<Svg id='chevron-right' />
					{#if segments[1] === 'movies'}
						<span>Movies</span>
					{:else if segments[1] === 'shows'}
						<span>Shows</span>
					{/if}
				</li>
				<li>
					<Svg id='chevron-right' />
					<a href={$page.url.pathname} aria-current='page'>{segments[2]}</a>
				</li>
			{/if}
		</ol>
	</nav>
	<div class='box'>
		<input id='hue' type='range' min='0' max='360' step='1' bind:value on:change={(e) => {
			const target = e.target as HTMLInputElement
			if (target)
				settings.set({ hue: Number.parseInt(target.value) })
		}} />
	</div>
</div>

<Spacer axis='vertical' size='m' />

<slot />

<svelte:body use:style={`--color-hue: ${value}`} />

<style lang='postcss'>
	.wrapper {
		justify-content: space-between;
	}

	.box {
		--color-alpha: 0.25;
    gap: var(--space-xs-s);
    background: var(--color-4);
    border: 1px solid var(--color-2);
    padding: var(--space-3xs) var(--space-xs);
    border-radius: var(--space-2xs);
	}

	.breadcrumb {

		& ol {
			list-style: none;
			padding-left: 0;
			margin: 0;
			display: inline-flex;
			align-items: center;

			& li {
				display: inline-flex;
				align-items: center;
				--color-alpha: 0.75;
				--icon-color: var(--color-1);

				& a, span {
					padding-left: var(--space-3xs);
				}
			}
		}

		& a {
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
