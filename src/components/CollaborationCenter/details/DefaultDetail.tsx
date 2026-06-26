import { useState } from 'react'
import {
  Bot,
  User,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  MessageSquare,
  FileText,
  DollarSign,
  AlertTriangle,
} from 'lucide-react'
import type { WorkItem, WorkItemStatus, WorkItemEvidence } from '../../../types/workItem'
import {
  DRIVER_LABELS,
  DRIVER_COLORS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  TYPE_COLORS,
} from '../../../types/workItem'
import { useCollaboration } from '../../../context/CollaborationContext'
import ItemPipelineStrip from '../components/ItemPipelineStrip'
import EvidencePanel from '../components/EvidencePanel'
import ClosureModal from '../components/ClosureModal'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  item: WorkItem
  onClose: () => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Quick actions map ────────────────────────────────────────────────────────

const QUICK_ACTIONS: Record<WorkItemStatus, { label: string; next: WorkItemStatus; color: string }[]> = {
  Open: [
    { label: 'Start Work', next: 'InProgress', color: 'bg-blue-600 text-white hover:bg-blue-700' },
    { label: 'Cancel', next: 'Cancelled', color: 'bg-gray-200 text-gray-700 hover:bg-gray-300' },
  ],
  InProgress: [
    { label: 'Send for Approval', next: 'PendingApproval', color: 'bg-yellow-600 text-white hover:bg-yellow-700' },
    { label: 'Resolve', next: 'Resolved', color: 'bg-green-600 text-white hover:bg-green-700' },
  ],
  PendingApproval: [
    { label: 'Approve', next: 'Approved', color: 'bg-green-600 text-white hover:bg-green-700' },
    { label: 'Reject', next: 'Rejected', color: 'bg-red-600 text-white hover:bg-red-700' },
    { label: 'Back to In Progress', next: 'InProgress', color: 'bg-gray-200 text-gray-700 hover:bg-gray-300' },
  ],
  Approved: [
    { label: 'Close', next: 'Closed', color: 'bg-gray-600 text-white hover:bg-gray-700' },
  ],
  Rejected: [
    { label: 'Reopen', next: 'Open', color: 'bg-blue-600 text-white hover:bg-blue-700' },
    { label: 'Cancel', next: 'Cancelled', color: 'bg-gray-200 text-gray-700 hover:bg-gray-300' },
  ],
  Resolved: [
    { label: 'Close', next: 'Closed', color: 'bg-gray-600 text-white hover:bg-gray-700' },
  ],
  Closed: [],
  Cancelled: [
    { label: 'Reopen', next: 'Open', color: 'bg-blue-600 text-white hover:bg-blue-700' },
  ],
}

// ─── Sidebar detail row ───────────────────────────────────────────────────────

function DetailRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-800">{value}</div>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DefaultDetail({ item }: Props) {
  const { updateStatus, addComment, addEvidence } = useCollaboration()

  const [commentText, setCommentText] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [showClosureModal, setShowClosureModal] = useState(false)

  const quickActions = QUICK_ACTIONS[item.status] ?? []
  const slaBreached = item.slaDeadline && new Date(item.slaDeadline).getTime() < Date.now()
  const slaRisk =
    !slaBreached &&
    item.slaDeadline &&
    new Date(item.slaDeadline).getTime() - Date.now() < 4 * 60 * 60 * 1000

  const submitComment = () => {
    if (!commentText.trim()) return
    addComment(item.id, {
      author: 'Current User',
      role: 'Warehouse',
      content: commentText,
      createdAt: new Date().toISOString(),
      isInternal,
    })
    setCommentText('')
  }

  const handleEvidence = (evidence: Omit<WorkItemEvidence, 'id'>) => {
    addEvidence(item.id, evidence)
  }

  const handleClosure = (status: WorkItemStatus, note: string) => {
    updateStatus(item.id, status, note)
    setShowClosureModal(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Pipeline strip */}
      <div className="mb-5">
        <ItemPipelineStrip
          item={item}
          onNotify={() => {}}
          onEvidence={() => {}}
          onClose={() => setShowClosureModal(true)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="xl:col-span-2 space-y-5">

          {/* Header block */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${TYPE_COLORS[item.type]}`}>
                {item.type}
              </span>
              {item.isAgentGenerated && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-medium border border-violet-200">
                  <Bot size={11} />
                  AI · {item.agentName ?? 'Agent'}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DRIVER_COLORS[item.driver]}`}>
                {DRIVER_LABELS[item.driver]}
              </span>
              <span className={`text-xs font-bold ${PRIORITY_COLORS[item.priority]}`}>
                ● {item.priority}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
                {item.status}
              </span>
              <span className="ml-auto text-xs text-gray-400 font-mono">{item.id}</span>
            </div>

            <h1 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>

            {/* SLA */}
            {item.slaDeadline && (
              <div
                className={`flex items-center gap-2 mt-4 text-sm font-medium ${
                  slaBreached ? 'text-red-600' : slaRisk ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                {(slaBreached || slaRisk) && <AlertTriangle size={14} />}
                <Clock size={14} />
                SLA: {formatDate(item.slaDeadline)}
                {slaBreached && <span className="text-red-600 font-semibold">— BREACHED</span>}
                {slaRisk && <span className="text-orange-500 font-semibold">— AT RISK</span>}
              </div>
            )}

            {/* Quick actions */}
            {quickActions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
                {quickActions.map((action) => (
                  <button
                    key={action.next}
                    onClick={() => {
                      if (action.next === 'Closed') {
                        setShowClosureModal(true)
                      } else {
                        updateStatus(item.id, action.next)
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${action.color}`}
                  >
                    {action.next === 'Approved' && <CheckCircle size={14} />}
                    {action.next === 'Rejected' && <XCircle size={14} />}
                    {action.next === 'Resolved' && <CheckCircle size={14} />}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Evidence panel */}
          <EvidencePanel item={item} onUpload={handleEvidence} />

          {/* Comments */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MessageSquare size={15} />
              Comments ({item.comments.length})
            </h3>

            <div className="space-y-4 mb-5">
              {item.comments.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
              )}
              {item.comments.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg p-3 ${
                    c.isInternal
                      ? 'bg-yellow-50 border border-yellow-100'
                      : c.role === 'Agent'
                      ? 'bg-violet-50 border border-violet-100'
                      : c.role === 'Customer'
                      ? 'bg-blue-50 border border-blue-100'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {c.role === 'Agent' ? (
                      <Bot size={13} className="text-violet-600" />
                    ) : (
                      <User size={13} className="text-gray-500" />
                    )}
                    <span className="text-xs font-medium text-gray-700">{c.author}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                    {c.isInternal && (
                      <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                        Internal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                rows={3}
                className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded"
                  />
                  Internal note (not visible to customer)
                </label>
                <button
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-md hover:bg-primary-700 disabled:opacity-40"
                >
                  <Send size={12} />
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Activity Log</h3>
            <div className="space-y-3">
              {[...item.activityLog].reverse().map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-800">{log.action}</span>
                    {log.fromStatus && log.toStatus && (
                      <span className="text-xs text-gray-400 ml-2">
                        {log.fromStatus} → {log.toStatus}
                      </span>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">
                      {log.actor} · {formatDate(log.timestamp)}
                    </div>
                    {log.note && (
                      <p className="text-xs text-gray-500 italic mt-0.5">"{log.note}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick action shortcuts */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const el = document.getElementById('evidence-section')
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileText size={14} className="text-blue-600" />
                Upload Evidence ({item.evidence.length})
              </button>
              {!['Closed', 'Cancelled'].includes(item.status) && (
                <button
                  onClick={() => setShowClosureModal(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle size={14} className="text-green-600" />
                  Close This Item
                </button>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Details
            </h3>
            <div className="space-y-3">
              <DetailRow label="Owner" value={item.owner} icon={<User size={13} />} />
              {item.assignee && (
                <DetailRow label="Assignee" value={item.assignee} icon={<User size={13} />} />
              )}
              {item.customerCode && (
                <DetailRow label="Customer" value={item.customerCode} icon={<Tag size={13} />} />
              )}
              {item.warehouseCode && (
                <DetailRow label="Warehouse" value={item.warehouseCode} icon={<Tag size={13} />} />
              )}
              {item.relatedObjectId && (
                <DetailRow
                  label={item.relatedObjectType ?? 'Related'}
                  value={item.relatedObjectId}
                  icon={<Tag size={13} />}
                />
              )}
              <DetailRow
                label="Created"
                value={new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                icon={<Clock size={13} />}
              />
            </div>
          </div>

          {/* Billing */}
          {item.isChargeable && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <DollarSign size={13} />
                Billing
              </h3>
              <div className="space-y-2 text-sm">
                {item.estimatedFee != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated</span>
                    <span className="font-semibold text-gray-900">
                      {item.currency} {item.estimatedFee.toLocaleString()}
                    </span>
                  </div>
                )}
                {item.actualFee != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual</span>
                    <span className="font-semibold text-gray-900">
                      {item.currency} {item.actualFee.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-green-200">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-green-700">{item.billingStatus}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Closure modal */}
      {showClosureModal && (
        <ClosureModal
          item={item}
          onConfirm={handleClosure}
          onClose={() => setShowClosureModal(false)}
        />
      )}
    </div>
  )
}
