// SearchBar receives three things from App.jsx:
//   query     — the current text in the input (controlled by App)
//   setQuery  — a function to update that text
//   onSearch  — a function to trigger an immediate search (used by button + Enter key)
export default function SearchBar({ query, setQuery, onSearch }) {

  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch(query)
  }

  return (
    <div className="flex flex-1 gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a movie or TV show..."
        className="flex-1 bg-stone-900 border border-stone-700 rounded px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
      />
      {/* Clicking the button also triggers an immediate search, bypassing the 500ms debounce */}
      <button
        onClick={() => onSearch(query)}
        className="bg-amber-400 text-stone-950 hover:bg-amber-300 px-5 py-2.5 rounded font-semibold transition-colors"
      >
        Search
      </button>
    </div>
  )
}
