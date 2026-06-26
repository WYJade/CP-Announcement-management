import { useState } from 'react'
import {
  ClipboardList,
  X,
  CheckCircle,
  Search,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  Clock,
  Package,
} from 'lucide-react'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { WorkItem, CycleCountData } from '../../../types/workItem'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../../types/workItem'

interface Props {
  item: WorkItem
  onClose: () => void
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-800">{value}</div>
      </div>
    </div>
  )
}

export default function CycleCountDetail({ item, onClose }: Props) {
  const { updateStatus } = useCollaboration()
  const [confirming, setConfirming] = useState<'approve' | 'investigate' | null>(null)

  const data = item.scenarioData as CycleCountData | undefined

  const systemQty = data?.systemQty ?? 0
  const physicalQty = data?.physicalQty ?? 0
  const variance = data?.variance ?? physicalQty - systemQty
  const isNegativeVariance = variance < 0

  const handleApprove = () => {
    updateStatus(item.id, 'Approved')
    onClose()
  }

  const handleInvestigate = () => {
    updateStatus(item.id, 'InProgress')
    onClose()
  }

  const slaBreached = item.slaDeadline && new Date(item.slaDeadline).getTime() < Date.now()
  const slaRisk =
    !slaBreached &&
    item.slaDeadline &&
    new Date(item.slaDeadline).getTime() - Date.now() < 4 * 60 * 60 * 1000

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-amber-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100">
              <ClipboardList size={22} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">库存盘点差异确认</h1>
              <p className="text-xs text-gray-500 mt-0.5">Cycle Count Approval — {item.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
              {item.status}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Main content ─────────────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* SLA banner */}
          {item.slaDeadline && (slaBreached || slaRisk) && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
              slaBreached ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-orange-50 border border-orange-200 text-orange-700'
            }`}>
              <AlertTriangle size={15} />
              <Clock size={14} />
              SLA 截止：{formatDate(item.slaDeadline)}
              {slaBreached && <span className="font-bold ml-1">— 已超时</span>}
              {slaRisk && <span className="font-bold ml-1">— 即将到期</span>}
            </div>
          )}

          {/* ── COUNT COMPARISON — key visual ──────────────────────────────────── */}
          <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-2">
              <ClipboardList size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">盘点数量对比 / Count Comparison</span>
            </div>

            <div className="p-6">
              {/* SKU identity */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gray-100">
                  <Package size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{data?.skuName ?? '—'}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{data?.skuId ?? '—'}</p>
                </div>
              </div>

              {/* Big side-by-side boxes */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* System qty */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                    系统数量
                  </p>
                  <p className="text-xs text-blue-400 mb-3">System Count</p>
                  <p className="text-6xl font-black text-blue-700 leading-none">{systemQty.toLocaleString()}</p>
                  <p className="text-sm text-blue-500 mt-2">件</p>
                </div>

                {/* Physical qty */}
                <div className={`border-2 rounded-2xl p-5 text-center ${
                  isNegativeVariance
                    ? 'bg-red-50 border-red-200'
                    : variance === 0
                    ? 'bg-green-50 border-green-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                    isNegativeVariance ? 'text-red-600' : 'text-green-600'
                  }`}>
                    实盘数量
                  </p>
                  <p className={`text-xs mb-3 ${isNegativeVariance ? 'text-red-400' : 'text-green-400'}`}>
                    Physical Count
                  </p>
                  <p className={`text-6xl font-black leading-none ${
                    isNegativeVariance ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {physicalQty.toLocaleString()}
                  </p>
                  <p className={`text-sm mt-2 ${isNegativeVariance ? 'text-red-500' : 'text-green-500'}`}>件</p>
                </div>
              </div>

              {/* Variance badge */}
              <div className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl ${
                variance === 0
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {variance !== 0 && <AlertTriangle size={16} className="text-red-500" />}
                <span className={`text-lg font-black ${variance === 0 ? 'text-green-700' : 'text-red-700'}`}>
                  差异 Variance:&nbsp;
                  {variance >= 0 ? '+' : ''}{variance} 件
                </span>
              </div>

              {/* Counted by + date */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={14} className="text-gray-400" />
                  <span>盘点人：</span>
                  <span className="font-medium text-gray-700">{data?.countedBy ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  <span>盘点日期：</span>
                  <span className="font-medium text-gray-700">{data?.countDate ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── VARIANCE ANALYSIS ──────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
              <Search size={15} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">差异原因分析 / Variance Analysis</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">
                库存差异通常由以下原因引起，请结合实际情况判断：
              </p>
              <ul className="space-y-2.5">
                {[
                  { icon: '📦', text: '货物损坏被丢弃（未记录）', sub: 'Damaged goods discarded without system update' },
                  { icon: '🔢', text: '拣货误差（多拣 / 少拣）', sub: 'Pick errors — over-pick or short-pick' },
                  { icon: '💻', text: '系统录入错误', sub: 'Data entry error in WMS or ERP' },
                  { icon: '🌱', text: '自然损耗', sub: 'Natural shrinkage / breakage over time' },
                ].map(({ icon, text, sub }) => (
                  <li key={text} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
                    <span className="text-base mt-0.5 shrink-0">{icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <Search size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  如需进一步调查，可申请照片存证或 SKU 专项检查
                  <span className="text-blue-500">（Photo Evidence / SKU Inspection）</span>，
                  点击下方推荐操作或选择"调查差异原因"。
                </p>
              </div>
            </div>
          </div>

          {/* ── RECOMMENDED ACTIONS ────────────────────────────────────────────── */}
          {item.recommendedActions && item.recommendedActions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                <span className="text-sm font-semibold text-gray-700">推荐操作 / Recommended Actions</span>
              </div>
              <div className="p-5 space-y-2">
                {item.recommendedActions.map((action) => (
                  <button
                    key={action.id}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                      action.variant === 'primary'
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800'
                        : action.variant === 'warning'
                        ? 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800'
                        : action.variant === 'danger'
                        ? 'bg-red-50 border-red-200 hover:bg-red-100 text-red-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{action.description}</p>
                    </div>
                    {action.serviceId && (
                      <span className="text-xs opacity-50 font-mono mt-0.5">{action.serviceId}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── DECISION SECTION ───────────────────────────────────────────────── */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden shadow-md">
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-2">
              <CheckCircle size={15} className="text-amber-600" />
              <span className="text-sm font-bold text-amber-800">需要您的决策 / Your Decision Required</span>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                盘点已完成，系统库存与实际库存存在差异。请选择处理方式：
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Approve */}
                <button
                  onClick={() => setConfirming('approve')}
                  disabled={item.status === 'Approved'}
                  className="flex flex-col items-center gap-2 px-5 py-5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <CheckCircle size={28} />
                  <div className="text-center">
                    <p className="font-bold text-base">批准库存调整</p>
                    <p className="text-green-100 text-xs mt-1">Approve Adjustment</p>
                  </div>
                </button>

                {/* Investigate */}
                <button
                  onClick={() => setConfirming('investigate')}
                  disabled={item.status === 'InProgress'}
                  className="flex flex-col items-center gap-2 px-5 py-5 bg-white text-red-600 border-2 border-red-400 rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Search size={28} />
                  <div className="text-center">
                    <p className="font-bold text-base">调查差异原因</p>
                    <p className="text-red-400 text-xs mt-1">Investigate</p>
                  </div>
                </button>
              </div>

              {/* Irreversibility warning */}
              <div className="mt-5 flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <AlertTriangle size={13} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  批准后，系统库存将从{' '}
                  <span className="font-bold text-blue-700">{systemQty.toLocaleString()} 件</span>{' '}
                  调整为{' '}
                  <span className="font-bold text-green-700">{physicalQty.toLocaleString()} 件</span>，
                  此操作不可逆。选择"调查"将工单置为进行中，暂不修改库存。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">工单信息 / Details</h3>
            <div className="space-y-3">
              <DetailRow label="工单 ID" value={item.id} icon={<Tag size={13} />} />
              <DetailRow label="负责人 Owner" value={item.owner} icon={<User size={13} />} />
              {item.assignee && (
                <DetailRow label="处理人 Assignee" value={item.assignee} icon={<User size={13} />} />
              )}
              {item.customerCode && (
                <DetailRow label="客户 Customer" value={item.customerCode} icon={<Tag size={13} />} />
              )}
              {item.warehouseCode && (
                <DetailRow label="仓库 Warehouse" value={item.warehouseCode} icon={<Tag size={13} />} />
              )}
              {item.relatedObjectId && (
                <DetailRow
                  label={item.relatedObjectType ?? 'Related'}
                  value={item.relatedObjectId}
                  icon={<Tag size={13} />}
                />
              )}
              <DetailRow
                label="创建时间 Created"
                value={new Date(item.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                icon={<Clock size={13} />}
              />
              {item.slaDeadline && (
                <DetailRow
                  label="SLA 截止"
                  value={formatDate(item.slaDeadline)}
                  icon={<Clock size={13} className={slaBreached ? 'text-red-500' : slaRisk ? 'text-orange-500' : ''} />}
                />
              )}
            </div>

            {/* Priority + status chips */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
              <span className={`text-xs font-bold ${PRIORITY_COLORS[item.priority]}`}>
                ● {item.priority}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
                {item.status}
              </span>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SKU snapshot */}
          {data && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Package size={13} />
                SKU 信息
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">SKU ID</span>
                  <span className="font-mono text-xs font-semibold text-gray-800">{data.skuId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">品名</span>
                  <span className="font-medium text-gray-800 text-right max-w-[120px] leading-tight">{data.skuName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-amber-200">
                  <span className="text-gray-500">系统库存</span>
                  <span className="font-bold text-blue-700">{data.systemQty.toLocaleString()} 件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">实盘库存</span>
                  <span className={`font-bold ${isNegativeVariance ? 'text-red-700' : 'text-green-700'}`}>
                    {data.physicalQty.toLocaleString()} 件
                  </span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${isNegativeVariance ? 'border-red-200' : 'border-green-200'}`}>
                  <span className="text-gray-500">差异</span>
                  <span className={`font-black text-base ${isNegativeVariance ? 'text-red-600' : 'text-green-600'}`}>
                    {variance >= 0 ? '+' : ''}{variance} 件
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* No billing note */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">库存盘点确认无额外收费</p>
            <p className="text-xs text-gray-300 mt-0.5">No billing for cycle count approval</p>
          </div>

        </div>
      </div>

      {/* ── Confirmation overlay ──────────────────────────────────────────────── */}
      {confirming && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {confirming === 'approve' ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">确认批准库存调整</h2>
                    <p className="text-xs text-gray-500">Confirm Approve Adjustment</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  批准后，系统库存将从{' '}
                  <span className="font-bold text-blue-700">{systemQty.toLocaleString()} 件</span>{' '}
                  调整为{' '}
                  <span className="font-bold text-green-700">{physicalQty.toLocaleString()} 件</span>。
                </p>
                <p className="text-sm font-semibold text-red-600 mb-6">此操作不可逆，请确认后继续。</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirming(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    确认批准
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-red-100">
                    <Search size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">发起差异调查</h2>
                    <p className="text-xs text-gray-500">Initiate Investigation</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  工单将切换为"进行中"状态，仓库团队将对差异原因展开调查。
                  系统库存暂不调整，待调查结论后再做决定。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirming(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleInvestigate}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    确认调查
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
