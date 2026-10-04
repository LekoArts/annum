<script lang='ts'>
	import type { Snippet } from 'svelte'

	interface Props {
		label: string
		align?: 'start' | 'end'
		width?: string
		trigger: Snippet<[boolean, (event: MouseEvent) => void, string]>
		children: Snippet<[() => void, boolean]>
	}

	let { label, align = 'start', width = 'w-60', trigger, children }: Props = $props()
	const id = $props.id()
	let anchor: HTMLDivElement
	let panel: HTMLDivElement
	let open = $state(false)

	function place(): void {
		if (!anchor || !panel)
			return
		const rect = anchor.getBoundingClientRect()
		const left = align === 'end' ? rect.right - panel.offsetWidth : rect.left
		panel.style.left = `${Math.max(12, Math.min(left, window.innerWidth - panel.offsetWidth - 12))}px`
		panel.style.top = `${Math.max(12, rect.bottom + 8)}px`
		panel.style.transformOrigin = `${rect.left + rect.width / 2 - Number.parseFloat(panel.style.left)}px top`
		panel.style.maxHeight = `${Math.max(100, window.innerHeight - rect.bottom - 20)}px`
	}

	function focusSelection(last = false): void {
		const selected = panel.querySelector<HTMLElement>('[aria-current="true"]:not(:disabled), input:checked:not(:disabled)')
		const controls = panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)')
		const target = selected ?? controls[last ? controls.length - 1 : 0]
		target?.focus({ preventScroll: true })
		target?.scrollIntoView({ block: 'nearest' })
	}

	function toggle(event: MouseEvent): void {
		// Native popovertarget handles toggling before we position and focus the panel.
		requestAnimationFrame(() => {
			if (!panel.matches(':popover-open'))
				return
			place()
			panel.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' })
			if (event.detail === 0)
				focusSelection()
		})
	}

	function triggerKeyboard(event: KeyboardEvent): void {
		if (!anchor?.contains(event.target as Node) || !['ArrowDown', 'ArrowUp'].includes(event.key))
			return
		event.preventDefault()
		panel.showPopover()
		place()
		focusSelection(event.key === 'ArrowUp')
	}

	function close(): void {
		panel.hidePopover()
		anchor.querySelector('button')?.focus({ preventScroll: true })
	}

	function handleToggle(event: ToggleEvent): void {
		open = event.newState === 'open'
		if (open)
			place()
	}

	function keyboard(event: KeyboardEvent): void {
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
			return
		if (event.target instanceof HTMLInputElement && ['number', 'radio'].includes(event.target.type))
			return
		const controls = Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)'))
		if (!controls.length)
			return
		event.preventDefault()
		const current = controls.indexOf(document.activeElement as HTMLElement)
		const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : current < 0 ? (event.key === 'ArrowUp' ? controls.length - 1 : 0) : (current + (event.key === 'ArrowUp' ? -1 : 1) + controls.length) % controls.length
		controls[next]?.focus()
	}
</script>

<svelte:window onkeydown={triggerKeyboard} onresize={() => open && place()} onscrollcapture={() => open && place()} />

<div bind:this={anchor} class='flex shrink-0'>
	{@render trigger(open, toggle, id)}
</div>
<div
	bind:this={panel}
	{id}
	popover='auto'
	role='dialog'
	aria-label={label}
	tabindex='-1'
	ontoggle={handleToggle}
	onkeydown={keyboard}
	class={`fixed inset-auto m-0 max-w-[calc(100vw-24px)] overflow-y-auto overscroll-contain rounded-[15px] border border-(--border) bg-(--menu) p-1.5 text-sm text-(--ink) shadow-(--menu-shadow) ${width}`}>
	{@render children(close, open)}
</div>
