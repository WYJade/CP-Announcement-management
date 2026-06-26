import { useState } from 'react'
import { Search, X } from 'lucide-react'

const STATUS_TABS = [
  { key: 'on-ship', label: 'On Ship', count: 3 },
  { key: 'hold', label: 'Hold', count: 2 },
  { key: 'available', label: 'Available', count: 5 },
  { key: 'appointed', label: 'Appointed', count: 3 },
  { key: 'out-gated', label: 'Out-Gated', count: 5 },
  { key: 'terminated', label: 'Terminated', count: 6 },
  { key: 'unknown', label: 'Unknown', count: 1 },
]

const SAMPLE_DATA = [
  { containerNo: 'ONEU8472065', port: 'PCT', ssl: 'COSCO', size: "40'", type: 'Standard', customer: 'ORGAIN LLC', vessel: 'COSCO FAITH', lfd: 'Jun 25, 2026', status: 'On Ship' },
  { containerNo: 'TCKU3456789', port: 'LBCT', ssl: 'MAERSK', size: "20'", type: 'Standard', customer: 'VITA COCO', vessel: 'MSC BEATRICE', lfd: 'Jun 22, 2026', status: 'On Ship' },
  { containerNo: 'MSDU5678901', port: 'LBCT', ssl: 'MSCU', size: "40'", type: 'High Cube', customer: 'THE ONLY BEAN LLC', vessel: 'SEASPAN HAMBURG', lfd: 'Jun 28, 2026', status: 'On Ship' },
  { containerNo: 'KKFU9159476', port: 'LBCT', ssl: 'MSCU', size: "20'", type: 'Standard', customer: 'ORGAIN LLC', vessel: 'CSCL SOUTH CHINA SEA', lfd: 'Jun 18, 2026', status: 'Hold' },
  { containerNo: 'NYKU4064208', port: 'PCT', ssl: 'CMDU', size: "40'", type: 'Standard', customer: 'ORGAIN LLC', vessel: 'CSCL SOUTH CHINA SEA', lfd: 'Jun 20, 2026', status: 'Hold' },
  { containerNo: 'MSNU1334770', port: 'LBCT', ssl: 'MSCU', size: "20'", type: 'Standard', customer: 'PLEASS GLOBAL LIMITED', vessel: 'SEASPAN HAMBURG', lfd: 'Apr 6, 2026', status: 'Available' },
  { containerNo: 'MSNU1696110', port: 'LBCT', ssl: 'MSCU', size: "20'", type: 'Standard', customer: '-', vessel: 'SEASPAN HAMBURG', lfd: 'Apr 6, 2026', status: 'Available' },
  { containerNo: 'MSBU1317970', port: 'LBCT', ssl: 'MSCU', size: "20'", type: 'Standard', customer: '-', vessel: 'SEASPAN HAMBURG', lfd: 'Apr 6, 2026', status: 'Available' },
  { containerNo: 'TRLU7494622', port: 'PCT', ssl: 'CMDU', size: "40'", type: 'Standard', customer: 'ORGAIN LLC', vessel: 'CSCL SOUTH CHINA SEA', lfd: 'Apr 6, 2026', status: 'Available' },
]

export default function Containers() {
  const [activeTab, setActiveTab] = useState('on-ship')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Containers</h1>
      <p className="text-sm text-gray-500 mb-5">View drayage containers synced from the Item Drayage System.</p>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5">
        {STATUS_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
              activeTab === tab.key ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
            {tab.label} {tab.count}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="flex gap-3 items-center">
          <label className="text-xs font-medium text-gray-500">Key</label>
          <input type="text" placeholder="Container No, Customer, Vessel..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"><X size={12} /> Clear</button>
          <button className="flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Search size={12} /> Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Container No', 'Port', 'SSL', 'Size', 'Container Type', 'Customer', 'Vessel', 'LFD', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_DATA.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-primary-600 font-medium cursor-pointer hover:underline">{row.containerNo}</td>
                <td className="py-3 px-4 text-gray-600">{row.port}</td>
                <td className="py-3 px-4 text-gray-600">{row.ssl}</td>
                <td className="py-3 px-4 text-gray-600">{row.size}</td>
                <td className="py-3 px-4 text-gray-600">{row.type}</td>
                <td className="py-3 px-4 text-gray-700">{row.customer}</td>
                <td className="py-3 px-4 text-gray-600">{row.vessel}</td>
                <td className="py-3 px-4 text-gray-600">{row.lfd}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium ${row.status === 'On Ship' ? 'text-green-600' : row.status === 'Hold' ? 'text-red-600' : row.status === 'Available' ? 'text-green-600' : 'text-gray-500'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
