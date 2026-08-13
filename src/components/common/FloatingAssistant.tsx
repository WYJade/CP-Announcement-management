import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Moon, RefreshCw, Image, Users, Sparkles } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface ChatMsg { role: 'user' | 'assistant'; text: string }

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

export default function FloatingAssistant() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const page = getPageLabel(location.pathname)

  useEffect(() => {
    setMessages([])
    setHasStarted(false)
  }, [location.pathname])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

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
      {/* Full-height chat panel */}
      {open && (
        <div
          className="fixed right-5 bg-white rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden border border-gray-200"
          style={{ bottom: '72px', width: '320px', height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={reset} title="Reset" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <RefreshCw size={13} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {!hasStarted ? (
              /* Welcome screen */
              <div className="flex flex-col items-center px-5 pt-8 pb-4">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Welcome to AI Assistant</h2>
                <p className="text-xs text-gray-500 text-center mb-6 leading-relaxed">
                  This is a chat agent to help query and operate on the web pages
                </p>
                <p className="text-xs font-medium text-gray-700 mb-3 self-start">You can try asking me:</p>
                <div className="w-full space-y-2">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => send(p)}
                      className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs text-gray-700 transition-colors leading-relaxed"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat messages */
              <div className="px-4 py-3 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {m.role === 'assistant' && (
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={11} className="text-primary-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
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
          <div className="border-t border-gray-100 bg-white">
            <div className="mx-3 mt-2.5 mb-1">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary-300 transition-all">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask anything..."
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
            </div>
            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors" title="Sparkles">
                  <Sparkles size={14} className="text-white" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Agents">
                  <Users size={15} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Image">
                  <Image size={15} />
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
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(v => !v)}
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
