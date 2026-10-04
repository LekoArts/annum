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
typography:
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

This document captures the implemented dashboard system. Sources are `src/routes/layout.css`, the dashboard components, header, grid, and theme handling. The [surface brief](.impeccable/dashboard-brief.md) records the composition. Approved references are `dock-soft.png`, `soft-mobile-states.png`, and `soft-desktop-menus.png` under `.impeccable/mocks/decision/`.

This refresh records the current implementation and the user’s approved refinements. Earlier screenshots under `.impeccable/review/` document prior iterations and may predate the current controls. Source code is the authority for exact tokens and behavior; this document does not certify completion of the separate comp fidelity gates.

## Colors

Cool white and charcoal surfaces provide a quiet setting for varied poster colors. The frontmatter records both theme values for each semantic CSS variable; component frontmatter uses light mode as the representative variant. Runtime components resolve the same semantic variables in either theme.

### Primary

- **Muted violet / Pale lavender** (`accent-light`, `accent-dark`): selected theme segments, year checkmarks, checkbox accents, enabled switch tracks, focus outlines, caret, and selection.
- **On-accent ink**: white in light mode and deep charcoal in dark mode, used for selected segment labels and enabled switch thumbs.

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

## Typography

Self-hosted Bricolage Grotesque Variable supplies the wordmark. Inter Variable, supplied by `@fontsource-variable/inter`, serves the interface. The exact system fallback stack and observed role sizes are normative in the frontmatter. Both families are bundled locally through Fontsource; Bricolage Grotesque is available from Google Fonts.

The wordmark is compact and semibold with tight tracking. Panel headings and the current year use medium weight; menu rows and supporting copy use regular weight. Menu type labels are slightly larger than dock labels, while counts and supporting descriptions step down. Counts, years, and the column field use tabular numerals. Labels use natural sentence case. Empty-state headings use 18px medium text, with restrained centered supporting copy.

## Layout

The dashboard header and content share a maximum width of 1800px. Horizontal gutters are 12px by default, 24px from 640px, and 36px from 1024px. Desktop uses a three-part header grid (`1fr auto 1fr`) to center the collection dock independently of the wordmark and avatar. The header has 16px top / 28px bottom padding on mobile and 20px top / 40px bottom from 640px.

The poster grid uses two columns by default, three from 640px, four from 768px, five from 1024px, and six from 1536px. Its responsive gutter is the frontmatter’s grid-gap token. Poster geometry is 2:3. Screenshot mode uses the selected column count, zero gaps, and square corners; controls remain above the grid. Month headings use 18px medium text and span all columns when enabled.

Below 640px the dashboard wordmark is hidden. The type trigger names a sole selected category, uses “Types (2)” for two categories, and “Types” for all three. At 360px the filter icon and year chevron appear and the year label gains padding; below that width they yield space to the labels. At enlarged text sizes the header and dock wrap to keep every control reachable; the one-row arrangement remains the default. Dock triggers are 40px tall; year arrows have compact 32px circular hover and click targets. Menu rows are at least 44px tall and switch rows at least 48px tall.

Popovers sit 8px below their anchor, clamp to a 12px viewport margin, and scroll internally within available height. Types and account panels are 240px wide, year panels 176px, and display panels 19rem (304px at the default text size), all capped to the viewport minus 24px.

## Elevation & Depth

Tonal layering combines with thin neutral outlines and shallow ambient shadows. The capsule is subtly lifted; menus sit above their triggers. Dark mode strengthens the shadow while raising surface brightness. Exact theme-specific dock and menu shadows are captured in the sidecar from `layout.css`. Posters combine a tight contact shadow with two progressively softer offset shadows, with stronger opacity in dark mode. Screenshot mode removes all poster shadows. Hover adds a 2px inset translucent white border at 65% opacity in both themes. Posters stay stationary, artwork stays fully opaque, and resting shadows remain unchanged.

**The Shared Geometry Rule.** Change semantic colors between themes while preserving control size, position, and hierarchy.

Pointer popover entry uses a 140ms interruptible transition from a 2px upward offset and 0.98 scale, anchored to the trigger, with cubic-bezier(0.23, 1, 0.32, 1). Exit takes 90ms. Keyboard interactions are instant. Individual dock controls give pointer presses a 0.97 scale response over 120ms. Reduced motion removes popover and press transforms and switch-thumb transitions. Poster and control hover highlights are immediate. Switch track colors and thumb translation use Tailwind’s default 150ms timing; keyboard input suppresses button and segment transitions. There are no decorative gradients, glowing edges, glass effects, or background textures.

## Shapes

Full capsules group the collection controls and soften individual triggers. Menus use the menu radius; their inner rows and number fields use the row radius. Selected theme segments use the smaller segment radius. Posters use the small poster radius, except in screenshot mode. Borders and separators are one pixel. Avatars and switch thumbs are circular. The display-settings trigger is a 40px circle at every breakpoint. Menu corners use a 7px total inset (6px padding plus border) around 8px rows. Theme and column groups use 8px shells with a 3px total inset around 5px segments.

Outline icons use a 24-unit view box, rounded caps and joins, and a 1.6-unit stroke. Most icons render at 16–20px; chevrons use 14px. Independent selections use checkboxes. A single selected year uses a bare checkmark on a tonal row, with no empty checkbox shapes.

## Components

### Buttons

Primary sign-in buttons use ink over the page-colored label, full rounding, 16px horizontal padding, and a minimum height of 40px. Hover lowers opacity to 85%. Ghost dock buttons use the ink color, tonal hover/open backgrounds, and full rounding. Year navigation is muted at rest and uses ink on hover; disabled arrows use 35% opacity. Account sign-out uses a quiet menu row and 50% opacity while pending.

Every keyboard focus target receives a 2px accent outline offset by 3px; poster links increase the offset to 4px. Scrollable year rows use a 2px inset focus outline so the ring remains visible at the list edges. Do not replace focus with a color-only hover treatment.

### Collection dock

A compact bordered capsule with 3px inset contains media types, adjacent-year arrows, the year picker, and display settings. Thin vertical separators group actions. Open triggers remain tonal. Media-type and year chevrons rotate upward by 180 degrees over 150ms using the shared ease-out curve, reversing when closed. Keyboard and reduced-motion state changes are instant. The dock’s semantic group label and trigger labels preserve meaning when mobile omits icons or shortens text.

### Menus and selection rows

Menus share the raised surface, outline, shadow, 6px inset, and rounded rows. The types menu contains three native independent checkboxes, labels, and right-aligned cached counts. The last included category is disabled to preserve at least one selection, with the explanation “Keep at least one type selected.” The type trigger’s accessible name enumerates the included categories. Counts use locale-aware grouping and tabular numerals. Year rows have a 1px gap. The year list uses a thin border-colored scrollbar thumb over a faint track (active mixed at 40% with transparent). The year menu highlights one current row and adds the lavender checkmark. Year menus reveal the current selection on opening. Keyboard opening focuses the selected control; arrow keys on the trigger enter the panel. Triggers use native popover targeting, so clicking the same trigger again closes its panel. Menus also close through native popover dismissal; explicit close returns focus to the trigger. Arrow keys, Home, and End move among controls; numeric and radio inputs keep their native arrow behavior. Tooltips are intentionally omitted.

### Display controls

Theme choices form a bordered inset group. Each segment is at least 28px high; the selected segment uses accent and on-accent colors, while unselected labels use muted text and tonal hover. The theme selector uses native radio inputs with one Tab stop and arrow-key selection. System follows the operating-system preference, including changes; explicit Light and Dark persist. The saved preference is applied before first paint. Browser theme color follows the resolved app theme, including saved overrides. Selected segments retain their accent fill and readable on-accent text on hover.

Switches have 38 × 22px tracks, 3px inset, and 16px circular thumbs. Enabled thumbs translate 16px and use on-accent ink. Off thumbs are white against switch-track. Switch rows have 8px horizontal inner padding and extend 8px beyond each side of the content column, keeping labels aligned while the hover surface surrounds them. Both switches include their descriptive label and semantic checked state. Display rows and theme segments wrap when enlarged text needs more room; label sizes scale with the root font. Screenshot mode reveals a column stepper: a centered 48 × 32px transparent number input between two 32px buttons, inside a bordered page-colored shell. Values from 1 through 100 update immediately, using numeric input values (including scientific notation) and truncating fractions; empty or invalid text resets on blur. “Match screen” restores responsive columns. New preferences use automatic columns, while saved custom counts remain intact.

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

### Don’t:

- Don’t extend the wordmark typeface to controls, add oversized dashboard headings, or decorative dashboard cards.
- Don’t turn lavender into a page wash or add glow, glass, or textured backgrounds.
- Don’t add captions or metadata overlays to the poster-only collection.
- Don’t use a prominent persistent Sign out button.
- Don’t add tooltips, poster lift or scale, or a colored poster hover border.
- Don’t reproduce generated comp artwork in the application.
