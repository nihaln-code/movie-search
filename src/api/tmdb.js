async function apiFetch(path, params = {}) {
  const url = new URL(path, window.location.origin)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function searchMedia(query) {
  return apiFetch('/api/search', { query })
}

export async function getWatchProviders(mediaType, id) {
  return apiFetch(`/api/watch-providers/${mediaType}/${id}`)
}

export async function getTrending() {
  return apiFetch('/api/trending')
}

export async function getReleaseDates(id) {
  return apiFetch(`/api/release-dates/movie/${id}`)
}
