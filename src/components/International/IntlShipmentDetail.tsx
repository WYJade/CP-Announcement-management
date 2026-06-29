import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const SHIPMENT_DATA: Record<string, any> = {
  'S2XBS2507958': {
    shipmentNo: 'S2XBS2507958', containerMode: 'Full Container Load', incoterm: 'Free On Board',
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
  },
}

const MILESTONE_STEPS = ['Booked', 'At Origin', 'In Transit', 'At Destination', 'Delivered']
const DETAIL_TABS = ['Details', 'Parties', 'Equipment', 'Items', 'Milestones']

export default function IntlShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Details')
  const data = SHIPMENT_DATA[id || ''] || SHIPMENT_DATA['S2XBS2507958']
  const currentMilestone = data.transitStatus === 'At Destination' ? 3 : data.transitStatus === 'In Transit' ? 2 : 0

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/international/shipments')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to Shipments</button>
      <h1 className="text-xl font-bold text-gray-900 mb-4">{data.shipmentNoAlt || data.shipmentNo}</h1>
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200 pb-3">
        {DETAIL_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-1.5 text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <span className={`w-2.5 h-2.5 rounded-full border-2 ${activeTab === tab ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`} />{tab}
          </button>
        ))}
      </div>
      {activeTab === 'Details' && (
        <div className="flex gap-6">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8">
              {[['Container Mode', data.containerMode, 'Incoterm', data.incoterm],['Mode', data.mode, 'Sender Organization', data.senderOrg],['HBL', data.hbl, 'Shipment No', data.shipmentNoAlt],['Vessel Name', data.vesselName, 'Voyage Flight No', data.voyageFlightNo],['Master Shipment No', data.masterShipmentNo, 'Transit Status', data.transitStatus],['Planned Departure Date', data.plannedDeparture, 'Planned Arrival Date', data.plannedArrival]].map(([l1,v1,l2,v2], i) => (<div key={i} className="contents"><div><p className="text-xs text-gray-400">{l1}</p><p className="text-sm font-medium text-gray-900">{v1}</p></div><div><p className="text-xs text-gray-400">{l2}</p><p className="text-sm font-medium text-gray-900">{v2}</p></div></div>))}
            </div>
          </div>
          <div className="w-48 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Milestone Progress</h3>
            <div className="space-y-4">{MILESTONE_STEPS.map((step, i) => (<div key={step} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${i <= currentMilestone ? 'bg-gray-800' : 'border-2 border-gray-300'}`} /><span className={`text-xs ${i <= currentMilestone ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{step}</span></div>))}</div>
          </div>
        </div>
      )}
      {activeTab === 'Parties' && (<div className="bg-white border border-gray-200 rounded-lg overflow-hidden"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Party Type','Name','Address 1','City','State','Country'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{data.parties.map((p:any,i:number)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2 px-3 font-medium">{p.type}</td><td className="py-2 px-3">{p.name}</td><td className="py-2 px-3">{p.address1}</td><td className="py-2 px-3">{p.city}</td><td className="py-2 px-3">{p.state}</td><td className="py-2 px-3">{p.country}</td></tr>))}</tbody></table></div>)}
      {activeTab === 'Equipment' && (<div className="bg-white border border-gray-200 rounded-lg overflow-hidden"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['No','Container No','Seal No','Description','Item Count','Total Value','Cartons','Goods Wt(KG)','Tare Wt(KG)'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{data.equipment.map((e:any)=>(<tr key={e.no} className="border-b border-gray-100"><td className="py-2 px-3">{e.no}</td><td className="py-2 px-3 text-primary-600">{e.containerNo}</td><td className="py-2 px-3">{e.sealNo}</td><td className="py-2 px-3">{e.description}</td><td className="py-2 px-3">{e.itemCount}</td><td className="py-2 px-3">{e.totalValue}</td><td className="py-2 px-3">{e.totalCartons}</td><td className="py-2 px-3">{e.goodsWeight}</td><td className="py-2 px-3">{e.tareWeight}</td></tr>))}</tbody></table></div>)}
      {activeTab === 'Items' && (<div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm">No data available to display</div>)}
      {activeTab === 'Milestones' && (<div className="bg-white border border-gray-200 rounded-lg overflow-hidden"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Description','Event Code','Planned Date','Actual Date'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{data.milestones.map((m:any,i:number)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2 px-3">{m.description}</td><td className="py-2 px-3">{m.eventCode}</td><td className="py-2 px-3">{m.plannedDate}</td><td className="py-2 px-3">{m.actualDate}</td></tr>))}</tbody></table></div>)}
    </div>
  )
}
