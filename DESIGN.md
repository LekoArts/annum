---
name: Annum — Soft capsule
description: A quiet, rounded interface that lets watched posters lead in light and dark mode.
colors:
  page-light: "#f7f8fa"
  dock-light: "#ffffff"
  menu-light: "#ffffff"
  ink-light: "#27282f"
  muted-light: "#676b78"
  active-light: "#f0f1f4"
  border-light: "#e0e2e8"
  accent-light: "#6666b8"
  on-accent-light: "#ffffff"
  switch-track-light: "#858a97"
  page-dark: "#111216"
  dock-dark: "#202127"
  menu-dark: "#24252d"
  ink-dark: "#ecedef"
  muted-dark: "#a5a8b5"
  active-dark: "#30313a"
  border-dark: "#35363d"
  accent-dark: "#a4a7ff"
  on-accent-dark: "#111216"
  switch-track-dark: "#4b4e5a"
  image-edge-light: "rgb(0 0 0 / 10%)"
  image-edge-dark: "rgb(255 255 255 / 10%)"
  poster-hover-edge: "rgb(255 255 255 / 65%)"
  homepage-guide-light: "#cdd1df"
  homepage-guide-dark: "#414654"
  homepage-marker-light: "#8388a3"
  homepage-marker-dark: "#858ba9"
typography:
  homepage-heading:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, sans-serif"
    fontSize: "clamp(34px, 4.15vw, 60px)"
    fontWeight: 750
    lineHeight: "1.06"
    letterSpacing: "-0.035em"
  homepage-body:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(16px, 1.4vw, 20px)"
    fontWeight: 400
    lineHeight: "1.55"
  homepage-wordmark:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    letterSpacing: "-0.03em"
  homepage-wordmark-mobile:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    letterSpacing: "-0.03em"
  homepage-action:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 550
    lineHeight: "24px"
  wordmark:
    fontFamily: "'Bricolage Grotesque Variable', ui-sans-serif, sans-serif"
    fontSize: "23px"
    fontWeight: 600
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  body:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  menu-label:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
  caption:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  homepage-cover: "7px"
  poster: "8px"
  segment: "5px"
  row: "8px"
  menu: "15px"
  capsule: "9999px"
spacing:
  segment-inset: "2px"
  dock-inset: "3px"
  menu-inset: "6px"
  small: "8px"
  detail: "10px"
  row-inline: "12px"
  medium: "16px"
  large: "24px"
  page-wide: "36px"
  grid-gap: "clamp(8px, 1vw, 12px)"
components:
  homepage-cta:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.on-accent-light}"
    rounded: "{rounded.capsule}"
    padding: "13px 27px"
    typography: "{typography.homepage-action}"
  button-primary:
    backgroundColor: "{colors.ink-light}"
    textColor: "{colors.page-light}"
    rounded: "{rounded.capsule}"
    padding: "0 16px"
    typography: "{typography.title}"
  button-ghost:
    textColor: "{colors.ink-light}"
    rounded: "{rounded.capsule}"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.active-light}"
    rounded: "{rounded.capsule}"
  collection-dock:
    backgroundColor: "{colors.dock-light}"
    rounded: "{rounded.capsule}"
    padding: "3px"
  menu:
    backgroundColor: "{colors.menu-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.menu}"
    padding: "6px"
    typography: "{typography.body}"
  year-row-selected:
    backgroundColor: "{colors.active-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.row}"
    padding: "0 12px"
  theme-segment-selected:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.on-accent-light}"
    rounded: "{rounded.segment}"
    padding: "0 10px"
    typography: "{typography.caption}"
  columns-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    width: "48px"
    height: "32px"
  account-plan-badge:
    backgroundColor: "{colors.active-light}"
    textColor: "{colors.muted-light}"
    rounded: "6px"
    padding: "2px 6px"
  poster:
    backgroundColor: "{colors.active-light}"
    rounded: "{rounded.poster}"
---

# Design System: Annum

## Overview

**Creative North Star: "Soft capsule"**

The interface gives colorful poster artwork a calm, neutral setting. Compact controls use rounded silhouettes, precise typography, and a restrained lavender accent for selection. Subtle borders and shallow shadows separate controls from the content without making the interface visually dominant.

Light and dark themes share geometry, typography, hierarchy, and behavior. The approved Soft capsule comps establish the visual direction; implementation tokens now come from the application stylesheet and components. The dashboard composition and approved reference images remain in the surface brief.

**Key Characteristics:**

- Poster artwork supplies the strongest color and visual interest.
- Light and dark themes share geometry, typography, hierarchy, and behavior.
- Controls are compact and readable, with softer boundaries and tonal active surfaces.
- Secondary actions appear in anchored menus.

This document captures the implemented dashboard system and homepage extension. Dashboard sources are `src/routes/layout.css`, the dashboard components, header, grid, and theme handling. The [surface brief](.impeccable/dashboard-brief.md) records the composition. Approved references are `dock-soft.png`, `soft-mobile-states.png`, and `soft-desktop-menus.png` under `.impeccable/mocks/decision/`.

The homepage implements the approved animated SVG composition through `src/routes/+page.svelte`, `Header.svelte`, `Footer.svelte`, `+layout.svelte`, `layout.css`, `src/lib/homepage/assets/`, and `src/lib/store/homepage-motion.ts`. Its additions below describe the current implementation. The [homepage brief](.impeccable/homepage-brief.md) records the selected composition, artwork inventory, copy, behavior, approved composition reference, and implementation evidence. The prototype toolbar is not product UI.

This refresh records the current implementation and the user’s approved refinements. Earlier screenshots under `.impeccable/review/` document prior iterations and may predate the current controls. Source code is the authority for exact tokens and behavior; this document does not certify completion of the separate comp fidelity gates.

## Colors

Cool white and charcoal surfaces provide a quiet setting for varied poster colors. The frontmatter records both theme values for each semantic CSS variable; component frontmatter uses light mode as the representative variant. Runtime components resolve the same semantic variables in either theme.

### Primary

- **Muted violet / Pale lavender** (`accent-light`, `accent-dark`): selected theme segments, year checkmarks, checkbox accents, enabled switch tracks, focus outlines, caret, and selection.
- **On-accent ink**: white in light mode and deep charcoal in dark mode, used for selected segment labels and enabled switch thumbs.
- **Homepage CTA:** uses accent and on-accent colors in both themes. This is a homepage-specific action treatment; dashboard primary buttons retain their ink fill.

### Neutral

- **Cool off-white / Deep charcoal** (`page-*`): page canvas and inset input backgrounds.
- **White / Charcoal** (`dock-*`): capsule surface.
- **White / Raised charcoal** (`menu-*`): popover surface.
- **Dark ink / Soft silver** (`ink-*`): primary text and icons.
- **Slate / Muted silver** (`muted-*`): helper text, counts, and resting secondary icons.
- **Pale cool gray / Soft charcoal** (`active-*`): hovered controls, open triggers, selected year rows, and loading placeholders.
- **Pale gray / Muted charcoal** (`border-*`): thin outlines and separators.
- **Slate track / Dark slate track** (`switch-track-*`): off switches. Off thumbs remain white; enabled thumbs use on-accent ink.

**The Poster First Rule.** Let artwork carry the strongest color; reserve lavender for selection, focus, and compact active controls.

Homepage SVG scenes use their own restrained mineral colors, including moss, clay, dusty rose, slate, cream, and lavender. These illustration fills are asset colors rather than new application-wide semantic tokens. Dotted guide lines use `homepage-guide-*`; their small “+” markers use `homepage-marker-*` so the intersections remain distinguishable without competing with the content.

## Typography

Self-hosted Bricolage Grotesque Variable supplies the wordmark. Inter Variable, supplied by `@fontsource-variable/inter`, serves the interface. The exact system fallback stack and observed role sizes are normative in the frontmatter. Both families are bundled locally through Fontsource; Bricolage Grotesque is available from Google Fonts.

The wordmark is compact and semibold with tight tracking. Panel headings and the current year use medium weight; menu rows and supporting copy use regular weight. Menu type labels are slightly larger than dock labels, while counts and supporting descriptions step down. Counts, years, and the column field use tabular numerals. Labels use natural sentence case. Empty-state headings use 18px medium text, with restrained centered supporting copy.

The implemented homepage uses Bricolage Grotesque Variable, matching the annum wordmark, for its centered display heading. Supporting copy and the CTA use Inter. The heading's desktop role is captured in the frontmatter; the implementation uses 38px at intermediate widths and 36px / 1.09 line height on mobile. Supporting copy becomes 16px on smaller screens. Its wordmark uses Bricolage at 26px desktop and 24px mobile. These homepage sizes do not alter dashboard typography.

## Layout

The dashboard header and content share a maximum width of 1800px. Horizontal gutters are 12px by default, 24px from 640px, and 36px from 1024px. Desktop uses a three-part header grid (`1fr auto 1fr`) to center the collection dock independently of the wordmark and avatar. The header has 16px top / 28px bottom padding on mobile and 20px top / 40px bottom from 640px.

The poster grid uses two columns by default, three from 640px, four from 768px, five from 1024px, and six from 1536px. Its responsive gutter is the frontmatter’s grid-gap token. Poster geometry is 2:3. Screenshot mode uses the selected column count, zero gaps, and square corners; controls remain above the grid. Month headings use 18px medium text and span all columns when enabled.

Below 640px the dashboard wordmark is hidden. The type trigger names a sole selected category, uses “Types (2)” for two categories, and “Types” for all three. At 360px the filter icon and year chevron appear and the year label gains padding; below that width they yield space to the labels. At enlarged text sizes the header and dock wrap to keep every control reachable; the one-row arrangement remains the default. Dock triggers are 40px tall; year arrows have compact 32px circular hover and click targets. Menu rows are at least 44px tall and switch rows at least 48px tall.

Popovers sit 8px below their anchor, clamp to a 12px viewport margin, and scroll internally within available height. Types and account panels are 240px wide, year panels 176px, and display panels 19rem (304px at the default text size), all capped to the viewport minus 24px.

### Homepage layout — implemented

The homepage canvas caps at 1600px. A clear top band contains the left wordmark; a separate illustrated scene frames the centered offer; the footer follows a generous gap. Desktop uses 36px gutters, a 106px header band, 20px scene top padding, and a scene height of `clamp(650px, 53vw, 790px)`. At widths through 1050px, gutters become 24px, the header is 100px, and the scene is 660px. Through 600px, the header is 94px, the scene is 790px, and scene top padding is removed.

Individual 2:3 covers occupy staggered positions around the central reading area. Avoid overlap and keep the headline and CTA clear. Fourteen unique designs appear on desktop; mobile uses nine unique designs arranged above and below the offer, with 22px header/footer gutters and 16px scene gutters. The implementation reorganizes at viewport widths of 1050px and 600px. Sparse dotted guide fragments and small plus intersections occupy gaps between covers, with fewer fragments on mobile. Preserve whitespace around the logo and footer rather than pushing covers into those bands. Covers use 9.2% width capped at 137px, 9.5% through 1050px, and 20% capped at 80px through 600px. Footer top margins are 72px, 52px, and 34px across those widths; mobile stacks the credits and attribution.

## Elevation & Depth

Tonal layering combines with thin neutral outlines and shallow ambient shadows. The capsule is subtly lifted; menus sit above their triggers. Dark mode strengthens the shadow while raising surface brightness. Exact theme-specific dock and menu shadows are captured in the sidecar from `layout.css`. Posters combine a tight contact shadow with two progressively softer offset shadows, with stronger opacity in dark mode. Screenshot mode removes all poster shadows. Hover adds a 2px inset translucent white border at 65% opacity in both themes. Posters stay stationary, artwork stays fully opaque, and resting shadows remain unchanged.

**The Shared Geometry Rule.** Change semantic colors between themes while preserving control size, position, and hierarchy.

Pointer popover entry uses a 140ms interruptible transition from a 2px upward offset and 0.98 scale, anchored to the trigger, with cubic-bezier(0.23, 1, 0.32, 1). Exit takes 90ms. Keyboard interactions are instant. Individual dock controls give pointer presses a 0.97 scale response over 120ms. Reduced motion removes popover and press transforms and switch-thumb transitions. Poster and control hover highlights are immediate. Switch track colors and thumb translation use Tailwind’s default 150ms timing; keyboard input suppresses button and segment transitions. There are no decorative gradients, glowing edges, glass effects, or background textures.

Homepage illustrated covers use three neutral shadow layers and stay still. Light mode uses `0 1px 2px #20263218, 0 5px 8px #20263212, 0 14px 20px #2026320d`; dark uses `0 1px 2px #0004, 0 6px 12px #0003, 0 16px 24px #0002`. Continuous motion belongs inside the SVG scenes, not to the page layout or resting card shadows.

## Shapes

Full capsules group the collection controls and soften individual triggers. Menus use the menu radius; their inner rows and number fields use the row radius. Selected theme segments use the smaller segment radius. Posters use the small poster radius, except in screenshot mode. Borders and separators are one pixel. Avatars and switch thumbs are circular. The display-settings trigger is a 40px circle at every breakpoint. Menu corners use a 7px total inset (6px padding plus border) around 8px rows. Theme and column groups use 8px shells with a 3px total inset around 5px segments.

Outline icons use a 24-unit view box, rounded caps and joins, and a 1.6-unit stroke. Most icons render at 16–20px; chevrons use 14px. Independent selections use checkboxes. A single selected year uses a bare checkmark on a tonal row, with no empty checkbox shapes.

Homepage covers use the frontmatter's smaller cover radius. Scenes are crisp authored SVG paths with flat fills and restrained narrative details. Dotted guide segments are one pixel; small plus markers form clear intersections. These details belong to the homepage illustration and are not a dashboard grid overlay.

## Components

### Homepage offer and illustrated covers — implemented

One violet capsule action follows the centered heading and supporting copy. Signed-out visitors see “Connect with Simkl” with a decorative 20px outline link icon; signed-in visitors see “Dashboard” linking to `/dashboard` without that icon. The homepage remains accessible after sign-in and does not automatically redirect. The action uses the frontmatter typography and padding, with a 48px minimum height; mobile uses 15px text and a 46px minimum height. Hover applies 95% brightness. The sign-in button uses the shared pointer press treatment (0.97 scale over 120ms), while the Dashboard anchor stays stationary. Keyboard focus uses the shared 2px accent outline with 3px offset.

Session loading and sign-in pending disable the Connect button, use a wait cursor, and lower opacity to 60%. Pending text reads “Connecting…”. The existing Simkl social auth flow receives `/dashboard` as callback. A failure restores the action and shows “Couldn’t connect to Simkl. Please try again.” in a muted `role="alert"` paragraph.

Each cover is artwork-only, with no visible titles, months, categories, footer bands, or demo captions. Every design appears once. Scene detail moves continuously without hover: falling rain, traveling train, spacecraft rotation, shifting water or sand, and changing light are current examples. Keep the cards and all offer text stationary. The shared, homepage-scoped `src/lib/homepage/illustrations.css` disables animation under `prefers-reduced-motion: reduce`. SVGs contain artwork only, without embedded global styles. A quiet footer button toggles “Pause animations” / “Resume animations” with `aria-pressed` reflecting paused state. The shared motion store drives `data-paused` on the scene; CSS pauses all descendant animations. The button is hidden when reduced motion already presents stills.

Directional movement stays directional: the Spirited Away train crosses right and resets fully outside the clipping area; rain, Matrix code, Akira road markings, and Lord of the Rings clouds use repeating geometry that matches at each loop seam. Breaking Bad’s RV drives right across stationary desert scenery and resets fully outside the frame. Jurassic Park centers a grounded T. rex in a jungle clearing; Severance features the green refinement office, blue number terminal, and moving selection. Secondary details include Totoro’s gentle body sway, Dune’s ornithopter and sand gusts, coffee steam in Twin Peaks, a rotating Endurance, portal spores, and spacecraft engine light. All animation uses transform or opacity; the footer pause control pauses every scene.

The approved composition reference remains `.impeccable/mocks/illustrations/homepage.html`; application sources now own exact production behavior and tokens. Bundled SVG instances have unique title and clipping IDs, accessible artwork names, and hidden decorative guides. The prototype theme/device toolbar and simulated sign-in response do not ship. Full-page implementation captures are under `.impeccable/review/homepage/`. The finish reviewer disposition is ship with no material fixes. Homepage raster diff gates were not prescribed; dashboard fidelity gates are separate and are not certified by this homepage review.

### Buttons

Primary sign-in buttons use ink over the page-colored label, full rounding, 16px horizontal padding, and a minimum height of 40px. Hover lowers opacity to 85%. Ghost dock buttons use the ink color, tonal hover/open backgrounds, and full rounding. Year navigation is muted at rest and uses ink on hover; disabled arrows use 35% opacity. Account sign-out uses a quiet menu row and 50% opacity while pending.

Every keyboard focus target receives a 2px accent outline offset by 3px; poster links increase the offset to 4px. Scrollable year rows use a 2px inset focus outline so the ring remains visible at the list edges. Do not replace focus with a color-only hover treatment. Skip to content is a fixed overlay, hidden above the viewport until focused, with an opaque themed menu background, border, and focus outline; revealing it never changes document flow. It uses native fragment navigation to a main region with tabindex -1, so the next Tab reaches a poster. The wordmark’s accessible name includes “annum”; the footer Simkl logo is a named image, while decorative icons stay hidden.

### Collection dock

A compact bordered capsule with 3px inset contains media types, adjacent-year arrows, the year picker, and display settings. Thin vertical separators group actions. Open triggers remain tonal. Media-type and year chevrons rotate upward by 180 degrees over 150ms using the shared ease-out curve, reversing when closed. Keyboard and reduced-motion state changes are instant. The dock’s semantic group label and trigger labels preserve meaning when mobile omits icons or shortens text.

### Menus and selection rows

Menus share the raised surface, outline, shadow, 6px inset, and rounded rows. The types menu contains three native independent checkboxes, labels, and right-aligned cached counts. The last included category is disabled to preserve at least one selection, with the explanation “Keep at least one type selected.” The type trigger takes its accessible name from the visible responsive label; an associated description enumerates the included categories. Counts use locale-aware grouping and tabular numerals. Year rows have a 1px gap. The year list uses a thin border-colored scrollbar thumb over a faint track (active mixed at 40% with transparent). The year menu highlights one current row and adds the lavender checkmark. Year menus reveal the current selection on opening. Keyboard opening focuses the selected control; arrow keys on the trigger enter the panel. Triggers use native popover targeting, so clicking the same trigger again closes its panel. Menus also close through native popover dismissal; explicit close returns focus to the trigger. Arrow keys, Home, and End move among controls; numeric and radio inputs keep their native arrow behavior. Tooltips are intentionally omitted.

### Display controls

Theme choices form a bordered inset group. Each segment is at least 28px high; the selected segment uses accent and on-accent colors, while unselected labels use muted text and tonal hover. The theme selector uses native radio inputs with one Tab stop and arrow-key selection. System follows the operating-system preference, including changes; explicit Light and Dark persist. The saved preference is applied before first paint. Browser theme color follows the resolved app theme, including saved overrides. Selected segments retain their accent fill and readable on-accent text on hover.

Switches have 38 × 22px tracks, 3px inset, and 16px circular thumbs. Enabled thumbs translate 16px and use on-accent ink. Off thumbs are white against switch-track. Switch rows have 8px horizontal inner padding and extend 8px beyond each side of the content column, keeping labels aligned while the hover surface surrounds them. Both switches include their descriptive label, semantic checked state, and programmatically associated helper description. Display rows and theme segments wrap when enlarged text needs more room; label sizes scale with the root font. Screenshot mode reveals a column stepper: a centered 48 × 32px transparent number input between two 32px buttons, inside a bordered page-colored shell. Values from 1 through 100 update immediately, using numeric input values (including scientific notation) and truncating fractions; empty or invalid text resets on blur. “Match screen” restores responsive columns. New preferences use automatic columns, while saved custom counts remain intact.

### Posters and loading

Poster links use real Simkl artwork, their existing image delivery helpers, and an accessible title. They open the corresponding Simkl item with no metadata overlay. Resting tiles have an 8px radius, three-layer elevation, and a 1px inset image edge (black at 10% in light mode, white at 10% in dark mode); hover adds an inset highlight without fading the artwork. Year and type changes update the grid immediately without poster fade transitions; tile identity follows media type and Simkl ID. Loading placeholders keep identical grid and aspect geometry on the active surface. A missing poster uses the existing image fallback rather than generated replacement art. Empty results use a compact heading and muted explanatory paragraph. Filtered empty results offer “Show all types.” First-sync failures offer inline “Retry sync”; background sync failures retain cached posters. Screenshot mode removes gaps, rounding, shadows, and the resting image edge. The hover highlight remains separate from that resting edge.

### Account

A 40px circular trigger contains a 32px avatar or initials fallback. The avatar carries the same 1px inset image edge as posters. The anchored menu wraps long names and displays a quiet PRO or VIP badge beside the name for paid accounts. The badge uses a tonal fill, muted 10px semibold uppercase text, 6px corners, and 2px vertical / 6px horizontal padding. An optional “Member since Month Year” line uses the profile join date. Free plans and missing profile details have no badge or placeholder. Invalid and future join dates are hidden. Blank names use “Simkl account”; initials preserve full Unicode graphemes and fall back to “A”. Failed avatar images use initials. These details come from the existing sign-in profile request; older sessions receive them after signing in again. Supporting links remain in the footer. Sign out sits below a divider, and pending and error copy stay within the menu.

## Do's and Don'ts

### Do:

- Do preserve the same visual hierarchy and control geometry in both themes.
- Do let actual Simkl poster artwork provide the dominant color and detail.
- Do keep selection, hover, keyboard focus, and disabled states distinguishable.
- Do retain usable targets when shortening labels on mobile.
- Do use subtle elevation to make an open menu’s relationship to its trigger clear.
- Do preserve the homepage's clear central offer, unique artwork, sparse dotted guides, and breathing room around the wordmark and footer.
- Do make homepage scene motion visible at the actual card size and provide still artwork for reduced motion.

### Don’t:

- Don’t extend the wordmark typeface to controls, add oversized dashboard headings, or decorative dashboard cards.
- Don’t turn lavender into a page wash or add glow, glass, or textured backgrounds.
- Don’t add captions or metadata overlays to the poster-only collection.
- Don’t use a prominent persistent Sign out button.
- Don’t add tooltips, poster lift or scale, or a colored poster hover border.
- Don’t reproduce generated comp artwork in the application.
- Don’t repeat homepage illustrations or add visible month, category, title, or demo labels to them.
- Don’t add a secondary Collect CTA, top-right tagline, orbit, or aligned card-row composition to the approved homepage.
