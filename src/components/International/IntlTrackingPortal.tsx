import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Ship, FileCheck, Truck, Warehouse, ArrowRight, MapPin, Clock, Sparkles, Package, Container, FileText, ChevronDown, ChevronUp, Globe } from 'lucide-react'

// ─── Search Results Data ─────────────────────────────────────────────────────

interface SearchResult {
  id: string
  shipmentNo: string
  hbl: string
  status: string
  container: string
  origin: string
  destination: string
  eta: string
  customer: string
  milestone: string
  progress: number
}

const ALL_RESULTS: SearchResult[] = [
  { id: 'SSGNS2607829', shipmentNo: 'SSHAS2608072', hbl: 'SSGNS2607829', status: 'Dispatched', container: 'WHSU8555505', origin: 'Haiphong, VN', destination: 'Savannah, US', eta: 'Jun 13, 2026', customer: 'ADOORN LLC', milestone: 'Enroute to Deliver Load', progress: 75 },
  { id: 'SSHAS2608135', shipmentNo: 'SSHAS2608135', hbl: 'SSHAS2608135', status: 'Customs Released', container: 'XYLU8225020', origin: 'Shanghai, CN', destination: 'Los Angeles, US', eta: 'Jun 01, 2026', customer: 'THE ONLY BEAN LLC', milestone: 'Customs Released', progress: 50 },
  { id: 'SSHAS2608200', shipmentNo: 'SSHAS2608200', hbl: 'SSHAS2608200', status: 'Arrived', container: 'MSCU7234891', origin: 'Shanghai, CN', destination: 'Long Beach, US', eta: 'Jun 12, 2026', customer: 'PLEASS GLOBAL', milestone: 'Grounded / At Destination', progress: 35 },
  { id: 'HLXU2608001', shipmentNo: 'SSHAS2608099', hbl: 'HLXU2608001', status: 'Booked', container: 'HLXU3456789', origin: 'Ho Chi Minh, VN', destination: 'New York, US', eta: 'Jul 10, 2026', customer: 'ORGAIN LLC', milestone: 'Booked', progress: 10 },
  { id: 'SSHAS2608130', shipmentNo: 'SSHAS2608130', hbl: 'SSHAS2608130', status: 'Received', container: 'ONEU8472065', origin: 'Ningbo, CN', destination: 'Long Beach, US', eta: 'May 28, 2026', customer: 'VITA COCO', milestone: 'Received', progress: 100 },
]

function statusColor(status: string) {
  if (status === 'Dispatched') return 'bg-violet-100 text-violet-700'
  if (status === 'Customs Released') return 'bg-teal-100 text-teal-700'
  if (status === 'Arrived') return 'bg-indigo-100 text-indigo-700'
  if (status === 'In Transit') return 'bg-blue-100 text-blue-700'
  if (status === 'Booked') return 'bg-gray-100 text-gray-700'
  if (status === 'Received') return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-600'
}

export default function IntlTrackingPortal() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const handleSearch = () => {
    if (!query.trim()) return
    const q = query.trim().toUpperCase()
    const exactMatch = ALL_RESULTS.find(r => r.shipmentNo.toUpperCase() === q || r.hbl.toUpperCase() === q || r.id.toUpperCase() === q)
    if (exactMatch) {
      navigate(`/international/tracking2/${exactMatch.id}`)
      return
    }
    const containerMatch = ALL_RESULTS.filter(r => r.container.toUpperCase().includes(q))
    if (containerMatch.length > 0) {
      if (containerMatch.length === 1) {
        navigate(`/international/tracking2/${containerMatch[0].id}`)
        return
      }
      setResults(containerMatch)
      setHasSearched(true)
      return
    }
    setResults(ALL_RESULTS.slice(0, 3))
    setHasSearched(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ═══ Landing Page ═══ */}
      {!hasSearched && (
        <div className="pt-4 pb-8">
          {/* Info banner - notification style at top */}
          {showBanner && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <p className="flex-1 text-xs text-gray-700 leading-relaxed">
              <span className="font-semibold text-blue-700">Container No.</span> or <span className="font-semibold text-blue-700">MBL</span> may return multiple results. Unique IDs like <span className="font-semibold">Shipment No.</span>, <span className="font-semibold">HBL</span>, or <span className="font-semibold">Load#</span> navigate directly to the tracking detail page.
            </p>
            <button onClick={() => setShowBanner(false)} className="shrink-0 p-1 rounded-md hover:bg-blue-100 transition-colors text-blue-400 hover:text-blue-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          )}

          <div className="text-center">
          {/* Title + Subtitle */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Track Your Shipment Journey</h1>
          <p className="text-sm text-gray-500 mb-5">View the full journey from supplier dispatch to warehouse receiving in one unified timeline.</p>

          {/* Flow chain */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { label: 'Supplier', icon: <Package size={12} /> },
              { label: 'International Transit', icon: <Ship size={12} /> },
              { label: 'Customs', icon: <FileCheck size={12} /> },
              { label: 'Drayage', icon: <Truck size={12} /> },
              { label: 'Warehouse', icon: <Warehouse size={12} /> },
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                  <span className="text-gray-500">{step.icon}</span>
                  <span>{step.label}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight size={10} className="text-gray-300" />}
              </div>
            ))}
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative mb-10">
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:border-primary-300 focus-within:border-primary-500 focus-within:shadow-xl transition-all">
              <Search size={20} className="ml-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Enter Shipment No., HBL, MBL, Container No., BOL, Load#..."
                className="flex-1 px-4 py-4 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
              <button
                onClick={handleSearch}
                className="mr-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-1.5"
              >
                <Search size={14} />
                Track
              </button>
            </div>

            {/* Search suggestions dropdown */}
            {showSuggestions && query.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Try these examples</p>
                </div>
                {[
                  { ref: 'SSHAS2608072', type: 'Shipment No.', note: 'Direct to detail (single result)' },
                  { ref: 'SSGNS2607829', type: 'HBL', note: 'Direct to detail (single result)' },
                  { ref: '039GX40070', type: 'MBL', note: 'May return multiple shipments' },
                  { ref: 'WHSU8555505', type: 'Container No.', note: 'May return multiple shipments' },
                  { ref: 'UNIS_SAV_M012771', type: 'Load#', note: 'Direct to detail (single result)' },
                ].map((item, i) => (
                  <button key={i} onClick={() => { setQuery(item.ref); setShowSuggestions(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between transition-colors border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Search size={11} className="text-gray-300" />
                      <span className="text-sm font-medium text-gray-800">{item.ref}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.type}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{item.note}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feature cards - compact, light, narrow */}
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3 mb-10">
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 text-left flex items-start gap-2.5">
              <Globe size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">Full-Chain Visibility</p>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Track every milestone from supplier through international transit, customs, drayage, to warehouse receiving.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 text-left flex items-start gap-2.5">
              <Search size={16} className="text-violet-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">Flexible Search</p>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Search by Shipment No., HBL, MBL, Container No., BOL, or Load#.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 text-left flex items-start gap-2.5">
              <Sparkles size={16} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">Business Milestone Timeline</p>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Progress by business phase with planned, actual, and predicted dates.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 text-left flex items-start gap-2.5">
              <FileCheck size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">Complete Detail Access</p>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Containers, drayage loads, items, customs entries, and documents in one page.</p>
              </div>
            </div>
          </div>

          {/* How it works - compact */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2">
              {[
                { step: '1', text: 'Enter reference' },
                { step: '2', text: 'Select shipment' },
                { step: '3', text: 'View tracking detail' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-[9px] font-bold">{s.step}</span>
                    <span className="text-[11px] text-gray-600">{s.text}</span>
                  </div>
                  {i < 2 && <ArrowRight size={11} className="text-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Help removed - info shown as banner at top */}
          </div>
        </div>
      )}

      {/* ═══ Multiple Results Page ═══ */}
      {hasSearched && (
        <div>
          <div className="mb-6">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm">
              <Search size={16} className="ml-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Shipment No., HBL, MBL, Container No., BOL, or Load#"
                className="flex-1 px-3 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
              <button onClick={handleSearch} className="mr-2 px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">Track</button>
              <button onClick={() => { setHasSearched(false); setQuery(''); setResults([]) }} className="mr-3 text-xs text-gray-400 hover:text-gray-600">Clear</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-primary-500" />
            <p className="text-sm text-gray-600">Found <span className="font-bold text-gray-900">{results.length}</span> shipments for "<span className="font-medium text-primary-600">{query}</span>"</p>
            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium ml-1">Select one to view details</span>
          </div>

          <div className="space-y-3">
            {results.map(result => (
              <div key={result.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group" onClick={() => navigate(`/international/tracking2/${result.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-gray-900">{result.shipmentNo}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColor(result.status)}`}>{result.status}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{result.milestone}</p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><MapPin size={10} />{result.origin} → {result.destination}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />ETA: {result.eta}</span>
                      <span className="font-mono text-[10px]">{result.container}</span>
                      <span>{result.customer}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0">View Detail <ArrowRight size={12} /></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-green-500 rounded-full" style={{ width: `${result.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium w-8">{result.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
