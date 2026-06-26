import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { invoices } from '../../data/invoices'
import PayDialog from './PayDialog'

function InvoiceDetail() {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>()
  const navigate = useNavigate()
  const [payDialogOpen, setPayDialogOpen] = useState(false)

  const invoice = invoices.find((inv) => inv.invoiceNumber === invoiceNumber)

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Invoice not found: {invoiceNumber}</p>
        <button
          onClick={() => navigate('/finance/invoices')}
          className="mt-4 text-primary-600 hover:underline"
        >
          Back to Invoice List
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/finance/invoices')}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Invoice
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <Download size={14} />
          Download
        </button>
      </div>

      {/* Invoice Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Invoice # <span className="text-primary-600">{invoice.invoiceNumber}</span>
        </h1>
      </div>

      {/* Main Info Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 font-medium text-gray-600">PRO #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">BOL #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">PU #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">ISSUE DATE</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">DUE DATE</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">AMOUNT</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">OUTSTANDING BALANCE</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-3 px-4 text-gray-800">{invoice.proNumber}</td>
              <td className="py-3 px-4 text-gray-800">{invoice.bolNumber}</td>
              <td className="py-3 px-4 text-gray-800">{invoice.puNumber}</td>
              <td className="py-3 px-4 text-gray-800">{invoice.issueDate}</td>
              <td className="py-3 px-4 text-gray-800">{invoice.dueDate}</td>
              <td className="py-3 px-4 text-right text-gray-800">${invoice.amount}</td>
              <td className="py-3 px-4 text-right text-gray-800">
                ${invoice.outstandingBalance?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Remit To */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Remit to</h3>
        <p className="text-sm text-gray-600">{invoice.remitTo?.company}</p>
        <p className="text-sm text-gray-500">{invoice.remitTo?.address}</p>
      </div>

      {/* Address Cards */}
      <div className="bg-gray-50 rounded-lg border border-gray-100 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
            DELIVER TO (CONSIGNEE)
          </h4>
          <p className="text-sm text-gray-800">{invoice.deliverTo?.name}</p>
          <p className="text-sm text-gray-500">{invoice.deliverTo?.address}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">FROM (SHIPPER)</h4>
          <p className="text-sm text-gray-800">{invoice.shipFrom?.name}</p>
          <p className="text-sm text-gray-500">{invoice.shipFrom?.address}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">BILL TO</h4>
          <p className="text-sm text-gray-800">{invoice.billTo?.name}</p>
          <p className="text-sm text-gray-500">Email: {invoice.billTo?.email}</p>
          <p className="text-sm text-gray-500">Phone: {invoice.billTo?.phone}</p>
        </div>
      </div>

      {/* Rate Breakdown */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Rate breakdown</h3>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">PO #, BOL#, Load#</p>
              <p className="text-sm text-gray-800">{invoice.rateBreakdown?.poNumber}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Ship date</p>
              <p className="text-sm text-gray-800">{invoice.rateBreakdown?.shipDate}</p>
            </div>
          </div>

          {/* Item details */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-2">Item details</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-500">Item</th>
                  <th className="text-center py-2 font-medium text-gray-500">Package type</th>
                  <th className="text-right py-2 font-medium text-gray-500">Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td colSpan={3} className="py-3 text-center text-gray-400 text-xs">
                    {/* Empty items */}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-sm">
              <span className="text-gray-600">Total</span>
              <div className="flex gap-12">
                <span className="text-gray-600">0 item(s)</span>
                <span className="text-gray-600">0.00 lbs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Price breakdown</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-800">Total amount :</p>
          <p className="text-lg font-bold text-gray-900">${invoice.amount}</p>
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => setPayDialogOpen(true)}
            className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Pay Invoice
          </button>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Documents</h3>
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400">No documents available</p>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Payment history</h3>
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Payment method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Amount paid</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Balance due</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-gray-400">
                  No payment history available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-gray-700 font-bold uppercase leading-relaxed">
          LATE PAYMENT WILL RESULT IN LOST DISCOUNTS, FINANCE SERVICE CHARGES, COLLECTION COSTS AND
          REASONABLE ATTORNEY FEES. FAILURE TO MAKE TIMELY PAYMENT OF FREIGHT CHARGES
        </p>
        <div className="mt-2 text-xs text-gray-600 space-y-1 leading-relaxed">
          <p>
            A. Unless arranged or agreed upon, in writing prior to shipment the carrier requires all
            freight bills to be paid within the net term. Overdue accounts will be subject to
            non-negotiable late charge of 5% per month.
          </p>
          <p>
            B. The filing of a cargo or other claim against carrier will not relieve payer from
            responsibility for payment of freight charges.
          </p>
          <p>
            C. Failure to pay billed charges may result in a lien on future shipments, including the
            cost of storage and appropriate security for the subsequent shipment held pursuant to
            California civil Code Section 3051.5.
          </p>
          <p>
            D. Provisions of this rule do not change in any way the carrier obligation to collect nor
            the freight charge payer obligation to pay compliance with D.O.T. 49 CFR Part 377 and
            the credit period stated on the Straight Bill of lading.
          </p>
          <p>E. All bounced checks will be subjected to a $50.00 bounced fee.</p>
          <p>
            F. Credit card payments will be subjected to the greater of a $50 convenience fee or a
            five percent (5%) charge on each transaction.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pt-4">© 2026 item.com</div>

      {/* Pay Dialog */}
      <PayDialog
        isOpen={payDialogOpen}
        onClose={() => setPayDialogOpen(false)}
        initialInvoice={invoice}
      />
    </div>
  )
}

export default InvoiceDetail
