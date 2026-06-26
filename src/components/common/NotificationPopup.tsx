import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, AlertTriangle } from 'lucide-react'

const URGENT_NOTIFICATIONS = [
  {
    id: 'urgent-1',
    title: 'Scheduled Maintenance Window',
    message: 'Our platform will undergo scheduled maintenance on July 5, 2026 from 02:00-06:00 AM UTC. During this time, order processing and inventory updates may be temporarily unavailable.',
    time: '10m ago',
  },
  {
    id: 'urgent-2',
    title: 'Security Alert: Suspicious Login',
    message: 'Your account was accessed from an unusual location (Miami, US) at 03:42. If this was not you, please change your password immediately.',
    time: '2m ago',
  },
]

// Re-appear interval for demo: 2 minutes (120 seconds)
const REAPPEAR_INTERVAL = 120_000

export default function NotificationPopup() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)

  const showPopup = useCallback(() => {
    setVisible(true)
  }, [])

  useEffect(() => {
    // Initial show after 5 seconds
    const initialTimer = setTimeout(showPopup, 5000)
    return () => clearTimeout(initialTimer)
  }, [showPopup])

  // Re-appear after 2 minutes when closed
  useEffect(() => {
    if (!visible) {
      const reappearTimer = setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % URGENT_NOTIFICATIONS.length)
        setVisible(true)
      }, REAPPEAR_INTERVAL)
      return () => clearTimeout(reappearTimer)
    }
  }, [visible])

  const handleClose = () => {
    setVisible(false)
  }

  const handleViewAll = () => {
    navigate('/messages')
    setVisible(false)
  }

  if (!visible) return null

  const notification = URGENT_NOTIFICATIONS[currentIdx]

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-red-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={14} className="text-red-600" />
          </div>
          <span className="text-sm font-semibold text-red-800">Urgent Notice</span>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-white/60 transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold text-gray-800 mb-1">{notification.title}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleViewAll}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View All Messages
        </button>
      </div>
    </div>
  )
}
