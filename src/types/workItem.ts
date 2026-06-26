export type WorkItemType = 'Request' | 'Approval' | 'Alert' | 'Project' | 'Task'

export type WorkItemDriver =
  | 'IssueDriven'
  | 'RequestDriven'
  | 'ApprovalDriven'
  | 'EventDriven'
  | 'PlanningDriven'
  | 'CollaborationDriven'

// Scenario key — drives which detail page to render
export type WorkItemScenario =
  // 问题类 — Problems & exceptions
  | 'suspected-damage'
  | 'inventory-audit-request'
  | 'missing-item'
  | 'frozen-inventory'
  | 'inventory-buildup'
  // 请求类 — Customer-initiated requests
  | 'expedite-request'
  | 'disposition-request'
  | 'vas-fulfillment'
  | 'vas-inventory'
  | 'vas-shipping'
  // 审批类 — Awaiting customer decision
  | 'cycle-count-approval'
  | 'receiving-discrepancy'
  // 事件类 — System/AI triggered alerts
  | 'order-stuck'
  | 'order-overdue'
  | 'address-exception'
  | 'inventory-threshold'
  | 'order-sla-risk'
  | 'shipment-delayed'
  | 'receiving-completed'
  | 'inventory-anomaly'
  // 计划类 — Forward planning
  | 'inbound-forecast'
  | 'promotion-forecast'
  | 'launch-event'
  // 协同类 — Joint projects
  | 'new-sku-launch'
  | 'packaging-change'
  | 'warehouse-project'
  | 'fulfillment-project'

export type WorkItemStatus =
  | 'Open'
  | 'InProgress'
  | 'PendingApproval'
  | 'Approved'
  | 'Rejected'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled'

export type WorkItemPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type WorkItemSource = 'Customer' | 'Agent' | 'System' | 'Manual' | 'Warehouse'

// ─── Service catalog types ────────────────────────────────────────────────────

export type ServiceId =
  | 'photo-request'
  | 'sku-inspection'
  | 'inventory-audit-service'
  | 'kitting'
  | 'bundling'
  | 'repackaging'
  | 'relabeling'
  | 'gift-message'
  | 'upgrade-shipping'
  | 'hold-shipment'
  | 'redirect-shipment'
  | 'expedite-processing'
  | 'priority-handling'
  | 'disposition-service'
  | 'rework-service'

export interface RecommendedAction {
  id: string
  label: string
  description: string
  icon: string
  serviceId?: ServiceId
  variant: 'primary' | 'secondary' | 'warning' | 'danger'
}

// ─── Scenario-specific data payloads ─────────────────────────────────────────

export interface DamageScenarioData {
  skuId: string
  skuName: string
  totalQty: number
  damagedQty: number
  warehouseNote: string
  photoCount: number
}

export interface CycleCountData {
  skuId: string
  skuName: string
  systemQty: number
  physicalQty: number
  variance: number
  countDate: string
  countedBy: string
}

export interface ReceivingDiscrepancyData {
  poId: string
  poQty: number
  receivedQty: number
  variance: number
  skuId: string
  skuName: string
  receivedDate: string
}

export interface DispositionData {
  skuId: string
  skuName: string
  damagedQty: number
  damageType: string
  warehouseNote: string
  options: { id: string; label: string; description: string; cost: string; timeline: string; bestFor: string }[]
  selectedOption?: string
}

export interface OrderStuckData {
  orderId: string
  stuckStage: string
  stuckReason: string
  stuckSince: string
  affectedQty?: number
}

export interface InventoryAnomalyData {
  skuId: string
  systemReceived: number
  available: number
  damaged: number
  frozenQty?: number
  daysNoMovement?: number
}

export interface ForecastData {
  eventName: string
  eventType: 'inbound' | 'promotion' | 'launch'
  expectedQty: number
  targetDate: string
  skus?: string[]
  prepItems: string[]
}

export interface ProjectStep {
  id: string
  step: number
  title: string
  description: string
  status: 'done' | 'active' | 'pending'
  actor: 'Customer' | 'Warehouse' | 'Joint'
  completedAt?: string
  notes?: string
}

export interface ProjectData {
  projectType: string
  steps: ProjectStep[]
  currentStepId: string
  targetDate: string
  materials?: string[]
}

export interface WorkItemEvidence {
  id: string
  type: 'file' | 'note' | 'link' | 'screenshot' | 'photo'
  label: string
  url?: string
  content?: string
  uploadedAt: string
  uploadedBy: string
}

export interface WorkItemComment {
  id: string
  author: string
  role: 'Customer' | 'Warehouse' | 'System' | 'Agent'
  content: string
  createdAt: string
  isInternal: boolean
}

export interface WorkItemActivity {
  id: string
  action: string
  actor: string
  fromStatus?: WorkItemStatus
  toStatus?: WorkItemStatus
  timestamp: string
  note?: string
}

export interface WorkItem {
  id: string
  type: WorkItemType
  driver: WorkItemDriver
  scenario: WorkItemScenario
  title: string
  description: string

  // Source & ownership
  source: WorkItemSource
  isAgentGenerated: boolean
  agentName?: string
  createdBy: string
  assignee?: string
  owner: string

  // Status & priority
  status: WorkItemStatus
  priority: WorkItemPriority
  isPriority?: boolean   // pins to Priority section on overview

  // Timing
  createdAt: string
  updatedAt: string
  slaDeadline?: string

  // Business context
  relatedObjectType?: string
  relatedObjectId?: string
  warehouseCode?: string
  customerCode?: string

  // Billing
  isChargeable: boolean
  estimatedFee?: number
  actualFee?: number
  currency?: string
  billingStatus?: 'Pending' | 'Invoiced' | 'Paid' | 'Waived'

  // Rich data
  tags: string[]
  evidence: WorkItemEvidence[]
  comments: WorkItemComment[]
  activityLog: WorkItemActivity[]

  // Recommended actions shown on detail page
  recommendedActions?: RecommendedAction[]

  // Type-specific payload
  scenarioData?: (
    | DamageScenarioData
    | CycleCountData
    | ReceivingDiscrepancyData
    | DispositionData
    | OrderStuckData
    | InventoryAnomalyData
    | ForecastData
    | ProjectData
  )

  // Linked items
  linkedItemIds?: string[]
  parentItemId?: string
  bannerIds?: string[]
}

// ─── Display helpers ─────────────────────────────────────────────────────────

export const DRIVER_LABELS: Record<WorkItemDriver, string> = {
  IssueDriven: '问题类',
  RequestDriven: '请求类',
  ApprovalDriven: '审批类',
  EventDriven: '事件类',
  PlanningDriven: '计划类',
  CollaborationDriven: '协同类',
}

export const DRIVER_DESCRIPTIONS: Record<WorkItemDriver, string> = {
  IssueDriven: '货物损坏、库存差异、丢货追踪等问题处理',
  RequestDriven: '加急处理、增值服务、货物处置等客户发起的操作',
  ApprovalDriven: '库存盘点差异确认、收货差异审批等需要您决策的事项',
  EventDriven: '订单卡滞、SLA 风险、库存阈值等系统自动触发的警报',
  PlanningDriven: '到货预报、促销备货、新品发布等计划协调事项',
  CollaborationDriven: '新 SKU 上架、包装变更、仓库项目等双方协作项目',
}

export const DRIVER_COLORS: Record<WorkItemDriver, string> = {
  IssueDriven: 'bg-red-100 text-red-700',
  RequestDriven: 'bg-blue-100 text-blue-700',
  ApprovalDriven: 'bg-amber-100 text-amber-700',
  EventDriven: 'bg-purple-100 text-purple-700',
  PlanningDriven: 'bg-green-100 text-green-700',
  CollaborationDriven: 'bg-indigo-100 text-indigo-700',
}

export const DRIVER_BORDER: Record<WorkItemDriver, string> = {
  IssueDriven: 'border-red-200 bg-red-50',
  RequestDriven: 'border-blue-200 bg-blue-50',
  ApprovalDriven: 'border-amber-200 bg-amber-50',
  EventDriven: 'border-purple-200 bg-purple-50',
  PlanningDriven: 'border-green-200 bg-green-50',
  CollaborationDriven: 'border-indigo-200 bg-indigo-50',
}

export const STATUS_COLORS: Record<WorkItemStatus, string> = {
  Open: 'bg-gray-100 text-gray-700',
  InProgress: 'bg-blue-100 text-blue-700',
  PendingApproval: 'bg-amber-100 text-amber-800',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Resolved: 'bg-teal-100 text-teal-700',
  Closed: 'bg-gray-200 text-gray-500',
  Cancelled: 'bg-gray-100 text-gray-400',
}

export const PRIORITY_COLORS: Record<WorkItemPriority, string> = {
  Low: 'text-gray-500',
  Medium: 'text-blue-500',
  High: 'text-orange-500',
  Critical: 'text-red-600',
}

export const TYPE_COLORS: Record<WorkItemType, string> = {
  Request: 'bg-blue-50 text-blue-700 border-blue-200',
  Approval: 'bg-amber-50 text-amber-700 border-amber-200',
  Alert: 'bg-red-50 text-red-700 border-red-200',
  Project: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Task: 'bg-green-50 text-green-700 border-green-200',
}
