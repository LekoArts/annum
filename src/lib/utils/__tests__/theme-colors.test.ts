import { readFileSync } from 'node:fs'
import { SVG_ICON_IDS } from '#const'
import { THEME_STORAGE_KEY } from '#lib/store/theme.js'
import { describe, expect, it } from 'vitest'

// The pre-paint script in app.html has to repeat both background colours: it runs before any stylesheet, so it
// cannot read `--page`. These tests fail if the copies drift apart.
const root = new URL('../../../../', import.meta.url)
const appHtml = readFileSync(new URL('src/app.html', root), 'utf8')
const layoutCss = readFileSync(new URL('src/routes/layout.css', root), 'utf8')

function pageToken(selector: string): string {
	const block = layoutCss.slice(layoutCss.indexOf(selector))
	return (/#?--page:\s*(#[0-9a-f]{6})/i.exec(block)?.[1] ?? '').toLowerCase()
}

const lightPage = pageToken(':root {')
const darkPage = pageToken(':root[data-theme=\'dark\']')

describe('theme colours in app.html', () => {
	it('matches the light --page token as the no-JS default', () => {
		expect(lightPage).not.toBe('')
		expect(appHtml).toContain(`<meta name="theme-color" content="${lightPage}">`)
	})

	it('switches the pre-paint script between both --page tokens', () => {
		expect(darkPage).not.toBe('')
		expect(appHtml).toContain(`? '${darkPage}' : '${lightPage}'`)
	})

	it('reads the same storage key as the theme store', () => {
		expect(appHtml).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`)
	})
})

describe('icon ids in static/icons.svg', () => {
	const symbols = readFileSync(new URL('static/icons.svg', root), 'utf8')

	it('defines every id the Svg component can render', () => {
		for (const id of SVG_ICON_IDS) {
			expect(symbols).toContain(`<symbol id="${id}"`)
		}
	})

	it('has no unused symbol', () => {
		const defined = Array.from(symbols.matchAll(/<symbol id="([^"]+)"/g), match => match[1])

		expect(defined.sort()).toEqual([...SVG_ICON_IDS].sort())
	})
})
