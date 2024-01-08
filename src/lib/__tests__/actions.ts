/**
 * @vitest-environment happy-dom
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { classList, style } from '../actions'

describe('classList', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('div')
	})

	afterEach(() => {
		element.remove()
	})

	it('should add single class to element', () => {
		classList(element, 'class1')

		expect(element.classList.contains('class1')).toBe(true)
	})

	it('should add multiple classes to element', () => {
		classList(element, ['class1', 'class2'])

		expect(element.classList.contains('class1')).toBe(true)
		expect(element.classList.contains('class2')).toBe(true)
	})

	it('should remove classes when destroy is called', () => {
		const node = classList(element, ['class1', 'class2'])

		// @ts-expect-error - Weird types
		node.destroy()

		expect(element.classList.contains('class1')).toBe(false)
		expect(element.classList.contains('class2')).toBe(false)
	})
})

describe('style', () => {
	let node: HTMLElement

	beforeEach(() => {
		node = document.createElement('div')
	})

	afterEach(() => {
		node.remove()
	})

	it('should set the style of the node', () => {
		style(node, 'color: red;')

		expect(node.style.cssText).toBe('color: red;')
	})

	it('should update the style of the node', () => {
		const action = style(node, '')
		// @ts-expect-error - Weird types
		action.update('color: red;')

		expect(node.style.cssText).toBe('color: red;')
	})

	it('should unset the style of the node', () => {
		const action = style(node, 'color: red;')
		// @ts-expect-error - Weird types
		action.destroy()

		expect(node.style.cssText).toBe('')
	})

	it('should update the style of the node multiple times', () => {
		const action = style(node, '')
		// @ts-expect-error - Weird types
		action.update('color: red;')
		// @ts-expect-error - Weird types
		action.update('font-size: 16px;')

		expect(node.style.cssText).toBe('font-size: 16px;')
	})
})
