# annum

Display your watched movies and shows in a poster grid. Easily switch between years and get an overview of all your history.

[Show me my Poster Grid](https://www.annum.app) 🎬

## Development

This [SvelteKit](https://kit.svelte.dev/) project was bootstrapped with [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

### Prerequisites

1. [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) 18 or later
1. [Install pnpm](https://pnpm.io/installation)

### Repository setup

1. Install dependencies

    ```shell
    pnpm install
    ```

1. Create a duplicate of `.env.example` and name it `.env`

1. Retrieve the necessary secrets:

    1. `PRIVATE_TRAKT_CLIENT_ID` and `PRIVATE_TRAKT_CLIENT_SECRET`: Login to [Trakt.tv](https://trakt.tv) and inside your settings go to your [Your API Apps](https://trakt.tv/oauth/applications) section. Create a new application. Set `http://localhost:5173/auth/callback/trakt` as one of the **Redirect URI** and set `http://localhost:5173` as one of the **JavaScript (CORS) Origins**. Copy over the **Client ID** and **Client Secret** to the `.env` file.

    1. `PRIVATE_AUTH_SECRET`: Generate a random string which is used to encrypt tokens. Run `openssl rand -base64 32` in your terminal and copy the value over to the `.env` file.

    1. `PRIVATE_TMDB_API_KEY`: Login to your [TMDB](https://www.themoviedb.org/) account and inside your settings go to [API section](https://www.themoviedb.org/settings/api). Copy the **API Key** over to the `.env` file.

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
