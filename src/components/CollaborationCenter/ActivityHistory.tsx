import { useState, useMemo } from 'react'
import { Clock, Bot, User, Settings, Building2, ChevronRight, CheckCircle2, AlertCircle, Circle } from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'
import { TYPE_COLORS, STATUS_COLORS } from '../../types/workItem'
import type { WorkItemActivity, WorkItemType, WorkItemStatus } from '../../types/workItem'
import { useNavigate } from 'react-router-dom'

interface ActivityEntry extends WorkItemActivity {
  itemId: string
  itemTitle: string
  itemType: WorkItemType
  itemStatus: WorkItemStatus
  isAgentGenerated: boolean
}

type TabKey = 'all' | 'pending' | 'done'

const TABS: { key: TabKey; label: string; color: string }[] = [
  { key: 'all',     label: '全部',   color: 'border-gray-600 text-gray-700' },
  { key: 'pending', label: '待处理', color: 'border-amber-500 text-amber-700' },
  { key: 'done',    label: '已处理', color: 'border-green-500 text-green-700' },
]

const PENDING_STATUSES: WorkItemStatus[] = ['Open', 'InProgress', 'PendingApproval']
const DONE_STATUSES: WorkItemStatus[]    = ['Resolved', 'Closed', 'Approved', 'Rejected', 'Cancelled']

function actorIcon(actor: string, isAgent: boolean) {
  if (isAgent || /agent/i.test(actor)) return <Bot size={13} className="text-violet-500" />
  if (/system|billing/i.test(actor))  return <Settings size={13} className="text-gray-400" />
  if (/portal|customer/i.test(actor)) return <Building2 size={13} className="text-blue-400" />
  return <User size={13} className="text-gray-400" />
}

function formatTimeShort(ts: string) {
  return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(ts: string) {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
  })
}

const STATUS_DONE_MAP: Record<WorkItemStatus, { icon: React.ReactNode; color: string }> = {
  Resolved:  { icon: <CheckCircle2 size={13} />, color: 'text-teal-600' },
  Closed:    { icon: <CheckCircle2 size={13} />, color: 'text-gray-500' },
  Approved:  { icon: <CheckCircle2 size={13} />, color: 'text-green-600' },
  Rejected:  { icon: <AlertCircle size={13} />,  color: 'text-red-500' },
  Cancelled: { icon: <Circle size={13} />,       color: 'text-gray-400' },
  Open:          { icon: <Circle size={13} />,       color: 'text-gray-400' },
  InProgress:    { icon: <Circle size={13} />,       color: 'text-blue-400' },
  PendingApproval: { icon: <AlertCircle size={13} />, color: 'text-amber-500' },
}

export default function ActivityHistory() {
  const { items } = useCollaboration()
  const navigate  = useNavigate()
  const [tab, setTab] = useState<TabKey>('all')

  const allActivity: ActivityEntry[] = useMemo(() =>
    items
      .flatMap((item) =>
        item.activityLog.map((log) => ({
          ...log,
          itemId: item.id,
          itemTitle: item.title,
          itemType: item.type,
          itemStatus: item.status,
          isAgentGenerated: item.isAgentGenerated,
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [items]
  )

  const filtered = useMemo(() => {
    if (tab === 'all')     return allActivity
    if (tab === 'pending') return allActivity.filter((e) => PENDING_STATUSES.includes(e.itemStatus))
    return allActivity.filter((e) => DONE_STATUSES.includes(e.itemStatus))
  }, [allActivity, tab])

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, ActivityEntry[]> = {}
    filtered.forEach((entry) => {
      const key = formatDateLabel(entry.timestamp)
      if (!map[key]) map[key] = []
      map[key].push(entry)
    })
    return Object.entries(map)
  }, [filtered])

  const tabCount = (k: TabKey) => {
    if (k === 'all')     return allActivity.length
    if (k === 'pending') return allActivity.filter((e) => PENDING_STATUSES.includes(e.itemStatus)).length
    return allActivity.filter((e) => DONE_STATUSES.includes(e.itemStatus)).length
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">操作历史</h1>
        <p className="text-sm text-gray-500 mt-0.5">协作中心全部事项的完整操作记录</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                active ? t.color + ' bg-transparent' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                active ? 'bg-current/10' : 'bg-gray-100 text-gray-500'
              }`} style={active ? { backgroundColor: 'rgba(0,0,0,0.06)' } : {}}>
                {tabCount(t.key)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Clock size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">暂无记录</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, entries]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gray-150 bg-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">
                  {date}
                </span>
                <span className="text-xs text-gray-300 shrink-0">{entries.length} 条记录</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Entries card group */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                {entries.map((entry, idx) => {
                  const statusMeta = STATUS_DONE_MAP[entry.itemStatus]
                  const isDone = DONE_STATUSES.includes(entry.itemStatus)
                  return (
                    <div
                      key={`${entry.itemId}-${entry.id}-${idx}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      {/* Left: actor avatar */}
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                        entry.isAgentGenerated || /agent/i.test(entry.actor)
                          ? 'bg-violet-100'
                          : /portal|customer/i.test(entry.actor)
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                        {actorIcon(entry.actor, entry.isAgentGenerated)}
                      </div>

                      {/* Center: content */}
                      <div className="flex-1 min-w-0">
                        {/* Row 1: type badge + item title + item id */}
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold shrink-0 ${TYPE_COLORS[entry.itemType]}`}>
                            {entry.itemType}
                          </span>
                          <button
                            onClick={() => navigate(`/collaboration/item/${entry.itemId}`)}
                            className="text-sm font-medium text-gray-800 hover:text-primary-600 truncate max-w-[280px] group-hover:underline underline-offset-2 text-left"
                          >
                            {entry.itemTitle}
                          </button>
                          <span className="text-xs text-gray-400 font-mono shrink-0">{entry.itemId}</span>
                        </div>

                        {/* Row 2: action + status transition */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-700">{entry.action}</span>
                          {entry.fromStatus && entry.toStatus && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <span className={`px-1.5 py-0.5 rounded ${STATUS_COLORS[entry.fromStatus]}`}>
                                {entry.fromStatus}
                              </span>
                              <ChevronRight size={10} />
                              <span className={`px-1.5 py-0.5 rounded ${STATUS_COLORS[entry.toStatus]}`}>
                                {entry.toStatus}
                              </span>
                            </span>
                          )}
                        </div>

                        {/* Row 3: note */}
                        {entry.note && (
                          <p className="text-xs text-gray-400 italic mt-0.5">"{entry.note}"</p>
                        )}

                        {/* Row 4: actor + time */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            {actorIcon(entry.actor, entry.isAgentGenerated)}
                            {entry.actor}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatTimeShort(entry.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Right: status pill + navigate arrow */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <span className={`flex items-center gap-1 text-xs font-medium ${statusMeta.color}`}>
                          {statusMeta.icon}
                          {isDone ? '已处理' : '待处理'}
                        </span>
                        <button
                          onClick={() => navigate(`/collaboration/item/${entry.itemId}`)}
                          className="text-xs text-gray-300 hover:text-primary-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="查看详情"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
