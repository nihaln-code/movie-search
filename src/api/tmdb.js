// Read the API key from the .env file.
// Vite exposes env variables via import.meta.env — any variable starting
// with VITE_ is accessible here. The key itself never appears in this source file.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// The root URL for all TMDB API requests
const BASE_URL = 'https://api.themoviedb.org/3'

// apiFetch is a private helper — it's not exported, so only this file uses it.
// It builds the full URL, attaches the API key, makes the request, and returns JSON.
// "params = {}" means if no extra params are passed, it defaults to an empty object.
async function apiFetch(path, params = {}) {
  // URL is a built-in browser class that helps safely construct URLs
  const url = new URL(`${BASE_URL}${path}`)

  // Attach our API key to the URL as a query parameter: ?api_key=...
  url.searchParams.set('api_key', API_KEY)

  // Attach any additional parameters (e.g. { query: 'inception' } becomes &query=inception)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  // fetch() sends the HTTP request. We await it because it's asynchronous.
  const res = await fetch(url)

  // If the server returned an error status (like 401 Unauthorized or 404 Not Found),
  // throw an error so the caller can handle it in a catch block.
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)

  // Parse the response body as JSON and return it
  return res.json()
}

// Searches for movies AND TV shows in one request using TMDB's "multi" search endpoint.
// "export" means this function can be imported and used in other files.
export async function searchMedia(query) {
  const data = await apiFetch('/search/multi', { query, include_adult: false })

  // TMDB's multi-search also returns people (actors, directors).
  // We filter those out — we only want movies and TV shows.
  return data.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv')
}

// Fetches the streaming/rent/buy options for a specific title.
// mediaType is either 'movie' or 'tv', and id is TMDB's unique ID for that title.
export async function getWatchProviders(mediaType, id) {
  return apiFetch(`/${mediaType}/${id}/watch/providers`)
}

// Fetches the most popular movies and TV shows across the past week.
// We use "all" to get both movies and TV shows in one request.
export async function getTrending() {
  const data = await apiFetch('/trending/all/week')
  return data.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv')
}
