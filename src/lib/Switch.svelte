<script lang='ts'>
	// Based on suggestions from:
  // Inclusive Components by Heydon Pickering https://inclusive-components.design/toggle-button/
  // On Designing and Building Toggle Switches by Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
  // And this example by Scott O'hara https://codepen.io/scottohara/pen/zLZwNv

	interface Props {
		label: string
		value?: boolean
		onClickWithValue?: (value: boolean) => void
	}

	let { label, value = $bindable(false), onClickWithValue = () => {} }: Props = $props()

	const uniqueID = Math.floor(Math.random() * 100)

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		const state = (event.target as HTMLButtonElement).getAttribute('aria-checked') as 'true' | 'false'
		value = state !== 'true'

		if (onClickWithValue)
			onClickWithValue(value)
	}
</script>

<div class='flex items-center gap-2'>
	<span id={`switch-${uniqueID}`}>{label}</span>
	<button
		role='switch'
		aria-checked={value}
		aria-labelledby={`switch-${uniqueID}`}
		onclick={handleClick}>
		{value ? 'On' : 'Off'}
	</button>
</div>
