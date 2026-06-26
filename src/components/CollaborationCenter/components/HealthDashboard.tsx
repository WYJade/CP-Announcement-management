import { useMemo } from 'react'
import {
  Activity,
  Clock,
  AlertTriangle,
  Star,
  CheckCircle2,
} from 'lucide-react'
import { useCollaboration } from '../../../context/CollaborationContext'

export type MetricFilter = 'active' | 'pendingApproval' | 'slaRisk' | 'priority' | 'completed'

interface Props {
  onMetricClick?: (filter: MetricFilter) => void
  activeFilter?: MetricFilter | null
}

export default function HealthDashboard({ onMetricClick, activeFilter }: Props) {
  const { items } = useCollaboration()

  const now = useMemo(() => new Date(), [])
  const fourHoursFromNow = useMemo(
    () => new Date(now.getTime() + 4 * 60 * 60 * 1000),
    [now]
  )

  const metrics = useMemo(() => {
    const activeProcessing = items.filter(
      (i) => i.status === 'Open' || i.status === 'InProgress'
    ).length

    const pendingApproval = items.filter(
      (i) => i.status === 'PendingApproval'
    ).length

    const slaRisk = items.filter((i) => {
      if (i.isPriority) return true
      if (i.slaDeadline) {
        const deadline = new Date(i.slaDeadline)
        return deadline <= fourHoursFromNow && deadline > now
      }
      return false
    }).length

    const priorityItems = items.filter((i) => i.isPriority === true).length

    const completedThisMonth = items.filter((i) => {
      if (i.status !== 'Closed' && i.status !== 'Resolved') return false
      const updated = new Date(i.updatedAt)
      return (
        updated.getFullYear() === now.getFullYear() &&
        updated.getMonth() === now.getMonth()
      )
    }).length

    return { activeProcessing, pendingApproval, slaRisk, priorityItems, completedThisMonth }
  }, [items, now, fourHoursFromNow])

  const hasPriorityIssues = metrics.priorityItems > 0

  const metricCards: {
    key: MetricFilter
    label: string
    value: number
    sub: string
    icon: React.ReactNode
    bg: string
    border: string
    text: string
    pulse?: boolean
  }[] = [
    {
      key: 'active',
      label: '活跃处理中',
      value: metrics.activeProcessing,
      sub: 'Open / InProgress',
      icon: <Activity className="w-4 h-4 flex-shrink-0" />,
      bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600',
    },
    {
      key: 'pendingApproval',
      label: '等待您决策',
      value: metrics.pendingApproval,
      sub: '需要您审批或确认',
      icon: <Clock className="w-4 h-4 flex-shrink-0" />,
      bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600',
      pulse: metrics.pendingApproval > 0,
    },
    {
      key: 'slaRisk',
      label: 'SLA 风险',
      value: metrics.slaRisk,
      sub: '优先 / 4h 内到期',
      icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
      bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600',
    },
    {
      key: 'priority',
      label: '优先处理',
      value: metrics.priorityItems,
      sub: '标记为紧急',
      icon: <Star className="w-4 h-4 flex-shrink-0" />,
      bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600',
    },
    {
      key: 'completed',
      label: '本月已完成',
      value: metrics.completedThisMonth,
      sub: 'Closed / Resolved',
      icon: <CheckCircle2 className="w-4 h-4 flex-shrink-0" />,
      bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600',
    },
  ]

  return (
    <div className="w-full space-y-3">
      {/* Metric cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metricCards.map((card) => {
          const isActive = activeFilter === card.key
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onMetricClick?.(card.key)}
              className={[
                'flex flex-col gap-2 rounded-xl px-4 py-3 shadow-sm border text-left transition-all duration-150',
                card.bg, card.border,
                onMetricClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : '',
                isActive ? 'ring-2 ring-offset-1 ring-current scale-[1.02] shadow-md' : '',
              ].join(' ')}
            >
              <div className={`flex items-center gap-2 ${card.text}`}>
                {card.icon}
                <span className="text-xs font-medium leading-tight">{card.label}</span>
                {card.pulse && (
                  <span className="ml-auto relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
              </div>
              <span className={`text-3xl font-bold leading-none ${card.text.replace('600', '700')}`}>
                {card.value}
              </span>
              <span className={`text-xs ${card.text.replace('600', '400').replace('700', '400')}`}>
                {card.sub}
              </span>
              {onMetricClick && (
                <span className={`text-xs font-medium ${card.text} opacity-60 hover:opacity-100`}>
                  {isActive ? '▲ 收起' : '点击查看 →'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Alert bar */}
      {hasPriorityIssues ? (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-colors ${
            activeFilter === 'priority'
              ? 'bg-red-100 border-red-300'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <span className="text-sm leading-snug text-red-700 font-medium">
            🔴 发现{' '}
            <span className="font-bold">{metrics.priorityItems}</span>{' '}
            项需要立即处理的问题 — 请优先查看下方
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5">
          <span className="text-sm leading-snug text-green-700 font-medium">
            ✓ 一切正常，暂无紧急问题
          </span>
        </div>
      )}
    </div>
  )
}
