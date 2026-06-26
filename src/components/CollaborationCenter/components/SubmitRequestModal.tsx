import { useState } from 'react'
import {
  X, ChevronRight, Paperclip, Sparkles,
  Zap, Package, Truck, Camera, ClipboardList,
  RotateCcw, CheckCircle2, Info,
  ShoppingCart, ArrowRight, AlertCircle,
} from 'lucide-react'
import { SERVICE_CATALOG, type ServiceDefinition } from '../../../data/serviceCatalog'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { WorkItemPriority, ServiceId } from '../../../types/workItem'

interface Props {
  onClose: () => void
}

// ─── Request topic categories ────────────────────────────────────────────────

interface TopicOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  relatedServices?: ServiceId[]
}

const REQUEST_TOPICS: TopicOption[] = [
  {
    id: 'expedite',
    label: '加急处理',
    description: '订单紧急需要优先出库处理',
    icon: <Zap size={18} className="text-red-500" />,
    relatedServices: ['expedite-processing', 'priority-handling', 'upgrade-shipping'],
  },
  {
    id: 'inventory-issue',
    label: '库存问题',
    description: '库存差异、货损、丢货追踪、临时盘点等',
    icon: <Package size={18} className="text-orange-500" />,
    relatedServices: ['photo-request', 'sku-inspection', 'inventory-audit-service'],
  },
  {
    id: 'shipping-issue',
    label: '运输问题',
    description: '配送延误、地址错误、改派需求',
    icon: <Truck size={18} className="text-blue-500" />,
    relatedServices: ['redirect-shipment', 'hold-shipment', 'upgrade-shipping'],
  },
  {
    id: 'vas-request',
    label: '增值服务',
    description: '组套、贴标、拍照、包装、礼品贺卡等',
    icon: <Camera size={18} className="text-violet-500" />,
    relatedServices: ['kitting', 'bundling', 'repackaging', 'relabeling', 'gift-message', 'photo-request'],
  },
  {
    id: 'inbound-issue',
    label: '入库相关',
    description: '收货差异、到货预约、入库异常',
    icon: <ClipboardList size={18} className="text-green-500" />,
    relatedServices: ['photo-request', 'sku-inspection'],
  },
  {
    id: 'return-disposal',
    label: '退货与处置',
    description: '退货处理、货物销毁、翻修再售',
    icon: <RotateCcw size={18} className="text-amber-600" />,
    relatedServices: ['disposition-service', 'rework-service'],
  },
  {
    id: 'other',
    label: '其他问题',
    description: '上述分类未覆盖的其他业务问题',
    icon: <Info size={18} className="text-gray-500" />,
    relatedServices: [],
  },
]

// ─── Service Payment Panel (inline checkout) ────────────────────────────────

function ServicePaymentPanel({
  service,
  bulletPoints,
  onConfirm,
  onCancel,
}: {
  service: ServiceDefinition
  bulletPoints: string[]
  onConfirm: () => void
  onCancel: () => void
}) {
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  const handlePay = () => {
    setPaying(true)
    // Simulate payment processing
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
      setTimeout(() => onConfirm(), 1200)
    }, 1500)
  }

  if (paid) {
    return (
      <div className="border border-green-300 bg-green-50 rounded-xl p-5 text-center space-y-2">
        <CheckCircle2 size={28} className="text-green-600 mx-auto" />
        <p className="text-sm font-semibold text-green-800">支付成功，服务已开通</p>
        <p className="text-xs text-green-600">正在返回请求页面...</p>
      </div>
    )
  }

  return (
    <div className="border border-primary-200 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Payment header */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-white/80" />
          <span className="text-sm font-semibold text-white">开通服务</span>
        </div>
        <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Service info */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900">{service.nameCn}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{service.name} · {service.tagline}</p>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>

        {bulletPoints.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">服务价值</p>
            {bulletPoints.map((point, i) => (
              <p key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <CheckCircle2 size={10} className="text-green-500 mt-0.5 shrink-0" />
                <span>{point}</span>
              </p>
            ))}
          </div>
        )}

        {/* Pricing summary */}
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">服务费用</span>
            <span className="text-lg font-bold text-gray-900">{service.price}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>{service.priceNote}</span>
            <span>按需计费 · 随时可取消</span>
          </div>
        </div>

        {/* Payment method (simulated) */}
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-[11px] font-medium text-gray-500 mb-2">支付方式</p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="text-primary-600" />
              <span className="text-xs text-gray-700">账户余额扣款</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payment" className="text-primary-600" />
              <span className="text-xs text-gray-700">月结账单</span>
            </label>
          </div>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="mt-0.5 rounded text-primary-600" />
          <span className="text-[11px] text-gray-500 leading-relaxed">
            我已阅读并同意<span className="text-primary-600">《增值服务协议》</span>，确认开通后服务即时生效
          </span>
        </label>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-xs font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handlePay}
            disabled={paying}
            className="flex-[2] py-2.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
          >
            {paying ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                处理中...
              </>
            ) : (
              <>
                确认支付 {service.price}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inline Service Upsell Card ──────────────────────────────────────────────

function InlineServiceCard({
  service,
  isPurchased,
  onPurchase,
}: {
  service: ServiceDefinition
  isPurchased: boolean
  onPurchase: () => void
}) {
  const [showDetail, setShowDetail] = useState(false)
  const [justPurchased, setJustPurchased] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const bulletPoints = service.businessValue
    .split('；')
    .map((s) => s.trim())
    .filter(Boolean)

  const handlePurchaseComplete = () => {
    onPurchase()
    setJustPurchased(true)
    setShowPayment(false)
    setShowDetail(false)
  }

  // Just purchased success state
  if (justPurchased) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center gap-3">
        <CheckCircle2 size={16} className="text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-green-800">{service.nameCn} 已开通</p>
          <p className="text-[11px] text-green-600">本次请求可直接使用此服务</p>
        </div>
      </div>
    )
  }

  // Already purchased
  if (isPurchased) {
    return (
      <div className="border border-green-100 bg-green-50/50 rounded-lg p-3 flex items-center gap-3">
        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-green-700">{service.nameCn}</span>
          <span className="text-[11px] text-green-500 ml-2">已开通 · 可直接使用</span>
        </div>
      </div>
    )
  }

  // Payment page overlay
  if (showPayment) {
    return (
      <ServicePaymentPanel
        service={service}
        bulletPoints={bulletPoints}
        onConfirm={handlePurchaseComplete}
        onCancel={() => setShowPayment(false)}
      />
    )
  }

  // Not purchased — show with expand option
  return (
    <div className={`border rounded-lg transition-all ${showDetail ? 'border-primary-200 shadow-sm' : 'border-gray-200'}`}>
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowDetail(!showDetail)}
      >
        <AlertCircle size={14} className="text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-gray-800">{service.nameCn}</span>
          <span className="text-[11px] text-gray-400 ml-1.5">· {service.tagline}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-gray-700">{service.price}</span>
          <span className="text-[10px] text-primary-600 font-medium">
            {showDetail ? '收起' : '了解详情'}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {showDetail && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-2.5 space-y-2.5">
          <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
          {bulletPoints.length > 0 && (
            <ul className="space-y-1">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                  <CheckCircle2 size={10} className="text-primary-400 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between bg-gray-50 rounded-md px-2.5 py-2">
            <div>
              <span className="text-sm font-bold text-gray-900">{service.price}</span>
              <span className="text-[11px] text-gray-400 ml-1">{service.priceNote}</span>
            </div>
            <span className="text-[10px] text-gray-400">按需计费 · 随时取消</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowPayment(true) }}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart size={12} />
            开通服务，立即可用
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SubmitRequestModal({ onClose }: Props) {
  const { purchasedServices, purchaseService } = useCollaboration()
  const [step, setStep] = useState<'topic' | 'details' | 'confirm'>('topic')
  const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [form, setForm] = useState({
    subject: '',
    description: '',
    priority: 'Medium' as WorkItemPriority,
    relatedObjectType: '',
    relatedObjectId: '',
  })

  const handle = (field: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  // Related services for the selected topic
  const relatedServices = selectedTopic?.relatedServices
    ?.map((id) => SERVICE_CATALOG[id])
    .filter(Boolean) ?? []

  const hasRelatedServices = relatedServices.length > 0

  // Check if any services need to be purchased
  const unpurchasedServices = relatedServices.filter((s) => !purchasedServices.has(s.id))
  const purchasedRelated = relatedServices.filter((s) => purchasedServices.has(s.id))

  // Navigation
  const goNext = () => {
    if (step === 'topic' && selectedTopic) setStep('details')
    else if (step === 'details') setStep('confirm')
  }

  const goBack = () => {
    if (step === 'details') setStep('topic')
    else if (step === 'confirm') setStep('details')
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const stepLabels = { topic: '选择类型', details: '填写详情', confirm: '确认提交' }
  const steps: ('topic' | 'details' | 'confirm')[] = ['topic', 'details', 'confirm']

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">请求已提交</h3>
          <p className="text-sm text-gray-500 mb-1">您的请求已成功提交，我们将尽快处理。</p>
          <p className="text-xs text-gray-400 mb-6">您可以在「My Requests」中跟踪处理进度。</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    )
  }

  // ── Main modal ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Submit a Request</h2>
            <p className="text-xs text-gray-400 mt-0.5">{stepLabels[step]}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-3 pb-1">
          <div className="flex items-center gap-1">
            {steps.map((s, idx) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full transition-colors ${
                  steps.indexOf(step) >= idx ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* ═══ Step 1: Topic ═══ */}
          {step === 'topic' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">请选择您遇到的问题类型，以便我们更快地为您处理：</p>
              <div className="grid grid-cols-1 gap-2">
                {REQUEST_TOPICS.map((topic) => {
                  const isSelected = selectedTopic?.id === topic.id
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="shrink-0">{topic.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{topic.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{topic.description}</p>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="text-primary-600 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ═══ Step 2: Details + Inline Services ═══ */}
          {step === 'details' && (
            <div className="space-y-4">

              {/* Related services banner — shown inline when topic has services */}
              {hasRelatedServices && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles size={15} className="text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        此类请求可以为您提供以下增值服务
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        已开通的服务我们会直接为您处理；未开通的服务开通后即可在本次请求中使用，帮助您更高效地解决问题。
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {relatedServices.map((service) => (
                      <InlineServiceCard
                        key={service.id}
                        service={service}
                        isPurchased={purchasedServices.has(service.id)}
                        onPurchase={() => purchaseService(service.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handle('subject', e.target.value)}
                  placeholder="Brief summary of your issue..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High', 'Critical'] as WorkItemPriority[]).map((p) => {
                    const isActive = form.priority === p
                    const styles: Record<WorkItemPriority, string> = {
                      Low: 'border-gray-300 text-gray-600 bg-gray-50',
                      Medium: 'border-blue-300 text-blue-700 bg-blue-50',
                      High: 'border-orange-300 text-orange-700 bg-orange-50',
                      Critical: 'border-red-300 text-red-700 bg-red-50',
                    }
                    const labels: Record<WorkItemPriority, string> = {
                      Low: 'Low', Medium: 'Medium', High: 'High', Critical: 'Urgent',
                    }
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handle('priority', p)}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                          isActive ? styles[p] : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {labels[p]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handle('description', e.target.value)}
                  rows={3}
                  placeholder="Provide detailed information about the issue..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  请详细描述您的需求，我们的团队会尽快响应。
                </p>
              </div>

              {/* Related Object */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Related Object Type</label>
                  <select
                    value={form.relatedObjectType}
                    onChange={(e) => handle('relatedObjectType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="Order">Order</option>
                    <option value="SKU">SKU</option>
                    <option value="Shipment">Shipment</option>
                    <option value="PO">Purchase Order</option>
                    <option value="ASN">ASN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Related ID</label>
                  <input
                    type="text"
                    value={form.relatedObjectId}
                    onChange={(e) => handle('relatedObjectId', e.target.value)}
                    placeholder="e.g. ORD-20260624-5521"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Attachments</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors cursor-pointer">
                  <Paperclip size={16} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">
                    <span className="text-primary-600 font-medium">Add file</span> or drop files here
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 3: Confirm ═══ */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Request Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-900 font-medium">{selectedTopic?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subject</span>
                  <span className="text-gray-900 font-medium truncate ml-4 max-w-[260px]">{form.subject || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Priority</span>
                  <span className={`font-medium ${
                    form.priority === 'Critical' ? 'text-red-600' :
                    form.priority === 'High' ? 'text-orange-600' :
                    form.priority === 'Medium' ? 'text-blue-600' : 'text-gray-600'
                  }`}>{form.priority}</span>
                </div>
                {form.relatedObjectId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Related</span>
                    <span className="text-gray-900 font-mono text-xs">{form.relatedObjectType} — {form.relatedObjectId}</span>
                  </div>
                )}
                {form.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{form.description}</p>
                  </div>
                )}

                {/* Show available services */}
                {purchasedRelated.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1.5">已开通的相关服务（我们会直接为您安排）</p>
                    <div className="flex flex-wrap gap-1.5">
                      {purchasedRelated.map((s) => (
                        <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                          <CheckCircle2 size={9} />
                          {s.nameCn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center">
                Submitting this request will create a ticket. Our team will review and respond within 1 business day.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            {step !== 'topic' && (
              <button
                onClick={goBack}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {step === 'confirm' ? (
              <button
                onClick={handleSubmit}
                disabled={!form.subject.trim() || !form.description.trim()}
                className="px-5 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={step === 'topic' ? !selectedTopic : !form.subject.trim()}
                className="flex items-center gap-1.5 px-5 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {step === 'details' ? 'Next' : 'Next'}
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
