import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  AlertTriangle, MapPin,
  X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon,
  Camera, ArrowLeft,
} from 'lucide-react'
import {
  MOCK_ENTRIES, STATUS_STYLE, PLACEHOLDER_DARK, PLACEHOLDER_CAM,
  type EntryRecord, type Photo, type EntryStatus,
} from './entryData'

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

// ─── Window Check-In Badge ────────────────────────────────────────────────────
function WindowCheckInBadge({
  hasAppointment, windowCheckIn, gateCheckIn,
}: {
  hasAppointment: boolean
  windowCheckIn: string
  gateCheckIn: string
}) {
  if (windowCheckIn) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Arrived at {windowCheckIn}
      </span>
    )
  }
  if (!hasAppointment && gateCheckIn) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Arrived at {gateCheckIn}
      </span>
    )
  }
  if (!hasAppointment) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
        Not Scheduled
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
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

// ─── Photo Gallery ────────────────────────────────────────────────────────────
function PhotoGallery({ photos, maxVisible = 12 }: { photos: Photo[]; maxVisible?: number }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (photos.length === 0) return (
    <div className="flex items-center gap-2 text-gray-300 text-sm py-4">
      <ImageIcon size={16} /> No photos available
    </div>
  )

  const visible = photos.slice(0, maxVisible)
  const extra   = photos.length - maxVisible

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        {visible.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setLightboxIdx(i)}
            className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 hover:scale-105 transition-all group shrink-0"
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
            className="w-20 h-16 rounded-lg border border-dashed border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-primary-50 flex flex-col items-center justify-center text-gray-400 hover:text-primary-600 transition-all shrink-0"
          >
            <span className="text-sm font-semibold">+{extra}</span>
            <span className="text-[10px]">more</span>
          </button>
        )}
      </div>
      {/* Labels */}
      <div className="flex items-center gap-3 flex-wrap mt-1.5">
        {visible.map(p => (
          <span key={p.id} className="w-20 text-center text-[10px] text-gray-400 truncate shrink-0">{p.label}</span>
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
                <div key={`f${i}`} className={`px-3 py-2.5 text-gray-600 border-t border-gray-100 ${diff ? 'bg-red-50/20' : ''}`}>{f}</div>,
                <div key={`c${i}`} className={`px-3 py-2.5 border-t border-l border-gray-100 ${diff ? 'text-red-600 font-semibold bg-red-50/30' : 'text-gray-700'}`}>{cv[i] || '–'}</div>,
                <div key={`g${i}`} className={`px-3 py-2.5 border-t border-l border-gray-100 ${diff ? 'text-red-600 font-semibold bg-red-50/30' : 'text-gray-700'}`}>{gv[i] || '–'}</div>,
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 shrink-0 w-36">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? 'text-primary-600' : 'text-gray-800'}`}>{value || '–'}</span>
    </div>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="px-5 py-1">
        {children}
      </div>
    </div>
  )
}

// ─── Entry Detail Page ────────────────────────────────────────────────────────
export default function EntryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showMismatch, setShowMismatch] = useState(false)

  const entry = MOCK_ENTRIES.find(e => e.id === id)

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-sm">Entry not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Entry Monitor
        </button>
      </div>
    )
  }

  return (
    <div className="pb-12">

      {/* ── Top nav bar ── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft size={14} /> Back to Entry Monitor
        </button>
      </div>

      {/* ── Title row ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">Entry # <span className="text-primary-600">{entry.entryId}</span></h1>
          <StatusBadge status={entry.status} />
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
          {entry.dock && (
            <span className="flex items-center gap-1"><MapPin size={13} />{entry.dock}</span>
          )}
          <span>{entry.facility}</span>
          <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">{entry.customer}</span>
        </div>
      </div>

      {/* ── Anomaly Banner ── */}
      {entry.anomaly && (
        <div className={`mb-5 rounded-xl px-5 py-4 flex items-start gap-3 ${entry.anomaly === 'mismatch' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
          <AlertTriangle size={16} className={`shrink-0 mt-0.5 ${entry.anomaly === 'mismatch' ? 'text-red-500' : 'text-amber-500'}`} />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${entry.anomaly === 'mismatch' ? 'text-red-700' : 'text-amber-700'}`}>
              {entry.anomaly === 'mismatch' ? 'Driver Mismatch Detected' : 'Location Not Filled'}
            </p>
            <p className={`text-xs mt-0.5 ${entry.anomaly === 'mismatch' ? 'text-red-600' : 'text-amber-600'}`}>{entry.anomalyDetail}</p>
          </div>
          {entry.anomaly === 'mismatch' && entry.mismatch && (
            <button
              onClick={() => setShowMismatch(true)}
              className="shrink-0 text-sm font-medium text-red-700 border border-red-300 hover:bg-red-100 px-4 py-1.5 rounded-lg transition-colors"
            >
              View Mismatch
            </button>
          )}
        </div>
      )}

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Timeline */}
          <SectionCard title="Timeline">
            <div className="grid grid-cols-2 gap-x-8">
              <InfoRow label="Gate Check-in"  value={entry.gateCheckIn} />
              <InfoRow label="Gate Check-out" value={entry.gateCheckOut} />
              <div className="col-span-2 flex justify-between items-center py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-500 w-36">Window Check-in</span>
                <WindowCheckInBadge
                  hasAppointment={entry.hasAppointment}
                  windowCheckIn={entry.windowCheckIn}
                  gateCheckIn={entry.gateCheckIn}
                />
              </div>
              {(entry.dockCheckIn || entry.dockCheckOut) && <>
                <InfoRow label="Dock Check-in"  value={entry.dockCheckIn} />
                <InfoRow label="Dock Check-out" value={entry.dockCheckOut} />
              </>}
            </div>
          </SectionCard>

          {/* Equipment */}
          <SectionCard title="Equipment">
            <div className="grid grid-cols-2 gap-x-8">
              <InfoRow label="Type"            value={entry.equipType} />
              <InfoRow label="Tractor"         value={entry.tractor} />
              <InfoRow label="Trailer"         value={entry.trailer} />
              <InfoRow label="Container"       value={entry.container} />
              <InfoRow label="Freight Carrier" value={entry.freightCarrier} />
              {entry.seal && <InfoRow label="Seal" value={
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">{entry.seal}</span>
              } />}
            </div>
          </SectionCard>

          {/* Direction & Load */}
          {(entry.loadTask || entry.loadId || entry.loadNo || entry.receiptId) && (
            <SectionCard title="Direction & Load">
              <div className="grid grid-cols-2 gap-x-8">
                <InfoRow label="Direction" value={
                  <span className={entry.direction === 'Outbound' ? 'text-emerald-600 font-semibold' : entry.direction === 'Inbound' ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
                    {entry.direction}
                  </span>
                } />
                {entry.loadTask  && <InfoRow label="Load Task"  value={entry.loadTask}  highlight />}
                {entry.loadId    && <InfoRow label="Load ID"    value={entry.loadId} />}
                {entry.loadNo    && <InfoRow label="Load No."   value={entry.loadNo} />}
                {entry.receiptId && <InfoRow label="Receipt ID" value={entry.receiptId} />}
              </div>
            </SectionCard>
          )}

          {/* Photos & Camera */}
          <SectionCard title={`Photos & Camera (${entry.photos.length})`}>
            <div className="py-3">
              <PhotoGallery photos={entry.photos} maxVisible={12} />
            </div>
          </SectionCard>

        </div>

        {/* ── Right column (1/3) ── */}
        <div className="space-y-5">

          {/* Driver */}
          {entry.driverName && (
            <SectionCard title="Driver">
              <InfoRow label="Name"    value={entry.driverName} />
              <InfoRow label="Phone"   value={entry.driverPhone} />
              <InfoRow label="License" value={entry.driverLicense} />
              <InfoRow label="Carrier" value={entry.tractorCarrier} />
            </SectionCard>
          )}

          {/* Location */}
          <SectionCard title="Location">
            <div className="py-3">
              {entry.location ? (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <MapPin size={14} className="text-gray-400" />
                  {entry.location}
                </div>
              ) : (
                <div className={`rounded-lg px-3 py-2.5 text-sm font-medium flex items-center gap-2 ${entry.anomaly === 'no-location' ? 'bg-amber-50 text-amber-700' : 'text-gray-400'}`}>
                  <MapPin size={14} />
                  Location not entered by driver
                </div>
              )}
            </div>
          </SectionCard>

          {/* Entry Type */}
          <SectionCard title="Entry Type">
            <InfoRow label="Type"      value={entry.entryType} />
            <InfoRow label="Direction" value={
              <span className={entry.direction === 'Outbound' ? 'text-emerald-600 font-semibold' : entry.direction === 'Inbound' ? 'text-blue-600 font-semibold' : ''}>
                {entry.direction}
              </span>
            } />
          </SectionCard>

        </div>
      </div>

      {/* Mismatch Modal */}
      {showMismatch && <MismatchModal entry={entry} onClose={() => setShowMismatch(false)} />}
    </div>
  )
}
