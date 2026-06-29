import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ENTRIES_DATA: Record<string, {
  declarationNo: string; date: string; importerName: string; referenceNumber: string;
  productDescription: string; countryOfOrigin: string; totalEnteredValue: string;
  totalDuty: string; totalSurcharges: string; carrier: string; locationOfGoods: string;
  mbl: string; hbl: string;
  lineItems: { invoiceLineNo: number; line7501: number; productNo: number; productValue: string; adValoremRate: string; dutyAmount: string; surchargeAmount: string; htsNo: string }[];
}> = {
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

// Fallback for entries not in the map
const DEFAULT_ENTRY = {
  declarationNo: '', date: 'June 12, 2026', importerName: 'Unknown',
  referenceNumber: '-', productDescription: '-', countryOfOrigin: '-',
  totalEnteredValue: '-', totalDuty: '-', totalSurcharges: '-',
  carrier: '-', locationOfGoods: '-', mbl: '-', hbl: '-', lineItems: [],
}

export default function CustomsEntryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details')

  const entry = ENTRIES_DATA[id || ''] || { ...DEFAULT_ENTRY, declarationNo: id || '' }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={() => navigate('/international/customs')} className="hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={14} /> Customs Entries
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">View Declaration</span>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left - Declaration Details */}
        <div className="col-span-2">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Entry #: {entry.declarationNo}</h1>
          <p className="text-sm text-gray-500 mb-6">Date: {entry.date}</p>

          <div className="space-y-4">
            {[
              ['Importer Name', entry.importerName],
              ['Reference Number', entry.referenceNumber],
              ['Product Description', entry.productDescription],
              ['Country of Origin', entry.countryOfOrigin],
              ['Total Entered Value', entry.totalEnteredValue],
              ['Total Duty', entry.totalDuty],
              ['Total Surcharges', entry.totalSurcharges],
              ['Carrier', entry.carrier],
              ['Location of Goods', entry.locationOfGoods],
              ['MBL', entry.mbl],
              ['HBL', entry.hbl],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start">
                <span className="text-sm text-gray-500 w-40 shrink-0">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Tabs (Declaration Details / Documents) */}
        <div className="col-span-3">
          <div className="flex gap-4 border-b border-gray-200 mb-4">
            <button onClick={() => setActiveTab('details')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
              Declaration Details
            </button>
            <button onClick={() => setActiveTab('documents')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
              Documents
            </button>
          </div>

          {activeTab === 'details' && (
            <>
              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-lg h-40 mb-4 flex items-center justify-center text-gray-400 text-sm">
                <div className="text-center">
                  <div className="w-full h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">Origin: {entry.countryOfOrigin} → Destination: US</span>
                  </div>
                </div>
              </div>

              {/* Line items table */}
              {entry.lineItems.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {['Invoice Line No', '7501 Line No', 'Product No', 'Product Value', 'Ad Valorem Rate', 'Duty Amount', 'Surcharge Amount', 'HTS No'].map(h => (
                          <th key={h} className="text-left py-2 px-2 font-semibold text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entry.lineItems.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 px-2 text-gray-700">{item.invoiceLineNo}</td>
                          <td className="py-2 px-2 text-gray-700">{item.line7501}</td>
                          <td className="py-2 px-2 text-gray-700">{item.productNo}</td>
                          <td className="py-2 px-2 text-gray-700">{item.productValue}</td>
                          <td className="py-2 px-2 text-gray-700">{item.adValoremRate}</td>
                          <td className="py-2 px-2 text-gray-700">{item.dutyAmount}</td>
                          <td className="py-2 px-2 text-gray-700">{item.surchargeAmount}</td>
                          <td className="py-2 px-2 text-gray-700">{item.htsNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'documents' && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-500">File Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Entry Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-gray-400 text-sm">No data available to display</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center justify-end px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
                Page Size: 15 | 0 to 0 of 0 | Page 0 of 0
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
