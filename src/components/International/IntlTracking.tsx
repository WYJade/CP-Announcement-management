import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, AlertTriangle } from 'lucide-react'

// ─── Types & Data ────────────────────────────────────────────────────────────

interface TrackingRecord {
  id: string
  shipmentNo: string
  hbl: string
  status: string
  containers: string[]
  currentMilestone: string
  origin: string
  destination: string
  eta: string
  customer: string
  receivedTime: string
  lastUpdated: string
  hasException: boolean
  exceptionNote?: string
  phase: 'ocean' | 'customs' | 'drayage' | 'warehouse' | 'exception'
}

const TRACKING_DATA: TrackingRecord[] = [
  { id: 'SSGNS2607829', shipmentNo: 'SSHAS2608072', hbl: 'SSGNS2607829', status: 'In Transit', containers: ['WHSU8555505'], currentMilestone: 'Enroute to Deliver Load', origin: 'Haiphong, VN', destination: 'Savannah, US', eta: 'Jun 13, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 15, 2026 08:30', hasException: false, phase: 'drayage' },
  { id: 'SSHAS2608135', shipmentNo: 'SSHAS2608135', hbl: 'SSHAS2608135', status: 'At Destination', containers: ['XYLU8225020', 'SELU4350353'], currentMilestone: 'Customs Released', origin: 'Shanghai, CN', destination: 'Los Angeles, US', eta: 'Jun 01, 2026', customer: 'THE ONLY BEAN LLC', receivedTime: '-', lastUpdated: 'Jun 14, 2026 14:20', hasException: false, phase: 'customs' },
  { id: 'HLXU2608001', shipmentNo: 'SSHAS2608099', hbl: 'HLXU2608001', status: 'Booked', containers: ['HLXU3456789'], currentMilestone: 'Booked', origin: 'Ho Chi Minh, VN', destination: 'New York, US', eta: 'Jul 10, 2026', customer: 'ORGAIN LLC', receivedTime: '-', lastUpdated: 'Jun 10, 2026 09:00', hasException: false, phase: 'ocean' },
  { id: 'SSHAS2608130', shipmentNo: 'SSHAS2608130', hbl: 'SSHAS2608130', status: 'Fully Received', containers: ['ONEU8472065'], currentMilestone: 'Fully Received', origin: 'Ningbo, CN', destination: 'Long Beach, US', eta: 'May 28, 2026', customer: 'VITA COCO', receivedTime: 'Jun 05, 2026', lastUpdated: 'Jun 05, 2026 16:45', hasException: false, phase: 'warehouse' },
  { id: 'SSGNS2607900', shipmentNo: 'SSHAS2607900', hbl: 'SSGNS2607900', status: 'Exception', containers: ['FANU3191648'], currentMilestone: 'Customs Exception', origin: 'Qingdao, CN', destination: 'Savannah, US', eta: 'Jun 08, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 12, 2026 11:15', hasException: true, exceptionNote: 'CBP hold - document mismatch', phase: 'exception' },
  { id: 'SSHAS2608200', shipmentNo: 'SSHAS2608200', hbl: 'SSHAS2608200', status: 'Arrived', containers: ['MSCU7234891', 'TCKU9988776'], currentMilestone: 'Grounded / At Destination', origin: 'Shanghai, CN', destination: 'Long Beach, US', eta: 'Jun 12, 2026', customer: 'PLEASS GLOBAL', receivedTime: '-', lastUpdated: 'Jun 13, 2026 07:00', hasException: false, phase: 'customs' },
]

const PHASE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'ocean', label: 'Ocean Freight' },
  { key: 'customs', label: 'Customs Clearance' },
  { key: 'drayage', label: 'Drayage' },
  { key: 'warehouse', label: 'Warehouse Receipt' },
  { key: 'exception', label: 'Exceptions' },
]

const STATUS_PILLS = ['All', 'Booked', 'In Transit', 'Arrived', 'Customs Released', 'OFD', 'Delivered', 'Exception']

function statusColor(status: string) {
  if (status === 'Exception') return 'bg-red-100 text-red-700'
  if (status === 'Fully Received' || status === 'Delivered') return 'bg-green-100 text-green-700'
  if (status === 'In Transit' || status === 'At Destination') return 'bg-blue-100 text-blue-700'
  if (status === 'Arrived') return 'bg-indigo-100 text-indigo-700'
  if (status === 'Customs Released') return 'bg-teal-100 text-teal-700'
  return 'bg-gray-100 text-gray-600'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IntlTracking() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [phaseTab, setPhaseTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')

  const filtered = TRACKING_DATA.filter(t => {
    if (phaseTab !== 'all' && t.phase !== phaseTab) return false
    if (statusFilter !== 'All' && t.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return t.shipmentNo.toLowerCase().includes(q) || t.hbl.toLowerCase().includes(q) ||
        t.containers.some(c => c.toLowerCase().includes(q)) || t.customer.toLowerCase().includes(q)
    }
    return true
  })

  const statusCounts = STATUS_PILLS.map(s => ({
    label: s,
    count: s === 'All' ? TRACKING_DATA.length : TRACKING_DATA.filter(t => t.status === s).length,
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">End-to-End Tracking</h1>
      <p className="text-sm text-gray-500 mb-5">International logistics full-chain visibility: Supplier &rarr; Ocean &rarr; Customs &rarr; Drayage &rarr; Warehouse</p>

      {/* Phase tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {PHASE_TABS.map(tab => (
          <button key={tab.key} onClick={() => setPhaseTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              phaseTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
            {tab.key === 'exception' && TRACKING_DATA.filter(t => t.hasException).length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 rounded-full">{TRACKING_DATA.filter(t => t.hasException).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Status distribution bar */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {statusCounts.map(s => (
          <button key={s.label} onClick={() => setStatusFilter(s.label)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              statusFilter === s.label ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
            {s.label} {s.count > 0 && <span className="ml-1 text-[10px] opacity-70">{s.count}</span>}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Shipment No., HBL, MBL, BOL, Container No., Load#..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"><option>Status</option></select>
        <input type="text" placeholder="Date Range" className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-32" />
        <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"><option>Origin</option></select>
        <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"><option>Destination</option></select>
        <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"><option>Customer</option></select>
        <label className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap">
          <input type="checkbox" className="rounded text-red-500" /> Exception Only
        </label>
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 text-xs font-medium rounded-md border ${viewMode === 'table' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-200 text-gray-500'}`}>Table View</button>
          <button onClick={() => setViewMode('card')} className={`px-3 py-1.5 text-xs font-medium rounded-md border ${viewMode === 'card' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-200 text-gray-500'}`}>Card View</button>
        </div>
        <span className="text-xs text-gray-400">{filtered.length} shipments</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Shipment No. / HBL', 'Status', 'Container(s)', 'Current Milestone', 'Origin', 'Destination', 'ETA (ARV)', 'Customer', 'Received Time', 'Last Updated', 'Action'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${row.hasException ? 'bg-red-50/50' : ''}`}>
                  <td className="py-3 px-3">
                    <p className="text-xs font-medium text-primary-600 cursor-pointer hover:underline" onClick={() => navigate(`/international/tracking/${row.id}`)}>{row.shipmentNo}</p>
                    <p className="text-[10px] text-gray-400">{row.hbl}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(row.status)}`}>
                      {row.hasException && <AlertTriangle size={9} />}{row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-700 font-mono">{row.containers.join(', ')}</td>
                  <td className="py-3 px-3 text-xs text-gray-700">{row.currentMilestone}</td>
                  <td className="py-3 px-3 text-xs text-gray-600">{row.origin}</td>
                  <td className="py-3 px-3 text-xs text-gray-600">{row.destination}</td>
                  <td className="py-3 px-3 text-xs text-gray-600">{row.eta}</td>
                  <td className="py-3 px-3 text-xs text-gray-700">{row.customer}</td>
                  <td className="py-3 px-3 text-xs text-gray-500">{row.receivedTime}</td>
                  <td className="py-3 px-3 text-xs text-gray-400">{row.lastUpdated}</td>
                  <td className="py-3 px-3">
                    <button onClick={() => navigate(`/international/tracking/${row.id}`)} className="text-xs text-primary-600 hover:underline">Detail</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center py-10 text-gray-400 text-sm">No shipments match your criteria</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
