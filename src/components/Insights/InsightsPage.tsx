import { useState, useRef, useEffect } from 'react'
import { BarChart2, TrendingUp, Ticket, Bot, Send, Sparkles, ChevronRight } from 'lucide-react'
import OTIFDashboard from '../Dashboard/OTIFDashboard'
import KPIDashboard from '../Dashboard/KPIDashboard'

const TABS = [
  { id: 'otif', label: 'OTIF Dashboard', icon: <TrendingUp size={14} /> },
  { id: 'kpi', label: 'KPI Dashboard', icon: <BarChart2 size={14} /> },
  { id: 'ticket', label: 'Ticket Insights', icon: <Ticket size={14} /> },
]

// Sample chat-generated dashboard suggestions
const QUICK_PROMPTS = [
  'Show OTIF trend for last 4 weeks',
  'Which customers have the lowest fill rate?',
  'Compare on-time delivery by carrier',
  'Show KPI summary for this month',
]

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  showDashboard?: 'otif' | 'kpi'
}

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('otif')
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hi! I can help you generate or explore dashboards. Try asking about OTIF trends, KPI summaries, or carrier performance.' },
  ])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')

    const userMsg: ChatMessage = { role: 'user', text: msg }
    const q = msg.toLowerCase()

    let reply: ChatMessage
    if (q.includes('otif') || q.includes('on time') || q.includes('in full') || q.includes('trend')) {
      reply = { role: 'assistant', text: 'Here\'s the OTIF Dashboard based on your query. You can see the trend and drill down by customer or carrier.', showDashboard: 'otif' }
    } else if (q.includes('kpi') || q.includes('key performance') || q.includes('summary') || q.includes('fill rate')) {
      reply = { role: 'assistant', text: 'Here\'s the KPI Dashboard. It shows fill rate, on-time accountability, and delivery performance metrics.', showDashboard: 'kpi' }
    } else if (q.includes('customer') || q.includes('carrier') || q.includes('lowest')) {
      reply = { role: 'assistant', text: 'I\'ve pulled up the OTIF view filtered for customer/carrier analysis. You can use the filters on the dashboard to narrow down further.', showDashboard: 'otif' }
    } else {
      reply = { role: 'assistant', text: 'I can help generate dashboards based on your question. Try asking about OTIF trends, KPI performance, fill rate by customer, or delivery metrics.' }
    }

    setMessages(prev => [...prev, userMsg, reply])
    if (reply.showDashboard) setActiveTab(reply.showDashboard)
  }

  return (
    <div className="flex gap-4 h-full min-h-0">
      {/* Main dashboard area */}
      <div className="flex-1 min-w-0">
        {/* Page header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-600" />
            <h1 className="text-lg font-bold text-gray-900">Insights</h1>
          </div>
          <button
            onClick={() => setChatOpen(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${chatOpen ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Sparkles size={13} />
            {chatOpen ? 'Hide Chat' : 'Generate with Chat'}
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard content */}
        {activeTab === 'otif' && <OTIFDashboard />}
        {activeTab === 'kpi' && <KPIDashboard />}
        {activeTab === 'ticket' && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Ticket size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-500">Ticket Insights</p>
            <p className="text-xs text-gray-400 mt-1">Dashboard coming soon. You can use the chat to explore ticket data.</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['Show open tickets by category', 'Ticket volume trend this month', 'Average resolution time'].map(p => (
                <button key={p} onClick={() => { setChatOpen(true); handleSend(p) }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                  <ChevronRight size={11} className="text-gray-400" />{p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat panel */}
      {chatOpen && (
        <div className="w-72 shrink-0 flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Bot size={12} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Dashboard AI</p>
              <p className="text-[10px] text-gray-400">Generate dashboards with chat</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-700 rounded-bl-none'
                }`}>
                  {m.text}
                  {m.showDashboard && (
                    <button onClick={() => setActiveTab(m.showDashboard!)}
                      className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-200 hover:text-white underline">
                      <BarChart2 size={9} /> View {m.showDashboard.toUpperCase()} Dashboard
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 py-2 border-t border-gray-100 space-y-1">
            <p className="text-[9px] text-gray-400 uppercase font-semibold">Quick prompts</p>
            <div className="flex flex-wrap gap-1">
              {QUICK_PROMPTS.slice(0, 2).map(p => (
                <button key={p} onClick={() => handleSend(p)}
                  className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 truncate max-w-full">
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-100 bg-white">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your data..."
                className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
              <button onClick={() => handleSend()} disabled={!input.trim()}
                className="text-emerald-500 hover:text-emerald-700 disabled:text-gray-300 transition-colors">
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
