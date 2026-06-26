import { X, AlertTriangle, Info, AlertCircle, CheckCircle2, Megaphone } from 'lucide-react'
import { useMessageCenter } from '../../context/MessageCenterContext'
import type { BannerTier } from '../../types/banner'

function TierIcon({ tier }: { tier: BannerTier }) {
  const size = 16
  switch (tier) {
    case 'info': return <Info size={size} className="text-blue-500" />
    case 'warning': return <AlertTriangle size={size} className="text-amber-500" />
    case 'critical': return <AlertCircle size={size} className="text-red-500" />
    case 'success': return <CheckCircle2 size={size} className="text-green-500" />
    case 'promotion': return <Megaphone size={size} className="text-purple-500" />
  }
}

function MessageToast() {
  const { newToast, dismissToast, openPanel, setSelectedMessage } = useMessageCenter()

  if (!newToast) return null

  return (
    <div className="fixed bottom-6 right-6 z-[80] animate-banner-enter">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 overflow-hidden">
        {/* Toast Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TierIcon tier={newToast.tier} />
            <span className="text-xs font-semibold text-gray-700">New Notification</span>
          </div>
          <button
            onClick={dismissToast}
            className="p-0.5 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Toast Body */}
        <button
          onClick={() => {
            setSelectedMessage(newToast)
            openPanel()
            dismissToast()
          }}
          className="w-full text-left px-3 py-3 hover:bg-gray-50 transition-colors"
        >
          <p className="text-xs font-semibold text-gray-800 mb-1">{newToast.title}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{newToast.content}</p>
          <span className="text-[10px] text-primary-600 mt-1.5 inline-block">Click to view details →</span>
        </button>
      </div>
    </div>
  )
}

export default MessageToast
