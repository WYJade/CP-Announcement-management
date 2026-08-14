zimport { useState } from 'react'
import { Plus, Search, RotateCcw, Download, ChevronRight } from 'lucide-react'

interface Appointment {
  id: string
  apptNo: string
  carrier: string
  customer: string
  apptTime: string
  status: 'CHECKED IN' | 'WAITING FOR DRIVER' | 'COMPLETED' | 'CANCELLED'
  createdTime: string
  lastUpdateTime: string
}

const APPOINTMENTS: Appointment[] = [
  { id:'a1', apptNo:'APPT-3763', carrier:'FEDEX FREIGHT INC', customer:'SharkNinja Sales Company', apptTime:'2026-08-11 01:00', status:'CHECKED IN', createdTime:'2026-08-11 00:22 (estherccc)', lastUpdateTime:'2026-08-11 00:22 (warrenw_LT)' },
  { id:'a2', apptNo:'APPT-3761', carrier:'FEDEX FREIGHT INC', customer:'SharkNinja Sales Company', apptTime:'2026-08-10 04:00', status:'WAITING FOR DRIVER', createdTime:'2026-08-10 03:16 (estherccc)', lastUpdateTime:'2026-08-10 03:16 (estherccc)' },
  { id:'a3', apptNo:'APPT-3760', carrier:'FEDEX FREIGHT INC', customer:'SharkNinja Sales Company', apptTime:'2026-08-10 04:00', status:'WAITING FOR DRIVER', createdTime:'2026-08-10 03:16 (estherccc)', lastUpdateTime:'2026-08-10 03:16 (estherccc)' },
  { id:'a4', apptNo:'APPT-3758', carrier:'UPS FREIGHT', customer:'SharkNinja Sales Company', apptTime:'2026-08-09 06:00', status:'COMPLETED', createdTime:'2026-08-09 05:10 (warrenw_LT)', lastUpdateTime:'2026-08-09 08:30 (warrenw_LT)' },
  { id:'a5', apptNo:'APPT-3755', carrier:'XPO LOGISTICS', customer:'SharkNinja Sales Company', apptTime:'2026-08-08 02:00', status:'WAITING FOR DRIVER', createdTime:'2026-08-08 01:55 (estherccc)', lastUpdateTime:'2026-08-08 01:55 (estherccc)' },
]

function statusBadge(status: string) {
  if (status === 'CHECKED IN') return 'bg-green-100 text-green-800 border border-green-300'
  if (status === 'WAITING FOR DRIVER') return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
  if (status === 'COMPLETED') return 'bg-blue-100 text-blue-700 border border-blue-300'
  if (status === 'CANCELLED') return 'bg-red-100 text-red-700 border border-red-300'
  return 'bg-gray-100 text-gray-600 border border-gray-200'
}

export default function CarrierAppointment() {
  const [yard, setYard] = useState('Fontana')
  const [apptNo, setApptNo] = useState('')
  const [refNo, setRefNo] = useState('')
  const [poNo, setPoNo] = useState('')
  const [loadNo, setLoadNo] = useState('')
  const [carrier, setCarrier] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [apptStatus, setApptStatus] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filtered = APPOINTMENTS.filter(a => {
    if (apptNo && !a.apptNo.toLowerCase().includes(apptNo.toLowerCase())) return false
    if (apptStatus && a.status !== apptStatus) return false
    return true
  })

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Appointment</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Search filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Search By</p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Yard</label>
            <select value={yard} onChange={e => setYard(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400">
              <option>Fontana</option>
              <option>Savannah</option>
              <option>Long Beach</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">APPT #</label>
            <input value={apptNo} onChange={e => setApptNo(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Reference #</label>
            <input value={refNo} onChange={e => setRefNo(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">PO #</label>
            <input value={poNo} onChange={e => setPoNo(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">LOAD #</label>
            <input value={loadNo} onChange={e => setLoadNo(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Carrier</label>
            <select value={carrier} onChange={e => setCarrier(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400">
              <option value="">Select Carrier</option>
              <option>FEDEX FREIGHT INC</option>
              <option>UPS FREIGHT</option>
              <option>XPO LOGISTICS</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Service Type</label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400">
              <option value="">Select</option>
              <option>LTL</option>
              <option>TL</option>
              <option>Parcel</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Appointment Time Range</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <span className="text-gray-400 text-xs">⏰</span>
                <input placeholder="Start" className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none w-16" />
                <span className="text-gray-400 text-xs mx-1">–</span>
                <input placeholder="End" className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none w-16" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Appointment Status</label>
          <select value={apptStatus} onChange={e => setApptStatus(e.target.value)}
            className="w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-violet-400">
            <option value="">Select</option>
            <option>CHECKED IN</option>
            <option>WAITING FOR DRIVER</option>
            <option>COMPLETED</option>
            <option>CANCELLED</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => { setApptNo(''); setApptStatus(''); setCarrier(''); setServiceType('') }}
            className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <RotateCcw size={13} /> Reset
          </button>
          <button className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-1.5">
            <Search size={13} /> Search
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="flex justify-end mb-3">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
          <Download size={13} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-8 py-3 px-3"></th>
              {['APPT #','Carrier','Customer','APPT Time (America/Los_Angeles)','Status','Created Time','Last Update Time','ACTION'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(row => (
              <>
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <button onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronRight size={14} className={`transition-transform ${expandedRow === row.id ? 'rotate-90' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3 px-3 text-violet-600 font-medium cursor-pointer hover:underline">{row.apptNo}</td>
                  <td className="py-3 px-3 text-gray-800 font-medium">{row.carrier}</td>
                  <td className="py-3 px-3 text-gray-700">{row.customer}</td>
                  <td className="py-3 px-3 text-gray-600">{row.apptTime}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">{row.createdTime}</td>
                  <td className="py-3 px-3 text-gray-500 text-xs">{row.lastUpdateTime}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {row.status === 'CHECKED IN' ? (
                        <button className="text-xs text-violet-600 hover:text-violet-800 font-medium">View Details</button>
                      ) : (
                        <button className="text-xs text-violet-600 hover:text-violet-800 font-medium">Modify Driver</button>
                      )}
                      <span className="text-gray-300">|</span>
                      <button className="text-xs text-violet-600 hover:text-violet-800 font-medium">Edit</button>
                    </div>
                  </td>
                </tr>
                {expandedRow === row.id && (
                  <tr key={row.id + '-expanded'} className="bg-violet-50/40">
                    <td colSpan={9} className="px-8 py-4">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div><p className="text-gray-400 mb-1">APPT #</p><p className="text-gray-800 font-medium">{row.apptNo}</p></div>
                        <div><p className="text-gray-400 mb-1">Carrier</p><p className="text-gray-800">{row.carrier}</p></div>
                        <div><p className="text-gray-400 mb-1">Status</p>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center py-12 text-gray-400">No appointments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
