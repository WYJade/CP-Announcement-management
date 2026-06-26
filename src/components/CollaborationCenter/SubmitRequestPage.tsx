import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, Paperclip, Sparkles,
  Zap, Package, Truck, Camera, ClipboardList,
  RotateCcw, CheckCircle2, Info,
  ShoppingCart, AlertCircle, X, ArrowLeft,
} from 'lucide-react'
import { SERVICE_CATALOG, type ServiceDefinition } from '../../data/serviceCatalog'
import { useCollaboration } from '../../context/CollaborationContext'
import type { WorkItemPriority, ServiceId } from '../../types/workItem'

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
    icon: <Zap size={20} className="text-red-500" />,
    relatedServices: ['expedite-processing', 'priority-handling', 'upgrade-shipping'],
  },
  {
    id: 'inventory-issue',
    label: '库存问题',
    description: '库存差异、货损、丢货追踪、临时盘点等',
    icon: <Package size={20} className="text-orange-500" />,
    relatedServices: ['photo-request', 'sku-inspection', 'inventory-audit-service'],
  },
  {
    id: 'shipping-issue',
    label: '运输问题',
    description: '配送延误、地址错误、改派需求',
    icon: <Truck size={20} className="text-blue-500" />,
    relatedServices: ['redirect-shipment', 'hold-shipment', 'upgrade-shipping'],
  },
  {
    id: 'vas-request',
    label: '增值服务',
    description: '组套、贴标、拍照、包装、礼品贺卡等',
    icon: <Camera size={20} className="text-violet-500" />,
    relatedServices: ['kitting', 'bundling', 'repackaging', 'relabeling', 'gift-message', 'photo-request'],
  },
  {
    id: 'inbound-issue',
    label: '入库相关',
    description: '收货差异、到货预约、入库异常',
    icon: <ClipboardList size={20} className="text-green-500" />,
    relatedServices: ['photo-request', 'sku-inspection'],
  },
  {
    id: 'return-disposal',
    label: '退货与处置',
    description: '退货处理、货物销毁、翻修再售',
    icon: <RotateCcw size={20} className="text-amber-600" />,
    relatedServices: ['disposition-service', 'rework-service'],
  },
  {
    id: 'billing',
    label: '发票/对账',
    description: '账单查询、发票申请、费用对账、付款问题',
    icon: <ClipboardList size={20} className="text-emerald-500" />,
    relatedServices: [],
  },
  {
    id: 'other',
    label: '其他问题',
    description: '上述分类未覆盖的其他业务问题',
    icon: <Info size={20} className="text-gray-500" />,
    relatedServices: [],
  },
]

// ─── Service Payment Panel ───────────────────────────────────────────────────

function ServicePaymentPanel({
  service,
  onConfirm,
  onCancel,
}: {
  service: ServiceDefinition
  onConfirm: () => void
  onCancel: () => void
}) {
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  const bulletPoints = service.businessValue.split('\uFF1B').map((s) => s.trim()).filter(Boolean)

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
      setTimeout(() => onConfirm(), 1200)
    }, 1500)
  }

  if (paid) {
    return (
      <div className="border border-green-300 bg-green-50 rounded-xl p-6 text-center space-y-2">
        <CheckCircle2 size={32} className="text-green-600 mx-auto" />
        <p className="text-sm font-semibold text-green-800">支付成功，服务已开通</p>
        <p className="text-xs text-green-600">正在返回...</p>
      </div>
    )
  }

  return (
    <div className="border border-primary-200 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={15} className="text-white/80" />
          <span className="text-sm font-semibold text-white">开通服务</span>
        </div>
        <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">
          <X size={15} />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-base font-bold text-gray-900">{service.nameCn}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{service.name} · {service.tagline}</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
        {bulletPoints.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">服务价值</p>
            {bulletPoints.map((point, i) => (
              <p key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <CheckCircle2 size={11} className="text-green-500 mt-0.5 shrink-0" />
                <span>{point}</span>
              </p>
            ))}
          </div>
        )}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">服务费用</span>
            <span className="text-xl font-bold text-gray-900">{service.price}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{service.priceNote}</span>
            <span>按需计费 · 随时可取消</span>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">支付方式</p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pay-method" defaultChecked className="text-primary-600" />
              <span className="text-sm text-gray-700">账户余额扣款</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pay-method" className="text-primary-600" />
              <span className="text-sm text-gray-700">月结账单</span>
            </label>
          </div>
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="mt-0.5 rounded text-primary-600" />
          <span className="text-xs text-gray-500 leading-relaxed">
            我已阅读并同意<span className="text-primary-600">《增值服务协议》</span>，确认开通后服务即时生效
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button
            onClick={handlePay}
            disabled={paying}
            className="flex-[2] py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
          >
            {paying ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 处理..</>
            ) : (
              <>确认支付 {service.price}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inline Service Card ─────────────────────────────────────────────────────

function InlineServiceCard({ service, isPurchased, onPurchase }: {
  service: ServiceDefinition; isPurchased: boolean; onPurchase: () => void
}) {
  const [showDetail, setShowDetail] = useState(false)
  const [justPurchased, setJustPurchased] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const handlePurchaseComplete = () => {
    onPurchase()
    setJustPurchased(true)
    setShowPayment(false)
    setShowDetail(false)
  }

  if (justPurchased) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center gap-3">
        <CheckCircle2 size={16} className="text-green-600 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">{service.nameCn} 已开通</p>
          <p className="text-xs text-green-600">本次请求可直接使用此服务</p>
        </div>
      </div>
    )
  }

  if (isPurchased) {
    return (
      <div className="border border-green-100 bg-green-50/50 rounded-lg p-3 flex items-center gap-3">
        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
        <span className="text-sm font-medium text-green-700">{service.nameCn}</span>
        <span className="text-xs text-green-500">已开通 · 可直接使用</span>
      </div>
    )
  }

  if (showPayment) {
    return (
      <ServicePaymentPanel
        service={service}
        onConfirm={handlePurchaseComplete}
        onCancel={() => setShowPayment(false)}
      />
    )
  }

  const bulletPoints = service.businessValue.split('\uFF1B').map((s) => s.trim()).filter(Boolean)

  return (
    <div className={`border rounded-lg transition-all ${showDetail ? 'border-primary-200 shadow-sm' : 'border-gray-200'}`}>
      <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowDetail(!showDetail)}>
        <AlertCircle size={14} className="text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-800">{service.nameCn}</span>
          <span className="text-xs text-gray-400 ml-2">· {service.tagline}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-semibold text-gray-700">{service.price}</span>
          <span className="text-xs text-primary-600 font-medium">{showDetail ? '收起' : '了解开通'}</span>
        </div>
      </div>
      {showDetail && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
          {bulletPoints.length > 0 && (
            <ul className="space-y-1">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                  <CheckCircle2 size={11} className="text-primary-400 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
            <div>
              <span className="text-base font-bold text-gray-900">{service.price}</span>
              <span className="text-xs text-gray-400 ml-1.5">{service.priceNote}</span>
            </div>
            <span className="text-xs text-gray-400">按需计费 · 随时取消</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowPayment(true) }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart size={14} />
            开通服务，立即可用
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Collapsible Services Section ────────────────────────────────────────────

function CollapsibleServicesSection({ relatedServices, purchasedServices, purchaseService, topicLabel }: {
  relatedServices: ServiceDefinition[]
  purchasedServices: Set<string>
  purchaseService: (id: string) => void
  topicLabel: string
}) {
  const [expanded, setExpanded] = useState(false)
  const purchasedCount = relatedServices.filter((s) => purchasedServices.has(s.id)).length
  const totalCount = relatedServices.length

  // Show first 2 by default, rest on expand
  const defaultVisible = relatedServices.slice(0, 2)
  const extraServices = relatedServices.slice(2)
  const hasMore = extraServices.length > 0

  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden bg-gradient-to-b from-blue-50/80 to-blue-50/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50/60">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-500" />
          <span className="text-xs font-medium text-gray-600">
            增值服务推荐· 针对「{topicLabel}」智能推荐· {purchasedCount}/{totalCount} 已开通
          </span>
        </div>
      </div>

      {/* Always-visible first 2 services */}
      <div className="px-4 py-3 space-y-2">
        {defaultVisible.map((service) => (
          <InlineServiceCard
            key={service.id}
            service={service}
            isPurchased={purchasedServices.has(service.id)}
            onPurchase={() => purchaseService(service.id)}
          />
        ))}

        {/* Expanded extra services */}
        {expanded && extraServices.map((service) => (
          <InlineServiceCard
            key={service.id}
            service={service}
            isPurchased={purchasedServices.has(service.id)}
            onPurchase={() => purchaseService(service.id)}
          />
        ))}

        {/* Expand/collapse toggle */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-center py-1.5 text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            {expanded ? '收起' : `查看更多增值服务(${extraServices.length})`}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function SubmitRequestPage() {
  const navigate = useNavigate()
  const { purchasedServices, purchaseService } = useCollaboration()

  // Support URL params for pre-selection (e.g. ?topic=expedite&priority=Critical)
  const searchParams = new URLSearchParams(window.location.search)
  const presetTopic = searchParams.get('topic')
  const presetPriority = searchParams.get('priority') as WorkItemPriority | null

  const initialTopic = presetTopic ? REQUEST_TOPICS.find((t) => t.id === presetTopic) ?? null : null
  const [step, setStep] = useState<'topic' | 'details' | 'confirm'>(initialTopic ? 'details' : 'topic')
  const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(initialTopic)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    subject: '',
    description: '',
    priority: (presetPriority || 'Medium') as WorkItemPriority,
    relatedObjectType: '',
    relatedObjectId: '',
    email: '',
    billingOption: 'none' as 'none' | 'invoice' | 'prepaid',
  })

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const handle = (field: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const relatedServices = selectedTopic?.relatedServices?.map((id) => SERVICE_CATALOG[id]).filter(Boolean) ?? []
  const hasRelatedServices = relatedServices.length > 0
  const purchasedRelated = relatedServices.filter((s) => purchasedServices.has(s.id))

  const goNext = () => {
    if (step === 'topic' && selectedTopic) setStep('details')
    else if (step === 'details') setStep('confirm')
  }
  const goBack = () => {
    if (step === 'details') setStep('topic')
    else if (step === 'confirm') setStep('details')
  }
  const handleSubmit = () => { setSubmitted(true) }

  const steps: ('topic' | 'details' | 'confirm')[] = ['topic', 'details', 'confirm']
  const stepLabels = { topic: '选择类型', details: '填写详情', confirm: '确认提交' }

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">请求已提交</h2>
          <p className="text-sm text-gray-500 mb-1">您的请求已成功提交，我们将尽快处理。</p>
          <p className="text-xs text-gray-400 mb-8">您可以在「My Requests」中跟踪处理进度。</p>
          <button
            onClick={() => navigate('/support/requests')}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            返回我的请求
          </button>
        </div>
      </div>
    )
  }

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header with breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/support/requests')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to My Requests
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Submit a Request</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below and we'll get back to you as soon as possible.</p>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center gap-1 mb-2">
          {steps.map((s, idx) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${steps.indexOf(step) >= idx ? 'bg-primary-500' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {steps.map((s, idx) => (
            <span key={s} className={`text-xs ${steps.indexOf(step) >= idx ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
              {stepLabels[s]}
            </span>
          ))}
        </div>
      </div>

      {/* Main content card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">

          {/* Step 1: Topic */}
          {step === 'topic' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">请选择您遇到的问题类型，以便我们更快地为您处理：</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REQUEST_TOPICS.map((topic) => {
                  const isSelected = selectedTopic?.id === topic.id
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${
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

          {/* Step 2: Details + Inline Services */}
          {step === 'details' && (
            <div className="space-y-5">

              {/* Collapsible VAS section at top, default collapsed */}
              {hasRelatedServices && <CollapsibleServicesSection
                relatedServices={relatedServices}
                purchasedServices={purchasedServices}
                purchaseService={purchaseService}
                topicLabel={selectedTopic?.label ?? ''}
              />}

              {/* Form fields horizontal layout */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                {/* Email - full width, first field */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your email address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handle('email', e.target.value)}
                    placeholder="your.email@company.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">Your email is used solely to track this request and keep you updated.</p>
                </div>

                {/* Subject full width */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => handle('subject', e.target.value)}
                    placeholder="Brief summary of your issue..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Priority left */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <div className="flex gap-1.5">
                    {(['Low', 'Medium', 'High', 'Critical'] as WorkItemPriority[]).map((p) => {
                      const isActive = form.priority === p
                      const styles: Record<WorkItemPriority, string> = {
                        Low: 'border-gray-300 text-gray-600 bg-gray-50',
                        Medium: 'border-blue-300 text-blue-700 bg-blue-50',
                        High: 'border-orange-300 text-orange-700 bg-orange-50',
                        Critical: 'border-red-300 text-red-700 bg-red-50',
                      }
                      const labels: Record<WorkItemPriority, string> = { Low: 'Low', Medium: 'Medium', High: 'High', Critical: 'Urgent' }
                      return (
                        <button key={p} type="button" onClick={() => handle('priority', p)}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${isActive ? styles[p] : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >{labels[p]}</button>
                      )
                    })}
                  </div>
                </div>

                {/* Related Object right (two sub-fields) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Related Type</label>
                    <select value={form.relatedObjectType} onChange={(e) => handle('relatedObjectType', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                      <option value="">Select...</option>
                      <option value="Order">Order</option>
                      <option value="SKU">SKU</option>
                      <option value="Shipment">Shipment</option>
                      <option value="PO">PO</option>
                      <option value="ASN">ASN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Related ID</label>
                    <input type="text" value={form.relatedObjectId} onChange={(e) => handle('relatedObjectId', e.target.value)}
                      placeholder="e.g. ORD-5521"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                {/* Description full width */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handle('description', e.target.value)}
                    rows={3}
                    placeholder="Provide detailed information about the issue..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Attachments */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Attachments</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors cursor-pointer">
                    <Paperclip size={16} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500"><span className="text-primary-600 font-medium">Add file</span> or drop files here · PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>

                {/* AI Analysis — full width */}
                <div className="col-span-2 border border-indigo-100 rounded-lg bg-indigo-50/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-indigo-500" />
                      <span className="text-sm font-medium text-gray-700">AI Smart Analysis</span>
                    </div>
                    <button
                      onClick={() => {
                        setAiLoading(true)
                        setTimeout(() => {
                          setAiLoading(false)
                          setAiAnalysis(
                            form.relatedObjectId
                              ? `Based on ${form.relatedObjectId}:\n\u2022 Current status: Normal, no anomalies in last 7 days\n\u2022 Related SKU inventory sufficient for outbound\n\u2022 Suggested priority: ${form.priority === 'Critical' ? 'Immediate action needed' : 'Standard processing'}\n\u2022 Estimated resolution: 1-2 business days`
                              : `Based on your input:\n\u2022 Request type "${selectedTopic?.label}" typically resolves in 1-3 days\n\u2022 Tip: Adding a related order/SKU ID helps us locate issues faster\n\u2022 Current support response time: < 30 minutes`
                          )
                        }, 2000)
                      }}
                      disabled={aiLoading || !form.subject.trim()}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {aiLoading ? 'Analyzing...' : 'Run AI Analysis'}
                    </button>
                  </div>
                  {aiLoading && (
                    <div className="flex items-center gap-2 text-xs text-indigo-500">
                      <span className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                      Querying database and analyzing your request...
                    </div>
                  )}
                  {aiAnalysis && !aiLoading && (
                    <div className="bg-white rounded-md border border-indigo-100 p-3 text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                      {aiAnalysis}
                    </div>
                  )}
                  {!aiAnalysis && !aiLoading && (
                    <p className="text-xs text-gray-400">AI will analyze your request details and related records to provide suggestions</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Request Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-900 font-medium">{selectedTopic?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subject</span>
                  <span className="text-gray-900 font-medium truncate ml-4 max-w-[300px]">{form.subject || '\u2014'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Priority</span>
                  <span className={`font-medium ${
                    form.priority === 'Critical' ? 'text-red-600' : form.priority === 'High' ? 'text-orange-600' :
                    form.priority === 'Medium' ? 'text-blue-600' : 'text-gray-600'
                  }`}>{form.priority}</span>
                </div>
                {form.relatedObjectId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Related</span>
                    <span className="text-gray-900 font-mono text-xs">{form.relatedObjectType} {form.relatedObjectId}</span>
                  </div>
                )}
                {form.description && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{form.description}</p>
                  </div>
                )}
                {purchasedRelated.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">已开通的相关服务（我们会直接为您安排）</p>
                    <div className="flex flex-wrap gap-1.5">
                      {purchasedRelated.map((s) => (
                        <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 size={10} />{s.nameCn}
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
        <div className="px-6 py-4 border-t border-gray-100">
          {/* Services summary shown when there are purchased services on step 2 */}
          {step === 'details' && purchasedRelated.length > 0 && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">已选择增值服务：</span>
              <div className="flex flex-wrap gap-1.5">
                {purchasedRelated.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                    <CheckCircle2 size={9} />{s.nameCn}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              {step !== 'topic' && (
                <button onClick={goBack} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <ChevronLeft size={14} /> Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/support/requests')}
                className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              {step === 'confirm' ? (
                <button onClick={handleSubmit} disabled={!form.subject.trim() || !form.description.trim() || !form.email.trim()}
                  className="px-6 py-2.5 text-sm bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Submit Request
                </button>
              ) : (
                <button onClick={goNext} disabled={step === 'topic' ? !selectedTopic : !form.subject.trim()}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-sm bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
