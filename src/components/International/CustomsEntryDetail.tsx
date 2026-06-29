import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ENTRIES_DATA: Record<string, any> = {
  '82G-0101679-0': {
    declarationNo: '82G-0101679-0', date: 'June 15, 2026', importerName: 'ADOORN LLC',
    referenceNumber: 'SHIP-JUNE12-US', productDescription: 'SECTION 122 - 10% DUTY',
    countryOfOrigin: 'CN', totalEnteredValue: '$31,720.15', totalDuty: '$8,991.00',
    totalSurcharges: '$43.53', carrier: 'ONEY ONE MACKINAC', locationOfGoods: 'UNION PACIFIC RAILROAD',
    mbl: 'CANG32467900', hbl: 'CCQR SSHAS2607966',
    lineItems: [
      { invoiceLineNo: 2, line7501: 2, productNo: 2, productValue: '$0.00', adValoremRate: '10.00%', dutyAmount: '$18.00', surchargeAmount: '$0.85', htsNo: '99030301' },
      { invoiceLineNo: 3, line7501: 3, productNo: 3, productValue: '$880.00', adValoremRate: '6.30%', dutyAmount: '$55.44', surchargeAmount: '$4.15', htsNo: '4202921500' },
      { invoiceLineNo: 4, line7501: 4, productNo: 4, productValue: '$1,706.00', adValoremRate: '17.60%', dutyAmount: '$316.10', surchargeAmount: '$8.47', htsNo: '4202923131' },
      { invoiceLineNo: 2, line7501: 2, productNo: 0, productValue: '$0.00', adValoremRate: '25.00%', dutyAmount: '$45.00', surchargeAmount: '$0.85', htsNo: '99038603' },
      { invoiceLineNo: 1, line7501: 1, productNo: 0, productValue: '$0.00', adValoremRate: '25.00%', dutyAmount: '$31.50', surchargeAmount: '$0.60', htsNo: '99038603' },
      { invoiceLineNo: 1, line7501: 1, productNo: 0, productValue: '$126.00', adValoremRate: '8.00%', dutyAmount: '$11.34', surchargeAmount: '$0.60', htsNo: '4202718000' },
      { invoiceLineNo: 3, line7501: 3, productNo: 0, productValue: '$0.00', adValoremRate: '25.00%', dutyAmount: '$220.00', surchargeAmount: '$4.15', htsNo: '99038603' },
      { invoiceLineNo: 1, line7501: 1, productNo: 0, productValue: '$0.00', adValoremRate: '10.00%', dutyAmount: '$12.60', surchargeAmount: '$0.60', htsNo: '99030301' },
      { invoiceLineNo: 5, line7501: 5, productNo: 0, productValue: '$4,971.00', adValoremRate: '20.00%', dutyAmount: '$954.20', surchargeAmount: '$23.43', htsNo: '4202924500' },
    ],
  },
  '82G-0101778-0': {
    declarationNo: '82G-0101778-0', date: 'June 12, 2026', importerName: 'THE ONLY BEAN LLC',
    referenceNumber: 'SHIP-JUNE10-US', productDescription: 'ROASTED EDAMAME - FOOD ITEMS',
    countryOfOrigin: 'CN', totalEnteredValue: '$31,181.38', totalDuty: '$12,098.23',
    totalSurcharges: '$56.20', carrier: 'DORIS OCEAN', locationOfGoods: 'PORT OF LONG BEACH',
    mbl: 'ONEYSH5AABA01700', hbl: 'SSHAS2608130',
    lineItems: [
      { invoiceLineNo: 1, line7501: 1, productNo: 1, productValue: '$15,590.69', adValoremRate: '25.00%', dutyAmount: '$6,049.12', surchargeAmount: '$28.10', htsNo: '2008939000' },
      { invoiceLineNo: 2, line7501: 2, productNo: 2, productValue: '$15,590.69', adValoremRate: '25.00%', dutyAmount: '$6,049.11', surchargeAmount: '$28.10', htsNo: '2008939000' },
    ],
  },
}

const DEFAULT_ENTRY = { declarationNo: '', date: 'June 12, 2026', importerName: 'Unknown', referenceNumber: '-', productDescription: '-', countryOfOrigin: '-', totalEnteredValue: '-', totalDuty: '-', totalSurcharges: '-', carrier: '-', locationOfGoods: '-', mbl: '-', hbl: '-', lineItems: [] }

export default function CustomsEntryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details')
  const entry = ENTRIES_DATA[id || ''] || { ...DEFAULT_ENTRY, declarationNo: id || '' }

  const fields = [
    ['Importer Name', entry.importerName], ['Reference Number', entry.referenceNumber],
    ['Product Description', entry.productDescription], ['Country of Origin', entry.countryOfOrigin],
    ['Total Entered Value', entry.totalEnteredValue], ['Total Duty', entry.totalDuty],
    ['Total Surcharges', entry.totalSurcharges], ['Carrier', entry.carrier],
    ['Location of Goods', entry.locationOfGoods], ['MBL', entry.mbl], ['HBL', entry.hbl],
  ]

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
        <button onClick={() => navigate('/international/customs')} className="hover:text-primary-600 flex items-center gap-1"><ArrowLeft size={14} /> Customs Entries</button>
        <span>/</span>
        <span className="text-gray-800 font-medium">View Declaration</span>
      </div>

      {/* Header + Tabs inline */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entry #: {entry.declarationNo}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Date: {entry.date}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('details')} className={`text-sm font-medium pb-1 border-b-2 ${activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400'}`}>Declaration Details</button>
          <button onClick={() => setActiveTab('documents')} className={`text-sm font-medium pb-1 border-b-2 ${activeTab === 'documents' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400'}`}>Documents</button>
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="flex gap-8">
          {/* Left: Key fields */}
          <div className="w-[340px] shrink-0">
            <div className="space-y-4">
              {fields.map(([label, value]) => (
                <div key={label as string} className="flex">
                  <span className="text-sm text-gray-500 w-[160px] shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map + Line items */}
          <div className="flex-1 space-y-5">
            {/* Map placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-gray-200 rounded-lg h-36 flex items-center justify-center">
              <span className="text-sm text-gray-400">Origin: {entry.countryOfOrigin} &rarr; Destination: US</span>
            </div>

            {/* Line items */}
            {entry.lineItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Invoice Line No', '7501 Line No', 'Product No', 'Product Value', 'Ad Valorem Rate', 'Duty Amount', 'Surcharge Amount', 'HTS No'].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entry.lineItems.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{item.invoiceLineNo}</td>
                        <td className="py-2 px-3 text-gray-700">{item.line7501}</td>
                        <td className="py-2 px-3 text-gray-700">{item.productNo}</td>
                        <td className="py-2 px-3 text-gray-700">{item.productValue}</td>
                        <td className="py-2 px-3 text-gray-700">{item.adValoremRate}</td>
                        <td className="py-2 px-3 text-gray-700">{item.dutyAmount}</td>
                        <td className="py-2 px-3 text-gray-700">{item.surchargeAmount}</td>
                        <td className="py-2 px-3 text-gray-700">{item.htsNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b"><th className="text-left py-3 px-4 font-semibold text-gray-500">File Name</th><th className="text-left py-3 px-4 font-semibold text-gray-500">Entry Date</th></tr></thead>
            <tbody><tr><td colSpan={2} className="text-center py-10 text-gray-400">No data available to display</td></tr></tbody>
          </table>
          <div className="text-right px-4 py-2 text-xs text-gray-400 border-t">Page Size: 15 | 0 to 0 of 0 | Page 0 of 0</div>
        </div>
      )}
    </div>
  )
}
