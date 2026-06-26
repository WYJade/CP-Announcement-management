import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { BannerConfig } from '../types/banner'
import { useBanners } from './BannerContext'

export interface Message {
  id: string
  title: string
  content: string
  tier: BannerConfig['tier']
  category: BannerConfig['category']
  timestamp: string
  isRead: boolean
  bannerId?: string
  actions?: BannerConfig['actions']
  highlights?: BannerConfig['highlights']
  /** Message classification: announcements/notifications vs collaboration messages */
  messageType?: 'announcement' | 'collaboration'
}

interface MessageCenterContextValue {
  messages: Message[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteMessage: (id: string) => void
  selectedMessage: Message | null
  setSelectedMessage: (msg: Message | null) => void
  isPanelOpen: boolean
  openPanel: () => void
  closePanel: () => void
  newToast: Message | null
  dismissToast: () => void
}

const MessageCenterContext = createContext<MessageCenterContextValue | null>(null)

/** Convert banners to messages */
function bannersToMessages(banners: BannerConfig[]): Message[] {
  return banners.map((banner) => ({
    id: `msg-${banner.id}`,
    title: banner.title,
    content: banner.message,
    tier: banner.tier,
    category: banner.category,
    timestamp: banner.createdAt || new Date().toISOString(),
    isRead: false,
    bannerId: banner.id,
    actions: banner.actions,
    highlights: banner.highlights,
    messageType: 'announcement' as const,
  }))
}

/** Sample messages covering all 15 notification categories */
const sampleMessages: Message[] = [
  {
    id: 'msg-system-status-001',
    title: 'Scheduled Maintenance Window',
    content: 'Our platform will undergo scheduled maintenance on July 5, 2025 from 2:00 AM to 4:00 AM UTC. During this period, some services may be temporarily unavailable. We recommend completing critical operations beforehand.',
    tier: 'info',
    category: 'system-status',
    timestamp: '2025-06-24T08:00:00Z',
    isRead: false,
    highlights: [
      { label: 'Date', value: 'July 5, 2025' },
      { label: 'Window', value: '2:00–4:00 AM UTC' },
    ],
  },
  {
    id: 'msg-feature-release-001',
    title: 'New Feature: AI-Powered Demand Forecasting',
    content: 'We are excited to announce the launch of our AI-Powered Demand Forecasting module. Predict inventory needs with 95% accuracy, optimize reorder points, and reduce carrying costs. Available now in your Inventory module.',
    tier: 'info',
    category: 'feature-release',
    timestamp: '2025-06-23T14:00:00Z',
    isRead: false,
    highlights: [
      { label: 'Module', value: 'Demand Forecasting' },
      { label: 'Available Since', value: '2025-06-23' },
    ],
    actions: [
      { label: 'Try It Now', variant: 'primary', href: '/dashboard/kpi' },
      { label: 'Release Notes', variant: 'link', href: '/dashboard/kpi' },
    ],
  },
  {
    id: 'msg-announcement-001',
    title: 'Welcome Our New VP of Operations',
    content: 'We are pleased to announce that Sarah Chen has joined our leadership team as VP of Operations. Sarah brings over 15 years of supply chain experience and will be leading our global operations strategy.',
    tier: 'info',
    category: 'announcement',
    timestamp: '2025-06-22T10:00:00Z',
    isRead: true,
  },
  {
    id: 'msg-policy-001',
    title: 'Terms of Service Update',
    content: 'Our Terms of Service have been updated effective July 1, 2025. Key changes include updated data processing terms, revised liability clauses, and new provisions for AI-generated content. Please review and acknowledge the changes.',
    tier: 'warning',
    category: 'policy-compliance',
    timestamp: '2025-06-21T09:00:00Z',
    isRead: false,
    highlights: [
      { label: 'Effective Date', value: 'July 1, 2025' },
      { label: 'Action Required', value: 'Acknowledge' },
    ],
    actions: [
      { label: 'Review Changes', variant: 'primary' },
      { label: 'View Full Document', variant: 'link' },
    ],
  },
  {
    id: 'msg-security-001',
    title: 'MFA Enrollment Deadline Approaching',
    content: 'As part of our enhanced security measures, all accounts must enable Multi-Factor Authentication (MFA) by July 15, 2025. Accounts without MFA enabled after this date will have restricted access. Please set up MFA in your account settings.',
    tier: 'critical',
    category: 'security',
    timestamp: '2025-06-20T11:00:00Z',
    isRead: false,
    highlights: [
      { label: 'Deadline', value: 'July 15, 2025' },
      { label: 'Impact', value: 'Restricted Access' },
    ],
    actions: [
      { label: 'Enable MFA Now', variant: 'primary' },
    ],
  },
  {
    id: 'msg-operational-001',
    title: 'Carrier Delay: West Coast Port Congestion',
    content: 'Due to ongoing congestion at Los Angeles and Long Beach ports, shipments routed through these ports may experience 3-5 day delays. We recommend considering alternative routing via Oakland or Seattle for time-sensitive cargo.',
    tier: 'warning',
    category: 'operational',
    timestamp: '2025-06-19T16:00:00Z',
    isRead: true,
    highlights: [
      { label: 'Affected Ports', value: 'LA / Long Beach' },
      { label: 'Expected Delay', value: '3–5 Days' },
    ],
  },
  {
    id: 'msg-survey-001',
    title: 'Help Us Improve: 2-Minute Feedback Survey',
    content: 'We would love to hear your thoughts on the new dashboard experience. Your feedback directly influences our product roadmap. The survey takes less than 2 minutes and all responses are anonymous.',
    tier: 'promotion',
    category: 'survey-feedback',
    timestamp: '2025-06-18T13:00:00Z',
    isRead: true,
    actions: [
      { label: 'Take Survey', variant: 'primary' },
    ],
  },
  {
    id: 'msg-training-001',
    title: 'Upcoming Webinar: Advanced Inventory Management',
    content: 'Join our product team for a live deep-dive into advanced inventory management techniques on July 10, 2025 at 11:00 AM PST. Learn about cycle counting automation, ABC analysis, and safety stock optimization.',
    tier: 'info',
    category: 'training-events',
    timestamp: '2025-06-17T10:00:00Z',
    isRead: true,
    highlights: [
      { label: 'Date', value: 'July 10, 2025' },
      { label: 'Time', value: '11:00 AM PST' },
    ],
    actions: [
      { label: 'Register Now', variant: 'primary' },
    ],
  },
  {
    id: 'msg-promotion-001',
    title: 'Upgrade to Enterprise: 20% Off This Month',
    content: 'Unlock advanced analytics, unlimited users, and priority support with our Enterprise plan. For a limited time, get 20% off your first year when you upgrade before June 30. Use code UPGRADE20 at checkout.',
    tier: 'promotion',
    category: 'promotion-upsell',
    timestamp: '2025-06-16T09:00:00Z',
    isRead: true,
    highlights: [
      { label: 'Discount', value: '20% Off' },
      { label: 'Code', value: 'UPGRADE20' },
      { label: 'Expires', value: 'June 30, 2025' },
    ],
    actions: [
      { label: 'Upgrade Now', variant: 'primary' },
      { label: 'Compare Plans', variant: 'link' },
    ],
  },
  {
    id: 'msg-regulatory-001',
    title: 'New Customs Tariff Changes Effective August 2025',
    content: 'The U.S. International Trade Commission has announced updated tariff classifications effective August 1, 2025. Several HTS codes relevant to electronics and textiles have been revised. Please review the changes to ensure compliance with your import declarations.',
    tier: 'warning',
    category: 'regulatory',
    timestamp: '2025-06-15T08:00:00Z',
    isRead: true,
    highlights: [
      { label: 'Effective', value: 'August 1, 2025' },
      { label: 'Categories', value: 'Electronics, Textiles' },
    ],
    actions: [
      { label: 'View Changes', variant: 'primary' },
    ],
  },
  {
    id: 'msg-emergency-001',
    title: 'Urgent: Suspicious Login Activity Detected',
    content: 'We detected unusual login attempts on your account from an unrecognized device in a new geographic location. If this was not you, please change your password immediately and review your recent activity log.',
    tier: 'critical',
    category: 'emergency',
    timestamp: '2025-06-14T22:00:00Z',
    isRead: false,
    highlights: [
      { label: 'Location', value: 'Unknown (Eastern Europe)' },
      { label: 'Attempts', value: '5 Failed Logins' },
    ],
    actions: [
      { label: 'Change Password', variant: 'primary' },
      { label: 'View Activity Log', variant: 'link' },
    ],
  },
  {
    id: 'msg-seasonal-001',
    title: 'Holiday Schedule: Independence Day Hours',
    content: 'Our offices and support team will observe modified hours for the Independence Day holiday. July 4 — Closed. July 5 — Limited support (9 AM–1 PM PST). Normal operations resume July 7. Plan your shipments accordingly.',
    tier: 'info',
    category: 'seasonal',
    timestamp: '2025-06-13T10:00:00Z',
    isRead: true,
    highlights: [
      { label: 'Closed', value: 'July 4' },
      { label: 'Limited Hours', value: 'July 5 (9AM–1PM)' },
    ],
  },
  {
    id: 'msg-beta-001',
    title: 'Beta Invite: Try the New Analytics Dashboard',
    content: 'You have been selected for early access to our redesigned Analytics Dashboard. The new version features real-time data streaming, customizable widgets, and predictive insights. Your feedback will shape the final release.',
    tier: 'promotion',
    category: 'beta-invite',
    timestamp: '2025-06-12T15:00:00Z',
    isRead: true,
    actions: [
      { label: 'Join Beta', variant: 'primary' },
      { label: 'Learn More', variant: 'link' },
    ],
  },
  {
    id: 'msg-deprecation-001',
    title: 'API v2 Sunset: Migration Required by Sept 30',
    content: 'REST API v2 will be fully deprecated on September 30, 2025. All integrations must migrate to API v3 before this date. v3 offers improved performance, better error handling, and new endpoints. Migration guides and tooling are available in our developer portal.',
    tier: 'warning',
    category: 'deprecation',
    timestamp: '2025-06-11T09:00:00Z',
    isRead: false,
    highlights: [
      { label: 'Sunset Date', value: 'Sept 30, 2025' },
      { label: 'Current Version', value: 'API v2' },
      { label: 'Target Version', value: 'API v3' },
    ],
    actions: [
      { label: 'Migration Guide', variant: 'primary' },
      { label: 'API v3 Docs', variant: 'link' },
    ],
  },
  {
    id: 'msg-other-001',
    title: 'System Performance Optimization Complete',
    content: 'We have completed a series of backend optimizations that improve page load times by up to 40% and reduce API response latency. No action is required on your part — enjoy the faster experience.',
    tier: 'success',
    category: 'system-status',
    timestamp: '2025-06-10T12:00:00Z',
    isRead: true,
    messageType: 'announcement',
  },
]

/** Sample Collaboration messages */
const collaborationMessages: Message[] = [
  {
    id: 'msg-collab-001',
    title: 'OTIF Rate Drop Below Threshold — Zone B Outbound',
    content: 'Our system automatically identified a performance issue: OTIF rate for Zone B outbound has dropped below the 95% threshold. An investigation work item has been created and assigned to the warehouse operations team.',
    tier: 'critical',
    category: 'operational',
    timestamp: '2025-06-24T07:30:00Z',
    isRead: false,
    messageType: 'collaboration',
    highlights: [
      { label: 'Work Item', value: 'WI-001' },
      { label: 'Type', value: 'Issue Driven' },
      { label: 'Priority', value: 'Critical' },
    ],
    actions: [
      { label: 'View Work Item', variant: 'primary', href: '/collaboration/all' },
    ],
  },
  {
    id: 'msg-collab-002',
    title: 'Inventory Discrepancy — SKU TC-BUNDLE-01 Short by 48 Units',
    content: 'A cycle count has revealed a discrepancy for SKU TC-BUNDLE-01. The system count shows 48 fewer units than expected. A collaboration work item has been opened to investigate and resolve the shortage.',
    tier: 'warning',
    category: 'operational',
    timestamp: '2025-06-24T06:15:00Z',
    isRead: false,
    messageType: 'collaboration',
    highlights: [
      { label: 'Work Item', value: 'WI-008' },
      { label: 'SKU', value: 'TC-BUNDLE-01' },
      { label: 'Shortage', value: '48 Units' },
    ],
    actions: [
      { label: 'View Details', variant: 'primary', href: '/collaboration/all' },
    ],
  },
  {
    id: 'msg-collab-003',
    title: 'Charge Approval Required — Outbound Carrier Surcharge',
    content: 'A carrier surcharge of $245.00 has been applied to shipment PRO#1002345. Your approval is required before the charge can be processed. Please review the details and approve or reject.',
    tier: 'warning',
    category: 'billing-account',
    timestamp: '2025-06-23T15:00:00Z',
    isRead: false,
    messageType: 'collaboration',
    highlights: [
      { label: 'Amount', value: '$245.00' },
      { label: 'PRO#', value: '1002345' },
      { label: 'Status', value: 'Pending Approval' },
    ],
    actions: [
      { label: 'Review & Approve', variant: 'primary', href: '/collaboration/approvals' },
    ],
  },
  {
    id: 'msg-collab-004',
    title: 'Service Request Submitted — Dock Scheduling Change',
    content: 'A dock scheduling change request has been submitted for appointment #APT-9921. The customer is requesting to move the delivery window from Tuesday AM to Wednesday PM. The warehouse team is reviewing availability.',
    tier: 'info',
    category: 'operational',
    timestamp: '2025-06-23T11:00:00Z',
    isRead: true,
    messageType: 'collaboration',
    highlights: [
      { label: 'Appointment', value: 'APT-9921' },
      { label: 'Requested By', value: 'Customer' },
    ],
    actions: [
      { label: 'View Request', variant: 'primary', href: '/collaboration/requests' },
    ],
  },
  {
    id: 'msg-collab-005',
    title: 'Resolution Shared — Damaged Goods Claim #CLM-445',
    content: 'The warehouse team has uploaded photo evidence and completed their investigation for claim #CLM-445. The resolution proposal has been shared with you for review. 12 cartons were confirmed damaged during unloading.',
    tier: 'info',
    category: 'operational',
    timestamp: '2025-06-22T16:00:00Z',
    isRead: true,
    messageType: 'collaboration',
    actions: [
      { label: 'Review Resolution', variant: 'primary', href: '/collaboration/all' },
    ],
  },
  {
    id: 'msg-collab-006',
    title: 'SLA Alert — 3 Items Approaching Deadline',
    content: 'Three active work items are approaching their SLA deadline within the next 4 hours. Please review and take action to avoid SLA violations.',
    tier: 'critical',
    category: 'operational',
    timestamp: '2025-06-22T09:00:00Z',
    isRead: true,
    messageType: 'collaboration',
    highlights: [
      { label: 'At Risk', value: '3 Items' },
      { label: 'Time Remaining', value: '< 4 hours' },
    ],
    actions: [
      { label: 'View At-Risk Items', variant: 'primary', href: '/collaboration/alerts' },
    ],
  },
]

export function MessageCenterProvider({ children }: { children: ReactNode }) {
  const { banners } = useBanners()
  const [messages, setMessages] = useState<Message[]>(() => [
    ...bannersToMessages(banners),
    ...sampleMessages.map((m) => ({ ...m, messageType: 'announcement' as const })),
    ...collaborationMessages,
  ])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [newToast, setNewToast] = useState<Message | null>(null)
  const [knownBannerIds, setKnownBannerIds] = useState<Set<string>>(
    () => new Set(banners.map((b) => b.id))
  )

  // Watch for new banners and convert them to messages
  useEffect(() => {
    const newBanners = banners.filter((b) => !knownBannerIds.has(b.id))
    if (newBanners.length > 0) {
      const newMessages = bannersToMessages(newBanners)
      setMessages((prev) => [...newMessages, ...prev])
      setKnownBannerIds((prev) => {
        const next = new Set(prev)
        newBanners.forEach((b) => next.add(b.id))
        return next
      })
      // Show toast for the newest message
      setNewToast(newMessages[0])
      // Auto-dismiss toast after 5 seconds
      setTimeout(() => setNewToast(null), 5000)
    }
  }, [banners, knownBannerIds])

  const unreadCount = messages.filter((m) => !m.isRead).length

  const markAsRead = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })))
  }, [])

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setSelectedMessage(null)
  }, [])

  const openPanel = useCallback(() => setIsPanelOpen(true), [])
  const closePanel = useCallback(() => {
    setIsPanelOpen(false)
    setSelectedMessage(null)
  }, [])

  const dismissToast = useCallback(() => setNewToast(null), [])

  return (
    <MessageCenterContext.Provider
      value={{
        messages,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteMessage,
        selectedMessage,
        setSelectedMessage,
        isPanelOpen,
        openPanel,
        closePanel,
        newToast,
        dismissToast,
      }}
    >
      {children}
    </MessageCenterContext.Provider>
  )
}

export function useMessageCenter() {
  const context = useContext(MessageCenterContext)
  if (!context) {
    throw new Error('useMessageCenter must be used within a MessageCenterProvider')
  }
  return context
}
