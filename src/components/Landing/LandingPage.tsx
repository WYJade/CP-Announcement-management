import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, Send, Package, Truck,
  DollarSign, BarChart2, ChevronRight, Sun, Moon,
  Zap, CheckCircle2, XCircle, Clock,
  TrendingUp, AlertTriangle, FileText,
} from 'lucide-react'

type ChatMsg = { role: 'user' | 'agent'; text: string; lines?: string[]; done?: boolean }

const SIM: Record<string, { text: string; lines: string[] }> = {
  "What exceptions need attention today?": {
    text: 'Checking today\'s exceptions...',
    lines: [
      '⚠️ **3 items** require attention today:',
      '',
      '- 🔴 **RN-20260910** overdue by 2h, carrier has not updated status',
      '- 🟡 **DN-8821001** picking stalled for 40 min, please confirm',
      '- 🔵 **SKU-A100** inventory at Ontario CA below safety level (85 units)',
      '',
      'Recommend addressing the red item first. Would you like details?',
    ],
  },
  "Weekly OTIF performance": {
    text: 'Fetching weekly OTIF data...',
    lines: [
      '📈 **Weekly OTIF: 94.2%**',
      '',
      '- On-Time: **96.1%** (target 95%) ✅',
      '- In-Full: **97.8%** (target 98%) ⚠️ slightly below',
      '',
      'Main drag: 3 delayed inbound shipments at Ontario CA.',
    ],
  },
  "Show active inbound receipts": {
    text: 'Querying active Receipt Notices...',
    lines: [
      '✅ **4 active** RNs found:',
      '',
      '| RN # | Status | ETA | Vendor |',
      '|---|---|---|---|',
      '| RN-20260910 | In Progress | 09/15 | VITA COCO |',
      '| RN-20260909 | Receiving | 09/14 | ADOORN LLC |',
      '| RN-20260908 | Scheduled | 09/16 | ORGAIN LLC |',
      '| RN-20260907 | In Progress | 09/13 | SAMUN INC |',
    ],
  },
  "Outbound order status summary": {
    text: 'Summarizing outbound orders...',
    lines: [
      '📊 **Ontario, CA — Outbound Summary:**',
      '',
      '| Status | Orders |',
      '|---|---|',
      '| Pending | 8 |',
      '| Picking | 5 |',
      '| Shipped | 12 |',
      '| On Hold | 2 |',
      '',
      '⚠️ 2 orders On Hold — recommend follow-up.',
    ],
  },
  "Ontario CA inventory snapshot": {
    text: 'Loading inventory snapshot for Ontario CA...',
    lines: [
      '📦 **Ontario, CA — Inventory Snapshot:**',
      '',
      '- Total SKUs: **1,284**',
      '- Available: **42,300 units**',
      '- Expiry alerts: **3 SKUs**',
      '- Low-stock alerts: **7 SKUs**',
    ],
  },
  "List open invoices": {
    text: 'Fetching open invoices...',
    lines: [
      '💰 **Open Invoices:**',
      '',
      '- Total open: **12 invoices**',
      '- Overdue: **3** (oldest: 45 days)',
      '- Amount due: **$47,320**',
      '',
      'Would you like to view the overdue list or export?',
    ],
  },
}

function AgentLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  )
}

function AgentBubble({ lines, done, dark }: { lines: string[]; done: boolean; dark: boolean }) {
  const isTableRow = (s: string) => s.startsWith('|')
  const isSep = (s: string) => /^\|[-| :]+\|$/.test(s.trim())
  let inTable = false
  const rendered: React.ReactNode[] = []
  let tableRows: string[][] = []

  const flushTable = () => {
    if (!tableRows.length) return
    const [header, , ...body] = tableRows
    rendered.push(
      <div key={`t${rendered.length}`} className="overflow-x-auto my-1.5">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr className={dark ? 'bg-white/10' : 'bg-gray-100'}>
              {header.filter(Boolean).map((h, i) => (
                <th key={i} className={`px-3 py-1.5 text-left font-semibold border whitespace-nowrap ${dark ? 'border-white/10 text-white/70' : 'border-gray-200 text-gray-600'}`}>
                  <AgentLine text={h.trim()} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className={dark ? 'even:bg-white/5' : 'even:bg-gray-50'}>
                {row.filter(Boolean).map((cell, ci) => (
                  <td key={ci} className={`px-3 py-1.5 border whitespace-nowrap ${dark ? 'border-white/10 text-white/70' : 'border-gray-200 text-gray-700'}`}>
                    <AgentLine text={cell.trim()} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isSep(line)) continue
    if (isTableRow(line)) { inTable = true; tableRows.push(line.split('|').slice(1, -1)); continue }
    if (inTable) flushTable()
    if (line === '') { rendered.push(<div key={i} className="h-1.5" />); continue }
    if (line.startsWith('- ')) {
      rendered.push(
        <div key={i} className={`flex items-start gap-1.5 text-xs ${dark ? 'text-white/70' : 'text-gray-700'}`}>
          <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
          <AgentLine text={line.slice(2)} />
        </div>
      )
    } else {
      rendered.push(
        <p key={i} className={`text-xs leading-relaxed ${dark ? 'text-white/70' : 'text-gray-700'}`}>
          <AgentLine text={line} />
        </p>
      )
    }
  }
  if (inTable) flushTable()

  return (
    <div className="space-y-0.5">
      {rendered}
      {!done && (
        <span className="inline-flex gap-0.5 mt-1">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
    </div>
  )
}

const PORTAL_MODULES = [
  { icon: Package,    label: 'Inbound',   color: 'text-blue-400' },
  { icon: BarChart2,  label: 'Inventory', color: 'text-emerald-400' },
  { icon: Truck,      label: 'Outbound',  color: 'text-amber-400' },
  { icon: Truck,      label: 'Shipping',  color: 'text-cyan-400' },
  { icon: DollarSign, label: 'Finance',   color: 'text-rose-400' },
]

const QUICK_ACTIONS = [
  { icon: AlertTriangle, label: "Today's Exceptions",  query: "What exceptions need attention today?", color: 'text-red-400' },
  { icon: TrendingUp,    label: 'Weekly OTIF',          query: 'Weekly OTIF performance',              color: 'text-emerald-400' },
  { icon: Package,       label: 'Active Inbound',       query: 'Show active inbound receipts',         color: 'text-blue-400' },
  { icon: Truck,         label: 'Outbound Summary',     query: 'Outbound order status summary',        color: 'text-amber-400' },
  { icon: BarChart2,     label: 'Inventory Snapshot',   query: 'Ontario CA inventory snapshot',        color: 'text-violet-400' },
  { icon: FileText,      label: 'Open Invoices',        query: 'List open invoices',                   color: 'text-orange-400' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)
  const [inputVal, setInputVal] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inConversation = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const simulateResponse = (q: string) => {
    const sim = SIM[q]
    if (sim) {
      setMessages(prev => [...prev, { role: 'agent', text: sim.text, lines: [], done: false }])
      let idx = 0
      const iv = setInterval(() => {
        idx++
        setMessages(prev => {
          const u = [...prev]
          const l = { ...u[u.length - 1] }
          l.lines = sim.lines.slice(0, idx)
          l.done = idx >= sim.lines.length
          u[u.length - 1] = l
          return u
        })
        if (idx >= sim.lines.length) { clearInterval(iv); setIsTyping(false) }
      }, 120)
    } else {
      setMessages(prev => [...prev, { role: 'agent', text: 'Processing...', lines: [], done: false }])
      setTimeout(() => {
        setMessages(prev => {
          const u = [...prev]
          const l = { ...u[u.length - 1] }
          l.lines = ['Result retrieved. Please use the full Super Agent for detailed data.']
          l.done = true
          u[u.length - 1] = l
          return u
        })
        setIsTyping(false)
      }, 1200)
    }
  }

  const handleSend = (text?: string) => {
    const q = (text ?? inputVal).trim()
    if (!q || isTyping) return
    setInputVal('')
    setIsTyping(true)
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setTimeout(() => simulateResponse(q), 500)
  }

  // Theme tokens
  const bg            = dark ? 'bg-[#07071a]' : 'bg-gray-50'
  const text1         = dark ? 'text-white/90' : 'text-gray-900'
  const text2         = dark ? 'text-white/50' : 'text-gray-500'
  const text3         = dark ? 'text-white/25' : 'text-gray-400'
  const vline         = dark ? 'border-white/[0.04]' : 'border-gray-100'
  const hline         = dark ? 'border-white/[0.06]' : 'border-gray-100'
  const hoverBg       = dark ? 'hover:bg-white/8' : 'hover:bg-gray-100'
  const inputBg       = dark ? 'placeholder-white/25 text-white/90' : 'placeholder-gray-400 text-gray-800'
  const chipCls       = dark
    ? 'bg-white/5 border-white/8 hover:bg-violet-500/15 hover:border-violet-500/30 text-white/50 hover:text-white/80'
    : 'bg-white border-gray-200 hover:bg-violet-50 hover:border-violet-300 text-gray-500 hover:text-violet-700'
  const portalSurface = dark ? 'bg-white/5 border-white/8' : 'bg-white border-gray-200 shadow-sm'
  const badgeCls      = dark ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-600'

  return (
    <div className={`min-h-screen ${bg} flex flex-col overflow-hidden relative transition-colors duration-200`}>

      {/* Background */}
      {dark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[700px] h-[500px] bg-violet-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm shadow-violet-500/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className={`text-sm font-bold ${text1}`}>Client Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(v => !v)} className={`p-2 rounded-lg ${hoverBg} ${text2} transition-colors`}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <span className={`text-xs ${text3}`}>Powered by Unis AI · v3.0</span>
        </div>
      </header>

      {/* Main two-column */}
      <div className="relative z-10 flex flex-1 min-h-0" style={{ minHeight: '88vh' }}>

        {/* LEFT: Super Agent */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {!inConversation ? (
            <div className="flex-1 flex flex-col justify-center px-8 py-10 overflow-y-auto">
              <div className="w-full max-w-3xl mx-auto">

                {/* Badge */}
                <div className="flex items-center gap-2 mb-7">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badgeCls}`}>
                    <Sparkles size={11} />
                    Super Agent
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-violet-600 text-white">
                      Recommended
                    </span>
                  </div>
                </div>

                {/* Headline */}
                <h1 className={`text-4xl font-bold leading-tight mb-3 ${text1}`}>
                  Ask anything about your
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    supply chain
                  </span>
                </h1>
                <p className={`text-sm ${text2} mb-8 leading-relaxed`}>
                  Natural language AI across Inbound, Inventory, Outbound, Shipping &amp; Finance.
                  No module switching — just ask.
                </p>

                {/* Input */}
                <div className="mb-5">
                  <div className={`flex items-end gap-3 rounded-2xl px-5 py-4 transition-all ${dark ? 'bg-white/7 focus-within:bg-white/10' : 'bg-gray-100/80 focus-within:bg-gray-100'}`}>
                    <textarea
                      ref={textareaRef}
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                      placeholder="Ask anything about inbound, inventory, or outbound..."
                      rows={3}
                      className={`flex-1 bg-transparent text-base resize-none focus:outline-none leading-relaxed ${inputBg}`}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputVal.trim() || isTyping}
                      className="shrink-0 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 flex items-center justify-center transition-colors shadow-lg shadow-violet-500/30 mb-0.5"
                    >
                      <Send size={15} className="text-white" />
                    </button>
                  </div>
                  <p className={`text-[10px] ${text3} mt-1.5 ml-1`}>Enter to send · Shift+Enter for newline</p>
                </div>

                {/* Quick action grid */}
                <div className="grid grid-cols-3 gap-2 mb-7">
                  {QUICK_ACTIONS.map(({ icon: Icon, label, query, color }) => (
                    <button
                      key={label}
                      onClick={() => handleSend(query)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${chipCls}`}
                    >
                      <Icon size={13} className={`${color} shrink-0`} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Feature pills */}
                <div className="flex items-center gap-6">
                  {[
                    { icon: Zap, text: 'Instant answers' },
                    { icon: BarChart2, text: 'Real-time data' },
                    { icon: Sparkles, text: 'AI-powered' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className={`flex items-center gap-1.5 text-xs ${text3}`}>
                      <Icon size={12} className="text-violet-400/60" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Conversation header */}
              <div className={`flex items-center gap-2 px-5 py-2.5 border-b ${hline} shrink-0`}>
                <Clock size={13} className={`${text3} cursor-pointer`} />
                <span className={`text-xs ${text2} truncate flex-1`}>{messages[0]?.text}</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full shrink-0">● Super Agent</span>
                <button
                  onClick={() => setMessages([])}
                  className={`text-[10px] ${text3} ${hoverBg} px-2 py-1 rounded-lg transition-colors`}
                >
                  New chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 max-w-2xl mx-auto w-full">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'user' ? (
                      <div className="max-w-[80%] bg-violet-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="max-w-[90%] w-full">
                        <div className={`flex items-center gap-2 mb-2 text-xs ${text2}`}>
                          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center shrink-0">
                            <Sparkles size={11} className="text-white" />
                          </div>
                          {!msg.done && (msg.lines?.length ?? 0) === 0 ? (
                            <span className="flex items-center gap-1.5">
                              Working with tools
                              <span className="inline-flex gap-0.5">
                                {[0, 1, 2].map(j => (
                                  <span key={j} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                                ))}
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              {msg.done ? (
                                <>
                                  <CheckCircle2 size={12} className="text-green-500" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <span className="inline-flex gap-0.5">
                                    {[0, 1, 2].map(j => (
                                      <span key={j} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                                    ))}
                                  </span>
                                  Processing...
                                </>
                              )}
                            </span>
                          )}
                        </div>

                        {!msg.done && (msg.lines?.length ?? 0) === 0 && (
                          <div className={`text-xs ${text2} px-3 py-2 rounded-xl mb-2 ${dark ? 'bg-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                              Thinking... {msg.text}
                            </span>
                          </div>
                        )}

                        {(msg.lines?.length ?? 0) > 0 && (
                          <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${dark ? 'bg-white/6' : 'bg-white border border-gray-100 shadow-sm'}`}>
                            <AgentBubble lines={msg.lines!} done={!!msg.done} dark={dark} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Conversation input */}
              <div className={`px-5 py-3 border-t ${hline} shrink-0`}>
                <div className={`flex items-end gap-2 rounded-2xl px-4 py-2.5 ${dark ? 'bg-white/6 focus-within:bg-white/9' : 'bg-gray-100/80 focus-within:bg-gray-100'}`}>
                  <textarea
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Continue the conversation..."
                    rows={1}
                    disabled={isTyping}
                    className={`flex-1 bg-transparent text-sm resize-none focus:outline-none leading-relaxed disabled:opacity-50 ${inputBg}`}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputVal.trim() || isTyping}
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isTyping ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-600 hover:bg-violet-500 disabled:opacity-30'}`}
                  >
                    {isTyping ? <XCircle size={13} className="text-white" /> : <Send size={13} className="text-white" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Portal System */}
        <div className={`w-72 shrink-0 flex flex-col border-l ${vline} px-6 py-10`}>
          <div className="mb-7">
            <p className={`text-[10px] uppercase tracking-wider font-semibold mb-3 ${text3}`}>Or use</p>
            <h3 className={`text-xl font-bold mb-2 ${text1}`}>Portal System</h3>
            <p className={`text-xs ${text2} leading-relaxed`}>
              Classic dashboard with full module navigation.
            </p>
          </div>

          {/* Module grid 2-col */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PORTAL_MODULES.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => navigate('/portal')}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-medium transition-all ${portalSurface} ${hoverBg}`}
              >
                <Icon size={14} className={color} />
                <span className={text2}>{label}</span>
              </button>
            ))}
            <button
              onClick={() => navigate('/portal')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-medium transition-all ${portalSurface} ${hoverBg}`}
            >
              <span className={`font-bold ${text3}`}>+8</span>
              <span className={text3}>More</span>
            </button>
          </div>

          {/* Enter Portal button */}
          <button
            onClick={() => navigate('/portal')}
            className={`w-full flex items-center gap-2 py-3 px-4 rounded-xl border transition-all text-sm font-medium mb-6 ${portalSurface} ${hoverBg} ${text2}`}
          >
            <LayoutDashboard size={15} />
            Enter Portal
            <ChevronRight size={14} className={`ml-auto ${text3}`} />
          </button>

          {/* Footer hint */}
          <div className={`border-t ${vline} pt-5`}>
            <p className={`text-[10px] ${text3} text-center leading-relaxed`}>
              You can switch between<br />Super Agent and Portal anytime
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-2.5 text-center text-[11px] ${text3}`}>
        © 2026 Unis · Client Portal 3.0
      </footer>
    </div>
  )
}
