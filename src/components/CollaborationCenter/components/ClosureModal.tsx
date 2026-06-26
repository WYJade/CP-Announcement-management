import { useState } from 'react'
import { X, CheckCircle2, AlertTriangle, DollarSign } from 'lucide-react'
import type { WorkItem, WorkItemStatus } from '../../../types/workItem'

interface Props {
  item: WorkItem
  onConfirm: (status: WorkItemStatus, note: string) => void
  onClose: () => void
}

const CLOSURE_REASONS = [
  'Issue fully resolved and confirmed by all parties',
  'Service request completed and customer signed off',
  'Approval processed and invoice issued',
  'External event cleared — normal operations resumed',
  'Project completed — all deliverables accepted',
  'No further action required — customer request withdrawn',
  'Cancelled per customer request',
]

export default function ClosureModal({ item, onConfirm, onClose }: Props) {
  const [reason, setReason] = useState(CLOSURE_REASONS[0])
  const [customReason, setCustomReason] = useState('')
  const [billingConfirmed, setBillingConfirmed] = useState(!item.isChargeable)
  const [customerConfirmed, setCustomerConfirmed] = useState(false)
  const [resolutionConfirmed, setResolutionConfirmed] = useState(false)

  const canClose = billingConfirmed && customerConfirmed && resolutionConfirmed

  const handleClose = () => {
    onConfirm('Closed', customReason.trim() || reason)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <h2 className="text-base font-semibold text-gray-900">Close Work Item</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Item summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-medium">{item.id} · {item.type}</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.title}</p>
          </div>

          {/* Closure checklist */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Closure Checklist</p>
            <div className="space-y-3">
              <ChecklistItem
                checked={resolutionConfirmed}
                onChange={setResolutionConfirmed}
                label="Resolution confirmed"
                description="The underlying issue, request, or task has been fully addressed"
              />
              <ChecklistItem
                checked={customerConfirmed}
                onChange={setCustomerConfirmed}
                label="Customer has acknowledged"
                description="The customer has been notified and has confirmed acceptance"
              />
              {item.isChargeable && (
                <ChecklistItem
                  checked={billingConfirmed}
                  onChange={setBillingConfirmed}
                  label={`Billing confirmed (${item.currency} ${item.estimatedFee?.toLocaleString() ?? 'TBD'})`}
                  description="Invoice has been issued or charge has been waived"
                  icon={<DollarSign size={13} className="text-green-600" />}
                />
              )}
            </div>
          </div>

          {/* Closure reason */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Closure Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
            >
              {CLOSURE_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Additional Notes (optional)</label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Any final notes for the record…"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>

          {!canClose && (
            <div className="flex items-start gap-2 text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-2.5">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              Please complete all checklist items before closing.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleClose}
            disabled={!canClose}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={14} />
            Close Item
          </button>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({
  checked, onChange, label, description, icon,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
  icon?: React.ReactNode
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-green-400'
      }`}>
        {checked && <CheckCircle2 size={12} className="text-white" />}
        {!checked && <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      </div>
      <div onClick={() => onChange(!checked)}>
        <div className="flex items-center gap-1.5">
          {icon}
          <p className={`text-sm font-medium ${checked ? 'text-green-700 line-through' : 'text-gray-800'}`}>{label}</p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </label>
  )
}
