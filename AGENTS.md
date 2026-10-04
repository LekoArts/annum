# Agent Guidelines for Annum

Annum is a SvelteKit 3 app (Svelte 5 runes, TypeScript, Tailwind v4, Better Auth) that renders Simkl watch history, deployed to Netlify. README.md explains the stack, the OAuth flow, the sync/cache design and the pages — read it before touching auth, sync or the dashboard.

## Commands

pnpm dev / build / preview

pnpm test:ci (vitest + happy-dom over src/**/__tests__/*.ts; pnpm test to watch, pnpm vitest run <file> for one file), pnpm check (svelte-check), pnpm typecheck, pnpm lint (lint:fix).

Done means pnpm test:ci && pnpm check && pnpm typecheck && pnpm lint && pnpm build all pass.

## Rules

- Read-only Simkl client: never call a write endpoint, never call /users/{id}/stats. Counts come from the cached library (src/lib/store/library.ts), never from an API.
- Sync is event-driven, never polled: automatic checks are throttled by SYNC_INTERVAL_MS, claimed through navigator.locks('annum-sync') across tabs, and always bypassable with sync({ force: true }). The cache is scoped to the claimed Simkl account id — never render it before the claim matches, and clear it on sign-out.
- src/hooks.server.ts gates (protected). The dashboard subtree is client-rendered (ssr = false) because its data lives in the browser.
- /dashboard is the whole subtree: one mixed poster grid, browsing state in the query string, canonicalized by src/lib/utils/dashboard.ts. The old /dashboard/{type}/{year} URLs are gone and stay gone — no redirects.
- Pure logic belongs in src/lib/utils/*.ts, covered by src/**/__tests__/*.ts. Change it with tests.
- Simkl URLs (posters, item links) go through src/lib/utils/simkl.ts; every tile links to its Simkl page.
- Env vars are declared in src/env.ts and documented in .env.example.

## Style

- Tabs, single quotes, no semicolons, strict TS (@antfu/eslint-config).
- Imports: #lib/* and #const subpath imports, never relative across modules; order type, internal, external, relative; import type for types.
- interface for object shapes, Array<T> over T[], explicit parameter/return types, Record<string, unknown> over {}, no wrapper object types.
- Naming: kebab-case files, PascalCase components/types, camelCase functions, SCREAMING_SNAKE_CASE constants.
- Svelte 5: $props(), $state, $derived, $effect; stores from #lib/store/* accessed with $.
- Tailwind utilities inline, no component style layer; geometry shared between components travels as CSS variables (--gap, --columns in src/lib/grid/Grid.svelte).
- error() for SvelteKit errors, Response.json() for JSON (json() is deprecated), console.warn() with context for non-fatal issues.
- Comments: one line, explain why, never narrate the design.
