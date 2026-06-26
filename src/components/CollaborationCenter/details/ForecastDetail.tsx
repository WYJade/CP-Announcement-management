import { useState } from 'react'
import {
  X, Truck, TrendingUp, Star, Calendar, Package, CheckSquare, Square,
  MessageSquare, Send, User, Bot, Clock, DollarSign, Phone, ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { WorkItem, ForecastData } from '../../../types/workItem'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../../types/workItem'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function daysUntil(ts: string): number {
  const diff = new Date(ts).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface ChecklistProps {
  items: string[]
  checked: boolean[]
  onToggle: (idx: number) => void
  accentClass: string
}

function Checklist({ items, checked, onToggle, accentClass }: ChecklistProps) {
  return (
    <ul className="space-y-2">
      {items.map((label, i) => (
        <li key={i} className="flex items-center gap-3">
          <button
            onClick={() => onToggle(i)}
            className={`shrink-0 transition-colors ${checked[i] ? accentClass : 'text-gray-300 hover:text-gray-400'}`}
          >
            {checked[i] ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>
          <span className={`text-sm ${checked[i] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {label}
          </span>
        </li>
      ))}
    </ul>
  )
}

interface SidebarProps {
  item: WorkItem
  data: ForecastData
  accentBg: string
  accentText: string
  accentBorder: string
}

function EventSidebar({ item, data, accentBg, accentText, accentBorder }: SidebarProps) {
  return (
    <div className="space-y-4">
      {/* Event summary */}
      <div className={`rounded-xl border ${accentBorder} ${accentBg} p-4`}>
        <h3 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${accentText}`}>
          事件摘要
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">事件</span>
            <span className="font-medium text-gray-800">{data.eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">预计数量</span>
            <span className="font-medium text-gray-800">{data.expectedQty.toLocaleString()} 件</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">目标日期</span>
            <span className="font-medium text-gray-800">{formatDate(data.targetDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">优先级</span>
            <span className={`font-bold ${PRIORITY_COLORS[item.priority]}`}>● {item.priority}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">状态</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
              {item.status}
            </span>
          </div>
        </div>
      </div>

      {/* Cost estimate */}
      {item.isChargeable && item.estimatedFee != null && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <DollarSign size={12} />
            费用预估
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">预估费用</span>
              <span className="font-semibold text-gray-900">
                {item.currency ?? 'CNY'} {item.estimatedFee.toLocaleString()}
              </span>
            </div>
            {item.actualFee != null && (
              <div className="flex justify-between pt-1 border-t border-green-200">
                <span className="text-gray-500">实际费用</span>
                <span className="font-semibold text-gray-900">
                  {item.currency ?? 'CNY'} {item.actualFee.toLocaleString()}
                </span>
              </div>
            )}
            {item.billingStatus && (
              <div className="flex justify-between">
                <span className="text-gray-500">账单状态</span>
                <span className="font-semibold text-green-700">{item.billingStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Phone size={12} />
          联系信息
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <User size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-gray-400">负责人</div>
              <div className="font-medium text-gray-800">{item.owner}</div>
            </div>
          </div>
          {item.assignee && (
            <div className="flex items-start gap-2">
              <User size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-400">执行人</div>
                <div className="font-medium text-gray-800">{item.assignee}</div>
              </div>
            </div>
          )}
          {item.customerCode && (
            <div className="flex items-start gap-2">
              <Clock size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-400">客户编码</div>
                <div className="font-medium text-gray-800">{item.customerCode}</div>
              </div>
            </div>
          )}
          {item.warehouseCode && (
            <div className="flex items-start gap-2">
              <Clock size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-400">仓库编码</div>
                <div className="font-medium text-gray-800">{item.warehouseCode}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">标签</h3>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── scenario sections ────────────────────────────────────────────────────────

interface InboundForecastContentProps {
  item: WorkItem
  data: ForecastData
  checked: boolean[]
  onToggle: (i: number) => void
  onConfirm: () => void
  onAdjust: () => void
}

function InboundForecastContent({
  item, data, checked, onToggle, onConfirm, onAdjust,
}: InboundForecastContentProps) {
  return (
    <>
      {/* Big stat */}
      <div className="bg-white border border-blue-200 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-700">
              {data.expectedQty.toLocaleString()} 件
            </div>
            <div className="text-sm text-gray-500 mt-1">预计到货数量</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-800">
              {formatDate(data.targetDate)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 justify-end">
              <Calendar size={12} />
              目标到货日期
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-100 text-sm text-gray-600">
          {item.description}
        </div>
      </div>

      {/* SKU list */}
      {data.skus && data.skus.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package size={15} className="text-blue-600" />
            SKU 清单
          </h3>
          <div className="space-y-2">
            {data.skus.map((sku, i) => (
              <div key={i} className="flex items-center gap-2 py-2 px-3 bg-blue-50 rounded-lg text-sm">
                <ChevronRight size={13} className="text-blue-400 shrink-0" />
                <span className="font-mono text-blue-800">{sku}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warehouse prep checklist */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <CheckSquare size={15} className="text-blue-600" />
          仓库准备清单
          <span className="ml-auto text-xs text-gray-400">
            {checked.filter(Boolean).length}/{data.prepItems.length} 已完成
          </span>
        </h3>
        <Checklist
          items={data.prepItems}
          checked={checked}
          onToggle={onToggle}
          accentClass="text-blue-600"
        />
        {/* progress bar */}
        <div className="mt-4">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${data.prepItems.length > 0 ? (checked.filter(Boolean).length / data.prepItems.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          确认到货计划
        </button>
        <button
          onClick={onAdjust}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          需要调整
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PromotionForecastContentProps {
  item: WorkItem
  data: ForecastData
  checked: boolean[]
  onToggle: (i: number) => void
  onConfirm: () => void
  onRequestCapacity: () => void
}

function PromotionForecastContent({
  item, data, checked, onToggle, onConfirm, onRequestCapacity,
}: PromotionForecastContentProps) {
  const completedCount = checked.filter(Boolean).length
  const total = data.prepItems.length

  return (
    <>
      {/* Event name banner */}
      <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-80">促销活动</span>
        </div>
        <div className="text-2xl font-bold">{data.eventName}</div>
        <div className="text-sm opacity-90 mt-1">{item.title}</div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            {data.expectedQty.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">预计备货数量（件）</div>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {daysUntil(data.targetDate)}
          </div>
          <div className="text-xs text-gray-500 mt-1">距活动还有（天）</div>
        </div>
      </div>

      {/* Capacity requirements table */}
      {data.skus && data.skus.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package size={15} className="text-green-600" />
            产能需求 — SKU 清单
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-medium pb-2">#</th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-2">SKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.skus.map((sku, i) => (
                  <tr key={i}>
                    <td className="py-1.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-1.5 font-mono text-gray-800">{sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prep checklist */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
          <CheckSquare size={15} className="text-orange-500" />
          备货准备清单
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          已完成 {completedCount}/{total} 项准备工作
        </p>
        <Checklist
          items={data.prepItems}
          checked={checked}
          onToggle={onToggle}
          accentClass="text-orange-500"
        />
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>整体进度</span>
            <span>{total > 0 ? Math.round((completedCount / total) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${total > 0 ? (completedCount / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          确认备货计划
        </button>
        <button
          onClick={onRequestCapacity}
          className="flex-1 py-2.5 border border-orange-400 text-orange-600 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors"
        >
          请求产能支持
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface LaunchEventContentProps {
  item: WorkItem
  data: ForecastData
  checked: boolean[]
  onToggle: (i: number) => void
  onConfirm: () => void
}

function LaunchEventContent({
  item: _item, data, checked, onToggle, onConfirm,
}: LaunchEventContentProps) {
  const days = daysUntil(data.targetDate)
  const completedCount = checked.filter(Boolean).length
  const total = data.prepItems.length
  const allDone = completedCount === total && total > 0

  return (
    <>
      {/* Launch countdown */}
      <div className="rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Star size={18} className="text-yellow-300" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-80">新品发布</span>
        </div>
        <div className="text-4xl font-black mb-1">{days} 天</div>
        <div className="text-sm opacity-80">距发布还有 · {formatDate(data.targetDate)}</div>
        <div className="mt-3 text-base font-semibold">{data.eventName}</div>
      </div>

      {/* SKU info */}
      {data.skus && data.skus.length > 0 && (
        <div className="bg-white border border-purple-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package size={15} className="text-purple-600" />
            新品 SKU 信息
          </h3>
          <div className="space-y-2">
            {data.skus.map((sku, i) => (
              <div key={i} className="flex items-center gap-2 py-2 px-3 bg-purple-50 rounded-lg text-sm">
                <Star size={12} className="text-purple-400 shrink-0" />
                <span className="font-mono text-purple-800">{sku}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive prep checklist */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CheckSquare size={15} className="text-purple-600" />
            发布准备清单
          </h3>
          {allDone && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              <CheckSquare size={12} />
              全部完成
            </span>
          )}
        </div>
        <Checklist
          items={data.prepItems}
          checked={checked}
          onToggle={onToggle}
          accentClass="text-purple-600"
        />
        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completedCount}/{total} 项已完成</span>
            <span>{total > 0 ? Math.round((completedCount / total) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${total > 0 ? (completedCount / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {!allDone && (
          <p className="mt-3 text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle size={12} />
            请完成所有准备项后再确认就绪
          </p>
        )}
      </div>

      {/* Action */}
      <div>
        <button
          onClick={onConfirm}
          disabled={!allDone}
          className="w-full py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          确认已就绪
        </button>
        {!allDone && (
          <p className="text-center text-xs text-gray-400 mt-1.5">
            请先完成所有准备清单项
          </p>
        )}
      </div>
    </>
  )
}

// ─── comments section ─────────────────────────────────────────────────────────

interface CommentsSectionProps {
  item: WorkItem
  onAddComment: (text: string, isInternal: boolean) => void
}

function CommentsSection({ item, onAddComment }: CommentsSectionProps) {
  const [commentText, setCommentText] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const submit = () => {
    if (!commentText.trim()) return
    onAddComment(commentText, isInternal)
    setCommentText('')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <MessageSquare size={15} />
        沟通记录 ({item.comments.length})
      </h3>

      <div className="space-y-3 mb-5">
        {item.comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">暂无评论</p>
        )}
        {item.comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg p-3 ${
              c.isInternal
                ? 'bg-yellow-50 border border-yellow-100'
                : c.role === 'Agent'
                ? 'bg-violet-50 border border-violet-100'
                : c.role === 'Customer'
                ? 'bg-blue-50 border border-blue-100'
                : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {c.role === 'Agent' ? (
                <Bot size={13} className="text-violet-600" />
              ) : (
                <User size={13} className="text-gray-500" />
              )}
              <span className="text-xs font-medium text-gray-700">{c.author}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{formatDateTime(c.createdAt)}</span>
              {c.isInternal && (
                <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                  内部备注
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{c.content}</p>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="添加评论或备注…"
          rows={3}
          className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded"
            />
            内部备注（客户不可见）
          </label>
          <button
            onClick={submit}
            disabled={!commentText.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            <Send size={12} />
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

interface ForecastDetailProps {
  item: WorkItem
  onClose: () => void
}

export default function ForecastDetail({ item, onClose }: ForecastDetailProps) {
  const { addComment, updateStatus } = useCollaboration()

  const data = item.scenarioData as ForecastData | undefined

  // Initialise checklist state from prepItems length
  const [checked, setChecked] = useState<boolean[]>(() =>
    (data?.prepItems ?? []).map(() => false)
  )

  const toggleChecked = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)))
  }

  const handleAddComment = (text: string, isInternal: boolean) => {
    addComment(item.id, {
      author: '当前用户',
      role: 'Customer',
      content: text,
      createdAt: new Date().toISOString(),
      isInternal,
    })
  }

  const handleConfirmPlan = () => {
    updateStatus(item.id, 'Approved', '计划已确认')
    onClose()
  }

  const handleAdjust = () => {
    addComment(item.id, {
      author: '当前用户',
      role: 'Customer',
      content: '客户请求调整到货计划，请联系协调。',
      createdAt: new Date().toISOString(),
      isInternal: false,
    })
  }

  const handleRequestCapacity = () => {
    addComment(item.id, {
      author: '当前用户',
      role: 'Customer',
      content: '客户请求额外产能支持，请安排评估。',
      createdAt: new Date().toISOString(),
      isInternal: false,
    })
  }

  // Scenario-specific theme config
  const themeMap = {
    'inbound-forecast': {
      icon: <Truck size={20} className="text-blue-600" />,
      title: '到货预报确认',
      iconBg: 'bg-blue-100',
      headerBg: 'bg-blue-50 border-blue-200',
      titleColor: 'text-blue-700',
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-700',
      accentBorder: 'border-blue-200',
    },
    'promotion-forecast': {
      icon: <TrendingUp size={20} className="text-orange-500" />,
      title: '促销备货计划',
      iconBg: 'bg-orange-100',
      headerBg: 'bg-orange-50 border-orange-200',
      titleColor: 'text-orange-700',
      accentBg: 'bg-orange-50',
      accentText: 'text-orange-700',
      accentBorder: 'border-orange-200',
    },
    'launch-event': {
      icon: <Star size={20} className="text-purple-600" />,
      title: '新品发布准备',
      iconBg: 'bg-purple-100',
      headerBg: 'bg-purple-50 border-purple-200',
      titleColor: 'text-purple-700',
      accentBg: 'bg-purple-50',
      accentText: 'text-purple-700',
      accentBorder: 'border-purple-200',
    },
  } as const

  const theme = themeMap[item.scenario as keyof typeof themeMap] ?? themeMap['inbound-forecast']

  if (!data) {
    return (
      <div className="p-6 text-center text-gray-400">
        <AlertCircle size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">无法加载计划数据</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${theme.headerBg}`}>
        <div className={`p-2 rounded-lg ${theme.iconBg} shrink-0`}>
          {theme.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`text-base font-bold ${theme.titleColor}`}>{theme.title}</h2>
          <p className="text-xs text-gray-500 truncate">{item.title}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
            {item.status}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/70 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Main content */}
            <div className="xl:col-span-2 space-y-4">
              {item.scenario === 'inbound-forecast' && (
                <InboundForecastContent
                  item={item}
                  data={data}
                  checked={checked}
                  onToggle={toggleChecked}
                  onConfirm={handleConfirmPlan}
                  onAdjust={handleAdjust}
                />
              )}

              {item.scenario === 'promotion-forecast' && (
                <PromotionForecastContent
                  item={item}
                  data={data}
                  checked={checked}
                  onToggle={toggleChecked}
                  onConfirm={handleConfirmPlan}
                  onRequestCapacity={handleRequestCapacity}
                />
              )}

              {item.scenario === 'launch-event' && (
                <LaunchEventContent
                  item={item}
                  data={data}
                  checked={checked}
                  onToggle={toggleChecked}
                  onConfirm={handleConfirmPlan}
                />
              )}

              {/* Comments */}
              <CommentsSection item={item} onAddComment={handleAddComment} />
            </div>

            {/* Sidebar */}
            <div>
              <EventSidebar
                item={item}
                data={data}
                accentBg={theme.accentBg}
                accentText={theme.accentText}
                accentBorder={theme.accentBorder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
