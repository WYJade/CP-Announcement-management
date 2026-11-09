import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, Send, Package, Truck,
  DollarSign, BarChart2, ChevronRight, Sun, Moon,
  MessageSquare, Zap, Settings, Store, Clock, Plus,
  ArrowRight, CheckCircle2, XCircle,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────
type ChatMsg = { role: 'user' | 'agent'; text: string; lines?: string[]; done?: boolean }

// ─── Mock responses ─────────────────────────────────────────────────────────
const SIM_RESPONSES: Record<string, ChatMsg[]> = {
  '查一下进行中的RN': [
    { role: 'user', text: '查一下进行中的RN' },
    { role: 'agent', text: '正在查询进行中的 Receipt Notice（RN）...', lines: [
      '✅ 共找到 **4 条**进行中的 RN：',
      '',
      '| RN # | 状态 | 到仓日期 | 供应商 |',
      '|---|---|---|---|',
      '| RN-20260910 | In Progress | 09/15 | VITA COCO |',
      '| RN-20260909 | Receiving | 09/14 | ADOORN LLC |',
      '| RN-20260908 | Scheduled | 09/16 | ORGAIN LLC |',
      '| RN-20260907 | In Progress | 09/13 | SAMUN INC |',
      '',
      '是否需要查看某条 RN 的详细信息？',
    ]},
  ],
  '出库单状态汇总': [
    { role: 'user', text: '出库单状态汇总' },
    { role: 'agent', text: '正在统计出库单数据...', lines: [
      '📊 **Ontario, CA — 出库单汇总**（截至今日）：',
      '',
      '| 状态 | 单数 | 件数 |',
      '|---|---|---|',
      '| Pending | 8 | 1,240 |',
      '| Picking | 5 | 820 |',
      '| Shipped | 12 | 2,100 |',
      '| On Hold | 2 | 300 |',
      '',
      '⚠️ 2 单处于 On Hold，建议优先处理。',
    ]},
  ],
  'Ontario CA库存查询': [
    { role: 'user', text: 'Ontario CA库存查询' },
    { role: 'agent', text: '正在查询 Ontario CA 库存快照...', lines: [
      '📦 **Ontario, CA — 库存快照**：',
      '',
      '- 总 SKU 数：**1,284**',
      '- 可用库存：**42,300 units**',
      '- 过期预警：**3 SKU** 需关注',
      '',
      '需要查看具体 SKU 或过期清单吗？',
    ]},
  ],
}

// ─── Agent bubble ────────────────────────────────────────────────────────────
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
    tableRows = []; inTable = false
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
          {[0,1,2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
    </div>
  )
}

// ─── Constants ───────────────────────────────────────────────────────────────
const PORTAL_MODULES = [
  { icon: Package,    label: 'Inbound',   color: 'text-blue-400' },
  { icon: BarChart2,  label: 'Inventory', color: 'text-emerald-400' },
  { icon: Truck,      label: 'Outbound',  color: 'text-amber-400' },
  { icon: Truck,      label: 'Shipping',  color: 'text-cyan-400' },
  { icon: DollarSign, label: 'Finance',   color: 'text-rose-400' },
]

const CHIPS = [
  { icon: '📦', text: '查一下进行中的RN' },
  { icon: '🚚', text: '出库单状态汇总' },
  { icon: '📊', text: 'Ontario CA库存查询' },
  { icon: '💰', text: '未结发票列表' },
  { icon: '📅', text: '待到仓预约列表' },
  { icon: '📈', text: 'OTIF达成率分析' },
]

const RECENTS = [
  '帮我查一下进行中的RN',
  '出库单状态汇总',
  'Ontario CA 库存查询',
  '未结发票列表',
]

const AGENT_NAV = [
  { id: 'chat',        label: 'Chat',             icon: MessageSquare },
  { id: 'workstation', label: 'Agent Workstation', icon: Zap },
  { id: 'customize',   label: 'Customize',         icon: Settings },
  { id: 'marketplace', label: 'Marketplace',       icon: Store },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)
  const [inputVal, setInputVal] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeNav, setActiveNav] = useState('chat')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const inConversation = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const simulateResponse = (q: string) => {
    const sim = SIM_RESPONSES[q]
    if (sim && sim.length >= 2) {
      const agentMsg = sim[1]
      setMessages(prev => [...prev, { role: 'agent', text: agentMsg.text, lines: [], done: false }])
      const allLines = agentMsg.lines ?? []
      let idx = 0
      const iv = setInterval(() => {
        idx++
        setMessages(prev => {
          const updated = [...prev]
          const last = { ...updated[updated.length - 1] }
          last.lines = allLines.slice(0, idx)
          last.done = idx >= allLines.length
          updated[updated.length - 1] = last
          return updated
        })
        if (idx >= allLines.length) { clearInterval(iv); setIsTyping(false) }
      }, 120)
    } else {
      setMessages(prev => [...prev, { role: 'agent', text: '正在分析您的问题...', lines: [], done: false }])
      setTimeout(() => {
        setMessages(prev => {
          const updated = [...prev]
          const last = { ...updated[updated.length - 1] }
          last.lines = ['✅ 已找到相关数据，请前往 Super Agent 查看完整结果。']
          last.done = true
          updated[updated.length - 1] = last
          return updated
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

  // ── Theme ──
  const bg      = dark ? 'bg-[#07071a]' : 'bg-gray-50'
  const text1   = dark ? 'text-white/90' : 'text-gray-900'
  const text2   = dark ? 'text-white/50' : 'text-gray-500'
  const text3   = dark ? 'text-white/25' : 'text-gray-400'
  const vline   = dark ? 'border-white/[0.04]' : 'border-gray-100'
  const hline   = dark ? 'border-white/[0.06]' : 'border-gray-100'
  const hoverBg = dark ? 'hover:bg-white/8' : 'hover:bg-gray-100'
  const inputBg = dark ? 'bg-transparent placeholder-white/25 text-white/90' : 'bg-transparent placeholder-gray-400 text-gray-800'
  const chipCls = dark
    ? 'bg-white/5 border-white/8 hover:bg-violet-500/15 hover:border-violet-500/30 text-white/50 hover:text-white/80'
    : 'bg-white border-gray-200 hover:bg-violet-50 hover:border-violet-300 text-gray-500 hover:text-violet-700'
  const portalSurface = dark ? 'bg-white/5 border-white/8' : 'bg-white border-gray-200'

  return (
    <div className={`min-h-screen ${bg} flex flex-col overflow-hidden relative transition-colors duration-200`}>

      {/* Background blobs (dark) */}
      {dark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[700px] h-[500px] bg-violet-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-[30%] right-0 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>
      )}

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm shadow-violet-500/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={`text-sm font-bold ${text1}`}>Client Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(v => !v)}
            className={`p-2 rounded-lg transition-colors ${hoverBg} ${text2}`}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
          </button>
          <span className={`text-xs ${text3}`}>Powered by Unis AI · v3.0</span>
        </div>
      </header>

      {/* ════════════ SUPER AGENT SECTION (top, full-width) ════════════ */}
      <div className="relative z-10 flex flex-1 min-h-0" style={{ minHeight: '82vh' }}>

        {/* Left: Agent nav */}
        <div className={`w-44 shrink-0 flex flex-col border-r ${vline} py-4`}>
          <div className="px-3 mb-3">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-violet-500/15 border border-violet-500/20">
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-white"/>
              </div>
              <div>
                <p className="text-xs font-bold text-violet-300 leading-tight">AI Agents</p>
                <p className="text-[9px] text-violet-400/70">Your AI agent</p>
              </div>
            </div>
          </div>

          <nav className="px-2 space-y-0.5 mb-4">
            {AGENT_NAV.map(({ id, label, icon: Icon }) => (
              <button key={id}
                onClick={() => id === 'chat' ? setActiveNav('chat') : navigate(`/portal/agents?nav=${id}`)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeNav === id ? 'bg-violet-500/20 text-violet-300' : `${text2} ${hoverBg}`
                }`}>
                <Icon size={13} className="shrink-0"/> {label}
              </button>
            ))}
          </nav>

          <div className="px-2 mb-3">
            <button onClick={() => setMessages([])}
              className={`w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${text3} ${hoverBg} transition-colors`}>
              <Plus size={12}/> New Chat
            </button>
          </div>

          <div className="px-3 flex-1 overflow-y-auto">
            <p className={`text-[9px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1 ${text3}`}>
              <Clock size={9}/> RECENTS
            </p>
            <div className="space-y-0.5">
              {RECENTS.map((r, i) => (
                <button key={i} onClick={() => handleSend(r)}
                  className={`w-full text-left px-2 py-1.5 text-[11px] ${text2} ${hoverBg} rounded-lg transition-colors truncate`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Chat / Super Agent content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {!inConversation ? (
            /* ── Initial: Super Agent hero ── */
            <div className="flex-1 flex flex-col justify-center px-14 py-10 overflow-y-auto">
              <div className="w-full max-w-2xl">

                {/* Badge */}
                <div className="flex items-center gap-2 mb-7">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                    dark ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-600'
                  }`}>
                    <Sparkles size={11}/>
                    Super Agent
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                      dark ? 'bg-violet-500/30' : 'bg-violet-200 text-violet-700'
                    }`}>Recommended</span>
                  </div>
                </div>

                {/* Headline */}
                <h1 className={`text-4xl font-bold leading-tight mb-3 ${text1}`}>
                  Ask anything about your
                  <br/>
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
                  <div className={`flex items-end gap-3 rounded-2xl px-5 py-4 transition-all ${
                    dark ? 'bg-white/7 focus-within:bg-white/10' : 'bg-white shadow-md border border-gray-200 focus-within:border-violet-400 focus-within:shadow-lg'
                  }`}>
                    <textarea
                      ref={textareaRef}
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                      placeholder="问任何关于入库、库存、出库的问题..."
                      rows={3}
                      className={`flex-1 text-base resize-none focus:outline-none leading-relaxed ${inputBg}`}
                    />
                    <button onClick={() => handleSend()} disabled={!inputVal.trim() || isTyping}
                      className="shrink-0 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 flex items-center justify-center transition-colors shadow-lg shadow-violet-500/30 mb-0.5">
                      <Send size={15} className="text-white"/>
                    </button>
                  </div>
                  <p className={`text-[10px] ${text3} mt-1.5 ml-1`}>Enter 发送 · Shift+Enter 换行</p>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {CHIPS.map(chip => (
                    <button key={chip.text} onClick={() => handleSend(chip.text)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${chipCls}`}>
                      <span>{chip.icon}</span>{chip.text}
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
                      <Icon size={12} className="text-violet-400/60"/> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── Conversation ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className={`flex items-center gap-2 px-5 py-2.5 border-b ${hline} shrink-0`}>
                <Plus size={14} className={`${text3} cursor-pointer`}/>
                <Clock size={14} className={`${text3} cursor-pointer`}/>
                <span className={`text-xs ${text2} truncate`}>{messages[0]?.text}</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full shrink-0">● All-in-One Copilot</span>
              </div>
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
                          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={11} className="text-white"/>
                          </div>
                          {!msg.done && (msg.lines?.length ?? 0) === 0 ? (
                            <span className="flex items-center gap-1.5">
                              Working with tools
                              <span className="inline-flex gap-0.5">
                                {[0,1,2].map(j => <span key={j} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }}/>)}
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              {msg.done
                                ? <><CheckCircle2 size={12} className="text-green-500"/> Completed</>
                                : <><span className="inline-flex gap-0.5">{[0,1,2].map(j => <span key={j} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }}/>)}</span> Processing...</>
                              }
                            </span>
                          )}
                        </div>
                        {!msg.done && (msg.lines?.length ?? 0) === 0 && (
                          <div className={`text-xs ${text2} px-3 py-2 rounded-xl mb-2 ${dark ? 'bg-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"/>
                              Thinking... {msg.text}
                            </span>
                          </div>
                        )}
                        {(msg.lines?.length ?? 0) > 0 && (
                          <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${dark ? 'bg-white/6' : 'bg-white border border-gray-100 shadow-sm'}`}>
                            <AgentBubble lines={msg.lines!} done={!!msg.done} dark={dark}/>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef}/>
              </div>
              <div className={`px-5 py-3 border-t ${hline} shrink-0`}>
                <div className={`flex items-end gap-2 rounded-2xl px-4 py-2.5 ${
                  dark ? 'bg-white/6 focus-within:bg-white/9' : 'bg-white border border-gray-200 focus-within:border-violet-400 shadow-sm'
                }`}>
                  <textarea value={inputVal} onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Send a message..." rows={1} disabled={isTyping}
                    className={`flex-1 text-sm resize-none focus:outline-none leading-relaxed disabled:opacity-50 ${inputBg}`}/>
                  <button onClick={() => handleSend()} disabled={!inputVal.trim() || isTyping}
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isTyping ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-600 hover:bg-violet-500 disabled:opacity-30'
                    }`}>
                    {isTyping ? <XCircle size={13} className="text-white"/> : <Send size={13} className="text-white"/>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════ PORTAL SYSTEM — bottom strip ════════════ */}
      <div className={`relative z-10 border-t ${hline} px-6 py-5`}>
        <div className="max-w-5xl mx-auto flex items-center gap-8">
          {/* Label */}
          <div className="shrink-0">
            <p className={`text-[10px] uppercase tracking-wider font-semibold mb-0.5 ${text3}`}>Or use</p>
            <h3 className={`text-base font-bold ${text1}`}>Portal System</h3>
            <p className={`text-xs ${text2} mt-0.5`}>Classic dashboard navigation</p>
          </div>

          {/* Module pills */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {PORTAL_MODULES.map(({ icon: Icon, label, color }) => (
              <button key={label} onClick={() => navigate('/portal')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${portalSurface} ${hoverBg} ${text2}`}>
                <Icon size={13} className={color}/> {label}
              </button>
            ))}
            <button onClick={() => navigate('/portal')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${portalSurface} ${hoverBg} ${text3}`}>
              +8 More
            </button>
          </div>

          {/* Enter button */}
          <button onClick={() => navigate('/portal')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all ${portalSurface} ${hoverBg} ${text2}`}>
            <LayoutDashboard size={15}/>
            Enter Portal
            <ChevronRight size={14} className={text3}/>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-2.5 text-center text-[11px] ${text3}`}>
        © 2026 Unis · Client Portal 3.0
        <button onClick={() => navigate('/portal')}
          className={`ml-4 inline-flex items-center gap-1 hover:text-violet-400 transition-colors`}>
          <ArrowRight size={10}/> Quick tour of Portal
        </button>
      </footer>
    </div>
  )
}
