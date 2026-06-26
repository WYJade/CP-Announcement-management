import { useState } from 'react'
import { X, CheckCircle2, ExternalLink, Sparkles, Tag } from 'lucide-react'
import { SERVICE_CATALOG, type ServiceDefinition } from '../../../data/serviceCatalog'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { ServiceId } from '../../../types/workItem'

interface Props {
  serviceId: ServiceId
  onClose: () => void
  onPurchased?: () => void
}

const CATEGORY_LABELS: Record<ServiceDefinition['category'], { label: string; color: string }> = {
  fulfillment: { label: '履约服务', color: 'bg-violet-100 text-violet-700' },
  inventory:   { label: '库存服务', color: 'bg-blue-100 text-blue-700' },
  shipping:    { label: '配送服务', color: 'bg-amber-100 text-amber-700' },
}

export default function ServiceUpsellModal({ serviceId, onClose, onPurchased }: Props) {
  const { purchaseService, purchasedServices } = useCollaboration()
  const [purchased, setPurchased] = useState(false)
  const alreadyOwned = purchasedServices.has(serviceId)

  const service = SERVICE_CATALOG[serviceId]

  if (!service) return null

  const category = CATEGORY_LABELS[service.category]
  const bulletPoints = service.businessValue
    .split('；')
    .map((s) => s.trim())
    .filter(Boolean)

  const handlePurchase = () => {
    purchaseService(service.id)
    setPurchased(true)
    onPurchased?.()
  }

  const handleDone = () => {
    onClose()
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (purchased) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">服务已成功开通</h3>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium text-gray-800">{service.nameCn}</span> 现已激活，
          </p>
          <p className="text-sm text-gray-500 mb-6">您可以直接在此完成相关操作，无需额外联系。</p>
          <button
            onClick={handleDone}
            className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            开始使用
          </button>
        </div>
      </div>
    )
  }

  // ── Main modal ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-50 to-blue-50 px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="关闭"
          >
            <X size={18} />
          </button>

          {/* Category badge + popular flag */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
              <Tag size={11} />
              {category.label}
            </span>
            {service.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                <Sparkles size={11} />
                热门服务
              </span>
            )}
          </div>

          {/* Service name & tagline */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">{service.nameCn}</h2>
          <p className="text-sm text-primary-600 font-medium">{service.tagline}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">

          {/* Soft value header */}
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2.5 leading-relaxed">
            开通此服务后，您可以直接在此完成操作，无需额外联系
          </p>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {service.description}
          </p>

          {/* Business value bullets */}
          {bulletPoints.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">核心价值</p>
              <ul className="space-y-1.5">
                {bulletPoints.slice(0, 3).map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-gray-900">{service.price}</span>
            <span className="text-sm text-gray-500">{service.priceNote}</span>
          </div>

          {/* Billing note */}
          <p className="text-xs text-gray-400">
            服务开通即时生效，按使用量计费，随时可取消
          </p>

          {/* Learn more link */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline transition-colors"
          >
            了解更多服务详情
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 pb-6 pt-2 space-y-2">
          {alreadyOwned ? (
            <>
              <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-700">此服务已开通，提交请求时可直接使用</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                关闭
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePurchase}
                className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-sm"
              >
                立即开通服务
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                暂不需要
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
