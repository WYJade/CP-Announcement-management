import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Package, Truck, Calendar, MapPin } from 'lucide-react'

const RECEIPT_DATA = {
  receiptNo: 'RN-110210',
  poNo: 'PO-20260624-201',
  customer: 'FASHIONWAVE',
  facility: 'Valley View',
  status: 'Imported',
  receivedDate: '2026-06-24',
  totalQty: 2400,
  poQty: 2400,
  variance: 0,
  rush: 'No',
  title: 'FASHIONWAVE',
  destinationCode: '',
  items: [
    { sku: 'FW-2024-SUMMER-A', description: 'Summer Collection Tee - White', qty: 600, status: 'Put Away' },
    { sku: 'FW-2024-SUMMER-B', description: 'Summer Collection Tee - Black', qty: 600, status: 'Put Away' },
    { sku: 'FW-2024-SUMMER-C', description: 'Summer Collection Shorts', qty: 600, status: 'Put Away' },
    { sku: 'FW-2024-SUMMER-D', description: 'Summer Collection Dress', qty: 600, status: 'Put Away' },
  ],
  timeline: [
    { time: '2026-06-24 10:30', event: 'Receipt completed, all items put away', actor: 'Warehouse System' },
    { time: '2026-06-24 09:45', event: 'Quality check passed, no damages found', actor: 'QC Team' },
    { time: '2026-06-24 08:30', event: 'Unloading completed, count verified', actor: 'Inbound Team' },
    { time: '2026-06-24 07:00', event: 'Truck arrived at dock #3', actor: 'Yard Management' },
    { time: '2026-06-23 16:00', event: 'Appointment confirmed for 2026-06-24 AM', actor: 'System' },
  ],
}

export default function ReceiptDetail() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/inbound/inquiry')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Inbound Inquiry
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipt Detail</h1>
          <p className="text-sm text-gray-500 mt-1">
            Receipt #{RECEIPT_DATA.receiptNo} · PO #{RECEIPT_DATA.poNo}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
          <CheckCircle2 size={14} />
          {RECEIPT_DATA.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Main info */}
        <div className="col-span-2 space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{RECEIPT_DATA.totalQty.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">Total Received</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{RECEIPT_DATA.poQty.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">PO Quantity</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-700">{RECEIPT_DATA.variance}</p>
              <p className="text-xs text-gray-600 mt-1">Variance</p>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Received Items ({RECEIPT_DATA.items.length})</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECEIPT_DATA.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5 px-4 font-mono text-xs text-gray-700">{item.sku}</td>
                    <td className="py-2.5 px-4 text-gray-700">{item.description}</td>
                    <td className="py-2.5 px-4 text-right font-medium text-gray-900">{item.qty}</td>
                    <td className="py-2.5 px-4">
                      <span className="text-xs font-medium text-green-600">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Receipt Timeline</h3>
            <div className="space-y-4">
              {RECEIPT_DATA.timeline.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {i < RECEIPT_DATA.timeline.length - 1 && <div className="w-px h-full bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-800">{entry.event}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{entry.time} · {entry.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Package size={13} className="text-gray-400" />
                <span className="text-gray-500 w-20">Customer</span>
                <span className="text-gray-900 font-medium">{RECEIPT_DATA.customer}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-gray-400" />
                <span className="text-gray-500 w-20">Facility</span>
                <span className="text-gray-900 font-medium">{RECEIPT_DATA.facility}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-gray-400" />
                <span className="text-gray-500 w-20">Received</span>
                <span className="text-gray-900 font-medium">{RECEIPT_DATA.receivedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={13} className="text-gray-400" />
                <span className="text-gray-500 w-20">Rush</span>
                <span className="text-gray-900">{RECEIPT_DATA.rush}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-green-800">All Items Put Away</span>
            </div>
            <p className="text-xs text-green-600 leading-relaxed">
              All {RECEIPT_DATA.totalQty.toLocaleString()} items have been received, inspected, and stored. 
              They are now available for outbound fulfillment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
