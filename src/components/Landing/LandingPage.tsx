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

// ─── Mock agent responses ───────────────────────────────────────────────────
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
      '- 上架待处理：**156 units**',
      '',
      '需要查看具体 SKU 或过期清单吗？',
    ]},
  ],
}

// ─── Agent bubble renderer ──────────────────────────────────────────────────
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
        <table className={`text-xs border-collapse w-full`}>
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

// ─── Portal modules ─────────────────────────────────────────────────────────
const PORTAL_MODULES = [
  { icon: Package,    label: 'Inbound',   color: 'text-blue-400' },
  { icon: BarChart2,  label: 'Inventory', color: 'text-emerald-400' },
  { icon: Truck,      label: 'Outbound',  color: 'text-amber-400' },
  { icon: Truck,      label: 'Shipping',  color: 'text-cyan-400' },
  { icon: DollarSign, label: 'Finance',   color: 'text-rose-400' },
]

// ─── Quick chips ─────────────────────────────────────────────────────────────
const CHIPS = [
  { icon: '📦', text: '查一下进行中的RN' },
  { icon: '🚚', text: '出库单状态汇总' },
  { icon: '📊', text: 'Ontario CA库存查询' },
]

const RECENTS = [
  '帮我查一下进行中的RN',
  '出库单状态汇总',
  'Ontario CA 库存查询',
  '未结发票列表',
]

// ─── Agent nav items ─────────────────────────────────────────────────────────
const AGENT_NAV = [
  { id: 'chat',        label: 'Chat',              icon: MessageSquare },
  { id: 'workstation', label: 'Agent Workstation',  icon: Zap },
  { id: 'customize',   label: 'Customize',          icon: Settings },
  { id: 'marketplace', label: 'Marketplace',        icon: Store },
]

// ─── Main component ──────────────────────────────────────────────────────────
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
      // Generic thinking response
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

  // ── theme tokens ──
  const bg      = dark ? 'bg-[#07071a]' : 'bg-gray-50'
  const surface = dark ? 'bg-white/5 border-white/8' : 'bg-white border-gray-200'
  const text1   = dark ? 'text-white/90' : 'text-gray-900'
  const text2   = dark ? 'text-white/50' : 'text-gray-500'
  const text3   = dark ? 'text-white/25' : 'text-gray-400'
  const divider = dark ? 'border-white/6' : 'border-gray-200'
  const hoverBg = dark ? 'hover:bg-white/8' : 'hover:bg-gray-100'
  const inputBg = dark ? 'bg-white/6 placeholder-white/25 text-white/90' : 'bg-white placeholder-gray-400 text-gray-800'
  const chipCls = dark
    ? 'bg-white/5 border-white/8 hover:bg-violet-500/15 hover:border-violet-500/30 text-white/50 hover:text-white/80'
    : 'bg-white border-gray-200 hover:bg-violet-50 hover:border-violet-300 text-gray-500 hover:text-violet-700'

  return (
    <div className={`min-h-screen ${bg} text-white flex flex-col overflow-hidden relative transition-colors duration-200`}>

      {/* ── Background (dark only) ── */}
      {dark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[15%] w-[600px] h-[500px] bg-violet-600/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 right-[5%] w-[350px] h-[350px] bg-blue-500/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>
      )}

      {/* ── Header ── */}
      <header className={`relative z-10 flex items-center justify-between px-5 py-3 border-b ${divider}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm shadow-violet-500/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={`text-sm font-bold ${text1}`}>Client Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(v => !v)}
            className={`p-2 rounded-lg transition-colors ${hoverBg} ${text2}`}
            title={dark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <span className={`text-xs ${text3}`}>Powered by Unis AI · v3.0</span>
        </div>
      </header>

      {/* ── 3-column layout ── */}
      <div className="relative z-10 flex flex-1 min-h-0 overflow-hidden">

        {/* ════ Col 1: Agent nav sidebar (narrow) ════ */}
        <div className={`w-44 shrink-0 flex flex-col border-r ${divider} py-4`}>
          {/* AI Agents header */}
          <div className="px-3 mb-3">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25">
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-violet-300 leading-tight">AI Agents</p>
                <p className="text-[9px] text-violet-400/70">Your AI agent</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-2 space-y-0.5 mb-4">
            {AGENT_NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  if (id === 'chat') { setActiveNav('chat') }
                  else { navigate(`/portal/agents?nav=${id}`) }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeNav === id && id === 'chat'
                    ? 'bg-violet-500/20 text-violet-300'
                    : `${text2} ${hoverBg}`
                }`}
              >
                <Icon size={13} className="shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* New chat button */}
          <div className="px-2 mb-3">
            <button
              onClick={() => setMessages([])}
              className={`w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${text3} ${hoverBg} transition-colors`}
            >
              <Plus size={12} /> New Chat
            </button>
          </div>

          {/* Recents */}
          <div className="px-3 flex-1 overflow-y-auto">
            <p className={`text-[9px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1 ${text3}`}>
              <Clock size={9} /> RECENTS
            </p>
            <div className="space-y-0.5">
              {RECENTS.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(r)}
                  className={`w-full text-left px-2 py-1.5 text-[11px] ${text2} ${hoverBg} rounded-lg transition-colors truncate`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════ Col 2: Chat area (main) ════ */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {!inConversation ? (
            /* ── Initial chat state ── */
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 overflow-y-auto">

              {/* Agent icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                <MessageSquare size={22} className="text-white" />
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className={`text-xs font-medium ${text2}`}>All-in-One Copilot</span>
              </div>

              <h2 className={`text-2xl font-bold mb-2 ${text1}`}>有什么我能帮到你？</h2>
              <p className={`text-sm ${text2} text-center max-w-sm leading-relaxed mb-6`}>
                订单状态 · 入库跟踪 · 库存查询 · 出库进度 全都能问。<br />
                无需切换模块，一个入口查询所有业务数据。
              </p>

              {/* Hint chips */}
              <div className="flex items-center gap-4 mb-6 flex-wrap justify-center">
                {['⚡ 跨模块自动取数', '🔍 结合真实业务', '📐 复杂任务 → Agent Workstation'].map(h => (
                  <span key={h} className={`text-[11px] font-medium ${text2}`}>{h}</span>
                ))}
              </div>

              {/* Input box */}
              <div className="w-full max-w-xl mb-4">
                <div className={`flex items-end gap-2 rounded-2xl px-4 py-3 transition-all ${
                  dark ? 'bg-white/6 focus-within:bg-white/9' : 'bg-white shadow-sm focus-within:shadow-md border border-gray-200 focus-within:border-violet-400'
                }`}>
                  <MessageSquare size={15} className="text-violet-400 shrink-0 mb-0.5" />
                  <textarea
                    ref={textareaRef}
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="问任何与入库、库存、出库相关的问题..."
                    rows={2}
                    className={`flex-1 bg-transparent text-sm resize-none focus:outline-none leading-relaxed ${inputBg}`}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputVal.trim() || isTyping}
                    className="shrink-0 w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 flex items-center justify-center transition-colors shadow-sm shadow-violet-500/25"
                  >
                    <Send size={13} className="text-white" />
                  </button>
                </div>
                <p className={`text-[10px] ${text3} mt-1.5 ml-1`}>Enter 发送 · Shift+Enter 换行</p>
              </div>

              {/* Quick chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                {CHIPS.map(chip => (
                  <button
                    key={chip.text}
                    onClick={() => handleSend(chip.text)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${chipCls}`}
                  >
                    <span>{chip.icon}</span>{chip.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Conversation view ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Conversation header */}
              <div className={`flex items-center gap-2 px-5 py-2.5 border-b ${divider} shrink-0`}>
                <Plus size={14} className={`${text3} cursor-pointer`} />
                <Clock size={14} className={`${text3} cursor-pointer`} />
                <span className={`text-xs ${text2} truncate`}>{messages[0]?.text}</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full shrink-0">● All-in-One Copilot</span>
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
                        {/* Working with tools header */}
                        <div className={`flex items-center gap-2 mb-2 text-xs ${text2}`}>
                          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={11} className="text-white" />
                          </div>
                          {!msg.done && msg.lines?.length === 0 ? (
                            <span className="flex items-center gap-1.5">
                              Working with tools
                              <span className="inline-flex gap-0.5">
                                {[0,1,2].map(j => (
                                  <span key={j} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce"
                                    style={{ animationDelay: `${j * 0.15}s` }} />
                                ))}
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              {msg.done
                                ? <><CheckCircle2 size={12} className="text-green-500" /> Completed</>
                                : <><span className="inline-flex gap-0.5">{[0,1,2].map(j => <span key={j} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />)}</span> Processing...</>
                              }
                            </span>
                          )}
                        </div>

                        {/* Thinking process pills (while streaming) */}
                        {!msg.done && (msg.lines?.length ?? 0) === 0 && (
                          <div className={`text-xs ${text2} px-3 py-2 rounded-xl ${surface} mb-2 border`}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                              Thinking... {msg.text}
                            </span>
                          </div>
                        )}

                        {/* Response content */}
                        {(msg.lines?.length ?? 0) > 0 && (
                          <div className={`px-4 py-3 rounded-2xl rounded-tl-sm text-xs ${dark ? 'bg-white/6 text-white/75' : 'bg-white border border-gray-100 text-gray-700 shadow-sm'}`}>
                            <AgentBubble lines={msg.lines!} done={!!msg.done} dark={dark} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input in conversation */}
              <div className={`px-5 py-3 border-t ${divider} shrink-0`}>
                <div className={`flex items-end gap-2 rounded-2xl px-4 py-2.5 ${
                  dark ? 'bg-white/6 focus-within:bg-white/9' : 'bg-white border border-gray-200 focus-within:border-violet-400 shadow-sm'
                }`}>
                  <textarea
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Send a message..."
                    rows={1}
                    disabled={isTyping}
                    className={`flex-1 bg-transparent text-sm resize-none focus:outline-none leading-relaxed disabled:opacity-50 ${inputBg}`}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputVal.trim() || isTyping}
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isTyping
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-violet-600 hover:bg-violet-500 disabled:opacity-30'
                    }`}
                  >
                    {isTyping
                      ? <XCircle size={13} className="text-white" />
                      : <Send size={13} className="text-white" />}
                  </button>
                </div>
                <p className={`text-[10px] ${text3} mt-1 ml-1`}>Enter 发送 · @ 引用单号</p>
              </div>
            </div>
          )}
        </div>

        {/* ════ Col 3: Portal System (unchanged) ════ */}
        <div className={`w-72 shrink-0 flex flex-col justify-center px-7 py-10 border-l ${divider}`}>
          <div className="mb-5">
            <p className={`text-[10px] ${text3} uppercase tracking-wider font-semibold mb-1`}>Or use</p>
            <h2 className={`text-lg font-bold ${text1}`}>Portal System</h2>
            <p className={`text-xs ${text2} mt-1 leading-relaxed`}>
              Classic dashboard with full module navigation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {PORTAL_MODULES.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => navigate('/portal')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${surface} ${hoverBg}`}
              >
                <Icon size={13} className={color} />
                <span className={`text-xs ${text2}`}>{label}</span>
              </button>
            ))}
            <button onClick={() => navigate('/portal')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${surface} ${hoverBg}`}>
              <span className={`text-xs font-bold ${text3}`}>+8</span>
              <span className={`text-xs ${text3}`}>More</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/portal')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${surface} ${hoverBg} ${text2}`}
          >
            <LayoutDashboard size={14} />
            <span className="text-sm font-medium">Enter Portal</span>
            <ChevronRight size={13} className={`ml-auto ${text3}`} />
          </button>

          <div className={`mt-8 pt-6 border-t ${divider}`}>
            <p className={`text-[10px] ${text3} text-center leading-relaxed`}>
              You can switch between<br />Super Agent and Portal anytime
            </p>
            <button
              onClick={() => navigate('/portal')}
              className={`w-full mt-3 flex items-center justify-center gap-1.5 text-[11px] ${text3} hover:text-violet-400 transition-colors`}
            >
              <ArrowRight size={11} /> Quick tour of Portal
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={`relative z-10 py-3 text-center text-[11px] ${text3} border-t ${divider}`}>
        © 2026 Unis · Client Portal 3.0
      </footer>
    </div>
  )
}
