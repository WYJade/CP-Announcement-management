import { useState } from 'react'
import { CheckCircle, XCircle, Clock, DollarSign, Bot, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCollaboration } from '../../context/CollaborationContext'
import type { WorkItemStatus } from '../../types/workItem'
import { STATUS_COLORS, DRIVER_LABELS, DRIVER_COLORS } from '../../types/workItem'
import ScenarioIntro from './components/ScenarioIntro'

export default function ApprovalsView() {
  const { items, updateStatus } = useCollaboration()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: WorkItemStatus } | null>(null)
  const [note, setNote] = useState('')

  const approvalItems = items.filter((i) => i.type === 'Approval')
  const pendingItems = approvalItems.filter((i) => i.status === 'PendingApproval' || i.status === 'Open')
  const displayItems = activeTab === 'pending' ? pendingItems : approvalItems

  const executeAction = () => {
    if (!confirmAction) return
    updateStatus(confirmAction.id, confirmAction.action, note)
    setConfirmAction(null)
    setNote('')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">
          Items requiring warehouse or customer decision. Approve, reject, or request more info.
        </p>
      </div>

      {/* Scenario intro */}
      <ScenarioIntro driver="ApprovalDriven" showMiniFlow />

      {/* Summary chips */}
      <div className="flex gap-3 mb-6">
        <StatChip label="Pending Decision" value={pendingItems.length} color="bg-amber-50 text-amber-700 border-amber-200" />
        <StatChip
          label="Chargeable"
          value={approvalItems.filter((i) => i.isChargeable).length}
          color="bg-green-50 text-green-700 border-green-200"
        />
        <StatChip
          label="AI-Generated"
          value={approvalItems.filter((i) => i.isAgentGenerated).length}
          color="bg-violet-50 text-violet-700 border-violet-200"
        />
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {[
          { key: 'pending', label: `Pending (${pendingItems.length})` },
          { key: 'all', label: `All Approvals (${approvalItems.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'pending' | 'all')}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div className="space-y-4">
        {displayItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <CheckCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No approval items</p>
          </div>
        )}

        {displayItems.map((item) => {
          const slaBreached = item.slaDeadline && new Date(item.slaDeadline).getTime() < Date.now()
          const slaRisk = !slaBreached && item.slaDeadline &&
            new Date(item.slaDeadline).getTime() - Date.now() < 4 * 60 * 60 * 1000

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl overflow-hidden ${
                slaBreached ? 'border-red-300' : slaRisk ? 'border-orange-200' : 'border-gray-200'
              }`}
            >
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-mono">{item.id}</span>
                    {item.isAgentGenerated && (
                      <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-violet-100 text-violet-700">
                        <Bot size={11} /> AI
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DRIVER_COLORS[item.driver]}`}>
                      {DRIVER_LABELS[item.driver]}
                    </span>
                  </div>

                  {/* SLA badge */}
                  {item.slaDeadline && (
                    <span className={`shrink-0 flex items-center gap-1 text-xs font-medium ${
                      slaBreached ? 'text-red-600' : slaRisk ? 'text-orange-500' : 'text-gray-400'
                    }`}>
                      {(slaBreached || slaRisk) && <AlertTriangle size={12} />}
                      <Clock size={11} />
                      {new Date(item.slaDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <h3
                  className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-primary-700 mb-1"
                  onClick={() => navigate(`/collaboration/item/${item.id}`)}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>

                {/* Billing info */}
                {item.isChargeable && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-green-700 mb-3">
                    <DollarSign size={14} />
                    {item.currency} {item.estimatedFee?.toLocaleString()} — {item.billingStatus}
                  </div>
                )}

                {/* Related object */}
                {item.relatedObjectId && (
                  <div className="text-xs text-gray-400 mb-3">
                    {item.relatedObjectType}: <span className="font-medium text-gray-600">{item.relatedObjectId}</span>
                    {item.customerCode && <span className="ml-3">Customer: <span className="font-medium text-gray-600">{item.customerCode}</span></span>}
                  </div>
                )}

                {/* Action row */}
                {(item.status === 'PendingApproval' || item.status === 'Open') && (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setConfirmAction({ id: item.id, action: 'Approved' })}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => setConfirmAction({ id: item.id, action: 'Rejected' })}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                    <button
                      onClick={() => navigate(`/collaboration/item/${item.id}`)}
                      className="ml-auto text-sm text-primary-600 hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Confirm {confirmAction.action}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action will mark the item as <strong>{confirmAction.action}</strong>. You can add an optional note.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note (reason, conditions)…"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setConfirmAction(null); setNote('') }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 text-sm text-white rounded-lg font-medium ${
                  confirmAction.action === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {confirmAction.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${color}`}>
      <span className="font-bold">{value}</span> {label}
    </div>
  )
}
