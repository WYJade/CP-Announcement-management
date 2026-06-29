import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Clock, Package, Truck, Anchor, MapPin, FileText } from 'lucide-react'

const JOURNEY_DATA: Record<string, any> = {
  'WHSU8555505': {
    container: 'WHSU8555505', hbl: 'SSGNS2607829', mbl: '039GX40070',
    customer: 'ADOORN LLC', route: 'Haiphong, VN (VNHPH) \u2192 Savannah, US (USSAV)',
    cargoValue: '$31,720', duty: '$8,991', weight: '10,542 KG', volume: '40HC \u00b7 68 M\u00b3', progress: 62,
    vessel: 'WAN HAI A10 / E013', carrier: 'WAN HAI LINES (WHLC)',
    pol: 'Haiphong, VN (VNHPH)', pod: 'Savannah, US (USSAV)',
    departureDate: '2026-04-22', arrivalDate: '2026-06-13',
    entryNo: '82G-0101679-0', broker: 'JFS', declaredValue: '$31,720.15', totalDuty: '$8,991.00',
    loadNo: 'UNIS_SAV_M012771', pickupTerminal: 'Garden City Terminal (L737)', destWarehouse: 'UNIS SEABROOK', drayageEta: '2026-06-19', lfd: '2026-06-11',
    receiptNo: 'RN-38199', facility: 'Seabrook', receiptStatus: 'Imported',
    timeline: [
      { stage: 'Supplier Dispatch', system: 'Cube Ship GTM', status: 'completed', days: 7, date: '2026-04-15', description: 'WIN WIN CORP (Hai Phong, Vietnam) production complete, container loaded, export compliance approved' },
      { stage: 'Ocean Freight', system: 'Cube Ship GTM', status: 'completed', days: 52, date: '2026-04-22', description: 'WAN HAI A10 E013 departed Haiphong (VNHPH), Container WHSU8555505, Seal WHLW847513, MBL 039GX40070' },
      { stage: 'Customs Clearance', system: 'Cube Ship GTM', status: 'completed', days: 5, date: '2026-06-10', description: 'CBP released, Broker: JFS, Entry 82G-0101679-0, FIRMS: GARDEN CITY TERMINAL, Savannah, GA' },
      { stage: 'Drayage', system: 'UNIS TMS', status: 'in-progress', days: 0, date: '2026-06-19', description: 'Load UNIS_SAV_M012771, GCT Terminal \u2192 UNIS Seabrook Warehouse, LFD: Jun 11, estimated 2 days transit' },
      { stage: 'Warehouse Receipt', system: 'WMS', status: 'pending', days: 0, date: 'TBD (~Jun 21)', description: 'Receipt RN-38199 pre-created, Facility: Seabrook, awaiting actual arrival' },
    ],
    keyInfo: {
      transport: { hbl: 'SSGNS2607829', status: 'In Transit', vessel: 'WAN HAI A10 / E013', carrier: 'WAN HAI LINES (WHLC)', pol: 'Haiphong, VN', pod: 'Savannah, US', departure: '2026-04-22', arrival: '2026-06-13', weight: '10,542 KG \u00b7 68 M\u00b3' },
      customs: { entryNo: '82G-0101679-0', status: 'Released', releaseDate: '2026-06-10', port: '1703 (Savannah, GA)', broker: 'JFS', declaredValue: '$31,720.15', totalDuty: '$8,991.00' },
      drayage: { loadNo: 'UNIS_SAV_M012771', status: 'PENDING', pickup: 'Garden City Terminal (L737)', destination: 'UNIS SEABROOK', eta: '2026-06-19', lfd: '2026-06-11', containerType: "40' HC" },
      warehouse: { receiptNo: 'RN-38199', status: 'Imported', facility: 'Seabrook', customer: 'ADOORN LLC', trackingNo: 'SSGNS2607829', date: '2026-06-02' },
    },
  },
}

const DEFAULT = JOURNEY_DATA['WHSU8555505']

export default function IntlTrackingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const data = JOURNEY_DATA[id || ''] || DEFAULT

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/international/tracking')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to Tracking</button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{data.container}</h1>
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">In Transit</span>
          </div>
          <p className="text-sm text-gray-500">{data.route}</p>
          <p className="text-xs text-gray-400 mt-1">Customer: {data.customer} | HBL: {data.hbl} | MBL: {data.mbl}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400">Cargo Value</p><p className="text-lg font-bold text-gray-900">{data.cargoValue}</p><p className="text-[10px] text-gray-400">Declared USD</p></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400">Import Duty</p><p className="text-lg font-bold text-gray-900">{data.duty}</p><p className="text-[10px] text-gray-400">Incl. Section 301</p></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400">Weight / Volume</p><p className="text-lg font-bold text-gray-900">{data.weight}</p><p className="text-[10px] text-gray-400">{data.volume}</p></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-xs text-gray-400">Journey Progress</p><p className="text-lg font-bold text-primary-600">{data.progress}%</p><div className="h-2 bg-gray-100 rounded-full mt-1"><div className="h-full bg-primary-500 rounded-full" style={{width:`${data.progress}%`}} /></div></div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-5">End-to-End Journey Timeline</h3>
        <div className="space-y-0">
          {data.timeline.map((step: any, i: number) => (
            <div key={i} className="flex gap-4">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  step.status === 'completed' ? 'bg-green-500' : step.status === 'in-progress' ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-200'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 size={14} className="text-white" /> :
                   step.status === 'in-progress' ? <Truck size={14} className="text-white" /> :
                   <Circle size={14} className="text-gray-400" />}
                </div>
                {i < data.timeline.length - 1 && <div className={`w-0.5 flex-1 min-h-[60px] ${step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} />}
              </div>
              {/* Content */}
              <div className="pb-6 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{step.stage}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    step.status === 'completed' ? 'bg-green-100 text-green-700' :
                    step.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{step.system} {step.status === 'completed' ? '\u2713' : step.status === 'in-progress' ? 'In Progress' : 'Pending'}</span>
                  {step.days > 0 && <span className="text-[10px] text-gray-400">{step.days} days</span>}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                <p className="text-[10px] text-gray-400 mt-1">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Info Cards */}
      <h3 className="text-sm font-bold text-gray-900 mb-3">Key Information by Stage</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Transport */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3"><Anchor size={14} className="text-blue-500" /><span className="text-xs font-bold text-gray-700">Ocean Transport</span><span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 rounded">In Transit</span></div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">HBL</span><p className="font-medium">{data.keyInfo.transport.hbl}</p></div>
            <div><span className="text-gray-400">Vessel</span><p className="font-medium">{data.keyInfo.transport.vessel}</p></div>
            <div><span className="text-gray-400">POL \u2192 POD</span><p className="font-medium">{data.keyInfo.transport.pol} \u2192 {data.keyInfo.transport.pod}</p></div>
            <div><span className="text-gray-400">Departure</span><p className="font-medium">{data.keyInfo.transport.departure}</p></div>
          </div>
        </div>
        {/* Customs */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3"><FileText size={14} className="text-green-500" /><span className="text-xs font-bold text-gray-700">Customs Clearance</span><span className="text-[10px] bg-green-100 text-green-600 px-1.5 rounded">Released</span></div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">Entry No</span><p className="font-medium">{data.keyInfo.customs.entryNo}</p></div>
            <div><span className="text-gray-400">Broker</span><p className="font-medium">{data.keyInfo.customs.broker}</p></div>
            <div><span className="text-gray-400">Declared Value</span><p className="font-medium">{data.keyInfo.customs.declaredValue}</p></div>
            <div><span className="text-gray-400">Total Duty</span><p className="font-medium">{data.keyInfo.customs.totalDuty}</p></div>
          </div>
        </div>
        {/* Drayage */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3"><Truck size={14} className="text-amber-500" /><span className="text-xs font-bold text-gray-700">Drayage</span><span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 rounded">PENDING</span></div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">Load #</span><p className="font-medium">{data.keyInfo.drayage.loadNo}</p></div>
            <div><span className="text-gray-400">Pickup</span><p className="font-medium">{data.keyInfo.drayage.pickup}</p></div>
            <div><span className="text-gray-400">Destination</span><p className="font-medium">{data.keyInfo.drayage.destination}</p></div>
            <div><span className="text-gray-400">ETA</span><p className="font-medium">{data.keyInfo.drayage.eta}</p></div>
          </div>
        </div>
        {/* Warehouse */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3"><Package size={14} className="text-purple-500" /><span className="text-xs font-bold text-gray-700">Warehouse Receipt</span><span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 rounded">Imported</span></div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">Receipt #</span><p className="font-medium">{data.keyInfo.warehouse.receiptNo}</p></div>
            <div><span className="text-gray-400">Facility</span><p className="font-medium">{data.keyInfo.warehouse.facility}</p></div>
            <div><span className="text-gray-400">Customer</span><p className="font-medium">{data.keyInfo.warehouse.customer}</p></div>
            <div><span className="text-gray-400">Tracking No</span><p className="font-medium">{data.keyInfo.warehouse.trackingNo}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
