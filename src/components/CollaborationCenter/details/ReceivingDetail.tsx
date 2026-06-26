import { useState } from 'react'
import {
  Package,
  Check,
  RotateCcw,
  Pause,
  X,
  AlertCircle,
  Info,
  DollarSign,
  Tag,
  Calendar,
  Hash,
} from 'lucide-react'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { WorkItem, ReceivingDiscrepancyData } from '../../../types/workItem'

interface Props {
  item: WorkItem
  onClose: () => void
}

type DecisionOption = 'accept' | 'return' | 'hold'

interface OptionCard {
  id: DecisionOption
  title: string
  titleEn: string
  description: string
  costNote: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  borderColor: string
  selectedBorder: string
  selectedBg: string
}

export default function ReceivingDetail({ item, onClose }: Props) {
  const { updateStatus } = useCollaboration()
  const [selected, setSelected] = useState<DecisionOption | null>(null)
  const [confirming, setConfirming] = useState(false)

  const data = item.scenarioData as ReceivingDiscrepancyData | undefined

  const poQty = data?.poQty ?? 0
  const receivedQty = data?.receivedQty ?? 0
  const variance = data?.variance ?? receivedQty - poQty
  const isOverReceipt = variance > 0
  const absVariance = Math.abs(variance)

  const varianceLabel = isOverReceipt
    ? `+${absVariance} 件（超收）`
    : variance < 0
    ? `-${absVariance} 件（少收）`
    : '0 件（数量吻合）`'

  const options: OptionCard[] = [
    {
      id: 'accept',
      title: '接受入库',
      titleEn: 'Accept',
      description: `接受全部 ${receivedQty} 件，系统将按实收数量更新库存。费用按实收计算，超出 PO 部分纳入正式库存。`,
      costNote: '费用按实收数量结算，无额外操作成本',
      icon: <Check size={20} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-gray-200',
      selectedBorder: 'border-green-500',
      selectedBg: 'bg-green-50',
    },
    {
      id: 'return',
      title: '退回超收部分',
      titleEn: 'Return Excess',
      description: `退回 ${absVariance} 件给供应商，仅保留 PO 数量（${poQty} 件）入库。仓库将协助安排退货出库。`,
      costNote: '可能产生退货操作费及外发运费，具体金额待确认',
      icon: <RotateCcw size={20} />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-gray-200',
      selectedBorder: 'border-orange-500',
      selectedBg: 'bg-orange-50',
    },
    {
      id: 'hold',
      title: '暂置待确认',
      titleEn: 'Hold',
      description: `暂时不做决定，超收 ${absVariance} 件将隔离存放于专用区域，不计入可用库存，等待您进一步指示。`,
      costNote: '存储费继续按日计算，建议尽快做出决定以降低成本',
      icon: <Pause size={20} />,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      selectedBorder: 'border-gray-500',
      selectedBg: 'bg-gray-50',
    },
  ]

  const handleConfirm = () => {
    if (!selected) return
    setConfirming(true)
    const nextStatus =
      selected === 'accept' ? 'Approved' :
      selected === 'return' ? 'InProgress' :
      'Open'
    updateStatus(item.id, nextStatus)
    setConfirming(false)
    onClose()
  }

  const receivedColor = isOverReceipt
    ? 'text-green-600'
    : variance < 0
    ? 'text-red-600'
    : 'text-gray-700'

  const varianceBadgeColor = isOverReceipt
    ? 'bg-green-100 text-green-700 border-green-200'
    : variance < 0
    ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="p-2 rounded-xl bg-blue-100">
          <Package size={20} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900">收货差异确认</h2>
          <p className="text-xs text-gray-500 mt-0.5">Receiving Discrepancy Review</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Scrollable Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">

          {/* ── Main Column ─────────────────────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* PO vs Received Comparison Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Package size={15} className="text-blue-500" />
                收货数量对比
              </h3>

              {/* Big comparison */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">采购单数量</p>
                  <p className="text-xs text-gray-400 mb-2">PO Qty</p>
                  <p className="text-3xl font-bold text-gray-700">{poQty.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">件</p>
                </div>
                <div className={`rounded-xl border p-4 text-center ${
                  isOverReceipt
                    ? 'border-green-200 bg-green-50'
                    : variance < 0
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className={`text-xs mb-1 ${
                    isOverReceipt ? 'text-green-600' : variance < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>实收数量</p>
                  <p className={`text-xs mb-2 ${
                    isOverReceipt ? 'text-green-500' : variance < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>Received</p>
                  <p className={`text-3xl font-bold ${receivedColor}`}>{receivedQty.toLocaleString()}</p>
                  <p className={`text-xs mt-1 ${receivedColor}`}>件</p>
                </div>
              </div>

              {/* Variance badge */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${varianceBadgeColor}`}>
                  <AlertCircle size={14} />
                  差异 {varianceLabel}
                </div>
              </div>

              {/* PO meta info */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">PO 编号</p>
                  <p className="text-sm font-semibold text-gray-700 font-mono">{data?.poId ?? '—'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">SKU</p>
                  <p className="text-sm font-semibold text-gray-700 font-mono">{data?.skuId ?? '—'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">收货日期</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {data?.receivedDate
                      ? new Date(data.receivedDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Scenario Details */}
            <div className="space-y-3">
              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 leading-relaxed">
                  {isOverReceipt
                    ? `本次超收 ${absVariance} 件，这可能是供应商备货误差或拣货偏差。超收部分已暂存在仓库待确认区域，未计入可用库存。`
                    : variance < 0
                    ? `本次少收 ${absVariance} 件，实收数量低于 PO 数量。请确认是否需要追货或调整 PO 数量。`
                    : '本次收货数量与 PO 数量吻合，无差异。'}
                </p>
              </div>

              {/* Storage cost warning */}
              {isOverReceipt && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <DollarSign size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    超收部分产生的额外存储费由您承担，请尽快做出决定以减少不必要的存储成本。
                  </p>
                </div>
              )}
            </div>

            {/* Decision Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">请选择处理方式</h3>
              <p className="text-xs text-gray-400 mb-4">Select your decision for the discrepancy</p>

              <div className="space-y-3">
                {options.map((opt) => {
                  const isSelected = selected === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelected(opt.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? `${opt.selectedBorder} ${opt.selectedBg}`
                          : `${opt.borderColor} bg-white hover:bg-gray-50`
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg shrink-0 ${opt.iconBg}`}>
                          <span className={opt.iconColor}>{opt.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">{opt.title}</span>
                            <span className="text-xs text-gray-400">{opt.titleEn}</span>
                            {isSelected && (
                              <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check size={10} className="text-white" />
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-2">{opt.description}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <DollarSign size={11} />
                            <span>{opt.costNote}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Confirm button */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={handleConfirm}
                  disabled={!selected || confirming}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all
                    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                    enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700 enabled:active:scale-[0.99]"
                >
                  {confirming ? '提交中…' : selected ? '确认选择 Confirm' : '请先选择一个方案'}
                </button>
                {selected && (
                  <p className="text-center text-xs text-gray-400 mt-2">
                    {selected === 'accept' && '确认后系统将按 ' + receivedQty + ' 件更新库存'}
                    {selected === 'return' && '确认后仓库将安排 ' + absVariance + ' 件退货出库流程'}
                    {selected === 'hold' && '确认后超收部分将继续隔离，存储费按日计算'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* PO Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Tag size={12} />
                PO 详情
              </h3>
              <div className="space-y-3">
                <SidebarRow
                  icon={<Hash size={13} />}
                  label="PO 编号"
                  value={data?.poId ?? '—'}
                  mono
                />
                <SidebarRow
                  icon={<Package size={13} />}
                  label="SKU ID"
                  value={data?.skuId ?? '—'}
                  mono
                />
                {data?.skuName && (
                  <SidebarRow
                    icon={<Package size={13} />}
                    label="SKU 名称"
                    value={data.skuName}
                  />
                )}
                <SidebarRow
                  icon={<Calendar size={13} />}
                  label="收货日期"
                  value={data?.receivedDate
                    ? new Date(data.receivedDate).toLocaleDateString('zh-CN')
                    : '—'}
                />
                <SidebarRow
                  icon={<Hash size={13} />}
                  label="PO 数量"
                  value={`${poQty.toLocaleString()} 件`}
                />
                <SidebarRow
                  icon={<Hash size={13} />}
                  label="实收数量"
                  value={`${receivedQty.toLocaleString()} 件`}
                  valueColor={receivedColor}
                />
              </div>
            </div>

            {/* Billing Estimate */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <DollarSign size={12} />
                费用估算
              </h3>
              <div className="space-y-2 text-sm">
                {item.estimatedFee != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">预估费用</span>
                    <span className="font-semibold text-gray-900">
                      {item.currency ?? 'CNY'} {item.estimatedFee.toLocaleString()}
                    </span>
                  </div>
                )}
                {isOverReceipt && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">超收部分存储费（预估/日）</span>
                      <span className="font-medium text-amber-700">待计算</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">退货操作费（如选退回）</span>
                      <span className="font-medium text-amber-700">待计算</span>
                    </div>
                  </>
                )}
                {item.billingStatus && (
                  <div className="flex justify-between pt-2 border-t border-amber-200">
                    <span className="text-gray-500">账单状态</span>
                    <span className="font-semibold text-amber-700">{item.billingStatus}</span>
                  </div>
                )}
                {!item.estimatedFee && !item.billingStatus && (
                  <p className="text-xs text-gray-400 text-center py-1">费用将根据您的决策生成</p>
                )}
              </div>
            </div>

            {/* Decision Guide */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Info size={12} />
                决策参考
              </h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1 shrink-0" />
                  <p><span className="font-medium text-gray-700">接受入库</span>：适合超收数量较少且商品为长期需求品，避免来回运输成本</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1 shrink-0" />
                  <p><span className="font-medium text-gray-700">退回超收</span>：适合库存已足够或超收较多，需供应商承担责任</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1 shrink-0" />
                  <p><span className="font-medium text-gray-700">暂置待确认</span>：需要内部审批或核实后再做决定，但存储费持续产生</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarRow({
  icon,
  label,
  value,
  mono = false,
  valueColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
  valueColor?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-400">{label}</div>
        <div className={`text-sm font-medium truncate ${valueColor ?? 'text-gray-800'} ${mono ? 'font-mono' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  )
}
