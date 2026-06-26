import { useState } from 'react'
import { X, Info } from 'lucide-react'
import type { WorkItemDriver, WorkItemPriority } from '../../../types/workItem'
import { DRIVER_LABELS, DRIVER_DESCRIPTIONS, DRIVER_COLORS } from '../../../types/workItem'

interface Props { onClose: () => void }

// Driver automatically maps to a work item type
const DRIVER_TYPE_MAP: Record<WorkItemDriver, string> = {
  IssueDriven:        'Alert',
  RequestDriven:      'Request',
  ApprovalDriven:     'Approval',
  EventDriven:        'Alert',
  PlanningDriven:     'Task',
  CollaborationDriven: 'Project',
}

const DRIVER_ORDER: WorkItemDriver[] = [
  'IssueDriven',
  'RequestDriven',
  'ApprovalDriven',
  'EventDriven',
  'PlanningDriven',
  'CollaborationDriven',
]

export default function CreateWorkItemModal({ onClose }: Props) {
  const [form, setForm] = useState({
    driver: 'RequestDriven' as WorkItemDriver,
    title: '',
    description: '',
    priority: 'Medium' as WorkItemPriority,
    assignee: '',
    relatedObjectType: '',
    relatedObjectId: '',
    isChargeable: false,
    estimatedFee: '',
    customerCode: '',
  })

  const handle = (field: keyof typeof form, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }))

  const submit = () => {
    if (!form.title.trim()) return
    onClose()
  }

  const derivedType = DRIVER_TYPE_MAP[form.driver]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">发起新请求</h2>
            <p className="text-xs text-gray-400 mt-0.5">选择业务场景，填写关键信息</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">

          {/* 场景类型 — single combined field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">场景类型 *</label>
            <div className="grid grid-cols-2 gap-2">
              {DRIVER_ORDER.map((d) => {
                const active = form.driver === d
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handle('driver', d)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      active
                        ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-300'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded-full mb-1 ${DRIVER_COLORS[d]}`}>
                      {DRIVER_LABELS[d]}
                    </span>
                    <p className="text-xs text-gray-500 leading-snug line-clamp-2">
                      {DRIVER_DESCRIPTIONS[d]}
                    </p>
                  </button>
                )
              })}
            </div>
            {/* Derived type hint */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <Info size={11} />
              <span>事项类型将自动设为 <strong className="text-gray-600">{derivedType}</strong></span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">优先级</label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as WorkItemPriority[]).map((p) => {
                const active = form.priority === p
                const colors: Record<WorkItemPriority, string> = {
                  Low: 'border-gray-300 text-gray-500',
                  Medium: 'border-blue-300 text-blue-600',
                  High: 'border-orange-300 text-orange-600',
                  Critical: 'border-red-300 text-red-600',
                }
                const labels: Record<WorkItemPriority, string> = {
                  Low: '低', Medium: '中', High: '高', Critical: '紧急',
                }
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handle('priority', p)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      active ? colors[p] + ' bg-current/5' : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                    style={active ? { backgroundColor: 'rgba(0,0,0,0.04)' } : {}}
                  >
                    {labels[p]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">标题 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handle('title', e.target.value)}
              placeholder="简短、清晰地描述事项..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">详情说明</label>
            <textarea
              value={form.description}
              onChange={(e) => handle('description', e.target.value)}
              rows={3}
              placeholder="详细描述问题或需求..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Customer + Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">客户编码</label>
              <input
                type="text"
                value={form.customerCode}
                onChange={(e) => handle('customerCode', e.target.value)}
                placeholder="e.g. FASHIONWAVE"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">负责人</label>
              <input
                type="text"
                value={form.assignee}
                onChange={(e) => handle('assignee', e.target.value)}
                placeholder="团队或个人"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Related Object */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">关联对象类型</label>
              <input
                type="text"
                value={form.relatedObjectType}
                onChange={(e) => handle('relatedObjectType', e.target.value)}
                placeholder="e.g. 订单, SKU, 批次"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">关联对象 ID</label>
              <input
                type="text"
                value={form.relatedObjectId}
                onChange={(e) => handle('relatedObjectId', e.target.value)}
                placeholder="e.g. ORD-0012"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Chargeable */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isChargeable}
                onChange={(e) => handle('isChargeable', e.target.checked)}
                className="rounded"
              />
              计费项目
            </label>
            {form.isChargeable && (
              <input
                type="number"
                value={form.estimatedFee}
                onChange={(e) => handle('estimatedFee', e.target.value)}
                placeholder="预估金额 (USD)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            取消
          </button>
          <button
            onClick={submit}
            disabled={!form.title.trim()}
            className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            提交请求
          </button>
        </div>
      </div>
    </div>
  )
}
