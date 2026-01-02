# Agent Guidelines for Annum

This document provides coding agents with essential information about the Annum codebase structure, conventions, and workflows.

## Project Overview

Annum is a SvelteKit application that visualizes Trakt.tv watch history. It uses:
- **SvelteKit** (v5) with TypeScript
- **Vite** for bundling
- **Vitest** for testing
- **pnpm** as package manager
- **Auth.js** (@auth/sveltekit) for authentication
- **Netlify** for deployment

## Build, Test & Lint Commands

```bash
# Development
pnpm dev                 # Start dev server on port 5173
pnpm build               # Create production build
pnpm preview             # Preview production build locally

# Type Checking & Linting
pnpm check               # Run svelte-check for type errors
pnpm check:watch         # Run svelte-check in watch mode
pnpm typecheck           # Run TypeScript compiler without emitting files
pnpm lint                # Run ESLint
pnpm lint:fix             # Run ESLint with auto-fix

# Testing
pnpm test                # Run tests in watch mode
pnpm test:ci             # Run tests once (for CI)
pnpm test:coverage       # Run tests with coverage report

# Run a single test file
pnpm vitest src/lib/utils/__tests__/index.ts

# Run a single test by name pattern
pnpm vitest -t "chunks"
```

## Code Style Guidelines

### ESLint Configuration

The project uses `@antfu/eslint-config` with custom overrides:

- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes (avoid escape when necessary)
- **Semicolons**: No semicolons
- **Array Types**: Use generic syntax `Array<T>` not `T[]`

### TypeScript

- **Strict mode enabled**: All strict TypeScript checks are on
- **No `{}` or `object` types**: Use `Record<string, unknown>` instead
- **Unused variables**: Prefix with underscore `_` to indicate intentionally unused (e.g., `_variable`, `_arg`)
- **Type imports**: Use `import type` for type-only imports
- **No `any`**: Avoid using `any` type; use proper types or `unknown`

### Naming Conventions

- **Files**: Use kebab-case for files (e.g., `user-stats.ts`)
- **Components**: PascalCase for Svelte components (e.g., `Primary.svelte`)
- **Functions**: camelCase for functions (e.g., `normalizeItem`)
- **Constants**: SCREAMING_SNAKE_CASE for top-level constants (e.g., `TRAKT_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `TraktHistoryItem`)

### Imports

Order imports by:
1. Type imports (using `import type`)
2. External dependencies
3. Internal modules (using SvelteKit aliases)

Example:

```typescript
import type { Language } from '$lib/types'
import { page } from '$app/state'
import { authClient } from '$lib/auth-client'
import { normalizeItem } from '$lib/utils'

// Using these in your component
const _session = authClient.useSession()
const _items = normalizeItem(rawData)
const _lang: Language = page.data.lang
```

### SvelteKit Path Aliases

- `$lib/*` → `src/lib/*`
- `$assets` → `src/assets`
- `$const` → `src/const.ts`
- `$app/*` → SvelteKit internals (state, navigation, stores, etc.)

### Environment Variables

- All private environment variables must use `PRIVATE_` prefix (configured in `svelte.config.js`)
- Example: `PRIVATE_TRAKT_CLIENT_ID`, `PRIVATE_AUTH_SECRET`

## Function Documentation

All utility functions should include JSDoc comments with:
- Description of what the function does
- `@example` tag showing usage

Example:

```typescript
/**
 * Split an array into chunks of a given size
 * @example chunks([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
 */
export function chunks<T>(array: Array<T>, number: number | string): Array<Array<T>>
```

## Error Handling

- Use SvelteKit's `error()` helper for HTTP errors
- Include helpful error messages with context
- Log warnings to console for non-critical issues (e.g., missing TMDB IDs)

Example:
```typescript
if (!session?.user)
	error(401, 'You must sign in to access this route.')
```

## Testing Patterns

- **Test files**: Located in `__tests__/` directories alongside source files
- **Fixtures**: Store test data in `__fixtures__/` directories
- **File pattern**: `src/**/__tests__/*.ts`
- **Coverage**: Includes `src/lib/utils/*.ts` and `src/lib/actions.ts`

Test structure:

```typescript
import { describe, expect, it } from 'vitest'

describe('functionName', () => {
	it('should describe expected behavior', () => {
		const result = functionName(input)
		expect(result).toBe(expected)
	})
})
```

## Svelte 5 Patterns

- Use Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props`
- Access page store with `page` from `$app/state`
- Use `<script lang='ts'>` for TypeScript in Svelte files
- For PostCSS in styles: `<style lang='postcss'>`

## API Routes

- API routes in `src/routes/api/`
- Use `RequestHandler` type from `./$types`
- Set cache headers using `setHeaders()`
- Return responses with `json()` helper
- Check authentication from `locals.user` (populated in hooks.server.ts)

Example structure:

```typescript
export const GET: RequestHandler = async ({ locals, setHeaders }) => {
	const user = locals.user
	if (!user)
		error(401, 'You must sign in to access this route.')

	setHeaders({ ...DEFAULT_CACHE_HEADER })

	// Implementation
	const data = { userId: user.id }
	return json({ data })
}
```

## Constants

Define all constants in `src/const.ts` using:
- `as const` for literal types
- `satisfies` for type checking without widening

Example:

```typescript
export const TMDB_FETCH_DEFAULTS = {
	method: 'GET',
	headers: { 'user-agent': 'annum' },
} satisfies RequestInit
```

## Common Patterns

### Type Guards

```typescript
function _isTraktWatchedItem(item: TraktHistoryItem | TraktWatchedItem): item is TraktWatchedItem {
	const isWatched = !('type' in item)
	return isWatched
}
```

### Generic Utility Types

```typescript
type Filter<T> = MapValuesToKeysIfAllowed<T>[keyof T]
export function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
	arr: Array<T>,
	key: Key,
): Record<T[Key], Array<T>>
```

## Git & Deployment

- Deployed on Netlify (adapter: `@sveltejs/adapter-netlify`)
- Redirects configured in `_redirects` file
- Site manifest: `static/site.webmanifest`

## Additional Notes

- Use `enhancedImages()` from `@sveltejs/enhanced-img` for optimized images
- Custom media queries defined in `src/styles/custom-media-queries.css`
- CSS variables in `src/styles/variables.css`
- Reset styles in `src/styles/reset.css`
