import { useState } from 'react'
import {
  Zap, Inbox, Bell, PlayCircle,
  FileText, DollarSign, CheckCircle2,
  ChevronDown, ChevronUp, Bot,
  ArrowRight,
} from 'lucide-react'
import type { WorkItem } from '../../../types/workItem'

type PipelineStatus = 'done' | 'active' | 'pending' | 'attention'

interface PipelineField {
  id: string
  labelCn: string
  labelEn: string
  icon: React.ReactNode
  value: string
  status: PipelineStatus
  detail: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

function statusStyle(s: PipelineStatus) {
  if (s === 'done') return { ring: 'ring-green-400 bg-green-50', icon: 'text-green-600', dot: 'bg-green-500', text: 'text-green-700' }
  if (s === 'active') return { ring: 'ring-primary-400 bg-primary-50', icon: 'text-primary-600', dot: 'bg-primary-500', text: 'text-primary-700' }
  if (s === 'attention') return { ring: 'ring-orange-400 bg-orange-50', icon: 'text-orange-600', dot: 'bg-orange-500', text: 'text-orange-700' }
  return { ring: 'ring-gray-200 bg-gray-50', icon: 'text-gray-400', dot: 'bg-gray-300', text: 'text-gray-500' }
}

function buildPipelineFields(
  item: WorkItem,
  onNotify: () => void,
  onEvidence: () => void,
  onClose: () => void,
): PipelineField[] {
  const statusMap: Record<string, 'done' | 'active' | 'pending' | 'attention'> = {
    Closed: 'done', Resolved: 'done', Approved: 'done',
    InProgress: 'active', PendingApproval: 'active',
    Open: 'pending', Rejected: 'attention', Cancelled: 'attention',
  }
  const execStatus = statusMap[item.status] ?? 'pending'
  const evidenceStatus: PipelineStatus = item.evidence.length > 0 ? 'done' : execStatus === 'done' ? 'attention' : 'pending'
  const notifyStatus: PipelineStatus = item.customerCode ? 'done' : 'pending'
  const feeStatus: PipelineStatus = !item.isChargeable ? 'done' : item.billingStatus === 'Paid' ? 'done' : item.billingStatus === 'Invoiced' ? 'active' : 'pending'
  const closeStatus: PipelineStatus = ['Closed', 'Cancelled'].includes(item.status) ? 'done' : 'pending'

  return [
    {
      id: 'trigger',
      labelCn: '触发来源',
      labelEn: 'Triggered By',
      icon: item.isAgentGenerated ? <Bot size={15} /> : <Zap size={15} />,
      value: item.isAgentGenerated ? `AI: ${item.agentName ?? 'Agent'}` : item.source,
      status: 'done',
      detail: (
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Source:</span> {item.source}</p>
          {item.isAgentGenerated && <p><span className="font-medium">AI Agent:</span> {item.agentName}</p>}
          <p><span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-xs text-gray-400 mt-1">The original trigger that created this work item.</p>
        </div>
      ),
    },
    {
      id: 'recipient',
      labelCn: '承接对象',
      labelEn: 'Assigned To',
      icon: <Inbox size={15} />,
      value: item.assignee || item.owner,
      status: item.assignee ? 'done' : 'attention',
      detail: (
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Owner:</span> {item.owner}</p>
          {item.assignee && <p><span className="font-medium">Assignee:</span> {item.assignee}</p>}
          {!item.assignee && <p className="text-orange-600 font-medium">⚠ Not yet assigned to an individual</p>}
          <p className="text-xs text-gray-400 mt-1">The team or person who has accepted ownership of this item.</p>
        </div>
      ),
    },
    {
      id: 'notification',
      labelCn: '消息通知',
      labelEn: 'Customer Notified',
      icon: <Bell size={15} />,
      value: notifyStatus === 'done' ? `${item.customerCode} ✓` : 'Pending',
      status: notifyStatus,
      detail: (
        <div className="space-y-1 text-sm text-gray-600">
          {item.customerCode
            ? <p className="text-green-600 font-medium">✓ Customer {item.customerCode} has been notified</p>
            : <p className="text-gray-500">No customer notification sent yet</p>}
          <p className="text-xs text-gray-400 mt-1">Via portal notification and email.</p>
        </div>
      ),
      actionLabel: 'Send Notification',
      onAction: onNotify,
    },
    {
      id: 'execution',
      labelCn: '执行/审批',
      labelEn: 'Action Status',
      icon: <PlayCircle size={15} />,
      value: item.status,
      status: execStatus,
      detail: (
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Current status:</span> <span className="font-semibold">{item.status}</span></p>
          <p><span className="font-medium">Priority:</span> {item.priority}</p>
          {item.slaDeadline && (
            <p><span className="font-medium">SLA Deadline:</span> {new Date(item.slaDeadline).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">The current execution or approval stage of this item.</p>
        </div>
      ),
    },
    {
      id: 'evidence',
      labelCn: '证据资料',
      labelEn: 'Evidence Docs',
      icon: <FileText size={15} />,
      value: item.evidence.length === 0 ? 'None uploaded' : `${item.evidence.length} document${item.evidence.length > 1 ? 's' : ''}`,
      status: evidenceStatus,
      detail: (
        <div className="space-y-2 text-sm text-gray-600">
          {item.evidence.length === 0
            ? <p className="text-gray-400">No supporting documents uploaded yet.</p>
            : item.evidence.map((e) => (
                <div key={e.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded px-2 py-1">
                  <FileText size={11} className="text-gray-400" />
                  <span className="font-medium">{e.label}</span>
                  <span className="text-gray-400 ml-auto">{e.type}</span>
                </div>
              ))
          }
          <p className="text-xs text-gray-400 mt-1">Supporting documents, photos, and records for this item.</p>
        </div>
      ),
      actionLabel: 'Upload Document',
      onAction: onEvidence,
    },
    {
      id: 'fee',
      labelCn: '费用',
      labelEn: 'Charges',
      icon: <DollarSign size={15} />,
      value: !item.isChargeable
        ? 'No charge'
        : item.estimatedFee != null
        ? `${item.currency} ${item.estimatedFee.toLocaleString()}`
        : 'Chargeable',
      status: feeStatus,
      detail: (
        <div className="space-y-1 text-sm text-gray-600">
          {!item.isChargeable
            ? <p className="text-gray-500">This item is not chargeable.</p>
            : <>
                {item.estimatedFee != null && <p><span className="font-medium">Estimated:</span> {item.currency} {item.estimatedFee.toLocaleString()}</p>}
                {item.actualFee != null && <p><span className="font-medium">Actual:</span> {item.currency} {item.actualFee.toLocaleString()}</p>}
                <p><span className="font-medium">Billing status:</span> <span className={item.billingStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}>{item.billingStatus}</span></p>
              </>
          }
          <p className="text-xs text-gray-400 mt-1">Charges associated with this item.</p>
        </div>
      ),
    },
    {
      id: 'close',
      labelCn: '关闭条件',
      labelEn: 'Close Status',
      icon: <CheckCircle2 size={15} />,
      value: ['Closed', 'Cancelled'].includes(item.status) ? 'Closed' : 'Pending',
      status: closeStatus,
      detail: (
        <div className="space-y-1 text-sm text-gray-600">
          {['Closed', 'Cancelled'].includes(item.status)
            ? <p className="text-green-600 font-medium">✓ This item is closed</p>
            : <>
                <p className="text-gray-500">Item is still open. Required before closure:</p>
                <ul className="ml-3 space-y-0.5 text-xs list-disc text-gray-500">
                  <li>Resolution confirmed by responsible party</li>
                  {item.isChargeable && <li>Invoice issued and acknowledged</li>}
                  <li>Customer acknowledgement received</li>
                </ul>
              </>
          }
        </div>
      ),
      actionLabel: !['Closed', 'Cancelled'].includes(item.status) ? 'Close This Item' : undefined,
      onAction: !['Closed', 'Cancelled'].includes(item.status) ? onClose : undefined,
    },
  ]
}

interface Props {
  item: WorkItem
  onNotify: () => void
  onEvidence: () => void
  onClose: () => void
}

export default function ItemPipelineStrip({ item, onNotify, onEvidence, onClose }: Props) {
  const [expandedField, setExpandedField] = useState<string | null>(null)
  const fields = buildPipelineFields(item, onNotify, onEvidence, onClose)

  const doneCount = fields.filter((f) => f.status === 'done').length

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Item Lifecycle</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">
            7-Stage Processing Pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800">{doneCount}/7</span> stages complete
        </div>
      </div>

      {/* Pipeline stages — horizontal scroll */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {fields.map((field, idx) => {
            const style = statusStyle(field.status)
            const isExpanded = expandedField === field.id

            return (
              <div key={field.id} className="flex items-stretch">
                {/* Stage cell */}
                <button
                  onClick={() => setExpandedField(isExpanded ? null : field.id)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-3 min-w-[88px] border-b-2 transition-all hover:bg-gray-50 ${
                    isExpanded ? 'bg-primary-50 border-b-primary-400' : 'border-b-transparent'
                  }`}
                >
                  {/* Status dot + icon */}
                  <div className={`relative w-9 h-9 rounded-full ring-2 ${style.ring} flex items-center justify-center`}>
                    <span className={style.icon}>{field.icon}</span>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${style.dot}`} />
                  </div>
                  {/* Labels */}
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-700 leading-none">{field.labelCn}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{field.labelEn}</p>
                  </div>
                  {/* Value */}
                  <p className={`text-[10px] font-semibold text-center leading-tight ${style.text}`}>
                    {field.value.length > 14 ? field.value.slice(0, 13) + '…' : field.value}
                  </p>
                  {/* Expand indicator */}
                  <span className="text-gray-300">
                    {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </span>
                </button>

                {/* Connector arrow (not on last) */}
                {idx < fields.length - 1 && (
                  <div className="flex items-center self-center px-1">
                    <ArrowRight size={12} className="text-gray-300" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Expanded field detail */}
      {expandedField && (() => {
        const f = fields.find((x) => x.id === expandedField)!
        const style = statusStyle(f.status)
        return (
          <div className={`border-t border-gray-100 px-5 py-4 ${f.status === 'active' ? 'bg-primary-50/40' : 'bg-gray-50'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ring-1 ${style.ring}`}>
                  <span className={style.icon}>{f.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{f.labelCn} <span className="text-gray-400 font-normal text-xs">/ {f.labelEn}</span></p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    f.status === 'done' ? 'bg-green-100 text-green-700' :
                    f.status === 'active' ? 'bg-primary-100 text-primary-700' :
                    f.status === 'attention' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {f.status === 'done' ? '✓ Complete' : f.status === 'active' ? '● Active' : f.status === 'attention' ? '⚠ Attention' : '○ Pending'}
                  </span>
                </div>
              </div>
              {f.actionLabel && f.onAction && (
                <button
                  onClick={f.onAction}
                  className="shrink-0 text-xs font-medium px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {f.actionLabel}
                </button>
              )}
            </div>
            <div className="pl-0">{f.detail}</div>
          </div>
        )
      })()}
    </div>
  )
}
