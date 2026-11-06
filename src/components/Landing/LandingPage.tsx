import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, ArrowRight, MessageSquare,
  Zap, BarChart2, Package, Truck, DollarSign, ChevronRight,
} from 'lucide-react'

// ─── Animated typing effect texts ─────────────────────────────────────────────
const AGENT_CAPABILITIES = [
  'Query inbound receipts instantly',
  'Track shipments across all lanes',
  'Analyze inventory by facility',
  'Generate outbound order summaries',
  'Monitor OTIF performance in real-time',
]

// ─── Sample chat bubbles for preview ─────────────────────────────────────────
const PREVIEW_MESSAGES = [
  { role: 'user',  text: '帮我查一下进行中的RN有哪些？' },
  { role: 'agent', text: '正在查询进行中的 Receipt Notice... ✅ 共找到 4 条，最新一条：RN-20260910，状态：In Progress，预计到仓：09/15。' },
  { role: 'user',  text: '帮我对Ontario CA的出库单做汇总' },
  { role: 'agent', text: '📦 Ontario CA 出库汇总（近7天）：共 128 单，已发运 112 单，待处理 16 单，OTIF 达成率 94.2%。' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState<'agent' | 'portal' | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden relative">

      {/* ── Background gradient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Top bar ── */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white/90">Client Portal</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>Powered by Unis AI</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>v3.0</span>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">

          {/* Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-medium mb-8">
            <Sparkles size={12} className="text-violet-400" />
            Introducing Super Agent — AI-native supply chain operations
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 leading-tight max-w-2xl">
            How would you like to
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              work today?
            </span>
          </h1>
          <p className="text-white/50 text-center text-sm mb-14 max-w-md">
            Choose Super Agent for AI-powered conversations across all business modules,<br className="hidden sm:block" />
            or use the classic Portal System for traditional operations.
          </p>

          {/* ── Two choice cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl mb-14">

            {/* ═══ Super Agent Card (highlighted) ═══ */}
            <button
              onClick={() => navigate('/portal/agents?nav=chat')}
              onMouseEnter={() => setHovering('agent')}
              onMouseLeave={() => setHovering(null)}
              className={`relative group text-left rounded-2xl border p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
                hovering === 'agent'
                  ? 'border-violet-500/60 bg-violet-600/20 shadow-2xl shadow-violet-500/20 scale-[1.02]'
                  : 'border-violet-500/30 bg-violet-600/10'
              }`}
            >
              {/* Recommended badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/30 border border-violet-500/50 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                <Sparkles size={9} /> Recommended
              </div>

              {/* Glow behind icon */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <Sparkles size={22} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Super Agent</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  Natural language interface. Ask anything across inbound, inventory, outbound, shipping & finance — no module switching.
                </p>

                {/* Capability tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['AI Chat', 'Multi-module', 'Smart summaries', 'Real-time data'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/20 text-violet-300 border border-violet-500/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-violet-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  Start with Super Agent <ArrowRight size={14} />
                </div>
              </div>
            </button>

            {/* ═══ Portal System Card ═══ */}
            <button
              onClick={() => navigate('/portal')}
              onMouseEnter={() => setHovering('portal')}
              onMouseLeave={() => setHovering(null)}
              className={`relative group text-left rounded-2xl border p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
                hovering === 'portal'
                  ? 'border-white/20 bg-white/8 shadow-xl shadow-black/30 scale-[1.01]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <LayoutDashboard size={22} className="text-white/70" />
              </div>
              <h2 className="text-lg font-bold text-white/90 mb-2">Portal System</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                Classic dashboard experience with full module navigation — Inbound, Inventory, Outbound, Shipping, Finance and more.
              </p>

              {/* Module icons */}
              <div className="flex items-center gap-2 mb-5">
                {[
                  { icon: Package, label: 'Inbound' },
                  { icon: BarChart2, label: 'Inventory' },
                  { icon: Truck, label: 'Shipping' },
                  { icon: DollarSign, label: 'Finance' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center border border-white/10">
                      <Icon size={14} className="text-white/40" />
                    </div>
                    <span className="text-[9px] text-white/30">{label}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center border border-white/10">
                    <span className="text-white/30 text-[10px] font-bold">+8</span>
                  </div>
                  <span className="text-[9px] text-white/30">More</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-white/40 text-sm font-semibold group-hover:text-white/60 group-hover:gap-2.5 transition-all">
                Enter Portal System <ChevronRight size={14} />
              </div>
            </button>
          </div>

          {/* ── Agent preview chat bubbles ── */}
          <div className="w-full max-w-lg">
            <p className="text-center text-xs text-white/30 mb-4 flex items-center justify-center gap-1.5">
              <MessageSquare size={11} /> Preview — Super Agent in action
            </p>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
              {PREVIEW_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-600/50 text-white/90 rounded-br-sm'
                      : 'bg-white/8 text-white/70 rounded-bl-sm border border-white/8'
                  }`}>
                    {msg.role === 'agent' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={9} className="text-violet-400" />
                        <span className="text-[9px] font-semibold text-violet-400">Super Agent</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              <div className="flex items-center gap-1.5 pl-1">
                <div className="flex items-center gap-1 px-3 py-2 bg-white/8 rounded-xl border border-white/8">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-violet-400/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-[10px] text-white/25">Thinking...</span>
              </div>
            </div>
          </div>

          {/* ── Feature pills ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {[
              { icon: Zap, text: 'Instant answers' },
              { icon: BarChart2, text: 'Real-time analytics' },
              { icon: MessageSquare, text: 'Natural language' },
              { icon: Sparkles, text: 'AI-powered insights' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/35 text-xs">
                <Icon size={11} />
                {text}
              </div>
            ))}
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="py-5 text-center text-xs text-white/20 border-t border-white/5">
          © 2026 Unis · Client Portal 3.0
        </footer>
      </div>
    </div>
  )
}
