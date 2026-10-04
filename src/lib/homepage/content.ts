export const HOMEPAGE_URL = 'https://www.annum.app/'

export const faqs = [
	{
		question: 'What is annum?',
		answer: 'annum turns your Simkl watch history into a visual collection of movie, show, and anime posters. Choose a year to revisit what you watched, browse the artwork, and put together a year-in-review screenshot.',
	},
	{
		question: 'How do I get started?',
		answer: 'Connect with your Simkl account and let annum load your watch history. Your collection appears as a poster grid. Use the controls above it to choose a year, filter media types, or change how the grid looks.',
	},
	{
		question: 'Do I need a Simkl account?',
		answer: 'Yes. annum uses the movies, shows, and anime you have tracked on Simkl. Sign in through Simkl with your existing account. If you are new to Simkl, create an account there and start tracking what you watch before connecting it to annum.',
	},
	{
		question: 'Will annum change my Simkl watch history?',
		answer: 'No. annum requests read-only access to your Simkl history. It does not mark anything as watched, edit your lists, or change your ratings. Keep tracking on Simkl; use annum to browse your collection.',
	},
	{
		question: 'Can I see movies, shows, and anime together?',
		answer: 'Yes. All three media types appear in one collection by default. You can show one type or combine several using the type selector. Posters are ordered by the latest watch activity within the selected year.',
	},
	{
		question: 'How does annum decide which year a title belongs to?',
		answer: 'Movies appear in the year of their most recent watch recorded by Simkl. Shows and anime appear in each year with recorded episode watch activity. A series watched across several years can therefore appear in more than one yearly collection.',
	},
	{
		question: 'Why might a title be missing from my collection?',
		answer: 'Check the selected year and media types, then check that Simkl has a watch date for the title or its episodes. Entries with unknown watch dates are left out of yearly collections. A rewatched movie appears under its latest recorded watch year. If the initial sync fails, use the retry option on the dashboard.',
	},
	{
		question: 'Can I make a screenshot of my year in movies and shows?',
		answer: 'Yes. Open display settings and enable screenshot mode for a seamless poster grid. You can adjust the number of columns, then capture it with your device or browser. annum does not currently include an image download or automatic screenshot export.',
	},
	{
		question: 'Can I customize the collection on my phone?',
		answer: 'Yes. annum works in mobile and desktop browsers. You can switch between light, dark, and system themes, group your collection by month, and adjust the grid for screenshots. Your display preferences are saved in the browser.',
	},
	{
		question: 'Where does annum keep my collection?',
		answer: 'annum caches a compact copy of your collection in your browser, so changing years or media types does not need a separate library request each time. It checks Simkl for updates when the dashboard loads. Another browser or device loads its own copy when you sign in.',
	},
]

export const homepageStructuredData = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${HOMEPAGE_URL}#website`,
			'name': 'annum',
			'url': HOMEPAGE_URL,
			'inLanguage': 'en',
		},
		{
			'@type': 'WebApplication',
			'@id': `${HOMEPAGE_URL}#app`,
			'name': 'annum',
			'url': HOMEPAGE_URL,
			'applicationCategory': 'EntertainmentApplication',
			'operatingSystem': 'Any',
			'browserRequirements': 'Requires JavaScript and a Simkl account.',
			'description': faqs[0].answer,
			'featureList': ['Yearly Simkl poster collections', 'Movies, shows, and anime filters', 'Month grouping', 'Screenshot mode', 'Light and dark themes'],
		},
		{
			'@type': ['WebPage', 'FAQPage'],
			'@id': `${HOMEPAGE_URL}#webpage`,
			'url': HOMEPAGE_URL,
			'name': 'annum — your Simkl history in posters',
			'isPartOf': { '@id': `${HOMEPAGE_URL}#website` },
			'about': { '@id': `${HOMEPAGE_URL}#app` },
			'inLanguage': 'en',
			'mainEntity': faqs.map(({ question, answer }) => ({
				'@type': 'Question',
				'name': question,
				'acceptedAnswer': { '@type': 'Answer', 'text': answer },
			})),
		},
	],
}

/** Built here because a literal `<script>` inside a Svelte expression is parsed as a script block. */
export const homepageStructuredDataTag = `<script type="application/ld+json">${JSON.stringify(homepageStructuredData).replaceAll('<', '\\u003c')}</script>`
