// useState lets us store values that, when changed, cause the UI to re-render
// useEffect lets us run code in response to something changing (like the query)
import { useState, useEffect } from 'react'

// Each import below brings in one UI building block from the components folder
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import WatchProviders from './components/WatchProviders'
import RegionSelector from './components/RegionSelector'

// These are the functions that talk to the TMDB API
import { searchMedia, getTrending } from './api/tmdb'

// "export default" means this is the main thing this file provides.
// App is the root component — it owns all the shared state and passes
// pieces of it down to child components.
export default function App() {

  // query: the text currently in the search box
  const [query, setQuery] = useState('')

  // results: the array of movies/shows returned by the search API
  const [results, setResults] = useState([])

  // selectedMedia: the specific movie/show the user clicked on.
  // null means nothing is selected yet.
  const [selectedMedia, setSelectedMedia] = useState(null)

  // region: the country code used to look up streaming availability (e.g. 'US')
  const [region, setRegion] = useState('US')

  // loading: true while we're waiting for the API to respond
  const [loading, setLoading] = useState(false)

  // error: holds an error message string if something goes wrong, otherwise null
  const [error, setError] = useState(null)

  // trending: the list of popular titles fetched once when the page first loads
  const [trending, setTrending] = useState([])

  // handleSearch does the actual API call.
  // It's an async function because fetch (network requests) take time —
  // "await" pauses this function until the API responds, without freezing the page.
  async function handleSearch(searchQuery) {
    // If the input is empty or just spaces, do nothing
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    // Reset state before starting a new search
    setLoading(true)
    setError(null)
    setSelectedMedia(null)
    setResults([])

    try {
      // Call the TMDB API and wait for results
      const data = await searchMedia(searchQuery)
      setResults(data)
    } catch (err) {
      // If anything goes wrong (network error, bad API key, etc.), show a message
      setError('Search failed. Please try again.')
    } finally {
      // "finally" runs whether the try succeeded or the catch caught an error.
      // We always want to stop showing "Searching..." when the request is done.
      setLoading(false)
    }
  }

  // This effect runs once when the app first loads — the empty [] means
  // "no dependencies", so it never re-runs. It fetches trending titles to
  // populate the grid before the user has searched for anything.
  useEffect(() => {
    getTrending().then(setTrending)
  }, [])

  // This is the debounce effect.
  // useEffect runs this block every time "query" changes (see the [query] at the end).
  // Instead of searching immediately on every keystroke, we wait 500ms.
  // If the user types again before 500ms is up, we cancel the old timer and start fresh.
  useEffect(() => {
    // Schedule handleSearch to run 500ms from now
    const timer = setTimeout(() => handleSearch(query), 500)

    // This "cleanup" function runs before the effect fires again (i.e. on the next keystroke).
    // It cancels the previous timer so we don't fire stale searches.
    return () => clearTimeout(timer)
  }, [query]) // <-- only re-run this effect when "query" changes

  // Everything below is JSX — it looks like HTML but it's JavaScript.
  // React converts it into actual DOM elements in the browser.
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2">Where to Watch</h1>
          <p className="text-zinc-400 text-sm sm:text-lg">Search any movie or TV show to find where it's streaming.</p>
        </header>

        {/* On mobile: search bar stacks above region selector. On desktop: side by side. */}
        <div className="flex flex-col sm:flex-row gap-2 mb-10">
          {/* We pass query/setQuery so SearchBar can read and update the text.
              We pass onSearch so the button/Enter key can trigger an immediate search. */}
          <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

          {/* region is the selected country code. setRegion updates it when the user changes the dropdown. */}
          <RegionSelector region={region} setRegion={setRegion} />
        </div>

        {/* Conditional rendering: only show the error paragraph if error is not null */}
        {error && (
          <p className="text-red-400 mb-6">{error}</p>
        )}

        {/* Skeleton cards while a search is in flight — same shape as real cards so layout doesn't jump */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-stone-900 border border-stone-800 rounded overflow-hidden motion-safe:animate-pulse">
                <div className="w-full aspect-[2/3] bg-stone-800" />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-stone-800 rounded w-3/4" />
                  <div className="h-2 bg-stone-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!selectedMedia && (
          <>
            {/* No results: user searched something but got nothing back */}
            {query.trim() && !loading && results.length === 0 && (
              <p className="text-stone-500">No titles found for "{query}"</p>
            )}

            {/* Label: only render when there's something to label */}
            {(results.length > 0 || (!query && trending.length > 0)) && (
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
                {results.length > 0 ? 'Results' : 'Trending this week'}
              </p>
            )}

            {/* Show search results if available, trending if no query, nothing if query returned no results */}
            <SearchResults
              results={results.length > 0 ? results : (query ? [] : trending)}
              onSelect={setSelectedMedia}
            />
          </>
        )}

        {/* Show the provider detail view only when the user has clicked a result.
            onBack clears selectedMedia, which brings the results grid back. */}
        {selectedMedia && (
          <WatchProviders media={selectedMedia} region={region} onBack={() => setSelectedMedia(null)} />
        )}

      </div>
    </div>
  )
}
