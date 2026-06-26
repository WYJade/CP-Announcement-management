import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle2,
  Megaphone,
  ExternalLink,
  Eye,
  Filter,
  Search,
} from 'lucide-react'
import { useMessageCenter, type Message } from '../../context/MessageCenterContext'
import { useI18n } from '../../context/I18nContext'
import type { BannerTier, BannerCategory } from '../../types/banner'
import PayDialog from '../Finance/PayDialog'
import LearnMoreModal from '../common/LearnMoreModal'
import ReleaseNotesModal from '../common/ReleaseNotesModal'
import { invoices } from '../../data/invoices'

const tierColors: Record<BannerTier, { bg: string; text: string; icon: string; badge: string }> = {
  info: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500', badge: 'bg-red-100 text-red-700' },
  success: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500', badge: 'bg-green-100 text-green-700' },
  promotion: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500', badge: 'bg-purple-100 text-purple-700' },
}

const categoryLabels: Partial<Record<BannerCategory, string>> = {
  'system-status': 'System Status',
  'feature-release': 'New Feature',
  'announcement': 'Announcement',
  'policy-compliance': 'Policy & Compliance',
  'billing-account': 'Billing & Account',
  'security': 'Security Alert',
  'operational': 'Operations',
  'survey-feedback': 'Survey & Feedback',
  'training-events': 'Training & Events',
  'promotion-upsell': 'Promotion',
  'onboarding': 'Onboarding',
  'regulatory': 'Regulatory',
  'emergency': 'Emergency',
  'seasonal': 'Seasonal',
  'beta-invite': 'Beta Invite',
  'deprecation': 'Deprecation Warning',
}

function TierIcon({ tier, size = 18 }: { tier: BannerTier; size?: number }) {
  const color = tierColors[tier].icon
  switch (tier) {
    case 'info': return <Info size={size} className={color} />
    case 'warning': return <AlertTriangle size={size} className={color} />
    case 'critical': return <AlertCircle size={size} className={color} />
    case 'success': return <CheckCircle2 size={size} className={color} />
    case 'promotion': return <Megaphone size={size} className={color} />
  }
}

function formatDateTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type FilterTab = 'all' | 'unread' | 'read'

type MessageTypeFilter = 'all-types' | 'announcement' | 'collaboration'

function MessageCenterPage() {
  const { messages, markAsRead, markAllAsRead, deleteMessage } = useMessageCenter()
  const { t, tt } = useI18n()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [messageTypeFilter, setMessageTypeFilter] = useState<MessageTypeFilter>('all-types')
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [listWidth, setListWidth] = useState(380)
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const bannerInvoice = invoices.find((inv) => inv.invoiceNumber === '19043770')

  const filteredMessages = messages.filter((msg) => {
    // Type filter
    if (messageTypeFilter === 'announcement' && msg.messageType === 'collaboration') return false
    if (messageTypeFilter === 'collaboration' && msg.messageType !== 'collaboration') return false
    // Read/unread filter
    if (activeTab === 'unread' && msg.isRead) return false
    if (activeTab === 'read' && !msg.isRead) return false
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return msg.title.toLowerCase().includes(q) || msg.content.toLowerCase().includes(q)
    }
    return true
  })

  // Auto-select first message
  if (!selectedMsg && filteredMessages.length > 0) {
    setSelectedMsg(filteredMessages[0])
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  // Drag handler for resizable divider
  const handleMouseDown = useCallback(() => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left
      // Clamp between 260 and 600
      setListWidth(Math.max(260, Math.min(600, newWidth)))
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('messages.title')}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{t('messages.subtitle')}</p>
          </div>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <CheckCheck size={14} />
            {t('messages.markAllRead')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Message Type Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <TabButton label="All" count={messages.length} isActive={messageTypeFilter === 'all-types'} onClick={() => setMessageTypeFilter('all-types')} />
          <TabButton label="Announcements" count={messages.filter((m) => m.messageType !== 'collaboration').length} isActive={messageTypeFilter === 'announcement'} onClick={() => setMessageTypeFilter('announcement')} />
          <TabButton label="Urgent & Important" count={messages.filter((m) => m.messageType === 'collaboration').length} isActive={messageTypeFilter === 'collaboration'} onClick={() => setMessageTypeFilter('collaboration')} />
        </div>

        {/* Read status tabs */}
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <TabButton label={t('messages.all')} count={messages.length} isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <TabButton label={t('messages.unread')} count={unreadCount} isActive={activeTab === 'unread'} onClick={() => setActiveTab('unread')} />
          <TabButton label={t('messages.read')} count={messages.length - unreadCount} isActive={activeTab === 'read'} onClick={() => setActiveTab('read')} />
        </div>
      </div>

      {/* Content: Resizable List + Detail */}
      <div ref={containerRef} className="flex bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden" style={{ minHeight: '540px' }}>
        {/* Message List */}
        <div className="flex flex-col overflow-hidden flex-shrink-0" style={{ width: `${listWidth}px` }}>
          {/* Search */}
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('messages.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              />
            </div>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Filter size={24} className="mb-2 opacity-50" />
                <p className="text-sm">{t('messages.noMessages')}</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => { markAsRead(msg.id); setSelectedMsg(msg) }}
                  className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                    selectedMsg?.id === msg.id ? 'bg-primary-50/50 border-l-2 border-l-primary-500' : ''
                  } ${!msg.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tierColors[msg.tier].bg}`}>
                    <TierIcon tier={msg.tier} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold truncate ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {tt(msg.title)}
                      </span>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"></span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{tt(msg.content)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${tierColors[msg.tier].badge}`}>{msg.tier}</span>
                      <span className="text-[10px] text-gray-400">{formatDateTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-200 hover:bg-primary-400 cursor-col-resize flex-shrink-0 transition-colors relative group"
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {selectedMsg ? (
            <>
              {/* Detail Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tierColors[selectedMsg.tier].bg}`}>
                    <TierIcon tier={selectedMsg.tier} size={20} />
                  </div>
                  <div className="min-w-0">
                    <h2 className={`text-base font-semibold truncate ${tierColors[selectedMsg.tier].text}`}>{tt(selectedMsg.title)}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(selectedMsg.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${tierColors[selectedMsg.tier].badge}`}>
                    {categoryLabels[selectedMsg.category] || selectedMsg.category}
                  </span>
                  {!selectedMsg.isRead && (
                    <button onClick={() => markAsRead(selectedMsg.id)} className="p-1.5 rounded hover:bg-gray-100" title="Mark as read">
                      <Eye size={14} className="text-gray-400" />
                    </button>
                  )}
                  <button onClick={() => { deleteMessage(selectedMsg.id); setSelectedMsg(null) }} className="p-1.5 rounded hover:bg-red-50" title="Delete">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="text-sm text-gray-700 leading-relaxed mb-5">{tt(selectedMsg.content)}</p>
                {selectedMsg.highlights && selectedMsg.highlights.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('messages.keyInformation')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedMsg.highlights.map((h) => (
                        <div key={h.label} className="bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                          <p className="text-[10px] text-gray-400 uppercase">{h.label}</p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">{h.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedMsg.actions && selectedMsg.actions.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('messages.quickActions')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMsg.actions.map((action) => {
                        const handleClick = () => {
                          if (action.label === 'Pay Now') {
                            setPayDialogOpen(true)
                          } else if (action.label === 'Learn More' || action.label === 'Try It Now') {
                            setLearnMoreOpen(true)
                          } else if (action.label === 'Release Notes') {
                            setReleaseNotesOpen(true)
                          } else if (action.href?.startsWith('/')) {
                            navigate(action.href)
                          }
                        }
                        if (action.variant === 'primary') {
                          return (
                            <button key={action.label} onClick={handleClick} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                              {action.label}
                            </button>
                          )
                        }
                        return (
                          <button key={action.label} onClick={handleClick} className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors inline-flex items-center gap-1">
                            {action.label}<ExternalLink size={12} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-3 opacity-40">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p className="text-sm">{t('messages.selectMessage')}</p>
              <p className="text-xs mt-1">{t('messages.clickAny')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PayDialog isOpen={payDialogOpen} onClose={() => setPayDialogOpen(false)} initialInvoice={bannerInvoice} />
      <LearnMoreModal isOpen={learnMoreOpen} onClose={() => setLearnMoreOpen(false)} />
      <ReleaseNotesModal isOpen={releaseNotesOpen} onClose={() => setReleaseNotesOpen(false)} />
    </div>
  )
}

function TabButton({ label, count, isActive, onClick }: { label: string; count: number; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
      {label}<span className={`ml-1.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>({count})</span>
    </button>
  )
}

export default MessageCenterPage
