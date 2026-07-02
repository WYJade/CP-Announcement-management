import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
}

const TRACKING_DATA: TrackingRecord[] = [
  { id: 'SSGNS2607829', shipmentNo: 'SSHAS2608072', hbl: 'SSGNS2607829', status: 'Dispatched', containers: ['WHSU8555505'], currentMilestone: 'Enroute to Deliver Load', origin: 'Haiphong, VN', destination: 'Savannah, US', eta: 'Jun 13, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 15, 2026 08:30', hasException: false },
  { id: 'SSHAS2608135', shipmentNo: 'SSHAS2608135', hbl: 'SSHAS2608135', status: 'Customs Released', containers: ['XYLU8225020', 'SELU4350353'], currentMilestone: 'Customs Released', origin: 'Shanghai, CN', destination: 'Los Angeles, US', eta: 'Jun 01, 2026', customer: 'THE ONLY BEAN LLC', receivedTime: '-', lastUpdated: 'Jun 14, 2026 14:20', hasException: false },
  { id: 'HLXU2608001', shipmentNo: 'SSHAS2608099', hbl: 'HLXU2608001', status: 'Booked', containers: ['HLXU3456789'], currentMilestone: 'Booked', origin: 'Ho Chi Minh, VN', destination: 'New York, US', eta: 'Jul 10, 2026', customer: 'ORGAIN LLC', receivedTime: '-', lastUpdated: 'Jun 10, 2026 09:00', hasException: false },
  { id: 'SSHAS2608130', shipmentNo: 'SSHAS2608130', hbl: 'SSHAS2608130', status: 'Received', containers: ['ONEU8472065'], currentMilestone: 'Received', origin: 'Ningbo, CN', destination: 'Long Beach, US', eta: 'May 28, 2026', customer: 'VITA COCO', receivedTime: 'Jun 05, 2026', lastUpdated: 'Jun 05, 2026 16:45', hasException: false },
  { id: 'SSGNS2607900', shipmentNo: 'SSHAS2607900', hbl: 'SSGNS2607900', status: 'Exception', containers: ['FANU3191648'], currentMilestone: 'Customs Exception', origin: 'Qingdao, CN', destination: 'Savannah, US', eta: 'Jun 08, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 12, 2026 11:15', hasException: true, exceptionNote: 'CBP hold - document mismatch' },
  { id: 'SSHAS2608200', shipmentNo: 'SSHAS2608200', hbl: 'SSHAS2608200', status: 'Arrived', containers: ['MSCU7234891', 'TCKU9988776'], currentMilestone: 'Grounded / At Destination', origin: 'Shanghai, CN', destination: 'Long Beach, US', eta: 'Jun 12, 2026', customer: 'PLEASS GLOBAL', receivedTime: '-', lastUpdated: 'Jun 13, 2026 07:00', hasException: false },
  { id: 'SSHAS2608250', shipmentNo: 'SSHAS2608250', hbl: 'SSHAS2608250', status: 'In Transit', containers: ['CMAU5567890'], currentMilestone: 'In Transit', origin: 'Shenzhen, CN', destination: 'Savannah, US', eta: 'Jun 25, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 14, 2026 10:00', hasException: false },
  { id: 'SSHAS2608260', shipmentNo: 'SSHAS2608260', hbl: 'SSHAS2608260', status: 'OFD', containers: ['TRLU7494622'], currentMilestone: 'Out for Delivery', origin: 'Ningbo, CN', destination: 'Long Beach, US', eta: 'Jun 10, 2026', customer: 'ORGAIN LLC', receivedTime: '-', lastUpdated: 'Jun 15, 2026 06:00', hasException: false },
  { id: 'SSHAS2608270', shipmentNo: 'SSHAS2608270', hbl: 'SSHAS2608270', status: 'Delivered', containers: ['KKFU9159476'], currentMilestone: 'Delivered to Warehouse', origin: 'Shanghai, CN', destination: 'Long Beach, US', eta: 'Jun 08, 2026', customer: 'VITA COCO', receivedTime: '-', lastUpdated: 'Jun 14, 2026 15:30', hasException: false },
  { id: 'SSHAS2608280', shipmentNo: 'SSHAS2608280', hbl: 'SSHAS2608280', status: 'Available', containers: ['NYKU4064208'], currentMilestone: 'Available for Pickup', origin: 'Qingdao, CN', destination: 'Savannah, US', eta: 'Jun 11, 2026', customer: 'THE ONLY BEAN LLC', receivedTime: '-', lastUpdated: 'Jun 13, 2026 12:00', hasException: false },
  { id: 'SSHAS2608290', shipmentNo: 'SSHAS2608290', hbl: 'SSHAS2608290', status: 'Receiving', containers: ['HAMU1732295'], currentMilestone: 'Warehouse Receiving', origin: 'Shanghai, CN', destination: 'Savannah, US', eta: 'Jun 05, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 15, 2026 09:30', hasException: false },
]

function statusColor(status: string) {
  if (status === 'Exception') return 'bg-red-100 text-red-700'
  if (status === 'Received') return 'bg-green-100 text-green-700'
  if (status === 'Receiving') return 'bg-lime-100 text-lime-700'
  if (status === 'Delivered') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Returned') return 'bg-slate-100 text-slate-700'
  if (status === 'In Transit') return 'bg-blue-100 text-blue-700'
  if (status === 'Arrived') return 'bg-indigo-100 text-indigo-700'
  if (status === 'Customs Released') return 'bg-teal-100 text-teal-700'
  if (status === 'Available') return 'bg-cyan-100 text-cyan-700'
  if (status === 'Dispatched') return 'bg-violet-100 text-violet-700'
  if (status === 'OFD') return 'bg-amber-100 text-amber-700'
  if (status === 'Booked') return 'bg-gray-100 text-gray-700'
  return 'bg-gray-100 text-gray-600'
}

// ─── Unified Status System ───────────────────────────────────────────────────
// Each status belongs to exactly ONE phase. Phase tabs filter by phase.
// Status pills filter by individual status. Both are always consistent.

const UNIFIED_STATUSES = ['Booked', 'In Transit', 'Arrived', 'Customs Released', 'Available', 'Dispatched', 'OFD', 'Delivered', 'Receiving', 'Received'] as const

// Which phase does each status belong to?
const STATUS_TO_PHASE: Record<string, string> = {
  'Booked': 'ocean',
  'In Transit': 'ocean',
  'Arrived': 'ocean',
  'Customs Released': 'customs',
  'Available': 'drayage',
  'Dispatched': 'drayage',
  'OFD': 'drayage',
  'Delivered': 'drayage',
  'Receiving': 'warehouse',
  'Received': 'warehouse',
  'Exception': 'exception',
}

// Which statuses belong to each phase?
const PHASE_STATUSES: Record<string, string[]> = {
  all: [...UNIFIED_STATUSES],
  ocean: ['Booked', 'In Transit', 'Arrived'],
  customs: ['Customs Released'],
  drayage: ['Available', 'Dispatched', 'OFD', 'Delivered'],
  warehouse: ['Receiving', 'Received'],
  exception: ['Exception'], // Exception only shown when Exceptions tab is active
}

const PHASE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'ocean', label: 'Ocean Freight' },
  { key: 'customs', label: 'Customs Clearance' },
  { key: 'drayage', label: 'Drayage' },
  { key: 'warehouse', label: 'Warehouse Receipt' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function IntlTracking() {
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.includes('/tracking2') ? '/international/tracking2' : '/international/tracking'
  const [search, setSearch] = useState('')
  const [phaseTab, setPhaseTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Get statuses for current phase
  const availableStatuses = PHASE_STATUSES[phaseTab] || PHASE_STATUSES.all

  const filtered = TRACKING_DATA.filter(t => {
    // Phase filter: check if the record's status belongs to the selected phase
    if (phaseTab !== 'all') {
      const phaseStatuses = PHASE_STATUSES[phaseTab]
      if (!phaseStatuses.includes(t.status)) return false
    }
    // Status filter
    if (statusFilter !== 'All' && t.status !== statusFilter) return false
    // Search
    if (search) {
      const q = search.toLowerCase()
      return t.shipmentNo.toLowerCase().includes(q) || t.hbl.toLowerCase().includes(q) ||
        t.containers.some(c => c.toLowerCase().includes(q)) || t.customer.toLowerCase().includes(q)
    }
    return true
  })

  // When phase changes, reset status filter
  const handlePhaseChange = (phase: string) => {
    setPhaseTab(phase)
    setStatusFilter('All')
  }

  // When status is clicked, also sync the phase tab
  const handleStatusClick = (status: string) => {
    setStatusFilter(status)
    if (status === 'All') return
    const belongsToPhase = STATUS_TO_PHASE[status]
    if (belongsToPhase && phaseTab !== 'all' && phaseTab !== belongsToPhase) {
      setPhaseTab('all') // switch to All if clicking a status from another phase
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">End-to-End Tracking</h1>
      <p className="text-sm text-gray-500 mb-5">International logistics full-chain visibility: Supplier &rarr; Ocean &rarr; Customs &rarr; Drayage &rarr; Warehouse</p>

      {/* Phase tabs with counts - with background styling */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-1.5 mb-4 flex gap-1">
        {PHASE_TABS.map(tab => {
          const count = tab.key === 'all' ? TRACKING_DATA.length : TRACKING_DATA.filter(t => (PHASE_STATUSES[tab.key] || []).includes(t.status)).length
          const tabColors: Record<string, string> = {
            all: phaseTab === 'all' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-white/60',
            ocean: phaseTab === 'ocean' ? 'bg-blue-50 shadow-sm border border-blue-200 text-blue-700' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50',
            customs: phaseTab === 'customs' ? 'bg-teal-50 shadow-sm border border-teal-200 text-teal-700' : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50/50',
            drayage: phaseTab === 'drayage' ? 'bg-violet-50 shadow-sm border border-violet-200 text-violet-700' : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50/50',
            warehouse: phaseTab === 'warehouse' ? 'bg-green-50 shadow-sm border border-green-200 text-green-700' : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50',
          }
          return (
            <button key={tab.key} onClick={() => handlePhaseChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tabColors[tab.key] || ''}`}>
              {tab.label}
              <span className="ml-1.5 text-[10px] font-bold opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Status pills — color-coded by phase */}
      <div className="flex gap-1.5 mb-4 flex-wrap items-center">
        <span className="text-[10px] text-gray-400 mr-1 uppercase font-semibold tracking-wider">Status:</span>
        <button onClick={() => handleStatusClick('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${statusFilter === 'All' ? 'bg-gray-900 border-gray-900 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
          All <span className="text-[10px] opacity-70">{phaseTab === 'all' ? TRACKING_DATA.length : TRACKING_DATA.filter(t => availableStatuses.includes(t.status)).length}</span>
        </button>
        {availableStatuses.map(s => {
          const count = TRACKING_DATA.filter(t => t.status === s).length
          const phase = STATUS_TO_PHASE[s]
          const pillColors: Record<string, { active: string; inactive: string; dot: string }> = {
            ocean: { active: 'bg-blue-600 border-blue-600 text-white', inactive: 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50', dot: 'bg-blue-500' },
            customs: { active: 'bg-teal-600 border-teal-600 text-white', inactive: 'bg-white border-teal-200 text-teal-700 hover:bg-teal-50', dot: 'bg-teal-500' },
            drayage: { active: 'bg-violet-600 border-violet-600 text-white', inactive: 'bg-white border-violet-200 text-violet-700 hover:bg-violet-50', dot: 'bg-violet-500' },
            warehouse: { active: 'bg-green-600 border-green-600 text-white', inactive: 'bg-white border-green-200 text-green-700 hover:bg-green-50', dot: 'bg-green-500' },
          }
          const colors = pillColors[phase] || pillColors.ocean
          return (
            <button key={s} onClick={() => handleStatusClick(s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-sm ${
                statusFilter === s ? colors.active : colors.inactive
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === s ? 'bg-white/80' : colors.dot}`} />
              {s} <span className="text-[10px] opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Search + Advanced Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Shipment No., HBL, MBL, BOL, Container No., Load#..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm"><option>Status</option></select>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${showAdvanced ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <Filter size={14} />
          Advanced Filter
          {showAdvanced && <span className="text-[10px] ml-0.5">▲</span>}
          {!showAdvanced && <span className="text-[10px] ml-0.5">▼</span>}
        </button>
      </div>

      {/* Advanced Filter Panel (collapsible) */}
      {showAdvanced && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="grid grid-cols-5 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Date Range</label>
              <input type="text" placeholder="Start - End" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Origin</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option value="">All Origins</option><option>Shanghai, CN</option><option>Ningbo, CN</option><option>Haiphong, VN</option><option>Shenzhen, CN</option><option>Qingdao, CN</option><option>Ho Chi Minh, VN</option></select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Destination</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option value="">All Destinations</option><option>Savannah, US</option><option>Los Angeles, US</option><option>Long Beach, US</option><option>New York, US</option></select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold mb-1 block">Customer</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option value="">All Customers</option><option>ADOORN LLC</option><option>THE ONLY BEAN LLC</option><option>ORGAIN LLC</option><option>VITA COCO</option><option>PLEASS GLOBAL</option></select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Shipment count */}
      <div className="flex items-center justify-end mb-4">
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
                    <p className="text-xs font-medium text-primary-600 cursor-pointer hover:underline" onClick={() => navigate(`${basePath}/${row.id}`)}>{row.shipmentNo}</p>
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
                    <button onClick={() => navigate(`${basePath}/${row.id}`)} className="text-xs text-primary-600 hover:underline">Detail</button>
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
