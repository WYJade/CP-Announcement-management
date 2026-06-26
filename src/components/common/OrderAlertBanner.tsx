import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, ChevronRight, Package, Truck, AlertTriangle,
  Clock, TrendingDown, ShieldAlert, ClipboardCheck,
} from 'lucide-react'

// ─── Alert type ──────────────────────────────────────────────────────────────

export interface OrderAlert {
  id: string
  type: 'order-stuck' | 'order-overdue' | 'shipment-delayed' | 'address-exception' | 'sla-risk' | 'low-stock' | 'slow-moving' | 'data-anomaly' | 'adjustment-approval' | 'shipment-pickup-delay' | 'tracking-anomaly' | 'delivery-delay' | 'suspicious-login'
  title: string
  message: string
  refId?: string
  severity: 'high' | 'medium' | 'low'
  actionLabel?: string
  actionPath?: string
  secondaryActionLabel?: string
  secondaryActionPath?: string
}

// ─── Type config ─────────────────────────────────────────────────────────────

const ALERT_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'order-stuck': { icon: <Clock size={15} />, color: 'text-red-600', bg: 'bg-red-50 border-red-100 border-l-red-500' },
  'order-overdue': { icon: <AlertTriangle size={15} />, color: 'text-red-600', bg: 'bg-red-50 border-red-100 border-l-red-500' },
  'shipment-delayed': { icon: <Truck size={15} />, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100 border-l-orange-500' },
  'address-exception': { icon: <Package size={15} />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 border-l-amber-500' },
  'sla-risk': { icon: <AlertTriangle size={15} />, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100 border-l-orange-500' },
  'low-stock': { icon: <TrendingDown size={15} />, color: 'text-red-600', bg: 'bg-red-50 border-red-100 border-l-red-500' },
  'slow-moving': { icon: <Package size={15} />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 border-l-amber-500' },
  'data-anomaly': { icon: <ShieldAlert size={15} />, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100 border-l-orange-500' },
  'adjustment-approval': { icon: <ClipboardCheck size={15} />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100 border-l-blue-500' },
  'shipment-pickup-delay': { icon: <Truck size={15} />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100 border-l-blue-500' },
  'tracking-anomaly': { icon: <AlertTriangle size={15} />, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100 border-l-orange-500' },
  'delivery-delay': { icon: <Clock size={15} />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100 border-l-amber-500' },
  'suspicious-login': { icon: <ShieldAlert size={15} />, color: 'text-red-600', bg: 'bg-red-50 border-red-100 border-l-red-600' },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrderAlertBanner({ alerts }: { alerts: OrderAlert[] }) {
  const navigate = useNavigate()
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter((a) => !dismissedIds.has(a.id))
  const currentAlert = visibleAlerts[0]

  if (!currentAlert) return null

  const config = ALERT_CONFIG[currentAlert.type] || ALERT_CONFIG['order-stuck']
  const remaining = visibleAlerts.length - 1

  const dismiss = () => {
    setDismissedIds((prev) => new Set([...prev, currentAlert.id]))
  }

  return (
    <div className={`border-l-4 border px-5 py-4 mb-5 ${config.bg} relative`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${config.color}`}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${config.color}`}>{currentAlert.title}</span>
            {currentAlert.refId && (
              <span className="text-xs font-mono text-gray-500 bg-white/60 px-1.5 py-0.5 rounded">{currentAlert.refId}</span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{currentAlert.message}</p>
          <div className="flex items-center gap-4 mt-2.5">
            {currentAlert.actionLabel && (
              <button
                onClick={() => currentAlert.actionPath && navigate(currentAlert.actionPath)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                {currentAlert.actionLabel}
                <ChevronRight size={11} />
              </button>
            )}
            {remaining > 0 && (
              <span className="text-xs text-gray-400">还有 {remaining} 条通知</span>
            )}
          </div>
        </div>
        {/* Secondary action button */}
        {currentAlert.secondaryActionLabel && (
          <button
            onClick={() => currentAlert.secondaryActionPath && navigate(currentAlert.secondaryActionPath)}
            className="shrink-0 px-3 py-1.5 text-xs font-medium text-primary-700 bg-white border border-primary-200 rounded hover:bg-primary-50 transition-colors"
          >
            {currentAlert.secondaryActionLabel}
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-gray-400 hover:text-gray-600 p-1 hover:bg-white/60 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
