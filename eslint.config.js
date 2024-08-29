import antfu from '@antfu/eslint-config'

export default antfu({
	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: false,
	},
	svelte: true,
	typescript: true,
	rules: {
		'ts/no-restricted-types': ['error', {
			types: {
				'{}': {
					fixWith: 'Record<string, unknown>',
				},
				'object': {
					fixWith: 'Record<string, unknown>',
				},
			},
		}],
		'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
		'ts/no-unsafe-function-type': 'error',
		'ts/no-wrapper-object-types': 'error',
		'ts/array-type': ['error', { default: 'generic' }],
		'svelte/valid-compile': 'warn',
		'svelte/mustache-spacing': 'off',
		'no-unused-vars': 'off',
		'ts/no-unused-vars': ['error', {
			argsIgnorePattern: '^_[^_].*$|^_$',
			varsIgnorePattern: '^_[^_].*$|^_$',
			caughtErrorsIgnorePattern: '^_[^_].*$|^_$',
		}],
		'unused-imports/no-unused-vars': 'off',
		'style/quotes': ['error', 'single', { avoidEscape: true }],
	},
	ignores: ['**/.DS_Store', '**/node_modules', '/build', '/.svelte-kit', '/package', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'],
})
