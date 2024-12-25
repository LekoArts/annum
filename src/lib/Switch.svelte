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

<div class='switch flex align-center'>
	<span id={`switch-${uniqueID}`}>{label}</span>
	<button
		role='switch'
		aria-checked={value}
		aria-labelledby={`switch-${uniqueID}`}
		onclick={handleClick}>
	</button>
</div>

<style lang='postcss'>
  .switch {
    --color-alpha: 1;
    position: relative;
    & button {
      width: var(--space-2xl);
      height: var(--space-m);
      position: relative;
      background: var(--color-13);
      border: none;
      border-radius: var(--space-xs);
      margin-left: var(--space-2xs);

      &:before {
        content: '';
        position: absolute;
        width: calc(var(--space-s) + 3px);
        height: calc(var(--space-s) + 3px);
        background: var(--color-0);
        top: 50%;
        right: calc(var(--space-2xl) / 1.55);
        transition: transform 0.3s;
        border-radius: 100%;
        transform: translateY(-50%);
      }

      &:after {
        content: 'Off';
        position: absolute;
        top: 50%;
        right: var(--space-2xs);
        text-transform: uppercase;
        transform: translateY(-50%);
        letter-spacing: -0.02em;
        font-weight: 600;
        color: var(--color-11);
      }

      &[aria-checked='true'] {
        background: var(--color-5);
        box-shadow: 0 0px 8px var(--color-4);
      }

      &[aria-checked='true']:before {
        transform: translateX(calc(var(--space-2xl) / 1.7)) translateY(-50%);
        transition: transform 0.3s;
      }

      &[aria-checked='true']:after {
        content: 'On';
        right: initial;
        left: var(--space-2xs);
        color: var(--color-2);
      }

      &:focus {
        box-shadow: 0 0px 8px var(--color-4);
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
