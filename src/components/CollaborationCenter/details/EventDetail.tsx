import { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  TrendingDown,
  Package,
  Clock,
  CloudLightning,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  Zap,
  AlertCircle,
  Timer,
  Tag,
  User,
  CalendarDays,
  Building2,
  ChevronRight,
} from 'lucide-react'
import type { WorkItem } from '../../../types/workItem'
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  DRIVER_COLORS,
  DRIVER_LABELS,
} from '../../../types/workItem'
import { useCollaboration } from '../../../context/CollaborationContext'
import RecommendedActions from '../components/RecommendedActions'
import ServiceUpsellModal from '../components/ServiceUpsellModal'
import type { ServiceId, RecommendedAction } from '../../../types/workItem'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  item: WorkItem
  onClose: () => void
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

// ─── Countdown hook ────────────────────────────────────────────────────────────

function useCountdown(deadline: string | undefined) {
  const [remaining, setRemaining] = useState<number>(0)

  useEffect(() => {
    if (!deadline) return
    const tick = () => {
      setRemaining(Math.max(0, new Date(deadline).getTime() - Date.now()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  const totalMs = remaining
  const hours = Math.floor(totalMs / 3_600_000)
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000)
  const seconds = Math.floor((totalMs % 60_000) / 1000)
  const isPast = totalMs === 0

  return { hours, minutes, seconds, isPast, totalMs }
}

// ─── Sub-section: Sidebar metadata ─────────────────────────────────────────────

function Sidebar({ item }: { item: WorkItem }) {
  return (
    <aside className="w-56 flex-shrink-0 space-y-5 text-sm">
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">工单信息</h3>

        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />状态</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
              {item.status}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />优先级</span>
            <span className={`text-xs font-semibold ${PRIORITY_COLORS[item.priority]}`}>
              {item.priority}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" />类型</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DRIVER_COLORS[item.driver]}`}>
              {DRIVER_LABELS[item.driver]}
            </span>
          </div>

          {item.assignee && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" />负责人</span>
              <span className="text-gray-700 text-xs text-right">{item.assignee}</span>
            </div>
          )}

          {item.warehouseCode && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />仓库</span>
              <span className="text-gray-700 text-xs">{item.warehouseCode}</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />创建</span>
            <span className="text-gray-700 text-xs">{formatDateShort(item.createdAt)}</span>
          </div>

          {item.slaDeadline && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />截止</span>
              <span className="text-amber-600 text-xs font-medium">{formatDate(item.slaDeadline)}</span>
            </div>
          )}
        </div>
      </div>

      {item.relatedObjectId && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">关联对象</h3>
          <p className="text-xs text-gray-500">{item.relatedObjectType}</p>
          <p className="text-xs font-mono font-medium text-gray-800 break-all">{item.relatedObjectId}</p>
        </div>
      )}

      {item.tags.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">标签</h3>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

// ─── Scenario: inventory-threshold ─────────────────────────────────────────────

function InventoryThresholdBody({ item }: { item: WorkItem }) {
  // Pull sku + qty from relatedObjectId / title heuristics or scenarioData
  const data = item.scenarioData as { skuId?: string; available?: number } | undefined
  const skuId = data?.skuId ?? item.relatedObjectId ?? 'SKU'
  const available = data?.available ?? 48
  const threshold = 50

  const trendData = [55, 54, 52, 51, 50, 49, available]

  return (
    <div className="space-y-4">
      {/* Alert box */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-900">
            SKU {skuId} 当前可用库存 {available} 件，低于安全阈值 {threshold} 件
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            建议尽快安排补货，避免订单无法及时处理
          </p>
        </div>
      </div>

      {/* Trend indicator */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-gray-700">近7天库存变化</span>
        </div>
        <div className="flex items-end gap-1.5 h-14">
          {trendData.map((val, i) => {
            const max = Math.max(...trendData, threshold)
            const heightPct = (val / max) * 100
            const isLow = val < threshold
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-sm transition-all ${isLow ? 'bg-red-400' : 'bg-blue-400'}`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] text-gray-400">{val}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="h-px flex-1 border-t border-dashed border-amber-400" />
          <span className="text-[10px] text-amber-600 font-medium">阈值 {threshold}</span>
        </div>
      </div>

      {/* Primary action */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-sm"
      >
        <Package className="w-4 h-4" />
        安排补货
      </button>
    </div>
  )
}

// ─── Scenario: shipment-delayed ─────────────────────────────────────────────────

const TRACKING_STEPS = [
  { label: '已出库', done: true },
  { label: '已揽收', done: true },
  { label: '中转延误', done: true, warning: true },
  { label: '派送中', done: false },
  { label: '已签收', done: false },
]

function ShipmentDelayedBody() {
  return (
    <div className="space-y-4">
      {/* Delay reason */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <CloudLightning className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">延误原因：极端天气</p>
          <p className="text-xs text-blue-700 mt-0.5">
            承运商中转枢纽因极端天气暂停作业，预计额外延误 2 个工作日
          </p>
        </div>
      </div>

      {/* Horizontal timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 mb-4">运输追踪</p>
        <div className="relative flex items-center justify-between">
          {/* connector line */}
          <div className="absolute inset-y-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
          {TRACKING_STEPS.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1.5 z-10">
              <div
                className={[
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold',
                  step.warning
                    ? 'bg-amber-400 border-amber-500 text-white'
                    : step.done
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400',
                ].join(' ')}
              >
                {step.done ? (step.warning ? '!' : <ChevronRight className="w-3 h-3" />) : i + 1}
              </div>
              <span
                className={`text-[10px] text-center w-12 leading-tight ${
                  step.warning ? 'text-amber-600 font-semibold' : step.done ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          通知消费者
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 text-sm font-medium transition-colors"
        >
          无需操作
        </button>
      </div>
    </div>
  )
}

// ─── Scenario: address-exception ───────────────────────────────────────────────

const MOCK_AFFECTED_ORDERS = [
  'ORD-20260624-0021',
  'ORD-20260624-0034',
  'ORD-20260624-0055',
  'ORD-20260624-0078',
  'ORD-20260624-0092',
]

function AddressExceptionBody({ item }: { item: WorkItem }) {
  // Try to parse total count from title or use mock
  const titleMatch = item.title.match(/(\d+)\s*个/)
  const totalCount = titleMatch ? parseInt(titleMatch[1], 10) : 18
  const shownOrders = MOCK_AFFECTED_ORDERS.slice(0, 5)
  const remainingCount = Math.max(0, totalCount - shownOrders.length)

  return (
    <div className="space-y-4">
      {/* Alert */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
        <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-900">
            {totalCount} 个订单收货地址无法识别
          </p>
          <p className="text-xs text-red-700 mt-0.5">
            承运商系统无法解析以下订单地址，已暂停发货。请及时更新以避免退件费用。
          </p>
        </div>
      </div>

      {/* Order list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">受影响订单</span>
        </div>
        <ul className="divide-y divide-gray-100">
          {shownOrders.map((orderId) => (
            <li key={orderId} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm font-mono text-gray-700">{orderId}</span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">地址异常</span>
            </li>
          ))}
          {remainingCount > 0 && (
            <li className="px-4 py-2.5 text-xs text-gray-500 text-center">
              ...还有 {remainingCount} 个订单
            </li>
          )}
        </ul>
      </div>

      {/* Primary action */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-sm"
      >
        <MapPin className="w-4 h-4" />
        更新地址
      </button>
    </div>
  )
}

// ─── Scenario: receiving-completed ─────────────────────────────────────────────

function ReceivingCompletedBody({ item }: { item: WorkItem }) {
  const data = item.scenarioData as
    | { poId?: string; receivedQty?: number; skuId?: string; skuName?: string; receivedDate?: string }
    | undefined

  const poId = data?.poId ?? item.relatedObjectId ?? 'PO-?'
  const receivedQty = data?.receivedQty ?? 0
  const skuId = data?.skuId ?? 'SKU'
  const skuName = data?.skuName ?? ''
  const receivedDate = data?.receivedDate ?? ''

  const skus = skuName ? [{ id: skuId, name: skuName }] : [{ id: skuId, name: skuId }]

  return (
    <div className="space-y-4">
      {/* Success header */}
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-green-900">收货完成！</p>
          <p className="text-xs text-green-700 mt-0.5">所有货物已扫码上架，可立即出库</p>
        </div>
      </div>

      {/* PO Summary */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">采购订单汇总</span>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-gray-500">PO 编号</span>
            <span className="text-sm font-medium text-gray-800 font-mono">{poId}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-gray-500">实收数量</span>
            <span className="text-sm font-bold text-green-700">{receivedQty.toLocaleString()} 件</span>
          </div>
          {receivedDate && (
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-gray-500">收货日期</span>
              <span className="text-sm text-gray-700">{receivedDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* SKU list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU 明细</span>
        </div>
        <ul className="divide-y divide-gray-100">
          {skus.map((sku) => (
            <li key={sku.id} className="flex items-center justify-between px-4 py-2.5">
              <div>
                <p className="text-sm font-medium text-gray-800">{sku.name}</p>
                <p className="text-xs text-gray-400 font-mono">{sku.id}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">已上架</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-sm"
      >
        <ShoppingBag className="w-4 h-4" />
        查看库存
      </button>
    </div>
  )
}

// ─── Scenario: order-sla-risk ───────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-gray-500 mt-1">{label}</span>
    </div>
  )
}

function OrderSlaRiskBody({ item }: { item: WorkItem }) {
  const { hours, minutes, seconds, isPast } = useCountdown(item.slaDeadline)

  // Try to parse risk count from title
  const titleMatch = item.title.match(/(\d+)\s*个/)
  const atRiskCount = titleMatch ? parseInt(titleMatch[1], 10) : 35

  return (
    <div className="space-y-4">
      {/* Risk alert */}
      <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-orange-900">
            {atRiskCount} 个订单面临 SLA 超时风险
          </p>
          <p className="text-xs text-orange-700 mt-0.5">
            如不立即干预，预计约 {Math.ceil(atRiskCount * 0.57)} 个订单将超时发货
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-gray-700">距 SLA 截止时间</span>
        </div>
        {isPast ? (
          <div className="text-center py-2">
            <span className="text-red-600 font-bold text-lg">已超时</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <CountdownUnit value={hours} label="小时" />
            <span className="text-2xl font-bold text-gray-400 pb-4">:</span>
            <CountdownUnit value={minutes} label="分钟" />
            <span className="text-2xl font-bold text-gray-400 pb-4">:</span>
            <CountdownUnit value={seconds} label="秒" />
          </div>
        )}
      </div>

      {/* Decision buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-sm"
        >
          <Zap className="w-4 h-4" />
          申请加急
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-3 text-sm font-medium transition-colors"
        >
          接受风险
        </button>
      </div>
    </div>
  )
}

// ─── Default fallback body ─────────────────────────────────────────────────────

function DefaultBody({ item }: { item: WorkItem }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {item.description}
      </p>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function EventDetail({ item, onClose }: Props) {
  const { purchasedServices } = useCollaboration()
  const [upsellServiceId, setUpsellServiceId] = useState<ServiceId | null>(null)

  const handleActionClick = (action: RecommendedAction) => {
    if (action.serviceId && !purchasedServices.has(action.serviceId)) {
      setUpsellServiceId(action.serviceId as ServiceId)
    }
    // If already purchased, handle action inline (no-op here — caller can extend)
  }

  const renderScenarioBody = () => {
    switch (item.scenario) {
      case 'inventory-threshold':
        return <InventoryThresholdBody item={item} />
      case 'shipment-delayed':
        return <ShipmentDelayedBody />
      case 'address-exception':
        return <AddressExceptionBody item={item} />
      case 'receiving-completed':
        return <ReceivingCompletedBody item={item} />
      case 'order-sla-risk':
        return <OrderSlaRiskBody item={item} />
      default:
        return <DefaultBody item={item} />
    }
  }

  // Header accent per scenario
  const headerAccent: Record<string, string> = {
    'inventory-threshold': 'bg-amber-50 border-amber-200',
    'shipment-delayed': 'bg-blue-50 border-blue-200',
    'address-exception': 'bg-red-50 border-red-200',
    'receiving-completed': 'bg-green-50 border-green-200',
    'order-sla-risk': 'bg-orange-50 border-orange-200',
  }
  const accentClass = headerAccent[item.scenario] ?? 'bg-purple-50 border-purple-200'

  return (
    <>
      <div className="flex flex-col h-full bg-white">

        {/* ── Header ── */}
        <div className={`border-b px-6 py-4 ${accentClass}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-gray-400">{item.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DRIVER_COLORS[item.driver]}`}>
                  {DRIVER_LABELS[item.driver]}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900 leading-snug">{item.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-6 p-6">

            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Description — always shown prominently */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              {/* Scenario-specific content */}
              {renderScenarioBody()}

              {/* Recommended actions */}
              {item.recommendedActions && item.recommendedActions.length > 0 && (
                <RecommendedActions
                  actions={item.recommendedActions}
                  purchasedServices={purchasedServices}
                  onActionClick={handleActionClick}
                />
              )}

            </div>

            {/* Sidebar */}
            <Sidebar item={item} />

          </div>
        </div>

      </div>

      {/* Upsell modal */}
      {upsellServiceId && (
        <ServiceUpsellModal
          serviceId={upsellServiceId}
          onClose={() => setUpsellServiceId(null)}
          onPurchased={() => setUpsellServiceId(null)}
        />
      )}
    </>
  )
}
