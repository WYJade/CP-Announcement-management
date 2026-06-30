import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Truck, Eye } from 'lucide-react'

const D = {
  customer: 'ADOORN LLC', shipmentNo: 'SSHAS2608137', hbl: 'SSGNS2607829', mbl: '039GX40070',
  container: 'WHSU8555505', status: 'Drayage in Progress', milestone: 'Port to Warehouse Delivery Scheduled',
  origin: 'Haiphong, VN', destination: 'UNIS Seabrook Warehouse, Deer Park, NY',
  carrier: 'WAN HAI LINES', vessel: 'WAN HAI A10 / E013', podEta: 'Jun 13, 2026', whEta: 'Jun 19, 2026', lastUpdated: 'Jun 15, 2026 08:30',
  progress: 62, totalContainers: 1, totalSkus: 10, totalWeight: '10,542 KG', volume: '68 M\u00b3',
  containers: [{ containerNo: 'WHSU8555505', size: '40HC', seal: 'WHLW847513', loadNo: 'UNIS_SAV_M012771', drayageStatus: 'Scheduled', pickupTerminal: 'Garden City Terminal', destWarehouse: 'UNIS Seabrook', lfd: 'Jun 11, 2026', deliveryEta: 'Jun 19, 2026', deliveredTime: '-' }],
  items: [
    { sku: 'ADPOST-SMALL-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Small - Snow White', expected: 72, received: '72', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
    { sku: 'ADPOST-SMALL-RED', name: 'Post Mount Locking Mailbox', variant: 'Small - Red', expected: 72, received: '70', diff: '-2', damaged: '1', unit: 'EA', status: 'Received' },
    { sku: 'ADPOST-LARGE-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Large - White', expected: 96, received: '96', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
    { sku: 'ADPOST-LARGE-RED', name: 'Post Mount Locking Mailbox', variant: 'Large - Red', expected: 96, received: '94', diff: '-2', damaged: '2', unit: 'EA', status: 'Received' },
    { sku: 'ADBOX-SMALL', name: 'Package Box', variant: 'Small (Corrugated)', expected: 55, received: '55', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
    { sku: 'ADBOX-LARGE', name: 'Package Box', variant: 'Large (Corrugated)', expected: 55, received: '55', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
  ],
  documents: [
    { type: 'HBL', docNo: 'SSGNS2607829', fileName: 'HBL_SSGNS2607829.pdf', status: 'Available', time: 'Apr 22, 2026' },
    { type: 'MBL', docNo: '039GX40070', fileName: 'MBL_039GX40070.pdf', status: 'Available', time: 'Apr 22, 2026' },
    { type: 'Commercial Invoice', docNo: 'CI-20260601', fileName: 'Invoice_CI-20260601.pdf', status: 'Available', time: 'Jun 01, 2026' },
    { type: 'Packing List', docNo: 'PL-20260601', fileName: 'PackingList_PL-20260601.pdf', status: 'Available', time: 'Jun 01, 2026' },
    { type: 'Customs Entry', docNo: '82G-0101679-0', fileName: 'Entry_82G-0101679-0.pdf', status: 'Available', time: 'Jun 10, 2026' },
    { type: 'Warehouse Receipt', docNo: 'RN-38199', fileName: '', status: 'Pending', time: '-' },
  ],
}

const TABS = ['Containers & Drayage', 'Items SKUs', 'Customs', 'Documents']
const MAIN_TABS = ['Overview', 'Detail']
function stageBg(s: string) { return s === 'done' ? 'bg-green-500' : s === 'active' ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-200' }
function stageIcon(s: string) { return s === 'done' ? <CheckCircle2 size={14} className="text-white" /> : s === 'active' ? <Truck size={14} className="text-white" /> : <Circle size={12} className="text-gray-400" /> }

export default function IntlTrackingDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(MAIN_TABS[0])
  const [detailTab, setDetailTab] = useState(TABS[0])
  const [viewDoc, setViewDoc] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/international/tracking')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"><ArrowLeft size={14} /> Back to End-to-End Tracking</button>

      {/* Main 3 Tabs */}
      <div className="flex gap-6 mb-5 border-b border-gray-200">
        {MAIN_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
        ))}
      </div>

      {/* ═══ Tab 1: Overview (left: summary+stats, right: timeline) ═══ */}
      {activeTab === 'Overview' && (
        <div className="flex gap-5">
          {/* Left: Summary + Stats */}
          <div className="w-[340px] shrink-0 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div><p className="text-[10px] text-gray-400 uppercase">Customer</p><h2 className="text-lg font-bold text-gray-900">{D.customer}</h2></div>
                <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">{D.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                <div><p className="text-[9px] text-gray-400">Shipment No.</p><p className="font-semibold text-gray-900">{D.shipmentNo}</p></div>
                <div><p className="text-[9px] text-gray-400">HBL</p><p className="font-semibold text-gray-900">{D.hbl}</p></div>
                <div><p className="text-[9px] text-gray-400">MBL</p><p className="font-semibold text-gray-900">{D.mbl}</p></div>
                <div><p className="text-[9px] text-gray-400">Container</p><p className="font-semibold text-gray-900">{D.container}</p></div>
                <div><p className="text-[9px] text-gray-400">Origin</p><p className="text-gray-700">{D.origin}</p></div>
                <div><p className="text-[9px] text-gray-400">Destination</p><p className="text-gray-700">{D.destination}</p></div>
                <div><p className="text-[9px] text-gray-400">Carrier / Vessel</p><p className="text-gray-700">{D.vessel}</p></div>
                <div><p className="text-[9px] text-gray-400">Current Milestone</p><p className="text-gray-700">{D.milestone}</p></div>
                <div><p className="text-[9px] text-gray-400">POD ETA</p><p className="text-gray-700">{D.podEta}</p></div>
                <div><p className="text-[9px] text-gray-400">Warehouse ETA</p><p className="font-semibold text-primary-600">{D.whEta}</p></div>
              </div>
            </div>
            {/* Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-[9px] text-gray-400 uppercase">Cargo Value</p><p className="text-lg font-bold text-gray-900">$31,720</p><p className="text-[9px] text-gray-400">Declared USD</p></div>
            <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-[9px] text-gray-400 uppercase">Import Duty</p><p className="text-lg font-bold text-gray-900">$8,991</p><p className="text-[9px] text-gray-400">Incl. Section 301</p></div>
            <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-[9px] text-gray-400 uppercase">Weight / Volume</p><p className="text-lg font-bold text-gray-900">{D.totalWeight}</p><p className="text-[9px] text-gray-400">40HC &middot; {D.volume}</p></div>
          </div>

          {/* Right: Progress bar + Business Milestone Timeline */}
          <div className="flex-1">
            {/* Progress bar at top */}
            <div className="bg-white border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700">Overall Progress</p>
                <p className="text-sm font-bold text-primary-600">{D.progress}%</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width:`${D.progress}%`}} /></div>
              <p className="text-[10px] text-gray-400 mt-1.5">Drayage &middot; ETA {D.whEta} Seabrook</p>
            </div>

            {/* Timeline with sub-statuses mapped to phases */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Business Milestone Timeline</h3>
              {[
                { stage: 'Supplier Dispatch', id: '', status: 'done', date: 'Apr 15, 2026', location: 'Hai Phong, Vietnam', desc: 'Supplier dispatch completed. Cargo loaded and ready for shipment.', sub: 'WIN WIN CORP', phaseColor: 'border-l-gray-400', statuses: ['Booked'] },
                { stage: 'International Transportation', id: 'SSGNS2607829', status: 'done', date: 'Apr 22, 2026', location: 'Haiphong, VN', desc: 'Container loaded and vessel departed.', sub: 'WAN HAI A10 / E013 \u00b7 Haiphong, VN \u2192 Savannah, US \u00b7 POD ETA: Jun 13', phaseColor: 'border-l-blue-400', statuses: ['Booked', 'In Transit', 'Arrived'] },
                { stage: 'Customs Clearance', id: '82G-0101679-0', status: 'done', date: 'Jun 10, 2026', location: 'Savannah, GA', desc: 'Customs entry released. All documents cleared.', sub: 'Broker: JFS', phaseColor: 'border-l-teal-400', statuses: ['Customs Released'] },
                { stage: 'Drayage', id: 'UNIS_SAV_M012771', status: 'active', date: 'Jun 19, 2026 (ETA)', location: 'Garden City Terminal \u2192 UNIS Seabrook', desc: 'Container scheduled for pickup and delivery to warehouse.', sub: '', phaseColor: 'border-l-violet-400', statuses: ['Available', 'Dispatched', 'OFD', 'Delivered', 'Returned'] },
                { stage: 'Warehouse Receiving', id: 'RN-38199', status: 'pending', date: 'TBD (~Jun 21)', location: 'UNIS Seabrook', desc: 'Awaiting container arrival for unloading and receiving.', sub: 'Expected: 782 EA', phaseColor: 'border-l-green-400', statuses: ['Receiving', 'Received'] },
              ].map((step, i, arr) => (
                <div key={i} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${stageBg(step.status)}`}>{stageIcon(step.status)}</div>
                    {i < arr.length - 1 && <div className={`w-0.5 flex-1 ${step.status === 'done' ? 'bg-green-300' : 'bg-gray-200'}`} />}
                  </div>
                  <div className={`flex-1 pb-6 border-l-2 ${step.phaseColor} pl-3`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{step.stage}</span>
                      {step.id && <span className="text-[11px] font-mono text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{step.id}</span>}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${step.status === 'done' ? 'bg-green-100 text-green-700' : step.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{step.status === 'done' ? 'Completed' : step.status === 'active' ? 'In Progress' : 'Pending'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                    {step.sub && <p className="text-[11px] text-gray-400 mt-0.5">{step.sub}</p>}
                    {/* Sub-statuses belonging to this phase */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {step.statuses.map(s => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right pl-3 pt-0.5">
                    <p className="text-xs text-gray-500">{step.date}</p>
                    {step.location && <p className="text-[10px] text-gray-400 mt-0.5">{step.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Tab 3: Detail (with sub-tabs) ═══ */}
      {activeTab === 'Detail' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-200">{TABS.map(tab=>(<button key={tab} onClick={()=>setDetailTab(tab)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab===tab?'border-primary-600 text-primary-600':'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>))}</div>
          <div className="p-5">
            {detailTab==='Containers & Drayage'&&(<table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Container No.','Size','Seal','Drayage Load No.','Status','Pickup Terminal','Dest. Warehouse','LFD','Delivery ETA','Delivered'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.containers.map((c,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-mono">{c.containerNo}</td><td className="py-2.5 px-3">{c.size}</td><td className="py-2.5 px-3">{c.seal}</td><td className="py-2.5 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={()=>navigate(`/international/drayage/${c.loadNo}`)}>{c.loadNo}</td><td className="py-2.5 px-3">{c.drayageStatus}</td><td className="py-2.5 px-3">{c.pickupTerminal}</td><td className="py-2.5 px-3">{c.destWarehouse}</td><td className="py-2.5 px-3">{c.lfd}</td><td className="py-2.5 px-3">{c.deliveryEta}</td><td className="py-2.5 px-3">{c.deliveredTime}</td></tr>))}</tbody></table>)}
            {detailTab==='Items SKUs'&&(<table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['SKU','Product Name','Variant','Expected','Received','Diff','Damaged','Unit','Status'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.items.map((item,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-mono text-primary-600">{item.sku}</td><td className="py-2.5 px-3">{item.name}</td><td className="py-2.5 px-3">{item.variant}</td><td className="py-2.5 px-3 font-medium">{item.expected}</td><td className="py-2.5 px-3 text-green-600 font-medium">{item.received}</td><td className="py-2.5 px-3 text-orange-600">{item.diff}</td><td className="py-2.5 px-3 text-red-600">{item.damaged}</td><td className="py-2.5 px-3">{item.unit}</td><td className="py-2.5 px-3"><span className="text-green-600 font-medium">{item.status}</span></td></tr>))}</tbody></table>)}
            {detailTab==='Customs'&&(<div className="grid grid-cols-3 gap-4 text-sm">{[['Customs Status','Released'],['Entry No.','82G-0101679-0'],['Port of Entry','Savannah, GA'],['Release Date','Jun 10, 2026'],['Customs Broker','JFS'],['Document Status','Completed'],['Exam Status','No Exam'],['Hold Reason','None'],['Required Action','None']].map(([l,v])=>(<div key={l}><p className="text-[10px] text-gray-400">{l}</p><p className="font-medium text-gray-900">{v}</p></div>))}</div>)}
            {detailTab==='Documents'&&(<table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Document Type','Document No.','File Name','Status','Updated','Action'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.documents.map((doc,i)=>(<tr key={i} className="border-b border-gray-100 hover:bg-gray-50"><td className="py-2.5 px-3 font-medium">{doc.type}</td><td className="py-2.5 px-3">{doc.docNo}</td><td className="py-2.5 px-3">{doc.fileName?<button onClick={()=>setViewDoc(doc.fileName)} className="text-primary-600 hover:underline font-medium">{doc.fileName}</button>:<span className="text-gray-400">-</span>}</td><td className="py-2.5 px-3"><span className={doc.status==='Available'?'text-green-600 font-medium':'text-gray-400'}>{doc.status}</span></td><td className="py-2.5 px-3">{doc.time}</td><td className="py-2.5 px-3">{doc.status==='Available'&&<button onClick={()=>setViewDoc(doc.fileName)} className="text-primary-600 hover:underline font-medium flex items-center gap-1"><Eye size={11}/>View</button>}</td></tr>))}</tbody></table>)}
          </div>
        </div>
      )}

      {/* Doc preview modal */}
      {viewDoc&&(<div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-8" onClick={()=>setViewDoc(null)}><div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={e=>e.stopPropagation()}><div className="px-5 py-4 border-b flex items-center justify-between"><h3 className="text-sm font-semibold">{viewDoc}</h3><button onClick={()=>setViewDoc(null)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button></div><div className="p-6"><div className="border rounded-lg bg-gray-50 h-48 flex items-center justify-center text-gray-400 text-sm">Document preview</div></div></div></div>)}
    </div>
  )
}
