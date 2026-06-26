import React from 'react'
import {
  Lightbulb,
  Camera,
  Search,
  Package,
  Trash2,
  RotateCcw,
  FileText,
  MapPin,
  Zap,
  Truck,
  Star,
  Mail,
  Check,
  Pause,
  ClipboardList,
  Wrench,
  type LucideProps,
} from 'lucide-react'
import type { RecommendedAction } from '../../../types/workItem'

interface Props {
  actions: RecommendedAction[]
  purchasedServices: Set<string>
  onActionClick: (action: RecommendedAction) => void
}

type IconComponent = React.ComponentType<LucideProps>

const ICON_MAP: Record<string, IconComponent> = {
  Camera,
  Search,
  Package,
  Trash2,
  RotateCcw,
  FileText,
  MapPin,
  Zap,
  Truck,
  Star,
  Mail,
  Check,
  Pause,
  ClipboardList,
  Tool: Wrench,
  Wrench,
}

function resolveIcon(name: string): IconComponent {
  return ICON_MAP[name] ?? FileText
}

const VARIANT_CARD: Record<RecommendedAction['variant'], string> = {
  primary: 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700',
  secondary: 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50',
  warning: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
  danger: 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100',
}

const VARIANT_ICON_WRAP: Record<RecommendedAction['variant'], string> = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-100 text-gray-600',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-600',
}

const VARIANT_DESC: Record<RecommendedAction['variant'], string> = {
  primary: 'text-blue-100',
  secondary: 'text-gray-500',
  warning: 'text-amber-700',
  danger: 'text-red-700',
}

export default function RecommendedActions({ actions, purchasedServices, onActionClick }: Props) {
  if (actions.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-700">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-semibold">建议操作</span>
      </div>

      <div className="flex flex-col gap-2">
        {actions.map((action) => {
          const Icon = resolveIcon(action.icon)
          const hasSvcGate = !!action.serviceId
          const isPurchased = hasSvcGate && purchasedServices.has(action.serviceId!)
          const needsUpsell = hasSvcGate && !isPurchased

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick(action)}
              className={[
                'w-full text-left rounded-lg border px-4 py-3 transition-colors duration-150',
                'flex items-start gap-3',
                VARIANT_CARD[action.variant],
              ].join(' ')}
            >
              {/* Icon */}
              <span
                className={[
                  'mt-0.5 flex-shrink-0 rounded-md p-1.5',
                  VARIANT_ICON_WRAP[action.variant],
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium leading-snug">{action.label}</span>

                  {needsUpsell && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 border border-amber-300 flex-shrink-0">
                      需开通服务
                    </span>
                  )}

                  {isPurchased && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-300 flex-shrink-0">
                      <Check className="w-3 h-3" />
                      已开通
                    </span>
                  )}
                </div>

                {action.description && (
                  <p
                    className={[
                      'mt-0.5 text-xs leading-relaxed',
                      VARIANT_DESC[action.variant],
                    ].join(' ')}
                  >
                    {action.description}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
