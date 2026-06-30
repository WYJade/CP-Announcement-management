import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const CONTAINER_DATA: Record<string, any> = {
  'MSNU1696110': { containerNo: 'MSNU1696110', ssl: 'MSCU', size: '20 Standard', port: 'LBCT', status: 'Available', location: 'GROUNDED', lfd: '04/06', lfdDays: -85, assignedTo: 'deshuai.zhu', vessel: 'SEASPAN HAMBURG', voyage: '612', bol: 'ZY017721', eta: '2026-03-28T14:00', dischargeDate: '2026-03-28T16:39', syncedAt: '2026/04/28 02:48:12', loadNo: 'UNIS_DAL_M001491', loadCreated: '04/22/2026 23:51' },
}

const DEFAULT = { containerNo: '', ssl: 'MSCU', size: '40 High Cube', port: 'LBCT', status: 'Available', location: 'GROUNDED', lfd: '06/25', lfdDays: -10, assignedTo: 'ops.team', vessel: 'COSCO FAITH', voyage: '607E', bol: '-', eta: '2026-06-15T08:00', dischargeDate: '2026-06-15T16:00', syncedAt: '2026/06/16 08:30:00', loadNo: 'UNIS_LGB_M009798', loadCreated: '06/01/2026 08:00' }

export default function ContainerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Details')
  const d = CONTAINER_DATA[id || ''] || { ...DEFAULT, containerNo: id || '' }

  const TABS = ['Details', 'Availability', 'Appointment', 'Load']

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/international/containers')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"><ArrowLeft size={14} /> Back to Containers</button>

      <p className="text-xs text-gray-400 mb-2">Container Details</p>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-lg font-bold text-gray-900">{d.containerNo} &bull; {d.ssl} /{d.size} &bull; <strong>{d.port}</strong></p>
        <p className="text-sm">Status: <strong className="text-gray-900">{d.status}</strong></p>
      </div>
      <p className="text-sm text-gray-600">Location: {d.location}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs border-l-2 border-primary-600 pl-1.5">LFD: {d.lfd}</span>
        <span className="text-xs bg-red-100 text-red-600 px-1.5 rounded font-medium">{d.lfdDays} days</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">Assigned to: <span className="border border-gray-200 px-1.5 rounded text-gray-600">{d.assignedTo}</span></p>
      <p className="text-xs text-gray-400 mt-0.5">Added by: -</p>

      {/* Tabs */}
      <div className="flex gap-5 mt-5 border-b border-gray-200 mb-5">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
        ))}
      </div>

      {/* Details tab */}
      {activeTab === 'Details' && (
        <div className="space-y-2">
          {[['Status', d.status], ['Holds', ''], ['ETA', d.eta], ['LFD', d.lfd + 'T00:00'], ['Discharge Date', d.dischargeDate], ['Outgate Date', '-'], ['Appt Time', '-'], ['Size', d.size], ['Location', d.location], ['Port', d.port], ['Shipping Line', d.ssl], ['Vessel Name', d.vessel], ['Voyage', d.voyage], ['BOL', d.bol], ['Pick up#/Appt#', '-']].map(([k, v]) => (
            <div key={k} className="flex border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500 w-44">{k}</span>
              <span className={`text-sm font-medium ${k === 'LFD' ? 'border-l-2 border-primary-600 pl-1.5 text-primary-600' : k === 'Location' ? 'border-l-2 border-purple-500 pl-1.5 text-purple-600' : 'text-gray-900'}`}>{v || '-'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Availability tab */}
      {activeTab === 'Availability' && (
        <div>
          <p className="text-xs text-primary-600 mb-2">Channel 1</p>
          <p className="text-[10px] text-red-500 mb-3">Last checked: {d.syncedAt} &nbsp; Last updated: {d.syncedAt} &nbsp;<button className="bg-primary-600 text-white px-2 py-0.5 rounded text-[10px]">Refresh</button></p>
          <div className="grid grid-cols-2 gap-x-6">
            {[['Terminal', '-', 'Source', '-'], ['Location', '-', 'Parsed Location', '-'], ['Holds', '-', 'Demurrage Fees', '-'], ['Ready For Appointment', '-', 'Available For Pickup', '-'], ['Wheeled', '-', 'Last Free Date', '-'], ['Discharged Time', '-', 'Observed', '-'], ['Synced At', d.syncedAt, 'Error', '-']].map(([k1, v1, k2, v2], i) => (
              <div key={i} className="contents">
                <div className="flex border-b border-gray-100 py-2 bg-gray-50 px-2"><span className="text-xs text-gray-500 w-36">{k1}</span><span className="text-xs text-gray-800">{v1}</span></div>
                <div className="flex border-b border-gray-100 py-2 bg-gray-50 px-2"><span className="text-xs text-gray-500 w-36">{k2}</span><span className="text-xs text-gray-800">{v2}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment tab */}
      {activeTab === 'Appointment' && (
        <div className="text-center py-10 text-gray-400 text-sm">No appointment data available</div>
      )}

      {/* Load tab */}
      {activeTab === 'Load' && (
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b"><th className="text-left py-2.5 px-3 font-semibold text-gray-500">Load #</th><th className="text-left py-2.5 px-3 font-semibold text-gray-500">Created Time</th></tr></thead>
          <tbody><tr className="border-b border-gray-100"><td className="py-2.5 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/international/drayage/${d.loadNo}`)}>{d.loadNo}</td><td className="py-2.5 px-3">{d.loadCreated}</td></tr></tbody>
        </table>
      )}
    </div>
  )
}
