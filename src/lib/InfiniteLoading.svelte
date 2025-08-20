<script module lang='ts'>
	/**
	 * Adapted from https://github.com/skayo/svelte-infinite-loading/blob/master/src/InfiniteLoading.svelte
	 * LICENSE: MIT
	 */

	const THROTTLE_LIMIT = 50
	const LOOP_CHECK_TIMEOUT = 1000
	const LOOP_CHECK_MAX_CALLS = 10

	const ERROR_INFINITE_LOOP = `executed the callback function more than ${LOOP_CHECK_MAX_CALLS} times for a short time`

	/**
	 * the third argument for event bundler
	 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	 */
	const thirdEventArg = (() => {
		let supportsPassive = { passive: false }

		try {
			const opts = Object.defineProperty({}, 'passive', {
				get() {
					supportsPassive = { passive: true }
					return true
				},
			})

			// @ts-expect-error
			window.addEventListener('testPassive', null, opts)
			// @ts-expect-error
			window.removeEventListener('testPassive', null, opts)
		}
		catch (_e) {
		//
		}

		return supportsPassive
	})()

	const throttler = {
		timers: new Array<ReturnType<typeof setTimeout>>(),
		caches: new Array<() => void>(),

		throttle(fn: () => void) {
			if (!this.caches.includes(fn)) {
				// cache current handler
				this.caches.push(fn)

				// save timer for current handler
				this.timers.push(setTimeout(() => {
					fn()

					// empty cache and timer
					this.caches.splice(this.caches.indexOf(fn), 1)
					this.timers.shift()
				}, THROTTLE_LIMIT))
			}
		},

		reset() {
			// reset all timers
			this.timers.forEach((timer) => {
				clearTimeout(timer)
			})
			this.timers.length = 0

			// empty caches
			this.caches = []
		},
	}

	const loopTracker: {
		isChecked: boolean
		timer: ReturnType<typeof setTimeout> | null
		times: number
		track: () => void
	} = {
		isChecked: false,
		timer: null,
		times: 0,

		track() {
			// record track times
			this.times += 1

			// try to mark check status
			if (this.timer)
				clearTimeout(this.timer)

			this.timer = setTimeout(() => {
				this.isChecked = true
			}, LOOP_CHECK_TIMEOUT)

			// throw warning if the times of continuous calls large than the maximum times
			if (this.times > LOOP_CHECK_MAX_CALLS) {
				console.error(ERROR_INFINITE_LOOP)
				this.isChecked = true
			}
		},
	}

	const scrollBarStorage = {
		key: '_infiniteScrollHeight',
		getScrollElement(element: Element | Window): Element {
			return element === window ? document.documentElement : element as Element
		},
		save(element: Element | Window) {
			const target = this.getScrollElement(element);
			(target as any)[this.key] = (target as Element).scrollHeight
		},
		restore(element: Element | Window) {
			const target = this.getScrollElement(element)
			if (typeof (target as any)[this.key] === 'number')
				(target as Element).scrollTop = (target as Element).scrollHeight - (target as any)[this.key] + (target as Element).scrollTop
			this.remove(target)
		},
		remove(element: Element | Window) {
			if ((element as any)[this.key] !== undefined) {
				delete (element as any)[this.key]
			}
		},
	}

	function isVisible(element: HTMLElement | null | undefined): boolean {
		return !!element && (element.offsetWidth + element.offsetHeight) > 0
	}
</script>

<script lang='ts'>
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'

	import { run } from 'svelte/legacy'

	const dispatch = createEventDispatcher()

	const STATUS = {
		READY: 0,
		LOADING: 1,
		COMPLETE: 2,
		ERROR: 3,
	}

	interface Props {
		distance?: number
		direction?: string
		forceUseInfiniteWrapper?: boolean
		identifier?: any
		spinner?: import('svelte').Snippet
		noResults?: import('svelte').Snippet
		noMore?: import('svelte').Snippet
		error?: import('svelte').Snippet<[{ attemptLoad: (isContinuousCall?: boolean) => Promise<void> }]>
	}

	let {
		distance = 100,
		spinner,
		direction = 'bottom',
		forceUseInfiniteWrapper = false,
		// identifier = +new Date(),
		noResults,
		noMore,
		error,
	}: Props = $props()

	let isFirstLoad = $state(true) // save the current loading whether it is the first loading
	let isManualReset = $state(false)
	let status = $state(STATUS.READY)
	let mounted = $state(false)
	let thisElement: HTMLElement | null = $state(null)
	let scrollParent: Element | Window | null = null

	let showSpinner = $derived(status === STATUS.LOADING)
	let showError = $derived(status === STATUS.ERROR)
	let showNoResults = $derived(status === STATUS.COMPLETE && isFirstLoad && !isManualReset)
	let showNoMore = $derived(status === STATUS.COMPLETE && !isFirstLoad)

	const stateChanger = {
		loaded: async () => {
			isFirstLoad = false

			if (direction === 'top') {
				// wait for DOM updated
				await tick()

				if (scrollParent) {
					scrollBarStorage.restore(scrollParent)
				}
			}

			if (status === STATUS.LOADING) {
				await tick()
				await attemptLoad(true)
			}
		},

		complete: async () => {
			status = STATUS.COMPLETE

			// force re-complation computed properties to fix the problem of get slot text delay
			await tick()

			if (scrollParent) {
				scrollParent.removeEventListener('scroll', scrollHandler, thirdEventArg as EventListenerOptions)
			}
		},

		reset: () => {
			status = STATUS.READY
			isFirstLoad = true

			if (scrollParent) {
				scrollBarStorage.remove(scrollParent)
				scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg as AddEventListenerOptions)
			}

			// wait for list to be empty and the empty action may trigger a scroll event
			setTimeout(() => {
				throttler.reset()
				scrollHandler()
			}, 1)
		},

		error: () => {
			status = STATUS.ERROR
			throttler.reset()
		},
	}

	function scrollHandler(event) {
		if (status === STATUS.READY) {
			if (event && event.constructor === Event && isVisible(thisElement))
				throttler.throttle(attemptLoad)

			else
				attemptLoad()
		}
	}

	// Attempt to trigger load
	async function attemptLoad(isContinuousCall = false) {
		if (status !== STATUS.COMPLETE && isVisible(thisElement) && getCurrentDistance() <= distance) {
			status = STATUS.LOADING

			if (direction === 'top') {
				// wait for spinner display
				await tick()

				scrollBarStorage.save(scrollParent)
			}

			dispatch('infinite', stateChanger)

			if (isContinuousCall && !forceUseInfiniteWrapper && !loopTracker.isChecked) {
				// check this component whether be in an infinite loop if it is not checked
				loopTracker.track()
			}
		}
		else if (status === STATUS.LOADING) {
			status = STATUS.READY
		}
	}

	// Reset the state of the component (same code as stateChanger)
	export async function reset() {
		status = STATUS.READY
		isFirstLoad = true
		isManualReset = true

		scrollBarStorage.remove(scrollParent)

		scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg)

		// wait for list to be empty and the empty action may trigger a scroll event
		setTimeout(() => {
			throttler.reset()
			scrollHandler()
		}, 1)
	}

	// Get current distance from the specified direction
	function getCurrentDistance() {
		let distance

		if (direction === 'top') {
			distance = typeof scrollParent.scrollTop === 'number' ? scrollParent.scrollTop : scrollParent.pageYOffset
		}
		else {
			const infiniteElementOffsetTopFromBottom = thisElement.getBoundingClientRect().top
			const scrollElementOffsetTopFromBottom = scrollParent === window ? window.innerHeight : scrollParent.getBoundingClientRect().bottom

			distance = infiniteElementOffsetTopFromBottom - scrollElementOffsetTopFromBottom
		}

		return distance
	}

	// Get the first scroll parent of an element
	function getScrollParent(element = thisElement) {
		let result

		if (typeof forceUseInfiniteWrapper === 'string')
			result = document.querySelector(forceUseInfiniteWrapper)

		if (!result) {
			if (element.tagName === 'BODY')
				result = window

			else if (!forceUseInfiniteWrapper && ['scroll', 'auto'].includes(getComputedStyle(element).overflowY))
				result = element

			else if (element.hasAttribute('infinite-wrapper') || element.hasAttribute('data-infinite-wrapper'))
				result = element
		}

		return result || getScrollParent(element.parentNode)
	}

	function updateScrollParent() {
		if (mounted)
			scrollParent = getScrollParent()
	}

	function identifierUpdated() {
		if (mounted)
			stateChanger.reset()
	}

	// Watch forceUseInfiniteWrapper and mounted
	run(() => {
		forceUseInfiniteWrapper, mounted, updateScrollParent()
	})

	// Watch identifier and mounted
	run(() => {
		identifier, mounted, identifierUpdated()
	})

	onMount(async () => {
		mounted = true

		setTimeout(() => {
			scrollHandler()
			scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg)
		}, 1)
	})

	onDestroy(() => {
		if (mounted && status !== STATUS.COMPLETE) {
			throttler.reset()
			scrollBarStorage.remove(scrollParent)
			scrollParent.removeEventListener('scroll', scrollHandler, thirdEventArg)
		}
	})
</script>

<div class='infinite-loading-container' bind:this={thisElement}>
	{#if showSpinner}
		<div class='infinite-status-prompt'>
			{#if spinner}{@render spinner()}{:else}
				Loader
			{/if}
		</div>
	{/if}

	{#if showNoResults}
		<div class='infinite-status-prompt'>
			{#if noResults}{@render noResults()}{:else}
				No results :(
			{/if}
		</div>
	{/if}

	{#if showNoMore}
		<div class='infinite-status-prompt'>
			{#if noMore}{@render noMore()}{:else}
				No more data :)
			{/if}
		</div>
	{/if}

	{#if showError}
		<div class='infinite-status-prompt'>
			{#if error}{@render error({ attemptLoad })}{:else}
				Oops, something went wrong :(
				<br>
				<button class='btn-try-infinite' onclick={() => attemptLoad()}>
					Retry
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.infinite-loading-container {
		clear:      both;
		text-align: center;
	}

	.btn-try-infinite {
		margin-top:    5px;
		padding:       5px 10px;
		color:         #999;
		font-size:     14px;
		line-height:   1;
		background:    transparent;
		border:        1px solid #ccc;
		border-radius: 3px;
		outline:       none;
		cursor:        pointer;
	}

	.btn-try-infinite:not(:active):hover {
		opacity: 0.8;
	}
</style>
