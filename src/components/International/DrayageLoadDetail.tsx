import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'

const DATA = {
  loadNo: 'UNIS_LGB_M028517', status: 'Pending', loadType: 'IMPORT', customer: 'VITA COCO',
  branch: 'UNIS Long Beach', created: '06/01/26 08:00 by system',
  refs: { BOL: 'MAEU4455667786', MBL: 'ONEYSH6AAB01700', HBL: '-', 'Seal #': '-', 'PO #': 'ANIBM26G5019', 'Shipment #': '2074537077', 'Appt #': '-' },
  container: { 'Container #': 'GAOU7353720', 'Size / Type': "40' High Cube", SSL: 'MAERSK', Vessel: 'MAERSK SENTOSA', Voyage: '621E', 'Chassis #': '-', Route: 'LGB-BPN', SCAC: 'MAEU' },
  timeline: [
    { label: 'Vessel ETA', date: '06/15/26 08:00', done: true },
    { label: 'Last Free Day', date: '06/22/26', done: true, warning: true },
    { label: 'Pickup Appt', date: '06/22/26 08:00', done: true },
    { label: 'Delivery Appt', date: '06/22/26 14:00', done: true },
    { label: 'Empty Return Date', date: '06/27/26', done: false },
    { label: 'Actual Delivered', date: '-', done: false, current: true },
  ],
  journey: {
    origin: { name: 'APM TERMINAL (Pier 400) (W185)', dates: '06/22/26 08:00 — 06/22/26 10:00' },
    destination: { name: 'UNIS BUENA PARK', address: '6800 Valley View St, Buena Park, CA 90620', dates: '06/22/26 14:00 — 06/22/26 16:00' },
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
}

export default function DrayageLoadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const d = { ...DATA, loadNo: id || DATA.loadNo }

  return (
    <div className="p-6">
      {/* Header */}
      <button onClick={() => navigate('/international/drayage')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"><ArrowLeft size={14} /></button>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-xl font-bold text-gray-900">#{d.loadNo}</h1>
        <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">{d.status}</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Load Type: <strong>{d.loadType}</strong> &nbsp; Customer: <strong>{d.customer}</strong> &nbsp; Branch: <strong>{d.branch}</strong> &nbsp; Created: {d.created}</p>

      {/* Main layout: Left sidebar (refs+container) + Right content (timeline+journey+events) */}
      <div className="flex gap-6">
        {/* Left sidebar */}
        <div className="w-52 shrink-0 space-y-5">
          {/* References */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><span className="text-gray-300">§</span> REFERENCES</h4>
            <div className="space-y-1.5">
              {Object.entries(d.refs).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs"><span className="text-gray-400">{k}</span><span className="font-semibold text-gray-800">{v as string}</span></div>
              ))}
            </div>
          </div>
          {/* Container */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><span className="text-gray-300">§</span> CONTAINER</h4>
            <div className="space-y-1.5">
              {Object.entries(d.container).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs"><span className="text-gray-400">{k}</span><span className="font-semibold text-gray-800">{v as string}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 space-y-6">
          {/* Dates & Timeline */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="text-xs font-bold text-gray-700 mb-4 flex items-center gap-1"><span className="text-primary-600">|</span> DATES & TIMELINE</h4>
            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />
              <div className="absolute top-4 left-6 h-0.5 bg-green-400 z-0" style={{width:'60%'}} />
              {d.timeline.map((t, i) => (
                <div key={i} className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.done ? 'bg-green-500' : t.current ? 'bg-green-600 ring-4 ring-green-100' : 'border-2 border-gray-300 bg-white'}`}>
                    {(t.done || t.current) && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <p className="text-[9px] font-medium text-gray-600 mt-1.5 leading-tight max-w-[70px]">{t.label}</p>
                  <p className={`text-[8px] mt-0.5 ${t.warning ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>{t.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Journey */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="text-xs font-bold text-gray-700 mb-4 flex items-center gap-1"><span className="text-primary-600">|</span> SHIPMENT JOURNEY</h4>
            <div className="flex items-start justify-between">
              <div className="text-center flex-1">
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-green-100 text-green-700 rounded mb-1">ORIGIN</span>
                <p className="text-sm font-semibold text-gray-900">{d.journey.origin.name}</p>
                <p className="text-[10px] text-green-600 mt-0.5">{d.journey.origin.dates}</p>
              </div>
              <div className="flex items-center px-2 pt-5"><div className="w-16 border-t-2 border-dashed border-gray-300" /><span className="text-gray-400 mx-1">&rarr;</span><div className="w-16 border-t-2 border-dashed border-gray-300" /></div>
              <div className="text-center flex-1">
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded mb-1">DESTINATION</span>
                <p className="text-sm font-semibold text-gray-900">{d.journey.destination.name}</p>
                <p className="text-[10px] text-gray-500">{d.journey.destination.address}</p>
                <p className="text-[10px] text-green-600 mt-0.5">{d.journey.destination.dates}</p>
              </div>
              <div className="flex items-center px-2 pt-5"><div className="w-10 border-t-2 border-dashed border-gray-300" /></div>
              <div className="text-center flex-shrink-0">
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-600 rounded mb-1">RETURN TO</span>
                <p className="text-xs font-semibold text-gray-900">{d.journey.returnTo.name}</p>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="grid grid-cols-6 gap-3">
            {d.events.map((e, i) => (
              <div key={i} className={`text-center p-3 rounded-lg ${e.done ? 'bg-green-50 border border-green-200' : e.inProgress ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`w-9 h-9 rounded-full mx-auto mb-2 flex items-center justify-center ${e.done ? 'bg-green-500' : e.inProgress ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  {e.done ? <CheckCircle2 size={14} className="text-white" /> : <Circle size={14} className="text-white" />}
                </div>
                <p className="text-[9px] font-semibold text-gray-700 leading-tight">{e.label}</p>
                {e.inProgress && <p className="text-[8px] text-blue-600 font-medium mt-0.5">In Progress</p>}
                <p className="text-[8px] text-gray-400 mt-0.5">{e.date || '-'}</p>
                <p className="text-[8px] text-gray-400">{e.location}</p>
              </div>
            ))}
          </div>

          {/* Live Status */}
          <div className="bg-gray-900 text-white rounded-lg px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-xs font-semibold">LIVE STATUS</span></div>
            <div className="flex items-center gap-8 text-xs">
              <div><span className="text-gray-400">Current Location: </span><strong>{d.liveStatus.location}</strong></div>
              <div><span className="text-gray-400">Driver: </span><strong>{d.liveStatus.driver}</strong></div>
              <div><span className="text-gray-400">ETA: </span><strong>{d.liveStatus.eta}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
