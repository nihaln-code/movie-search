export default function SearchBar({ query, setQuery, onSearch }) {

  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch(query)
  }

  function handleClear() {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="flex flex-1 gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a movie or TV show..."
          className="w-full bg-stone-900 border border-stone-700 rounded px-4 py-2.5 pr-10 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-stone-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      <button
        onClick={() => onSearch(query)}
        className="bg-amber-400 text-stone-950 hover:bg-amber-300 px-5 py-2.5 rounded font-semibold transition-colors"
      >
        Search
      </button>
    </div>
  )
}
