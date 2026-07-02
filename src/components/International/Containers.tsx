import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Settings } from 'lucide-react'

// ─── Customer Data ───────────────────────────────────────────────────────────
const CUSTOMERS = [
  { name: 'JULY& CO PTY LTD', code: 'JULCOP0001' },
  { name: 'ORGAIN LLC', code: 'ORGLLC0001' },
  { name: 'VITA COCO', code: 'VITCOC0001' },
  { name: 'THE ONLY BEAN LLC', code: 'TONBEA0001' },
  { name: 'PLEASS GLOBAL LIMITED', code: 'PLEGLO0001' },
  { name: 'ADOORN LLC', code: 'ADOLLC0001' },
]

function CustomerFilter() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)

  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (code: string) => {
    setSelected(prev => prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code])
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 min-w-[140px] text-left flex items-center gap-1">
        Customer {selected.length > 0 && <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-1.5 rounded-full">{selected.length}</span>}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customer..." className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg" autoFocus />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map(c => (
              <label key={c.code} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs">
                <input type="checkbox" checked={selected.includes(c.code)} onChange={() => toggle(c.code)} className="rounded text-primary-600" />
                <span className="text-gray-800">{c.name}</span>
                <span className="text-gray-400">-</span>
                <span className="text-gray-500 font-mono text-[10px]">{c.code}</span>
              </label>
            ))}
            {filtered.length === 0 && <p className="px-3 py-3 text-xs text-gray-400 text-center">No customers found</p>}
          </div>
          <div className="p-2 border-t border-gray-100 flex justify-between">
            <button onClick={() => setSelected([])} className="text-[10px] text-gray-400 hover:text-gray-600">Clear all</button>
            <button onClick={() => setOpen(false)} className="text-[10px] text-primary-600 font-medium hover:text-primary-700">Done</button>
          </div>
        </div>
      )}
    </div>
  )
}

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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('on-ship')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Containers</h1>
      <p className="text-sm text-gray-500 mb-5">View drayage containers synced from the Item Drayage System.</p>

      {/* Status tabs - text style like screenshot */}
      <div className="flex gap-4 mb-5 border-b border-gray-200">
        {STATUS_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Port filter + Customer filter + Columns */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by Container No" className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg w-56" />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option>Port</option>
          <option>PCT</option>
          <option>LBCT</option>
        </select>
        <CustomerFilter />
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Settings size={13} /> Columns
          </button>
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
                <td className="py-3 px-4 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/international/containers/${row.containerNo}`)}>{row.containerNo}</td>
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
