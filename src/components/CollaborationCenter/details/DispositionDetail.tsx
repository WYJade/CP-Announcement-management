import { useState } from 'react'
import {
  Package,
  Trash2,
  RotateCcw,
  Wrench,
  Pause,
  CheckCircle,
  InfoIcon,
  DollarSign,
  Clock,
  Tag,
  User,
  Building2,
  X,
} from 'lucide-react'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { WorkItem, DispositionData } from '../../../types/workItem'
import { STATUS_COLORS } from '../../../types/workItem'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  item: WorkItem
  onClose: () => void
}

interface OptionConfig {
  id: string
  icon: React.ReactNode
  borderColor: string
  selectedBg: string
  iconBg: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: string) {
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const OPTION_CONFIGS: Record<string, OptionConfig> = {
  dispose: {
    id: 'dispose',
    icon: <Trash2 size={20} />,
    borderColor: 'border-red-300',
    selectedBg: 'bg-red-50',
    iconBg: 'bg-red-100 text-red-600',
  },
  return: {
    id: 'return',
    icon: <RotateCcw size={20} />,
    borderColor: 'border-blue-300',
    selectedBg: 'bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  rework: {
    id: 'rework',
    icon: <Wrench size={20} />,
    borderColor: 'border-green-300',
    selectedBg: 'bg-green-50',
    iconBg: 'bg-green-100 text-green-600',
  },
  hold: {
    id: 'hold',
    icon: <Pause size={20} />,
    borderColor: 'border-amber-300',
    selectedBg: 'bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-600',
  },
}

function getOptionConfig(id: string): OptionConfig {
  return (
    OPTION_CONFIGS[id] ?? {
      id,
      icon: <Package size={20} />,
      borderColor: 'border-gray-300',
      selectedBg: 'bg-gray-50',
      iconBg: 'bg-gray-100 text-gray-600',
    }
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DispositionDetail({ item, onClose }: Props) {
  const { updateStatus } = useCollaboration()

  const data = item.scenarioData as DispositionData | undefined

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    data?.selectedOption ?? ''
  )
  const [confirmed, setConfirmed] = useState(false)

  const selectedOption = data?.options.find((o) => o.id === selectedOptionId)

  function handleConfirm() {
    if (!selectedOptionId) return
    updateStatus(item.id, 'InProgress', `客户选择处置方式：${selectedOption?.label}`)
    setConfirmed(true)
  }

  // ── Guard ──────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-400 gap-3">
        <Package size={40} className="opacity-30" />
        <p className="text-sm">处置数据不可用</p>
        <button
          onClick={onClose}
          className="text-xs text-blue-500 hover:underline"
        >
          关闭
        </button>
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">

      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="flex-none bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  货物处置申请
                </h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{item.id} · {item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Body (scrollable) ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Left: main content ──────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Damage summary card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-5 py-4">
                  <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">
                    损坏货物概况
                  </h2>
                </div>
                <div className="p-5 space-y-4">

                  {/* SKU + qty display */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">SKU 名称</p>
                      <p className="text-base font-semibold text-gray-900">{data.skuName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{data.skuId}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">损坏类型</p>
                      <p className="text-sm text-gray-700">{data.damageType}</p>
                    </div>
                  </div>

                  {/* Big stat */}
                  <div className="flex items-center justify-center bg-red-50 border border-red-100 rounded-xl py-5">
                    <div className="text-center">
                      <p className="text-5xl font-extrabold text-red-600 leading-none tabular-nums">
                        {data.damagedQty}
                      </p>
                      <p className="text-sm text-red-500 mt-2 font-medium">件损坏，待处置</p>
                    </div>
                  </div>

                  {/* Warehouse note */}
                  <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <InfoIcon size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700 mb-1">仓库说明</p>
                      <p className="text-sm text-amber-800 leading-relaxed">{data.warehouseNote}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disposition options */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-800">选择处置方式</h2>
                  <p className="text-xs text-gray-500 mt-0.5">请根据货物损坏情况和业务需求选择最合适的处置方案</p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.options.map((option) => {
                      const cfg = getOptionConfig(option.id)
                      const isSelected = selectedOptionId === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => !confirmed && setSelectedOptionId(option.id)}
                          disabled={confirmed}
                          className={[
                            'relative text-left rounded-xl border-2 p-4 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400',
                            isSelected
                              ? `${cfg.borderColor} ${cfg.selectedBg} ring-2 ring-offset-1 ${cfg.borderColor.replace('border-', 'ring-')}`
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm',
                            confirmed ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
                          ].join(' ')}
                        >
                          {/* Selected checkmark */}
                          {isSelected && (
                            <span className="absolute top-3 right-3 text-blue-600">
                              <CheckCircle size={18} />
                            </span>
                          )}

                          {/* Icon + label row */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                              {cfg.icon}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm pr-6">{option.label}</span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-600 mb-3 leading-relaxed">{option.description}</p>

                          {/* Cost + timeline chips */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-600 rounded-full px-2.5 py-0.5">
                              <DollarSign size={11} />
                              {option.cost}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-600 rounded-full px-2.5 py-0.5">
                              <Clock size={11} />
                              {option.timeline}
                            </span>
                          </div>

                          {/* Best for */}
                          <div className="flex items-start gap-1.5">
                            <Tag size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-400 leading-relaxed">
                              <span className="font-medium text-gray-500">适合场景：</span>
                              {option.bestFor}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Confirmation area */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 space-y-4">

                  {/* Selected option summary */}
                  {selectedOption && !confirmed && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">
                          已选择：{selectedOption.label}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          费用：{selectedOption.cost} · 时间：{selectedOption.timeline}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Success message */}
                  {confirmed && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">处置方式已确认</p>
                        <p className="text-xs text-green-600 mt-1">
                          仓库将按照「{selectedOption?.label}」方式进行处理，完成后您将收到通知。
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Confirm button */}
                  {!confirmed && (
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={!selectedOptionId}
                      className={[
                        'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150',
                        selectedOptionId
                          ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                      ].join(' ')}
                    >
                      确认处置方式
                    </button>
                  )}

                  {/* Disclaimer */}
                  {!confirmed && (
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      确认后仓库将按您选择的方式处理，处置完成后您将收到通知
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right sidebar ────────────────────────────────────────────── */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-4">

              {/* Item details */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-4 py-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">工单详情</h3>
                </div>
                <div className="p-4 space-y-3">
                  <DetailRow icon={<User size={13} />} label="负责人" value={item.owner} />
                  {item.assignee && (
                    <DetailRow icon={<User size={13} />} label="处理人" value={item.assignee} />
                  )}
                  {item.warehouseCode && (
                    <DetailRow icon={<Building2 size={13} />} label="仓库" value={item.warehouseCode} />
                  )}
                  <DetailRow icon={<Clock size={13} />} label="创建时间" value={formatDate(item.createdAt)} />
                  <DetailRow icon={<Clock size={13} />} label="更新时间" value={formatDate(item.updatedAt)} />
                  {item.slaDeadline && (
                    <DetailRow
                      icon={<Clock size={13} />}
                      label="截止时间"
                      value={formatDate(item.slaDeadline)}
                      valueClass="text-red-600 font-medium"
                    />
                  )}
                  {item.relatedObjectId && (
                    <DetailRow
                      icon={<Tag size={13} />}
                      label={item.relatedObjectType ?? '关联对象'}
                      value={item.relatedObjectId}
                    />
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs text-gray-400 mb-1.5">标签</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing estimate */}
              {item.isChargeable && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                    <DollarSign size={14} className="text-gray-400" />
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">费用预估</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {item.estimatedFee != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">预估费用</span>
                        <span className="text-base font-bold text-gray-900">
                          {item.currency ?? 'USD'} {item.estimatedFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {item.actualFee != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">实际费用</span>
                        <span className="text-base font-bold text-gray-900">
                          {item.currency ?? 'USD'} {item.actualFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {item.billingStatus && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-xs text-gray-500">账单状态</span>
                        <BillingStatusBadge status={item.billingStatus} />
                      </div>
                    )}
                    <p className="text-xs text-gray-400 leading-relaxed pt-1">
                      最终费用将根据实际处置方式和数量计算，处置完成后生成账单。
                    </p>
                  </div>
                </div>
              )}

              {/* Comments preview */}
              {item.comments.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      最新沟通 ({item.comments.length})
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {item.comments.slice(-3).map((c) => (
                      <div key={c.id} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-gray-700 truncate">{c.author}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(c.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{c.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
  valueClass = 'text-gray-700',
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-xs mt-0.5 break-words ${valueClass}`}>{value}</p>
      </div>
    </div>
  )
}

function BillingStatusBadge({ status }: { status: NonNullable<WorkItem['billingStatus']> }) {
  const cfg: Record<NonNullable<WorkItem['billingStatus']>, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Invoiced: 'bg-blue-100 text-blue-700',
    Paid: 'bg-green-100 text-green-700',
    Waived: 'bg-gray-100 text-gray-500',
  }
  const labels: Record<NonNullable<WorkItem['billingStatus']>, string> = {
    Pending: '待结算',
    Invoiced: '已开票',
    Paid: '已付款',
    Waived: '已豁免',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg[status]}`}>
      {labels[status]}
    </span>
  )
}
