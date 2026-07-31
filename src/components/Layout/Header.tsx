import {
  PanelLeft,
  Home,
  Heart,
  Phone,
  Settings,
  MessageSquare,
  HelpCircle,
  Bot,
  BarChart2,
} from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

function Header() {
  const { t } = useI18n()

  return (
    <header className="h-14 bg-white border-b border-gray-200 fixed top-0 left-56 right-0 z-30 flex items-center px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <PanelLeft size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <Home size={16} className="text-gray-700 cursor-pointer hover:text-gray-900" />
        <Heart size={16} className="text-purple-400 cursor-pointer hover:text-purple-600" />
        {/* AI Agents entry — right of favorites */}
        <a
          href="https://ai-native.item.pub/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors group"
          title="AI Agents"
        >
          <Bot size={15} className="text-violet-500 group-hover:text-violet-700 transition-colors" />
          <span className="text-xs font-medium text-violet-500 group-hover:text-violet-700 transition-colors">AI Agents</span>
        </a>
        {/* Insights entry — right of AI Agents */}
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors group"
          title="Insights"
        >
          <BarChart2 size={15} className="text-emerald-500 group-hover:text-emerald-700 transition-colors" />
          <span className="text-xs font-medium text-emerald-500 group-hover:text-emerald-700 transition-colors">Insights</span>
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Help Center — left of phone */}
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors group"
          title="Help Center"
        >
          <HelpCircle size={15} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
          <span className="text-xs font-medium text-indigo-400 group-hover:text-indigo-600 transition-colors">Help Center</span>
        </button>

        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Phone size={16} className="text-gray-500" />
        </button>
        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
          <Settings size={16} className="text-gray-500" />
        </button>

        {/* Assistant button — slow animated glow effect */}
        <button className="assistant-glow flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors">
          <MessageSquare size={14} />
          {t('header.assistant')}
        </button>
      </div>

      <style>{`
        @keyframes assistantGlow {
          0%   { background-color: #eff6ff; border-color: #bfdbfe; color: #2563eb; box-shadow: 0 0 0px rgba(99,102,241,0); }
          25%  { background-color: #eef2ff; border-color: #a5b4fc; color: #4338ca; box-shadow: 0 0 8px rgba(99,102,241,0.25); }
          50%  { background-color: #f5f3ff; border-color: #c4b5fd; color: #7c3aed; box-shadow: 0 0 14px rgba(139,92,246,0.35); }
          75%  { background-color: #eef2ff; border-color: #a5b4fc; color: #4338ca; box-shadow: 0 0 8px rgba(99,102,241,0.25); }
          100% { background-color: #eff6ff; border-color: #bfdbfe; color: #2563eb; box-shadow: 0 0 0px rgba(99,102,241,0); }
        }
        .assistant-glow {
          animation: assistantGlow 4s ease-in-out infinite;
        }
        .assistant-glow:hover {
          animation: none;
          background-color: #ede9fe;
          border-color: #8b5cf6;
          color: #6d28d9;
        }
      `}</style>
    </header>
  )
}

export default Header
