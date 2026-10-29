import { useState } from 'react'
import {
  Search, Download, Filter, SlidersHorizontal,
  X, MapPin, Truck, CheckCircle2, UploadCloud,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type ShipType = 'ltl' | 'parcel'
type ViewMode = 'table' | 'card'

interface Shipment {
  id: string
  customer: string
  pu: string
  pro: string
  po: string
  origin: string
  pickupDate: string
  destination: string
  deliveryDate: string
  status: string
}

// ─── Status tabs ──────────────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: 'all',               label: 'All' },
  { key: 'new',               label: 'New' },
  { key: 'pickup-dispatched', label: 'Pickup Dispatched' },
  { key: 'pickup-completed',  label: 'Pickup Completed' },
  { key: 'in-transit',        label: 'In Transit' },
  { key: 'ofd',               label: 'Out For Delivery' },
  { key: 'delivered',         label: 'Delivered' },
]

// ─── Mock data — LTL ─────────────────────────────────────────────────────────
const LTL_DATA: Shipment[] = [
  { id: 'l1',  customer: 'SAMUN00',  pu: 'DO00337537', pro: '19090466',  po: '',          origin: 'ONTARIO, CA',       pickupDate: '08/24/2026', destination: 'SPARKS, NV',       deliveryDate: '-',           status: 'New' },
  { id: 'l2',  customer: 'SAMUN00',  pu: 'DO00337513', pro: '19084022',  po: '',          origin: 'ONTARIO, CA',       pickupDate: '08/19/2026', destination: 'FRENCH CAMP, CA',  deliveryDate: '-',           status: 'New' },
  { id: 'l3',  customer: 'SAMUN00',  pu: 'DO00337475', pro: '19080814',  po: '',          origin: 'HOUSTON, TX',       pickupDate: '08/19/2026', destination: 'COPPELL, TX',      deliveryDate: '-',           status: 'New' },
  { id: 'l4',  customer: 'SAMUN00',  pu: 'DO00337473', pro: '19080271',  po: '',          origin: 'VISTA, CA',         pickupDate: '08/19/2026', destination: 'FULLERTON, CA',    deliveryDate: '-',           status: 'New' },
  { id: 'l5',  customer: 'SAMUN00',  pu: 'DO00337431', pro: '19080372',  po: '',          origin: 'FULLERTON, CA',     pickupDate: '08/21/2026', destination: 'ONTARIO, CA',      deliveryDate: '-',           status: 'New' },
  { id: 'l6',  customer: 'MOITCE01', pu: 'DO00066240', pro: '',          po: '',          origin: 'WEST CHICAGO, IL',  pickupDate: '07/10/2026', destination: 'FONTANA, CA',      deliveryDate: '-',           status: 'Linehaul' },
  { id: 'l7',  customer: 'MOITCE01', pu: 'DO00066237', pro: '',          po: '',          origin: 'WEST CHICAGO, IL',  pickupDate: '07/08/2026', destination: 'FONTANA, CA',      deliveryDate: '-',           status: 'Pending Delivery' },
  { id: 'l8',  customer: 'MOITCE01', pu: 'DO00066234', pro: '',          po: '',          origin: 'WEST CHICAGO, IL',  pickupDate: '07/05/2026', destination: 'LOS ANGELES, CA', deliveryDate: '07/15/2026',  status: 'Pickup Dispatched' },
  { id: 'l9',  customer: 'MOITCE01', pu: 'DO00066233', pro: 'ULX0005271',po: 'PO-77821', origin: 'CHICAGO, IL',        pickupDate: '07/03/2026', destination: 'PHOENIX, AZ',     deliveryDate: '07/12/2026',  status: 'In Transit' },
  { id: 'l10', customer: 'SAMUN00',  pu: 'DO00337420', pro: '19080190',  po: '',          origin: 'ONTARIO, CA',       pickupDate: '08/22/2026', destination: 'SPARKS, NV',       deliveryDate: '08/27/2026',  status: 'Delivered' },
  { id: 'l11', customer: 'SAMUN00',  pu: 'DO00337400', pro: '19077500',  po: '',          origin: 'CHICAGO, IL',       pickupDate: '08/18/2026', destination: 'MIAMI, FL',        deliveryDate: '-',           status: 'Out For Delivery' },
  { id: 'l12', customer: 'MOITCE01', pu: 'DO00066238', pro: '',          po: '',          origin: 'WEST CHICAGO, IL',  pickupDate: '07/01/2026', destination: 'FONTANA, CA',      deliveryDate: '07/08/2026',  status: 'Delivered' },
]

// ─── Mock data — Parcel ───────────────────────────────────────────────────────
const PARCEL_DATA: Shipment[] = [
  { id: 'p1', customer: 'NELSCY01', pu: 'DO00038585', pro: '', po: '', origin: 'BEVERLY HILLS, CA', pickupDate: '08/10/2026', destination: 'LAS VEGAS, NV',  deliveryDate: '-',           status: 'New' },
  { id: 'p2', customer: 'NELSCY01', pu: 'DO00038539', pro: '', po: '', origin: 'HOUSTON, TX',        pickupDate: '08/08/2026', destination: 'HOUSTON, TX',    deliveryDate: '-',           status: 'New' },
  { id: 'p3', customer: 'NELSCY01', pu: 'DO00038512', pro: '', po: '', origin: 'HOUSTON, TX',        pickupDate: '08/06/2026', destination: 'HOUSTON, TX',    deliveryDate: '-',           status: 'New' },
  { id: 'p4', customer: 'NELSCY01', pu: 'DO00038409', pro: '', po: '', origin: 'BEVERLY HILLS, CA', pickupDate: '08/03/2026', destination: 'LAS VEGAS, NV',  deliveryDate: '08/12/2026',  status: 'Delivered' },
  { id: 'p5', customer: 'NELSCY01', pu: 'DO00037807', pro: '', po: '', origin: 'HOUSTON, TX',        pickupDate: '07/28/2026', destination: 'HOUSTON, TX',    deliveryDate: '-',           status: 'In Transit' },
]

// ─── Tracking steps ───────────────────────────────────────────────────────────
const TRACKING_STEPS = ['New', 'Pickup Dispatched', 'Pickup Completed', 'In Transit', 'Out for Delivery', 'Delivered']

function getStepIndex(status: string): number {
  const s = (status || '').toLowerCase()
  if (s === 'delivered')                                           return 5
  if (s === 'out for delivery' || s === 'ofd' || s.includes('pending')) return 4
  if (s === 'in transit' || s === 'unloaded' || s === 'linehaul') return 3
  if (s.includes('pickup') && s.includes('compl'))                return 2
  if (s.includes('pickup'))                                        return 1
  return 0
}

// ─── Status color ─────────────────────────────────────────────────────────────
function statusColor(status: string): string {
  if (!status) return 'text-gray-400'
  const s = status.toLowerCase()
  if (s === 'delivered')                              return 'text-emerald-600'
  if (s === 'in transit' || s === 'linehaul')        return 'text-blue-600'
  if (s.includes('pending') || s === 'ofd' || s === 'out for delivery') return 'text-orange-500'
  if (s.includes('pickup'))                           return 'text-indigo-600'
  if (s === 'new')                                    return 'text-violet-600'
  return 'text-primary-600'
}

function statusMatch(status: string, tabKey: string): boolean {
  if (tabKey === 'all') return true
  const s = status.toLowerCase()
  if (tabKey === 'new')               return s === 'new'
  if (tabKey === 'pickup-dispatched') return s.includes('pickup') && !s.includes('compl')
  if (tabKey === 'pickup-completed')  return s.includes('pickup') && s.includes('compl')
  if (tabKey === 'in-transit')        return s === 'in transit' || s === 'linehaul'
  if (tabKey === 'ofd')               return s === 'out for delivery' || s === 'ofd' || s.includes('pending')
  if (tabKey === 'delivered')         return s === 'delivered'
  return false
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function TrackingDetailPanel({ row, onClose }: { row: Shipment; onClose: () => void }) {
  const stepIdx = getStepIndex(row.status)
  return (
    <div className="w-[360px] border-l border-gray-200 bg-white overflow-y-auto shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div>
          <p className="text-sm font-bold text-gray-900">PU: {row.pu}</p>
          {row.pro && <p className="text-xs text-gray-400 mt-0.5">PRO: {row.pro}</p>}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex mb-1.5">
          {TRACKING_STEPS.map((_, i) => (
            <div
              key={i}
              className={[
                'flex-1 h-1.5',
                i === 0 ? 'rounded-l-full' : '',
                i === TRACKING_STEPS.length - 1 ? 'rounded-r-full' : '',
                i <= stepIdx ? 'bg-primary-500' : 'bg-gray-200',
              ].join(' ')}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {TRACKING_STEPS.map((s, i) => (
            <span key={s} className={`text-[9px] font-medium ${i <= stepIdx ? 'text-primary-600' : 'text-gray-400'}`}>
              {s.replace('Pickup ', 'P.').replace('Out for Delivery', 'OFD')}
            </span>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-44 flex items-center justify-center border border-gray-100 relative overflow-hidden">
          <div className="flex items-center gap-8 w-full px-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-1">
                <MapPin size={13} className="text-white" />
              </div>
              <p className="text-[10px] font-medium text-gray-700 leading-snug">{row.origin.split(',')[0]}</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-primary-300 relative">
              <Truck size={14} className="text-primary-600 absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-0.5" />
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                <MapPin size={13} className="text-white" />
              </div>
              <p className="text-[10px] font-medium text-gray-700 leading-snug">{row.destination.split(',')[0]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 text-xs border-b border-gray-100 pb-3 mb-3">
          <div>
            <p className="text-gray-400 mb-0.5">Status</p>
            <p className={`font-semibold ${statusColor(row.status)}`}>{row.status || 'New'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Customer</p>
            <p className="font-medium text-gray-700">{row.customer}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Origin</p>
            <p className="font-medium text-gray-700 leading-snug">{row.origin}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Destination</p>
            <p className="font-medium text-gray-700 leading-snug">{row.destination}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Pickup Date</p>
            <p className="font-medium text-gray-700">{row.pickupDate}</p>
          </div>
          {row.deliveryDate && row.deliveryDate !== '-' && (
            <div>
              <p className="text-gray-400 mb-0.5">Delivery Date</p>
              <p className="font-medium text-gray-700">{row.deliveryDate}</p>
            </div>
          )}
          {row.pro && (
            <div>
              <p className="text-gray-400 mb-0.5">PRO#</p>
              <p className="font-medium text-gray-700">{row.pro}</p>
            </div>
          )}
          {row.po && (
            <div>
              <p className="text-gray-400 mb-0.5">PO#</p>
              <p className="font-medium text-gray-700">{row.po}</p>
            </div>
          )}
        </div>

        {/* Activity timeline */}
        <p className="text-xs font-semibold text-gray-900 mb-2">Activity</p>
        <div className="space-y-2.5">
          {stepIdx >= 2 && (
            <div className="flex gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={11} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">Pickup Completed</p>
                <p className="text-[11px] text-gray-400">Carrier picked up at origin · 06/24 14:30</p>
              </div>
            </div>
          )}
          {stepIdx >= 1 && (
            <div className="flex gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={11} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">Pickup Dispatched</p>
                <p className="text-[11px] text-gray-400">Carrier assigned and en route · 06/24 10:00</p>
              </div>
            </div>
          )}
          <div className="flex gap-2.5">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={11} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800">Order Created</p>
              <p className="text-[11px] text-gray-400">Shipment order created · 06/24 08:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShipmentsList() {
  const [shipType, setShipType]     = useState<ShipType>('ltl')
  const [activeTab, setActiveTab]   = useState('all')
  const [viewMode, setViewMode]     = useState<ViewMode>('table')
  const [search, setSearch]         = useState('')
  const [selectedRow, setSelectedRow] = useState<Shipment | null>(null)

  const allRows = shipType === 'ltl' ? LTL_DATA : PARCEL_DATA

  // Status tab counts
  const counts: Record<string, number> = { all: allRows.length }
  STATUS_TABS.slice(1).forEach(tab => {
    counts[tab.key] = allRows.filter(r => statusMatch(r.status, tab.key)).length
  })

  const filtered = allRows.filter(r => {
    if (!statusMatch(r.status, activeTab)) return false
    if (search && !r.pu.toLowerCase().includes(search.toLowerCase())
               && !r.pro.toLowerCase().includes(search.toLowerCase())
               && !r.customer.toLowerCase().includes(search.toLowerCase())
               && !r.po.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setSelectedRow(null)
  }

  const handleTypeChange = (t: ShipType) => {
    setShipType(t)
    setActiveTab('all')
    setSelectedRow(null)
  }

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">Domestic Tracking</h1>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Request Quote
        </button>
      </div>

      {/* ── Ship type toggle — pill style ── */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => handleTypeChange('ltl')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            shipType === 'ltl'
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Truck size={14} /> LTL Shipment
        </button>
        <button
          onClick={() => handleTypeChange('parcel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            shipType === 'parcel'
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Download size={14} /> Small Parcel
        </button>
      </div>

      {/* ── Status pill bar ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label} <span className="ml-0.5 opacity-80">{counts[tab.key] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* ── Search & filter row ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search PRO, PU, PO or Customer"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-400"
          />
        </div>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-primary-400">
          <option>All Origins</option>
          <option>ONTARIO, CA</option>
          <option>FULLERTON, CA</option>
          <option>HOUSTON, TX</option>
          <option>CHICAGO, IL</option>
        </select>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-primary-400">
          <option>All Destinations</option>
          <option>SPARKS, NV</option>
          <option>FRENCH CAMP, CA</option>
          <option>COPPELL, TX</option>
          <option>PHOENIX, AZ</option>
        </select>
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-pointer hover:border-gray-300 min-w-[160px]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Pick a date range
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Search size={13} /> Search
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <SlidersHorizontal size={13} /> Holds
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <Filter size={13} /> Filter
          </button>
        </div>
      </div>

      {/* ── View toggle + action buttons ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⊞ Table View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'card' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⊟ Card View
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <UploadCloud size={12} /> Batch Import
          </button>
        </div>
      </div>

      {/* ── Table + Detail Panel ── */}
      {viewMode === 'table' ? (
        <div className="flex gap-0 rounded-xl overflow-hidden border border-gray-200">
          {/* Table */}
          <div className={`bg-white overflow-hidden ${selectedRow ? 'flex-1 min-w-0' : 'w-full'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-9 px-3 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    {['Customer', 'PU #', 'PRO #', 'PO #', 'Origin', 'Pickup Date', 'Destination', 'Delivery Date', 'Status'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">
                        No shipments found
                      </td>
                    </tr>
                  ) : filtered.map(s => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedRow(selectedRow?.id === s.id ? null : s)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${
                        selectedRow?.id === s.id ? 'bg-primary-50/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-400" />
                      </td>
                      <td className="px-3 py-3 text-gray-700">{s.customer}</td>
                      <td className="px-3 py-3 text-gray-700 font-mono">{s.pu}</td>
                      <td className="px-3 py-3 text-gray-500 font-mono">{s.pro || '—'}</td>
                      <td className="px-3 py-3 text-gray-400 font-mono">{s.po || '—'}</td>
                      <td className="px-3 py-3 text-gray-700 uppercase text-[10px] tracking-wide">{s.origin}</td>
                      <td className="px-3 py-3 text-gray-600">{s.pickupDate}</td>
                      <td className="px-3 py-3 text-gray-700 uppercase text-[10px] tracking-wide">{s.destination}</td>
                      <td className="px-3 py-3 text-gray-500">{s.deliveryDate}</td>
                      <td className="px-3 py-3">
                        <span className={`font-medium ${statusColor(s.status)}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              <span>0 of {filtered.length} row(s) selected</span>
              <div className="flex items-center gap-3">
                <span>
                  Rows per page:{' '}
                  <select className="border-none outline-none bg-transparent font-medium text-gray-700 ml-1">
                    <option>10</option><option>20</option><option>50</option>
                  </select>
                </span>
                <span>Page 1 of 1</span>
                <div className="flex items-center gap-1">
                  {['«', '‹', '›', '»'].map(a => (
                    <button key={a} className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-400 text-[11px]">
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedRow && (
            <TrackingDetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} />
          )}
        </div>
      ) : (
        /* ── Card View ── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
              No shipments found
            </div>
          ) : filtered.map(s => {
            const stepIdx = getStepIndex(s.status)
            return (
              <div
                key={s.id}
                onClick={() => setSelectedRow(selectedRow?.id === s.id ? null : s)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedRow?.id === s.id ? 'border-primary-400 ring-1 ring-primary-200' : 'border-gray-200'
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900 font-mono">{s.pu}</p>
                    {s.pro && <p className="text-xs text-gray-400 mt-0.5 font-mono">PRO: {s.pro}</p>}
                  </div>
                  <span className={`text-xs font-semibold ${statusColor(s.status)}`}>{s.status}</span>
                </div>

                {/* Progress bar */}
                <div className="flex mb-1">
                  {TRACKING_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={[
                        'flex-1 h-1',
                        i === 0 ? 'rounded-l-full' : '',
                        i === TRACKING_STEPS.length - 1 ? 'rounded-r-full' : '',
                        i <= stepIdx ? 'bg-primary-500' : 'bg-gray-200',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 mb-3">{TRACKING_STEPS[stepIdx]}</p>

                {/* Route */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <MapPin size={11} className="text-gray-400 shrink-0" />
                  <span className="truncate">{s.origin}</span>
                  <span className="text-gray-300 shrink-0">→</span>
                  <MapPin size={11} className="text-red-400 shrink-0" />
                  <span className="truncate">{s.destination}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2.5 border-t border-gray-100">
                  <span>{s.customer}</span>
                  <span>Pickup: {s.pickupDate}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Card view detail panel — shown as bottom drawer when card view active */}
      {viewMode === 'card' && selectedRow && (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
          <TrackingDetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} />
        </div>
      )}
    </div>
  )
}
