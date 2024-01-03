<script lang='ts'>
	// Based on suggestions from:
  // Inclusive Components by Heydon Pickering https://inclusive-components.design/toggle-button/
  // On Designing and Building Toggle Switches by Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
  // And this example by Scott O'hara https://codepen.io/scottohara/pen/zLZwNv

	export let label: string
	export let value: boolean = false

	const uniqueID = Math.floor(Math.random() * 100)

	// @ts-expect-error - TODO: Fix this
	function handleClick({ target }) {
		const state = target.getAttribute('aria-checked') as 'true' | 'false'
		value = state !== 'true'
	}

</script>

<div class='switch flex align-center'>
	<span id={`switch-${uniqueID}`}>{label}</span>
	<button
		role='switch'
		aria-checked={value}
		aria-labelledby={`switch-${uniqueID}`}
		on:click={handleClick}>
	</button>
</div>

<style lang='postcss'>
  .switch {
    --color-alpha: 1;
    & button {
      width: var(--space-xl);
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
        right: calc(var(--space-xl) / 2);
        transition: transform 0.3s;
        border-radius: 100%;
        transform: translateY(-50%);
      }

      &[aria-checked='true'] {
        background: var(--color-5);
        box-shadow: 0 0px 8px var(--color-4);
      }

      &[aria-checked='true']:before {
        transform: translateX(calc((var(--space-xl)) - (var(--space-xl) - var(--space-s)) + 3px)) translateY(-50%);
        transition: transform 0.3s;
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
