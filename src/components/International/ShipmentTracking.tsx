import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, AlertTriangle, Clock, Ship, Package, FileCheck, Truck, Warehouse, ArrowRight, Sparkles, MapPin } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShipmentRecord {
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
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const HAS_DATA = true // Toggle to show search page vs data page

const SHIPMENT_DATA: ShipmentRecord[] = [
  { id: 'SSHAS2608072', shipmentNo: 'SSHAS2608072', hbl: 'SSGNS2607829', status: 'In Transit', containers: ['WHSU8555505'], currentMilestone: 'Vessel Departed POL', origin: 'Haiphong, VN', destination: 'Savannah, US', eta: 'Jun 13, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 15, 2026 08:30' },
  { id: 'SSHAS2608135', shipmentNo: 'SSHAS2608135', hbl: 'SSHAS2608135', status: 'Customs', containers: ['XYLU8225020', 'SELU4350353'], currentMilestone: 'Customs Released', origin: 'Shanghai, CN', destination: 'Los Angeles, US', eta: 'Jun 01, 2026', customer: 'THE ONLY BEAN LLC', receivedTime: '-', lastUpdated: 'Jun 14, 2026 14:20' },
  { id: 'SSHAS2608099', shipmentNo: 'SSHAS2608099', hbl: 'HLXU2608001', status: 'In Transit', containers: ['HLXU3456789'], currentMilestone: 'In Transit - Mid Pacific', origin: 'Ho Chi Minh, VN', destination: 'New York, US', eta: 'Jul 10, 2026', customer: 'ORGAIN LLC', receivedTime: '-', lastUpdated: 'Jun 10, 2026 09:00' },
  { id: 'SSHAS2608130', shipmentNo: 'SSHAS2608130', hbl: 'SSHAS2608130', status: 'Completed', containers: ['ONEU8472065'], currentMilestone: 'Received at Warehouse', origin: 'Ningbo, CN', destination: 'Long Beach, US', eta: 'May 28, 2026', customer: 'VITA COCO', receivedTime: 'Jun 05, 2026', lastUpdated: 'Jun 05, 2026 16:45' },
  { id: 'SSHAS2608200', shipmentNo: 'SSHAS2608200', hbl: 'SSHAS2608200', status: 'Drayage', containers: ['MSCU7234891', 'TCKU9988776'], currentMilestone: 'Out for Delivery', origin: 'Shanghai, CN', destination: 'Long Beach, US', eta: 'Jun 12, 2026', customer: 'PLEASS GLOBAL', receivedTime: '-', lastUpdated: 'Jun 13, 2026 07:00' },
  { id: 'SSHAS2608250', shipmentNo: 'SSHAS2608250', hbl: 'SSHAS2608250', status: 'In Transit', containers: ['CMAU5567890'], currentMilestone: 'Approaching POD', origin: 'Shenzhen, CN', destination: 'Savannah, US', eta: 'Jun 25, 2026', customer: 'ADOORN LLC', receivedTime: '-', lastUpdated: 'Jun 14, 2026 10:00' },
  { id: 'SSHAS2608260', shipmentNo: 'SSHAS2608260', hbl: 'SSHAS2608260', status: 'Drayage', containers: ['TRLU7494622'], currentMilestone: 'Dispatched to Warehouse', origin: 'Ningbo, CN', destination: 'Long Beach, US', eta: 'Jun 10, 2026', customer: 'ORGAIN LLC', receivedTime: '-', lastUpdated: 'Jun 15, 2026 06:00' },
  { id: 'SSHAS2608270', shipmentNo: 'SSHAS2608270', hbl: 'SSHAS2608270', status: 'Warehouse Receiving', containers: ['KKFU9159476'], currentMilestone: 'Unloading at Warehouse', origin: 'Shanghai, CN', destination: 'Long Beach, US', eta: 'Jun 08, 2026', customer: 'VITA COCO', receivedTime: '-', lastUpdated: 'Jun 14, 2026 15:30' },
]

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'in-transit', label: 'In Transit' },
  { key: 'customs', label: 'Customs' },
  { key: 'drayage', label: 'Drayage' },
  { key: 'warehouse', label: 'Warehouse Receiving' },
  { key: 'completed', label: 'Completed' },
]

function statusColor(status: string) {
  if (status === 'In Transit') return 'bg-blue-100 text-blue-700'
  if (status === 'Customs') return 'bg-teal-100 text-teal-700'
  if (status === 'Drayage') return 'bg-violet-100 text-violet-700'
  if (status === 'Warehouse Receiving') return 'bg-green-100 text-green-700'
  if (status === 'Completed') return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ShipmentTracking() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [hasData, setHasData] = useState(true)
  const [recentSearches] = useState(['SSHAS2608072', 'WHSU8555505', 'SSGNS2607829', '039GX40070'])

  const filtered = SHIPMENT_DATA.filter(s => {
    if (activeTab !== 'all') {
      const tabStatusMap: Record<string, string> = { 'in-transit': 'In Transit', customs: 'Customs', drayage: 'Drayage', warehouse: 'Warehouse Receiving', completed: 'Completed' }
      if (s.status !== tabStatusMap[activeTab]) return false
    }
    if (search) {
      const q = search.toLowerCase()
      return s.shipmentNo.toLowerCase().includes(q) || s.hbl.toLowerCase().includes(q) || s.containers.some(c => c.toLowerCase().includes(q)) || s.customer.toLowerCase().includes(q)
    }
    return true
  })

  // If no data, show search portal page
  if (!hasData) {
    return <SearchPortal onToggle={() => setHasData(true)} />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-gray-900">Shipment Tracking</h1>
        <button onClick={() => setHasData(false)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600" title="Switch to search view">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
      </div>

      {/* Search + Advanced Filters */}
      <div className="flex items-center gap-3 mb-2 mt-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Enter Shipment No., HBL, MBL, Container No., BOL, Load#..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
          <Filter size={14} /> Advanced Filters
        </button>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-xs">
          <span className="text-gray-400">Recent:</span>
          {recentSearches.slice(0, 3).map(s => (
            <button key={s} onClick={() => navigate(`/international/tracking2/${s}`)} className="text-primary-600 hover:text-primary-700 hover:underline font-medium">{s}</button>
          ))}
          <button className="text-gray-400 hover:text-primary-600 flex items-center gap-0.5 ml-1">
            More <ArrowRight size={10} />
          </button>
        </div>
      )}

      {/* Advanced Filters panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-4 gap-3">
            <div><label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Status</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select></div>
            <div><label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Date Range</label><input type="text" placeholder="Select range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Origin</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select></div>
            <div><label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1">Destination</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select></div>
          </div>
        </div>
      )}

      {/* Status Summary tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {STATUS_TABS.map(tab => {
          const count = tab.key === 'all' ? SHIPMENT_DATA.length : SHIPMENT_DATA.filter(s => {
            const map: Record<string, string> = { 'in-transit': 'In Transit', customs: 'Customs', drayage: 'Drayage', warehouse: 'Warehouse Receiving', completed: 'Completed' }
            return s.status === map[tab.key]
          }).length
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label} <span className="text-[10px] opacity-60 ml-1">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 mb-1"><AlertTriangle size={12} /> 3 Delayed</div>
          <p className="text-[10px] text-red-600">Shipments behind schedule</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1"><FileCheck size={12} /> 2 Customs Hold</div>
          <p className="text-[10px] text-amber-600">Awaiting clearance</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 mb-1"><Clock size={12} /> 5 Approaching LFD</div>
          <p className="text-[10px] text-orange-600">Containers nearing deadline</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1"><Warehouse size={12} /> 4 WH Receiving</div>
          <p className="text-[10px] text-blue-600">Scheduled this week</p>
        </div>
      </div>

      {/* Shipment List Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Shipment No. / HBL', 'Status', 'Container(s)', 'Current Milestone', 'Origin', 'Destination', 'ETA (ARV)', 'Customer', 'Received Time', 'Last Updated'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3">
                  <p className="text-xs font-medium text-primary-600 cursor-pointer hover:underline" onClick={() => navigate(`/international/tracking2/${row.id}`)}>{row.shipmentNo}</p>
                  <p className="text-[10px] text-gray-400">{row.hbl}</p>
                </td>
                <td className="py-3 px-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(row.status)}`}>{row.status}</span></td>
                <td className="py-3 px-3 text-xs text-gray-700 font-mono">{row.containers.join(', ')}</td>
                <td className="py-3 px-3 text-xs text-gray-700">{row.currentMilestone}</td>
                <td className="py-3 px-3 text-xs text-gray-600">{row.origin}</td>
                <td className="py-3 px-3 text-xs text-gray-600">{row.destination}</td>
                <td className="py-3 px-3 text-xs text-gray-600">{row.eta}</td>
                <td className="py-3 px-3 text-xs text-gray-700">{row.customer}</td>
                <td className="py-3 px-3 text-xs text-gray-500">{row.receivedTime}</td>
                <td className="py-3 px-3 text-xs text-gray-400">{row.lastUpdated}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} className="text-center py-10 text-gray-400 text-sm">No shipments match your criteria</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Search Portal (shown when no data) ──────────────────────────────────────

function SearchPortal({ onToggle }: { onToggle: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <div className="p-6 max-w-4xl mx-auto text-center pt-10">
      <div className="flex justify-end mb-4">
        <button onClick={onToggle} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600" title="Switch to list view">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment Journey</h1>
      <p className="text-sm text-gray-500 mb-4">View the full journey from supplier dispatch to warehouse receiving in one unified timeline.</p>
      <div className="flex items-center justify-center gap-2 mb-8">
        {[{ label: 'Supplier', icon: <Package size={12} /> }, { label: 'International Transit', icon: <Ship size={12} /> }, { label: 'Customs', icon: <FileCheck size={12} /> }, { label: 'Drayage', icon: <Truck size={12} /> }, { label: 'Warehouse', icon: <Warehouse size={12} /> }].map((s, i, arr) => (
          <div key={i} className="flex items-center gap-1.5"><div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium"><span className="text-gray-500">{s.icon}</span><span>{s.label}</span></div>{i < arr.length - 1 && <ArrowRight size={10} className="text-gray-300" />}</div>
        ))}
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:border-primary-300 focus-within:border-primary-500 transition-all">
          <Search size={20} className="ml-5 text-gray-400 shrink-0" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter Shipment No., HBL, MBL, Container No., BOL, Load#..." className="flex-1 px-4 py-4 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent" />
          <button className="mr-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 flex items-center gap-1.5"><Search size={14} /> Track</button>
        </div>
      </div>
    </div>
  )
}
