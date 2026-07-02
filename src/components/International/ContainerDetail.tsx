import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Ship, Calendar, Box, Anchor } from 'lucide-react'

const CONTAINER_DATA: Record<string, any> = {
  'MSNU1696110': { containerNo: 'MSNU1696110', ssl: 'MSCU', size: '20 Standard', port: 'LBCT', status: 'Available', location: 'GROUNDED', lfd: '04/06', lfdDays: -85, assignedTo: 'deshuai.zhu', vessel: 'SEASPAN HAMBURG', voyage: '612', bol: 'ZY017721', eta: '2026-03-28T14:00', dischargeDate: '2026-03-28T16:39', outgateDate: '-', apptTime: '-', syncedAt: '2026/04/28 02:48:12', loadNo: 'UNIS_DAL_M001491', loadCreated: '04/22/2026 23:51' },
}

const DEFAULT = { containerNo: '', ssl: 'MSCU', size: '40 High Cube', port: 'LBCT', status: 'Available', location: 'GROUNDED', lfd: '06/25', lfdDays: -10, assignedTo: 'ops.team', vessel: 'COSCO FAITH', voyage: '607E', bol: '-', eta: '2026-06-15T08:00', dischargeDate: '2026-06-15T16:00', outgateDate: '-', apptTime: '-', syncedAt: '2026/06/16 08:30:00', loadNo: 'UNIS_LGB_M009798', loadCreated: '06/01/2026 08:00' }

export default function ContainerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Details')
  const d = CONTAINER_DATA[id || ''] || { ...DEFAULT, containerNo: id || '' }

  const TABS = ['Details', 'Availability', 'Load']

  return (
    <div className="p-6">
      <button onClick={() => navigate('/international/containers')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to Containers</button>

      {/* Header - compact with status badge */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Container Details</p>
            <h1 className="text-xl font-bold text-gray-900 mt-1">{d.containerNo} <span className="text-gray-400 font-normal">&bull;</span> {d.ssl} / {d.size} <span className="text-gray-400 font-normal">&bull;</span> {d.port}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1 text-gray-600"><MapPin size={11} /> Location: <strong className="text-purple-600">{d.location}</strong></span>
              <span className="flex items-center gap-1"><Calendar size={11} className="text-gray-400" /> LFD: <strong>{d.lfd}</strong> <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-semibold ml-1">{d.lfdDays}d</span></span>
              <span className="text-gray-400">Assigned: <span className="text-gray-600">{d.assignedTo}</span></span>
            </div>
          </div>
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${d.status === 'Available' ? 'bg-green-100 text-green-700' : d.status === 'Hold' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{d.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-5 border-b border-gray-200 mb-4">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
        ))}
      </div>

      {/* Details tab - multi-column grid layout */}
      {activeTab === 'Details' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div><p className="text-[10px] text-gray-400 uppercase">Status</p><p className="text-sm font-medium text-gray-900">{d.status}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Location</p><p className="text-sm font-medium text-purple-600">{d.location}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Port</p><p className="text-sm font-medium text-gray-900">{d.port}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">ETA</p><p className="text-sm font-medium text-gray-900">{d.eta}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">LFD</p><p className="text-sm font-medium text-primary-600">{d.lfd}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Discharge Date</p><p className="text-sm font-medium text-gray-900">{d.dischargeDate}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Outgate Date</p><p className="text-sm font-medium text-gray-900">{d.outgateDate || '-'}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Appt Time</p><p className="text-sm font-medium text-gray-900">{d.apptTime || '-'}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Size</p><p className="text-sm font-medium text-gray-900">{d.size}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Shipping Line (SSL)</p><p className="text-sm font-medium text-gray-900">{d.ssl}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Vessel</p><p className="text-sm font-medium text-gray-900">{d.vessel}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Voyage</p><p className="text-sm font-medium text-gray-900">{d.voyage}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">BOL</p><p className="text-sm font-medium text-gray-900">{d.bol}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Holds</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Pick up# / Appt#</p><p className="text-sm font-medium text-gray-900">-</p></div>
          </div>
        </div>
      )}

      {/* Availability tab - compact multi-column */}
      {activeTab === 'Availability' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary-600">Channel 1</span>
              <span className="text-[10px] text-gray-400">Last synced: {d.syncedAt}</span>
            </div>
            <button className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Refresh</button>
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div><p className="text-[10px] text-gray-400 uppercase">Terminal</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Source</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Location</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Parsed Location</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Holds</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Demurrage Fees</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Ready For Appointment</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Available For Pickup</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Wheeled</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Last Free Date</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Discharged Time</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Observed</p><p className="text-sm font-medium text-gray-900">-</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Synced At</p><p className="text-sm font-medium text-gray-900">{d.syncedAt}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Error</p><p className="text-sm font-medium text-gray-900">-</p></div>
          </div>
        </div>
      )}

      {/* Load tab */}
      {activeTab === 'Load' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b"><th className="text-left py-3 px-4 font-semibold text-gray-500">Load #</th><th className="text-left py-3 px-4 font-semibold text-gray-500">Created Time</th><th className="text-left py-3 px-4 font-semibold text-gray-500">Status</th></tr></thead>
            <tbody><tr className="border-b border-gray-100 hover:bg-gray-50"><td className="py-3 px-4 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/international/drayage/${d.loadNo}`)}>{d.loadNo}</td><td className="py-3 px-4 text-gray-700">{d.loadCreated}</td><td className="py-3 px-4"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Active</span></td></tr></tbody>
          </table>
        </div>
      )}
    </div>
  )
}
