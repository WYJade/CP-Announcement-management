import { useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'

const SAMPLE_DATA = [
  { loadNo: 'UNIS_ATL_M000115', portproLoad: '-', loadStatus: 'Dropped - Loaded', changeStatus: 'DROPPED', containerNo: 'MRSU546732', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_LGB_M009798', portproLoad: '-', loadStatus: 'Available', changeStatus: 'AVAILABLE', containerNo: 'MAGU5754435', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_SAV_M005416', portproLoad: '-', loadStatus: 'Customs Hold\nFreight Hold', changeStatus: 'PENDING', containerNo: 'NYKU3736566', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_SAV_M005415', portproLoad: '-', loadStatus: 'Pending', changeStatus: 'PENDING', containerNo: 'APZU3394882', loadType: 'IMPORT', pickupApt: '-' },
  { loadNo: 'UNIS_SAV_M005414', portproLoad: '-', loadStatus: 'Pending', changeStatus: 'PENDING', containerNo: 'FCIU5663916', loadType: 'IMPORT', pickupApt: '-' },
]

export default function DrayageLoads() {
  const [hideCompleted, setHideCompleted] = useState(true)

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-5">
        <input type="text" placeholder="Search the Board..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48" />
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Select branch</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hideCompleted} onChange={() => setHideCompleted(!hideCompleted)} className="rounded text-primary-600" />
          <span className="text-sm text-gray-600">Hide Completed</span>
        </label>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><RefreshCw size={14} className="text-gray-500" /></button>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Load List</h2>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-8 py-3 px-3"><input type="checkbox" className="rounded" /></th>
              {['Load #', 'PortPro Load #', 'Load Status', 'Change Status', 'Container #', 'Load Type', 'Pickup Apt'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_DATA.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3"><input type="checkbox" className="rounded" /></td>
                <td className="py-3 px-3 text-primary-600 font-medium cursor-pointer hover:underline">{row.loadNo}</td>
                <td className="py-3 px-3 text-gray-500">{row.portproLoad}</td>
                <td className="py-3 px-3 text-gray-700 whitespace-pre-line">{row.loadStatus}</td>
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
