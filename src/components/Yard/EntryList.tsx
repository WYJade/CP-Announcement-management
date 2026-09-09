import { useState } from 'react'
import {
  AlertTriangle, CheckCircle2, Clock, Truck, MapPin, User,
  Search, X, RefreshCw, Eye, AlertCircle, Info, Camera,
  ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type EntryStatus =
  | 'Pre Entry'
  | 'Gate Checked In'
  | 'Waiting'
  | 'Need Window Check-In'
  | 'Window Checked In'
  | 'Dock Checked In'
  | 'Dock Checked Out'
  | 'Gate Checked Out'
  | 'Rejected'
  | 'Dropping Off Delivery'
  | 'Dropping Off Empty'
  | 'Picking Up Preload'
  | 'Picking Up Empty'

type EntryType = 'Inbound' | 'Outbound' | 'Drop Off Empty' | 'Drop Off Delivery' | 'Pick Up'
type AnomalyType = 'mismatch' | 'no-location' | null

interface Photo {
  id: string
  label: string
  url: string   // using placeholder images
  type: 'driver' | 'vehicle' | 'camera'
}

interface EntryRecord {
  id: string
  entryId: string
  status: EntryStatus
  dock: string
  facility: string
  customer: string
  driverName: string
  driverPhone: string
  driverLicense: string
  tractorCarrier: string
  equipType: string
  tractor: string
  trailer: string
  container: string
  seal: string
  freightCarrier: string
  entryType: EntryType
  direction: string
  location: string
  loadTask: string
  loadId: string
  loadNo: string
  receiptId: string
  hasAppointment: boolean  // whether a pre-scheduled appointment exists
  windowCheckIn: string    // Window Check-In timestamp; empty means not yet checked in
  dockCheckIn: string      // Dock Check-In timestamp
  dockCheckOut: string     // Dock Check-Out timestamp
  gateCheckIn: string
  gateCheckOut: string
  anomaly: AnomalyType
  anomalyDetail?: string
  mismatch?: {
    byCarrier: { name: string; phone: string; license: string; carrier: string; mcdot: string }
    byGate:    { name: string; phone: string; license: string; carrier: string; mcdot: string }
  }
  photos: Photo[]
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ALL_STATUSES: EntryStatus[] = [
  'Pre Entry', 'Gate Checked In', 'Waiting', 'Need Window Check-In',
  'Window Checked In', 'Dock Checked In', 'Dock Checked Out', 'Gate Checked Out',
  'Rejected', 'Dropping Off Delivery', 'Dropping Off Empty',
  'Picking Up Preload', 'Picking Up Empty',
]

const CUSTOMERS  = ['All Customers', 'ADOORN LLC', 'THE ONLY BEAN LLC', 'VITA COCO', 'ORGAIN LLC', 'SAMUN INC']
const FACILITIES = ['All Facilities', 'Ontario, CA', 'Fontana, CA', 'Garden City, NY', 'Savannah, GA', 'Chicago, IL']
const ENTRY_TYPES: EntryType[] = ['Inbound', 'Outbound', 'Drop Off Empty', 'Drop Off Delivery', 'Pick Up']

// ─── Placeholder photo URLs ───────────────────────────────────────────────────
const PLACEHOLDER_DARK  = 'https://placehold.co/320x200/1a1a2e/555?text=Driver'
const PLACEHOLDER_VEH   = 'https://placehold.co/320x200/1a1a2e/555?text=Vehicle'
const PLACEHOLDER_EQUIP = 'https://placehold.co/320x200/1a1a2e/555?text=Equipment'
const PLACEHOLDER_CAM   = 'https://placehold.co/640x360/0d1117/6e40c9?text=Camera+Feed'

function makePh(label: string, type: Photo['type'] = 'driver'): Photo {
  const url = type === 'camera' ? PLACEHOLDER_CAM
    : type === 'vehicle' ? PLACEHOLDER_VEH
    : PLACEHOLDER_DARK
  return { id: `${label}-${Math.random()}`, label, url, type }
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ENTRIES: EntryRecord[] = [
  {
    id:'e1', entryId:'ET-822803', status:'Window Checked In', dock:'DOCK33456',
    facility:'Ontario, CA', customer:'ADOORN LLC',
    driverName:'Jason Miller', driverPhone:'(+1)9093451872', driverLicense:'CA-M293847', tractorCarrier:'SWIFT TRANSPORT',
    equipType:'TRAILER', tractor:'T-10923', trailer:'4645', container:'CNTR-9901', seal:'SL-88421', freightCarrier:'SWIFT TRANSPORT',
    entryType:'Outbound', direction:'Outbound', location:'DOCK33456', loadTask:'TASK-35688(jfeng)',
    loadId:'LD-20230', loadNo:'LN-5521', receiptId:'RCP-10040',
    hasAppointment:true, windowCheckIn:'2026-09-08 10:18', dockCheckIn:'2026-09-08 10:35', dockCheckOut:'', gateCheckIn:'2026-09-08 10:04', gateCheckOut:'', anomaly:null,
    photos:[makePh('Driver'), makePh('Vehicle','vehicle'), makePh('Equipment','vehicle'), makePh('Camera In','camera')],
  },
  {
    id:'e2', entryId:'ET-822802', status:'Dock Checked Out', dock:'DOCK711',
    facility:'Ontario, CA', customer:'ADOORN LLC',
    driverName:'api fox', driverPhone:'(+1)2013694258', driverLicense:'DL83R4J484', tractorCarrier:'TTS',
    equipType:'TRAILER', tractor:'LPR443', trailer:'FJWONIX', container:'CNTR-7701', seal:'SL-00312', freightCarrier:'UPS',
    entryType:'Outbound', direction:'Outbound', location:'DOCK711', loadTask:'TASK-837829(SMITH JOHN)',
    loadId:'LD-20198', loadNo:'LN-5498', receiptId:'RCP-10045',
    hasAppointment:true, windowCheckIn:'2026-09-08 03:22', dockCheckIn:'2026-09-08 03:40', dockCheckOut:'2026-09-08 05:12', gateCheckIn:'2026-09-08 03:14', gateCheckOut:'', anomaly:null,
    photos:[makePh('Driver'), makePh('Driver 2'), makePh('Vehicle','vehicle'), makePh('Vehicle 2','vehicle'), makePh('Equipment','vehicle'), makePh('Equipment 2','vehicle'), makePh('Camera In','camera'), makePh('Camera Out','camera')],
  },
  {
    id:'e3', entryId:'ET-822795', status:'Dropping Off Empty', dock:'YARD162',
    facility:'Fontana, CA', customer:'THE ONLY BEAN LLC',
    driverName:'ESTHER CHEN', driverPhone:'(+1)2542492894', driverLicense:'CA-12345568', tractorCarrier:'J B HUNT TRANSPORT INC',
    equipType:'TRAILER', tractor:'T-33881', trailer:'8222733', container:'CNTR-5512', seal:'SL-44901', freightCarrier:'J B HUNT TRANSPORT INC',
    entryType:'Drop Off Empty', direction:'Drop Off Empty', location:'YARD-B12',
    loadTask:'TASK-35601(echen)', loadId:'LD-20187', loadNo:'LN-5490', receiptId:'RCP-10031',
    hasAppointment:true, windowCheckIn:'', dockCheckIn:'', dockCheckOut:'', gateCheckIn:'2026-09-08 02:41', gateCheckOut:'',
    anomaly:'no-location', anomalyDetail:'Driver has not filled in the actual parking location.',
    photos:[makePh('Driver'), makePh('Driver 2'), makePh('Camera In','camera'), makePh('Camera In 2','camera'), makePh('Camera In 3','camera'), makePh('Camera In 4','camera'), makePh('Camera In 5','camera'), makePh('Camera In 6','camera'), makePh('Camera In 7','camera'), makePh('Camera In 8','camera')],
  },
  {
    id:'e4', entryId:'ET-822711', status:'Gate Checked Out', dock:'DOCK442',
    facility:'Garden City, NY', customer:'VITA COCO',
    driverName:'test yuto', driverPhone:'(+1)9988880888', driverLicense:'NY-43e534626', tractorCarrier:'AMC TRANSPORT SERVICES LLC',
    equipType:'TRAILER', tractor:'T-66120', trailer:'PGNN', container:'CNTR-4402', seal:'SL-77654', freightCarrier:'FEDEX FREIGHT INC',
    entryType:'Outbound', direction:'Outbound', location:'DOCK442', loadTask:'TASK-34991(jsmith)',
    loadId:'LD-19854', loadNo:'LN-5200', receiptId:'RCP-09988',
    hasAppointment:false, windowCheckIn:'2026-09-02 00:45', dockCheckIn:'2026-09-02 01:00', dockCheckOut:'2026-09-02 01:48', gateCheckIn:'2026-09-02 00:32', gateCheckOut:'2026-09-02 01:55',
    anomaly:'mismatch', anomalyDetail:'Driver info entered by carrier does not match gate check-in record.',
    mismatch:{
      byCarrier:{ name:'324234', phone:'(+1)2701661989', license:'46534354', carrier:'FEDEX FREIGHT INC', mcdot:'229039' },
      byGate:   { name:'test yuto', phone:'(+1)9988880888', license:'43e534626', carrier:'AMC TRANSPORT SERVICES LLC', mcdot:'' },
    },
    photos:[makePh('Driver'), makePh('Vehicle','vehicle'), makePh('Equipment','vehicle'), makePh('Equipment 2','vehicle'), makePh('Equipment 3','vehicle'), makePh('Other')],
  },
  {
    id:'e5', entryId:'ET-822710', status:'Window Checked In', dock:'DOCK8976',
    facility:'Fontana, CA', customer:'ORGAIN LLC',
    driverName:'Kevin Torres', driverPhone:'(+1)9095552341', driverLicense:'CA-K887712', tractorCarrier:'WERNER ENTERPRISES',
    equipType:'TRAILER', tractor:'T-20541', trailer:'PGNN', container:'CNTR-3308', seal:'SL-33209', freightCarrier:'WERNER ENTERPRISES',
    entryType:'Outbound', direction:'Outbound', location:'DOCK8976', loadTask:'TASK-36384(jfeng)',
    loadId:'LD-20175', loadNo:'LN-5481', receiptId:'RCP-10038',
    hasAppointment:true, windowCheckIn:'2026-09-02 00:50', dockCheckIn:'2026-09-02 01:05', dockCheckOut:'', gateCheckIn:'2026-09-02 00:32', gateCheckOut:'', anomaly:null,
    photos:[makePh('Camera In','camera'), makePh('Camera In 2','camera')],
  },
  {
    id:'e6', entryId:'ET-822804', status:'Need Window Check-In', dock:'DOCK115',
    facility:'Chicago, IL', customer:'SAMUN INC',
    driverName:'Maria Gonzalez', driverPhone:'(+1)3125559988', driverLicense:'IL-M334421', tractorCarrier:'COYOTE LOGISTICS',
    equipType:'TRAILER', tractor:'T-77403', trailer:'TRL-2290', container:'CNTR-6614', seal:'SL-55820', freightCarrier:'COYOTE LOGISTICS',
    entryType:'Inbound', direction:'Inbound', location:'', loadTask:'TASK-36401(mgonzalez)',
    loadId:'LD-20231', loadNo:'LN-5522', receiptId:'RCP-10048',
    hasAppointment:false, windowCheckIn:'', dockCheckIn:'', dockCheckOut:'', gateCheckIn:'2026-09-08 10:04', gateCheckOut:'', anomaly:null,
    photos:[makePh('Driver'), makePh('Vehicle','vehicle'), makePh('Camera In','camera')],
  },
]

// ─── Status style map ─────────────────────────────────────────────────────────
const STATUS_STYLE: Record<EntryStatus, { bg: string; text: string; dot: string }> = {
  'Pre Entry':             { bg:'bg-gray-100',    text:'text-gray-600',   dot:'bg-gray-400' },
  'Gate Checked In':       { bg:'bg-blue-50',     text:'text-blue-700',   dot:'bg-blue-500' },
  'Waiting':               { bg:'bg-yellow-50',   text:'text-yellow-700', dot:'bg-yellow-500' },
  'Need Window Check-In':  { bg:'bg-orange-50',   text:'text-orange-700', dot:'bg-orange-500' },
  'Window Checked In':     { bg:'bg-emerald-50',  text:'text-emerald-700',dot:'bg-emerald-500' },
  'Dock Checked In':       { bg:'bg-teal-50',     text:'text-teal-700',   dot:'bg-teal-500' },
  'Dock Checked Out':      { bg:'bg-violet-50',   text:'text-violet-700', dot:'bg-violet-500' },
  'Gate Checked Out':      { bg:'bg-gray-100',    text:'text-gray-600',   dot:'bg-gray-400' },
  'Rejected':              { bg:'bg-red-50',      text:'text-red-700',    dot:'bg-red-500' },
  'Dropping Off Delivery': { bg:'bg-cyan-50',     text:'text-cyan-700',   dot:'bg-cyan-500' },
  'Dropping Off Empty':    { bg:'bg-amber-50',    text:'text-amber-700',  dot:'bg-amber-500' },
  'Picking Up Preload':    { bg:'bg-indigo-50',   text:'text-indigo-700', dot:'bg-indigo-500' },
  'Picking Up Empty':      { bg:'bg-purple-50',   text:'text-purple-700', dot:'bg-purple-500' },
}

function StatusBadge({ status }: { status: EntryStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

// ─── Window Check-In Badge (3-state logic) ────────────────────────────────────
function WindowCheckInBadge({
  hasAppointment, windowCheckIn, gateCheckIn,
}: {
  hasAppointment: boolean
  windowCheckIn: string
  gateCheckIn: string
}) {
  // Case 2 & 3b — has windowCheckIn or (no appt but gate check-in exists) → Arrived
  if (windowCheckIn) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Arrived at {windowCheckIn}
      </span>
    )
  }
  // Case 3b — no appointment, but already gate checked-in → treat as arrived
  if (!hasAppointment && gateCheckIn) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Arrived at {gateCheckIn}
      </span>
    )
  }
  // Case 3a — no appointment, no gate check-in yet
  if (!hasAppointment) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
        Not Scheduled
      </span>
    )
  }
  // Case 1 — has appointment but windowCheckIn is empty → pending
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      Pending Arrival
    </span>
  )
}

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

// ─── Entry Detail Panel ───────────────────────────────────────────────────────
function EntryDetailPanel({ entry, onClose }: { entry: EntryRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={onClose}>
      <div className="w-[520px] bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}
        style={{ animation:'slideInRight 0.2s cubic-bezier(0.16,1,0.3,1)' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-900">{entry.entryId}</span>
              <StatusBadge status={entry.status} />
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
              {entry.dock && <span className="flex items-center gap-1"><MapPin size={10} />{entry.dock}</span>}
              <span>{entry.facility}</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{entry.customer}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={15} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Anomaly */}
          {entry.anomaly && (
            <div className={`rounded-xl px-4 py-3 flex items-start gap-3 ${entry.anomaly==='mismatch'?'bg-red-50 border border-red-200':'bg-amber-50 border border-amber-200'}`}>
              <AlertTriangle size={15} className={`shrink-0 mt-0.5 ${entry.anomaly==='mismatch'?'text-red-500':'text-amber-500'}`} />
              <div>
                <p className={`text-xs font-semibold ${entry.anomaly==='mismatch'?'text-red-700':'text-amber-700'}`}>
                  {entry.anomaly==='mismatch'?'Driver Mismatch Detected':'Location Not Filled'}
                </p>
                <p className={`text-xs mt-0.5 ${entry.anomaly==='mismatch'?'text-red-600':'text-amber-600'}`}>{entry.anomalyDetail}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Clock size={12}/> Timeline</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-3">
              {/* Gate Check-in / Check-out */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Gate Check-in</p>
                  <p className="text-sm font-medium text-gray-800">{entry.gateCheckIn||'–'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Gate Check-out</p>
                  <p className="text-sm font-medium text-gray-800">{entry.gateCheckOut||'–'}</p>
                </div>
              </div>
              {/* Window Check-In status — linked to windowCheckIn field */}
              <div className="border-t border-gray-200 pt-2.5">
                <p className="text-[10px] text-gray-400 mb-1.5">Window Check-in</p>
                <WindowCheckInBadge
                  hasAppointment={entry.hasAppointment}
                  windowCheckIn={entry.windowCheckIn}
                  gateCheckIn={entry.gateCheckIn}
                />
              </div>
              {/* Dock Check-in / Check-out */}
              {(entry.dockCheckIn || entry.dockCheckOut) && (
                <div className="border-t border-gray-200 pt-2.5 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Dock Check-in</p>
                    <p className="text-sm font-medium text-gray-800">{entry.dockCheckIn||'–'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Dock Check-out</p>
                    <p className="text-sm font-medium text-gray-800">{entry.dockCheckOut||'–'}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Driver */}
          {entry.driverName && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><User size={12}/> Driver</h3>
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                {[['Name',entry.driverName],['Phone',entry.driverPhone],['License',entry.driverLicense],['Carrier',entry.tractorCarrier]].map(([l,v])=>v?(
                  <div key={l} className="flex justify-between text-xs">
                    <span className="text-gray-400">{l}</span>
                    <span className="text-gray-800 font-medium">{v}</span>
                  </div>
                ):null)}
              </div>
            </section>
          )}

          {/* Equipment */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Truck size={12}/> Equipment</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
              {([['Type',entry.equipType],['Tractor',entry.tractor],['Trailer',entry.trailer],['Container',entry.container],['Freight Carrier',entry.freightCarrier]] as [string,string][]).map(([l,v])=>v?(
                <div key={l} className="flex justify-between text-xs">
                  <span className="text-gray-400">{l}</span>
                  <span className="text-gray-800 font-medium">{v}</span>
                </div>
              ):null)}
              {entry.seal && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Seal</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">{entry.seal}</span>
                </div>
              )}
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><MapPin size={12}/> Location</h3>
            <div className={`rounded-xl px-4 py-3 ${entry.anomaly==='no-location'?'bg-amber-50 border border-amber-200':'bg-gray-50'}`}>
              {entry.location
                ? <p className="text-sm font-medium text-gray-800">{entry.location}</p>
                : <p className="text-xs text-amber-600 font-medium">Location not entered by driver</p>}
            </div>
          </section>

          {/* Direction & Load Info */}
          {(entry.loadTask||entry.loadId||entry.loadNo||entry.receiptId) && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Direction &amp; Load</h3>
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Direction</span>
                  <span className={`font-medium ${entry.direction==='Outbound'?'text-emerald-600':entry.direction==='Inbound'?'text-blue-600':'text-gray-700'}`}>{entry.direction}</span>
                </div>
                {entry.loadTask&&(
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Load Task</span>
                    <span className="text-primary-600 font-medium">{entry.loadTask}</span>
                  </div>
                )}
                {(entry.loadId||entry.loadNo||entry.receiptId)&&(
                  <div className="border-t border-gray-200 pt-1.5 mt-1 space-y-1.5">
                    {entry.loadId&&(
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Load ID</span>
                        <span className="text-gray-800 font-medium">{entry.loadId}</span>
                      </div>
                    )}
                    {entry.loadNo&&(
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Load No.</span>
                        <span className="text-gray-800 font-medium">{entry.loadNo}</span>
                      </div>
                    )}
                    {entry.receiptId&&(
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Receipt ID</span>
                        <span className="text-gray-800 font-medium">{entry.receiptId}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Photos & Camera */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Camera size={12}/> Photos &amp; Camera</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-4">
              <PhotoGallery photos={entry.photos} maxVisible={8} />
            </div>
          </section>
        </div>
      </div>
      <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
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
function EntryCard({ entry, onViewDetail, onViewMismatch }: {
  entry: EntryRecord
  onViewDetail: ()=>void
  onViewMismatch: ()=>void
}) {
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
          <button onClick={onViewDetail}
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
            {/* Dock / Gate Check-Out */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center mt-0.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${(entry.dockCheckOut || entry.gateCheckOut) ? 'bg-violet-500' : 'bg-gray-300'}`} />
              </div>
              <div>
                <p className="text-gray-400 leading-none">{entry.dockCheckOut ? 'Dock Out' : 'Gate Out'}</p>
                <p className={`font-medium mt-0.5 ${(entry.dockCheckOut || entry.gateCheckOut) ? 'text-gray-800' : 'text-gray-300'}`}>
                  {entry.dockCheckOut || entry.gateCheckOut || '–'}
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

  const [detailEntry,   setDetailEntry]   = useState<EntryRecord|null>(null)
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
          <h1 className="text-xl font-bold text-gray-900">Yard Entry Monitor</h1>
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
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400"/>
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1">Gate Check-in To</label>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400"/>
          </div>

          {/* Search */}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 font-medium mb-1">Search (Entry ID / Driver / Trailer)</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              <input value={searchId} onChange={e=>setSearchId(e.target.value)}
                placeholder="e.g. ET-822802 / api fox / FJWONIX"
                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"/>
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
            onViewDetail={()=>setDetailEntry(entry)}
            onViewMismatch={()=>setMismatchEntry(entry)}
          />
        ))}
      </div>

      {detailEntry   && <EntryDetailPanel entry={detailEntry}   onClose={()=>setDetailEntry(null)}/>}
      {mismatchEntry && <MismatchModal    entry={mismatchEntry} onClose={()=>setMismatchEntry(null)}/>}
    </div>
  )
}
