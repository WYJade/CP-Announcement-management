import { useState } from 'react'
import { Search, Download, Filter, SlidersHorizontal } from 'lucide-react'

type ShipType = 'LTL Shipment' | 'Small Parcel'
type StatusTab = 'All' | 'New' | 'Pickup Dispatched' | 'Pickup Completed' | 'In Transit' | 'Out For Delivery' | 'Delivered'

interface Shipment {
  id: string
  customer: string
  pu: string
  pro: string
  origin: string
  pickupDate: string
  destination: string
  deliveryDate: string
  orderStatus: 'New' | 'In Transit' | 'Delivered' | 'Pickup Dispatched' | 'Pickup Completed' | 'Out For Delivery'
}

const STATUS_COUNTS: Record<StatusTab, number> = {
  All: 14522, New: 12320, 'Pickup Dispatched': 378, 'Pickup Completed': 10,
  'In Transit': 34, 'Out For Delivery': 227, Delivered: 1365,
}

const MOCK: Shipment[] = [
  { id: '1', customer: 'SAMUN00', pu: 'DO00337537', pro: '19090466', origin: 'ONTARIO, CA', pickupDate: '08/24/2026', destination: 'SPARKS, NV', deliveryDate: '-', orderStatus: 'New' },
  { id: '2', customer: 'SAMUN00', pu: 'DO00337513', pro: '19084022', origin: 'ONTARIO, CA', pickupDate: '08/19/2025', destination: 'FRENCH CAMP, CA', deliveryDate: '-', orderStatus: 'New' },
  { id: '3', customer: 'SAMUN00', pu: 'DO00337475', pro: '19080814', origin: 'HOUSTON, TX', pickupDate: '08/19/2026', destination: 'COPPELL, TX', deliveryDate: '-', orderStatus: 'New' },
  { id: '4', customer: 'SAMUN00', pu: 'DO00337473', pro: '19080271', origin: 'VISTA, CA', pickupDate: '08/19/2026', destination: 'FULLERTON, CA', deliveryDate: '-', orderStatus: 'New' },
  { id: '5', customer: 'SAMUN00', pu: 'DO00337431', pro: '19080372', origin: 'FULLERTON, CA', pickupDate: '08/21/2026', destination: 'ONTARIO, CA', deliveryDate: '-', orderStatus: 'New' },
  { id: '6', customer: 'SAMUN00', pu: 'DO00337430', pro: '19080377', origin: 'FULLERTON, CA', pickupDate: '08/24/2026', destination: 'ONTARIO, CA', deliveryDate: '-', orderStatus: 'New' },
  { id: '7', customer: 'SAMUN00', pu: 'DO00337429', pro: '19080382', origin: 'FULLERTON, CA', pickupDate: '08/25/2026', destination: 'ONTARIO, CA', deliveryDate: '-', orderStatus: 'New' },
  { id: '8', customer: 'SAMUN00', pu: 'DO00337420', pro: '19080190', origin: 'ONTARIO, CA', pickupDate: '08/22/2026', destination: 'SPARKS, NV', deliveryDate: '08/27/2026', orderStatus: 'Delivered' },
  { id: '9', customer: 'SAMUN00', pu: 'DO00337415', pro: '19078832', origin: 'LOS ANGELES, CA', pickupDate: '08/20/2026', destination: 'DALLAS, TX', deliveryDate: '-', orderStatus: 'In Transit' },
  { id: '10', customer: 'SAMUN00', pu: 'DO00337400', pro: '19077500', origin: 'CHICAGO, IL', pickupDate: '08/18/2026', destination: 'MIAMI, FL', deliveryDate: '-', orderStatus: 'Out For Delivery' },
]

const STATUS_STYLE: Record<Shipment['orderStatus'], string> = {
  New: 'text-blue-600',
  'In Transit': 'text-amber-600',
  Delivered: 'text-green-600',
  'Pickup Dispatched': 'text-indigo-600',
  'Pickup Completed': 'text-cyan-600',
  'Out For Delivery': 'text-orange-600',
}

export default function ShipmentsList() {
  const [shipType, setShipType] = useState<ShipType>('LTL Shipment')
  const [activeTab, setActiveTab] = useState<StatusTab>('All')
  const [search, setSearch] = useState('')

  const filtered = MOCK.filter(s => {
    if (activeTab !== 'All' && s.orderStatus !== activeTab) return false
    if (search && !s.pu.includes(search) && !s.pro.includes(search) && !s.customer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const tabs: StatusTab[] = ['All', 'New', 'Pickup Dispatched', 'Pickup Completed', 'In Transit', 'Out For Delivery', 'Delivered']

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">Shipments</h1>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Request Quote
        </button>
      </div>

      {/* Ship type toggle */}
      <div className="flex items-center gap-2 mb-4">
        {(['LTL Shipment', 'Small Parcel'] as ShipType[]).map(t => (
          <button
            key={t}
            onClick={() => setShipType(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              shipType === t
                ? 'bg-white border-gray-300 text-gray-800 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t === 'LTL Shipment' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M12 7V3M8 7V5M16 7V5"/>
              </svg>
            )}
            {t}
          </button>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            <span className={`ml-1 text-[10px] ${activeTab === tab ? 'text-primary-500' : 'text-gray-400'}`}>
              ({STATUS_COUNTS[tab].toLocaleString()})
            </span>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search here"
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white w-44 focus:outline-none focus:border-primary-400"
          />
        </div>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-primary-400">
          <option>All</option>
          <option>ONTARIO, CA</option>
          <option>FULLERTON, CA</option>
          <option>HOUSTON, TX</option>
        </select>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-primary-400">
          <option>All</option>
          <option>SPARKS, NV</option>
          <option>FRENCH CAMP, CA</option>
          <option>COPPELL, TX</option>
        </select>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Search size={13} />
          Search
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <SlidersHorizontal size={13} />
            Holds
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <Filter size={13} />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {['Customer', 'PU#', 'PRO#', 'Origin', 'Pickup date', 'Destination', 'Delivery date', 'Order status', 'Operations'].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">No shipments found</td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-3 py-3 text-gray-700">{s.customer}</td>
                    <td className="px-3 py-3 text-gray-700 font-medium">{s.pu}</td>
                    <td className="px-3 py-3 text-gray-700">{s.pro}</td>
                    <td className="px-3 py-3 font-semibold text-gray-800 uppercase text-[10px] tracking-wide">{s.origin}</td>
                    <td className="px-3 py-3 text-gray-600">{s.pickupDate}</td>
                    <td className="px-3 py-3 font-semibold text-gray-800 uppercase text-[10px] tracking-wide">{s.destination}</td>
                    <td className="px-3 py-3 text-gray-500">{s.deliveryDate}</td>
                    <td className="px-3 py-3">
                      <span className={`font-medium ${STATUS_STYLE[s.orderStatus]}`}>{s.orderStatus}</span>
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-primary-600 hover:text-primary-800 font-medium hover:underline transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
