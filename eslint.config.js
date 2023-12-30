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
		'ts/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					'{}': {
						fixWith: 'Record<string, unknown>',
					},
					'object': {
						fixWith: 'Record<string, unknown>',
					},
					'Function': false,
				},
			},
		],
		'ts/array-type': ['error', { default: 'generic' }],
	},
}, {
	files: ['**/*.svelte'],
	rules: {
		'prefer-const': 'off',
	},
})
