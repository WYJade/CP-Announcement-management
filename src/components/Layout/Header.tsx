import {
  PanelLeft,
  Home,
  Heart,
  Phone,
  Puzzle,
  Settings,
  MessageSquare,
} from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { useLocation } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'

function Header() {
  const { t } = useI18n()
  const location = useLocation()

  return (
    <header className="h-14 bg-white border-b border-gray-200 fixed top-0 left-56 right-0 z-30 flex items-center px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <PanelLeft size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <Home size={16} className="text-gray-700 cursor-pointer hover:text-gray-900" />
        <Heart size={16} className="text-purple-400 cursor-pointer hover:text-purple-600" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Phone size={16} className="text-gray-500" />
        </button>
        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Settings size={16} className="text-gray-500" />
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
