import { useState } from 'react'
import { Search, Paperclip, Download, Eye, X, CheckSquare, Square, FileText, FileImage, File } from 'lucide-react'

const STATUS_TABS = ['All', 'Problem', 'Plan', 'In Progress', 'Staged', 'Loading', 'Shipped', 'Billed', 'Paid', 'Partially Paid', 'Paid Due']

// ─── Attachment types ─────────────────────────────────────────────────────────
interface Attachment {
  id: string
  name: string
  type: 'pdf' | 'xlsx' | 'jpg' | 'png' | 'doc'
  size: string
  uploadedAt: string
  uploadedBy: string
}

// ─── Order data ───────────────────────────────────────────────────────────────
interface OutboundOrder {
  id: string
  facility: string
  customer: string
  orderNo: string
  status: string
  rush: boolean
  orderType: string
  loadNo: string
  poNo: string
  orderNote: string
  shippingAccountNo: string
  source: string
  shipNotBefore: string
  bolNote: string
  // New fields
  orderCreatedBy: string
  orderDynamicProperty: string
  shipoutDate: string
  createdDate: string
  createTime: string
  updateTime: string
  shipToCity: string
  shipToState: string
  shipToZipCode: string
  shipToCountry: string
  inYardTime: string
  loadTime: string
  shipMethod: string
  rowEquipmentNo: string
  attachments: Attachment[]
}

const SAMPLE_ATTACHMENTS: Record<string, Attachment[]> = {
  'OB-20260701': [
    { id: 'a1', name: 'BOL_OB-20260701.pdf', type: 'pdf', size: '245 KB', uploadedAt: '2026-07-01 09:15', uploadedBy: 'System' },
    { id: 'a2', name: 'PackingList_OB-20260701.pdf', type: 'pdf', size: '132 KB', uploadedAt: '2026-07-01 09:16', uploadedBy: 'System' },
    { id: 'a3', name: 'ShipLabel_OB-20260701.pdf', type: 'pdf', size: '88 KB', uploadedAt: '2026-07-01 10:30', uploadedBy: 'carrier@ups.com' },
    { id: 'a4', name: 'POD_OB-20260701.jpg', type: 'jpg', size: '1.2 MB', uploadedAt: '2026-07-05 14:22', uploadedBy: 'driver@ups.com' },
  ],
  'OB-20260702': [
    { id: 'b1', name: 'BOL_OB-20260702.pdf', type: 'pdf', size: '198 KB', uploadedAt: '2026-07-02 11:00', uploadedBy: 'System' },
    { id: 'b2', name: 'CommercialInvoice_OB-20260702.pdf', type: 'pdf', size: '310 KB', uploadedAt: '2026-07-02 11:05', uploadedBy: 'System' },
    { id: 'b3', name: 'ItemPhoto_OB-20260702.png', type: 'png', size: '2.1 MB', uploadedAt: '2026-07-02 12:30', uploadedBy: 'warehouse@item.com' },
  ],
  'OB-20260703': [
    { id: 'c1', name: 'BOL_OB-20260703.pdf', type: 'pdf', size: '220 KB', uploadedAt: '2026-07-03 08:45', uploadedBy: 'System' },
    { id: 'c2', name: 'PackingList_OB-20260703.xlsx', type: 'xlsx', size: '78 KB', uploadedAt: '2026-07-03 08:46', uploadedBy: 'System' },
  ],
  'OB-20260704': [
    { id: 'd1', name: 'BOL_OB-20260704.pdf', type: 'pdf', size: '185 KB', uploadedAt: '2026-07-04 09:00', uploadedBy: 'System' },
    { id: 'd2', name: 'POD_OB-20260704.jpg', type: 'jpg', size: '980 KB', uploadedAt: '2026-07-08 16:10', uploadedBy: 'driver@fedex.com' },
    { id: 'd3', name: 'ClaimForm_OB-20260704.pdf', type: 'pdf', size: '156 KB', uploadedAt: '2026-07-10 10:00', uploadedBy: 'claims@item.com' },
    { id: 'd4', name: 'DamagePhoto_OB-20260704.jpg', type: 'jpg', size: '1.8 MB', uploadedAt: '2026-07-10 10:05', uploadedBy: 'claims@item.com' },
  ],
}

const ORDERS: OutboundOrder[] = [
  {
    id: '1', facility: 'Long Beach DC', customer: 'loyal', orderNo: 'OB-20260701', status: 'Shipped',
    rush: false, orderType: 'LTL', loadNo: 'LOAD-8801', poNo: 'PO-55123', orderNote: '', shippingAccountNo: 'UPS-88001',
    source: 'EDI', shipNotBefore: '07/30/25', bolNote: '',
    orderCreatedBy: 'loyal', orderDynamicProperty: '{ "priority": "standard" }',
    shipoutDate: '07/30/25', createdDate: '07/30/25', createTime: '2025-07-20 09:02:33',
    updateTime: '2025-07-20 09:02:33', shipToCity: 'Riverside', shipToState: 'CA',
    shipToZipCode: '92500', shipToCountry: 'US', inYardTime: '–', loadTime: '–',
    shipMethod: 'LTL', rowEquipmentNo: '–', attachments: SAMPLE_ATTACHMENTS['OB-20260701'],
  },
  {
    id: '2', facility: 'Savannah DC', customer: 'ADOORN LLC', orderNo: 'OB-20260702', status: 'In Progress',
    rush: true, orderType: 'LTL', loadNo: 'LOAD-8802', poNo: 'PO-55124', orderNote: 'Fragile', shippingAccountNo: 'FEDEX-44002',
    source: 'Manual', shipNotBefore: '08/04/25', bolNote: '',
    orderCreatedBy: 'ELI Mr', orderDynamicProperty: '{ "fragile": true }',
    shipoutDate: '–', createdDate: '03/04/25', createTime: '2025-03-24 12:33:19',
    updateTime: '2025-03-24 12:33:19', shipToCity: 'Los Angeles', shipToState: 'CA',
    shipToZipCode: '90008-2517', shipToCountry: 'US', inYardTime: '2025-04-10 17:24:23', loadTime: '–',
    shipMethod: 'LTL', rowEquipmentNo: '165152101', attachments: SAMPLE_ATTACHMENTS['OB-20260702'],
  },
  {
    id: '3', facility: 'Long Beach DC', customer: 'VITA COCO', orderNo: 'OB-20260703', status: 'Staged',
    rush: false, orderType: 'TL', loadNo: 'LOAD-8803', poNo: 'PO-55125', orderNote: '', shippingAccountNo: 'UPS-88003',
    source: 'EDI', shipNotBefore: '08/01/25', bolNote: '',
    orderCreatedBy: 'FTI Mr', orderDynamicProperty: '{ "temperatureControlled": false }',
    shipoutDate: '–', createdDate: '03/24/25', createTime: '2025-03-24 12:31:20',
    updateTime: '2025-03-24 12:31:19', shipToCity: 'Los Angeles', shipToState: 'CA',
    shipToZipCode: '90008-7501', shipToCountry: 'US', inYardTime: '–', loadTime: '–',
    shipMethod: 'LTL', rowEquipmentNo: '–', attachments: SAMPLE_ATTACHMENTS['OB-20260703'],
  },
  {
    id: '4', facility: 'Savannah DC', customer: 'THE ONLY BEAN LLC', orderNo: 'OB-20260704', status: 'Shipped',
    rush: false, orderType: 'LTL', loadNo: 'LOAD-8804', poNo: 'PO-55126', orderNote: '', shippingAccountNo: 'UPS-88004',
    source: 'API', shipNotBefore: '03/14/25', bolNote: 'Retail ready',
    orderCreatedBy: 'wise', orderDynamicProperty: '{ "retailReady": true }',
    shipoutDate: '–', createdDate: '03/14/25', createTime: '2025-03-11 07:13:08',
    updateTime: '2025-05-23 15:14:07', shipToCity: 'Temecula', shipToState: 'CA',
    shipToZipCode: '92592', shipToCountry: 'US', inYardTime: '–', loadTime: '–',
    shipMethod: 'LTL', rowEquipmentNo: '–', attachments: SAMPLE_ATTACHMENTS['OB-20260704'],
  },
]

// ─── Attachment Icon helper ────────────────────────────────────────────────────
function AttachIcon({ type }: { type: string }) {
  if (type === 'pdf') return <FileText size={13} className="text-red-400 shrink-0" />
  if (type === 'jpg' || type === 'png') return <FileImage size={13} className="text-blue-400 shrink-0" />
  if (type === 'xlsx') return <File size={13} className="text-green-500 shrink-0" />
  return <File size={13} className="text-gray-400 shrink-0" />
}

// ─── Attachment Modal ─────────────────────────────────────────────────────────
function AttachmentModal({ order, onClose }: { order: OutboundOrder; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewing, setPreviewing] = useState<Attachment | null>(null)

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const toggleAll = () => {
    if (selected.size === order.attachments.length) setSelected(new Set())
    else setSelected(new Set(order.attachments.map(a => a.id)))
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Attachments</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Order: <span className="font-medium text-gray-700">{order.orderNo}</span> · {order.attachments.length} files</p>
          </div>
          <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        {/* File list */}
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
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
                  <Download size={12} /> Download {selected.size} file{selected.size > 1 ? 's' : ''}
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {order.attachments.map(att => (
                <div key={att.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <button onClick={() => toggle(att.id)} className="shrink-0">
                    {selected.has(att.id)
                      ? <CheckSquare size={15} className="text-primary-600" />
                      : <Square size={15} className="text-gray-300" />}
                  </button>
                  <AttachIcon type={att.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{att.name}</p>
                    <p className="text-[10px] text-gray-400">{att.size} · Uploaded {att.uploadedAt} by {att.uploadedBy}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setPreviewing(att)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Preview">
                      <Eye size={13} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Download">
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Preview panel */
          <div className="p-5">
            <button onClick={() => setPreviewing(null)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline mb-4">
              ← Back to list
            </button>
            <div className="flex items-center gap-3 mb-4">
              <AttachIcon type={previewing.type} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{previewing.name}</p>
                <p className="text-[10px] text-gray-400">{previewing.size} · {previewing.uploadedAt}</p>
              </div>
            </div>
            {(previewing.type === 'jpg' || previewing.type === 'png') ? (
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                <FileImage size={32} className="text-gray-300" />
                <span className="ml-2 text-xs">Image preview</span>
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400">
                <FileText size={32} className="text-gray-300" />
                <p className="text-xs text-gray-500">Preview not available in browser</p>
              </div>
            )}
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
              <Download size={13} /> Download {previewing.name}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    'Shipped': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-violet-100 text-violet-700',
    'Staged': 'bg-amber-100 text-amber-700',
    'Paid': 'bg-green-100 text-green-700',
    'Billed': 'bg-teal-100 text-teal-700',
    'Problem': 'bg-red-100 text-red-700',
    'Plan': 'bg-gray-100 text-gray-700',
    'Loading': 'bg-orange-100 text-orange-700',
    'Partially Paid': 'bg-cyan-100 text-cyan-700',
    'Paid Due': 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OutboundInquiry() {
  const [activeTab, setActiveTab] = useState('All')
  const [attachOrder, setAttachOrder] = useState<OutboundOrder | null>(null)

  const filtered = activeTab === 'All' ? ORDERS : ORDERS.filter(o => o.status === activeTab)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Outbound Inquiry</h1>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-4 gap-3">
          {[['Created Date Range','date'],['Appointment Date Range','date'],['MAFI Date Range','date'],['Shipped Date Range','date']].map(([l]) => (
            <div key={l as string}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{l}</label>
              <input type="text" placeholder="Select date range" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search By</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Item Keyword</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All Customers</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facility</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All Facilities</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" placeholder="Enter title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Load Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Int'l Shipment</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Order Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ship Method</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Billing Grade</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Retailer</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-0.5 mb-5 border-b border-gray-200 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
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
                {[
                  'Facility','Customer','Order #','Status','Rush','Order Type','Load #','PO #',
                  'Order Created By','Order Dynamic Property','Shipout Date','Created Date',
                  'Create Time','Update Time','Ship To City','Ship To State','Ship To Zip Code',
                  'Ship To Country','In Yard Time','Load Time','Ship Method','Row/Equipment No',
                  'Order Note','Shipping Account No','Source','Ship Not Before','BOL Note',
                  'Attachment','Action',
                ].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase whitespace-nowrap tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={29} className="text-center py-12 text-gray-400">No data available</td></tr>
              ) : filtered.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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
                      <Paperclip size={11} />
                      {row.attachments.length}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <button className="text-[10px] text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attachment Modal */}
      {attachOrder && <AttachmentModal order={attachOrder} onClose={() => setAttachOrder(null)} />}
    </div>
  )
}
