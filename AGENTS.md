# Agent Guidelines for Annum

This document provides essential information for AI coding agents working on this codebase.

## Project Overview

Annum is a SvelteKit application that visualizes Trakt.tv watch history. It uses Svelte 5, TypeScript, Better Auth for authentication, and is deployed to Netlify.

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
  import type { Language, NormalizedItemResponse } from '$lib/types'
  import type { PageData } from './$types'
  ```

**Unused Variables:**
- Prefix unused variables with underscore: `_variableName` or just `_`
- Applies to function args, variables, and caught errors

### Naming Conventions

- **Files:** kebab-case for most files (e.g., `custom-media-queries.css`)
- **Components:** PascalCase for Svelte components (e.g., `Secondary.svelte`)
- **Functions:** camelCase (e.g., `normalizeItem`, `filterForYear`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `PAGINATION_LIMIT`, `TRAKT_BASE_URL`)
- **Types/Interfaces:** PascalCase (e.g., `TraktHistoryItem`, `NormalizedItemResponse`)

### Imports

**Path Aliases:**
- `$lib` → `src/lib`
- `$assets` → `src/assets`
- `$const` → `src/const.ts`
- Use these aliases consistently instead of relative paths

**Import Order:**
1. Type imports
2. External dependencies
3. Internal modules (using path aliases)
4. Relative imports

Example:
```typescript
import type { Language, TraktMediaType } from '$lib/types'
import type { RequestHandler } from './$types'
import { DEFAULT_CACHE_HEADER, PAGINATION_LIMIT } from '$const'
import { normalizeItem } from '$lib/utils'
import { error, json } from '@sveltejs/kit'
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
import { settings } from '$lib/store/settings'

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
 * Split an array into chunks of a given size
 * @example chunks([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
 */
export function chunks<T>(array: Array<T>, number: number | string): Array<Array<T>>
```

## Environment Variables

**Private Variables:** Prefix with `PRIVATE_` (configured in `svelte.config.js`)
- `PRIVATE_TRAKT_CLIENT_ID`
- `PRIVATE_TRAKT_CLIENT_SECRET`
- `PRIVATE_BETTER_AUTH_SECRET`
- `PRIVATE_TMDB_API_KEY`

**Public Variables:** Prefix with `PUBLIC_`
- `PUBLIC_BETTER_AUTH_URL`

## Common Patterns

**Type Guards:**
```typescript
function isTraktWatchedItem(item: TraktHistoryItem | TraktWatchedItem): item is TraktWatchedItem {
	return !('type' in item)
}
```

**API Responses:**
- Set cache headers with `setHeaders()`
- Return JSON with SvelteKit's `json()` helper
- Use URL search params for query parameters

**Authentication:**
- Uses Better Auth with stateless JWT sessions
- Check `locals.user` for authenticated user
- Trakt OAuth for provider authentication
