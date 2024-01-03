import type { Action } from 'svelte/action'

// Copied from https://github.com/ghostdevv/svelte-body
// License: MIT

/**
 * Svelte action to add style on `body`. style can either be a string or an object.
 *
 * @example
 *
 *```svelte
 * <script>
 *   import { style } from 'svelte-body';
 * </script>
 *
 * <svelte:body use:style={"background-color: blue;"} />
 *```
 */
export const style: Action<HTMLElement, string> = (
	node,
	styleData = '',
) => {
	// Pseudo Element for style parsing and keeping track of styles
	const pseudoElement = document.createElement('div')

	const update = (styleData = '') => {
		pseudoElement.style.cssText = styleData

		// Combine body's existing styles with computed ones
		node.style.cssText = `
        ${node.style.cssText};
        ${pseudoElement.style.cssText};
      `
	}

	// Initial Update
	update(styleData)

	const unset = () => {
		// Remove the pseudoElements styles on the body
		node.style.cssText = node.style.cssText.replace(
			pseudoElement.style.cssText,
			'',
		)

		// Clear pseudoElement
		pseudoElement.style.cssText = ''
	}

	return {
		update: (styleData) => {
			unset()
			update(styleData)
		},

		destroy: unset,
	}
}
