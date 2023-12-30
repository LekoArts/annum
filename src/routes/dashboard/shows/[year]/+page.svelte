<script lang='ts'>
	import type { PageData } from './$types'

	export let data: PageData

	$: year = data.year
</script>

<h1>{year}</h1>
<p>Show!</p>
