import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Package, Truck, Anchor, CheckCircle2 } from 'lucide-react'

const TRACKING_DATA = [
  { id: 'WHSU8555505', container: 'WHSU8555505', mbl: '039GX40070', hbl: 'SSGNS2607829', route: 'Haiphong, VN (VNHPH) \u2192 Savannah, US (USSAV)', customer: 'ADOORN LLC', status: 'In Transit', progress: 62, vessel: 'WAN HAI A10', eta: 'Jun 19, 2026' },
  { id: 'MSCU7234891', container: 'MSCU7234891', mbl: 'COSU6388291', hbl: 'SSHAS2608135', route: 'Shanghai, CN (CNSHA) \u2192 Los Angeles, US (USLAX)', customer: 'THE ONLY BEAN LLC', status: 'At Destination', progress: 85, vessel: 'CMA CGM VERDI', eta: 'Jun 13, 2026' },
  { id: 'HLXU3456789', container: 'HLXU3456789', mbl: 'HLCU9012345', hbl: 'HLXU2608001', route: 'Ho Chi Minh City, VN (VNSGN) \u2192 New York, US (USNYC)', customer: 'ORGAIN LLC', status: 'Booked', progress: 15, vessel: 'COSCO FAITH', eta: 'Jul 10, 2026' },
]

export default function IntlTracking() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = TRACKING_DATA.filter(t => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.container.toLowerCase().includes(q) || t.mbl.toLowerCase().includes(q) || t.hbl.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q)
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">International Tracking</h1>
      <p className="text-sm text-gray-500 mb-5">End-to-end shipment journey tracking across international logistics chain.</p>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <p className="text-xs text-gray-400 mb-2">Search by Container No, MBL, HBL, Shipment No, or Customer name</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. WHSU8555505, 039GX40070, SSGNS2607829, ADOORN LLC"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button className="px-5 py-2.5 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Search</button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} onClick={() => navigate(`/international/tracking/${item.id}`)}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-200 hover:shadow-sm cursor-pointer transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Anchor size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.container}</p>
                  <p className="text-xs text-gray-500">{item.route}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                item.status === 'At Destination' ? 'bg-green-100 text-green-700' :
                item.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>{item.status}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500 mb-3">
              <span><strong className="text-gray-700">MBL:</strong> {item.mbl}</span>
              <span><strong className="text-gray-700">HBL:</strong> {item.hbl}</span>
              <span><strong className="text-gray-700">Vessel:</strong> {item.vessel}</span>
              <span><strong className="text-gray-700">Customer:</strong> {item.customer}</span>
              <span><strong className="text-gray-700">ETA:</strong> {item.eta}</span>
            </div>
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
              </div>
              <span className="text-xs font-medium text-primary-600">{item.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
