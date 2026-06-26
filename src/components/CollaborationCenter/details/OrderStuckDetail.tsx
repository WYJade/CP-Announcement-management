import { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  Clock,
  Package,
  CheckCircle2,
  Circle,
  ChevronRight,
  ShoppingCart,
  ScanLine,
  PackageCheck,
  ClipboardCheck,
  Truck,
  Send,
  Zap,
  Hash,
  BarChart3,
  Timer,
  RefreshCw,
} from 'lucide-react'
import type { WorkItem, OrderStuckData } from '../../../types/workItem'
import { useCollaboration } from '../../../context/CollaborationContext'
import RecommendedActions from '../components/RecommendedActions'
import ServiceUpsellModal from '../components/ServiceUpsellModal'
import type { RecommendedAction, ServiceId } from '../../../types/workItem'

// ─── Pipeline stage definition ────────────────────────────────────────────────

interface PipelineStage {
  key: string
  label: string
  labelShort: string
  Icon: React.ComponentType<{ className?: string }>
}

const PIPELINE_STAGES: PipelineStage[] = [
  { key: '接单',    labelShort: '接单',    label: '接单 (Order Received)',    Icon: ShoppingCart   },
  { key: '拣货',    labelShort: '拣货',    label: '拣货 (Picking)',           Icon: ScanLine       },
  { key: '打包',    labelShort: '打包',    label: '打包 (Packing)',           Icon: PackageCheck   },
  { key: '审核',    labelShort: '审核',    label: '审核 (Review)',            Icon: ClipboardCheck },
  { key: '待取件',  labelShort: '待取件',  label: '待取件 (Carrier Pickup)',  Icon: Truck          },
  { key: '已发出',  labelShort: '已发出',  label: '已发出 (Dispatched)',      Icon: Send           },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchStage(stuckStage: string): number {
  const s = stuckStage.toLowerCase()
  if (s.includes('接单') || s.includes('received') || s.includes('order'))        return 0
  if (s.includes('拣货') || s.includes('pick'))                                    return 1
  if (s.includes('打包') || s.includes('pack'))                                    return 2
  if (s.includes('审核') || s.includes('review') || s.includes('check'))          return 3
  if (s.includes('待取件') || s.includes('pickup') || s.includes('carrier'))      return 4
  if (s.includes('已发出') || s.includes('dispatch') || s.includes('shipped'))    return 5
  return 1 // default to picking
}

function calcHoursStuck(stuckSince: string): number {
  const since = new Date(stuckSince).getTime()
  const now = Date.now()
  return Math.floor((now - since) / (1000 * 60 * 60))
}

function formatStuckSince(stuckSince: string): string {
  const d = new Date(stuckSince)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatSlaDeadline(slaDeadline?: string): { label: string; isBreached: boolean; isSoon: boolean } {
  if (!slaDeadline) return { label: '无 SLA 要求', isBreached: false, isSoon: false }
  const deadline = new Date(slaDeadline)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const isBreached = diffMs < 0
  const isSoon = !isBreached && diffH <= 2
  if (isBreached) return { label: `已超时 ${Math.abs(diffH)} 小时`, isBreached: true, isSoon: false }
  if (diffH < 1) {
    const diffMin = Math.floor(diffMs / (1000 * 60))
    return { label: `还剩 ${diffMin} 分钟`, isBreached: false, isSoon: true }
  }
  return { label: `还剩 ${diffH} 小时`, isBreached: false, isSoon }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface FlashDotProps { className?: string }
function FlashDot({ className = '' }: FlashDotProps) {
  return (
    <span className={`relative flex h-3 w-3 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
    </span>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  item: WorkItem
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderStuckDetail({ item, onClose }: Props) {
  const { purchasedServices } = useCollaboration()
  const [upsellServiceId, setUpsellServiceId] = useState<ServiceId | null>(null)
  const [hoursStuck, setHoursStuck] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [showOrderList, setShowOrderList] = useState(false)

  const data = item.scenarioData as OrderStuckData | undefined
  const isOverdue = item.scenario === 'order-overdue'
  const pageTitle = isOverdue ? '订单超时详情' : '订单卡滞详情'

  const stuckStage  = data?.stuckStage   ?? '未知环节'
  const stuckReason = data?.stuckReason  ?? '暂无原因说明'
  const stuckSince  = data?.stuckSince   ?? new Date().toISOString()
  const affectedQty = data?.affectedQty  ?? 0
  const orderId     = data?.orderId      ?? item.relatedObjectId ?? '—'

  const stuckStageIndex = matchStage(stuckStage)
  const slaInfo = formatSlaDeadline(item.slaDeadline)

  // Recalculate hours every minute
  useEffect(() => {
    setHoursStuck(calcHoursStuck(stuckSince))
    const timer = setInterval(() => setHoursStuck(calcHoursStuck(stuckSince)), 60_000)
    return () => clearInterval(timer)
  }, [stuckSince])

  // ── Action handler ──────────────────────────────────────────────────────────
  function handleActionClick(action: RecommendedAction) {
    if (action.serviceId && !purchasedServices.has(action.serviceId)) {
      setUpsellServiceId(action.serviceId as ServiceId)
    }
  }

  // ── Stage state helper ──────────────────────────────────────────────────────
  type StageState = 'completed' | 'stuck' | 'pending'
  function stageState(idx: number): StageState {
    if (idx < stuckStageIndex) return 'completed'
    if (idx === stuckStageIndex) return 'stuck'
    return 'pending'
  }

  // ── Alert box color ─────────────────────────────────────────────────────────
  const alertBg    = isOverdue ? 'bg-orange-50 border-orange-300' : 'bg-red-50 border-red-300'
  const alertTitle = isOverdue ? 'text-orange-800' : 'text-red-800'
  const alertIcon  = isOverdue ? 'text-orange-500' : 'text-red-500'
  const alertQty   = isOverdue ? 'text-orange-700' : 'text-red-700'

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

      {/* ── Panel ──────────────────────────────────────────────────────────────── */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col bg-white shadow-2xl">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isOverdue ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isOverdue ? 'bg-orange-100' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${isOverdue ? 'text-orange-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{pageTitle}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{item.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Main content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* ── Alert status box ──────────────────────────────────────────── */}
            <div className={`rounded-xl border-2 p-4 ${alertBg}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-6 h-6 mt-0.5 shrink-0 ${alertIcon}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xl font-bold ${alertTitle}`}>
                    {affectedQty > 0
                      ? `${affectedQty} 个订单卡在 "${stuckStage}"`
                      : `订单卡在 "${stuckStage}"`}
                  </p>
                  <p className={`text-sm mt-1 ${alertQty}`}>
                    {isOverdue ? '此订单已超出承诺 SLA 时间，请立即处理' : '系统已检测到异常，需人工干预'}
                  </p>

                  {/* Duration + qty badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${isOverdue ? 'bg-orange-200 text-orange-900' : 'bg-red-200 text-red-900'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      已卡滞 {hoursStuck} 小时
                    </span>
                    {affectedQty > 0 && (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${isOverdue ? 'bg-orange-100 text-orange-800 border border-orange-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                        <Package className="w-3.5 h-3.5" />
                        {affectedQty} 个订单受影响
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pipeline visualization ─────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                订单流转状态
              </h3>

              {/* Desktop horizontal pipeline */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-[2.1rem] left-8 right-8 h-0.5 bg-gray-200 z-0" />

                <div className="relative z-10 flex items-start justify-between gap-1">
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const state = stageState(idx)
                    const isStuck   = state === 'stuck'
                    const isDone    = state === 'completed'

                    return (
                      <div key={stage.key} className="flex flex-col items-center flex-1 min-w-0">
                        {/* Stuck marker */}
                        <div className="h-5 flex items-center justify-center mb-1">
                          {isStuck && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 border border-red-300 rounded-full px-1.5 py-0.5 whitespace-nowrap animate-pulse">
                              ⚠ 卡滞点
                            </span>
                          )}
                        </div>

                        {/* Stage circle */}
                        <div className={[
                          'relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                          isDone    ? 'bg-green-500 border-green-600 text-white shadow-md'              : '',
                          isStuck   ? 'bg-red-500 border-red-600 text-white shadow-lg scale-110'        : '',
                          !isDone && !isStuck ? 'bg-gray-100 border-gray-300 text-gray-400'            : '',
                        ].join(' ')}>
                          {isStuck && (
                            <span className="absolute -top-1 -right-1">
                              <FlashDot />
                            </span>
                          )}
                          {isDone
                            ? <CheckCircle2 className="w-5 h-5" />
                            : isStuck
                              ? <AlertTriangle className="w-5 h-5" />
                              : <Circle className="w-4 h-4" />
                          }
                        </div>

                        {/* Connector arrow (except last) */}
                        {idx < PIPELINE_STAGES.length - 1 && (
                          <ChevronRight className={[
                            'absolute hidden',
                          ].join(' ')} />
                        )}

                        {/* Stage label */}
                        <div className="mt-2 text-center">
                          <p className={[
                            'text-xs font-semibold leading-tight',
                            isDone  ? 'text-green-700'  : '',
                            isStuck ? 'text-red-700'    : '',
                            !isDone && !isStuck ? 'text-gray-400' : '',
                          ].join(' ')}>
                            {stage.labelShort}
                          </p>
                          {isDone && (
                            <p className="text-xs text-green-500 mt-0.5">完成</p>
                          )}
                          {isStuck && (
                            <p className="text-xs text-red-500 font-bold mt-0.5">卡滞中</p>
                          )}
                          {!isDone && !isStuck && (
                            <p className="text-xs text-gray-300 mt-0.5">待处理</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stage legend */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  已完成
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  卡滞中
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
                  待处理
                </span>
              </div>
            </div>

            {/* ── Stuck reason ─────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900 mb-1">卡滞原因</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{stuckReason}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Timer className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs text-amber-700">
                      卡滞开始时间：{formatStuckSince(stuckSince)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Recommended actions ───────────────────────────────────────────── */}
            {item.recommendedActions && item.recommendedActions.length > 0 && (
              <div>
                <RecommendedActions
                  actions={item.recommendedActions}
                  purchasedServices={purchasedServices}
                  onActionClick={handleActionClick}
                />
              </div>
            )}

          </div>

          {/* ── Sidebar ────────────────────────────────────────────────────────── */}
          <aside className="w-56 shrink-0 border-l border-gray-100 bg-gray-50 overflow-y-auto px-4 py-5 space-y-5">

            {/* Order / Batch info */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">订单信息</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Hash className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">批次 / 订单 ID</p>
                    <p className="text-xs font-semibold text-gray-800 break-all">{orderId}</p>
                  </div>
                </div>
                {affectedQty > 0 && (
                  <div className="flex items-start gap-2">
                    <Package className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">受影响订单数</p>
                      <p className="text-xs font-semibold text-gray-800">{affectedQty} 单</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">卡滞时长</p>
                    <p className="text-xs font-semibold text-red-600">{hoursStuck} 小时</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA status */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">SLA 状态</p>
              <div className={[
                'rounded-lg px-3 py-2 text-xs font-semibold text-center',
                slaInfo.isBreached ? 'bg-red-100 text-red-700 border border-red-200'       : '',
                slaInfo.isSoon     ? 'bg-amber-100 text-amber-700 border border-amber-200' : '',
                !slaInfo.isBreached && !slaInfo.isSoon ? 'bg-gray-100 text-gray-600 border border-gray-200' : '',
              ].join(' ')}>
                {slaInfo.isBreached && <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />}
                {slaInfo.label}
              </div>
              {item.slaDeadline && (
                <p className="text-xs text-gray-400 mt-1.5 text-center">
                  截止：{formatStuckSince(item.slaDeadline)}
                </p>
              )}
            </div>

            {/* Quick actions */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">快速操作</p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  申请加急处理
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  刷新状态
                </button>
              </div>
            </div>

            {/* Work item meta */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">工单信息</p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-xs text-gray-400">工单 ID</p>
                  <p className="text-xs font-mono font-semibold text-gray-700">{item.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">优先级</p>
                  <p className={[
                    'text-xs font-semibold',
                    item.priority === 'Critical' ? 'text-red-600' : '',
                    item.priority === 'High'     ? 'text-orange-600' : '',
                    item.priority === 'Medium'   ? 'text-blue-600' : '',
                    item.priority === 'Low'      ? 'text-gray-500' : '',
                  ].join(' ')}>
                    {item.priority === 'Critical' ? '紧急'
                      : item.priority === 'High' ? '高'
                      : item.priority === 'Medium' ? '中'
                      : '低'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">负责团队</p>
                  <p className="text-xs font-semibold text-gray-700">{item.owner}</p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* ── Upsell modal ─────────────────────────────────────────────────────── */}
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
