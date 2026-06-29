import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Truck, Download, Eye } from 'lucide-react'

const D = {
  customer: 'ADOORN LLC', shipmentNo: 'SSHAS2608137', hbl: 'SSGNS2607829', mbl: '039GX40070',
  container: 'WHSU8555505', status: 'Drayage in Progress', milestone: 'Port to Warehouse Delivery Scheduled',
  origin: 'Haiphong, VN', destination: 'UNIS Seabrook Warehouse, Deer Park, NY',
  carrier: 'WAN HAI LINES', vessel: 'WAN HAI A10 / E013', podEta: 'Jun 13, 2026', whEta: 'Jun 19, 2026', lastUpdated: 'Jun 15, 2026 08:30',
  progress: 62, totalContainers: 1, totalSkus: 10, totalWeight: '10,542 KG', volume: '68 M\u00b3',
  containers: [{ containerNo: 'WHSU8555505', size: '40HC', seal: 'WHLW847513', loadNo: 'UNIS_SAV_M012771', drayageStatus: 'Scheduled', pickupTerminal: 'Garden City Terminal', destWarehouse: 'UNIS Seabrook', lfd: 'Jun 11, 2026', deliveryEta: 'Jun 19, 2026', deliveredTime: '-' }],
  items: [
    { sku: 'ADPOST-SMALL-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Small - Snow White', expected: 72, received: '-', diff: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-SMALL-RED', name: 'Post Mount Locking Mailbox', variant: 'Small - Red', expected: 72, received: '-', diff: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-LARGE-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Large - White', expected: 96, received: '-', diff: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADPOST-LARGE-RED', name: 'Post Mount Locking Mailbox', variant: 'Large - Red', expected: 96, received: '-', diff: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADBOX-SMALL', name: 'Package Box', variant: 'Small (Corrugated)', expected: 55, received: '-', diff: '-', damaged: '-', unit: 'EA', status: 'Pending' },
    { sku: 'ADBOX-LARGE', name: 'Package Box', variant: 'Large (Corrugated)', expected: 55, received: '-', diff: '-', damaged: '-', unit: 'EA', status: 'Pending' },
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

const TABS = ['Containers & Drayage', 'Items / SKUs', 'Customs', 'Documents']
function stageBg(s: string) { return s === 'done' ? 'bg-green-500' : s === 'active' ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-200' }
function stageIcon(s: string) { return s === 'done' ? <CheckCircle2 size={14} className="text-white" /> : s === 'active' ? <Truck size={14} className="text-white" /> : <Circle size={12} className="text-gray-400" /> }

export default function IntlTrackingDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [viewDoc, setViewDoc] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/international/tracking')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"><ArrowLeft size={14} /> Back to End-to-End Tracking</button>

      {/* ─── Summary ─── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Customer</p><h1 className="text-xl font-bold text-gray-900">{D.customer}</h1></div>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">{D.status}</span>
        </div>
        <div className="grid grid-cols-5 gap-x-6 gap-y-3 text-sm">
          <div><p className="text-[10px] text-gray-400">Shipment No.</p><p className="font-semibold">{D.shipmentNo}</p></div>
          <div><p className="text-[10px] text-gray-400">HBL</p><p className="font-semibold">{D.hbl}</p></div>
          <div><p className="text-[10px] text-gray-400">MBL</p><p className="font-semibold">{D.mbl}</p></div>
          <div><p className="text-[10px] text-gray-400">Container</p><p className="font-semibold">{D.container}</p></div>
          <div><p className="text-[10px] text-gray-400">Carrier / Vessel</p><p className="font-semibold">{D.vessel}</p></div>
          <div><p className="text-[10px] text-gray-400">Current Milestone</p><p className="text-gray-700">{D.milestone}</p></div>
          <div><p className="text-[10px] text-gray-400">Origin</p><p className="text-gray-700">{D.origin}</p></div>
          <div><p className="text-[10px] text-gray-400">Destination</p><p className="text-gray-700">{D.destination}</p></div>
          <div><p className="text-[10px] text-gray-400">POD ETA</p><p className="text-gray-700">{D.podEta}</p></div>
          <div><p className="text-[10px] text-gray-400">Warehouse ETA</p><p className="font-semibold text-primary-600">{D.whEta}</p></div>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase">Cargo Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$31,720</p>
          <p className="text-xs text-gray-400 mt-1">Declared &middot; USD</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase">Import Duty</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$8,991</p>
          <p className="text-xs text-gray-400 mt-1">Incl. Section 301</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase">Weight / Volume</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{D.totalWeight}</p>
          <p className="text-xs text-gray-400 mt-1">40HC &middot; {D.volume}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase">Progress</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{D.progress}%</p>
          <div className="h-1.5 bg-gray-100 rounded-full mt-2"><div className="h-full bg-green-500 rounded-full" style={{width:`${D.progress}%`}} /></div>
          <p className="text-[10px] text-gray-400 mt-2">Drayage in Progress &middot; ETA {D.whEta} Seabrook</p>
        </div>
      </div>

      {/* ─── Business Milestone Timeline (clean, no redundant details) ─── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-5">Business Milestone Timeline</h3>
        {[
          { stage: 'Supplier Dispatch', status: 'done', date: 'Apr 15, 2026', desc: 'Supplier dispatch completed. Cargo loaded and ready for shipment.', sub: 'WIN WIN CORP \u00b7 Hai Phong, Vietnam' },
          { stage: 'International Transportation', status: 'done', date: 'Apr 22, 2026', desc: 'Container loaded and vessel departed.', sub: 'WAN HAI A10 / E013 \u00b7 Haiphong, VN \u2192 Savannah, US \u00b7 POD ETA: Jun 13' },
          { stage: 'Customs Clearance', status: 'done', date: 'Jun 10, 2026', desc: 'Customs entry released. All documents cleared.', sub: 'Entry: 82G-0101679-0 \u00b7 Savannah, GA \u00b7 Broker: JFS' },
          { stage: 'Drayage', status: 'active', date: 'Jun 19, 2026 (ETA)', desc: 'Container scheduled for pickup and delivery to warehouse.', sub: 'Load: UNIS_SAV_M012771 \u00b7 Garden City Terminal \u2192 UNIS Seabrook' },
          { stage: 'Warehouse Receiving', status: 'pending', date: 'TBD (~Jun 21)', desc: 'Awaiting container arrival for unloading and receiving.', sub: 'Receipt: RN-38199 \u00b7 UNIS Seabrook \u00b7 Expected: 782 EA' },
        ].map((step, i, arr) => (
          <div key={i} className="flex">
            {/* Left: icon + line */}
            <div className="flex flex-col items-center mr-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${stageBg(step.status)}`}>{stageIcon(step.status)}</div>
              {i < arr.length - 1 && <div className={`w-0.5 flex-1 ${step.status === 'done' ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
            {/* Middle: content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{step.stage}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${step.status === 'done' ? 'bg-green-100 text-green-700' : step.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{step.status === 'done' ? 'Completed' : step.status === 'active' ? 'In Progress' : 'Pending'}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              <p className="text-[11px] text-gray-400 mt-1">{step.sub}</p>
            </div>
            {/* Right: date */}
            <div className="shrink-0 text-right pt-0.5">
              <p className="text-xs text-gray-400">{step.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Tabs ─── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">{TABS.map(tab=>(<button key={tab} onClick={()=>setActiveTab(tab)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab===tab?'border-primary-600 text-primary-600':'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>))}</div>
        <div className="p-5">
          {activeTab==='Containers & Drayage'&&(<table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Container No.','Size','Seal','Drayage Load No.','Status','Pickup Terminal','Dest. Warehouse','LFD','Delivery ETA','Delivered'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.containers.map((c,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-mono">{c.containerNo}</td><td className="py-2.5 px-3">{c.size}</td><td className="py-2.5 px-3">{c.seal}</td><td className="py-2.5 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={()=>navigate(`/international/drayage/${c.loadNo}`)}>{c.loadNo}</td><td className="py-2.5 px-3">{c.drayageStatus}</td><td className="py-2.5 px-3">{c.pickupTerminal}</td><td className="py-2.5 px-3">{c.destWarehouse}</td><td className="py-2.5 px-3">{c.lfd}</td><td className="py-2.5 px-3">{c.deliveryEta}</td><td className="py-2.5 px-3">{c.deliveredTime}</td></tr>))}</tbody></table>)}
          {activeTab==='Items / SKUs'&&(<table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['SKU','Product Name','Variant','Expected','Received','Diff','Damaged','Unit','Status'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.items.map((item,i)=>(<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-mono">{item.sku}</td><td className="py-2.5 px-3">{item.name}</td><td className="py-2.5 px-3">{item.variant}</td><td className="py-2.5 px-3">{item.expected}</td><td className="py-2.5 px-3">{item.received}</td><td className="py-2.5 px-3">{item.diff}</td><td className="py-2.5 px-3">{item.damaged}</td><td className="py-2.5 px-3">{item.unit}</td><td className="py-2.5 px-3">{item.status}</td></tr>))}</tbody></table>)}
          {activeTab==='Customs'&&(<div className="grid grid-cols-3 gap-4 text-sm">{[['Customs Status','Released'],['Entry No.','82G-0101679-0'],['Port of Entry','Savannah, GA'],['Release Date','Jun 10, 2026'],['Customs Broker','JFS'],['Document Status','Completed'],['Exam Status','No Exam'],['Hold Reason','None'],['Required Action','None']].map(([l,v])=>(<div key={l}><p className="text-[10px] text-gray-400">{l}</p><p className="font-medium text-gray-900">{v}</p></div>))}</div>)}
          {activeTab==='Documents'&&(<><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{['Document Type','Document No.','File Name','Status','Updated','Action'].map(h=>(<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead><tbody>{D.documents.map((doc,i)=>(<tr key={i} className="border-b border-gray-100 hover:bg-gray-50"><td className="py-2.5 px-3 font-medium">{doc.type}</td><td className="py-2.5 px-3">{doc.docNo}</td><td className="py-2.5 px-3 text-gray-600">{doc.fileName||'-'}</td><td className="py-2.5 px-3"><span className={doc.status==='Available'?'text-green-600 font-medium':'text-gray-400'}>{doc.status}</span></td><td className="py-2.5 px-3">{doc.time}</td><td className="py-2.5 px-3">{doc.status==='Available'&&(<div className="flex gap-2"><button onClick={()=>setViewDoc(doc.fileName)} className="flex items-center gap-1 text-primary-600 hover:underline"><Eye size={11}/>View</button><button className="flex items-center gap-1 text-gray-500 hover:text-gray-700"><Download size={11}/>Download</button></div>)}</td></tr>))}</tbody></table>{viewDoc&&(<div className="mt-4 border rounded-lg p-6 bg-gray-50 text-center"><p className="text-sm text-gray-600 mb-2">Preview: <strong>{viewDoc}</strong></p><div className="h-40 bg-white border rounded flex items-center justify-center text-gray-400 text-sm">Document preview</div><button onClick={()=>setViewDoc(null)} className="mt-3 text-xs text-gray-500 hover:text-gray-700">Close</button></div>)}</>)}
        </div>
      </div>
    </div>
  )
}
