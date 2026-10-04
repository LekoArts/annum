# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who track their watched movies, shows, and anime on Simkl and want to revisit their history by year. They may capture a screenshot of the posters as a year in review.

## Product Purpose

Annum lets users sign in with Simkl and see the posters of what they watched. Success means finding the desired year and media categories, browsing the posters, and capturing a screenshot when desired.

## Operating Context

- Users need a Simkl account and sign in through Simkl.
- The approved homepage is a compact landing page for existing Simkl users. It explains yearly collections through animated illustrations and one “Connect with Simkl” action; signed-in visitors can view the homepage and use its “Dashboard” CTA to reach `/dashboard`. This approved homepage is implemented; signed-in visitors are not automatically redirected.
- Browsing happens in a web browser and must work at mobile viewport sizes as well as desktop sizes.
- The interface supports System, Light, and Dark theme preferences. System follows the device preference; explicit choices persist across visits.
- Users take screenshots themselves. Screenshot mode removes grid gutters, rounded corners, resting outlines, and shadows. Columns can follow the screen automatically or be set manually from 1 to 100; controls stay above the grid.
- The dashboard uses a compact collection dock above the posters for media categories, previous/next year navigation, the year picker, and display settings. Account actions live in an avatar menu.
- Browsing selects exactly one year and one or more media categories. Optional month grouping adds headings within the collection.

## Capabilities and Constraints

- Annum is a read-only Simkl client. It never writes watch history or calls the Simkl stats endpoint.
- Movies, shows, and anime are three distinct media categories, presented in one mixed grid ordered by latest watch activity in the selected year.
- Movies appear in the year of their latest watch. Shows and anime can appear in every year with episode watch activity. Unknown watch dates before 2000 are excluded.
- The normalized library and sync activity snapshot are cached in localStorage. Year and category changes use cached data without per-year API requests.
- Browsing state lives in the dashboard query string. Appearance settings live in localStorage.
- The only dashboard route is `/dashboard`; year and category selections are represented by its query parameters.
- Category counts come from the cached library. Account-wide watch-time statistics are outside the current scope; the expensive Simkl stats request was explicitly declined.
- The account menu shows the user's name, connection status, a PRO or VIP badge when applicable, and an optional “Member since Month Year” date. These details come from the existing sign-in profile request; missing fields are hidden and older sessions receive them on the next sign-in. Free accounts have no plan badge.
- Sign out is a secondary account-menu action. About and source-code links remain in the footer alongside author credit and Simkl attribution.
- Initial sync failures offer retry. Filtered empty results offer “Show all types”; background sync failures preserve cached posters for browsing.
- Authentication is stateless through Better Auth cookies. The server gates protected routes and performs Simkl sync; the dashboard renders in the browser.
- Posters and metadata come from Simkl. Every poster links to its Simkl item page for attribution.
- Homepage illustrations are authored SVG scenes inspired by recognizable movies, shows, and anime. They are illustrative product communication, not real account history or Simkl-supplied posters. Each design appears once, without visible month or category labels.
- The application uses SvelteKit 3, Svelte 5, strict TypeScript, and Tailwind v4, and deploys to Netlify.

## Brand Commitments

- The product name is Annum; the existing wordmark is written as `annum`.
- Minimal design is a binding requirement. Watched poster cards are the focus; year, category, and settings controls should stay out of the way.
- The approved Soft capsule design is now implemented and is the identity to preserve during refinements. DESIGN.md records its visual tokens and component behavior.
- The collection is poster-only, without visible title captions or metadata overlays. Accessible poster names remain available to assistive technology.
- Controls should be understandable without tooltips; the owner explicitly chose to omit them.
- The approved homepage uses a quiet central offer surrounded by scattered illustrated covers, with sparse dotted guides and “+” markers. The wordmark and footer have generous breathing room. Scene details animate continuously, with reduced-motion stills and a quiet footer Pause/Resume button; the offer stays stationary.
- Annum is an open-source personal project by LekoArts. Existing author credit, source links, and Simkl attribution are factual content.

## Evidence on Hand

- README.md documents the product, authentication, sync, cache, and page structure.
- The current routes and components implement working poster browsing, controls, and screenshot mode.
- Live library data and posters are supplied by the signed-in user's Simkl account.
- Earlier deployed screenshots and images in src/assets are historical references, not the current design authority. The approved Soft capsule comps and dashboard brief record the design direction; current components and DESIGN.md capture subsequent approved refinements.
- The implemented homepage uses fourteen unique authored SVG artworks on desktop and nine on mobile. Its Connect action guards session loading and pending sign-in, sends the existing Simkl social auth flow to the dashboard callback, and provides failure feedback.
- The homepage brief and final animated prototype under `.impeccable/mocks/illustrations/` record the approved homepage composition and fourteen unique cover designs. Earlier homepage decision images predate the removal of months, category labels, and the demo caption.
- Full-page implementation captures live under `.impeccable/review/homepage/`. Finish review returned ship with no material fixes; the check suite passed (82 tests, zero Svelte diagnostics, typecheck, lint, and build). External OAuth completion and native reduced-motion browser behavior were not retested; reduced-motion rules were verified in source.
- No customer testimonials, adoption figures, or performance claims have been provided.

## Product Principles

- Let watched posters lead the experience.
- Keep browsing controls accessible without competing with the library.
- Make year and category navigation immediate through the local cache.
- Support browsing and screenshot preparation on mobile and desktop.
- Preserve the user's Simkl history as read-only source data.

## Open Decisions

- No built-in screenshot export, publishing, or sharing workflow has been approved; users capture screenshots with their device.
- No product-specific accessibility conformance target has been confirmed. Existing keyboard navigation, semantic controls, focus visibility, and reduced-motion support are part of the implementation to preserve.
