import { useState } from 'react'
import { Search, Download, X, MapPin, Truck, CheckCircle2, Filter, UploadCloud } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShipmentRow {
  pro: string; pu: string; po: string; status: string
  origin: string; destination: string; scheduledDelivery: string; customer: string
}

type ShipType = 'ltl' | 'parcel'

// ─── Status tabs config ───────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: 'all',               label: 'All' },
  { key: 'new',               label: 'New' },
  { key: 'pickup-dispatched', label: 'Pickup Dispatched' },
  { key: 'pickup-completed',  label: 'Pickup Completed' },
  { key: 'in-transit',        label: 'In Transit' },
  { key: 'ofd',               label: 'OFD' },
  { key: 'delivered',         label: 'Delivered' },
]

// ─── Mock data ────────────────────────────────────────────────────────────────
const LTL_ROWS: ShipmentRow[] = [
  { pro: '',           pu: 'DO00066240', po: '', status: 'Linehaul',        origin: 'WEST CHICAGO IL 60185', destination: 'FONTANA CA 92336', scheduledDelivery: '',           customer: 'MOITCE01' },
  { pro: '',           pu: 'DO00066239', po: '', status: 'New',             origin: 'WEST CHICAGO IL 60185', destination: 'FONTANA CA 92336', scheduledDelivery: '',           customer: 'MOITCE01' },
  { pro: '',           pu: 'DO00066238', po: '', status: 'Delivered',       origin: 'WEST CHICAGO IL 60185', destination: 'FONTANA CA 92336', scheduledDelivery: '',           customer: 'MOITCE01' },
  { pro: '',           pu: 'DO00066237', po: '', status: 'Pending Delivery', origin: 'WEST CHICAGO IL 60185', destination: 'FONTANA CA 92336', scheduledDelivery: '',          customer: 'MOITCE01' },
  { pro: '',           pu: 'DO00066236', po: '', status: 'Delivered',       origin: 'WEST CHICAGO IL 60185', destination: 'FONTANA CA 92336', scheduledDelivery: '',           customer: 'MOITCE01' },
  { pro: '16900000816', pu: 'DO00066235', po: '', status: 'New',            origin: 'Bolingbrook IL 60490',  destination: 'Chicago IL 60606',   scheduledDelivery: '',          customer: 'MOITCE01' },
  { pro: '',           pu: 'DO00066234', po: '', status: 'Pickup Dispatched', origin: 'WEST CHICAGO IL 60185', destination: 'LOS ANGELES CA 90001', scheduledDelivery: '07/15/2026', customer: 'MOITCE01' },
  { pro: 'ULX0005271', pu: 'DO00066233', po: 'PO-77821', status: 'In Transit', origin: 'CHICAGO IL 60601', destination: 'PHOENIX AZ 85001', scheduledDelivery: '07/12/2026',   customer: 'MOITCE01' },
]

const PARCEL_ROWS: ShipmentRow[] = [
  { pro: '', pu: 'DO00038585', po: '', status: 'New', origin: 'Beverly Hills CA 90210', destination: 'Las Vegas NV 89119',  scheduledDelivery: '', customer: 'NELSCY01' },
  { pro: '', pu: 'DO00038539', po: '', status: 'New', origin: 'Houston TX 77002',        destination: 'Houston TX 77003',     scheduledDelivery: '', customer: 'NELSCY01' },
  { pro: '', pu: 'DO00038512', po: '', status: 'New', origin: 'Houston TX 77002',        destination: 'Houston TX 77003',     scheduledDelivery: '', customer: 'NELSCY01' },
  { pro: '', pu: 'DO00038409', po: '', status: 'New', origin: 'Beverly Hills CA 90210', destination: 'Las Vegas NV 89119',  scheduledDelivery: '', customer: 'NELSCY01' },
  { pro: '', pu: 'DO00037807', po: '', status: 'New', origin: 'Houston TX 77002',        destination: 'Houston TX 77003',     scheduledDelivery: '', customer: 'NELSCY01' },
]

// ─── Status color helper ──────────────────────────────────────────────────────
function statusColor(status: string): string {
  if (!status) return 'text-gray-400'
  const s = status.toLowerCase()
  if (s === 'delivered')                        return 'text-emerald-600'
  if (s === 'in transit' || s === 'linehaul')   return 'text-blue-600'
  if (s.includes('pending') || s === 'ofd')     return 'text-orange-500'
  if (s.includes('pickup') || s === 'new')      return 'text-violet-600'
  return 'text-primary-600'
}

// ─── Tracking steps ───────────────────────────────────────────────────────────
const TRACKING_STEPS = ['New', 'Pickup Dispatched', 'Pickup Completed', 'In Transit', 'Out for Delivery', 'Delivered']

function getStepIndex(status: string): number {
  const s = (status || '').toLowerCase()
  if (s === 'delivered')                                  return 5
  if (s === 'out for delivery' || s === 'ofd' || s.includes('pending')) return 4
  if (s === 'in transit' || s === 'unloaded' || s === 'linehaul') return 3
  if (s.includes('pickup') && s.includes('compl'))        return 2
  if (s.includes('pickup'))                               return 1
  return 0
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function TrackingDetailPanel({ row, onClose }: { row: ShipmentRow; onClose: () => void }) {
  const stepIdx = getStepIndex(row.status)
  return (
    <div className="w-[360px] border-l border-gray-200 bg-white overflow-y-auto shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">PU: {row.pu}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={14} /></button>
      </div>
      {/* Progress */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex mb-1">
          {TRACKING_STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 ${i === 0 ? 'rounded-l-full' : ''} ${i === TRACKING_STEPS.length - 1 ? 'rounded-r-full' : ''} ${i <= stepIdx ? 'bg-primary-500' : 'bg-gray-200'}`} />
          ))}
        </div>
        <div className="flex justify-between">
          {TRACKING_STEPS.map((s, i) => (
            <span key={s} className={`text-[9px] ${i <= stepIdx ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>
              {s.replace('Pickup ', 'P.').replace('Out for Delivery', 'OFD')}
            </span>
          ))}
        </div>
      </div>
      {/* Map placeholder */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-44 flex items-center justify-center border border-gray-100">
          <div className="flex items-center gap-8 w-full px-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-1">
                <MapPin size={13} className="text-white" />
              </div>
              <p className="text-[10px] font-medium text-gray-700">{row.origin.split(' ').slice(0,2).join(' ')}</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-primary-300 relative">
              <Truck size={14} className="text-primary-600 absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white" />
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                <MapPin size={13} className="text-white" />
              </div>
              <p className="text-[10px] font-medium text-gray-700">{row.destination.split(' ').slice(0,2).join(' ')}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Info grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 text-xs border-b border-gray-100 pb-3 mb-3">
          <div><p className="text-gray-400 mb-0.5">Status</p><p className={`font-semibold ${statusColor(row.status)}`}>{row.status || 'New'}</p></div>
          <div><p className="text-gray-400 mb-0.5">Customer</p><p className="font-medium text-gray-700">{row.customer}</p></div>
          <div><p className="text-gray-400 mb-0.5">Origin</p><p className="font-medium text-gray-700 leading-snug">{row.origin}</p></div>
          <div><p className="text-gray-400 mb-0.5">Destination</p><p className="font-medium text-gray-700 leading-snug">{row.destination}</p></div>
          {row.scheduledDelivery && <div><p className="text-gray-400 mb-0.5">Scheduled Delivery</p><p className="font-medium text-gray-700">{row.scheduledDelivery}</p></div>}
        </div>
        <p className="text-xs font-semibold text-gray-900 mb-2">Activity</p>
        <div className="space-y-2.5">
          {stepIdx >= 2 && (
            <div className="flex gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={11} className="text-green-600" /></div>
              <div><p className="text-xs font-medium text-gray-800">Pickup Completed</p><p className="text-[11px] text-gray-400">Carrier picked up at origin · 06/24 14:30</p></div>
            </div>
          )}
          {stepIdx >= 1 && (
            <div className="flex gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={11} className="text-green-600" /></div>
              <div><p className="text-xs font-medium text-gray-800">Pickup Dispatched</p><p className="text-[11px] text-gray-400">Carrier assigned and en route · 06/24 10:00</p></div>
            </div>
          )}
          <div className="flex gap-2.5">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><MapPin size={11} className="text-blue-600" /></div>
            <div><p className="text-xs font-medium text-gray-800">Order Created</p><p className="text-[11px] text-gray-400">Shipment order created · 06/24 08:00</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Tracking() {
  const [shipType, setShipType] = useState<ShipType>('ltl')
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [selectedRow, setSelectedRow] = useState<ShipmentRow | null>(null)

  const rows = shipType === 'ltl' ? LTL_ROWS : PARCEL_ROWS

  // Count per status tab
  const counts: Record<string, number> = { all: rows.length }
  STATUS_TABS.slice(1).forEach(tab => {
    counts[tab.key] = rows.filter(r => r.status.toLowerCase().replace(/ /g, '-') === tab.key || r.status.toLowerCase() === tab.label.toLowerCase()).length
  })

  return (
    <div className="p-6">

      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Domestic Tracking</h1>
      </div>

      {/* LTL / Small Parcel tabs — pill style like screenshot */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => { setShipType('ltl'); setActiveTab('all'); setSelectedRow(null) }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${shipType === 'ltl' ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          <Truck size={14} /> LTL Shipment
        </button>
        <button
          onClick={() => { setShipType('parcel'); setActiveTab('all'); setSelectedRow(null) }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${shipType === 'parcel' ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          <Download size={14} /> Small Parcel
        </button>
      </div>

      {/* Status pill bar — matches screenshot exactly */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            {tab.label} {counts[tab.key] ?? 0}
          </button>
        ))}
      </div>

      {/* Search bar — matches screenshot layout */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <input type="text" placeholder="Search up to 20 Tracking IDs (PRO, PU, PO)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-400" />
        </div>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400 min-w-[80px]">
          <option>All</option>
          <option>New</option>
          <option>In Transit</option>
          <option>Delivered</option>
        </select>
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-pointer hover:border-gray-300 min-w-[160px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Pick a date range
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter size={14} /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
          <Search size={14} /> Search
        </button>
      </div>

      {/* View toggle + Download / Batch Import */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
          <button onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
            ⊞ Table View
          </button>
          <button onClick={() => setViewMode('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
            ⊟ Card View
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
            <Download size={12} /> Download
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
            <UploadCloud size={12} /> Batch Import
          </button>
        </div>
      </div>

      {/* Table + Detail Panel */}
      <div className="flex gap-0 rounded-xl overflow-hidden border border-gray-200">
        <div className={`bg-white overflow-hidden ${selectedRow ? 'flex-1' : 'w-full'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-9 py-3 px-3"><input type="checkbox" className="rounded border-gray-300" /></th>
                {['Pro', 'PU #', 'PO #', 'Status', 'Origin', 'Destination', 'Scheduled Delivery', 'Customer'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} onClick={() => setSelectedRow(selectedRow?.pu === row.pu ? null : row)}
                  className={`border-b border-gray-50 cursor-pointer transition-colors ${selectedRow?.pu === row.pu ? 'bg-primary-50/60' : 'hover:bg-gray-50/80'}`}>
                  <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-400" />
                  </td>
                  <td className="py-3 px-3 text-gray-500 font-mono text-xs">{row.pro || ''}</td>
                  <td className="py-3 px-3 text-gray-700 font-mono text-xs">{row.pu}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{row.po || ''}</td>
                  <td className="py-3 px-3">
                    {row.status && <span className={`text-xs font-medium ${statusColor(row.status)}`}>{row.status}</span>}
                  </td>
                  <td className="py-3 px-3 text-gray-700 text-xs">{row.origin}</td>
                  <td className="py-3 px-3 text-gray-700 text-xs">{row.destination}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{row.scheduledDelivery || ''}</td>
                  <td className="py-3 px-3 text-gray-700 text-xs">{row.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>0 of {rows.length} row(s) selected</span>
            <div className="flex items-center gap-3">
              <span>Rows per page: <select className="border-none outline-none bg-transparent font-medium text-gray-700 ml-1"><option>10</option><option>20</option><option>50</option></select></span>
              <span>Page 1 of 1</span>
              <div className="flex items-center gap-1">
                {['«','‹','›','»'].map(a => (
                  <button key={a} className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-400 text-[11px]">{a}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedRow && <TrackingDetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} />}
      </div>
    </div>
  )
}
