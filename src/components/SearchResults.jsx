// Base URL for TMDB poster images.
// "w185" means TMDB will serve the image at 185px wide — small enough for a grid.
const IMG_BASE = 'https://image.tmdb.org/t/p/w185'

// SearchResults receives:
//   results  — the array of movie/show objects from the TMDB search API
//   onSelect — a function to call when the user clicks a result (passes the item up to App)
export default function SearchResults({ results, onSelect }) {
  return (
    // A responsive CSS grid: 2 columns on mobile, 3 on small screens, 4 on medium+
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

      {results.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          // Border shifts to amber on hover — the accent color signals "this is clickable"
          className="bg-stone-900 border border-stone-700 hover:border-amber-400 rounded overflow-hidden text-left transition-colors"
        >
          {item.poster_path ? (
            <img
              src={`${IMG_BASE}${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full aspect-[2/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-stone-800 flex items-center justify-center text-stone-500 text-sm p-2 text-center">
              No poster
            </div>
          )}

          <div className="p-2.5">
            {/* Movies have "title", TV shows have "name" */}
            <p className="font-medium text-sm truncate">{item.title || item.name}</p>

            <p className="text-stone-500 text-xs mt-0.5">
              {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
              {(item.release_date || item.first_air_date) &&
                ` · ${(item.release_date || item.first_air_date).slice(0, 4)}`}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
