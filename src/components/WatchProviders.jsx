import { useEffect, useState } from 'react'
import { getWatchProviders, getReleaseDates } from '../api/tmdb'

// TMDB image base URLs — the number in the path is the image width in pixels
const IMG_BASE = 'https://image.tmdb.org/t/p/w92'    // Small: for provider logos
const POSTER_BASE = 'https://image.tmdb.org/t/p/w342' // Medium: for the movie poster

// WatchProviders receives:
//   media   — the full movie/show object the user selected
//   region  — the country code to look up streaming availability for (e.g. 'US')
//   onBack  — a function to call when the user clicks "Back to results"
export default function WatchProviders({ media, region, onBack }) {

  // providers: the streaming data for the selected region, or null if unavailable
  const [providers, setProviders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inTheatres, setInTheatres] = useState(false)

  // This effect fetches watch providers whenever the selected movie OR the region changes.
  // If providers come back empty for a movie, it also checks whether the movie is
  // currently in theatres using TMDB release date type codes:
  //   type 3 = theatrical release, type 4 = digital release
  useEffect(() => {
    setLoading(true)
    setError(null)
    setInTheatres(false)

    async function load() {
      try {
        const data = await getWatchProviders(media.media_type, media.id)
        const regionProviders = data.results?.[region] ?? null
        setProviders(regionProviders)

        // Only run the theatrical check for movies with no streaming providers
        if (!regionProviders && media.media_type === 'movie') {
          const releaseData = await getReleaseDates(media.id)

          // Try the selected region first, fall back to US
          const dates =
            releaseData.results?.find(r => r.iso_3166_1 === region)?.release_dates ??
            releaseData.results?.find(r => r.iso_3166_1 === 'US')?.release_dates ??
            []

          const theatrical = dates.find(d => d.type === 3)
          const hasDigital = dates.some(d => d.type === 4)

          // "Recent" = theatrical release was within the last 90 days
          const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000
          const isRecent = theatrical &&
            Date.now() - new Date(theatrical.release_date).getTime() < NINETY_DAYS

          setInTheatres(!!theatrical && !hasDigital && !!isRecent)
        }
      } catch {
        setError('Could not load provider data')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [media, region]) // Re-run when media or region changes

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-stone-500 hover:text-amber-400 mb-10 text-sm transition-colors cursor-pointer px-1 py-1 -mx-1"
      >
        ← Back to results
      </button>

      {/* Movie/show header: stacks vertically on mobile, side by side on desktop */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10">
        {media.poster_path && (
          <img
            src={`${POSTER_BASE}${media.poster_path}`}
            alt={media.title || media.name}
            className="w-36 sm:w-28 rounded flex-shrink-0"
          />
        )}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{media.title || media.name}</h2>
          <p className="text-stone-500 text-sm mt-1">
            {media.media_type === 'movie' ? 'Movie' : 'TV Show'}
            {(media.release_date || media.first_air_date) &&
              ` · ${(media.release_date || media.first_air_date).slice(0, 4)}`}
          </p>
          {media.overview && (
            <p className="text-stone-400 text-sm mt-3 max-w-xl line-clamp-3 leading-relaxed">{media.overview}</p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-800 mb-8" />

      {loading && <p className="text-stone-500 text-sm">Loading providers...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && !providers && (
        inTheatres ? (
          <div className="flex items-center gap-2 text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
            <div>
              <p className="text-sm font-semibold">Now in Theatres</p>
              <p className="text-xs text-stone-500 mt-0.5">Not yet available for streaming — check back soon.</p>
            </div>
          </div>
        ) : (
          <p className="text-stone-500 text-sm">Not available for streaming in this region.</p>
        )
      )}

      {providers && (
        <div className="space-y-8">
          {/* "flatrate" is TMDB's term for subscription streaming (Netflix, Disney+, etc.) */}
          <ProviderSection title="Stream" providers={providers.flatrate} />
          <ProviderSection title="Rent" providers={providers.rent} />
          <ProviderSection title="Buy" providers={providers.buy} />

          {providers.link && (
            <a
              href={providers.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-amber-400 hover:text-amber-300 text-sm transition-colors"
            >
              Full details on JustWatch →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ProviderSection renders a labelled row of provider logos.
function ProviderSection({ title, providers }) {
  if (!providers?.length) return null

  return (
    <div>
      {/* Amber label — the accent color signals category hierarchy without being loud */}
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">{title}</p>
      <div className="flex flex-wrap gap-4">
        {providers.map(p => (
          <div key={p.provider_id} className="flex flex-col items-center gap-1.5 w-14">
            <img
              src={`${IMG_BASE}${p.logo_path}`}
              alt={p.provider_name}
              title={p.provider_name}
              className="w-12 h-12 rounded-lg"
            />
            <span className="text-xs text-stone-500 text-center leading-tight">{p.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
