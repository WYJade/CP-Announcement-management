import {
  Home,
  Circle,
  Settings,
  Bell,
  MessageSquare,
} from 'lucide-react'
import { useMessageCenter } from '../../context/MessageCenterContext'
import { useI18n } from '../../context/I18nContext'
import LanguageSwitcher from './LanguageSwitcher'

function Header() {
  const { unreadCount, openPanel } = useMessageCenter()
  const { t } = useI18n()

  return (
    <header className="h-14 bg-white border-b border-gray-200 fixed top-0 left-72 right-0 z-30 flex items-center px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Home size={16} className="text-gray-500" />
        <Circle size={8} className="text-green-500 fill-green-500" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Settings size={16} className="text-gray-500" />
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Message Center Bell */}
        <button
          onClick={openPanel}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors relative"
          title="Message Center"
        >
          <Bell size={16} className="text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors">
          <MessageSquare size={14} />
          {t('header.assistant')}
        </button>
      </div>
    </header>
  )
}

export default Header
