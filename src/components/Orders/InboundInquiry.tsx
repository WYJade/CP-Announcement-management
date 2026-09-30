import { useState } from 'react'
import {
  Search, Download, ChevronRight, ChevronDown, X, Bot,
  Sparkles, AlertTriangle, TrendingDown, CheckCircle2,
  Clock, Package, Truck, MoreHorizontal, FileText,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface InboundRecord {
  id: string
  facility: string
  customer: string
  receiptNo: string
  status: 'Open' | 'Scheduled' | 'Daily Received' | 'MTD Received' | 'Closed'
  rush: boolean
  title: string
  poNo: string
  destinationCode: string
  refNo: string
  carrier: string
  containerNo: string
  scacCode: string
  inYardTime: string
  receivedTime: string
  receivedDate: string
  equipmentType: string
  source: string
  createDate: string
  items: ItemDetail[]
}

interface ItemDetail {
  itemId: string
  shortDesc: string
  description: string
  supplier: string
  expectedQty: number
  receivedQty: number
  uom: string
  grade: string
}

const STATUS_TABS = ['All', 'Open', 'Scheduled', 'Daily Received', 'MTD Received']

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DATA: InboundRecord[] = [
  {
    id: '1', facility: 'Valley View', customer: 'TCL NORTH AMERICA', receiptNo: 'RN-252768',
    status: 'Closed', rush: false, title: 'TCL NORTH AMERICA', poNo: 'REF999', destinationCode: '', refNo: 'REF999',
    carrier: 'USPS', containerNo: 'CON999', scacCode: 'USPS', inYardTime: '2026-09-03 09:20:32',
    receivedTime: '2026-09-03 09:25:31', receivedDate: '09/03/26', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [{ itemId: 'TCL-TV9', shortDesc: '-', description: 'TV', supplier: '-', expectedQty: 1, receivedQty: 1, uom: '-', grade: '-' }],
  },
  {
    id: '2', facility: 'Valley View', customer: 'TCL NORTH AMERICA', receiptNo: 'RN-252764',
    status: 'Closed', rush: false, title: 'TCL NORTH AMERICA', poNo: 'REF333', destinationCode: '', refNo: 'TRAN',
    carrier: 'UNIS TRANSPORTATION', containerNo: 'CON333', scacCode: 'UTPA', inYardTime: '2026-09-03 08:49:37',
    receivedTime: '2026-09-03 08:56:06', receivedDate: '09/03/26', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [
      { itemId: 'TCL-TV32', shortDesc: '32" TV', description: '32-inch Smart TV', supplier: 'TCL MFG', expectedQty: 20, receivedQty: 18, uom: 'EA', grade: 'A' },
      { itemId: 'TCL-TV43', shortDesc: '43" TV', description: '43-inch Smart TV', supplier: 'TCL MFG', expectedQty: 15, receivedQty: 15, uom: 'EA', grade: 'A' },
    ],
  },
  {
    id: '3', facility: 'Valley View', customer: 'TCL NORTH AMERICA', receiptNo: 'RN-252762',
    status: 'Open', rush: false, title: 'TCL NORTH AMERICA', poNo: 'UMA1111', destinationCode: '', refNo: 'UMA1111',
    carrier: '', containerNo: 'UMA1111', scacCode: '', inYardTime: '2026-09-03 08:32:14',
    receivedTime: '', receivedDate: '', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [{ itemId: 'TCL-ACCS', shortDesc: 'Accessory', description: 'TV Remote & Stand', supplier: 'TCL MFG', expectedQty: 50, receivedQty: 0, uom: 'EA', grade: '-' }],
  },
  {
    id: '4', facility: 'Ontario, CA', customer: 'ADOORN LLC', receiptNo: 'RN-252761',
    status: 'Scheduled', rush: true, title: 'ADOORN LLC - Spring Drop', poNo: 'BOMX2222', destinationCode: 'DEST-02', refNo: 'BOMX2222',
    carrier: 'USPS', containerNo: 'BOMX2222', scacCode: 'USPS', inYardTime: '2026-09-03 08:20:16',
    receivedTime: '', receivedDate: '', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [{ itemId: 'ADO-001', shortDesc: 'Home Decor', description: 'Wall Art Set', supplier: 'ADOORN MFG', expectedQty: 100, receivedQty: 0, uom: 'EA', grade: '-' }],
  },
  {
    id: '5', facility: 'Ontario, CA', customer: 'ADOORN LLC', receiptNo: 'RN-252760',
    status: 'Open', rush: false, title: 'ADOORN LLC', poNo: 'REF111', destinationCode: '', refNo: 'REF111',
    carrier: 'FEDX', containerNo: 'CON1111', scacCode: 'FEDX', inYardTime: '2026-09-03 08:21:44',
    receivedTime: '', receivedDate: '', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [{ itemId: 'ADO-002', shortDesc: 'Lamp', description: 'Floor Lamp Matte Black', supplier: 'ADOORN MFG', expectedQty: 30, receivedQty: 0, uom: 'EA', grade: '-' }],
  },
  {
    id: '6', facility: 'Fontana, CA', customer: 'THE ONLY BEAN LLC', receiptNo: 'RN-252759',
    status: 'Daily Received', rush: false, title: 'THE ONLY BEAN', poNo: 'DIR1555', destinationCode: 'DEST-05', refNo: 'DIR1555',
    carrier: 'USPS', containerNo: 'CON1555', scacCode: 'USPS', inYardTime: '2026-09-03 08:07:53',
    receivedTime: '2026-09-03 08:14:38', receivedDate: '09/03/26', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [
      { itemId: 'TOB-CF01', shortDesc: 'Coffee Pods', description: 'Single-Serve Coffee Pods 100ct', supplier: 'BEAN CORP', expectedQty: 500, receivedQty: 500, uom: 'BOX', grade: 'A' },
      { itemId: 'TOB-CF02', shortDesc: 'Coffee Bags', description: 'Ground Coffee 12oz', supplier: 'BEAN CORP', expectedQty: 200, receivedQty: 195, uom: 'BAG', grade: 'A' },
    ],
  },
  {
    id: '7', facility: 'Fontana, CA', customer: 'THE ONLY BEAN LLC', receiptNo: 'RN-252757',
    status: 'MTD Received', rush: false, title: 'THE ONLY BEAN', poNo: 'PTPT33', destinationCode: 'DEST-05', refNo: 'PTPT33',
    carrier: 'USPS', containerNo: 'PTPT33', scacCode: 'USPS', inYardTime: '2026-09-03 07:56:20',
    receivedTime: '2026-09-03 08:02:23', receivedDate: '09/03/26', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [{ itemId: 'TOB-CF03', shortDesc: 'Espresso', description: 'Espresso Pods Dark Roast', supplier: 'BEAN CORP', expectedQty: 300, receivedQty: 300, uom: 'BOX', grade: 'A' }],
  },
  {
    id: '8', facility: 'Garden City, NY', customer: 'VITA COCO', receiptNo: 'RN-252756',
    status: 'Open', rush: true, title: 'VITA COCO – Q3 Stock', poNo: 'TERF2020', destinationCode: 'DEST-08', refNo: 'TERF2020',
    carrier: 'USPS', containerNo: 'JBL8989', scacCode: 'USPS', inYardTime: '2026-09-03 07:43:14',
    receivedTime: '', receivedDate: '', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-03',
    items: [{ itemId: 'VC-COCO1', shortDesc: 'Coconut Water', description: 'Pure Coconut Water 1L x12', supplier: 'VITA MFG', expectedQty: 400, receivedQty: 0, uom: 'CASE', grade: '-' }],
  },
  {
    id: '9', facility: 'Savannah, GA', customer: 'ORGAIN LLC', receiptNo: 'RN-252750',
    status: 'Scheduled', rush: false, title: 'ORGAIN – Protein', poNo: 'W066340', destinationCode: 'DEST-11', refNo: 'W066340',
    carrier: 'Unis Transportation SA', containerNo: 'W066340', scacCode: 'UNIS', inYardTime: '2026-09-02 22:50:46',
    receivedTime: '', receivedDate: '', equipmentType: 'Tractor Only',
    source: 'MANUAL', createDate: '2026-09-02',
    items: [
      { itemId: 'ORG-PR01', shortDesc: 'Protein Powder', description: 'Organic Protein Chocolate 2lb', supplier: 'ORGAIN MFG', expectedQty: 250, receivedQty: 0, uom: 'EA', grade: '-' },
      { itemId: 'ORG-PR02', shortDesc: 'Protein Bar', description: 'Organic Protein Bar Variety 12ct', supplier: 'ORGAIN MFG', expectedQty: 120, receivedQty: 0, uom: 'BOX', grade: '-' },
    ],
  },
]

// ─── AI Insights based on data ────────────────────────────────────────────────
const AI_INSIGHTS = [
  {
    icon: <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />,
    text: '2 Rush receipts (RN-252761, RN-252756) are Open with no received time — carrier follow-up recommended.',
    level: 'warn',
  },
  {
    icon: <TrendingDown size={12} className="text-red-400 shrink-0 mt-0.5" />,
    text: 'RN-252762 (UMA1111) has been In Yard since 08:32 with 0 units received. Investigate dock assignment.',
    level: 'alert',
  },
  {
    icon: <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />,
    text: '3 receipts completed today (RN-252768, RN-252759, RN-252757) — 100% of Daily Received target met for Valley View.',
    level: 'ok',
  },
  {
    icon: <Package size={12} className="text-blue-400 shrink-0 mt-0.5" />,
    text: 'RN-252764 received 18/20 units (90%). 2-unit variance on TCL-TV32 — cycle count recommended.',
    level: 'info',
  },
]

// ─── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: InboundRecord['status'] }) {
  const map: Record<string, string> = {
    'Open':           'bg-blue-100 text-blue-700',
    'Scheduled':      'bg-violet-100 text-violet-700',
    'Daily Received': 'bg-emerald-100 text-emerald-700',
    'MTD Received':   'bg-teal-100 text-teal-700',
    'Closed':         'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Item Level Modal ─────────────────────────────────────────────────────────
function ItemLevelModal({ record, onClose }: { record: InboundRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Item Level Details</p>
            <h3 className="text-base font-bold text-gray-900">Receipt: {record.receiptNo}</h3>
            <p className="text-xs text-primary-600 mt-0.5">Receipt {record.receiptNo} | Title: {record.title} ({record.customer})</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
              <FileText size={13} /> Print PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Item ID','Short Desc','Description','Supplier','Expected Qty','Expected BaseQty','Received Qty','Received BaseQty','UOM','Grade'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {record.items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-800">{item.itemId}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.shortDesc}</td>
                    <td className="py-2.5 px-3 text-gray-700">{item.description}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.supplier}</td>
                    <td className="py-2.5 px-3 text-gray-800 font-medium">{item.expectedQty}</td>
                    <td className="py-2.5 px-3 text-gray-500">—</td>
                    <td className={`py-2.5 px-3 font-semibold ${item.receivedQty < item.expectedQty ? 'text-orange-600' : 'text-emerald-600'}`}>{item.receivedQty}</td>
                    <td className="py-2.5 px-3 text-gray-500">—</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.uom}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Carrier info */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Carrier', value: record.carrier || '—' },
              { label: 'Container No', value: record.containerNo || '—' },
              { label: 'SCAC Code', value: record.scacCode || '—' },
              { label: 'Equipment Type', value: record.equipmentType },
              { label: 'In Yard Time', value: record.inYardTime || '—' },
              { label: 'Received Time', value: record.receivedTime || '—' },
              { label: 'Received Date', value: record.receivedDate || '—' },
              { label: 'Source', value: record.source },
            ].map((f, i) => (
              <div key={i}>
                <p className="text-gray-400 mb-0.5">{f.label}</p>
                <p className="font-medium text-gray-700">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InboundInquiry() {
  const [activeTab, setActiveTab] = useState('All')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [detailRecord, setDetailRecord] = useState<InboundRecord | null>(null)
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('All Customers')
  const [facility, setFacility] = useState('All Facilities')
  const [aiExpanded, setAiExpanded] = useState(true)

  const customers = ['All Customers', ...Array.from(new Set(MOCK_DATA.map(d => d.customer)))]
  const facilities = ['All Facilities', ...Array.from(new Set(MOCK_DATA.map(d => d.facility)))]

  const filtered = MOCK_DATA.filter(d => {
    if (activeTab !== 'All' && d.status !== activeTab) return false
    if (customer !== 'All Customers' && d.customer !== customer) return false
    if (facility !== 'All Facilities' && d.facility !== facility) return false
    if (search && !d.receiptNo.toLowerCase().includes(search.toLowerCase()) &&
        !d.refNo.toLowerCase().includes(search.toLowerCase()) &&
        !d.poNo.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts: Record<string, number> = {
    All: MOCK_DATA.length,
    Open: MOCK_DATA.filter(d => d.status === 'Open').length,
    Scheduled: MOCK_DATA.filter(d => d.status === 'Scheduled').length,
    'Daily Received': MOCK_DATA.filter(d => d.status === 'Daily Received').length,
    'MTD Received': MOCK_DATA.filter(d => d.status === 'MTD Received').length,
  }

  return (
    <div className="p-6">

      {/* ── Page header with AI Insights ── */}
      <div className="flex items-start gap-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900 shrink-0">Inbound Inquiry</h1>

        {/* AI Insights Banner */}
        <div className="flex-1 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl px-4 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {/* AI icon */}
              <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={13} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={11} className="text-violet-500" />
                  <p className="text-[11px] font-bold text-violet-700 uppercase tracking-wide">AI Analysis</p>
                  <span className="text-[10px] text-violet-400">· Based on current list data</span>
                </div>
                {aiExpanded && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {AI_INSIGHTS.map((insight, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        {insight.icon}
                        <p className="text-[11px] text-gray-700 leading-snug">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setAiExpanded(v => !v)}
              className="text-[10px] text-violet-500 hover:text-violet-700 font-medium shrink-0 mt-0.5">
              {aiExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          {/* Date ranges */}
          {['Created Date Range','Appointment Date Range','In Yard Date Range','Received Date Range'].map(label => (
            <div key={label}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input type="text" placeholder={`Start — End`} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-primary-400" />
            </div>
          ))}
          {/* Search By */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search By</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Receipt / PO / Ref / CNTR"
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400" />
            </div>
          </div>
          {/* Item Keyword */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Item Keyword</label>
            <input type="text" placeholder="Item ID / UPC Code / AKA"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-primary-400" />
          </div>
          {/* Customer */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
            <select value={customer} onChange={e => setCustomer(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-primary-400">
              {customers.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Facility */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facility</label>
            <select value={facility} onChange={e => setFacility(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-primary-400">
              {facilities.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" placeholder="Input to search"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-primary-400" />
          </div>
          {/* Billing Grade */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Billing Grade</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-primary-400">
              <option>All</option><option>A</option><option>B</option><option>C</option>
            </select>
          </div>
          {/* Inquiry Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Inquiry Status</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-primary-400">
              <option>All</option><option>Open</option><option>Scheduled</option><option>Daily Received</option><option>MTD Received</option><option>Closed</option>
            </select>
          </div>
        </div>
        {/* Action row */}
        <div className="flex justify-end gap-2 mt-3">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
            <Search size={13} /> Search
          </button>
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex items-center gap-0.5 mb-4 border-b border-gray-200">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'}`}>
              {counts[tab] ?? 0}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 pb-2">
          <span className="text-xs text-gray-400">{filtered.length} results</span>
          <button className="flex items-center gap-1 px-2.5 py-1 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
            Columns
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-8 py-3 px-3" />
                <th className="w-6 py-3 px-2" />
                {['Facility','Customer','Receipt #','Status','Rush','Title','PO #','Destination Code','Ref#','Action'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-16">
                  <Search size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">No data found</p>
                  <p className="text-xs text-gray-300 mt-1">Try adjusting your search criteria</p>
                </td></tr>
              ) : filtered.map(row => (
                <>
                  <tr key={row.id} className={`hover:bg-gray-50/60 transition-colors ${expandedRow === row.id ? 'bg-violet-50/40' : ''}`}>
                    {/* Checkbox placeholder */}
                    <td className="py-3 px-3">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-400" />
                    </td>
                    {/* Expand toggle */}
                    <td className="py-3 px-2">
                      <button onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                        className="text-gray-400 hover:text-gray-600">
                        {expandedRow === row.id
                          ? <ChevronDown size={14} />
                          : <ChevronRight size={14} />}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-600">{row.facility}</td>
                    <td className="py-3 px-3 text-xs font-medium text-gray-700">{row.customer}</td>
                    <td className="py-3 px-3">
                      <button onClick={() => setDetailRecord(row)}
                        className="text-primary-600 hover:text-primary-800 hover:underline text-xs font-medium">
                        {row.receiptNo}
                      </button>
                    </td>
                    <td className="py-3 px-3"><StatusBadge status={row.status} /></td>
                    <td className="py-3 px-3">
                      {row.rush
                        ? <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">Yes</span>
                        : <span className="text-xs text-gray-400">No</span>}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-700 max-w-[140px] truncate">{row.title}</td>
                    <td className="py-3 px-3 text-xs text-gray-500">{row.poNo || '—'}</td>
                    <td className="py-3 px-3 text-xs text-gray-400">{row.destinationCode || '—'}</td>
                    <td className="py-3 px-3 text-xs text-gray-500">{row.refNo || '—'}</td>
                    <td className="py-3 px-3">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row — carrier & timeline info */}
                  {expandedRow === row.id && (
                    <tr key={`${row.id}-exp`} className="bg-violet-50/30">
                      <td colSpan={12} className="px-8 py-4">
                        <div className="grid grid-cols-5 gap-4 text-xs">
                          <div><p className="text-gray-400 mb-0.5">Carrier</p><p className="font-medium text-gray-700">{row.carrier || '—'}</p></div>
                          <div><p className="text-gray-400 mb-0.5">Container No</p><p className="font-medium text-gray-700">{row.containerNo || '—'}</p></div>
                          <div><p className="text-gray-400 mb-0.5">SCAC Code</p><p className="font-medium text-gray-700">{row.scacCode || '—'}</p></div>
                          <div><p className="text-gray-400 mb-0.5">In Yard Time</p><p className="font-medium text-gray-700">{row.inYardTime || '—'}</p></div>
                          <div><p className="text-gray-400 mb-0.5">Received Time</p><p className={`font-medium ${row.receivedTime ? 'text-emerald-600' : 'text-orange-500'}`}>{row.receivedTime || 'Not yet received'}</p></div>
                          <div><p className="text-gray-400 mb-0.5">Equipment Type</p><p className="font-medium text-gray-700">{row.equipmentType}</p></div>
                          <div><p className="text-gray-400 mb-0.5">Source</p><p className="font-medium text-gray-700">{row.source}</p></div>
                          <div><p className="text-gray-400 mb-0.5">Create Date</p><p className="font-medium text-gray-700">{row.createDate}</p></div>
                          <div><p className="text-gray-400 mb-0.5">Items</p><p className="font-medium text-gray-700">{row.items.length} line(s)</p></div>
                          <div className="flex items-end">
                            <button onClick={() => setDetailRecord(row)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
                              <FileText size={11} /> View Item Details
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Level Modal */}
      {detailRecord && <ItemLevelModal record={detailRecord} onClose={() => setDetailRecord(null)} />}
    </div>
  )
}
