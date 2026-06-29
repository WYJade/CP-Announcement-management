import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RefreshCw, Filter } from 'lucide-react'

const SAMPLE_DATA = [
  { loadNo: 'UNIS_ATL_M000115', portproLoad: '-', loadStatus: 'Dropped - Loaded', changeStatus: 'DROPPED', containerNo: 'MRSU546732', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_LGB_M009798', portproLoad: '-', loadStatus: 'Available', changeStatus: 'AVAILABLE', containerNo: 'MAGU5754435', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_SAV_M005416', portproLoad: '-', loadStatus: 'Customs Hold / Freight Hold', changeStatus: 'PENDING', containerNo: 'NYKU3736566', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_SAV_M005415', portproLoad: '-', loadStatus: 'Pending', changeStatus: 'PENDING', containerNo: 'APZU3394882', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_SAV_M005414', portproLoad: '-', loadStatus: 'Pending', changeStatus: 'PENDING', containerNo: 'FCIU5663916', loadType: 'IMPORT', pickupApt: '-' },
]

export default function DrayageLoads() {
  const navigate = useNavigate()
  const [hideCompleted, setHideCompleted] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <input type="text" placeholder="Search (Load#/Container#/BOL/MBL/HBL/PO#/Shipment#)..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>Select branch</option></select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hideCompleted} onChange={() => setHideCompleted(!hideCompleted)} className="rounded text-primary-600" />
          <span className="text-sm text-gray-600">Hide Completed</span>
        </label>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={13} /> Filters</button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><RefreshCw size={14} className="text-gray-500" /></button>
        <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"><Search size={13} className="inline mr-1" />Search</button>
      </div>
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
          <div className="grid grid-cols-4 gap-3">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label><input type="text" placeholder="Select date range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Load Status</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option><option>Available</option><option>Pending</option><option>Dropped</option></select></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Load Type</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option><option>IMPORT</option><option>EXPORT</option></select></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Pick Up Location</label><input type="text" placeholder="Pick Up Location" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Delivery Location</label><input type="text" placeholder="Delivery Location" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Return Location</label><input type="text" placeholder="Return Location" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Container Type</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option><option>20'</option><option>40'</option><option>High Cube</option></select></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">SSL</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option><option>COSCO</option><option>MAERSK</option><option>MSCU</option></select></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Pick Up Apt From</label><input type="text" placeholder="Select date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Delivery Apt</label><input type="text" placeholder="Select date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          </div>
        </div>
      )}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Drayage Load List</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200">{['Load #','PortPro Load #','Load Status','Change Status','Container #','Load Type','Pickup Apt'].map(h=>(<th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500">{h}</th>))}</tr></thead>
          <tbody>
            {SAMPLE_DATA.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/international/drayage/${row.loadNo}`)}>{row.loadNo}</td>
                <td className="py-3 px-3 text-gray-500">{row.portproLoad}</td>
                <td className="py-3 px-3 text-gray-700">{row.loadStatus}</td>
                <td className="py-3 px-3 text-gray-700">{row.changeStatus}</td>
                <td className="py-3 px-3 text-gray-700 font-mono text-xs">{row.containerNo}</td>
                <td className="py-3 px-3 text-gray-600">{row.loadType}</td>
                <td className="py-3 px-3 text-gray-400">{row.pickupApt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
