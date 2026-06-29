import { useState, useMemo } from 'react'
import { Search, Filter, Download } from 'lucide-react'

// ─── Sample inventory data ───────────────────────────────────────────────────

interface InventoryRecord {
  id: string
  facility: string
  itemId: string
  description: string
  shortDescription: string
  title: string
  uom: string
  goodsType: string
  currentBalance: number
  beginningBalance: number
}

const SAMPLE_DATA: InventoryRecord[] = [
  { id: '1', facility: 'Valley View', itemId: '10262062250', description: '10262062250', shortDescription: 'M75Q6-L4', title: 'INNOLUX', uom: 'EA', goodsType: 'GOOD', currentBalance: 1, beginningBalance: 0 },
  { id: '2', facility: 'Valley View', itemId: '10262062250', description: '10262062250', shortDescription: 'M75Q6-L4', title: 'TCORE-X100', uom: 'EA', goodsType: 'GOOD', currentBalance: 4, beginningBalance: 0 },
  { id: '3', facility: 'Valley View', itemId: 'MCC500ml', description: 'MCC500ml', shortDescription: '-', title: 'ZYLUX', uom: 'EA', goodsType: 'GOOD', currentBalance: 0, beginningBalance: 0 },
  { id: '4', facility: 'Valley View', itemId: 'MSN', description: 'sesesescription', shortDescription: 'short short shot', title: 'ZYLUX', uom: 'EA', goodsType: 'GOOD', currentBalance: 36, beginningBalance: 0 },
  { id: '5', facility: 'Valley View', itemId: 'MSN', description: 'sesesescription', shortDescription: 'short short shot', title: 'BOEDS', uom: 'EA', goodsType: 'GOOD', currentBalance: 40, beginningBalance: 0 },
  { id: '6', facility: 'Valley View', itemId: 'TCORE-CABLE', description: 'USB-C Cable 3pk', shortDescription: 'Cable', title: 'TCORE-CABLE', uom: 'EA', goodsType: 'GOOD', currentBalance: 48, beginningBalance: 100 },
  { id: '7', facility: 'Valley View', itemId: 'FW-DENIM-001', description: 'Classic Denim', shortDescription: 'Denim Jean', title: 'FW-DENIM-001', uom: 'EA', goodsType: 'GOOD', currentBalance: 850, beginningBalance: 850 },
  { id: '8', facility: 'Valley View', itemId: 'FW-2024-BLK', description: 'Fashion Black', shortDescription: 'Tee BLK', title: 'FW-2024-BLK', uom: 'EA', goodsType: 'GOOD', currentBalance: 620, beginningBalance: 650 },
]

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function InventoryActivity() {
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('all')
  const [facility, setFacility] = useState('Valley View')

  const filtered = useMemo(() => {
    if (!search) return SAMPLE_DATA
    const q = search.toLowerCase()
    return SAMPLE_DATA.filter(
      (r) => r.itemId.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="p-6 max-w-full">

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Activity</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={14} />
          Export To Excel
        </button>
      </div>

      {/* Filters — horizontal row */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Customer*</label>
            <select value={customer} onChange={(e) => setCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">VIZIO-VIZIO</option>
              <option value="techcore">TECHCORE</option>
              <option value="fashionwave">FASHIONWAVE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facility*</label>
            <select value={facility} onChange={(e) => setFacility(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="Valley View">Valley View</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Item</label>
            <input type="text" placeholder="Input to search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <input type="text" placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lot #</label>
            <input type="text" placeholder="Lot #"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
            <input type="text" placeholder="Select date range"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Expiration Date From</label>
            <input type="text" placeholder="Expiration Date From"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Expiration Date To</label>
            <input type="text" placeholder="Expiration Date To"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex items-end gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={13} />
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
              <Search size={13} />
              Search
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" placeholder="Input to search"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">UOM</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Base UOM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8"></th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Short Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">UOM</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goods Type</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Balance</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beginning Balance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-4 text-gray-400"><ChevronRight size={12} /></td>
                <td className="py-2.5 px-4 text-gray-700">{row.facility}</td>
                <td className="py-2.5 px-4 text-gray-700 font-mono text-xs">{row.itemId}</td>
                <td className="py-2.5 px-4 text-gray-700">{row.description}</td>
                <td className="py-2.5 px-4 text-gray-500">{row.shortDescription}</td>
                <td className="py-2.5 px-4 text-gray-700 font-medium">{row.title}</td>
                <td className="py-2.5 px-4 text-gray-500">{row.uom}</td>
                <td className="py-2.5 px-4 text-gray-500">{row.goodsType}</td>
                <td className="py-2.5 px-4 text-right font-medium text-gray-900">{row.currentBalance}</td>
                <td className="py-2.5 px-4 text-right text-gray-500">{row.beginningBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
