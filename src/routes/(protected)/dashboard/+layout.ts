// The dashboard's data (the cached library plus `/api/simkl/sync`) only exists in the browser, so server
// rendering could only paint an empty grid and replace it during hydration. The `(protected)` session
// gate still runs on the server in `src/hooks.server.ts`.
export const ssr = false
