import { useState, useRef, useEffect } from 'react'
import {
  Search, Paperclip, Download, Eye, X,
  CheckSquare, Square, FileText, FileImage, File,
  Edit2, XCircle, Tag, Printer, ChevronDown,
} from 'lucide-react'

const STATUS_TABS = ['All', 'Problem', 'Plan', 'In Progress', 'Staged', 'Loading', 'Shipped', 'Billed', 'Paid', 'Partially Paid', 'Paid Due']

// ─── Types ────────────────────────────────────────────────────────────────────
interface Attachment {
  id: string; name: string; type: 'pdf' | 'xlsx' | 'jpg' | 'png' | 'doc'
  size: string; uploadedAt: string; uploadedBy: string
}

interface OutboundOrder {
  id: string; facility: string; customer: string; orderNo: string; status: string
  rush: boolean; orderType: string; loadNo: string; poNo: string; orderNote: string
  shippingAccountNo: string; source: string; shipNotBefore: string; bolNote: string
  orderCreatedBy: string; orderDynamicProperty: string; shipoutDate: string
  createdDate: string; createTime: string; updateTime: string
  shipToCity: string; shipToState: string; shipToZipCode: string; shipToCountry: string
  inYardTime: string; loadTime: string; shipMethod: string; rowEquipmentNo: string
  attachments: Attachment[]
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const SAMPLE_ATTACHMENTS: Record<string, Attachment[]> = {
  'OB-20260701': [
    { id:'a1', name:'BOL_OB-20260701.pdf',        type:'pdf',  size:'245 KB', uploadedAt:'2026-07-01 09:15', uploadedBy:'System' },
    { id:'a2', name:'PackingList_OB-20260701.pdf', type:'pdf',  size:'132 KB', uploadedAt:'2026-07-01 09:16', uploadedBy:'System' },
    { id:'a3', name:'ShipLabel_OB-20260701.pdf',   type:'pdf',  size:'88 KB',  uploadedAt:'2026-07-01 10:30', uploadedBy:'carrier@ups.com' },
    { id:'a4', name:'POD_OB-20260701.jpg',         type:'jpg',  size:'1.2 MB', uploadedAt:'2026-07-05 14:22', uploadedBy:'driver@ups.com' },
  ],
  'OB-20260702': [
    { id:'b1', name:'BOL_OB-20260702.pdf',              type:'pdf',  size:'198 KB', uploadedAt:'2026-07-02 11:00', uploadedBy:'System' },
    { id:'b2', name:'CommercialInvoice_OB-20260702.pdf', type:'pdf',  size:'310 KB', uploadedAt:'2026-07-02 11:05', uploadedBy:'System' },
    { id:'b3', name:'ItemPhoto_OB-20260702.png',         type:'png',  size:'2.1 MB', uploadedAt:'2026-07-02 12:30', uploadedBy:'warehouse@item.com' },
  ],
  'OB-20260703': [
    { id:'c1', name:'BOL_OB-20260703.pdf',       type:'pdf',  size:'220 KB', uploadedAt:'2026-07-03 08:45', uploadedBy:'System' },
    { id:'c2', name:'PackingList_OB-20260703.xlsx', type:'xlsx', size:'78 KB',  uploadedAt:'2026-07-03 08:46', uploadedBy:'System' },
  ],
  'OB-20260704': [
    { id:'d1', name:'BOL_OB-20260704.pdf',          type:'pdf', size:'185 KB', uploadedAt:'2026-07-04 09:00', uploadedBy:'System' },
    { id:'d2', name:'POD_OB-20260704.jpg',           type:'jpg', size:'980 KB', uploadedAt:'2026-07-08 16:10', uploadedBy:'driver@fedex.com' },
    { id:'d3', name:'ClaimForm_OB-20260704.pdf',     type:'pdf', size:'156 KB', uploadedAt:'2026-07-10 10:00', uploadedBy:'claims@item.com' },
    { id:'d4', name:'DamagePhoto_OB-20260704.jpg',   type:'jpg', size:'1.8 MB', uploadedAt:'2026-07-10 10:05', uploadedBy:'claims@item.com' },
  ],
}

const ORDERS: OutboundOrder[] = [
  { id:'1', facility:'Long Beach DC', customer:'loyal', orderNo:'OB-20260701', status:'Shipped',
    rush:false, orderType:'LTL', loadNo:'LOAD-8801', poNo:'PO-55123', orderNote:'', shippingAccountNo:'UPS-88001',
    source:'EDI', shipNotBefore:'07/30/25', bolNote:'',
    orderCreatedBy:'loyal', orderDynamicProperty:'{ "priority": "standard" }',
    shipoutDate:'07/30/25', createdDate:'07/30/25', createTime:'2025-07-20 09:02:33',
    updateTime:'2025-07-20 09:02:33', shipToCity:'Riverside', shipToState:'CA',
    shipToZipCode:'92500', shipToCountry:'US', inYardTime:'–', loadTime:'–',
    shipMethod:'LTL', rowEquipmentNo:'–', attachments:SAMPLE_ATTACHMENTS['OB-20260701'] },
  { id:'2', facility:'Savannah DC', customer:'ADOORN LLC', orderNo:'OB-20260702', status:'In Progress',
    rush:true, orderType:'LTL', loadNo:'LOAD-8802', poNo:'PO-55124', orderNote:'Fragile', shippingAccountNo:'FEDEX-44002',
    source:'Manual', shipNotBefore:'08/04/25', bolNote:'',
    orderCreatedBy:'ELI Mr', orderDynamicProperty:'{ "fragile": true }',
    shipoutDate:'–', createdDate:'03/04/25', createTime:'2025-03-24 12:33:19',
    updateTime:'2025-03-24 12:33:19', shipToCity:'Los Angeles', shipToState:'CA',
    shipToZipCode:'90008-2517', shipToCountry:'US', inYardTime:'2025-04-10 17:24:23', loadTime:'–',
    shipMethod:'LTL', rowEquipmentNo:'165152101', attachments:SAMPLE_ATTACHMENTS['OB-20260702'] },
  { id:'3', facility:'Long Beach DC', customer:'VITA COCO', orderNo:'OB-20260703', status:'Staged',
    rush:false, orderType:'TL', loadNo:'LOAD-8803', poNo:'PO-55125', orderNote:'', shippingAccountNo:'UPS-88003',
    source:'EDI', shipNotBefore:'08/01/25', bolNote:'',
    orderCreatedBy:'FTI Mr', orderDynamicProperty:'{ "temperatureControlled": false }',
    shipoutDate:'–', createdDate:'03/24/25', createTime:'2025-03-24 12:31:20',
    updateTime:'2025-03-24 12:31:19', shipToCity:'Los Angeles', shipToState:'CA',
    shipToZipCode:'90008-7501', shipToCountry:'US', inYardTime:'–', loadTime:'–',
    shipMethod:'LTL', rowEquipmentNo:'–', attachments:SAMPLE_ATTACHMENTS['OB-20260703'] },
  { id:'4', facility:'Savannah DC', customer:'THE ONLY BEAN LLC', orderNo:'OB-20260704', status:'Shipped',
    rush:false, orderType:'LTL', loadNo:'LOAD-8804', poNo:'PO-55126', orderNote:'', shippingAccountNo:'UPS-88004',
    source:'API', shipNotBefore:'03/14/25', bolNote:'Retail ready',
    orderCreatedBy:'wise', orderDynamicProperty:'{ "retailReady": true }',
    shipoutDate:'–', createdDate:'03/14/25', createTime:'2025-03-11 07:13:08',
    updateTime:'2025-05-23 15:14:07', shipToCity:'Temecula', shipToState:'CA',
    shipToZipCode:'92592', shipToCountry:'US', inYardTime:'–', loadTime:'–',
    shipMethod:'LTL', rowEquipmentNo:'–', attachments:SAMPLE_ATTACHMENTS['OB-20260704'] },
]

// ─── Attachment icon ──────────────────────────────────────────────────────────
function AttachIcon({ type }: { type: string }) {
  if (type === 'pdf')  return <FileText  size={13} className="text-red-400 shrink-0" />
  if (type === 'jpg' || type === 'png') return <FileImage size={13} className="text-blue-400 shrink-0" />
  if (type === 'xlsx') return <File      size={13} className="text-green-500 shrink-0" />
  return <File size={13} className="text-gray-400 shrink-0" />
}

// ─── Attachment Modal ─────────────────────────────────────────────────────────
function AttachmentModal({ order, onClose }: { order: OutboundOrder; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewing, setPreviewing] = useState<Attachment | null>(null)

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })
  const toggleAll = () =>
    setSelected(selected.size === order.attachments.length ? new Set() : new Set(order.attachments.map(a => a.id)))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Attachments</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Order: <span className="font-medium text-gray-700">{order.orderNo}</span> · {order.attachments.length} files</p>
          </div>
          <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        {!previewing ? (
          <>
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
                {selected.size === order.attachments.length
                  ? <CheckSquare size={14} className="text-primary-600" />
                  : <Square size={14} />}
                {selected.size === order.attachments.length ? 'Deselect all' : 'Select all'}
              </button>
              {selected.size > 0 && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
                  <Download size={12} /> Download {selected.size} file{selected.size > 1 ? 's' : ''}
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {order.attachments.map(att => (
                <div key={att.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <button onClick={() => toggle(att.id)} className="shrink-0">
                    {selected.has(att.id) ? <CheckSquare size={15} className="text-primary-600" /> : <Square size={15} className="text-gray-300" />}
                  </button>
                  <AttachIcon type={att.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{att.name}</p>
                    <p className="text-[10px] text-gray-400">{att.size} · {att.uploadedAt} · {att.uploadedBy}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setPreviewing(att)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye size={13} /></button>
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Download size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-5">
            <button onClick={() => setPreviewing(null)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline mb-4">← Back to list</button>
            <div className="flex items-center gap-3 mb-4">
              <AttachIcon type={previewing.type} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{previewing.name}</p>
                <p className="text-[10px] text-gray-400">{previewing.size} · {previewing.uploadedAt}</p>
              </div>
            </div>
            <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400">
              <FileText size={32} className="text-gray-300" />
              <p className="text-xs text-gray-500">Preview not available in browser</p>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
              <Download size={13} /> Download {previewing.name}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Print UCC/SSCC Labels Modal ──────────────────────────────────────────────
function PrintLabelsModal({ order, onClose }: { order: OutboundOrder; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'case' | 'pallet'>('case')

  // Mock label data
  const caseLabels = [
    { id:'C001', ucc:'00 1 234567 000001 0', sscc:'', sku:'SKU-10032', qty:'24 EA', desc:'ORGANIC ENERGY BAR 12PK' },
    { id:'C002', ucc:'00 1 234567 000002 7', sscc:'', sku:'SKU-10033', qty:'24 EA', desc:'COCONUT WATER 330ML' },
    { id:'C003', ucc:'00 1 234567 000003 4', sscc:'', sku:'SKU-10034', qty:'12 EA', desc:'PROTEIN SHAKE VANILLA' },
  ]
  const palletLabels = [
    { id:'P001', ucc:'', sscc:'00 1 234567 100001 3', palletNo:'PLT-001', cases:'48', totalQty:'1152 EA', loadNo: order.loadNo },
    { id:'P002', ucc:'', sscc:'00 1 234567 100002 0', palletNo:'PLT-002', cases:'36', totalQty:'864 EA',  loadNo: order.loadNo },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
              <Printer size={17} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Print UCC / SSCC Labels</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Order <span className="font-semibold text-gray-700">{order.orderNo}</span> · {order.customer}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 px-6">
          <button
            onClick={() => setActiveTab('case')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'case' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tag size={14} />
            Case UCC Labels
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === 'case' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
              {caseLabels.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pallet')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'pallet' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tag size={14} />
            Pallet SSCC Labels
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === 'pallet' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
              {palletLabels.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === 'case' ? (
            <div className="space-y-3">
              {caseLabels.map((lbl, idx) => (
                <div key={lbl.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors">
                  {/* Label preview */}
                  <div className="bg-white px-5 py-4 flex items-start gap-4">
                    {/* Barcode area */}
                    <div className="w-32 h-20 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center shrink-0 gap-1">
                      {/* Simulated barcode stripes */}
                      <div className="flex gap-px items-end h-10">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="bg-gray-800 rounded-sm" style={{ width: i % 3 === 0 ? 3 : 2, height: `${60 + (i % 4) * 10}%` }} />
                        ))}
                      </div>
                      <p className="text-[8px] text-gray-500 font-mono tracking-widest">UCC-128</p>
                    </div>

                    {/* Label info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Case UCC Label #{idx + 1}</span>
                        <span className="text-[10px] text-gray-400">{lbl.id}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mb-1 font-mono tracking-wider">{lbl.ucc}</p>
                      <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[10px]">
                        <div><span className="text-gray-400">SKU</span><p className="font-semibold text-gray-700">{lbl.sku}</p></div>
                        <div><span className="text-gray-400">QTY</span><p className="font-semibold text-gray-700">{lbl.qty}</p></div>
                        <div><span className="text-gray-400">Order</span><p className="font-semibold text-gray-700">{order.orderNo}</p></div>
                        <div className="col-span-3"><span className="text-gray-400">Description</span><p className="font-semibold text-gray-700">{lbl.desc}</p></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 px-5 py-2.5 flex items-center justify-between border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">PDF · ~85 KB</span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                        <Eye size={11} /> Preview
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                        <Download size={11} /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {palletLabels.map((lbl, idx) => (
                <div key={lbl.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors">
                  <div className="bg-white px-5 py-4 flex items-start gap-4">
                    {/* Barcode area */}
                    <div className="w-32 h-20 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center shrink-0 gap-1">
                      <div className="flex gap-px items-end h-10">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="bg-gray-900 rounded-sm" style={{ width: i % 2 === 0 ? 3 : 2, height: `${55 + (i % 5) * 9}%` }} />
                        ))}
                      </div>
                      <p className="text-[8px] text-gray-500 font-mono tracking-widest">SSCC-18</p>
                    </div>

                    {/* Label info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pallet SSCC Label #{idx + 1}</span>
                        <span className="text-[10px] text-gray-400">{lbl.id}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mb-1 font-mono tracking-wider">{lbl.sscc}</p>
                      <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[10px]">
                        <div><span className="text-gray-400">Pallet No</span><p className="font-semibold text-gray-700">{lbl.palletNo}</p></div>
                        <div><span className="text-gray-400">Cases</span><p className="font-semibold text-gray-700">{lbl.cases}</p></div>
                        <div><span className="text-gray-400">Total Qty</span><p className="font-semibold text-gray-700">{lbl.totalQty}</p></div>
                        <div><span className="text-gray-400">Load#</span><p className="font-semibold text-gray-700">{lbl.loadNo}</p></div>
                        <div><span className="text-gray-400">Order</span><p className="font-semibold text-gray-700">{order.orderNo}</p></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-5 py-2.5 flex items-center justify-between border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">PDF · ~90 KB</span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                        <Eye size={11} /> Preview
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                        <Download size={11} /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-400">
            {activeTab === 'case' ? `${caseLabels.length} Case UCC labels` : `${palletLabels.length} Pallet SSCC labels`} ready
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              <Download size={14} />
              Download All {activeTab === 'case' ? 'Case UCC' : 'Pallet SSCC'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Action Dropdown ──────────────────────────────────────────────────────────
function ActionDropdown({
  order,
  onAttachment,
  onPrintLabels,
}: {
  order: OutboundOrder
  onAttachment: () => void
  onPrintLabels: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const items = [
    { icon: <Edit2 size={13} className="text-gray-500" />,    label: 'Edit',                   action: () => setOpen(false) },
    { icon: <Paperclip size={13} className="text-gray-500" />, label: 'Add Attachment',          action: () => { setOpen(false); onAttachment() } },
    { icon: <Tag size={13} className="text-primary-500" />,    label: 'Print UCC/SSCC Labels',   action: () => { setOpen(false); onPrintLabels() }, highlight: true },
    { icon: <XCircle size={13} className="text-red-400" />,    label: 'Cancel',                  action: () => setOpen(false), danger: true },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
      >
        Actions <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[172px] py-1 overflow-hidden">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Actions</p>
          {items.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left ${
                item.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : item.highlight
                  ? 'text-primary-600 hover:bg-primary-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    'Shipped':        'bg-blue-500 text-white',
    'In Progress':    'bg-orange-400 text-white',
    'Staged':         'bg-yellow-400 text-white',
    'Committed':      'bg-violet-500 text-white',
    'Commit Blocked': 'bg-gray-100 text-gray-600 border border-gray-300',
    'Paid':           'bg-green-500 text-white',
    'Billed':         'bg-teal-500 text-white',
    'Problem':        'bg-red-500 text-white',
    'Plan':           'bg-gray-400 text-white',
    'Loading':        'bg-orange-500 text-white',
    'Partially Paid': 'bg-cyan-400 text-white',
    'Paid Due':       'bg-rose-500 text-white',
  }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${cls[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OutboundInquiry() {
  const [activeTab,    setActiveTab]    = useState('All')
  const [attachOrder,  setAttachOrder]  = useState<OutboundOrder | null>(null)
  const [printOrder,   setPrintOrder]   = useState<OutboundOrder | null>(null)

  const filtered = activeTab === 'All' ? ORDERS : ORDERS.filter(o => o.status === activeTab)

  const TABLE_COLS = [
    'Facility','Customer','Order #','Status','Rush','Order Type','Load #','PO #',
    'Order Created By','Order Dynamic Property','Shipout Date','Created Date',
    'Create Time','Update Time','Ship To City','Ship To State','Ship To Zip Code',
    'Ship To Country','In Yard Time','Load Time','Ship Method','Row/Equipment No',
    'Order Note','Shipping Account No','Source','Ship Not Before','BOL Note',
    'Attachment','Action',
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Outbound Inquiry</h1>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-4 gap-3">
          {['Created Date Range','Appointment Date Range','MAFI Date Range','Shipped Date Range'].map(l => (
            <div key={l}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{l}</label>
              <input type="text" placeholder="Select date range" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search By</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
              <option>Order/PRO/Ref/Load/SN/Tracking No/SO#/Trailer number/BOL/MBOL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Item Keyword</label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Item ID / UPC Code / AKA" className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Customer <span className="text-red-400">*</span></label>
            <input type="text" placeholder="ADOORN LLC-ADOLLO0001" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facility</label>
            <div className="flex items-center gap-1">
              <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>Valley View</option></select>
              <button className="text-xs text-red-400 hover:text-red-600 whitespace-nowrap">Clear All</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" placeholder="Input to search" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Load Status</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Int'l Shipment</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Type</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ship Method</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Billing Grade</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Retailer</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"><option>All</option></select>
          </div>
        </div>
        {/* Search actions */}
        <div className="flex justify-end mt-3 gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={13} /> Download PDF
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Export <ChevronDown size={13} />
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Search size={13} /> Search
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-0.5 mb-4 border-b border-gray-200 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors -mb-px ${
              activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-8 px-3 py-2.5"><input type="checkbox" className="rounded border-gray-300" /></th>
                {TABLE_COLS.map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase whitespace-nowrap tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={30} className="text-center py-12 text-gray-400">No data available</td></tr>
              ) : filtered.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-3 py-2.5"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-700">{row.facility}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-gray-800">{row.customer}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-primary-600 font-medium cursor-pointer hover:underline">{row.orderNo}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-center">
                    {row.rush && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded">RUSH</span>}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.orderType}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-primary-600 cursor-pointer hover:underline">{row.loadNo}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.poNo}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.orderCreatedBy}</td>
                  <td className="py-2.5 px-3 max-w-[120px] truncate text-gray-500">{row.orderDynamicProperty}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.shipoutDate}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.createdDate}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.createTime}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.updateTime}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.shipToCity}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.shipToState}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.shipToZipCode}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.shipToCountry}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.inYardTime}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.loadTime}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.shipMethod}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.rowEquipmentNo}</td>
                  <td className="py-2.5 px-3 max-w-[80px] truncate text-gray-500">{row.orderNote || '–'}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.shippingAccountNo}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.source}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.shipNotBefore}</td>
                  <td className="py-2.5 px-3 max-w-[80px] truncate text-gray-500">{row.bolNote || '–'}</td>
                  {/* Attachment */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <button onClick={() => setAttachOrder(row)}
                      className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-md px-2 py-1 hover:bg-primary-50 transition-colors">
                      <Paperclip size={11} /> {row.attachments.length}
                    </button>
                  </td>
                  {/* Action dropdown */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <ActionDropdown
                      order={row}
                      onAttachment={() => setAttachOrder(row)}
                      onPrintLabels={() => setPrintOrder(row)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {attachOrder && <AttachmentModal order={attachOrder} onClose={() => setAttachOrder(null)} />}
      {printOrder  && <PrintLabelsModal order={printOrder}  onClose={() => setPrintOrder(null)} />}
    </div>
  )
}
