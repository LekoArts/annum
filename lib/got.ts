import type { Got } from 'got'
import got from 'got'
import { TRAKT_BASE_URL } from './constants'

export function traktGotInstance({ traktClientId }: { traktClientId: string }): Got {
  return got.extend({
    prefixUrl: TRAKT_BASE_URL,
    method: 'GET',
    headers: {
      'user-agent': 'trakt-yearly-posters',
      'Content-type': 'application/json',
      'trakt-api-key': traktClientId,
      'trakt-api-version': '2',
    },
  })
}

export function tmdbGotInstance({ apiKey, sessionId, language }: { apiKey: string; sessionId: string; language: string }): Got {
  return got.extend({
    method: 'GET',
    headers: {
      'user-agent': 'trakt-yearly-posters',
    },
    searchParams: {
      api_key: apiKey,
      session_id: sessionId,
      language,
    },
  })
}
