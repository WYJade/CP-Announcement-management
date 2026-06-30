import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'

const D = {
  shipmentNo: 'SSHAS2608135', containerMode: 'Full Container Load', incoterm: 'Free On Board',
  mode: 'Sea Freight', senderOrg: 'Cubeship Consolidation Company',
  hbl: 'SSHAS2608135', shipmentNoAlt: 'SSHAS2608135',
  vesselName: 'CMA CGM VERDI', voyageFlightNo: 'ONAMHVWHA',
  masterShipmentNo: 'HDUJSLA26MT06006', transitStatus: 'At Destination',
  plannedDeparture: 'Jun 18, 2026', plannedArrival: 'Jul 01, 2026',
  parties: [
    { type: 'Carrier', name: 'HEDE (HONGKONG) INTERNATIONAL SHI...', address1: 'HARBOR DEVELOPMENT ZONE', city: 'TANGSHAN', state: 'HE', country: 'CN' },
    { type: 'Pickup', name: 'SUZHOU YOULI FOODS CO. LTD.', address1: 'NO.15 DONGYUAN ROAD, JINTING TOWN', city: 'SUZHOU', state: '', country: 'CN' },
    { type: 'Shipper', name: 'SUZHOU YOULI FOODS CO. LTD.', address1: 'NO.15 DONGYUAN ROAD, JINTING TOWN', city: 'SUZHOU', state: '', country: 'CN' },
    { type: 'Provider', name: 'Cubeship Consolidation Company', address1: '', city: '', state: '', country: '' },
    { type: 'Client', name: 'THE ONLY BEAN LLC', address1: '6320 S SANDHILL RD STE 5', city: 'LAS VEGAS', state: 'NV', country: 'US' },
    { type: 'Consignee', name: 'THE ONLY BEAN LLC', address1: '3778 W CHEYENNE AVE STE 100', city: 'NORTH LAS VEGAS', state: 'NV', country: 'US' },
    { type: 'Delivery', name: 'THE ONLY BEAN LLC', address1: '3778 W CHEYENNE AVE STE 100', city: 'NORTH LAS VEGAS', state: 'NV', country: 'US' },
  ],
  equipment: [
    { no: 1, containerNo: 'XYLU8225020', sealNo: 'C1352884', description: 'Forty foot high cube', itemCount: 0, totalValue: '$0.00', totalCartons: 'Unavailable', goodsWeight: '7,680.00', tareWeight: '0.00' },
    { no: 2, containerNo: 'SELU4350353', sealNo: 'C1352828', description: 'Forty foot high cube', itemCount: 0, totalValue: '$0.00', totalCartons: 'Unavailable', goodsWeight: '7,680.00', tareWeight: '0.00' },
  ],
  milestones: [
    { description: 'Departure from First Load Port', eventCode: 'DEP', plannedDate: 'Not Available', actualDate: 'Jun 18, 2026' },
    { description: 'Arrival at Final Discharge Port', eventCode: 'ARV', plannedDate: 'Jul 01, 2026', actualDate: 'Not Available' },
    { description: 'All Import Documents Received', eventCode: 'AID', plannedDate: 'Not Available', actualDate: 'Jun 27, 2026' },
    { description: 'All Export Documents Received', eventCode: 'AED', plannedDate: 'Not Available', actualDate: 'Jun 27, 2026' },
    { description: 'Shipped On Board', eventCode: 'FLO', plannedDate: 'Not Available', actualDate: 'Jun 18, 2026' },
  ],
}

const STEPS = ['Booked', 'At Origin', 'In Transit', 'At Destination', 'Delivered']
const SECTIONS = ['Details', 'Parties', 'Equipment', 'Items', 'Milestones']
const currentStep = 3 // At Destination

// Container detail modal data
const CONTAINER_DETAIL = {
  containerNo: 'XYLU8225020', ssl: 'MSCU', size: '40 High Cube', port: 'LBCT', status: 'Available', location: 'GROUNDED',
  lfd: '04/06', lfdDays: -85, assignedTo: 'deshuai.zhu',
  details: { Status: 'AVAILABLE', Holds: '', ETA: '2026-03-28T14:00', LFD: '2026-04-06T00:00', 'Discharge Date': '2026-03-28T16:39', 'Outgate Date': '-', 'Appt Time': '-', Size: '40 High Cube', Location: 'GROUNDED', Port: 'LBCT', 'Shipping Line': 'MSCU', 'Vessel Name': 'SEASPAN HAMBURG', Voyage: '612', BOL: 'ZY017721', 'Pick up#/Appt#': '-' },
  availability: { Terminal: '-', Source: '-', Location: '-', 'Parsed Location': '-', Holds: '-', 'Demurrage Fees': '-', 'Ready For Appointment': '-', 'Available For Pickup': '-', Wheeled: '-', 'Last Free Date': '-', 'Discharged Time': '-', Observed: '-', 'Synced At': '2026/04/28 02:48:12.108453694', Error: '-' },
  load: { loadNo: 'UNIS_DAL_M001491', createdTime: '04/22/2026 23:51' },
}

export default function IntlShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [containerModal, setContainerModal] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/international/shipments')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to Shipments</button>
      <h1 className="text-xl font-bold text-gray-900 mb-3">{D.shipmentNoAlt}</h1>

      {/* Anchor nav */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200 pb-3 sticky top-14 bg-white z-10">
        {SECTIONS.map(s => (<a key={s} href={`#${s.toLowerCase()}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600"><span className="w-2.5 h-2.5 rounded-full border-2 border-gray-300" />{s}</a>))}
      </div>

      {/* Details */}
      <section id="details" className="mb-8">
        <div className="flex gap-6">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8">
              {[['Container Mode',D.containerMode,'Incoterm',D.incoterm],['Mode',D.mode,'Sender Organization',D.senderOrg],['HBL',D.hbl,'Shipment No',D.shipmentNoAlt],['Vessel Name',D.vesselName,'Voyage Flight No',D.voyageFlightNo],['Master Shipment No',D.masterShipmentNo,'Transit Status',D.transitStatus],['Planned Departure Date',D.plannedDeparture,'Planned Arrival Date',D.plannedArrival]].map(([l1,v1,l2,v2],i)=>(<div key={i} className="contents"><div><p className="text-xs text-gray-400">{l1}</p><p className="text-sm font-medium text-gray-900">{v1}</p></div><div><p className="text-xs text-gray-400">{l2}</p><p className="text-sm font-medium text-gray-900">{v2}</p></div></div>))}
            </div>
          </div>
          <div className="w-48 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Milestone Progress</h3>
            <div className="space-y-3">{STEPS.map((s,i)=>(<div key={s} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${i<=currentStep?'bg-gray-800':'border-2 border-gray-300'}`}/><span className={`text-xs ${i<=currentStep?'text-gray-800 font-medium':'text-gray-400'}`}>{s}</span></div>))}</div>
          </div>
        </div>
      </section>

      {/* Parties */}
      <section id="parties" className="mb-8">
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-gray-900">Parties</h3><span className="text-xs text-primary-600 cursor-pointer">Download CSV</span></div>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Party Type','Name','Address 1','City','State','Country'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.parties.map((p,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-medium">{p.type}</td><td className="py-2.5 px-3">{p.name}</td><td className="py-2.5 px-3">{p.address1}</td><td className="py-2.5 px-3">{p.city}</td><td className="py-2.5 px-3">{p.state}</td><td className="py-2.5 px-3">{p.country}</td></tr>))}</tbody></table>
        </div>
      </section>

      {/* Equipment */}
      <section id="equipment" className="mb-8">
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-gray-900">Equipment</h3><span className="text-xs text-primary-600 cursor-pointer">Download CSV</span></div>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['No','Container No','Seal No','Description','Item Count','Total Value','Total Cartons','Goods Weight(KG)','Tare Weight(KG)'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.equipment.map(e=>(<tr key={e.no} className="border-b border-gray-100"><td className="py-2.5 px-3">{e.no}</td><td className="py-2.5 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={()=>setContainerModal(e.containerNo)}>{e.containerNo}</td><td className="py-2.5 px-3">{e.sealNo}</td><td className="py-2.5 px-3">{e.description}</td><td className="py-2.5 px-3">{e.itemCount}</td><td className="py-2.5 px-3">{e.totalValue}</td><td className="py-2.5 px-3">{e.totalCartons}</td><td className="py-2.5 px-3">{e.goodsWeight}</td><td className="py-2.5 px-3">{e.tareWeight}</td></tr>))}</tbody></table>
        </div>
      </section>

      {/* Items */}
      <section id="items" className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Items</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm">No data available to display</div>
      </section>

      {/* Milestones */}
      <section id="milestones" className="mb-8">
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-gray-900">Milestones</h3><span className="text-xs text-primary-600 cursor-pointer">Download CSV</span></div>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Description','Event Code','Planned Date','Actual Date'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.milestones.map((m,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3">{m.description}</td><td className="py-2.5 px-3">{m.eventCode}</td><td className="py-2.5 px-3">{m.plannedDate}</td><td className="py-2.5 px-3">{m.actualDate}</td></tr>))}</tbody></table>
        </div>
      </section>

      {/* Container Detail Modal */}
      {containerModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-y-auto" onClick={()=>setContainerModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mb-10" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b"><h3 className="text-sm font-medium text-gray-500">Container Details</h3><button onClick={()=>setContainerModal(null)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button></div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-bold text-gray-900">{CONTAINER_DETAIL.containerNo} &bull; {CONTAINER_DETAIL.ssl} /{CONTAINER_DETAIL.size} &bull; <strong>{CONTAINER_DETAIL.port}</strong></p>
                <p className="text-sm">Status: <strong>{CONTAINER_DETAIL.status}</strong></p>
              </div>
              <p className="text-sm text-gray-600">Location: {CONTAINER_DETAIL.location}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs border-l-2 border-primary-600 pl-1.5">LFD: {CONTAINER_DETAIL.lfd}</span>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 rounded">{CONTAINER_DETAIL.lfdDays} days</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Assigned to: <span className="border border-gray-200 px-1.5 rounded">{CONTAINER_DETAIL.assignedTo}</span></p>
              <p className="text-xs text-gray-400 mt-0.5">Added by: -</p>

              {/* Tabs inline display all */}
              <div className="mt-5 space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3">Details</h4>
                  <div className="space-y-2">{Object.entries(CONTAINER_DETAIL.details).map(([k,v])=>(<div key={k} className="flex border-b border-gray-100 py-1.5"><span className="text-xs text-gray-500 w-40">{k}</span><span className="text-xs text-gray-800 font-medium">{v === '2026-04-06T00:00' ? <span className="border-l-2 border-primary-600 pl-1.5 text-primary-600">{v}</span> : v || '-'}</span></div>))}</div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3">Availability</h4>
                  <div className="grid grid-cols-2 gap-x-6">{Object.entries(CONTAINER_DETAIL.availability).map(([k,v])=>(<div key={k} className="flex border-b border-gray-100 py-1.5"><span className="text-xs text-gray-500 w-36">{k}</span><span className="text-xs text-gray-800">{v || '-'}</span></div>))}</div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3">Load</h4>
                  <table className="w-full text-xs"><thead><tr className="bg-gray-50"><th className="text-left py-2 px-3">Load #</th><th className="text-left py-2 px-3">Created Time</th></tr></thead><tbody><tr><td className="py-2 px-3 text-primary-600 font-medium">{CONTAINER_DETAIL.load.loadNo}</td><td className="py-2 px-3">{CONTAINER_DETAIL.load.createdTime}</td></tr></tbody></table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
