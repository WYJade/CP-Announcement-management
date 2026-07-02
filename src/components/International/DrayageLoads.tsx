import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RefreshCw, Filter } from 'lucide-react'

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

  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (code: string) => {
    setSelected(prev => prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code])
  }

  return (
    <div className="relative">
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

const SAMPLE_DATA = [
  { loadNo: 'UNIS_ATL_M000115', portproLoad: '-', loadStatus: 'Dropped - Loaded', changeStatus: 'DROPPED', containerNo: 'MRSU546732', loadType: 'IMPORT', pickupApt: '-', customer: 'ORGAIN LLC' },
  { loadNo: 'UNIS_LGB_M009798', portproLoad: '-', loadStatus: 'Available', changeStatus: 'AVAILABLE', containerNo: 'MAGU5754435', loadType: 'IMPORT', pickupApt: '-', customer: 'VITA COCO' },
  { loadNo: 'UNIS_SAV_M005416', portproLoad: '-', loadStatus: 'Customs Hold / Freight Hold', changeStatus: 'PENDING', containerNo: 'NYKU3736566', loadType: 'IMPORT', pickupApt: '-', customer: 'THE ONLY BEAN LLC' },
  { loadNo: 'UNIS_SAV_M005415', portproLoad: '-', loadStatus: 'Pending', changeStatus: 'PENDING', containerNo: 'APZU3394882', loadType: 'IMPORT', pickupApt: '-', customer: 'ADOORN LLC' },
  { loadNo: 'UNIS_SAV_M005414', portproLoad: '-', loadStatus: 'Pending', changeStatus: 'PENDING', containerNo: 'FCIU5663916', loadType: 'IMPORT', pickupApt: '-', customer: 'PLEASS GLOBAL LIMITED' },
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
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Customer</label><CustomerFilter /></div>
          </div>
        </div>
      )}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Drayage Load List</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200">{['Load #','PortPro Load #','Load Status','Change Status','Container #','Load Type','Customer','Pickup Apt'].map(h=>(<th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500">{h}</th>))}</tr></thead>
          <tbody>
            {SAMPLE_DATA.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/international/drayage/${row.loadNo}`)}>{row.loadNo}</td>
                <td className="py-3 px-3 text-gray-500">{row.portproLoad}</td>
                <td className="py-3 px-3 text-gray-700">{row.loadStatus}</td>
                <td className="py-3 px-3 text-gray-700">{row.changeStatus}</td>
                <td className="py-3 px-3 text-gray-700 font-mono text-xs">{row.containerNo}</td>
                <td className="py-3 px-3 text-gray-600">{row.loadType}</td>
                <td className="py-3 px-3 text-gray-700">{row.customer}</td>
                <td className="py-3 px-3 text-gray-400">{row.pickupApt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
