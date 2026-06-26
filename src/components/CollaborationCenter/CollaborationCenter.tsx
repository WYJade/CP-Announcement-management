import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle, Layers, Plus, ChevronDown, ChevronUp, ChevronRight,
  ArrowRight, Star, Filter, Search, X,
} from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'
import {
  DRIVER_LABELS,
  DRIVER_DESCRIPTIONS,
  DRIVER_COLORS,
} from '../../types/workItem'
import type { WorkItemDriver, WorkItem } from '../../types/workItem'
import HealthDashboard, { type MetricFilter } from './components/HealthDashboard'
import WorkItemCard from './components/WorkItemCard'
import ServiceDetailModal from './components/ServiceDetailModal'
import { SERVICE_CATALOG } from '../../data/serviceCatalog'
import type { ServiceDefinition } from '../../data/serviceCatalog'

// ─── Constants ────────────────────────────────────────────────────────────────

const DRIVER_ORDER: WorkItemDriver[] = [
  'IssueDriven',
  'RequestDriven',
  'ApprovalDriven',
  'EventDriven',
  'PlanningDriven',
  'CollaborationDriven',
]

// Color accent text extracted from DRIVER_COLORS (text-* portion)
const DRIVER_TEXT_COLOR: Record<WorkItemDriver, string> = {
  IssueDriven:       'text-red-700',
  RequestDriven:     'text-blue-700',
  ApprovalDriven:    'text-amber-700',
  EventDriven:       'text-purple-700',
  PlanningDriven:    'text-green-700',
  CollaborationDriven: 'text-indigo-700',
}

// Border-only classes extracted from DRIVER_BORDER
const DRIVER_BORDER_ONLY: Record<WorkItemDriver, string> = {
  IssueDriven:       'border-red-200',
  RequestDriven:     'border-blue-200',
  ApprovalDriven:    'border-amber-200',
  EventDriven:       'border-purple-200',
  PlanningDriven:    'border-green-200',
  CollaborationDriven: 'border-indigo-200',
}

// Background-only classes extracted from DRIVER_BORDER
const DRIVER_BG_ONLY: Record<WorkItemDriver, string> = {
  IssueDriven:       'bg-red-50',
  RequestDriven:     'bg-blue-50',
  ApprovalDriven:    'bg-amber-50',
  EventDriven:       'bg-purple-50',
  PlanningDriven:    'bg-green-50',
  CollaborationDriven: 'bg-indigo-50',
}

type ServiceCategory = 'fulfillment' | 'inventory' | 'shipping'

const SERVICE_TABS: { key: ServiceCategory; label: string }[] = [
  { key: 'fulfillment', label: '履约服务' },
  { key: 'inventory',   label: '库存服务' },
  { key: 'shipping',    label: '运输服务' },
]

// ─── DriverSection ────────────────────────────────────────────────────────────

function DriverSection({
  driver,
  items,
  expanded,
  onToggle,
  onNavigate,
  onNewRequest,
}: {
  driver: WorkItemDriver
  items: WorkItem[]
  expanded: boolean
  onToggle: () => void
  onNavigate: (path: string) => void
  onNewRequest: () => void
}) {
  const activeItems = items.filter((i) =>
    ['Open', 'InProgress', 'PendingApproval'].includes(i.status)
  )
  const displayItems = items.slice(0, 3)
  const hasMore = items.length > 3

  const borderClass  = DRIVER_BORDER_ONLY[driver]
  const bgClass      = DRIVER_BG_ONLY[driver]
  const textClass    = DRIVER_TEXT_COLOR[driver]
  const badgeClass   = DRIVER_COLORS[driver]

  return (
    <div className={`rounded-xl border ${borderClass} overflow-hidden`}>
      {/* Section header */}
      <div
        className={`${bgClass} border-b ${borderClass} px-5 py-3 cursor-pointer select-none`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* Badge + label + description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                {DRIVER_LABELS[driver]}
              </span>
              <span className={`text-sm font-semibold ${textClass}`}>
                {DRIVER_DESCRIPTIONS[driver]}
              </span>
            </div>
          </div>

          {/* Right side: count + toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {activeItems.length > 0 && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${borderClass} ${textClass} ${bgClass}`}>
                {activeItems.length} 项进行中
              </span>
            )}
            {activeItems.length === 0 && items.length > 0 && (
              <span className="text-xs text-gray-400 px-2 py-1 rounded-full bg-gray-100">
                {items.length} 项
              </span>
            )}
            <span className={`${textClass} transition-transform`}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="bg-white px-4 pt-3 pb-4">
          {items.length === 0 ? (
            /* Empty state */
            <div className="py-8 text-center">
              <div className={`w-12 h-12 rounded-full ${bgClass} flex items-center justify-center mx-auto mb-3`}>
                <Layers size={20} className={`${textClass} opacity-60`} />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">暂无{DRIVER_LABELS[driver]}事项</p>
              <p className="text-xs text-gray-400 mb-4">{DRIVER_DESCRIPTIONS[driver]}</p>
              <button
                onClick={onNewRequest}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg border ${borderClass} ${textClass} ${bgClass} hover:opacity-80 transition-opacity`}
              >
                <Plus size={13} />
                发起新请求
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {displayItems.map((item) => (
                  <WorkItemCard key={item.id} item={item} onClick={() => onNavigate('/collaboration/item/' + item.id)} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    显示 {displayItems.length} / {items.length} 项
                  </p>
                  <button
                    onClick={() => onNavigate('/collaboration/all')}
                    className={`flex items-center gap-1 text-xs font-semibold ${textClass} hover:underline`}
                  >
                    查看全部 {items.length} 项
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  purchased,
  onOpen,
}: {
  service: ServiceDefinition
  purchased: boolean
  onOpen: (service: ServiceDefinition) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(service)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(service)}
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-md hover:border-primary-200 cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{service.nameCn}</p>
          <p className="text-xs text-gray-400 truncate">{service.name}</p>
        </div>
        {service.popular && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
            <Star size={10} />
            热门
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{service.tagline}</p>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div>
          <span className="text-sm font-bold text-gray-900">{service.price}</span>
          <span className="text-xs text-gray-400 ml-1">{service.priceNote}</span>
        </div>
        {purchased ? (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
            已开通
          </span>
        ) : (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            了解开通
          </span>
        )}
      </div>
    </div>
  )
}

// ─── ValueAddedServicesSection ────────────────────────────────────────────────

function ValueAddedServicesSection({
  purchasedServices,
  onServiceOpen,
}: {
  purchasedServices: Set<string>
  onServiceOpen: (service: ServiceDefinition) => void
}) {
  const [activeTab, setActiveTab] = useState<ServiceCategory>('fulfillment')

  const allServices = Object.values(SERVICE_CATALOG)
  const tabServices = allServices.filter((s) => s.category === activeTab)

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">增值服务 Value-added Services</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          按需开通，灵活使用，让仓库为您做更多 · 点击卡片查看详情或开通
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {SERVICE_TABS.map((tab) => {
          const count = allServices.filter((s) => s.category === tab.key).length
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tabServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            purchased={purchasedServices.has(service.id)}
            onOpen={onServiceOpen}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Metric filter helpers ────────────────────────────────────────────────────

const METRIC_LABELS: Record<MetricFilter, string> = {
  active:          '活跃处理中',
  pendingApproval: '等待您决策',
  slaRisk:         'SLA 风险',
  priority:        '优先处理',
  completed:       '本月已完成',
}

export default function CollaborationCenter() {
  const { items, purchasedServices, purchaseService } = useCollaboration()
  const navigate = useNavigate()

  const [expandedDrivers, setExpandedDrivers] = useState<string[]>([
    'IssueDriven',
    'RequestDriven',
    'ApprovalDriven',
    'EventDriven',
  ])

  const [activeMetricFilter, setActiveMetricFilter] = useState<MetricFilter | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(null)

  function handleMetricClick(filter: MetricFilter) {
    setActiveMetricFilter((prev) => (prev === filter ? null : filter))
  }

  function toggleDriver(driver: WorkItemDriver) {
    setExpandedDrivers((prev) =>
      prev.includes(driver)
        ? prev.filter((d) => d !== driver)
        : [...prev, driver]
    )
  }

  // Items grouped by driver
  const itemsByDriver = DRIVER_ORDER.reduce<Record<WorkItemDriver, WorkItem[]>>(
    (acc, driver) => {
      acc[driver] = items.filter((i) => i.driver === driver)
      return acc
    },
    {} as Record<WorkItemDriver, WorkItem[]>
  )

  // Priority items
  const priorityItems = items.filter(
    (i) => i.isPriority || i.status === 'PendingApproval'
  )
  const priorityDisplay = priorityItems.slice(0, 6)
  const priorityHasMore = priorityItems.length > 6

  // Metric filter panel items
  const now = new Date()
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000)
  const metricFilteredItems = useMemo(() => {
    if (!activeMetricFilter) return []
    switch (activeMetricFilter) {
      case 'active':
        return items.filter((i) => i.status === 'Open' || i.status === 'InProgress')
      case 'pendingApproval':
        return items.filter((i) => i.status === 'PendingApproval')
      case 'slaRisk':
        return items.filter((i) => {
          if (i.isPriority) return true
          if (i.slaDeadline) {
            const d = new Date(i.slaDeadline)
            return d <= fourHoursFromNow && d > now
          }
          return false
        })
      case 'priority':
        return items.filter((i) => i.isPriority === true)
      case 'completed':
        return items.filter((i) => {
          if (i.status !== 'Closed' && i.status !== 'Resolved') return false
          const updated = new Date(i.updatedAt)
          return updated.getFullYear() === now.getFullYear() && updated.getMonth() === now.getMonth()
        })
      default:
        return []
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, activeMetricFilter])

  return (
    <>
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── 1. PAGE HEADER ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            协作中心 Collaboration Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            统一处理您与仓库之间的所有业务事项
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            title="搜索"
          >
            <Search size={16} />
          </button>
          <button
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            title="筛选"
          >
            <Filter size={16} />
          </button>
          <button
            onClick={() => navigate('/collaboration/all')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            发起新请求
          </button>
        </div>
      </div>

      {/* ── 2. HEALTH DASHBOARD ──────────────────────────────────────────────── */}
      <div className="mb-4">
        <HealthDashboard
          onMetricClick={handleMetricClick}
          activeFilter={activeMetricFilter}
        />
      </div>

      {/* ── 2b. METRIC FILTER DRAWER ─────────────────────────────────────────── */}
      {activeMetricFilter && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">
              {METRIC_LABELS[activeMetricFilter]}
              <span className="ml-2 text-xs font-normal text-gray-500">
                共 {metricFilteredItems.length} 项
              </span>
            </span>
            <button
              onClick={() => setActiveMetricFilter(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          {/* Cards */}
          {metricFilteredItems.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">暂无匹配事项</div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {metricFilteredItems.slice(0, 9).map((item) => (
                <WorkItemCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate('/collaboration/item/' + item.id)}
                />
              ))}
            </div>
          )}
          {metricFilteredItems.length > 9 && (
            <div className="px-4 pb-3 text-right">
              <button
                onClick={() => navigate('/collaboration/all')}
                className="text-xs text-primary-600 hover:underline"
              >
                查看全部 {metricFilteredItems.length} 项 →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 3. PRIORITY SECTION ──────────────────────────────────────────────── */}
      {priorityItems.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm font-bold text-red-700">
                优先处理 — 需要您立即关注
              </span>
              <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded-full border border-red-200">
                {priorityItems.length} 项
              </span>
            </div>
            <p className="text-xs text-red-600 ml-6">以下事项需要您立即处理或决策</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {priorityDisplay.map((item) => (
              <WorkItemCard key={item.id} item={item} onClick={() => navigate('/collaboration/item/' + item.id)} />
            ))}
          </div>

          {priorityHasMore && (
            <div className="mt-3 text-right">
              <button
                onClick={() => navigate('/collaboration/all')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                查看全部 {priorityItems.length} 项优先事项
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── 4. DRIVER SECTIONS ───────────────────────────────────────────────── */}
      <section className="mb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers size={16} className="text-gray-500" />
              业务场景总览
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              按驱动类型分类，查看所有进行中的协作事项
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setExpandedDrivers(
                  expandedDrivers.length === DRIVER_ORDER.length ? [] : [...DRIVER_ORDER]
                )
              }
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              {expandedDrivers.length === DRIVER_ORDER.length ? (
                <>
                  <ChevronUp size={12} />
                  全部收起
                </>
              ) : (
                <>
                  <ChevronDown size={12} />
                  全部展开
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/collaboration/all')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              查看全部事项
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {DRIVER_ORDER.map((driver) => (
            <DriverSection
              key={driver}
              driver={driver}
              items={itemsByDriver[driver]}
              expanded={expandedDrivers.includes(driver)}
              onToggle={() => toggleDriver(driver)}
              onNavigate={(path) => navigate(path)}
              onNewRequest={() => navigate('/collaboration/all')}
            />
          ))}
        </div>
      </section>

      {/* ── 5. VALUE-ADDED SERVICES ──────────────────────────────────────────── */}
      <ValueAddedServicesSection
        purchasedServices={purchasedServices}
        onServiceOpen={setSelectedService}
      />

    </div>

    {/* ── SERVICE DETAIL MODAL ─────────────────────────────────────────────── */}
    {selectedService && (
      <ServiceDetailModal
        service={selectedService}
        purchased={purchasedServices.has(selectedService.id)}
        onClose={() => setSelectedService(null)}
        onPurchase={() => {
          purchaseService(selectedService.id)
        }}
      />
    )}
    </>
  )
}
