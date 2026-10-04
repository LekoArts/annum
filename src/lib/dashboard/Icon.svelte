<script lang='ts'>
	const paths = {
		filter: 'M4 4h16l-6 7v8l-4-2v-6L4 4Z',
		sliders: 'M4 6h7m4 0h5M4 12h2m4 0h10M4 18h10m4 0h2M11 3v6m-5 0v6m8 0v6',
		left: 'm14 5-7 7 7 7M7 12h14',
		right: 'm10 5 7 7-7 7M3 12h14',
		down: 'm6 9 6 6 6-6',
		check: 'm5 12 4 4L19 6',
		exit: 'M9 4H4v16h5m6-13 5 5-5 5M9 12h11',
		info: 'M12 11v6m0-10v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
		external: 'M14 3h7v7m0-7L10 14m0-9H4v15h15v-6',
	}

	interface Props {
		name: keyof typeof paths
		class?: string
	}

	let { name, class: className = 'size-4' }: Props = $props()
</script>

<svg class={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>
	<path d={paths[name]} />
</svg>
