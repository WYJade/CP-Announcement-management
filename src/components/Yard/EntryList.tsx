import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, CheckCircle2, MapPin,
  Search, X, RefreshCw, Eye, AlertCircle, Info, Camera,
  ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon,
  Clock, Truck, User,
} from 'lucide-react'
import {
  MOCK_ENTRIES, STATUS_STYLE, PLACEHOLDER_DARK, PLACEHOLDER_CAM,
  CUSTOMERS, FACILITIES, ENTRY_TYPES, ALL_STATUSES,
  type EntryRecord, type EntryStatus, type Photo, type AnomalyType,
} from './entryData'

// ─── Photo Lightbox ───────────────────────────────────────────────────────────
function PhotoLightbox({ photos, startIndex, onClose }: {
  photos: Photo[]
  startIndex: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const current = photos[idx]

  return (
    <div className="fixed inset-0 bg-black/85 z-[9999] flex flex-col" onClick={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <Camera size={16} className="text-white/70" />
          <span className="text-white font-medium text-sm">{current.label}</span>
          <span className="text-white/50 text-xs">{idx + 1} / {photos.length}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center relative px-16" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)}
          className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="max-w-4xl w-full">
          <img
            src={current.url}
            alt={current.label}
            className="w-full rounded-xl object-contain max-h-[60vh]"
            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_CAM }}
          />
          {current.type === 'camera' && (
            <div className="mt-2 flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-white/50">Camera Feed · {new Date().toLocaleString()}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIdx(i => (i + 1) % photos.length)}
          className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 px-6 py-4 overflow-x-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 w-max mx-auto">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIdx(i)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? 'border-primary-500 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'}`}
            >
              <img src={p.url} alt={p.label} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_DARK }} />
              {p.type === 'camera' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Camera size={10} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Photo Gallery (inline in detail panel / card) ───────────────────────────
function PhotoGallery({ photos, maxVisible = 8 }: { photos: Photo[]; maxVisible?: number }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (photos.length === 0) return (
    <div className="flex items-center gap-2 text-gray-300 text-xs py-2">
      <ImageIcon size={14} /> No photos available
    </div>
  )

  const visible = photos.slice(0, maxVisible)
  const extra   = photos.length - maxVisible

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {visible.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setLightboxIdx(i)}
            className="relative w-14 h-12 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 hover:scale-105 transition-all group shrink-0"
          >
            <img src={p.url} alt={p.label} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_DARK }} />
            {p.type === 'camera' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn size={14} className="text-white" />
            </div>
          </button>
        ))}
        {extra > 0 && (
          <button
            onClick={() => setLightboxIdx(maxVisible)}
            className="w-14 h-12 rounded-lg border border-dashed border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-primary-50 flex flex-col items-center justify-center text-gray-400 hover:text-primary-600 transition-all shrink-0"
          >
            <span className="text-xs font-semibold">+{extra}</span>
            <span className="text-[9px]">more</span>
          </button>
        )}
      </div>
      {/* Labels below */}
      <div className="flex items-center gap-2 flex-wrap mt-1">
        {visible.map(p => (
          <span key={p.id} className="w-14 text-center text-[9px] text-gray-400 truncate shrink-0">{p.label}</span>
        ))}
      </div>

      {lightboxIdx !== null && (
        <PhotoLightbox photos={photos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}

// ─── Mismatch Modal ───────────────────────────────────────────────────────────
function MismatchModal({ entry, onClose }: { entry: EntryRecord; onClose: () => void }) {
  if (!entry.mismatch) return null
  const { byCarrier, byGate } = entry.mismatch
  const fields = ['Name', 'Phone', 'License', 'Carrier', 'MC/DOT']
  const cv = [byCarrier.name, byCarrier.phone, byCarrier.license, byCarrier.carrier, byCarrier.mcdot]
  const gv = [byGate.name, byGate.phone, byGate.license, byGate.carrier, byGate.mcdot]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={17} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Driver Information Mismatch</p>
            <p className="text-xs text-gray-500">Entry {entry.entryId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={14} /></button>
        </div>
        <div className="px-6 py-4">
          <p className="text-xs text-gray-500 mb-4">Carrier-submitted driver info does not match gate check-in record. Mismatched fields highlighted in red.</p>
          <div className="grid grid-cols-3 border border-gray-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-500">Field</div>
            <div className="bg-blue-50 px-3 py-2 font-semibold text-blue-700 border-l border-gray-200">By Carrier</div>
            <div className="bg-red-50 px-3 py-2 font-semibold text-red-700 border-l border-gray-200">By Gate</div>
            {fields.map((f, i) => {
              const diff = cv[i] !== gv[i]
              return [
                <div key={`f${i}`} className={`px-3 py-2.5 text-gray-600 border-t border-gray-100 ${diff?'bg-red-50/20':''}`}>{f}</div>,
                <div key={`c${i}`} className={`px-3 py-2.5 border-t border-l border-gray-100 ${diff?'text-red-600 font-semibold bg-red-50/30':'text-gray-700'}`}>{cv[i]||'–'}</div>,
                <div key={`g${i}`} className={`px-3 py-2.5 border-t border-l border-gray-100 ${diff?'text-red-600 font-semibold bg-red-50/30':'text-gray-700'}`}>{gv[i]||'–'}</div>,
              ]
            })}
          </div>
        </div>
        <div className="flex justify-end px-6 pb-5">
          <button onClick={onClose} className="px-5 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium">OK</button>
        </div>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EntryStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

// ─── Inline Photo Strip (always visible at bottom of card) ───────────────────
function InlinePhotoStrip({ photos }: { photos: Photo[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const MAX_VISIBLE = 8
  const visible = photos.slice(0, MAX_VISIBLE)
  const extra   = photos.length - MAX_VISIBLE

  return (
    <>
      <div className="flex items-end gap-3 overflow-x-auto pb-0.5">
        {visible.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => setLightboxIdx(i)}
              className="relative w-14 h-11 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 hover:scale-105 transition-all group"
            >
              <img src={p.url} alt={p.label} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = p.type === 'camera' ? PLACEHOLDER_CAM : PLACEHOLDER_DARK }} />
              {p.type === 'camera' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Camera size={10} className="text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn size={12} className="text-white" />
              </div>
            </button>
            <span className="text-[9px] text-gray-400 w-14 text-center truncate">{p.label}</span>
          </div>
        ))}
        {extra > 0 && (
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => setLightboxIdx(MAX_VISIBLE)}
              className="w-14 h-11 rounded-lg border border-dashed border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-primary-50 flex flex-col items-center justify-center text-gray-400 hover:text-primary-600 transition-all"
            >
              <span className="text-xs font-semibold">+{extra}</span>
            </button>
            <span className="text-[9px] text-gray-400">more</span>
          </div>
        )}
      </div>
      {lightboxIdx !== null && (
        <PhotoLightbox photos={photos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, onViewMismatch }: {
  entry: EntryRecord
  onViewMismatch: ()=>void
}) {
  const navigate = useNavigate()
  const hasAnomaly = !!entry.anomaly
  const photoCount = entry.photos.length

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-shadow hover:shadow-md ${hasAnomaly?'border-red-200':'border-gray-200'}`}>
      {/* Card header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b flex-wrap gap-2 ${hasAnomaly?'bg-red-50/60 border-red-100':'bg-gray-50 border-gray-100'}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{entry.entryId}</span>
          <StatusBadge status={entry.status} />
          {entry.dock && <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11}/>{entry.dock}</span>}
          <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{entry.facility}</span>
          <span className="text-xs text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full">{entry.customer}</span>

          {entry.anomaly==='mismatch' && (
            <button onClick={e=>{e.stopPropagation();onViewMismatch()}}
              className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors">
              <AlertTriangle size={11}/> Mismatch
            </button>
          )}
          {entry.anomaly==='no-location' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
              <MapPin size={11}/> Location Missing
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {photoCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 px-2 py-1">
              <Camera size={13} className="text-gray-400" /> {photoCount} Photos
            </span>
          )}
          <button onClick={() => navigate(`/yard/entry-detail/${entry.id}`)}
            className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-gray-100">
            <Eye size={13}/> View Details
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-3 text-xs">

        {/* ── Col 1: Check In / Out 时间轴 ── */}
        <div className="lg:col-span-1">
          <p className="text-gray-400 mb-2 font-semibold uppercase tracking-wide text-[10px]">Check In / Out</p>
          <div className="space-y-1.5">
            {/* Gate Check-In */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center mt-0.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${entry.gateCheckIn ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className="w-px flex-1 bg-gray-200 min-h-[14px]" />
              </div>
              <div>
                <p className="text-gray-400 leading-none">Gate In</p>
                <p className={`font-medium mt-0.5 ${entry.gateCheckIn ? 'text-gray-800' : 'text-gray-300'}`}>{entry.gateCheckIn || '–'}</p>
              </div>
            </div>
            {/* Window Check-In */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center mt-0.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${entry.windowCheckIn ? 'bg-emerald-500' : entry.hasAppointment ? 'bg-amber-400 animate-pulse' : 'bg-gray-300'}`} />
                <span className="w-px flex-1 bg-gray-200 min-h-[14px]" />
              </div>
              <div>
                <p className="text-gray-400 leading-none">Window In</p>
                {entry.windowCheckIn ? (
                  <p className="font-medium mt-0.5 text-emerald-700">{entry.windowCheckIn}</p>
                ) : entry.hasAppointment ? (
                  <p className="font-medium mt-0.5 text-gray-300">–</p>
                ) : entry.gateCheckIn ? (
                  <p className="font-medium mt-0.5 text-emerald-700">{entry.gateCheckIn}</p>
                ) : (
                  <p className="font-medium mt-0.5 text-gray-300">–</p>
                )}
              </div>
            </div>
            {/* Dock Check-In */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center mt-0.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${entry.dockCheckIn ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className="w-px flex-1 bg-gray-200 min-h-[14px]" />
              </div>
              <div>
                <p className="text-gray-400 leading-none">Dock In</p>
                <p className={`font-medium mt-0.5 ${entry.dockCheckIn ? 'text-gray-800' : 'text-gray-300'}`}>{entry.dockCheckIn || '–'}</p>
              </div>
            </div>
            {/* Gate Check-Out */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center mt-0.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${entry.gateCheckOut ? 'bg-violet-500' : 'bg-gray-300'}`} />
              </div>
              <div>
                <p className="text-gray-400 leading-none">Gate Out</p>
                <p className={`font-medium mt-0.5 ${entry.gateCheckOut ? 'text-gray-800' : 'text-gray-300'}`}>
                  {entry.gateCheckOut || '–'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Col 2: Driver ── */}
        <div>
          <p className="text-gray-400 mb-1 font-semibold uppercase tracking-wide text-[10px]">Driver</p>
          {entry.driverName?<p className="text-gray-700 font-medium">{entry.driverName}</p>:<p className="text-gray-300 italic">–</p>}
          {entry.tractorCarrier&&<p className="text-gray-400 mt-0.5 truncate">{entry.tractorCarrier}</p>}
        </div>

        {/* ── Col 3: Equipment ── */}
        <div>
          <p className="text-gray-400 mb-1 font-semibold uppercase tracking-wide text-[10px]">Equipment</p>
          <p className="text-gray-700">{entry.equipType||'–'}</p>
          {entry.tractor   &&<p className="text-gray-500 mt-0.5">Tractor: <span className="text-gray-700 font-medium">{entry.tractor}</span></p>}
          {entry.trailer   &&<p className="text-gray-500">Trailer: <span className="text-gray-700 font-medium">{entry.trailer}</span></p>}
          {entry.container &&<p className="text-gray-500">Container: <span className="text-gray-700 font-medium">{entry.container}</span></p>}
          {entry.seal      &&(
            <p className="text-gray-500 flex items-center gap-1 mt-0.5">
              Seal: <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{entry.seal}</span>
            </p>
          )}
          {entry.freightCarrier && entry.freightCarrier !== entry.tractorCarrier &&
            <p className="text-gray-400 truncate mt-0.5">{entry.freightCarrier}</p>}
        </div>

        {/* ── Col 4: Entry Type + Load Info ── */}
        <div>
          <p className="text-gray-400 mb-1 font-semibold uppercase tracking-wide text-[10px]">Entry Type</p>
          <p className={`font-medium ${entry.entryType==='Outbound'?'text-emerald-600':entry.entryType==='Inbound'?'text-blue-600':'text-gray-600'}`}>{entry.entryType}</p>
          {entry.loadTask&&<p className="text-primary-500 mt-0.5 truncate">{entry.loadTask}</p>}
          {(entry.loadId||entry.loadNo||entry.receiptId)&&(
            <div className="mt-1.5 space-y-0.5 border-t border-gray-100 pt-1.5">
              {entry.loadId   &&<p className="text-gray-400">Load ID: <span className="text-gray-700 font-medium">{entry.loadId}</span></p>}
              {entry.loadNo   &&<p className="text-gray-400">Load No.: <span className="text-gray-700 font-medium">{entry.loadNo}</span></p>}
              {entry.receiptId&&<p className="text-gray-400">Receipt: <span className="text-gray-700 font-medium">{entry.receiptId}</span></p>}
            </div>
          )}
        </div>

        {/* ── Col 5: Location ── */}
        <div>
          <p className="text-gray-400 mb-1 font-semibold uppercase tracking-wide text-[10px]">Location</p>
          {entry.location
            ?<p className="text-gray-700 font-medium flex items-center gap-1"><MapPin size={10}/>{entry.location}</p>
            :entry.anomaly==='no-location'
              ?<p className="text-amber-500 flex items-center gap-1 font-medium"><MapPin size={10}/>No location</p>
              :<p className="text-gray-300 italic">–</p>}
        </div>

      </div>

      {/* Photo strip — always shown at bottom of card if photos exist */}
      {entry.photos.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <InlinePhotoStrip photos={entry.photos} />
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EntryList() {
  // Filters
  const [customer,    setCustomer]    = useState('All Customers')
  const [facility,    setFacility]    = useState('All Facilities')
  const [statusFilter,setStatusFilter]= useState('')
  const [entryType,   setEntryType]   = useState('')
  const [anomalyOnly, setAnomalyOnly] = useState(false)
  const [searchId,    setSearchId]    = useState('')
  const [dateFrom,    setDateFrom]    = useState('')
  const [dateTo,      setDateTo]      = useState('')

  const [mismatchEntry, setMismatchEntry] = useState<EntryRecord|null>(null)

  const filtered = MOCK_ENTRIES.filter(e => {
    if (customer  !== 'All Customers'  && e.customer  !== customer)  return false
    if (facility  !== 'All Facilities' && e.facility  !== facility)  return false
    if (statusFilter && e.status  !== statusFilter)                  return false
    if (entryType    && e.entryType !== entryType)                   return false
    if (anomalyOnly  && !e.anomaly)                                  return false
    if (searchId && !e.entryId.toLowerCase().includes(searchId.toLowerCase())
                 && !e.driverName.toLowerCase().includes(searchId.toLowerCase())
                 && !e.trailer.toLowerCase().includes(searchId.toLowerCase())) return false
    return true
  })

  const anomalyCount = MOCK_ENTRIES.filter(e => e.anomaly).length

  const resetFilters = () => {
    setCustomer('All Customers'); setFacility('All Facilities')
    setStatusFilter(''); setEntryType(''); setAnomalyOnly(false)
    setSearchId(''); setDateFrom(''); setDateTo('')
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Entry Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Read-only view of gate entries. Tap any entry to view details and photos.</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Refresh">
          <RefreshCw size={15}/>
        </button>
      </div>

      {/* Anomaly banner */}
      {anomalyCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500 shrink-0"/>
          <span className="text-sm font-semibold text-red-700">{anomalyCount} anomal{anomalyCount>1?'ies':'y'} detected</span>
          <span className="text-xs text-red-500">— driver mismatch or missing location.</span>
          <button onClick={()=>setAnomalyOnly(v=>!v)}
            className={`ml-auto text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${anomalyOnly?'bg-red-600 text-white':'bg-white border border-red-200 text-red-700 hover:bg-red-100'}`}>
            {anomalyOnly?'Show All':'Anomalies Only'}
          </button>
        </div>
      )}

      {/* Filter card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
          {/* Customer */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Customer</label>
            <select value={customer} onChange={e=>setCustomer(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400">
              {CUSTOMERS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Facility */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Facility</label>
            <select value={facility} onChange={e=>setFacility(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400">
              {FACILITIES.map(f=><option key={f}>{f}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Status</label>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400">
              <option value="">All Status</option>
              {ALL_STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Entry Type */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Entry Type</label>
            <select value={entryType} onChange={e=>setEntryType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400">
              <option value="">All Types</option>
              {ENTRY_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Gate Check-in From</label>
            <input type="date" lang="en" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400"/>
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Gate Check-in To</label>
            <input type="date" lang="en" value={dateTo} onChange={e=>setDateTo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400"/>
          </div>

          {/* Search */}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 font-medium mb-1">Search</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              <input value={searchId} onChange={e=>setSearchId(e.target.value)}
                placeholder="Search by Entry ID, driver name, or trailer number (exact or partial match)"
                title="Supports: Entry ID (e.g. ET-822802) · Driver name (e.g. Jason Miller) · Trailer number (e.g. FJWONIX). Partial match supported. Case-insensitive."
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"/>
            </div>
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={anomalyOnly} onChange={e=>setAnomalyOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-400"/>
              <span className="text-gray-600">Anomalies only</span>
            </label>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{filtered.length} result{filtered.length!==1?'s':''}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={11}/>{filtered.filter(e=>!e.anomaly).length} normal</span>
              <span className="flex items-center gap-1 text-red-500"><AlertTriangle size={11}/>{filtered.filter(e=>e.anomaly).length} anomaly</span>
            </div>
          </div>
          <button onClick={resetFilters}
            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
            Reset
          </button>
        </div>
      </div>

      {/* Entry list */}
      <div className="space-y-3">
        {filtered.length===0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-16 flex flex-col items-center gap-3 text-gray-400">
            <Info size={32} className="text-gray-300"/>
            <p className="text-sm">No entries match the current filters</p>
          </div>
        ) : filtered.map(entry=>(
          <EntryCard
            key={entry.id}
            entry={entry}
            onViewMismatch={()=>setMismatchEntry(entry)}
          />
        ))}
      </div>

      {mismatchEntry && <MismatchModal    entry={mismatchEntry} onClose={()=>setMismatchEntry(null)}/>}
    </div>
  )
}
