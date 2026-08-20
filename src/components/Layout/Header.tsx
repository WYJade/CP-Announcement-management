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
  X,
  Send,
  RefreshCw,
  Image,
  Users,
  Sparkles,
} from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { useNavigate, useLocation } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useFavorites } from '../../context/FavoritesContext'
import { useRole } from '../../context/RoleContext'

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

// ─── Chat reply helper ────────────────────────────────────────────────────────
interface ChatMsg { role: 'user' | 'assistant'; text: string }

function getChatPageLabel(pathname: string): string {
  if (pathname === '/' || pathname === '/home') return 'Home Dashboard'
  if (pathname.startsWith('/dashboard/otif')) return 'OTIF Dashboard'
  if (pathname.startsWith('/dashboard/kpi')) return 'KPI Dashboard'
  if (pathname.startsWith('/insights')) return 'Insights Builder'
  if (pathname.startsWith('/inbound')) return 'Inbound'
  if (pathname.startsWith('/inventory')) return 'Inventory'
  if (pathname.startsWith('/outbound')) return 'Outbound'
  if (pathname.startsWith('/international-new/tracking')) return 'Shipment Tracking'
  if (pathname.startsWith('/international')) return 'International'
  if (pathname.startsWith('/finance')) return 'Finance'
  if (pathname.startsWith('/support')) return 'Service & Support'
  if (pathname.startsWith('/sales')) return 'Sales Orders'
  if (pathname.startsWith('/shipping')) return 'Supply Chain'
  if (pathname.startsWith('/agents')) return 'AI Agents'
  return 'Client Portal'
}

function getReply(question: string, page: string): string {
  const q = question.toLowerCase()
  if (q.includes('track') && q.includes('order')) return `I can help you track that order. Please check the Shipment Tracking page for real-time status, or use the search bar at the top to look up by order number.`
  if (q.includes('freight') || q.includes('freight cost') || q.includes('quote')) return `To calculate freight cost, go to Outbound → Freight Quote. Fill in origin, destination, dimensions, and weight to get a quote.`
  if (q.includes('help') || q.includes('how')) return `On the **${page}** page, use the filters at the top to search by date, customer, or status. Click any row to view details and take action.`
  if (q.includes('exception') || q.includes('issue') || q.includes('problem')) return `On **${page}**, red/orange rows indicate urgent items. Click the item to open the action panel and resolve it.`
  if (q.includes('export') || q.includes('download')) return `On **${page}**, use the Export button at the top right of the table. Supports PDF and CSV formats.`
  if (q.includes('filter') || q.includes('search')) return `On **${page}**, use the filter panel at the top. Filter by date range, customer, status, and more. Press Search to apply.`
  return `You're on **${page}**. I'm here to help you navigate, interpret data, or take actions. What would you like to know?`
}

const QUICK_PROMPTS = [
  'track order DO00036423',
  'Calculate freight cost',
  'Get a freight quote for shipping 5 non-stackable items (each 33x33x33 inches, 33 lbs, class 50, NMFC code nmfc) from Los Angeles, CA 90012 to Westchester, CA 90045',
]

// ─── Assistant Panel (Perplexity-style slide-in from right) ──────────────────
function AssistantPanel({ onClose }: { onClose: () => void }) {
  const location = useLocation()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const page = getChatPageLabel(location.pathname)

  useEffect(() => {
    setMessages([])
    setHasStarted(false)
  }, [location.pathname])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    setHasStarted(true)
    const reply = getReply(msg, page)
    setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: reply }])
  }

  const reset = () => { setMessages([]); setHasStarted(false) }

  const formatText = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/10"
        onClick={onClose}
      />

      {/* Panel — slides in from right, sits below the header */}
      <div
        className="fixed right-0 top-14 bottom-0 z-[9999] flex flex-col bg-white border-l border-gray-200 shadow-2xl assistant-panel"
        style={{ width: '380px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <Bot size={17} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">AI Assistant</p>
              <p className="text-[10px] text-gray-400">Powered by Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={reset} title="Reset conversation" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw size={13} />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {!hasStarted ? (
            <div className="flex flex-col items-center px-6 pt-10 pb-4">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Bot size={26} className="text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-1.5">Welcome to AI Assistant</h2>
              <p className="text-xs text-gray-500 text-center mb-8 leading-relaxed max-w-xs">
                A chat agent to help you query and operate on the web pages
              </p>
              <p className="text-xs font-semibold text-gray-600 mb-3 self-start">You can try asking me:</p>
              <div className="w-full space-y-2.5">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => send(p)}
                    className="w-full text-left px-4 py-3.5 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-200 rounded-xl text-xs text-gray-700 transition-all leading-relaxed shadow-sm"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={12} className="text-primary-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-bl-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                  />
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 bg-white shrink-0 px-4 py-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-200 transition-all">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors" title="Sparkles">
                <Sparkles size={12} className="text-white" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Agents">
                <Users size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Image">
                <Image size={14} />
              </button>
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
                title="Send"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .assistant-panel {
          animation: slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { isFavorited, toggleFavorite } = useFavorites()
  const { role, setRole } = useRole()
  const [helpOpen, setHelpOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)

  const currentPath = location.pathname
  const currentLabel = getPageLabel(currentPath)
  const favorited = isFavorited(currentPath)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false)
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
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

          {/* Insights entry */}
          <button
            onClick={() => navigate('/insights')}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors group"
            title="Insights"
          >
            <BarChart2 size={16} className={`transition-colors ${location.pathname === '/insights' ? 'text-emerald-600' : 'text-emerald-400 group-hover:text-emerald-600'}`} />
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

          {/* Assistant button — rightmost in header */}
          <button
            onClick={() => setAssistantOpen(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              assistantOpen
                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200'
            }`}
            title="Open AI Assistant"
          >
            <Bot size={14} className={assistantOpen ? 'text-white' : 'text-primary-500'} />
            <span>Assistant</span>
          </button>
        </div>
      </header>

      {/* Assistant slide-in panel */}
      {assistantOpen && <AssistantPanel onClose={() => setAssistantOpen(false)} />}
    </>
  )
}

export default Header
