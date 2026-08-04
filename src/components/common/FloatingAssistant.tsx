import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Minimize2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface ChatMsg { role: 'user' | 'assistant'; text: string }

// ─── Page-context label ───────────────────────────────────────────────────────
function getPageLabel(pathname: string): string {
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

// ─── Simple AI reply based on page context ───────────────────────────────────
function getReply(question: string, page: string): string {
  const q = question.toLowerCase()
  if (q.includes('help') || q.includes('how')) {
    return `On the **${page}** page, you can use the filters at the top to search by date, customer, or status. Click any row to view details and take action.`
  }
  if (q.includes('exception') || q.includes('issue') || q.includes('problem')) {
    return `I can see you're on **${page}**. For exceptions, check the highlighted rows — red/orange indicates urgent items that need your attention. Click the item to open the action panel.`
  }
  if (q.includes('export') || q.includes('download')) {
    return `On **${page}**, you can export data using the Export button at the top right of the table. It supports PDF and CSV formats.`
  }
  if (q.includes('filter') || q.includes('search')) {
    return `On **${page}**, use the filter panel at the top. You can filter by date range, customer, status, and more. Press Search to apply the filters.`
  }
  return `You're currently on **${page}**. I'm here to help you navigate this page, interpret the data, or take actions. What would you like to know?`
}

export default function FloatingAssistant() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const page = getPageLabel(location.pathname)

  // Reset conversation when page changes
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      text: `Hi! I'm your Assistant. You're on **${page}**. How can I help you with this page?`,
    }])
  }, [location.pathname])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = () => {
    const msg = input.trim()
    if (!msg) return
    setInput('')
    const reply = getReply(msg, page)
    setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: reply }])
  }

  const formatText = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  return (
    <>
      {/* Chat panel */}
      {open && !minimized && (
        <div className="fixed bottom-20 right-5 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden"
          style={{ maxHeight: '420px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-600 to-violet-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Assistant</p>
                <p className="text-[9px] text-white/70 truncate max-w-[150px]">{page}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(true)} className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white">
                <Minimize2 size={12} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white">
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={11} className="text-primary-600" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
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

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary-400 focus-within:bg-white transition-all">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about this page..."
                className="flex-1 text-xs text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
              <button onClick={send} disabled={!input.trim()}
                className="text-primary-500 hover:text-primary-700 disabled:text-gray-300 transition-colors">
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized bar */}
      {open && minimized && (
        <div className="fixed bottom-20 right-5 bg-white border border-gray-200 rounded-full shadow-lg z-[9999] flex items-center gap-2 px-3 py-2 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setMinimized(false)}>
          <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
            <Bot size={10} className="text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">Assistant · {page}</span>
          <X size={12} className="text-gray-400 hover:text-gray-600" onClick={e => { e.stopPropagation(); setOpen(false) }} />
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => { setOpen(v => !v); setMinimized(false) }}
        className="fixed bottom-5 right-5 z-[9999] w-12 h-12 bg-gradient-to-br from-primary-600 to-violet-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 assistant-fab"
        title="Open Assistant"
      >
        {open ? <X size={18} className="text-white" /> : <MessageSquare size={18} className="text-white" />}
      </button>

      <style>{`
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(99,102,241,0.4); }
          50% { box-shadow: 0 4px 20px rgba(139,92,246,0.6); }
        }
        .assistant-fab { animation: fabPulse 3s ease-in-out infinite; }
        .assistant-fab:hover { animation: none; }
      `}</style>
    </>
  )
}
