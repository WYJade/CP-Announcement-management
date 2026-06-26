import { useState, useRef } from 'react'
import {
  ChevronLeft, ChevronRight, Sparkles, CheckCircle2, X,
  Package, Tag, Camera, ClipboardList, Gift, Boxes,
  SplitSquareVertical, ExternalLink,
} from 'lucide-react'
import { SERVICE_CATALOG, type ServiceDefinition } from '../../../data/serviceCatalog'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { ServiceId } from '../../../types/workItem'
import ServiceUpsellModal from './ServiceUpsellModal'

// ─── Featured VAS items for customer-facing banner ───────────────────────────

interface FeaturedService {
  id: ServiceId
  shortName: string
  benefit: string        // 站在用户角度的价值描述
  icon: React.ReactNode
}

const FEATURED_SERVICES: FeaturedService[] = [
  {
    id: 'repackaging',
    shortName: '换包装',
    benefit: '包装焕新，直接在仓库搞定，无需退回',
    icon: <Package size={16} className="text-violet-500" />,
  },
  {
    id: 'relabeling',
    shortName: '贴标服务',
    benefit: '平台标签有变？仓库代贴，合规无忧',
    icon: <Tag size={16} className="text-blue-500" />,
  },
  {
    id: 'gift-message',
    shortName: '礼品贺卡',
    benefit: '为客户的每份礼物增添一份心意',
    icon: <Gift size={16} className="text-pink-500" />,
  },
  {
    id: 'photo-request',
    shortName: '货物拍照',
    benefit: '远程查看货物真实状态，发货更放心',
    icon: <Camera size={16} className="text-amber-500" />,
  },
  {
    id: 'sku-inspection',
    shortName: '质检服务',
    benefit: '专业质检减少退货率，保护品牌口碑',
    icon: <ClipboardList size={16} className="text-green-500" />,
  },
  {
    id: 'kitting',
    shortName: '组套/拆合单',
    benefit: '多品组套、拆单合单，灵活应对促销',
    icon: <Boxes size={16} className="text-indigo-500" />,
  },
  {
    id: 'inventory-audit-service',
    shortName: '临时盘点',
    benefit: '随时发起盘点，账实相符心里有数',
    icon: <SplitSquareVertical size={16} className="text-teal-500" />,
  },
  {
    id: 'bundling',
    shortName: '捆绑包装',
    benefit: '多件合一，降低运费，提升客单价',
    icon: <Package size={16} className="text-orange-500" />,
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServicesBanner() {
  const { purchasedServices } = useCollaboration()
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  if (dismissed) return null

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <div className="relative bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 border border-indigo-100 rounded-xl mb-5 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-500 z-10 p-1 rounded-md hover:bg-white/60 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>

        {/* Header section */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
          <Sparkles size={15} className="text-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-800">
            让仓库为您做更多
          </h3>
          <span className="text-xs text-gray-400 ml-1">— 增值服务可直接在此开通，随时按需使用</span>
        </div>
        <p className="px-5 text-xs text-gray-500 mb-3 leading-relaxed">
          这些服务帮助您在仓库端直接完成换包装、贴标、质检等操作，无需退货回仓，节省时间和物流成本。已开通的服务可在提交请求时直接使用。
        </p>

        {/* Scrollable cards */}
        <div className="relative group">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/90 shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={14} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURED_SERVICES.map((fs) => {
              const service = SERVICE_CATALOG[fs.id]
              const isPurchased = purchasedServices.has(fs.id)

              return (
                <div
                  key={fs.id}
                  className={`flex-shrink-0 w-[220px] rounded-lg border p-3.5 transition-all cursor-pointer hover:shadow-md ${
                    isPurchased
                      ? 'bg-white border-green-200 hover:border-green-300'
                      : 'bg-white border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedServiceId(fs.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {fs.icon}
                      <span className="text-xs font-semibold text-gray-800">{fs.shortName}</span>
                    </div>
                    {isPurchased ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 size={9} />
                        已开通
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">
                        {service?.price}起
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
                    {fs.benefit}
                  </p>
                  {!isPurchased && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedServiceId(fs.id)
                      }}
                      className="text-[11px] text-primary-600 font-medium hover:text-primary-700 hover:underline transition-colors flex items-center gap-0.5"
                    >
                      了解开通
                      <ExternalLink size={9} />
                    </button>
                  )}
                  {isPurchased && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedServiceId(fs.id)
                      }}
                      className="text-[11px] text-green-600 font-medium hover:text-green-700 hover:underline transition-colors flex items-center gap-0.5"
                    >
                      查看服务详情
                      <ExternalLink size={9} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Service Upsell Modal */}
      {selectedServiceId && (
        <ServiceUpsellModal
          serviceId={selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
          onPurchased={() => {
            // Keep modal open briefly to show success, then close
            setTimeout(() => setSelectedServiceId(null), 2000)
          }}
        />
      )}
    </>
  )
}
