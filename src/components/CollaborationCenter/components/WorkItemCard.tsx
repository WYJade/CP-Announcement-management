import { Bot, Circle } from 'lucide-react'
import type { WorkItem } from '../../../types/workItem'
import {
  DRIVER_LABELS,
  DRIVER_COLORS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from '../../../types/workItem'
import { useI18n } from '../../../context/I18nContext'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true when slaDeadline is present and within the next 4 hours */
function isSlaAtRisk(item: WorkItem): boolean {
  if (!item.slaDeadline) return false
  const remaining = new Date(item.slaDeadline).getTime() - Date.now()
  return remaining > 0 && remaining < 4 * 60 * 60 * 1000
}

/** Format ISO timestamp as a short locale date string */
function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

// Map driver to a left-border accent color (Tailwind border-* class)
const DRIVER_ACCENT: Record<WorkItem['driver'], string> = {
  IssueDriven: 'border-red-500',
  RequestDriven: 'border-blue-500',
  ApprovalDriven: 'border-amber-500',
  EventDriven: 'border-purple-500',
  PlanningDriven: 'border-green-500',
  CollaborationDriven: 'border-indigo-500',
}

// ─── Status label map (Chinese) ───────────────────────────────────────────────
const STATUS_LABELS: Record<WorkItem['status'], string> = {
  Open: '待处理',
  InProgress: '处理中',
  PendingApproval: '待审批',
  Approved: '已批准',
  Rejected: '已拒绝',
  Resolved: '已解决',
  Closed: '已关闭',
  Cancelled: '已取消',
}

// Priority dot fill color
const PRIORITY_DOT: Record<WorkItem['priority'], string> = {
  Low: 'fill-gray-400',
  Medium: 'fill-blue-500',
  High: 'fill-orange-500',
  Critical: 'fill-red-600',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface WorkItemCardProps {
  item: WorkItem
  onClick: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WorkItemCard({ item, onClick }: WorkItemCardProps) {
  const slaRisk = isSlaAtRisk(item)
  const isPendingApproval = item.status === 'PendingApproval'
  const accentBorder = DRIVER_ACCENT[item.driver]
  const { tt } = useI18n()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={[
        // base layout
        'relative bg-white rounded-xl border border-gray-200 overflow-hidden',
        // left accent border — 4 px, driven by driver color
        'border-l-4',
        accentBorder,
        // hover
        'cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-150',
        // focus ring for keyboard
        'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1',
      ].join(' ')}
    >
      {/* ── Card body ─────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-2">

        {/* ── Row 1: driver badge + status badge + priority dot + urgent/sla badges ── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Driver badge */}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DRIVER_COLORS[item.driver]}`}
          >
            {DRIVER_LABELS[item.driver]}
          </span>

          {/* Status badge */}
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}
          >
            {STATUS_LABELS[item.status]}
          </span>

          {/* Priority dot */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${PRIORITY_COLORS[item.priority]}`}
            title={item.priority}
          >
            <Circle
              size={8}
              className={PRIORITY_DOT[item.priority]}
            />
          </span>

          {/* Urgent badge */}
          {item.isPriority && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              紧急
            </span>
          )}

          {/* SLA risk badge */}
          {slaRisk && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              SLA 风险
            </span>
          )}

          {/* Pending approval pulsing indicator */}
          {isPendingApproval && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              需要您决策
            </span>
          )}
        </div>

        {/* ── Row 2: Title ───────────────────────────────────────────── */}
        <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2 text-sm">
          {tt(item.title)}
        </h3>

        {/* ── Row 3: Description ─────────────────────────────────────── */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {tt(item.description)}
        </p>

        {/* ── Agent tag ──────────────────────────────────────────────── */}
        {item.isAgentGenerated && (
          <div className="inline-flex items-center gap-1 text-xs text-violet-600 font-medium self-start px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200">
            <Bot size={11} />
            <span>{item.agentName ?? 'AI Agent'}</span>
          </div>
        )}

        {/* ── Footer row ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Left: relatedObjectId chip + createdAt */}
          <div className="flex items-center gap-2 min-w-0">
            {item.relatedObjectId && (
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 font-mono truncate max-w-[120px]">
                {item.relatedObjectId}
              </span>
            )}
            <span className="text-xs text-gray-400 shrink-0">
              {formatDate(item.createdAt)}
            </span>
          </div>

          {/* Right: 查看详情 → */}
          <span className="shrink-0 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline whitespace-nowrap">
            查看详情 →
          </span>
        </div>
      </div>
    </div>
  )
}

export default WorkItemCard
