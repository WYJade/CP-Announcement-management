import { useState } from 'react'
import { Search, X } from 'lucide-react'

const SAMPLE_DATA = [
  { declarationNo: '82G-0101679-0', date: 'Jun 15, 2026', masterShipment: 'WHLC039GX40070', enteredValue: '$31,720.15', totalDuty: '$8,991.00', importer: 'ADOORN LLC', broker: 'JFS', source: 'NetCHB', mode: 'Vessel Containerized' },
  { declarationNo: '82G-0101778-0', date: 'Jun 12, 2026', masterShipment: 'ONEYSH5AABA01700', enteredValue: '$31,181.38', totalDuty: '$12,098.23', importer: 'THE ONLY BEAN LLC', broker: 'JFS', source: 'NetCHB', mode: 'Vessel Containerized' },
  { declarationNo: '82G-0101822-6', date: 'Jun 12, 2026', masterShipment: 'ONEYSH6AA5619400', enteredValue: '$24,526.22', totalDuty: '$9,516.09', importer: 'THE ONLY BEAN LLC', broker: 'JFS', source: 'NetCHB', mode: 'Vessel Containerized' },
  { declarationNo: '82G-0101804-4', date: 'Jun 12, 2026', masterShipment: 'ZIMUSNH22519115', enteredValue: '$24,526.22', totalDuty: '$9,516.09', importer: 'THE ONLY BEAN LLC', broker: 'JFS', source: 'NetCHB', mode: 'Vessel Containerized' },
  { declarationNo: '82G-0101908-3', date: 'Jun 12, 2026', masterShipment: 'TAMH82G01019083', enteredValue: '$22,369.64', totalDuty: '$0.00', importer: 'INNOVIEW AMERICAN LIMITED', broker: 'JFS', source: 'NetCHB', mode: 'Truck Containerized' },
  { declarationNo: '82G-0101884-6', date: 'Jun 12, 2026', masterShipment: 'FXFE67760575', enteredValue: '$20,202.00', totalDuty: '$2,020.20', importer: 'Radiant Industries Inc', broker: 'JFS', source: 'NetCHB', mode: 'Truck Non-Containerized' },
]

export default function CustomsEntries() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Customs Entries</h1>
      <p className="text-sm text-gray-500 mb-5">View and manage customs declarations synced from Cubeship.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Declaration No</label>
            <input type="text" placeholder="Declaration No" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Master Shipment No</label>
            <input type="text" placeholder="Master Shipment No" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Importer Name</label>
            <input type="text" placeholder="Importer Name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
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
              {['Declaration No', 'Declaration Date', 'Master Shipment No', 'Entered Value', 'Total Duty', 'Importer Name', 'Broker', 'Source', 'Mode'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_DATA.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-primary-600 font-medium cursor-pointer hover:underline">{row.declarationNo}</td>
                <td className="py-3 px-4 text-gray-600">{row.date}</td>
                <td className="py-3 px-4 text-gray-700 font-mono text-xs">{row.masterShipment}</td>
                <td className="py-3 px-4 text-gray-700">{row.enteredValue}</td>
                <td className="py-3 px-4 text-gray-700">{row.totalDuty}</td>
                <td className="py-3 px-4 text-gray-700">{row.importer}</td>
                <td className="py-3 px-4 text-gray-500">{row.broker}</td>
                <td className="py-3 px-4 text-gray-500">{row.source}</td>
                <td className="py-3 px-4 text-gray-500">{row.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
