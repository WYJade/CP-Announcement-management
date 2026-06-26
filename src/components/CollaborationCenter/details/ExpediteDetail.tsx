import { useState, useEffect } from 'react'
import {
  Zap,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Truck,
  Phone,
  ArrowRight,
  Package,
  CreditCard,
  Calendar,
  Tag,
} from 'lucide-react'
import type { WorkItem } from '../../../types/workItem'
import { useCollaboration } from '../../../context/CollaborationContext'
import ServiceUpsellModal from '../components/ServiceUpsellModal'
import { PURCHASED_SERVICES } from '../../../data/serviceCatalog'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  item: WorkItem
  onClose: () => void
}

interface Countdown {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  totalMinutes: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeCountdown(deadline: string): Countdown {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true, totalMinutes: 0 }
  }
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { hours, minutes, seconds, isExpired: false, totalMinutes: Math.floor(diff / 60000) }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function expectedCompletionTime(_purchased: boolean): string {
  // Expedite guarantees same-day processing; estimate ~2h from now
  const t = new Date(Date.now() + 2 * 60 * 60 * 1000)
  return t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) + ' 今日'
}

function isPrimeDayRelated(description: string): boolean {
  return /prime.?day|闪购|促销活动/i.test(description)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SlaCountdown({ deadline }: { deadline: string }) {
  const [countdown, setCountdown] = useState<Countdown>(() => computeCountdown(deadline))

  useEffect(() => {
    const id = setInterval(() => setCountdown(computeCountdown(deadline)), 1000)
    return () => clearInterval(id)
  }, [deadline])

  if (countdown.isExpired) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-100 rounded-xl border border-red-200">
        <AlertTriangle size={18} className="text-red-600 shrink-0" />
        <span className="text-red-700 font-bold text-sm">SLA 截止时间已过期</span>
      </div>
    )
  }

  const urgent = countdown.totalMinutes <= 120 // <= 2 hours is very urgent

  return (
    <div
      className={`flex flex-col items-center gap-1 px-4 py-4 rounded-xl border ${
        urgent
          ? 'bg-red-50 border-red-300'
          : 'bg-orange-50 border-orange-200'
      }`}
    >
      <span className={`text-xs font-medium uppercase tracking-wide ${urgent ? 'text-red-500' : 'text-orange-500'}`}>
        距截止还有
      </span>
      <div className={`flex items-baseline gap-1 ${urgent ? 'text-red-600' : 'text-orange-600'}`}>
        <span className="text-4xl font-extrabold tabular-nums leading-none">{pad(countdown.hours)}</span>
        <span className="text-lg font-bold">小时</span>
        <span className="text-4xl font-extrabold tabular-nums leading-none ml-1">{pad(countdown.minutes)}</span>
        <span className="text-lg font-bold">分</span>
        <span className="text-2xl font-bold tabular-nums ml-1">{pad(countdown.seconds)}</span>
        <span className="text-sm font-bold">秒</span>
      </div>
      {urgent && (
        <span className="text-xs text-red-500 font-medium animate-pulse">紧急 — 请立即处理</span>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExpediteDetail({ item, onClose }: Props) {
  const { purchasedServices, purchaseService } = useCollaboration()
  const [showExpediteUpsell, setShowExpediteUpsell] = useState(false)
  const [showShippingUpsell, setShowShippingUpsell] = useState(false)
  const [expediteConfirmed, setExpediteConfirmed] = useState(false)

  // Derive service purchase status — prefer live context state, fall back to static set
  const hasExpedite = purchasedServices.has('expedite-processing') || PURCHASED_SERVICES.has('expedite-processing')
  const hasUpgradeShipping = purchasedServices.has('upgrade-shipping') || PURCHASED_SERVICES.has('upgrade-shipping')

  const primeDayRelated = isPrimeDayRelated(item.description)
  const qty = (() => {
    // Try to extract qty from description text e.g. "120 件"
    const m = item.description.match(/(\d[\d,]*)\s*件/)
    return m ? m[1] : '—'
  })()

  const handleExpediteAction = () => {
    if (!expediteConfirmed) {
      setExpediteConfirmed(true)
    }
  }

  return (
    <>
      {/* ── Page Shell ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col h-full bg-gray-50">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
              <Zap size={18} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">加急处理请求</h1>
              <p className="text-xs text-gray-400">{item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Main Column ──────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* 1. Urgency & SLA Countdown */}
            <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-700">紧急状态</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 uppercase tracking-wide">
                    Critical
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.title}</p>
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* SLA countdown */}
                {item.slaDeadline ? (
                  <SlaCountdown deadline={item.slaDeadline} />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-amber-700 text-sm font-medium">暂无 SLA 截止时间</span>
                  </div>
                )}

                {/* Order summary pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.relatedObjectId && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
                      <Package size={12} className="text-gray-400" />
                      订单 {item.relatedObjectId}
                    </span>
                  )}
                  {qty !== '—' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
                      <Tag size={12} className="text-gray-400" />
                      数量 {qty} 件
                    </span>
                  )}
                  {item.slaDeadline && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 text-xs font-medium text-orange-700">
                      <Calendar size={12} />
                      {new Date(item.slaDeadline).toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} 截止
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </section>

            {/* 2. Impact Analysis */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <h2 className="text-sm font-semibold text-gray-800">如未及时处理</h2>
                </div>
              </div>
              <ul className="px-5 py-4 space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="text-red-500 shrink-0 mt-0.5">✗</span>
                  <span>订单将错过 SLA 承诺时间，影响仓库服务评分</span>
                </li>
                {primeDayRelated && (
                  <li className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="text-red-500 shrink-0 mt-0.5">✗</span>
                    <span>影响 Prime Day 活动履约，错失促销窗口期</span>
                  </li>
                )}
                <li className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="text-red-500 shrink-0 mt-0.5">✗</span>
                  <span>可能产生客诉并影响账号健康度，增加售后成本</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="text-orange-400 shrink-0 mt-0.5">⚠</span>
                  <span>延误订单可能触发平台自动扣款或信用评级下调</span>
                </li>
              </ul>
            </section>

            {/* 3. Expedite Processing Service */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Zap size={15} className="text-red-500" />
                  <h2 className="text-sm font-semibold text-gray-800">加急处理服务</h2>
                </div>
              </div>

              <div className="px-5 py-4">
                {hasExpedite ? (
                  /* ── Purchased State ─────────────────────────────────────── */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm font-semibold text-green-700">您已开通加急处理服务</span>
                    </div>

                    {expediteConfirmed ? (
                      <div className="flex items-start gap-3 px-4 py-3.5 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">加急请求已发起</p>
                          <p className="text-xs text-green-600 mt-0.5">
                            预计完成时间：{expectedCompletionTime(true)} &nbsp;·&nbsp; 费用：$25
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
                          <p className="text-xs font-medium text-red-600">预计完成时间</p>
                          <p className="text-sm font-bold text-gray-900">{expectedCompletionTime(true)}</p>
                          <p className="text-xs text-gray-400">跳过常规排队，专属操作员优先处理</p>
                        </div>

                        <button
                          onClick={handleExpediteAction}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold shadow-sm transition-colors"
                        >
                          <Zap size={16} />
                          立即发起加急 — 跳过排队，优先处理
                          <ArrowRight size={15} />
                        </button>

                        <p className="text-xs text-gray-400 text-center">
                          服务费 <span className="font-semibold text-gray-600">$25 / 批次</span>，将计入本月账单
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  /* ── Upsell State ────────────────────────────────────────── */
                  <div className="space-y-4">
                    {/* Upsell Card */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Lock size={15} className="text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">
                          开通加急处理服务，订单当日发出有保障
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {[
                          '订单提升至最高优先级，跳过常规排队',
                          '专属操作员全程跟进，当日完成分拣打包',
                          '实时状态更新，全程透明可追踪',
                        ].map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <CheckCircle2 size={13} className="text-amber-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="text-xl font-extrabold text-gray-900">$25</span>
                        <span className="text-xs text-gray-500">/ 批次起</span>
                      </div>
                      <button
                        onClick={() => setShowExpediteUpsell(true)}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold transition-colors shadow-sm"
                      >
                        开通服务
                      </button>
                    </div>

                    {/* Alternative */}
                    <div className="pt-1">
                      <p className="text-xs text-gray-400 text-center mb-2">或者，通过人工方式处理</p>
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Phone size={14} />
                        联系仓库协商加急事宜
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 4. Shipping Upgrade Service */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-blue-500" />
                  <h2 className="text-sm font-semibold text-gray-800">运输升级服务</h2>
                  <span className="ml-auto text-xs text-gray-400">推荐配套</span>
                </div>
              </div>

              <div className="px-5 py-4">
                {hasUpgradeShipping ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm font-semibold text-green-700">您已开通运输升级服务</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      配合加急处理，可升级为次日达或隔日达快递，确保终端消费者按时收货。每单 $8 起，视目的地。
                    </p>
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold transition-colors">
                      <Truck size={14} />
                      为此订单升级运输方式
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Lock size={13} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">
                          升级快递，确保准时送达，减少客诉
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {[
                          '标准运输升级为次日达或隔日达',
                          '适用于紧急订单或高价值货物',
                          '降低因延误导致的差评风险',
                        ].map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle2 size={12} className="text-blue-400 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span className="text-base font-extrabold text-gray-900">$8</span>
                        <span className="text-xs text-gray-500">/ 单起，视目的地</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowShippingUpsell(true)}
                      className="w-full py-2.5 rounded-xl border border-blue-300 bg-white hover:bg-blue-50 text-blue-700 text-sm font-semibold transition-colors"
                    >
                      开通运输升级服务
                    </button>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-64 shrink-0 overflow-y-auto border-l border-gray-100 bg-white px-4 py-5 space-y-5">

            {/* Order Details */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">订单详情</p>
              <dl className="space-y-2">
                {item.relatedObjectId && (
                  <div>
                    <dt className="text-xs text-gray-400">订单号</dt>
                    <dd className="text-xs font-semibold text-gray-800 mt-0.5">{item.relatedObjectId}</dd>
                  </div>
                )}
                {qty !== '—' && (
                  <div>
                    <dt className="text-xs text-gray-400">数量</dt>
                    <dd className="text-xs font-semibold text-gray-800 mt-0.5">{qty} 件</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-400">优先级</dt>
                  <dd className="mt-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      {item.priority}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">状态</dt>
                  <dd className="mt-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.status}
                    </span>
                  </dd>
                </div>
                {item.warehouseCode && (
                  <div>
                    <dt className="text-xs text-gray-400">仓库</dt>
                    <dd className="text-xs font-semibold text-gray-800 mt-0.5">{item.warehouseCode}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-gray-400">创建时间</dt>
                  <dd className="text-xs text-gray-700 mt-0.5">
                    {new Date(item.createdAt).toLocaleString('zh-CN', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            <hr className="border-gray-100" />

            {/* SLA Details */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">SLA</p>
              <dl className="space-y-2">
                {item.slaDeadline ? (
                  <>
                    <div>
                      <dt className="text-xs text-gray-400">截止时间</dt>
                      <dd className="text-xs font-semibold text-red-700 mt-0.5">
                        {new Date(item.slaDeadline).toLocaleString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-400">剩余时间</dt>
                      <dd className="text-xs font-bold text-red-600 mt-0.5">
                        {(() => {
                          const cd = computeCountdown(item.slaDeadline)
                          if (cd.isExpired) return '已过期'
                          return `${cd.hours}h ${pad(cd.minutes)}m`
                        })()}
                      </dd>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400">暂无 SLA 时限</div>
                )}
              </dl>
            </div>

            <hr className="border-gray-100" />

            {/* Billing */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">费用预估</p>
              <dl className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">加急处理费</span>
                  <span className="ml-auto text-xs font-bold text-gray-800">$25</span>
                </div>
                {hasUpgradeShipping && (
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">运输升级费</span>
                    <span className="ml-auto text-xs font-bold text-gray-800">$8+</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 flex items-center">
                  <span className="text-xs text-gray-500">账单状态</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    {item.billingStatus ?? 'Pending'}
                  </span>
                </div>
              </dl>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">标签</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

          </aside>
        </div>
      </div>

      {/* ── Service Upsell Modals ───────────────────────────────────────────── */}
      {showExpediteUpsell && (
        <ServiceUpsellModal
          serviceId="expedite-processing"
          onClose={() => setShowExpediteUpsell(false)}
          onPurchased={() => {
            purchaseService('expedite-processing')
            setShowExpediteUpsell(false)
          }}
        />
      )}
      {showShippingUpsell && (
        <ServiceUpsellModal
          serviceId="upgrade-shipping"
          onClose={() => setShowShippingUpsell(false)}
          onPurchased={() => {
            purchaseService('upgrade-shipping')
            setShowShippingUpsell(false)
          }}
        />
      )}
    </>
  )
}
