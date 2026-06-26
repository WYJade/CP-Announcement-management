import { useState } from 'react'
import { Search, X } from 'lucide-react'

const SAMPLE_DATA = [
  { shipmentNo: 'S2XBS2507958', refNo: '', commodity: 'ADOORN POST MAILBOX', vessel: 'CMA CGM VERDI', voyage: 'ONAMHVWHA', mode: 'Sea Freight', containerMode: 'Full Container Load', status: 'At Destination', entryDate: 'Jun 13, 2026 6:30 PM' },
  { shipmentNo: 'STPCA30063B0', refNo: '20260604012, 20260604018, 20260608001', commodity: '', vessel: '', voyage: 'C0/2', mode: 'Air', containerMode: 'Loose', status: 'At Destination', entryDate: 'Jun 13, 2026 5:30 AM' },
  { shipmentNo: 'SLAX0061GM44', refNo: '', commodity: 'Whole port', vessel: '', voyage: '', mode: 'Road Freight', containerMode: 'Full Container Load', status: 'Booked', entryDate: 'Jun 13, 2026 5:30 AM' },
  { shipmentNo: 'SLAX0061GR43', refNo: '', commodity: '', vessel: '', voyage: '', mode: 'Road Freight', containerMode: 'Full Container Load', status: 'Booked', entryDate: 'Jun 13, 2026 4:30 AM' },
  { shipmentNo: 'SLAX0061GR42', refNo: '', commodity: '', vessel: '', voyage: '', mode: 'Road Freight', containerMode: 'Full Container Load', status: 'Booked', entryDate: 'Jun 13, 2026 3:31 AM' },
  { shipmentNo: 'SSH-AS2260017', refNo: 'PO1755-59926', commodity: 'Roasted Edamame Seawt', vessel: 'ZIM FALCON', voyage: '19E', mode: 'Sea Freight', containerMode: 'Full Container Load', status: 'In Transit', entryDate: 'Jun 13, 2026 2:30 AM' },
]

export default function IntlShipments() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Shipments</h1>
      <p className="text-sm text-gray-500 mb-5">View and manage international shipments synced from Cubeship.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Shipment Number</label>
            <input type="text" placeholder="Shipment Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">PO Number</label>
            <input type="text" placeholder="PO Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">House Bill Number</label>
            <input type="text" placeholder="House Bill Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Container Number</label>
            <input type="text" placeholder="Container Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"><X size={12} /> Clear</button>
          <button className="flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"><Search size={12} /> Search</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Shipment No', 'Reference No', 'Commodity', 'Vessel Name', 'Voyage/Flight No', 'Mode', 'Container Mode', 'Shipment Transit Status', 'Entry Date'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_DATA.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 text-primary-600 font-medium cursor-pointer hover:underline text-xs">{row.shipmentNo}</td>
                <td className="py-3 px-3 text-gray-600 text-xs">{row.refNo || '-'}</td>
                <td className="py-3 px-3 text-gray-700 text-xs">{row.commodity || '-'}</td>
                <td className="py-3 px-3 text-gray-700 text-xs">{row.vessel || '-'}</td>
                <td className="py-3 px-3 text-gray-500 text-xs">{row.voyage || '-'}</td>
                <td className="py-3 px-3 text-gray-500 text-xs">{row.mode}</td>
                <td className="py-3 px-3 text-gray-500 text-xs">{row.containerMode}</td>
                <td className="py-3 px-3 text-xs font-medium text-blue-600">{row.status}</td>
                <td className="py-3 px-3 text-gray-500 text-xs">{row.entryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
