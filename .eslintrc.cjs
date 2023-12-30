/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'svelte/valid-compile': 0,
		'quotes': 0,
		'@typescript-eslint/quotes': [
			'error',
			'single',
			{
				'allowTemplateLiterals': true
			}
		],
		'@typescript-eslint/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					'{}': {
						fixWith: 'Record<string, unknown>',
					},
					object: {
						fixWith: 'Record<string, unknown>',
					},
				},
			},
		],
		'@typescript-eslint/array-type': ['error', { default: 'generic' }],
		indent: 0,
		'@typescript-eslint/indent': ['error', 'tab', { SwitchCase: 1 }],
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				'indent': 0,
				'svelte/indent': ['error', { indent: 'tab', switchCase: 1 }]
			}
		}
	]
};
