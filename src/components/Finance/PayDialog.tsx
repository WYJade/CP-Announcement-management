import { useState } from 'react'
import { X, FileText, ChevronDown, Plus, CreditCard } from 'lucide-react'
import type { Invoice, PaymentMethod } from '../../data/invoices'
import { invoices as allInvoices, paymentMethods as defaultMethods } from '../../data/invoices'

interface PayDialogProps {
  isOpen: boolean
  onClose: () => void
  initialInvoice?: Invoice
}

interface CardFormData {
  nameOnCard: string
  cardNumber: string
  expMonth: string
  expYear: string
  securityCode: string
  streetAddress: string
}

function PayDialog({ isOpen, onClose, initialInvoice }: PayDialogProps) {
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>(
    initialInvoice ? [initialInvoice] : []
  )
  const [paymentMethods] = useState<PaymentMethod[]>(defaultMethods)
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [showMethodDropdown, setShowMethodDropdown] = useState(false)
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false)
  const [showConfirmRemove, setShowConfirmRemove] = useState<string | null>(null)
  const [showEditCard, setShowEditCard] = useState<PaymentMethod | null>(null)
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardForm, setCardForm] = useState<CardFormData>({
    nameOnCard: 'tt',
    cardNumber: '4111111111111111',
    expMonth: '',
    expYear: '',
    securityCode: '999',
    streetAddress: '323',
  })

  if (!isOpen) return null

  const subtotal = selectedInvoices.reduce((sum, inv) => sum + inv.balance, 0)
  const processingFee = subtotal * 0.05
  const totalDue = subtotal + processingFee

  const availableInvoices = allInvoices.filter(
    (inv) => !selectedInvoices.some((s) => s.id === inv.id) && inv.status === 'PAST_DUE'
  )

  const activeInvoice = selectedInvoices.length > 0 ? selectedInvoices[0] : null

  const handleAddInvoice = (inv: Invoice) => {
    setSelectedInvoices((prev) => [...prev, inv])
    setShowInvoiceDropdown(false)
  }

  const handleRemoveInvoice = (id: string) => {
    setShowConfirmRemove(id)
  }

  const confirmRemove = () => {
    if (showConfirmRemove) {
      setSelectedInvoices((prev) => prev.filter((inv) => inv.id !== showConfirmRemove))
      setShowConfirmRemove(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[720px] max-h-[85vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pay for Selected Invoices</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Payment Options & Method */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Payment Options</h3>

            {/* Selected Invoices */}
            <div className="space-y-2">
              {selectedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between border-2 border-purple-200 bg-purple-50 rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{inv.invoiceNumber}</span>
                    <div className="text-xs text-gray-500">
                      {inv.billTo?.name} &nbsp; Pro#: {inv.proNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-700">
                      ${inv.balance.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveInvoice(inv.id)}
                      className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X size={12} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Invoice Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowInvoiceDropdown(!showInvoiceDropdown)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:border-gray-300 transition-colors"
              >
                Add Invoice
                <ChevronDown size={14} />
              </button>
              {showInvoiceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {availableInvoices.map((inv) => (
                    <button
                      key={inv.id}
                      onClick={() => handleAddInvoice(inv)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-50 ${
                        selectedInvoices.some((s) => s.id === inv.id)
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {inv.invoiceNumber} – {inv.customer} – ${inv.balance.toFixed(2)}
                      {selectedInvoices.some((s) => s.id === inv.id) && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                  ))}
                  {availableInvoices.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">No more invoices</div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Payment Method</h3>
              <p className="text-xs text-gray-500 mb-2">Choose Payment Method</p>
              <div className="relative">
                <button
                  onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:border-purple-300 transition-colors"
                >
                  {selectedMethod
                    ? paymentMethods.find((m) => m.id === selectedMethod)
                      ? `${paymentMethods.find((m) => m.id === selectedMethod)!.type.toUpperCase()} ****${paymentMethods.find((m) => m.id === selectedMethod)!.lastFour}`
                      : 'Select'
                    : 'Select'}
                  <ChevronDown size={14} />
                </button>
                {showMethodDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                      >
                        <button
                          onClick={() => {
                            setSelectedMethod(method.id)
                            setShowMethodDropdown(false)
                          }}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <CreditCard size={14} className={method.type === 'visa' ? 'text-blue-600' : 'text-red-500'} />
                          <span>
                            {method.type === 'visa' ? 'VISA' : 'MC'} {method.type === 'visa' ? '4111' : '2131'}********{method.lastFour}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setShowEditCard(method)
                            setShowMethodDropdown(false)
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Card */}
              <button
                onClick={() => setShowAddCard(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
                <Plus size={14} />
                Add New Card
              </button>
            </div>
          </div>

          {/* Right: Invoice Detail & Summary */}
          <div className="space-y-4">
            {/* Active Invoice Detail Card */}
            {activeInvoice && (
              <div className="bg-gray-800 text-white rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-purple-300" />
                    <span className="text-sm font-semibold">{activeInvoice.invoiceNumber}</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">
                    ${activeInvoice.balance.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Pro#:</span>
                    <span className="font-medium text-white">{activeInvoice.proNumber || 'NaN'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due:</span>
                    <span className="font-medium text-white">{activeInvoice.dueDate || 'Invalid Date'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-white bg-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                      {activeInvoice.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-300">
                  {activeInvoice.billTo?.name}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-800 text-white rounded-lg p-4">
              <h4 className="text-sm font-bold mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Processing Fee (5%)</span>
                  <span className="text-white">${processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-600">
                  <span>Total Amount Due</span>
                  <span className="text-green-400">${totalDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M12 6v6l4 2" />
            </svg>
            Confirm Payment
          </button>
        </div>
      </div>

      {/* Confirm Remove Dialog */}
      {showConfirmRemove && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowConfirmRemove(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Confirm Remove</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to remove this invoice?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmRemove(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Dialog */}
      {showEditCard && (
        <CardFormDialog
          title="Edit payment method"
          initialData={{
            nameOnCard: showEditCard.nameOnCard,
            cardNumber: showEditCard.cardNumber,
            expMonth: showEditCard.expMonth,
            expYear: showEditCard.expYear,
            securityCode: showEditCard.securityCode,
            streetAddress: showEditCard.streetAddress,
          }}
          onClose={() => setShowEditCard(null)}
          onSubmit={() => setShowEditCard(null)}
          submitLabel="Update"
          showDelete
          onDelete={() => setShowEditCard(null)}
        />
      )}

      {/* Add New Card Dialog */}
      {showAddCard && (
        <CardFormDialog
          title="Add new payment method"
          initialData={cardForm}
          onClose={() => setShowAddCard(false)}
          onSubmit={(data) => {
            setCardForm(data)
            setShowAddCard(false)
          }}
          submitLabel="Confirm"
        />
      )}
    </div>
  )
}

/** Shared card form dialog for edit/add */
function CardFormDialog({
  title,
  initialData,
  onClose,
  onSubmit,
  submitLabel,
  showDelete,
  onDelete,
}: {
  title: string
  initialData: CardFormData
  onClose: () => void
  onSubmit: (data: CardFormData) => void
  submitLabel: string
  showDelete?: boolean
  onDelete?: () => void
}) {
  const [form, setForm] = useState<CardFormData>(initialData)

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Name on card</label>
            <input
              type="text"
              value={form.nameOnCard}
              onChange={(e) => setForm({ ...form, nameOnCard: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Card number</label>
            <input
              type="text"
              value={form.cardNumber}
              onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Exp. date</label>
              <select
                value={form.expMonth}
                onChange={(e) => setForm({ ...form, expMonth: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">&nbsp;</label>
              <select
                value={form.expYear}
                onChange={(e) => setForm({ ...form, expYear: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={String(25 + i)}>
                    {25 + i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Security code</label>
              <input
                type="text"
                value={form.securityCode}
                onChange={(e) => setForm({ ...form, securityCode: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium mb-1 block">Billing Address</label>
            <label className="text-xs text-gray-500 mb-1 block">Street Address</label>
            <input
              type="text"
              value={form.streetAddress}
              onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          <button className="text-xs text-purple-600 hover:text-purple-700">
            + Apt, Unit, Suite, etc(Optional)*
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          {showDelete ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {submitLabel}
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmit(form)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                {submitLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PayDialog
