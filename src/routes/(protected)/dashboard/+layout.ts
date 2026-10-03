/**
 * The dashboard is a client-side app: its data is the Simkl library cached in `localStorage` plus the
 * sync against `/api/simkl/sync`, neither of which the server can reach. Server rendering those routes
 * could only ever paint the empty state - zero counts, an empty grid - and then replace it during
 * hydration.
 *
 * So the subtree renders on the client. The session gate for `(protected)` still runs on the server in
 * `src/hooks.server.ts`, and SvelteKit keeps the route's styles and font preloads in the served HTML
 * (see the `ssr: false` branch of `render_response`), so this does not cause a flash of unstyled content.
 */
export const ssr = false
