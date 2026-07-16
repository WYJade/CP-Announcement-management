import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  MessageSquare, Zap, Settings, Store, Search, Clock,
  AlertTriangle, ChevronRight, Star, Bot, X, ChevronDown,
  Plus, Mic, Paperclip, Send, ArrowLeft, RefreshCw,
  MessageCircle, Sparkles, FileText,
} from 'lucide-react'

// ─── Nav items ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'workstation', label: 'Agent Workstation', icon: Zap },
  { id: 'customize', label: 'Customize', icon: Settings },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
]

const RECENTS = ['Bash批量测试']

// ─── Marketplace Agents Data ─────────────────────────────────────────────────

const MARKETPLACE_AGENTS = [
  { id: 'oms-customize', name: 'OMS+Customize', status: 'Installed', tag: '', model: 'gpt-5.5', description: 'No description' },
  { id: 'test', name: 'test', status: 'Available', tag: '', model: 'claude-opus-4-6', description: 'test' },
  { id: 'imp-jira', name: 'Imp Jira link', status: 'Available', tag: '', model: 'claude-opus-4-6', description: 'link imp jira tasks to project' },
  { id: 'connector-flow', name: 'Connector+flow', status: 'Installed', tag: 'DI', model: 'claude-opus-4-6', description: '从0启动搭建一个connector+flow' },
  { id: 'item-smallparcel', name: 'Item Smallparcel...', status: 'Available', tag: 'WMS', model: 'claude-sonnet-4-6', description: 'Item 环境 Small Parcel 面单打印配置管理...' },
  { id: 'unis-smallparcel', name: 'UNIS Smallparcel...', status: 'Available', tag: 'WMS', model: 'claude-opus-4-6', description: 'UNIS 环境 SmallParcel 面单打印配置管理...' },
  { id: 'di-flow-ai', name: 'DI Flow AI Assistant', status: 'Available', tag: 'DI', model: 'claude-opus-4-6', description: 'DI Flow Editor 工作区配置管理...' },
  { id: 'client-portal', name: 'ClientPortalAgent', status: 'Available', tag: 'CP', model: 'claude-opus-4-6', description: '高等约大处功能点…' },
  { id: 'di-connector', name: 'DI Connector-Operat...', status: 'Available', tag: 'DI', model: 'claude-opus-4-6', description: 'The DI platform automatically completes...' },
  { id: 'di-flow-agent', name: 'DI Flow Agent', status: 'Available', tag: 'DI', model: 'claude-opus-4-6', description: 'DI Flow Creation Assistant...' },
  { id: 'di-flow-builder', name: 'DI Flow Builder', status: 'Available', tag: 'DI', model: 'claude-opus-4-6', description: '专为 DI 平台设计的工作流构建...' },
  { id: 'di-flowpilot', name: 'DI FlowPilot Agent', status: 'Available', tag: 'DI', model: 'claude-opus-4-6', description: 'DI Flow Creation Assistant...' },
  { id: 'di-support', name: 'DI Support Agent', status: 'Available', tag: 'DI', model: 'claude-opus-4-8', description: 'DI System AI Support 助手...' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AgentWorkstation() {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const navFromUrl = urlParams.get('nav') || 'workstation'
  const [activeNav, setActiveNav] = useState(navFromUrl)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nav = params.get('nav') || 'workstation'
    setActiveNav(nav)
  }, [location.search])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-4 bg-white">

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        {activeNav === 'chat' && <ChatView />}
        {activeNav === 'workstation' && <WorkstationView />}
        {activeNav === 'customize' && <CustomizeView />}
        {activeNav === 'marketplace' && <MarketplaceView />}
      </div>
    </div>
  )
}

// ─── Chat View ───────────────────────────────────────────────────────────────

function ChatView() {
  const [input, setInput] = useState('')

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <Plus size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        <Clock size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        <span className="text-sm text-gray-700 font-medium">查询下SH20260716 对应的出入库记录</span>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">● Connector+flow</span>
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <MessageCircle size={28} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ask something. I will help you check it</h2>
        <p className="text-sm text-gray-500 text-center max-w-lg leading-relaxed mb-6">
          <strong>Order status · SLA · Inventory · Policy text · System workflows</strong> are all supported.
          AI automatically calls the right Tool for data, cites policies, and lists sources. For batch or structured workflows, go to <span className="underline font-medium">Agent Workstation</span>.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {['Where is ORD-8821 now?', 'Which SLA items are close today?', 'How did SLA perform in the last 7d?', 'VIP cancellation policy?', 'SKU-005 FBA inventory?'].map(q => (
            <button key={q} className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-300">{q}</button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-400">
          <span>⚡ Cross-Tool automation</span>
          <span>🔨 Built for ad-hoc Q&A</span>
          <span>📐 Structured → Agent Workstation</span>
        </div>
      </div>

      {/* Input */}
      <div className="px-8 pb-6">
        <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Paperclip size={16} className="text-gray-400 cursor-pointer" />
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask any OMS question — data / knowledge / policy... Type @ to reference orders/products/shipments"
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400" />
          <Mic size={16} className="text-gray-400 cursor-pointer" />
          <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800">
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">Enter to send · @ reference orders/prod./shipments · Need workflows? <strong>Go to Agent Workstation</strong></p>
      </div>
    </div>
  )
}

// ─── Workstation View ────────────────────────────────────────────────────────

function WorkstationView() {
  return (
    <div className="flex h-full">
      {/* My Agents sidebar */}
      <div className="w-56 border-r border-gray-200 overflow-y-auto">
        <div className="p-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">My Agents</h3>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search agents..." className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="p-3">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2 flex items-center gap-1">
            <AlertTriangle size={9} /> NEED INPUT
          </p>
          <div className="text-center py-6">
            <Clock size={20} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">Nothing needs your input</p>
            <p className="text-[10px] text-gray-300">Items the agents push for your decision will appear here</p>
          </div>
        </div>
        <div className="p-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2">⟳ WORKING</p>
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">No running tasks</p>
            <p className="text-[10px] text-gray-300">Conversations in progress will appear here once you start one</p>
          </div>
          <p className="text-xs text-gray-500 cursor-pointer hover:text-primary-600 flex items-center gap-1">View all 1 <ChevronRight size={10} /></p>
        </div>
        <div className="p-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2 flex items-center gap-1"><Star size={9} /> MY AGENTS <span className="ml-auto">2</span></p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50">
              <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center"><Bot size={12} className="text-white" /></div>
              <div><p className="text-[11px] font-medium text-gray-700">OMS+Customize</p><p className="text-[9px] text-gray-400">Unused</p></div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50">
              <div className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center"><Bot size={12} className="text-white" /></div>
              <div><p className="text-[11px] font-medium text-gray-700">Connector+flow</p><p className="text-[9px] text-gray-400">Yesterday 16:15</p></div>
              <span className="ml-auto w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">DI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main workstation content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Zap size={20} className="text-primary-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Agent Workstation</h1>
            <p className="text-xs text-gray-500">Operations workbench · 2 enabled agents · 0 active conversations</p>
          </div>
        </div>

        {/* Need Input */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">⊙ Need Input · awaiting your decision</h2>
          <div className="text-center py-10 border border-gray-100 rounded-xl">
            <Clock size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Nothing needs your input</p>
            <p className="text-xs text-gray-400">Items the agents push for your decision will appear here</p>
          </div>
        </div>

        {/* Working */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">⟳ Working · your long-running tasks</h2>
          <div className="text-center py-10 border border-gray-100 rounded-xl">
            <RefreshCw size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No running tasks</p>
            <p className="text-xs text-gray-400">Conversations in progress will appear here once you start one</p>
          </div>
        </div>

        {/* My Agents */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">My Agents · <Star size={14} className="text-amber-400" /></h2>
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"><Bot size={16} className="text-white" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">OMS+Customize</p>
                <p className="text-xs text-gray-400">No description</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>gpt-5.5</span>
              <Star size={14} className="text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Customize View ──────────────────────────────────────────────────────────

function CustomizeView() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customize</h1>
          <p className="text-sm text-gray-500">Save AI-generated pages as standalone tools with live data updates, sharing, and editing.</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span><strong className="text-gray-700">0</strong> Total</span>
          <span><strong className="text-gray-700">0</strong> Visited</span>
          <span><strong className="text-gray-700">0</strong> Shared</span>
          <span><strong className="text-gray-700">0</strong> Recycle Bin</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or description..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg" />
        </div>
        <span className="text-xs text-gray-500">By created time ↓</span>
      </div>

      {/* Empty state */}
      <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center max-w-sm">
        <Plus size={24} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-semibold text-gray-700 mb-1">Create in a conversation</p>
        <p className="text-xs text-gray-400">Chat with any Agent to generate the page you need, then save it to Customize.</p>
      </div>
    </div>
  )
}

// ─── Marketplace View ────────────────────────────────────────────────────────

function MarketplaceView() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'DI', 'WMS', 'CP']

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"><ArrowLeft size={16} className="text-gray-500" /></button>
          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center"><Store size={18} className="text-gray-600" /></div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Marketplace</h1>
            <p className="text-xs text-gray-500">Discover item platform agents and install them for use in chat.</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"><RefreshCw size={12} /> Refresh</button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-lg">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search agent name, description, or tag" className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${filter === f ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-3 gap-4">
        {MARKETPLACE_AGENTS.map(agent => (
          <div key={agent.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-gray-300 transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Bot size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-900 truncate">{agent.name}</p>
                  {agent.tag && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">{agent.tag}</span>}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{agent.status}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{agent.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">{agent.model}</span>
              {agent.status === 'Installed' ? (
                <button className="text-[10px] text-gray-500 hover:text-red-500">✕ Uninstall</button>
              ) : (
                <button className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg hover:bg-primary-100">↓ Install</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
