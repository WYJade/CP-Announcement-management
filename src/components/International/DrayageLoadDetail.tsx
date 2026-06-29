import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'

const LOADS: Record<string, any> = {
  'UNIS_SAV_M012771': {
    loadNo: 'UNIS_SAV_M012771', status: 'Pending', loadType: 'IMPORT', customer: 'VITA COCO',
    branch: 'UNIS Long Beach', created: '06/01/26 08:00 by system',
    refs: { Bol: 'MAEU4455667786', Mbl: 'ONEYSH6AAB01700', Hbl: '-', 'Seal No': '-', 'PO No': 'ANIBM26G5019', 'Shipment No': '2074537077', 'Appt No': '-' },
    container: { 'Container Id': 'C4CU7352720', 'Size / Type': "40' High Cube", SSL: 'MAERSK', Vessel: 'MAERSK SENTOSA', Voyage: '607E', Chassis: '-', Route: 'LGB-BPN' },
    timeline: [
      { label: 'Vessel ETA', date: '06/19/26 08:00', done: true },
      { label: 'Last Free Day', date: '06/25/26', done: true },
      { label: 'Pickup Appt', date: '06/21/26 08:00', done: true },
      { label: 'Delivery Appt', date: '06/22/26 14:00', done: true },
      { label: 'Empty Return Date', date: '06/27/26', done: false },
      { label: 'Actual Delivered', date: '-', done: false, current: true },
    ],
    journey: {
      origin: { name: 'APM TERMINAL (Pier 400) (W185)', dates: '06/20/26 08:00 - 06/20/26 10:00' },
      destination: { name: 'UNIS BUENA PARK', address: '4400 Valley View St, Buena Park, CA 90620', dates: '06/22/26 14:00 - 06/22/26 16:00' },
      returnTo: { name: 'APM TERMINAL (Pier 400) (W185)' },
    },
    events: [
      { label: 'Ocean Vessel Arrived', date: '06/13/26 08:00', location: 'Port of Long Beach, CA', done: true },
      { label: 'Container Available', date: 'Oct 17/26', location: 'LBCT Terminal', done: true },
      { label: 'Picked Up From Terminal', date: '-', location: 'APM TERMINAL (Pier 400) (W185)', done: false },
      { label: 'En Route To DC', date: '-', location: 'Long Beach, CA', done: false },
      { label: 'Delivered', date: '-', location: 'UNIS BUENA PARK', done: false },
      { label: 'Empty Returned', date: '-', location: 'APM TERMINAL (Pier 400) (W185)', done: false, inProgress: true },
    ],
    liveStatus: { location: 'Long Beach, CA', driver: 'John Smith', eta: 'Today - 2:15 PM' },
  },
}

const DEFAULT = LOADS['UNIS_SAV_M012771']

export default function DrayageLoadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const data = LOADS[id || ''] || { ...DEFAULT, loadNo: id }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/international/drayage')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to Drayage Loads</button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-xl font-bold text-gray-900">#{data.loadNo}</h1>
        <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">{data.status}</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Load Type: <strong>{data.loadType}</strong> | Customer: <strong>{data.customer}</strong> | Branch: <strong>{data.branch}</strong> | Created: {data.created}</p>

      {/* References + Container + Dates & Timeline */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* References */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">References</h4>
          <div className="space-y-2">
            {Object.entries(data.refs).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs"><span className="text-gray-400">{k}</span><span className="font-semibold text-gray-800 text-right">{v as string}</span></div>
            ))}
          </div>
        </div>
        {/* Container */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Container</h4>
          <div className="space-y-2">
            {Object.entries(data.container).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs"><span className="text-gray-400">{k}</span><span className="font-semibold text-gray-800 text-right">{v as string}</span></div>
            ))}
          </div>
        </div>
        {/* Dates & Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Dates & Timeline</h4>
          <div className="flex items-center justify-between gap-1">
            {data.timeline.map((t: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${t.done ? 'bg-green-500' : t.current ? 'bg-green-600 ring-2 ring-green-200' : 'border-2 border-gray-300 bg-white'}`}>
                  {(t.done || t.current) && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <p className="text-[8px] text-gray-600 font-medium leading-tight">{t.label}</p>
                <p className="text-[7px] text-gray-400">{t.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shipment Journey */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Shipment Journey</h4>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-green-100 text-green-700 rounded mb-1">ORIGIN</span>
            <p className="text-sm font-semibold text-gray-900">{data.journey.origin.name}</p>
            <p className="text-[10px] text-green-600 mt-0.5">{data.journey.origin.dates}</p>
          </div>
          <div className="px-3"><div className="w-20 border-t-2 border-dashed border-gray-300" /></div>
          <div className="text-center flex-1">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded mb-1">DESTINATION</span>
            <p className="text-sm font-semibold text-gray-900">{data.journey.destination.name}</p>
            <p className="text-[10px] text-gray-500">{data.journey.destination.address}</p>
            <p className="text-[10px] text-green-600 mt-0.5">{data.journey.destination.dates}</p>
          </div>
          <div className="px-3"><div className="w-20 border-t-2 border-dashed border-gray-300" /></div>
          <div className="text-center flex-1">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-600 rounded mb-1">RETURN TO</span>
            <p className="text-sm font-semibold text-gray-900">{data.journey.returnTo.name}</p>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {data.events.map((e: any, i: number) => (
          <div key={i} className={`text-center p-3 rounded-lg border ${e.done ? 'bg-green-50 border-green-200' : e.inProgress ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`w-9 h-9 rounded-full mx-auto mb-2 flex items-center justify-center ${e.done ? 'bg-green-500' : e.inProgress ? 'bg-blue-500' : 'bg-gray-200'}`}>
              {e.done ? <CheckCircle2 size={14} className="text-white" /> : <Circle size={14} className="text-white" />}
            </div>
            <p className="text-[9px] font-semibold text-gray-700">{e.label}</p>
            <p className="text-[8px] text-gray-400 mt-0.5">{e.date || '-'}</p>
            <p className="text-[8px] text-gray-400">{e.location}</p>
          </div>
        ))}
      </div>

      {/* Live Status Bar */}
      <div className="bg-gray-900 text-white rounded-lg px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-xs font-semibold">LIVE STATUS</span></div>
        <div className="flex items-center gap-8 text-xs">
          <div><span className="text-gray-400">Current Location: </span><strong>{data.liveStatus.location}</strong></div>
          <div><span className="text-gray-400">Driver: </span><strong>{data.liveStatus.driver}</strong></div>
          <div><span className="text-gray-400">ETA: </span><strong>{data.liveStatus.eta}</strong></div>
        </div>
      </div>
    </div>
  )
}
