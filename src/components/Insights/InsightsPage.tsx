import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart2, TrendingUp, Ticket, Bot, Send, Sparkles,
  Plus, MessageSquare, LayoutDashboard, Search, ChevronRight,
  X, Clock, Lightbulb, Users, Package, DollarSign, Ship,
} from 'lucide-react'
import OTIFDashboard from '../Dashboard/OTIFDashboard'
import KPIDashboard from '../Dashboard/KPIDashboard'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  widget?: 'otif' | 'kpi' | 'chart'
  chartData?: { label: string; value: number }[]
  timestamp: string
}

interface SavedDashboard {
  id: string
  title: string
  type: 'otif' | 'kpi' | 'chart'
  createdAt: string
}

interface ChatSession {
  id: string
  title: string
  createdAt: string
  messages: ChatMessage[]
}

// ─── Suggested Questions ──────────────────────────────────────────────────────
const SUGGESTED = [
  { label: 'Suggested Question', items: [
    'Show me the OTIF trend for the last 4 weeks',
    'Which customers have the lowest fill rate this month?',
    'Compare on-time delivery rate by carrier',
    'What is the total number of in-transit shipments?',
    'Show monthly freight spend across all locations',
  ]},
  { label: 'Domain Question', items: [
    'Which shipments need immediate attention due to pending customs hold?',
    'Show me inventory shortage risk by SKU',
    'What is the average drayage transit time from Garden City Terminal?',
    'Create a chart showing OTIF by customer for last quarter',
    'List all containers approaching LFD in the next 48 hours',
  ]},
]

// ─── Mock saved state ─────────────────────────────────────────────────────────
const INITIAL_DASHBOARDS: SavedDashboard[] = [
  { id: 'd1', title: 'OTIF Weekly Trend', type: 'otif', createdAt: 'Aug 1, 2026' },
  { id: 'd2', title: 'KPI Summary Aug', type: 'kpi', createdAt: 'Aug 2, 2026' },
]

const INITIAL_SESSIONS: ChatSession[] = [
  { id: 's1', title: 'Monthly Shipment Statistics', createdAt: 'Today', messages: [] },
  { id: 's2', title: 'OTIF risk analysis for Walmart', createdAt: 'Today', messages: [] },
  { id: 's3', title: 'Inventory shortage by SKU', createdAt: 'Yesterday', messages: [] },
]

// ─── Inline Mini Chart ────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-end gap-2 h-20">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-primary-500 rounded-t transition-all" style={{ height: `${(d.value / max) * 64}px` }} />
            <span className="text-[9px] text-gray-400 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const navigate = useNavigate()
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [activeDashboard, setActiveDashboard] = useState<'kpi'|'otif'|'ticket'|'report-otif-summary'|'report-lead-time'|'report-penalties'|'report-routing'|'report-root-cause'|null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS)
  const [dashboards, setDashboards] = useState<SavedDashboard[]>(INITIAL_DASHBOARDS)
  const savedDashboards = dashboards
  const [input, setInput] = useState('')
  const [suggestTab, setSuggestTab] = useState(0)
  const [sidebarSearch, setSidebarSearch] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const currentSession = sessions.find(s => s.id === activeSession)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [currentSession?.messages])

  // ─── Create new session ────────────────────────────────────────────────────
  const newSession = (initialMsg?: string) => {
    const id = `s${Date.now()}`
    const newS: ChatSession = {
      id, title: initialMsg ? initialMsg.slice(0, 40) : 'New Conversation',
      createdAt: 'Just now', messages: [],
    }
    setSessions(prev => [newS, ...prev])
    setActiveSession(id)
    if (initialMsg) sendMessage(initialMsg, id, [])
  }

  // ─── Send message ──────────────────────────────────────────────────────────
  const sendMessage = (text: string, sessionId: string, existing: ChatMessage[]) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = { role: 'user', text, timestamp: now }

    const q = text.toLowerCase()
    let reply: ChatMessage

    if (q.includes('otif') || q.includes('on time') || q.includes('in full')) {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'Here is the OTIF Dashboard based on your query. It shows on-time rate, fill rate, and trend analysis for the current period.',
        widget: 'otif',
      }
    } else if (q.includes('kpi') || q.includes('key performance') || q.includes('summary')) {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'Here is the KPI Dashboard summarizing your key performance indicators including fill rate, delivery accuracy, and OTIF compliance.',
        widget: 'kpi',
      }
    } else if (q.includes('carrier') || q.includes('freight spend') || q.includes('chart') || q.includes('compare')) {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'I\'ve generated a comparison chart based on your query. The data shows performance distribution across carriers/locations.',
        widget: 'chart',
        chartData: [
          { label: 'COSCO', value: 94 }, { label: 'MSC', value: 87 }, { label: 'Evergreen', value: 91 },
          { label: 'WAN HAI', value: 88 }, { label: 'CMA CGM', value: 96 },
        ],
      }
    } else if (q.includes('customer') || q.includes('fill rate')) {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'Based on current data, the customers with the lowest fill rates are:\n\n• THE ONLY BEAN LLC — 91.2%\n• ORGAIN LLC — 92.8%\n• VITA COCO — 94.1%\n\nThese accounts should be prioritized for inventory replenishment review.',
      }
    } else if (q.includes('lfd') || q.includes('container') || q.includes('demurrage')) {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'Containers approaching LFD in next 48 hours:\n\n• WHSU8555505 — LFD Jun 19, at Garden City Terminal (⚠ At risk)\n• XYLU8225020 — LFD Jun 20, at Savannah\n• MAGU5754435 — LFD Jun 20, at Long Beach\n\nRecommend initiating dispatch for WHSU8555505 immediately.',
      }
    } else if (q.includes('shipment') || q.includes('transit') || q.includes('in-transit')) {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'Current in-transit shipments: **1,248** across all lanes.\n\n• Asia → US West Coast: 542 vessels\n• Asia → US East Coast: 398 vessels\n• In drayage / final leg: 308 shipments\n\nWould you like to see a breakdown by port or customer?',
        widget: 'chart',
        chartData: [
          { label: 'W30', value: 1180 }, { label: 'W31', value: 1210 }, { label: 'W32', value: 1195 },
          { label: 'W33', value: 1230 }, { label: 'W34', value: 1248 },
        ],
      }
    } else {
      reply = {
        role: 'assistant', timestamp: now,
        text: 'I\'m analyzing your data. To get the best insights, try asking about specific metrics like OTIF, fill rate, carrier performance, shipment volumes, or inventory levels. You can also ask me to generate charts or dashboards.',
      }
    }

    setSessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, title: s.title === 'New Conversation' ? text.slice(0, 40) : s.title, messages: [...existing, userMsg, reply] }
        : s
    ))
  }

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    if (!activeSession) {
      newSession(msg)
    } else {
      sendMessage(msg, activeSession, currentSession?.messages ?? [])
    }
  }

  const saveDashboard = (type: 'otif' | 'kpi' | 'chart', title: string) => {
    const newD: SavedDashboard = {
      id: `d${Date.now()}`, title, type,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setDashboards(prev => [newD, ...prev])
  }

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(sidebarSearch.toLowerCase())
  )

  const today = filteredSessions.filter(s => s.createdAt === 'Today' || s.createdAt === 'Just now')
  const older = filteredSessions.filter(s => s.createdAt !== 'Today' && s.createdAt !== 'Just now')

  return (
    <div className="flex h-[calc(100vh-56px)] -mt-4 -mx-4 overflow-hidden">

      {/* ── Left Sidebar ── */}
      <div className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* New session button */}
        <div className="p-3 border-b border-gray-100">
          <button onClick={() => newSession()}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
            <Plus size={13} /> New Insight
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-7 pr-2 py-1.5 text-[11px] border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-primary-400 placeholder-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Built-in Dashboards — KPI / OTIF / Ticket Insights */}
          <div className="px-3 pt-3 pb-1">
            <p className="text-[9px] font-semibold text-gray-400 uppercase mb-1.5 flex items-center gap-1"><LayoutDashboard size={9} /> Dashboards</p>
            {[
              { id: 'kpi', label: 'KPI' },
              { id: 'otif', label: 'OTIF' },
              { id: 'ticket', label: 'Ticket Insights' },
            ].map(d => (
              <button key={d.id}
                onClick={() => { setActiveDashboard(d.id as 'kpi'|'otif'|'ticket'); setActiveSession(null) }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left group transition-colors ${activeDashboard === d.id ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                <BarChart2 size={11} className={activeDashboard === d.id ? 'text-primary-500 shrink-0' : 'text-emerald-500 shrink-0'} />
                <span className="text-[11px] truncate flex-1">{d.label}</span>
              </button>
            ))}
          </div>

          {/* Reports section — from Performance & Compliance */}
          <div className="px-3 pt-2 pb-1">
            <p className="text-[9px] font-semibold text-gray-400 uppercase mb-1.5 flex items-center gap-1"><BarChart2 size={9} /> Reports</p>
            {[
              { id: 'report-otif-summary', label: 'OTIF Summary' },
              { id: 'report-lead-time', label: 'Lead Time Analysis' },
              { id: 'report-penalties', label: 'Penalties' },
              { id: 'report-routing', label: 'Routing Report' },
              { id: 'report-root-cause', label: 'Root Cause Analysis' },
            ].map(r => (
              <button key={r.id}
                onClick={() => { setActiveDashboard(r.id as any); setActiveSession(null) }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left group transition-colors ${activeDashboard === r.id ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                <ChevronRight size={10} className="text-gray-400 shrink-0" />
                <span className="text-[11px] truncate flex-1">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Chat history */}
          <div className="px-3 pt-2">
            <p className="text-[9px] font-semibold text-gray-400 uppercase mb-1.5 flex items-center gap-1"><MessageSquare size={9} /> Chats</p>

            {today.length > 0 && (
              <>
                <p className="text-[9px] text-gray-400 mb-1 px-1">Today</p>
                {today.map(s => (
                  <button key={s.id} onClick={() => setActiveSession(s.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left group mb-0.5 ${activeSession === s.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <MessageSquare size={10} className="shrink-0 opacity-50" />
                    <span className="text-[11px] truncate flex-1">{s.title}</span>
                  </button>
                ))}
              </>
            )}
            {older.length > 0 && (
              <>
                <p className="text-[9px] text-gray-400 mb-1 px-1 mt-2">Yesterday</p>
                {older.map(s => (
                  <button key={s.id} onClick={() => setActiveSession(s.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left group mb-0.5 ${activeSession === s.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <MessageSquare size={10} className="shrink-0 opacity-50" />
                    <span className="text-[11px] truncate flex-1">{s.title}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Dashboard / Report view when a sidebar item is selected */}
        {activeDashboard && !activeSession ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-primary-500" />
                <h2 className="text-sm font-bold text-gray-900">
                  {activeDashboard === 'kpi' ? 'KPI Dashboard' :
                   activeDashboard === 'otif' ? 'OTIF Dashboard' :
                   activeDashboard === 'ticket' ? 'Ticket Insights' :
                   activeDashboard === 'report-otif-summary' ? 'OTIF Summary' :
                   activeDashboard === 'report-lead-time' ? 'Lead Time Analysis' :
                   activeDashboard === 'report-penalties' ? 'Penalties' :
                   activeDashboard === 'report-routing' ? 'Routing Report' :
                   activeDashboard === 'report-root-cause' ? 'Root Cause Analysis' : activeDashboard}
                </h2>
              </div>
              <button onClick={() => setActiveDashboard(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back to Insights</button>
            </div>
            {activeDashboard === 'kpi' && <KPIDashboard />}
            {activeDashboard === 'otif' && <OTIFDashboard />}
            {(activeDashboard === 'ticket' || activeDashboard.startsWith('report-')) && (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <BarChart2 size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-500">
                  {activeDashboard === 'ticket' ? 'Ticket Insights' :
                   activeDashboard === 'report-otif-summary' ? 'OTIF Summary Report' :
                   activeDashboard === 'report-lead-time' ? 'Lead Time Analysis' :
                   activeDashboard === 'report-penalties' ? 'Penalties Report' :
                   activeDashboard === 'report-routing' ? 'Routing Report' : 'Root Cause Analysis'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Report coming soon. Use the chat below to explore this data.</p>
                <button onClick={() => { setActiveDashboard(null); const q = activeDashboard === 'report-otif-summary' ? 'Show OTIF summary' : activeDashboard === 'report-lead-time' ? 'Show lead time analysis' : activeDashboard === 'report-penalties' ? 'Show penalty data' : activeDashboard === 'report-routing' ? 'Show routing report' : 'Root cause analysis'; newSession(q) }}
                  className="mt-4 px-4 py-2 text-xs text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                  Ask AI to generate this report
                </button>
              </div>
            )}
          </div>
        ) : !activeSession ? (
          /* ── Landing / Empty State ── */
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-2xl mx-auto w-full">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
              <Sparkles size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Insights Builder</h1>
            <p className="text-sm text-gray-500 mb-8 text-center">An AI-powered search to learn about your supply chain in new ways.</p>

            {/* Input */}
            <div className="w-full bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-primary-300 focus-within:border-primary-500 transition-all px-4 py-3 mb-6">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question about your supply chain data..."
                className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent mb-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-primary-600 border border-primary-200 rounded-full px-2 py-0.5 bg-primary-50">
                    <Bot size={9} /> Deep Insights
                  </span>
                </div>
                <button onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors">
                  <Send size={13} />
                </button>
              </div>
            </div>

            {/* Suggested questions tabs */}
            <div className="w-full">
              <div className="flex items-center gap-1 mb-3 border-b border-gray-200">
                {SUGGESTED.map((s, i) => (
                  <button key={i} onClick={() => setSuggestTab(i)}
                    className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${suggestTab === i ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {SUGGESTED[suggestTab].items.map((q, i) => (
                  <button key={i} onClick={() => handleSend(q)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-left group">
                    <Search size={13} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{q}</span>
                    <ChevronRight size={12} className="text-gray-300 ml-auto group-hover:text-primary-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Active Chat Session ── */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Session header */}
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-primary-500" />
                <p className="text-sm font-semibold text-gray-800">{currentSession?.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/dashboard/otif')}
                  className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
                  <BarChart2 size={11} /> View Dashboards
                </button>
                <button onClick={() => setActiveSession(null)}
                  className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {(currentSession?.messages ?? []).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-violet-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'flex-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm'
                    }`}>
                      <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                    </div>
                    {msg.role === 'assistant' && msg.widget === 'chart' && msg.chartData && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-semibold text-gray-700">Generated Chart</p>
                          <button onClick={() => saveDashboard('chart', currentSession?.title ?? 'Chart')}
                            className="text-[10px] text-emerald-600 hover:underline font-medium flex items-center gap-0.5">
                            + Save to Dashboards
                          </button>
                        </div>
                        <MiniBarChart data={msg.chartData} />
                      </div>
                    )}
                    {msg.role === 'assistant' && msg.widget === 'otif' && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                          <p className="text-[11px] font-semibold text-gray-700">OTIF Dashboard</p>
                          <button onClick={() => saveDashboard('otif', 'OTIF — ' + new Date().toLocaleDateString())}
                            className="text-[10px] text-emerald-600 hover:underline font-medium">
                            + Save to Dashboards
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto p-2 scale-95 origin-top">
                          <OTIFDashboard />
                        </div>
                      </div>
                    )}
                    {msg.role === 'assistant' && msg.widget === 'kpi' && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                          <p className="text-[11px] font-semibold text-gray-700">KPI Dashboard</p>
                          <button onClick={() => saveDashboard('kpi', 'KPI — ' + new Date().toLocaleDateString())}
                            className="text-[10px] text-emerald-600 hover:underline font-medium">
                            + Save to Dashboards
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto p-2 scale-95 origin-top">
                          <KPIDashboard />
                        </div>
                      </div>
                    )}
                    <p className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 bg-white border-t border-gray-200 px-5 py-4">
              <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-primary-400 focus-within:bg-white transition-all">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="Ask a follow-up question or request a new insight..."
                  rows={1}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent resize-none" />
                <button onClick={() => handleSend()} disabled={!input.trim()}
                  className="w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shrink-0">
                  <Send size={13} />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 mt-2 text-center">AI Insights can make mistakes. Verify important data before making decisions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
