import z from 'zod'

const envSchema = z.object({
  TRAKT_CLIENT_ID: z.string(),
  TMDB_API_KEY: z.string(),
  TMDB_SESSION_ID: z.string(),
  TRAKT_USERNAME: z.string(),
  TMDB_LANGUAGE: z.string(),
})

export const ENV = envSchema.parse(process.env)
