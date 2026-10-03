# Agent Guidelines for Annum

This document provides essential information for AI coding agents working on this codebase.

## Project Overview

Annum is a SvelteKit application that visualizes Simkl watch history. It uses Svelte 5, TypeScript, Better Auth for authentication, and is deployed to Netlify.

## Simkl Integration

Annum is a read-only Simkl client. It never calls a Simkl write endpoint and never calls `/users/{user_id}/stats` (Simkl documents that call as the most expensive and unsuitable for app launch).

- **Auth:** Better Auth `genericOAuth` with provider id `simkl`. AUTH V2 authorization code + mandatory PKCE `S256`, **no client secret** (browser sign-in app), scope `media:read`, `issuer: https://simkl.com` with issuer validation. Tokens live in Better Auth's stateless account cookie; server code reads them with `auth.api.getAccessToken({ body: { providerId: 'simkl' }, headers })`. Access tokens last 7 days, refresh tokens 180 days.
- **Sync (two-phase, exactly as Simkl documents it):** first sync pulls `/sync/all-items` for movies, shows, then anime **sequentially**, then fetches `/sync/activities` once to save the bootstrap `activities.all`. Every later sync calls `/sync/activities` first and stops if `activities.all` is unchanged; otherwise it fetches a single multi-type `/sync/all-items?date_from=<saved activities.all>` delta and **merges** it (never replaces the library). Deletions never appear in a delta — when a domain's `removed_from_list` moves, the endpoint refetches `extended=simkl_ids_only` and diffs ids in `currentIds`.
- **API rules:** every request carries `client_id`, `app-name`, `app-version` query params and a `User-Agent`; user-data calls add `Authorization: Bearer <token>`. Limits are 10 GET/s. Retry per-second `rate_limit` 429s and transient 5xx with exponential backoff (max 5 attempts, 60 s cap); **never** retry a daily-quota 429 (`user_limit_exceeded` / `app_limit_exceeded`) or a `412`.
- **Media types:** `movies` | `shows` | `anime` (`SIMKL_MEDIA_TYPES`). Anime is a first-class third category, matching Simkl's separate catalog. In `/sync/all-items` entries movies carry a `movie` block while shows **and anime** carry `show` (anime adds a sibling `anime_type`); read ids as `simkl_id ?? simkl`.
- **Library cache:** the normalized library plus the last `activities` snapshot live in one `localStorage` key (`annum-simkl-library`) via `src/lib/store/library.ts`. It is deliberately small (ids/title/year/poster + one watch entry per year), so no IndexedDB fallback is needed. Year grids filter this cache locally — there is no per-year API call and no infinite loading.
- **Shows/anime placement:** shows and anime appear in every year in which they have episode watch activity, derived from per-episode `watched_at` (`extended=full&episode_watched_at=yes&include_all_episodes=yes`). Movies are atomic and appear only in the year of their latest watch. Timestamps before `2000-01-01` are Simkl's "watched, date unknown" placeholder and are dropped, so header counts can exceed the sum of the year grids.
- **Images and attribution:** posters come from Simkl. Build them with `simklPosterUrl()` (`https://wsrv.nl/?url=https://simkl.in/posters/{poster}_m.webp&q=90`, falling back to `https://simkl.in/poster_no_pic.png`). Simkl requires visible attribution, so every grid tile is an external link to its Simkl item page via `simklItemUrl()` (`https://simkl.com/{movies|tv|anime}/{id}/{slug}`).
- **Stats:** counts shown in the dashboard and header are **derived from the cached library**, never from a stats endpoint.
- **Pure logic:** normalization, merging, and year projection live in `src/lib/utils/simkl.ts` and are unit tested in `src/lib/utils/__tests__/simkl.ts`. Change them with tests.

## Build & Development Commands

### Development
```bash
pnpm dev                # Start development server
pnpm preview            # Preview production build locally
```

### Building
```bash
pnpm build              # Create production build
```

### Code Quality
```bash
pnpm check              # Run svelte-check for type checking
pnpm check:watch        # Run svelte-check in watch mode
pnpm lint               # Run ESLint
pnpm lint:fix            # Run ESLint with auto-fix
pnpm typecheck          # Run TypeScript type checking
```

### Testing
```bash
pnpm test               # Run tests in watch mode
pnpm test:ci            # Run tests once (CI mode)
pnpm test:coverage      # Run tests with coverage report

# Run a single test file
pnpm vitest run src/lib/utils/__tests__/index.ts

# Run a single test file in watch mode
pnpm vitest watch src/lib/utils/__tests__/index.ts
```

**Test Configuration:**
- Test files: `src/**/__tests__/*.ts`
- Coverage includes: `src/lib/utils/*.ts` and `src/lib/actions.ts`
- Test environment: happy-dom
- Framework: vitest

## Code Style Guidelines

### General Formatting

**ESLint Config:** Uses `@antfu/eslint-config` with customizations

- **Indentation:** Tabs (not spaces)
- **Quotes:** Single quotes (use `avoidEscape: true` for strings with single quotes)
- **Semicolons:** No semicolons
- **Line breaks:** LF (Unix-style)

### TypeScript

**Strict mode enabled** - All TypeScript strict checks are enforced

**Type Definitions:**
- Use explicit type annotations for function parameters and return types
- Prefer `interface` over `type` for object shapes (allows `with-single-extends`)
- Use `Array<T>` generic syntax instead of `T[]`
- Never use `{}` or `object` - use `Record<string, unknown>` instead
- No wrapper object types (`String`, `Number`, etc.)

**Type Imports:**
- Always use `type` keyword for type-only imports:
  ```typescript
  import type { Language, NormalizedItemResponse } from '#lib/types.js'
  import type { PageData } from './$types'
  ```

**Unused Variables:**
- Prefix unused variables with underscore: `_variableName` or just `_`
- Applies to function args, variables, and caught errors

### Naming Conventions

- **Files:** kebab-case for most files (e.g., `custom-media-queries.css`)
- **Components:** PascalCase for Svelte components (e.g., `Secondary.svelte`)
- **Functions:** camelCase (e.g., `normalizeSimklItem`, `mergeSyncResponse`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `SIMKL_MEDIA_TYPES`, `SIMKL_API_BASE_URL`)
- **Types/Interfaces:** PascalCase (e.g., `SimklMediaItem`, `SimklLibrary`)

### Imports

**Subpath Imports:**
The former `$lib`/`$const` aliases are replaced by Node subpath imports, defined under `"imports"` in `package.json`:
- `#lib/*` → `src/lib/*` (include the file extension, e.g. `#lib/types.js`, `#lib/Meta.svelte`)
- `#const` → `src/const.ts`
- Use these consistently instead of relative paths

**Import Order:**
1. Type imports
2. Internal modules (using subpath imports)
3. External dependencies
4. Relative imports

Example:
```typescript
import type { SimklLibrary, SimklMediaItem } from '#lib/types.js'
import type { RequestHandler } from './$types'
import { SIMKL_MEDIA_TYPES } from '#lib/utils/simkl.js'
import { groupBy } from '#lib/utils/index.js'
import { error } from '@sveltejs/kit'
```

### Svelte 5 Conventions

**Props:**
```typescript
interface Props {
	data: PageData
}

let { data }: Props = $props()
```

**Reactivity:**
- Use `$state` for reactive variables
- Use `$derived` for computed values
- Use `$effect` for side effects

**Store Usage:**
```typescript
import { settings } from '#lib/store/settings.js'

// Access with $
$settings.hue
settings.set({ ...$settings, hue: 240 })
```

### CSS/Styling

**PostCSS:** Uses `postcss-preset-env` with custom media queries

**Custom Media Queries:**
- `--sm` (min-width: 640px)
- `--md` (min-width: 768px)
- `--lg` (min-width: 1024px)
- `--xl` (min-width: 1350px)

**Usage:**
```css
.element {
  display: block;

  @media (--md) {
    display: flex;
  }
}
```

**CSS Variables:** Project uses extensive CSS custom properties defined in `src/styles/variables.css`

### Error Handling

**Server Routes:**
```typescript
// Use SvelteKit's error helper
if (!user)
	error(401, 'You must sign in to access this route.')

// Try-catch for async operations
try {
	const res = await fetch(url)
	if (!res.ok)
		throw new Error(`Response not OK: ${res.status}`)
	// ... handle response
}
catch (e) {
	error(404, `Failed to fetch data. ${e}`)
}
```

**Logging:**
- Use `console.warn()` for non-fatal issues
- Include context in log messages (IDs, types, titles)

### Documentation

**JSDoc Comments:**
- Add JSDoc for utility functions
- Include `@example` usage examples
- Document parameters and return types

Example:
```typescript
/**
 * Group array elements by the given key
 * @example groupBy([{ id: 1, name: 'John' }], 'name') => { John: [{ id: 1, name: 'John' }] }
 */
export function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(arr: Array<T>, key: Key): Record<T[Key], Array<T>>
```

## Environment Variables

Declared in `src/env.ts` via `defineEnvVars`. Private variables (server-only) are imported from `$app/env/private`; public ones from `$app/env/public`. Add new variables to both `src/env.ts` and `.env.example`.

**Private Variables:**
- `PRIVATE_BETTER_AUTH_SECRET`

**Public Variables:**
- `PUBLIC_BETTER_AUTH_URL`
- `PUBLIC_SIMKL_CLIENT_ID`

## Common Patterns

**Type Guards:**
```typescript
function isSimklMediaType(value: string): value is SimklMediaType {
	return (SIMKL_MEDIA_TYPES as ReadonlyArray<string>).includes(value)
}
```

**API Responses:**
- Set cache headers with `setHeaders()`
- Return JSON with `Response.json()` (the `json()` helper from `@sveltejs/kit` is deprecated)
- Use URL search params for query parameters

**Authentication:**
- Uses Better Auth with stateless JWT sessions
- Check `locals.user` for authenticated user
- Simkl OAuth (AUTH V2, authorization code + PKCE `S256`, no client secret) for provider authentication
- Server routes that need the Simkl token call `getSimklAccessToken(event)` from `#lib/server/simkl.js`
