import { useState } from 'react'
import { Search } from 'lucide-react'

export default function WholesaleOrders() {
  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Wholesale Orders</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Show Charts</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <input type="text" placeholder="2026/6/18 - 2026/6/25" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44" />
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>VIZIO-VIZIO</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Valley View</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Select Category</option>
        </select>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white">
          <p className="text-xs opacity-80">Total Orders</p>
          <p className="text-3xl font-bold mt-1">0</p>
          <p className="text-xs opacity-60 mt-1">~ 0% vs last period</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white">
          <p className="text-xs opacity-80">On-Time Delivery</p>
          <p className="text-3xl font-bold mt-1">0%</p>
          <p className="text-xs opacity-60 mt-1">~ 0% vs last period</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white">
          <p className="text-xs opacity-80">Shipped Qty</p>
          <p className="text-3xl font-bold mt-1">0</p>
          <p className="text-xs opacity-60 mt-1">~ 0% vs last period</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Facility', 'OrderNo', 'ProNo', 'ReferenceNo', 'PONo', 'AppointmentDate', 'AppointmentTime', 'ScheduledDate', 'OrderedDate', 'RequestedDate', 'ShippedDate', 'CarrierID'].map((h) => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={12} className="text-center py-12 text-gray-400 text-sm">No data available</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
