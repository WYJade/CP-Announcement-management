import { useState } from 'react'
import {
  AlertTriangle, CheckCircle2, Clock, Truck, MapPin, User,
  ChevronDown, ChevronRight, Search, X, RefreshCw, Eye,
  AlertCircle, Info,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type EntryStatus = 'Gate Checked In' | 'Window Checked In' | 'Dock Checked Out' | 'Gate Checked Out' | 'Dropping off Empty' | 'Need Window Check-In'
type AnomalyType = 'mismatch' | 'no-location' | null

interface EntryRecord {
  id: string
  entryId: string
  status: EntryStatus
  dock: string
  customer: string
  // Driver
  driverName: string
  driverPhone: string
  driverLicense: string
  tractorCarrier: string
  // Equipment
  equipType: string
  tractor: string
  trailer: string
  container: string
  freightCarrier: string
  // Inbound / Outbound
  direction: 'Inbound' | 'Outbound' | 'Drop Off Empty'
  location: string
  loadTask: string
  // Check In/Out
  gateCheckIn: string
  gateCheckOut: string
  // Anomaly
  anomaly: AnomalyType
  anomalyDetail?: string
  // Mismatch diff (if anomaly === 'mismatch')
  mismatch?: {
    byCarrier: { name: string; phone: string; license: string; carrier: string; mcdot: string }
    byGate: { name: string; phone: string; license: string; carrier: string; mcdot: string }
  }
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const CUSTOMERS = ['All Customers', 'ADOORN LLC', 'THE ONLY BEAN LLC', 'VITA COCO', 'ORGAIN LLC', 'SAMUN INC']

const MOCK_ENTRIES: EntryRecord[] = [
  {
    id: 'e1', entryId: 'ET-822803', status: 'Window Checked In', dock: 'DOCK33456',
    customer: 'ADOORN LLC',
    driverName: '', driverPhone: '', driverLicense: '', tractorCarrier: '',
    equipType: 'TRAILER', tractor: '', trailer: '4645', container: '', freightCarrier: '',
    direction: 'Outbound', location: 'DOCK33456', loadTask: 'TASK-35688(jfeng)',
    gateCheckIn: '2026-09-08 10:04', gateCheckOut: '',
    anomaly: null,
  },
  {
    id: 'e2', entryId: 'ET-822802', status: 'Dock Checked Out', dock: 'DOCK711',
    customer: 'ADOORN LLC',
    driverName: 'api fox', driverPhone: '(+1)2013694258', driverLicense: 'DL83R4J484',
    tractorCarrier: 'TTS',
    equipType: 'TRAILER', tractor: 'LPR443', trailer: 'FJWONIX', container: '', freightCarrier: 'UPS',
    direction: 'Outbound', location: 'DOCK711', loadTask: 'TASK-837829(SMITH JOHN)',
    gateCheckIn: '2026-09-08 03:14', gateCheckOut: '',
    anomaly: null,
  },
  {
    id: 'e3', entryId: 'ET-822795', status: 'Gate Checked In', dock: 'YARD162',
    customer: 'THE ONLY BEAN LLC',
    driverName: 'ESTHER CHEN', driverPhone: '(+1)2542492894', driverLicense: '12345568',
    tractorCarrier: 'J B HUNT TRANSPORT INC',
    equipType: 'TRAILER', tractor: '', trailer: '8222733', container: '', freightCarrier: 'J B HUNT TRANSPORT INC',
    direction: 'Drop Off Empty', location: '',
    loadTask: '',
    gateCheckIn: '2026-09-08 02:41', gateCheckOut: '',
    anomaly: 'no-location',
    anomalyDetail: 'Location not entered. Driver has not filled in the actual parking location.',
  },
  {
    id: 'e4', entryId: 'ET-822711', status: 'Gate Checked Out', dock: '',
    customer: 'VITA COCO',
    driverName: 'test yuto', driverPhone: '(+1)9988880888', driverLicense: '43e534626',
    tractorCarrier: 'AMC TRANSPORT SERVICES LLC',
    equipType: 'TRAILER', tractor: '', trailer: 'PGNN', container: '', freightCarrier: 'FEDEX FREIGHT INC',
    direction: 'Outbound', location: '', loadTask: '',
    gateCheckIn: '2026-09-02 00:32', gateCheckOut: '2026-09-02 00:36',
    anomaly: 'mismatch',
    anomalyDetail: 'Driver information entered by carrier does not match gate check-in data.',
    mismatch: {
      byCarrier: { name: '324234', phone: '(+1)2701661989', license: '46534354', carrier: 'FEDEX FREIGHT INC', mcdot: '229039' },
      byGate: { name: 'test yuto', phone: '(+1)9988880888', license: '43e534626', carrier: 'AMC TRANSPORT SERVICES LLC', mcdot: '' },
    },
  },
  {
    id: 'e5', entryId: 'ET-822710', status: 'Window Checked In', dock: 'DOCK8976',
    customer: 'ORGAIN LLC',
    driverName: '', driverPhone: '', driverLicense: '', tractorCarrier: '',
    equipType: 'TRAILER', tractor: '', trailer: 'PGNN', container: '', freightCarrier: '',
    direction: 'Outbound', location: 'DOCK8976', loadTask: 'TASK-36384(jfeng)',
    gateCheckIn: '2026-09-02 00:32', gateCheckOut: '',
    anomaly: null,
  },
  {
    id: 'e6', entryId: 'ET-822804', status: 'Need Window Check-In', dock: '',
    customer: 'SAMUN INC',
    driverName: '', driverPhone: '', driverLicense: '', tractorCarrier: '',
    equipType: '', tractor: '', trailer: '', container: '', freightCarrier: '',
    direction: 'Inbound', location: '', loadTask: '',
    gateCheckIn: '2026-09-08 10:04', gateCheckOut: '',
    anomaly: null,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<EntryStatus, { bg: string; text: string; dot: string }> = {
  'Gate Checked In':     { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Window Checked In':   { bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  'Dock Checked Out':    { bg: 'bg-violet-50',  text: 'text-violet-700', dot: 'bg-violet-500' },
  'Gate Checked Out':    { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400' },
  'Dropping off Empty':  { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  'Need Window Check-In':{ bg: 'bg-orange-50',  text: 'text-orange-700', dot: 'bg-orange-500' },
}

function StatusBadge({ status }: { status: EntryStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

// ─── Mismatch Detail Modal ────────────────────────────────────────────────────
function MismatchModal({ entry, onClose }: { entry: EntryRecord; onClose: () => void }) {
  if (!entry.mismatch) return null
  const { byCarrier, byGate } = entry.mismatch
  const fields = ['Name', 'Phone', 'License', 'Carrier', 'MC/DOT']
  const carrierVals = [byCarrier.name, byCarrier.phone, byCarrier.license, byCarrier.carrier, byCarrier.mcdot]
  const gateVals = [byGate.name, byGate.phone, byGate.license, byGate.carrier, byGate.mcdot]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={17} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Driver Information Mismatch</p>
            <p className="text-xs text-gray-500">Entry {entry.entryId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={14} /></button>
        </div>

        <div className="px-6 py-4">
          <p className="text-xs text-gray-500 mb-4">The driver info entered by the carrier does not match the actual gate check-in record.</p>
          <div className="grid grid-cols-3 gap-0 border border-gray-200 rounded-xl overflow-hidden text-xs">
            {/* Column headers */}
            <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-500">Field</div>
            <div className="bg-blue-50 px-3 py-2 font-semibold text-blue-700 border-l border-gray-200">By Carrier</div>
            <div className="bg-red-50 px-3 py-2 font-semibold text-red-700 border-l border-gray-200">By Gate</div>
            {fields.map((f, i) => {
              const differs = carrierVals[i] !== gateVals[i]
              return (
                <>
                  <div key={`f${i}`} className={`px-3 py-2.5 text-gray-600 border-t border-gray-100 ${differs ? 'bg-red-50/30' : ''}`}>{f}</div>
                  <div key={`c${i}`} className={`px-3 py-2.5 border-t border-l border-gray-100 ${differs ? 'text-red-600 font-medium bg-red-50/30' : 'text-gray-700'}`}>{carrierVals[i] || '–'}</div>
                  <div key={`g${i}`} className={`px-3 py-2.5 border-t border-l border-gray-100 ${differs ? 'text-red-600 font-medium bg-red-50/30' : 'text-gray-700'}`}>{gateVals[i] || '–'}</div>
                </>
              )
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
      <div
        className="w-[480px] bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.2s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{entry.entryId}</span>
              <StatusBadge status={entry.status} />
            </div>
            {entry.dock && <p className="text-xs text-gray-400 mt-0.5">Dock: {entry.dock}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={15} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Anomaly alert */}
          {entry.anomaly && (
            <div className={`rounded-xl px-4 py-3 flex items-start gap-3 ${entry.anomaly === 'mismatch' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
              <AlertTriangle size={15} className={`shrink-0 mt-0.5 ${entry.anomaly === 'mismatch' ? 'text-red-500' : 'text-amber-500'}`} />
              <div>
                <p className={`text-xs font-semibold ${entry.anomaly === 'mismatch' ? 'text-red-700' : 'text-amber-700'}`}>
                  {entry.anomaly === 'mismatch' ? 'Driver Mismatch Detected' : 'Location Not Filled'}
                </p>
                <p className={`text-xs mt-0.5 ${entry.anomaly === 'mismatch' ? 'text-red-600' : 'text-amber-600'}`}>
                  {entry.anomalyDetail}
                </p>
              </div>
            </div>
          )}

          {/* Check In/Out */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Clock size={12} /> Timeline</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Gate Check-in</p>
                <p className="text-sm font-medium text-gray-800">{entry.gateCheckIn || '–'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Gate Check-out</p>
                <p className="text-sm font-medium text-gray-800">{entry.gateCheckOut || '–'}</p>
              </div>
            </div>
          </section>

          {/* Driver */}
          {entry.driverName && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><User size={12} /> Driver</h3>
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                {[
                  ['Name', entry.driverName],
                  ['Phone', entry.driverPhone],
                  ['License', entry.driverLicense],
                  ['Carrier', entry.tractorCarrier],
                ].map(([label, val]) => val ? (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ) : null)}
              </div>
            </section>
          )}

          {/* Equipment */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Truck size={12} /> Equipment</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
              {[
                ['Type', entry.equipType],
                ['Tractor', entry.tractor],
                ['Trailer', entry.trailer],
                ['Container', entry.container],
                ['Freight Carrier', entry.freightCarrier],
              ].map(([label, val]) => val ? (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-800 font-medium">{val}</span>
                </div>
              ) : null)}
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1.5"><MapPin size={12} /> Location</h3>
            <div className={`rounded-xl px-4 py-3 ${entry.anomaly === 'no-location' ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
              {entry.location ? (
                <p className="text-sm font-medium text-gray-800">{entry.location}</p>
              ) : (
                <p className="text-xs text-amber-600 font-medium">Location not entered by driver</p>
              )}
            </div>
          </section>

          {/* Direction & Load */}
          {entry.loadTask && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Direction & Load</h3>
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Direction</span>
                  <span className="text-gray-800 font-medium">{entry.direction}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Load Task</span>
                  <span className="text-primary-600 font-medium">{entry.loadTask}</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform:translateX(100%) } to { transform:translateX(0) } }`}</style>
    </div>
  )
}

// ─── Entry Card (list item) ───────────────────────────────────────────────────
function EntryCard({ entry, onViewDetail, onViewMismatch }: {
  entry: EntryRecord
  onViewDetail: () => void
  onViewMismatch: () => void
}) {
  const hasAnomaly = !!entry.anomaly

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-shadow hover:shadow-md ${hasAnomaly ? 'border-red-200' : 'border-gray-200'}`}>
      {/* Card header */}
      <div className={`flex items-center justify-between px-4 py-3 ${hasAnomaly ? 'bg-red-50/60' : 'bg-gray-50'} border-b ${hasAnomaly ? 'border-red-100' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{entry.entryId}</span>
          <StatusBadge status={entry.status} />
          {entry.dock && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={11} /> {entry.dock}
            </span>
          )}
          <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{entry.customer}</span>

          {/* Anomaly badges */}
          {entry.anomaly === 'mismatch' && (
            <button
              onClick={e => { e.stopPropagation(); onViewMismatch() }}
              className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors"
            >
              <AlertTriangle size={11} /> Mismatch
            </button>
          )}
          {entry.anomaly === 'no-location' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
              <MapPin size={11} /> Location Missing
            </span>
          )}
        </div>

        <button
          onClick={onViewDetail}
          className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors shrink-0"
        >
          <Eye size={13} /> View Details
        </button>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        {/* Driver */}
        <div>
          <p className="text-gray-400 mb-1 font-medium">Driver</p>
          {entry.driverName ? (
            <p className="text-gray-700 font-medium">{entry.driverName}</p>
          ) : (
            <p className="text-gray-300 italic">–</p>
          )}
          {entry.tractorCarrier && <p className="text-gray-400 mt-0.5">{entry.tractorCarrier}</p>}
        </div>

        {/* Equipment */}
        <div>
          <p className="text-gray-400 mb-1 font-medium">Equipment</p>
          <p className="text-gray-700">{entry.equipType || '–'}</p>
          {entry.trailer && <p className="text-gray-400">Trailer: {entry.trailer}</p>}
          {entry.freightCarrier && <p className="text-gray-400">{entry.freightCarrier}</p>}
        </div>

        {/* Direction */}
        <div>
          <p className="text-gray-400 mb-1 font-medium">Direction</p>
          <p className={`font-medium ${entry.direction === 'Outbound' ? 'text-emerald-600' : entry.direction === 'Inbound' ? 'text-blue-600' : 'text-gray-600'}`}>
            {entry.direction}
          </p>
          {entry.loadTask && <p className="text-primary-500 mt-0.5 truncate">{entry.loadTask}</p>}
        </div>

        {/* Time & Location */}
        <div>
          <p className="text-gray-400 mb-1 font-medium">Gate Check-in</p>
          <p className="text-gray-700">{entry.gateCheckIn}</p>
          {entry.location ? (
            <p className="text-gray-400 mt-0.5 flex items-center gap-1"><MapPin size={10} />{entry.location}</p>
          ) : entry.anomaly === 'no-location' ? (
            <p className="text-amber-500 mt-0.5 flex items-center gap-1 font-medium"><MapPin size={10} />No location</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ─── Main Entry List Page ─────────────────────────────────────────────────────
export default function EntryList() {
  const [customer, setCustomer] = useState('All Customers')
  const [statusFilter, setStatusFilter] = useState('')
  const [anomalyFilter, setAnomalyFilter] = useState<'all' | 'anomaly-only'>('all')
  const [searchId, setSearchId] = useState('')

  const [detailEntry, setDetailEntry] = useState<EntryRecord | null>(null)
  const [mismatchEntry, setMismatchEntry] = useState<EntryRecord | null>(null)

  const filtered = MOCK_ENTRIES.filter(e => {
    if (customer !== 'All Customers' && e.customer !== customer) return false
    if (statusFilter && e.status !== statusFilter) return false
    if (anomalyFilter === 'anomaly-only' && !e.anomaly) return false
    if (searchId && !e.entryId.toLowerCase().includes(searchId.toLowerCase()) && !e.driverName.toLowerCase().includes(searchId.toLowerCase())) return false
    return true
  })

  const anomalyCount = MOCK_ENTRIES.filter(e => e.anomaly).length

  const uniqueStatuses: EntryStatus[] = Array.from(new Set(MOCK_ENTRIES.map(e => e.status)))

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yard Entry Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Read-only view of yard gate entries. Anomalies are highlighted for your attention.</p>
        </div>
        <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Anomaly banner */}
      {anomalyCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-red-700">{anomalyCount} anomal{anomalyCount > 1 ? 'ies' : 'y'} detected</span>
            <span className="text-xs text-red-500 ml-2">— driver mismatch or missing location. Click entries to view details.</span>
          </div>
          <button
            onClick={() => setAnomalyFilter(v => v === 'anomaly-only' ? 'all' : 'anomaly-only')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${anomalyFilter === 'anomaly-only' ? 'bg-red-600 text-white' : 'bg-white border border-red-200 text-red-700 hover:bg-red-100'}`}
          >
            {anomalyFilter === 'anomaly-only' ? 'Show All' : 'Show Anomalies Only'}
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
        {/* Customer selector */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-400 font-medium whitespace-nowrap">Customer</label>
          <select
            value={customer}
            onChange={e => setCustomer(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-primary-400"
          >
            {CUSTOMERS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-primary-400"
          >
            <option value="">All Status</option>
            {uniqueStatuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Entry ID / Driver search */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Search by Entry ID or Driver..."
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => { setCustomer('All Customers'); setStatusFilter(''); setAnomalyFilter('all'); setSearchId('') }}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Reset
        </button>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>{filtered.filter(e => !e.anomaly).length} Normal</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
            <AlertTriangle size={13} />
            <span>{filtered.filter(e => e.anomaly).length} Anomaly</span>
          </div>
        </div>
      </div>

      {/* Entry list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-16 flex flex-col items-center gap-3 text-gray-400">
            <Info size={32} className="text-gray-300" />
            <p className="text-sm">No entries found</p>
          </div>
        ) : (
          filtered.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onViewDetail={() => setDetailEntry(entry)}
              onViewMismatch={() => setMismatchEntry(entry)}
            />
          ))
        )}
      </div>

      {/* Detail panel */}
      {detailEntry && <EntryDetailPanel entry={detailEntry} onClose={() => setDetailEntry(null)} />}

      {/* Mismatch modal */}
      {mismatchEntry && <MismatchModal entry={mismatchEntry} onClose={() => setMismatchEntry(null)} />}
    </div>
  )
}
