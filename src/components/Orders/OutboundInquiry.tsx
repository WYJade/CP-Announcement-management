import { useState } from 'react'
import { Search } from 'lucide-react'

const STATUS_TABS = ['All', 'Problem', 'Plan', 'In Progress', 'Staged', 'Loading', 'Shipped', 'Billed', 'Paid', 'Partially Paid', 'Paid Due']

const TABLE_COLUMNS = [
  'Facility', 'Customer', 'Order #', 'Status', 'Rush', 'Order Type', 'Load #',
  'PO #', 'Order Note', 'Shipping Account No', 'Source', 'Ship Not Before', 'BOL Note', 'Action',
]

export default function OutboundInquiry() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Outbound Inquiry</h1>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Created Date Range</label>
            <input type="text" placeholder="Select date range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Appointment Date Range</label>
            <input type="text" placeholder="Select date range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">MAFI Date Range</label>
            <input type="text" placeholder="Select date range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Shipped Date Range</label>
            <input type="text" placeholder="Select date range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search By</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Item Keyword</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Customers</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facility</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Facilities</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" placeholder="Enter title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Load Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Int'l Shipment</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ship Method</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Billing Grade</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Retailer</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {TABLE_COLUMNS.map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="text-center py-12 text-gray-400 text-sm">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
