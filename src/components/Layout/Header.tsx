import { useState, useRef, useEffect } from 'react'
import {
  PanelLeft,
  Home,
  HelpCircle,
  Bot,
  BarChart2,
  ChevronDown,
  Users2,
  BookOpen,
  Moon,
  Sun,
  Heart,
} from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { useNavigate, useLocation } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useFavorites } from '../../context/FavoritesContext'

// ─── Path → readable label ────────────────────────────────────────────────────
function getPageLabel(pathname: string): string {
  const map: Record<string, string> = {
    '/': 'Home', '/home': 'Home', '/dashboard/otif': 'OTIF Dashboard', '/dashboard/kpi': 'KPI Dashboard',
    '/insights': 'Insights', '/inbound/inquiry': 'Inbound Inquiry', '/inventory/activity': 'Inventory Activity',
    '/outbound/inquiry': 'Outbound Inquiry', '/outbound/freight-quote': 'Freight Quote',
    '/international-new/tracking': 'Shipment Tracking', '/finance/invoices': 'Invoice',
    '/support/requests': 'My Requests', '/sales/wholesale': 'Wholesale Orders', '/sales/retail': 'Retail Orders',
    '/shipping/shipments': 'Shipments', '/shipping/tracking': 'Tracking', '/agents': 'AI Agents',
  }
  return map[pathname] ?? pathname.split('/').pop()?.replace(/-/g,' ') ?? 'Page'
}

function Header() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { isFavorited, toggleFavorite } = useFavorites()
  const [helpOpen, setHelpOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)

  const currentPath = location.pathname
  const currentLabel = getPageLabel(currentPath)
  const favorited = isFavorited(currentPath)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-14 bg-white border-b border-gray-200 fixed top-0 left-56 right-0 z-30 flex items-center px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <PanelLeft size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <Home size={16} className="text-gray-700 cursor-pointer hover:text-gray-900" onClick={() => navigate('/')} />

        {/* Favorite current page */}
        <button
          onClick={() => toggleFavorite(currentPath, currentLabel)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart
            size={16}
            className={`transition-colors ${favorited ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-rose-400'}`}
          />
        </button>

        {/* AI Agents entry */}
        <a
          href="https://ai-native.item.pub/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
          title="AI Agents"
          data-tour="header-ai-agents"
        >
          <Bot size={16} className="text-violet-500 group-hover:text-violet-700 transition-colors" />
        </a>

        {/* Insights entry */}
        <button
          onClick={() => navigate('/insights')}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
          title="Insights"
          data-tour="header-insights"
        >
          <BarChart2 size={16} className="text-emerald-500 group-hover:text-emerald-700 transition-colors" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Help & Support dropdown */}
        <div ref={helpRef} className="relative" data-tour="help-support">
          <button
            onClick={() => setHelpOpen(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors group ${helpOpen ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-indigo-400 hover:text-indigo-600'}`}
            title="Help & Support"
          >
            <HelpCircle size={15} className="transition-colors" />
            <span className="text-xs font-medium transition-colors">Help &amp; Support</span>
            <ChevronDown size={11} className={`transition-transform ${helpOpen ? 'rotate-180' : ''}`} />
          </button>

          {helpOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <a
                href="https://help.item.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHelpOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <BookOpen size={13} className="text-indigo-400 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">Help Center</p>
                  <p className="text-[10px] text-gray-400">Browse docs &amp; guides</p>
                </div>
              </a>
              <button
                onClick={() => { navigate('/support/requests'); setHelpOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Users2 size={13} className="text-indigo-400 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">Service &amp; Support</p>
                  <p className="text-[10px] text-gray-400">My requests & tickets</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Dark / Light mode toggle */}
        <button
          onClick={() => setDarkMode(v => !v)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode
            ? <Sun size={16} className="text-amber-500" />
            : <Moon size={16} className="text-gray-500 hover:text-gray-700" />
          }
        </button>

        {/* Language switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default Header
