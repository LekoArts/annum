<script lang='ts'>
	import { theme } from '#lib/store/theme.js'
	import { onMount } from 'svelte'

	onMount(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)')
		let preference = $theme
		function apply(): void {
			const dark = preference === 'dark' || (preference !== 'light' && media.matches)
			document.documentElement.dataset.theme = dark ? 'dark' : 'light'
			const canvas = getComputedStyle(document.documentElement).getPropertyValue('--page').trim()
			document.querySelector('meta[name="theme-color"]')?.setAttribute('content', canvas)
		}
		const unsubscribe = theme.subscribe((value) => {
			preference = value
			apply()
		})
		media.addEventListener('change', apply)
		return () => {
			unsubscribe()
			media.removeEventListener('change', apply)
		}
	})
</script>
