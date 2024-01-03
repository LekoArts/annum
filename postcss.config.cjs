const postCssPresetEnv = require('postcss-preset-env')
const postCssGlobalData = require('@csstools/postcss-global-data')

const config = {
	plugins: [
		postCssGlobalData({
			files: ['src/styles/custom-media-queries.css'],
		}),
		postCssPresetEnv({}),
	],
}

module.exports = config
