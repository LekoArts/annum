<h1 align="center">annum</h1>

<p align="center">
  <strong>
    Visualize Your Simkl History
  </strong>
</p>

<p align="center">
  Display your watched movies, shows and anime in a poster grid. Easily switch between years and get an overview of all your history. Powered by:
</p>

<p align="center">
  <a href="https://simkl.com">Simkl</a>
</p>

<h2 align="center">
  <a href="https://www.annum.app">🍿 Website</a>
</h2>

This website was created by [LekoArts](https://www.lekoarts.de?utm_source=annum_readme) as a christmas project to try out SvelteKit. LekoArts loves watching movies and shows ⸺ so why not have a great overview?

## Development

This [SvelteKit](https://kit.svelte.dev/) project was bootstrapped with [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

### Prerequisites

1. [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) 20 or later
1. [Install pnpm](https://pnpm.io/installation)

### Repository setup

1. Install dependencies

    ```shell
    pnpm install
    ```

1. Create a duplicate of `.env.example` and name it `.env`

1. Retrieve the necessary secrets:

    1. `PUBLIC_SIMKL_CLIENT_ID`: Login to [Simkl](https://simkl.com/settings/developer/) and create a new application of type **browser sign-in + app callback**. Add `http://localhost:5173/api/auth/callback/simkl` as a registered redirect URL (Simkl requires an exact match, so a different dev port needs its own callback URL). Copy the **Client ID** over to the `.env` file. Simkl's browser sign-in apps are public clients, so there is no client secret — the app authenticates with PKCE.

    1. `PRIVATE_BETTER_AUTH_SECRET`: Generate a random string which is used to encrypt tokens. Run `openssl rand -base64 32` in your terminal and copy the value over to the `.env` file.

### Commands

Starting the development server:

```shell
pnpm dev
```

Create a production build locally:

```shell
pnpm build
```

Preview that build locally with `pnpm preview`.
