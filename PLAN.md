# Auth.js to BetterAuth Migration

## Status: ✅ COMPLETED

Successfully migrated from Auth.js to BetterAuth for authentication.

## What Was Done

### 1. Package Installation
- ✅ Removed `@auth/core` and `@auth/sveltekit`
- ✅ Installed `better-auth` (v1.4.10)

### 2. Server Configuration (`src/auth.ts`)
- ✅ Created BetterAuth instance with stateless JWT mode (no database required)
- ✅ Configured custom Trakt OAuth provider using `genericOAuth` plugin
- ✅ Implemented `customSession` plugin to add username field to session
- ✅ Configured cookie-based session with JWE encryption (7-day expiration)
- ✅ Enabled account linking with `allowDifferentEmails: true` (required for Trakt which doesn't provide emails)

### 3. Hooks and Middleware (`src/hooks.server.ts`)
- ✅ Replaced Auth.js handler with BetterAuth `svelteKitHandler`
- ✅ Populated `event.locals.session` and `event.locals.user` for server-side access
- ✅ Maintained route protection for `/dashboard/*` routes

### 4. Type Definitions (`src/app.d.ts`)
- ✅ Updated `App.Locals` to include BetterAuth session and user
- ✅ Updated `App.PageData` to include custom user type with username field

### 5. Client-Side Updates
- ✅ Created auth client in `src/lib/auth-client.ts` with Svelte bindings
- ✅ Updated `Header.svelte` to use `authClient.signIn.oauth2()` and `authClient.signOut()`
- ✅ Updated `+page.svelte` to use new auth client methods

### 6. Server-Side Updates
- ✅ Updated `+layout.server.ts` to use `locals.user` and `locals.session`
- ✅ Updated `dashboard/+layout.server.ts` to use `locals.user`
- ✅ Updated all API routes to use `locals.user` instead of `locals.auth()`
  - `/api/user-stats/[id]`
  - `/api/tmdb-image`
  - `/api/history/[type]`
  - `/api/watched/[type]`

### 7. Environment Variables
- ✅ Removed `NEXTAUTH_URL` (no longer needed)
- ✅ Kept `PRIVATE_AUTH_SECRET` (used by BetterAuth)

### 8. Documentation
- ✅ Updated `AGENTS.md` with new auth patterns
- ✅ All TypeScript checks passing
- ✅ All ESLint checks passing

## Key Differences from Auth.js

1. **Stateless Mode**: BetterAuth runs without a database using JWE-encrypted cookies
2. **Custom OAuth**: Used `genericOAuth` plugin for Trakt (not a built-in provider)
3. **Email Handling**: Trakt doesn't provide emails, so we use `username` as email with `allowDifferentEmails: true`
4. **Session Access**: Session is pre-populated in `locals` by hooks, no need to call `auth()` in routes
5. **Username Field**: Added via `customSession` plugin since BetterAuth doesn't have it by default

## Testing Checklist

Before deploying, test the following:
- [ ] Sign in with Trakt OAuth
- [ ] Sign out and redirect to homepage
- [ ] Protected routes redirect unauthenticated users to `/sign-in`
- [ ] Session persists across page refreshes
- [ ] User stats and history load correctly
- [ ] TMDB images fetch correctly

## References

- BetterAuth Installation: https://www.better-auth.com/docs/installation
- SvelteKit Integration: https://www.better-auth.com/docs/integrations/svelte-kit
- Generic OAuth Plugin: https://www.better-auth.com/docs/plugins/generic-oauth
- Stateless Sessions: https://www.better-auth.com/docs/concepts/session-management#stateless-session-management
- Trakt OAuth Issue: https://github.com/better-auth/better-auth/issues/1479
