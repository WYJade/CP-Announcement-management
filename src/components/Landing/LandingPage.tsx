import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, ArrowRight, Send,
  Package, Truck, DollarSign, BarChart2,
  ChevronRight, Zap, MessageSquare,
} from 'lucide-react'

// ─── Quick-prompt chips ───────────────────────────────────────────────────────
const CHIPS = [
  { icon: '📦', text: '查一下进行中的RN', category: 'Inbound' },
  { icon: '🚚', text: '出库单状态汇总', category: 'Outbound' },
  { icon: '📊', text: 'Ontario CA库存查询', category: 'Inventory' },
  { icon: '💰', text: '未结发票列表', category: 'Finance' },
  { icon: '📍', text: '待到仓预约列表', category: 'Inbound' },
  { icon: '📈', text: 'OTIF达成率分析', category: 'Analytics' },
]

// ─── Portal module list ───────────────────────────────────────────────────────
const PORTAL_MODULES = [
  { icon: Package,     label: 'Inbound',   color: 'text-blue-400' },
  { icon: BarChart2,   label: 'Inventory', color: 'text-emerald-400' },
  { icon: Truck,       label: 'Outbound',  color: 'text-amber-400' },
  { icon: Truck,       label: 'Shipping',  color: 'text-cyan-400' },
  { icon: DollarSign,  label: 'Finance',   color: 'text-rose-400' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [inputVal, setInputVal] = useState('')

  const handleSend = () => {
    const q = inputVal.trim()
    navigate(q ? `/portal/agents?nav=chat&q=${encodeURIComponent(q)}` : '/portal/agents?nav=chat')
  }

  const handleChip = (text: string) => {
    navigate(`/portal/agents?nav=chat&q=${encodeURIComponent(text)}`)
  }

  return (
    <div className="min-h-screen bg-[#07071a] text-white flex flex-col overflow-hidden relative">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[700px] h-[500px] bg-violet-600/18 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-white/90">Client Portal</span>
        </div>
        <span className="text-xs text-white/30">Powered by Unis AI · v3.0</span>
      </header>

      {/* ── Main layout: left 2/3 Super Agent + right 1/3 Portal ── */}
      <div className="relative z-10 flex flex-1 gap-0 min-h-0">

        {/* ════════════════ LEFT — Super Agent (主版面) ════════════════ */}
        <div className="flex-1 flex flex-col justify-center px-12 py-10 border-r border-white/6">

          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Sparkles size={11} className="text-violet-400" />
              Super Agent
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-500/30 text-[9px] font-bold tracking-wider uppercase">Recommended</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight mb-3">
            Ask anything about your
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              supply chain
            </span>
          </h1>
          <p className="text-white/45 text-sm mb-8 max-w-lg leading-relaxed">
            Natural language AI across Inbound, Inventory, Outbound, Shipping & Finance.
            No module switching — just ask.
          </p>

          {/* ── Chat input box ── */}
          <div className="relative mb-5 max-w-xl">
            <div className="flex items-end gap-2 bg-white/6 border border-white/12 rounded-2xl px-4 py-3 focus-within:border-violet-500/50 focus-within:bg-white/8 transition-all">
              <MessageSquare size={16} className="text-violet-400 shrink-0 mb-0.5" />
              <textarea
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="问任何关于入库、库存、出库的问题..."
                rows={2}
                className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 resize-none focus:outline-none leading-relaxed"
              />
              <button
                onClick={handleSend}
                className="shrink-0 w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors shadow-lg shadow-violet-500/30"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-white/20 mt-1.5 ml-1">Enter 发送 · Shift+Enter 换行</p>
          </div>

          {/* ── Quick prompts ── */}
          <div className="flex flex-wrap gap-2 max-w-xl mb-8">
            {CHIPS.map(chip => (
              <button
                key={chip.text}
                onClick={() => handleChip(chip.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 hover:bg-violet-500/15 hover:border-violet-500/30 text-white/50 hover:text-white/80 text-xs transition-all"
              >
                <span>{chip.icon}</span>
                {chip.text}
              </button>
            ))}
          </div>

          {/* Feature row */}
          <div className="flex items-center gap-5">
            {[
              { icon: Zap, text: 'Instant answers' },
              { icon: BarChart2, text: 'Real-time data' },
              { icon: Sparkles, text: 'AI-powered' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-white/30 text-xs">
                <Icon size={12} className="text-violet-400/60" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════ RIGHT — Portal System (紧凑入口) ════════════════ */}
        <div className="w-72 flex flex-col justify-center px-7 py-10">

          <div className="mb-5">
            <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold mb-1">Or use</p>
            <h2 className="text-lg font-bold text-white/80">Portal System</h2>
            <p className="text-xs text-white/35 mt-1 leading-relaxed">
              Classic dashboard with full module navigation.
            </p>
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PORTAL_MODULES.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => navigate('/portal')}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all"
              >
                <Icon size={13} className={color} />
                <span className="text-xs text-white/50">{label}</span>
              </button>
            ))}
            <button
              onClick={() => navigate('/portal')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all"
            >
              <span className="text-xs text-white/30 font-bold">+8</span>
              <span className="text-xs text-white/30">More</span>
            </button>
          </div>

          {/* Enter button */}
          <button
            onClick={() => navigate('/portal')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/8 border border-white/12 hover:bg-white/12 hover:border-white/20 text-white/60 hover:text-white/80 text-sm font-medium transition-all"
          >
            <LayoutDashboard size={14} />
            Enter Portal
            <ChevronRight size={13} className="ml-auto text-white/30" />
          </button>

          {/* Divider + back hint */}
          <div className="mt-8 pt-6 border-t border-white/6">
            <p className="text-[10px] text-white/20 text-center leading-relaxed">
              You can switch between<br />Super Agent and Portal anytime
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-3 text-center text-[11px] text-white/15 border-t border-white/5">
        © 2026 Unis · Client Portal 3.0
      </footer>
    </div>
  )
}
