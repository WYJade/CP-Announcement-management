import { useState } from 'react'
import { Search, Download, X, MapPin, Truck, CheckCircle2 } from 'lucide-react'
import OrderAlertBanner from '../common/OrderAlertBanner'
import { SHIPPING_ALERTS } from './ShippingAlerts'

const STATUS_TABS = [
  { key: 'all', label: 'All', count: 22740 },
  { key: 'new', label: 'New', count: 9431 },
  { key: 'pickup-dispatched', label: 'Pickup Dispatched', count: 4038 },
  { key: 'pickup-completed', label: 'Pickup Completed', count: 2106 },
  { key: 'in-transit', label: 'In Transit', count: 2291 },
  { key: 'ofd', label: 'OFD', count: 3492 },
  { key: 'delivered', label: 'Delivered', count: 1144 },
]

interface ShipmentRow {
  pro: string; pu: string; po: string; status: string
  origin: string; destination: string; scheduledDelivery: string; customer: string
}

const SAMPLE_ROWS: ShipmentRow[] = [
  { pro: '', pu: 'DO00065124', po: '', status: 'New', origin: 'FONTANA CA 92336', destination: 'CHICAGO IL 60607', scheduledDelivery: '', customer: 'MOTC201' },
  { pro: '', pu: 'DO00065123', po: '', status: 'Unloaded', origin: 'ONTARIO CA 91764', destination: 'CHICAGO IL 60608', scheduledDelivery: '', customer: 'MOTC201' },
  { pro: '', pu: 'DO00065122', po: '', status: 'Pickup Confirmed', origin: 'ONTARIO CA 91761', destination: 'HOUSTON TX 77007', scheduledDelivery: '', customer: 'MOTC201' },
  { pro: '', pu: 'DO00065121', po: '', status: 'Pickup Confirmed', origin: 'ONTARIO CA 91761', destination: 'COLLEGE STATION TX 77840', scheduledDelivery: '', customer: 'MOTC201' },
  { pro: '', pu: 'DO00065320', po: '', status: 'Delivered', origin: 'WEST CHICAGO IL 60185', destination: 'FONTANA CA 92536', scheduledDelivery: '', customer: 'MOTC201' },
  { pro: '', pu: 'DO00065313', po: '', status: 'New', origin: 'Lake Elsinore CA 92530', destination: 'HAWAIIAN GARDENS CA 90716', scheduledDelivery: '', customer: 'MOTC201' },
  { pro: 'ULX0005265', pu: 'DO00065312', po: 'U0000545S45', status: 'New', origin: 'Lake Elsinore CA 92530', destination: 'Hawaiian Gardens CA 90716', scheduledDelivery: '06/25/2026', customer: 'MOTC201' },
  { pro: '', pu: 'DO00065307', po: '', status: 'New', origin: 'FORT WORTH TX 76118', destination: 'LOVELAND CO 80538', scheduledDelivery: '', customer: 'MOTC201' },
]

// ─── Tracking steps ──────────────────────────────────────────────────────────
const TRACKING_STEPS = ['New', 'Pickup Dispatched', 'Pickup Completed', 'In Transit', 'Out for Delivery', 'Delivered']

function getStepIndex(status: string): number {
  if (status === 'Delivered') return 5
  if (status === 'Out for Delivery' || status === 'OFD') return 4
  if (status === 'In Transit' || status === 'Unloaded') return 3
  if (status === 'Pickup Confirmed' || status === 'Pickup Completed') return 2
  if (status === 'Pickup Dispatched') return 1
  return 0
}

// ─── Tracking Detail Panel ───────────────────────────────────────────────────

function TrackingDetailPanel({ row, onClose }: { row: ShipmentRow; onClose: () => void }) {
  const stepIdx = getStepIndex(row.status)

  return (
    <div className="w-[360px] border-l border-gray-200 bg-white overflow-y-auto shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">PU:{row.pu}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={14} /></button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-0 mb-2">
          {TRACKING_STEPS.map((_, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 ${i <= stepIdx ? 'bg-primary-500' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {TRACKING_STEPS.map((s, i) => (
            <span key={s} className={`text-[9px] ${i <= stepIdx ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
              {s.replace('Pickup ', 'P.').replace('Out for Delivery', 'OFD')}
            </span>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="px-4 py-3">
        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-12 mb-3">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-1">
                  <MapPin size={14} className="text-white" />
                </div>
                <p className="text-[10px] font-medium text-gray-700">{row.origin.split(' ').slice(0, 2).join(' ')}</p>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-primary-300 relative">
                <Truck size={14} className="text-primary-600 absolute -top-2 left-1/2 -translate-x-1/2 bg-white" />
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                  <MapPin size={14} className="text-white" />
                </div>
                <p className="text-[10px] font-medium text-gray-700">{row.destination.split(' ').slice(0, 2).join(' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment info */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-4 gap-2 text-xs border-b border-gray-100 pb-3 mb-3">
          <div><p className="text-gray-400">Status</p><p className="font-medium text-primary-600">{row.status || 'New'}</p></div>
          <div><p className="text-gray-400">Origin</p><p className="font-medium text-gray-700 truncate">{row.origin}</p></div>
          <div><p className="text-gray-400">Destination</p><p className="font-medium text-gray-700 truncate">{row.destination}</p></div>
          <div><p className="text-gray-400">Delivery</p><p className="font-medium text-gray-700">{row.scheduledDelivery || '-'}</p></div>
        </div>

        <p className="text-sm font-semibold text-gray-900 mb-2">Shipment Active</p>

        {/* Timeline */}
        <div className="space-y-3">
          {stepIdx >= 2 && (
            <div className="flex gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={11} className="text-green-600" /></div>
              <div><p className="text-xs font-medium text-gray-800">Pickup Confirmed</p><p className="text-[11px] text-gray-400">Carrier picked up at origin · 06/24 14:30</p></div>
            </div>
          )}
          {stepIdx >= 1 && (
            <div className="flex gap-2.5">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={11} className="text-green-600" /></div>
              <div><p className="text-xs font-medium text-gray-800">Pickup Dispatched</p><p className="text-[11px] text-gray-400">Carrier assigned and en route · 06/24 10:00</p></div>
            </div>
          )}
          <div className="flex gap-2.5">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><MapPin size={11} className="text-blue-600" /></div>
            <div><p className="text-xs font-medium text-gray-800">Order Created</p><p className="text-[11px] text-gray-400">Shipment order created · 06/24 08:00</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Tracking() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedRow, setSelectedRow] = useState<ShipmentRow | null>(null)

  // Auto-select DO00065121 if coming from alert "查看轨迹详情"
  // In a real app this would use URL params; here we auto-open the anomaly shipment
  const handleAlertAction = () => {
    const anomalyRow = SAMPLE_ROWS.find((r) => r.pu === 'DO00065121')
    if (anomalyRow) setSelectedRow(anomalyRow)
  }

  return (
    <div className="p-6">
      <OrderAlertBanner alerts={SHIPPING_ALERTS} />

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Tracking</h1>
      </div>

      {/* Tabs: LTL Shipment / Small Parcel */}
      <div className="flex items-center gap-2 mb-5">
        <button className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg">LTL Shipment</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">Small Parcel</button>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-0 mb-5 bg-gradient-to-r from-red-100 via-orange-100 to-green-100 rounded-lg overflow-hidden">
        {STATUS_TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-center transition-colors ${activeTab === tab.key ? 'bg-primary-100 font-semibold text-primary-700' : 'text-gray-600 hover:bg-white/50'}`}>
            <p className="text-xs text-gray-500">{tab.label}</p>
            <p className="text-sm font-bold">{tab.count.toLocaleString()}</p>
          </button>
        ))}
      </div>

      {/* Search & Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search up to 20 Tracking IDs (PRO, PU, PO)" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg" />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All</option></select>
        <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Time Range</button>
        <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Filter</button>
        <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Search</button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md">Table View</button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50">Card View</button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"><Download size={12} /> Download</button>
          <button className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50">Batch Import</button>
        </div>
      </div>

      {/* Table + Detail Panel */}
      <div className="flex gap-0">
        <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${selectedRow ? 'flex-1' : 'w-full'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Pro', 'PU #', 'PO #', 'Status', 'Origin', 'Destination', 'Scheduled Delivery', 'Customer'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((row, i) => (
                <tr key={i} onClick={() => setSelectedRow(row)}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${selectedRow?.pu === row.pu ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{row.pro || '-'}</td>
                  <td className="py-3 px-4 text-gray-700 font-mono text-xs">{row.pu}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.po || '-'}</td>
                  <td className="py-3 px-4">{row.status && <span className="text-xs font-medium text-primary-600">{row.status}</span>}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{row.origin}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{row.destination}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{row.scheduledDelivery || '-'}</td>
                  <td className="py-3 px-4 text-gray-700">{row.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selectedRow && <TrackingDetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} />}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>0 of 21304 row(s) selected</span>
        <span>Rows per page: 10 | Page 1 of 2131</span>
      </div>
    </div>
  )
}
