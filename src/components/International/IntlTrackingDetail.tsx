import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Clock, AlertTriangle, Truck, Package, Anchor, FileText, Download } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const SHIPMENT = {
  customer: 'ADOORN LLC',
  shipmentNo: 'SSHAS2608137',
  hbl: 'SSGNS2607829',
  mbl: '039GX40070',
  container: 'WHSU8555505',
  overallStatus: 'Drayage in Progress',
  currentMilestone: 'Port to Warehouse Delivery Scheduled',
  origin: 'Haiphong, VN',
  destination: 'UNIS Seabrook Warehouse, Deer Park, NY',
  carrier: 'WAN HAI LINES',
  vesselVoyage: 'WAN HAI A10 / E013',
  podEta: 'Jun 13, 2026',
  warehouseEta: 'Jun 19, 2026',
  lastUpdated: 'Jun 15, 2026 08:30',
  progress: 62,
  exception: null as null | { type: string; severity: string; message: string; stage: string; action: string; time: string },
  timeline: [
    { stage: 'Supplier Dispatch', status: 'completed' as const, shipper: 'WIN WIN CORP', location: 'Hai Phong, Vietnam', completedTime: 'Apr 15, 2026', description: 'Supplier dispatch completed. Cargo loaded and ready for shipment.' },
    { stage: 'International Transportation', status: 'completed' as const, mode: 'Ocean FCL', carrier: 'WAN HAI LINES', vesselVoyage: 'WAN HAI A10 / E013', pol: 'Haiphong, VN (VNHPH)', pod: 'Savannah, US (USSAV)', container: 'WHSU8555505', seal: 'WHLW847513', hbl: 'SSGNS2607829', mbl: '039GX40070', atd: 'Apr 22, 2026', podEta: 'Jun 13, 2026', weight: '10,542 KG / 68 M\u00b3', description: 'Container loaded and vessel departed from Haiphong.' },
    { stage: 'Customs Clearance', status: 'completed' as const, customsStatus: 'Released', entryNo: '82G-0101679-0', portOfEntry: 'Savannah, GA', releaseDate: 'Jun 10, 2026', broker: 'JFS', docStatus: 'Completed', requiredAction: 'None', description: 'Customs entry released. All documents cleared.' },
    { stage: 'Drayage', status: 'current' as const, loadNo: 'UNIS_SAV_M012771', container: 'WHSU8555505', pickupTerminal: 'Garden City Terminal', destWarehouse: 'UNIS Seabrook Warehouse', pickupAppt: 'Jun 17, 2026', lfd: 'Jun 11, 2026', deliveryEta: 'Jun 19, 2026', pickedUpTime: '-', deliveredTime: '-', description: 'Container scheduled for pickup and delivery to warehouse.' },
    { stage: 'Warehouse Receiving', status: 'pending' as const, receiptNo: 'RN-38199', warehouse: 'UNIS Seabrook', receivingStatus: 'Pending', expectedQty: '782 EA', receivedQty: '-', differenceQty: '-', damagedQty: '-', receivedTime: '-', putawayStatus: 'Pending', description: 'Awaiting container arrival for unloading and receiving.' },
  ],
  containers: [
    { containerNo: 'WHSU8555505', size: '40HC', seal: 'WHLW847513', loadNo: 'UNIS_SAV_M012771', drayageStatus: 'Scheduled', pickupTerminal: 'Garden City Terminal', destWarehouse: 'UNIS Seabrook', lfd: 'Jun 11, 2026', deliveryEta: 'Jun 19, 2026', deliveredTime: '-' },
  ],
  items: [
    { sku: 'ADPOST-SMALL-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Small - Snow White', expectedQty: 72, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-SMALL-RED', name: 'Post Mount Locking Mailbox', variant: 'Small - Red', expectedQty: 72, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-SMALL-SILVER', name: 'Post Mount Locking Mailbox', variant: 'Small - Silver', expectedQty: 72, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-LARGE-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Large - White', expectedQty: 96, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-LARGE-RED', name: 'Post Mount Locking Mailbox', variant: 'Large - Red', expectedQty: 96, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADBOX-SMALL', name: 'Package Box', variant: 'Small (Corrugated)', expectedQty: 55, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADBOX-LARGE', name: 'Package Box', variant: 'Large (Corrugated)', expectedQty: 55, receivedQty: '-', difference: '-', damaged: '-', unit: 'EA', status: 'Pending' },
  ],
  documents: [
    { type: 'HBL', docNo: 'SSGNS2607829', status: 'Available', updatedTime: 'Apr 22, 2026' },
    { type: 'MBL', docNo: '039GX40070', status: 'Available', updatedTime: 'Apr 22, 2026' },
    { type: 'Commercial Invoice', docNo: 'CI-20260601', status: 'Available', updatedTime: 'Jun 01, 2026' },
    { type: 'Packing List', docNo: 'PL-20260601', status: 'Available', updatedTime: 'Jun 01, 2026' },
    { type: 'Customs Entry', docNo: '82G-0101679-0', status: 'Available', updatedTime: 'Jun 10, 2026' },
    { type: 'Warehouse Receipt', docNo: 'RN-38199', status: 'Pending', updatedTime: '-' },
  ],
  activityLog: [
    { time: 'Apr 15, 2026', stage: 'Supplier Dispatch', milestone: 'Dispatch Completed', status: 'Completed', location: 'Hai Phong, VN', description: 'Supplier dispatch completed.' },
    { time: 'Apr 22, 2026', stage: 'Transportation', milestone: 'Vessel Departed', status: 'Completed', location: 'Haiphong, VN', description: 'Container loaded and vessel departed.' },
    { time: 'Jun 10, 2026', stage: 'Customs', milestone: 'Customs Released', status: 'Completed', location: 'Savannah, GA', description: 'Customs entry released, all documents cleared.' },
    { time: 'Jun 13, 2026', stage: 'Transportation', milestone: 'Vessel Arrived', status: 'Completed', location: 'Savannah, US', description: 'Vessel arrived at destination port.' },
    { time: 'Jun 15, 2026', stage: 'Drayage', milestone: 'Delivery Scheduled', status: 'Current', location: 'Garden City Terminal', description: 'Container scheduled for pickup and delivery to warehouse.' },
  ],
}

const DETAIL_TABS = ['Containers & Drayage', 'Items / SKUs', 'Customs', 'Documents', 'Activity Log']

function stageIcon(status: string) {
  if (status === 'completed') return <CheckCircle2 size={16} className="text-white" />
  if (status === 'current') return <Truck size={16} className="text-white" />
  return <Circle size={14} className="text-gray-400" />
}
function stageBg(status: string) {
  if (status === 'completed') return 'bg-green-500'
  if (status === 'current') return 'bg-blue-500 ring-4 ring-blue-100'
  return 'bg-gray-200'
}
function stageLabel(status: string) {
  if (status === 'completed') return 'Completed'
  if (status === 'current') return 'In Progress'
  return 'Pending'
}
function stageLabelColor(status: string) {
  if (status === 'completed') return 'bg-green-100 text-green-700'
  if (status === 'current') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-500'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IntlTrackingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(DETAIL_TABS[0])
  const d = SHIPMENT

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/international/tracking')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"><ArrowLeft size={14} /> Back to End-to-End Tracking</button>

      {/* ═══ 1. Top Shipment Summary ═══ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Customer</p>
            <h1 className="text-xl font-bold text-gray-900">{d.customer}</h1>
          </div>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">{d.overallStatus}</span>
        </div>
        <div className="grid grid-cols-4 gap-x-8 gap-y-3 text-sm">
          <div><span className="text-xs text-gray-400">Shipment No.</span><p className="font-medium text-gray-900">{d.shipmentNo}</p></div>
          <div><span className="text-xs text-gray-400">HBL</span><p className="font-medium text-gray-900">{d.hbl}</p></div>
          <div><span className="text-xs text-gray-400">MBL</span><p className="font-medium text-gray-900">{d.mbl}</p></div>
          <div><span className="text-xs text-gray-400">Container</span><p className="font-medium text-gray-900">{d.container}</p></div>
          <div><span className="text-xs text-gray-400">Current Milestone</span><p className="font-medium text-gray-900">{d.currentMilestone}</p></div>
          <div><span className="text-xs text-gray-400">Origin</span><p className="font-medium text-gray-900">{d.origin}</p></div>
          <div><span className="text-xs text-gray-400">Destination</span><p className="font-medium text-gray-900">{d.destination}</p></div>
          <div><span className="text-xs text-gray-400">Carrier / Vessel</span><p className="font-medium text-gray-900">{d.carrier} &middot; {d.vesselVoyage}</p></div>
          <div><span className="text-xs text-gray-400">POD ETA</span><p className="font-medium text-gray-900">{d.podEta}</p></div>
          <div><span className="text-xs text-gray-400">Warehouse ETA</span><p className="font-medium text-primary-600 font-semibold">{d.warehouseEta}</p></div>
          <div><span className="text-xs text-gray-400">Last Updated</span><p className="font-medium text-gray-500">{d.lastUpdated}</p></div>
        </div>
      </div>

      {/* ═══ 2. Exception Banner (only if exists) ═══ */}
      {d.exception && (
        <div className="border-l-4 border-red-500 bg-red-50 border border-red-200 px-5 py-4 mb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Action Required: {d.exception.type}</p>
              <p className="text-sm text-red-700 mt-0.5">{d.exception.message}</p>
              <p className="text-xs text-red-500 mt-1">Related Stage: {d.exception.stage} | {d.exception.action} | Updated: {d.exception.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 3. Key Status Cards ═══ */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Overall Progress</p>
          <p className="text-2xl font-bold text-primary-600">{d.progress}%</p>
          <div className="h-2 bg-gray-100 rounded-full mt-2 mb-2"><div className="h-full bg-primary-500 rounded-full" style={{width:`${d.progress}%`}} /></div>
          <p className="text-xs text-gray-500">Current: {d.overallStatus}</p>
          <p className="text-xs text-gray-400">Next: Container delivery to warehouse</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Transportation</p>
          <p className="text-xs text-gray-600"><strong>Mode:</strong> Ocean FCL</p>
          <p className="text-xs text-gray-600"><strong>Carrier:</strong> {d.carrier}</p>
          <p className="text-xs text-gray-600"><strong>Vessel:</strong> {d.vesselVoyage}</p>
          <p className="text-xs text-gray-600"><strong>POD ETA:</strong> {d.podEta}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Customs</p>
          <p className="text-xs text-gray-600"><strong>Status:</strong> <span className="text-green-600">Released</span></p>
          <p className="text-xs text-gray-600"><strong>Entry No.:</strong> 82G-0101679-0</p>
          <p className="text-xs text-gray-600"><strong>Release Date:</strong> Jun 10, 2026</p>
          <p className="text-xs text-gray-600"><strong>Documents:</strong> Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Warehouse Receiving</p>
          <p className="text-xs text-gray-600"><strong>Warehouse:</strong> UNIS Seabrook</p>
          <p className="text-xs text-gray-600"><strong>ETA:</strong> <span className="text-primary-600 font-semibold">{d.warehouseEta}</span></p>
          <p className="text-xs text-gray-600"><strong>Status:</strong> Pending</p>
          <p className="text-xs text-gray-600"><strong>Receipt:</strong> RN-38199</p>
        </div>
      </div>

      {/* ═══ 4. Business Milestone Timeline ═══ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-6">Business Milestone Timeline</h3>
        <div className="space-y-0">
          {d.timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${stageBg(step.status)}`}>{stageIcon(step.status)}</div>
                {i < d.timeline.length - 1 && <div className={`w-0.5 flex-1 min-h-[80px] ${step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} />}
              </div>
              <div className="pb-6 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{step.stage}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${stageLabelColor(step.status)}`}>{stageLabel(step.status)}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                {/* Stage-specific fields */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                  {step.stage === 'Supplier Dispatch' && (<>
                    <p><strong>Shipper:</strong> {(step as any).shipper}</p>
                    <p><strong>Location:</strong> {(step as any).location}</p>
                    <p><strong>Completed:</strong> {(step as any).completedTime}</p>
                  </>)}
                  {step.stage === 'International Transportation' && (<>
                    <p><strong>Mode:</strong> {(step as any).mode} | <strong>Carrier:</strong> {(step as any).carrier}</p>
                    <p><strong>Vessel / Voyage:</strong> {(step as any).vesselVoyage}</p>
                    <p><strong>Route:</strong> {(step as any).pol} &rarr; {(step as any).pod}</p>
                    <p><strong>Container:</strong> {(step as any).container} | <strong>Seal:</strong> {(step as any).seal}</p>
                    <p><strong>HBL:</strong> {(step as any).hbl} | <strong>MBL:</strong> {(step as any).mbl}</p>
                    <p><strong>Departed:</strong> {(step as any).atd} | <strong>POD ETA:</strong> {(step as any).podEta}</p>
                    <p><strong>Weight / Volume:</strong> {(step as any).weight}</p>
                  </>)}
                  {step.stage === 'Customs Clearance' && (<>
                    <p><strong>Status:</strong> {(step as any).customsStatus} | <strong>Entry No.:</strong> {(step as any).entryNo}</p>
                    <p><strong>Port:</strong> {(step as any).portOfEntry} | <strong>Release Date:</strong> {(step as any).releaseDate}</p>
                    <p><strong>Broker:</strong> {(step as any).broker} | <strong>Documents:</strong> {(step as any).docStatus}</p>
                  </>)}
                  {step.stage === 'Drayage' && (<>
                    <p><strong>Load No.:</strong> {(step as any).loadNo} | <strong>Container:</strong> {(step as any).container}</p>
                    <p><strong>Pickup:</strong> {(step as any).pickupTerminal} | <strong>Destination:</strong> {(step as any).destWarehouse}</p>
                    <p><strong>Pickup Appt:</strong> {(step as any).pickupAppt} | <strong>LFD:</strong> {(step as any).lfd}</p>
                    <p><strong>Delivery ETA:</strong> {(step as any).deliveryEta}</p>
                  </>)}
                  {step.stage === 'Warehouse Receiving' && (<>
                    <p><strong>Receipt No.:</strong> {(step as any).receiptNo} | <strong>Warehouse:</strong> {(step as any).warehouse}</p>
                    <p><strong>Status:</strong> {(step as any).receivingStatus} | <strong>Expected:</strong> {(step as any).expectedQty}</p>
                    <p><strong>Putaway:</strong> {(step as any).putawayStatus}</p>
                  </>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 5. Detail Tabs ═══ */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {DETAIL_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === 'Containers & Drayage' && (
            <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Container No.','Size','Seal No.','Drayage Load No.','Status','Pickup Terminal','Dest. Warehouse','LFD','Delivery ETA','Delivered'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{d.containers.map((c,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2 px-3 font-mono">{c.containerNo}</td><td className="py-2 px-3">{c.size}</td><td className="py-2 px-3">{c.seal}</td><td className="py-2 px-3 text-primary-600">{c.loadNo}</td><td className="py-2 px-3">{c.drayageStatus}</td><td className="py-2 px-3">{c.pickupTerminal}</td><td className="py-2 px-3">{c.destWarehouse}</td><td className="py-2 px-3">{c.lfd}</td><td className="py-2 px-3">{c.deliveryEta}</td><td className="py-2 px-3">{c.deliveredTime}</td></tr>))}</tbody></table>
          )}
          {activeTab === 'Items / SKUs' && (
            <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['SKU','Product Name','Variant / Spec','Expected Qty','Received Qty','Difference','Damaged','Unit','Status'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{d.items.map((item,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2 px-3 font-mono">{item.sku}</td><td className="py-2 px-3">{item.name}</td><td className="py-2 px-3">{item.variant}</td><td className="py-2 px-3">{item.expectedQty}</td><td className="py-2 px-3">{item.receivedQty}</td><td className="py-2 px-3">{item.difference}</td><td className="py-2 px-3">{item.damaged}</td><td className="py-2 px-3">{item.unit}</td><td className="py-2 px-3">{item.status}</td></tr>))}</tbody></table>
          )}
          {activeTab === 'Customs' && (
            <div className="grid grid-cols-2 gap-4 text-sm">{[['Customs Status','Released'],['Entry No.','82G-0101679-0'],['Port of Entry','Savannah, GA'],['Release Date','Jun 10, 2026'],['Customs Broker','JFS'],['Document Status','Completed'],['Exam Status','No Exam'],['Hold Reason','None'],['Required Action','None']].map(([l,v])=>(<div key={l}><span className="text-xs text-gray-400">{l}</span><p className="font-medium text-gray-900">{v}</p></div>))}</div>
          )}
          {activeTab === 'Documents' && (
            <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Document Type','Document No.','Status','Updated Time','Action'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{d.documents.map((doc,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2 px-3">{doc.type}</td><td className="py-2 px-3">{doc.docNo}</td><td className="py-2 px-3"><span className={doc.status==='Available'?'text-green-600':'text-gray-400'}>{doc.status}</span></td><td className="py-2 px-3">{doc.updatedTime}</td><td className="py-2 px-3">{doc.status==='Available'&&<button className="text-primary-600 hover:underline">View</button>}</td></tr>))}</tbody></table>
          )}
          {activeTab === 'Activity Log' && (
            <table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Event Time','Stage','Milestone','Status','Location','Description'].map(h=>(<th key={h} className="text-left py-2 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{d.activityLog.map((ev,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2 px-3">{ev.time}</td><td className="py-2 px-3">{ev.stage}</td><td className="py-2 px-3">{ev.milestone}</td><td className="py-2 px-3"><span className={ev.status==='Completed'?'text-green-600':ev.status==='Current'?'text-blue-600':'text-gray-400'}>{ev.status}</span></td><td className="py-2 px-3">{ev.location}</td><td className="py-2 px-3">{ev.description}</td></tr>))}</tbody></table>
          )}
        </div>
      </div>
    </div>
  )
}
