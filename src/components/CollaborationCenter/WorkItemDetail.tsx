import { useParams, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'
import { DRIVER_LABELS } from '../../types/workItem'
import type { WorkItemScenario } from '../../types/workItem'

import DamageDetail from './details/DamageDetail'
import DispositionDetail from './details/DispositionDetail'
import CycleCountDetail from './details/CycleCountDetail'
import ReceivingDetail from './details/ReceivingDetail'
import OrderStuckDetail from './details/OrderStuckDetail'
import EventDetail from './details/EventDetail'
import ProjectDetail from './details/ProjectDetail'
import ExpediteDetail from './details/ExpediteDetail'
import ForecastDetail from './details/ForecastDetail'
import DefaultDetail from './details/DefaultDetail'

// ─── Scenario → Detail component routing ─────────────────────────────────────

type DetailComponent = React.ComponentType<{ item: ReturnType<ReturnType<typeof useCollaboration>['getItemById']> extends infer T ? NonNullable<T> : never; onClose: () => void }>

function resolveDetailComponent(scenario: WorkItemScenario): DetailComponent {
  switch (scenario) {
    case 'suspected-damage':
    case 'inventory-buildup':
      return DamageDetail as DetailComponent

    case 'disposition-request':
      return DispositionDetail as DetailComponent

    case 'cycle-count-approval':
    case 'inventory-anomaly':
      return CycleCountDetail as DetailComponent

    case 'receiving-discrepancy':
    case 'receiving-completed':
      return ReceivingDetail as DetailComponent

    case 'order-stuck':
    case 'order-overdue':
      return OrderStuckDetail as DetailComponent

    case 'inventory-threshold':
    case 'shipment-delayed':
    case 'address-exception':
    case 'order-sla-risk':
      return EventDetail as DetailComponent

    case 'new-sku-launch':
    case 'packaging-change':
    case 'warehouse-project':
    case 'fulfillment-project':
      return ProjectDetail as DetailComponent

    case 'expedite-request':
      return ExpediteDetail as DetailComponent

    case 'inbound-forecast':
    case 'promotion-forecast':
    case 'launch-event':
      return ForecastDetail as DetailComponent

    default:
      return DefaultDetail as DetailComponent
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getItemById } = useCollaboration()

  const item = getItemById(id ?? '')

  if (!item) {
    return (
      <div className="p-6 text-center text-gray-500">
        <AlertTriangle size={36} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">Work item not found</p>
        <button
          onClick={() => navigate('/support/requests')}
          className="text-sm text-primary-600 mt-2 hover:underline"
        >
          Back to All Work
        </button>
      </div>
    )
  }

  const DetailComponent = resolveDetailComponent(item.scenario)
  const driverLabel = DRIVER_LABELS[item.driver]
  const handleClose = () => navigate(-1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <button
            onClick={handleClose}
            className="flex items-center gap-1 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={14} />
            协作中心
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{driverLabel}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{item.title}</span>
        </nav>
      </div>

      {/* Detail page content */}
      <div className="p-6">
        <DetailComponent item={item} onClose={handleClose} />
      </div>
    </div>
  )
}
