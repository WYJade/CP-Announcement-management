import { useState } from 'react'
import { X, CheckCheck, AlertTriangle, Info, AlertCircle, CheckCircle2, Megaphone, Users2 } from 'lucide-react'
import { useMessageCenter, type Message } from '../../context/MessageCenterContext'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import type { BannerTier } from '../../types/banner'

const tierColors: Record<BannerTier, { bg: string; icon: string }> = {
  info: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  warning: { bg: 'bg-amber-50', icon: 'text-amber-500' },
  critical: { bg: 'bg-red-50', icon: 'text-red-500' },
  success: { bg: 'bg-green-50', icon: 'text-green-500' },
  promotion: { bg: 'bg-purple-50', icon: 'text-purple-500' },
}

function TierIcon({ tier, size = 14 }: { tier: BannerTier; size?: number }) {
  const color = tierColors[tier].icon
  switch (tier) {
    case 'info': return <Info size={size} className={color} />
    case 'warning': return <AlertTriangle size={size} className={color} />
    case 'critical': return <AlertCircle size={size} className={color} />
    case 'success': return <CheckCircle2 size={size} className={color} />
    case 'promotion': return <Megaphone size={size} className={color} />
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

type PanelTab = 'announcement' | 'collaboration'

const MAX_VISIBLE = 6

function MessagePanel() {
  const { isPanelOpen, closePanel, messages, markAllAsRead, markAsRead } = useMessageCenter()
  const navigate = useNavigate()
  const { tt } = useI18n()
  const [activeTab, setActiveTab] = useState<PanelTab>('announcement')

  if (!isPanelOpen) return null

  const announcementMessages = messages.filter((m) => m.messageType !== 'collaboration')
  const collaborationMsgs = messages.filter((m) => m.messageType === 'collaboration')

  const currentMessages = activeTab === 'announcement' ? announcementMessages : collaborationMsgs
  const visibleMessages = currentMessages.slice(0, MAX_VISIBLE)
  const remainingCount = currentMessages.length - MAX_VISIBLE

  const handleClickMessage = (msg: Message) => {
    markAsRead(msg.id)
    closePanel()
    navigate('/messages')
  }

  const handleViewAll = () => {
    closePanel()
    navigate('/messages')
  }

  const announcementUnread = announcementMessages.filter((m) => !m.isRead).length
  const collabUnread = collaborationMsgs.filter((m) => !m.isRead).length

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60]" onClick={closePanel} />

      {/* Panel */}
      <div className="fixed top-14 right-4 w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 z-[70] flex flex-col overflow-hidden animate-banner-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="text-sm font-semibold">{tt('Message Center')}</span>
          </div>
          <button onClick={closePanel} className="p-1 rounded hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('announcement')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'announcement'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Megaphone size={12} />
            {tt('Announcements')}
            {announcementUnread > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] h-3.5 flex items-center justify-center">
                {announcementUnread}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'collaboration'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users2 size={12} />
            {tt('Urgent & Important Notice')}
            {collabUnread > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] h-3.5 flex items-center justify-center">
                {collabUnread}
              </span>
            )}
          </button>
        </div>

        {/* Sub-header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
          <span className="text-xs text-gray-500">
            {currentMessages.length} messages
          </span>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-700 transition-colors"
          >
            <CheckCheck size={10} />
            {tt('Mark all read')}
          </button>
        </div>

        {/* Message List (max 6) */}
        <div className="overflow-y-auto" style={{ maxHeight: '360px' }}>
          {visibleMessages.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-xs text-gray-400">
              {tt('No messages')}
            </div>
          ) : (
            visibleMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleClickMessage(msg)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                  !msg.isRead ? 'bg-primary-50/20' : ''
                }`}
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 mt-1.5">
                  {!msg.isRead ? (
                    <span className="w-2 h-2 rounded-full bg-primary-500 block"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-200 block"></span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${tierColors[msg.tier].bg}`}>
                  <TierIcon tier={msg.tier} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold truncate ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {msg.title}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{msg.content}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer: remaining count + View All */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
          {remainingCount > 0 && (
            <span className="text-[10px] text-gray-400">
              {remainingCount} {tt('more messages')}
            </span>
          )}
          <button
            onClick={handleViewAll}
            className="ml-auto text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {tt('View All →')}
          </button>
        </div>
      </div>
    </>
  )
}

export default MessagePanel
