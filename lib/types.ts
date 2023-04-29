export interface TraktStats {
  movies: {
    plays: number
    watched: number
    minutes: number
    collected: number
    ratings: number
    comments: number
  }
  shows: {
    watched: number
    collected: number
    ratings: number
    comments: number
  }
  seasons: {
    ratings: number
    comments: number
  }
  episodes: {
    plays: number
    watched: number
    minutes: number
    collected: number
    ratings: number
    comments: number
  }
  network: {
    friends: number
    followers: number
    following: number
  }
  ratings: {
    total: number
    distribution: {
      '1': number
      '2': number
      '3': number
      '4': number
      '5': number
      '6': number
      '7': number
      '8': number
      '9': number
      '10': number
    }
  }
}

export interface TraktMovie {
  plays: number
  last_watched_at: string
  last_updated_at: string
  movie: {
    title: string
    year: number
    ids: {
      trakt: number
      slug: string
      imdb: string
      tmdb: number
    }
  }
}

export interface TraktShow {
  plays: number
  last_watched_at: string
  last_updated_at: string
  reset_at: string
  show: {
    title: string
    year: number
    ids: {
      trakt: number
      slug: string
      tvdb: number
      imdb: string
      tmdb: number
    }
  }
}
