// A static list of regions we support.
// Each object has a "code" (what we send to TMDB) and a "label" (what the user sees).
const REGIONS = [
  { code: 'US', label: '🇺🇸 USA' },
  { code: 'GB', label: '🇬🇧 UK' },
  { code: 'CA', label: '🇨🇦 Canada' },
  { code: 'AU', label: '🇦🇺 Australia' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'JP', label: '🇯🇵 Japan' },
  { code: 'BR', label: '🇧🇷 Brazil' },
  { code: 'MX', label: '🇲🇽 Mexico' },
]

// RegionSelector receives:
//   region    — the currently selected country code (e.g. 'US')
//   setRegion — a function to update it in App when the user picks a different country
export default function RegionSelector({ region, setRegion }) {
  return (
    <select
      value={region}
      onChange={e => setRegion(e.target.value)}
      className="w-full sm:w-auto bg-stone-900 border border-stone-700 rounded px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
    >
      {REGIONS.map(r => (
        <option key={r.code} value={r.code}>{r.label}</option>
      ))}
    </select>
  )
}
