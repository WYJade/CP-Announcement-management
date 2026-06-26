import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, DollarSign, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { invoices, getInvoiceSummaryStats } from '../../data/invoices'
import PayDialog from './PayDialog'
import type { Invoice } from '../../data/invoices'
import { useI18n } from '../../context/I18nContext'

function InvoiceList() {
  const navigate = useNavigate()
  const stats = getInvoiceSummaryStats()
  const { t } = useI18n()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [payingInvoice, setPayingInvoice] = useState<Invoice | undefined>(undefined)

  const handlePayClick = (invoice: Invoice) => {
    setPayingInvoice(invoice)
    setPayDialogOpen(true)
  }

  const handlePayInvoices = () => {
    setPayingInvoice(undefined)
    setPayDialogOpen(true)
  }

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">{t('invoice.title')}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label={t('invoice.paid')} value={String(stats.paid)} />
        <SummaryCard label={t('invoice.deposit')} value={`$${stats.deposit.toFixed(2)}`} />
        <SummaryCard label={t('invoice.outstandingBalance')} value={`$${stats.outstanding.toFixed(2)}`} />
        <SummaryCard
          label={t('invoice.pastDueBalance')}
          value={`$${stats.pastDue.toFixed(2)}`}
          valueColor="text-red-600"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search here"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 w-44"
            />
          </div>
          <FilterDropdown label="UNIS Fulfillment" />
          <FilterDropdown label="SUNPOWER NI-SUNPOW0003" />
          <FilterDropdown label="Fontana" />
          <FilterDropdown label="SUNPOWER NI" />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <FilterDropdown label="ALL" />
          <button className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Customize Fields
            <ChevronDown size={12} />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              Reset
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1">
              <Search size={12} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900">
          <Download size={14} />
          Download Invoices
        </button>
        <button
          onClick={handlePayInvoices}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          <DollarSign size={14} />
          Pay Invoices
        </button>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar size={14} />
          Start Date - End Date
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-10 py-3 px-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">Invoice#</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">Customer</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">Pro #</th>
              <th className="text-left py-3 px-3 font-medium text-gray-600">Invoice date</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600">Total Amount</th>
              <th className="text-right py-3 px-3 font-medium text-gray-600">Balance</th>
              <th className="text-center py-3 px-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(inv.id)}
                    onChange={() => toggleRow(inv.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="py-3 px-3 text-gray-800">{inv.invoiceNumber}</td>
                <td className="py-3 px-3">
                  <span className="text-red-600 font-medium text-xs">
                    {inv.status === 'PAST_DUE' ? 'PAST DUE' : inv.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-700">{inv.customer}</td>
                <td className="py-3 px-3 text-gray-700">{inv.proNumber}</td>
                <td className="py-3 px-3 text-gray-700">{inv.invoiceDate}</td>
                <td className="py-3 px-3 text-right text-gray-700">
                  $ {inv.totalAmount.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right text-gray-700">
                  $ {inv.balance.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePayClick(inv)}
                      className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => navigate(`/finance/invoice/${inv.invoiceNumber}`)}
                      className="px-2 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      Invoice Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>{selectedRows.size} of {invoices.length} row(s) selected.</span>
          <div className="flex items-center gap-3">
            <span>Rows per page</span>
            <select className="border border-gray-200 rounded px-1 py-0.5 text-xs">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span>Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <button className="p-0.5 hover:bg-gray-100 rounded">«</button>
              <button className="p-0.5 hover:bg-gray-100 rounded">
                <ChevronLeft size={12} />
              </button>
              <button className="p-0.5 hover:bg-gray-100 rounded">
                <ChevronRight size={12} />
              </button>
              <button className="p-0.5 hover:bg-gray-100 rounded">»</button>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Dialog */}
      <PayDialog
        isOpen={payDialogOpen}
        onClose={() => setPayDialogOpen(false)}
        initialInvoice={payingInvoice}
      />
    </div>
  )
}

function SummaryCard({
  label,
  value,
  valueColor = 'text-gray-900',
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
      <span className="truncate max-w-[140px]">{label}</span>
      <ChevronDown size={12} />
    </button>
  )
}

export default InvoiceList
