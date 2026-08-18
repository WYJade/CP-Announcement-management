import { useState } from 'react'
import { Plus, Search, RotateCcw, Download } from 'lucide-react'

interface AppointmentRow {
  id: string
  apptNo: string
  carrier: string
  customer: string
  apptTime: string
  status: 'CHECKED IN' | 'WAITING FOR DRIVER' | 'COMPLETED' | 'CANCELLED' | 'SCHEDULED'
  createdTime: string
  lastUpdateTime: string
}

const DATA: AppointmentRow[] = [
  { id:'a1', apptNo:'APPT-3763', carrier:'FEDEX FREIGHT INC', customer:'SharkNinja Sales Company', apptTime:'2026-08-11 01:00', status:'CHECKED IN', createdTime:'2026-08-11 00:22 (estherccc)', lastUpdateTime:'2026-08-11 00:22 (warrenw_LT)' },
  { id:'a2', apptNo:'APPT-3761', carrier:'FEDEX FREIGHT INC', customer:'SharkNinja Sales Company', apptTime:'2026-08-10 04:00', status:'WAITING FOR DRIVER', createdTime:'2026-08-10 03:16 (estherccc)', lastUpdateTime:'2026-08-10 03:16 (estherccc)' },
  { id:'a3', apptNo:'APPT-3760', carrier:'FEDEX FREIGHT INC', customer:'SharkNinja Sales Company', apptTime:'2026-08-10 04:00', status:'WAITING FOR DRIVER', createdTime:'2026-08-10 03:16 (estherccc)', lastUpdateTime:'2026-08-10 03:16 (estherccc)' },
  { id:'a4', apptNo:'APPT-3758', carrier:'UPS FREIGHT', customer:'SharkNinja Sales Company', apptTime:'2026-08-09 06:00', status:'COMPLETED', createdTime:'2026-08-09 05:10 (warrenw_LT)', lastUpdateTime:'2026-08-09 08:30 (warrenw_LT)' },
  { id:'a5', apptNo:'APPT-3755', carrier:'XPO LOGISTICS', customer:'ADOORN LLC', apptTime:'2026-08-08 02:00', status:'SCHEDULED', createdTime:'2026-08-08 01:55 (estherccc)', lastUpdateTime:'2026-08-08 01:55 (estherccc)' },
]

function statusBadge(s: string) {
  if (s === 'CHECKED IN') return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'WAITING FOR DRIVER') return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  if (s === 'COMPLETED') return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (s === 'SCHEDULED') return 'bg-violet-100 text-violet-700 border border-violet-200'
  return 'bg-gray-100 text-gray-500'
}

export default function AppointmentList() {
  const [yard, setYard] = useState('Fontana')
  const [apptNo, setApptNo] = useState('')
  const [carrier, setCarrier] = useState('')
  const [apptStatus, setApptStatus] = useState('')

  const filtered = DATA.filter(r => {
    if (apptNo && !r.apptNo.toLowerCase().includes(apptNo.toLowerCase())) return false
    if (carrier && r.carrier !== carrier) return false
    if (apptStatus && r.status !== apptStatus) return false
    return true
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Search By</p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Yard</label>
            <select value={yard} onChange={e => setYard(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400">
              <option>Fontana</option><option>Savannah</option><option>Long Beach</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">APPT #</label>
            <input value={apptNo} onChange={e => setApptNo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Carrier</label>
            <select value={carrier} onChange={e => setCarrier(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400">
              <option value="">Select Carrier</option>
              <option>FEDEX FREIGHT INC</option><option>UPS FREIGHT</option><option>XPO LOGISTICS</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Appointment Status</label>
            <select value={apptStatus} onChange={e => setApptStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400">
              <option value="">Select</option>
              <option>CHECKED IN</option><option>WAITING FOR DRIVER</option><option>COMPLETED</option><option>SCHEDULED</option><option>CANCELLED</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => { setApptNo(''); setCarrier(''); setApptStatus('') }}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
            <RotateCcw size={13} /> Reset
          </button>
          <button className="flex items-center gap-1.5 px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700">
            <Search size={13} /> Search
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="flex justify-end mb-3">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['APPT #','Carrier','Customer','APPT Time (America/Los_Angeles)','Status','Created Time','Last Update Time','ACTION'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-violet-600 font-medium cursor-pointer hover:underline">{row.apptNo}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{row.carrier}</td>
                <td className="py-3 px-4 text-gray-700">{row.customer}</td>
                <td className="py-3 px-4 text-gray-600">{row.apptTime}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">{row.createdTime}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{row.lastUpdateTime}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {row.status === 'CHECKED IN' ? (
                      <button className="text-xs text-violet-600 hover:text-violet-800 font-medium">View Details</button>
                    ) : (row.status === 'WAITING FOR DRIVER' || row.status === 'SCHEDULED') ? (
                      <button className="text-xs text-violet-600 hover:text-violet-800 font-medium">Modify Driver</button>
                    ) : null}
                    {(row.status === 'CHECKED IN' || row.status === 'WAITING FOR DRIVER' || row.status === 'SCHEDULED') && (
                      <>
                        <span className="text-gray-300 text-xs">|</span>
                        <button className="text-xs text-violet-600 hover:text-violet-800 font-medium">Edit</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No appointments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
