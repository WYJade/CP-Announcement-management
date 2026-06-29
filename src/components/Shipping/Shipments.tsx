import { useState } from 'react'
import { Search } from 'lucide-react'

const STATUS_TABS = [
  { key: 'all', label: 'All', count: 22740 },
  { key: 'new', label: 'New', count: 9431 },
  { key: 'pickup-dispatched', label: 'Pickup Dispatched', count: 4038 },
  { key: 'pickup-completed', label: 'Pickup Completed', count: 2106 },
  { key: 'in-transit', label: 'In Transit', count: 2291 },
  { key: 'ofd', label: 'Out For Delivery', count: 3492 },
  { key: 'delivered', label: 'Delivered', count: 1144 },
]

const SAMPLE_ROWS = [
  { customer: 'MOTC201', pu: 'DO00065124', pro: '-', origin: 'FONTANA, CA', pickupDate: '-', destination: 'CHICAGO, IL', deliveryDate: '-', status: 'New' },
  { customer: 'MOTC201', pu: 'DO00065123', pro: '-', origin: 'ONTARIO, CA', pickupDate: '-', destination: 'CHICAGO, IL', deliveryDate: '-', status: '' },
  { customer: 'MOTC201', pu: 'DO00065122', pro: '-', origin: 'ONTARIO, CA', pickupDate: '-', destination: 'HOUSTON, TX', deliveryDate: '-', status: '' },
  { customer: 'MOTC201', pu: 'DO00065121', pro: '-', origin: 'ONTARIO, CA', pickupDate: '-', destination: 'COLLEGE STATION, TX', deliveryDate: '-', status: '' },
  { customer: 'MOTC201', pu: 'DO00065320', pro: '-', origin: 'WEST CHICAGO, IL', pickupDate: '-', destination: 'FONTANA, CA', deliveryDate: '-', status: 'Delivered' },
  { customer: 'MOTC301', pu: 'DO00064511', pro: '-', origin: 'Lake Elsinore, CA', pickupDate: '-', destination: 'HAWAIIAN GARDENS, CA', deliveryDate: '-', status: 'New' },
]

export default function Shipments() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          Request Quote
        </button>
      </div>

      {/* Tabs: LTL Shipment / Small Parcel */}
      <div className="flex items-center gap-2 mb-5">
        <button className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg">LTL Shipment</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">Small Parcel</button>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-0 mb-5 bg-gradient-to-r from-red-100 via-orange-100 to-green-100 rounded-lg overflow-hidden">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === tab.key ? 'bg-primary-100 font-semibold text-primary-700' : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <p className="text-xs text-gray-500">{tab.label}</p>
            <p className="text-sm font-bold">{tab.count.toLocaleString()}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search here" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg" />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
        <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Filter</button>
        <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Search</button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Customer', 'PU#', 'PRO#', 'Origin', 'Pickup date', 'Destination', 'Delivery date', 'Order status', 'Operations'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">{row.customer}</td>
                <td className="py-3 px-4 text-gray-700 font-mono text-xs">{row.pu}</td>
                <td className="py-3 px-4 text-gray-400">{row.pro}</td>
                <td className="py-3 px-4 text-gray-700">{row.origin}</td>
                <td className="py-3 px-4 text-gray-400">{row.pickupDate}</td>
                <td className="py-3 px-4 text-gray-700">{row.destination}</td>
                <td className="py-3 px-4 text-gray-400">{row.deliveryDate}</td>
                <td className="py-3 px-4">{row.status && <span className="text-xs text-primary-600 font-medium">{row.status}</span>}</td>
                <td className="py-3 px-4"><span className="text-xs text-primary-600 cursor-pointer hover:underline">Details</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
