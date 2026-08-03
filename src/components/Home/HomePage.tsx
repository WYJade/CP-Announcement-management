import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Package, Truck, BarChart2, FileText, Bot, ChevronRight,
  CheckCircle2, Clock, TrendingDown, Warehouse, Ship, DollarSign,
  ArrowRight, Zap, MessageSquare, RefreshCw, Flag, Inbox,
  AlertCircle, Activity, MapPin
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SUMMARY_STATS = [
  { label: 'In-Transit Shipments', value: '1,248', sub: '+12 today', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: "Today's Appointments", value: '86', sub: '14 pending confirm', color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'High-Risk Exceptions', value: '27', sub: '5 new since yesterday', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'OTIF Risk', value: '14', sub: 'P1: 3 / P2: 11', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Demurrage / Detention', value: '9', sub: 'Containers at risk', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Pending Tasks', value: '43', sub: '18 overdue', color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

const MY_TASKS = [
  { id: 1, title: 'Confirm receiving appointment for SSHAS2608270', type: 'Appointment', priority: 'P1', due: 'Today 14:00', status: 'Overdue', path: '/international-new/tracking' },
  { id: 2, title: 'Resolve customs hold on SSHAS2608135', type: 'Customs', priority: 'P1', due: 'Today 17:00', status: 'Urgent', path: '/international-new/tracking' },
  { id: 3, title: 'Review invoice dispute INV-20260601', type: 'Finance', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/finance/invoices' },
  { id: 4, title: 'Update freight quote for ADOORN LLC', type: 'Outbound', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/outbound/freight-quote' },
  { id: 5, title: 'Cycle count discrepancy in Inventory', type: 'Inventory', priority: 'P3', due: 'Aug 6', status: 'In Progress', path: '/inventory/activity' },
]

const EXCEPTIONS = [
  { priority: 'P1', label: 'Container DEM Risk', desc: '3 containers past LFD at Garden City Terminal', action: 'Review & assign', color: 'bg-red-500', path: '/international-new/tracking' },
  { priority: 'P1', label: 'Appointment at risk', desc: 'Jun 19 appointment for SSHAS2608270 not confirmed', action: 'Reschedule', color: 'bg-red-500', path: '/international-new/tracking' },
  { priority: 'P2', label: 'Inventory shortage', desc: 'SKU ADPOST-SMALL-RED below safety stock', action: 'Check allocation', color: 'bg-orange-400', path: '/inventory/activity' },
  { priority: 'P2', label: 'OTIF penalty risk', desc: '5 orders approaching 97% OTIF threshold', action: 'Open RCA', color: 'bg-orange-400', path: '/dashboard/otif' },
  { priority: 'P3', label: 'Invoice dispute', desc: 'INV-20260601 disputed by THE ONLY BEAN LLC', action: 'Review documents', color: 'bg-blue-400', path: '/finance/invoices' },
]

const MODULES = [
  { title: 'My Tasks', sub: 'Owner / SLA / Status', icon: <CheckCircle2 size={18} className="text-violet-500" />, path: null, color: 'border-violet-100 hover:border-violet-300' },
  { title: 'Inbound & Yard', sub: 'Appointments, Gate, Receipt variance', icon: <Package size={18} className="text-blue-500" />, path: '/inbound/inquiry', color: 'border-blue-100 hover:border-blue-300' },
  { title: 'Outbound', sub: 'Orders, Carrier, Tracking', icon: <Truck size={18} className="text-indigo-500" />, path: '/outbound/inquiry', color: 'border-indigo-100 hover:border-indigo-300' },
  { title: 'Shipment Tracking', sub: 'International containers & milestones', icon: <Ship size={18} className="text-teal-500" />, path: '/international-new/tracking', color: 'border-teal-100 hover:border-teal-300' },
  { title: 'Inventory', sub: 'Exceptions, SN, Adjustments', icon: <Warehouse size={18} className="text-emerald-500" />, path: '/inventory/activity', color: 'border-emerald-100 hover:border-emerald-300' },
  { title: 'Finance', sub: 'Invoice, Claim, Deduction', icon: <DollarSign size={18} className="text-amber-500" />, path: '/finance/invoices', color: 'border-amber-100 hover:border-amber-300' },
]

// ─── Network Map Component ────────────────────────────────────────────────────
function NetworkMap() {
  const locations = [
    { id: 'shanghai', name: 'Shanghai', type: 'origin', x: 72, y: 38, count: 8, status: 'active' },
    { id: 'ningbo', name: 'Ningbo', type: 'origin', x: 74, y: 44, count: 5, status: 'active' },
    { id: 'haiphong', name: 'Haiphong', type: 'origin', x: 68, y: 52, count: 3, status: 'active' },
    { id: 'savannah', name: 'Savannah', type: 'pod', x: 22, y: 40, count: 6, status: 'alert' },
    { id: 'longbeach', name: 'Long Beach', type: 'pod', x: 8, y: 42, count: 9, status: 'active' },
    { id: 'newyork', name: 'New York', type: 'pod', x: 24, y: 32, count: 4, status: 'active' },
    { id: 'unis-seabrook', name: 'UNIS Seabrook', type: 'warehouse', x: 25, y: 42, count: 4, status: 'receiving' },
    { id: 'garden-city', name: 'Garden City', type: 'terminal', x: 21, y: 39, count: 3, status: 'alert' },
    { id: 'lbct', name: 'LBCT Terminal', type: 'terminal', x: 7, y: 41, count: 5, status: 'active' },
  ]

  const routes = [
    { from: { x: 72, y: 38 }, to: { x: 22, y: 40 }, status: 'active', label: '8 vessels' },
    { from: { x: 74, y: 44 }, to: { x: 8, y: 42 }, status: 'active', label: '5 vessels' },
    { from: { x: 68, y: 52 }, to: { x: 24, y: 32 }, status: 'alert', label: '3 vessels' },
  ]

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900" style={{ height: '280px' }}>
      <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Ocean background */}
        <rect x="0" y="0" width="100" height="70" fill="#0f172a" />
        {/* Pacific Ocean */}
        <ellipse cx="48" cy="45" rx="25" ry="18" fill="#1e3a5f" opacity="0.4" />
        {/* Asia landmass */}
        <path d="M 60 20 Q 75 15 85 22 Q 90 30 88 45 Q 82 60 75 65 L 65 65 Q 58 58 60 45 Q 58 35 60 20 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.3" />
        {/* North America landmass */}
        <path d="M 0 15 Q 15 10 28 18 Q 35 25 33 40 Q 30 55 20 62 Q 10 65 2 60 Q 0 50 0 35 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.3" />

        {/* Route lines */}
        {routes.map((r, i) => (
          <g key={i}>
            <path
              d={`M ${r.from.x} ${r.from.y} Q 48 ${r.from.y - 8} ${r.to.x} ${r.to.y}`}
              fill="none"
              stroke={r.status === 'alert' ? '#f97316' : '#6366f1'}
              strokeWidth="0.5"
              strokeDasharray="2 1"
              opacity="0.7"
            />
          </g>
        ))}

        {/* Animated ship on route */}
        <circle cx="48" cy="35" r="1" fill="#818cf8" opacity="0.9">
          <animateMotion dur="6s" repeatCount="indefinite" path="M 72 38 Q 48 30 22 40" />
        </circle>
        <circle cx="48" cy="38" r="1" fill="#818cf8" opacity="0.7">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 74 44 Q 48 36 8 42" />
        </circle>

        {/* Location markers */}
        {locations.map(loc => {
          const color = loc.status === 'alert' ? '#f97316' : loc.type === 'warehouse' ? '#22c55e' : loc.type === 'origin' ? '#6366f1' : '#14b8a6'
          const size = loc.type === 'warehouse' || loc.type === 'pod' ? 1.8 : 1.3
          return (
            <g key={loc.id}>
              <circle cx={loc.x} cy={loc.y} r={size + 0.8} fill={color} opacity="0.2" />
              <circle cx={loc.x} cy={loc.y} r={size} fill={color} stroke="white" strokeWidth="0.3" />
              {loc.count > 5 && (
                <circle cx={loc.x} cy={loc.y} r={size + 1.5} fill={color} opacity="0.15">
                  <animate attributeName="r" values={`${size};${size + 2};${size}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={loc.x + 1.5} y={loc.y + 0.5} fill="white" fontSize="2.2" fontWeight="600" opacity="0.9">{loc.name}</text>
              <text x={loc.x + 1.5} y={loc.y + 2.8} fill={color} fontSize="1.8" opacity="0.8">{loc.count} {loc.type === 'warehouse' ? 'receiving' : loc.type === 'origin' ? 'vessels' : 'containers'}</text>
            </g>
          )
        })}
      </svg>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-slate-900/80 rounded-lg px-3 py-1.5 backdrop-blur-sm">
        {[['#6366f1','Origin'],['#14b8a6','Port/Terminal'],['#22c55e','Warehouse'],['#f97316','Alert']].map(([c,l]) => (
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c as string }} />
            <span className="text-[9px] text-gray-300">{l}</span>
          </div>
        ))}
      </div>

      {/* Stats overlay */}
      <div className="absolute top-3 right-3 bg-slate-900/80 rounded-lg px-3 py-2 backdrop-blur-sm">
        <p className="text-[9px] text-gray-400 uppercase font-semibold mb-1">Live Status</p>
        <p className="text-xs font-bold text-white">1,248 <span className="text-[10px] font-normal text-gray-400">in transit</span></p>
        <p className="text-xs font-bold text-orange-400">27 <span className="text-[10px] font-normal text-gray-400">exceptions</span></p>
      </div>
    </div>
  )
}

// ─── AI Agent Panel ───────────────────────────────────────────────────────────
function AIAgentPanel() {
  const [expanded, setExpanded] = useState(false)
  const suggestions = [
    { icon: <AlertTriangle size={12} className="text-red-400" />, text: '3 containers at Garden City Terminal are past LFD. Recommend expedite dispatch today to avoid daily demurrage charges.', action: 'Initiate dispatch', priority: 'P1' },
    { icon: <TrendingDown size={12} className="text-orange-400" />, text: 'OTIF score trending to 93.2% for Week 35. 5 orders at risk. Suggest confirming carrier delivery windows before EoD.', action: 'Review orders', priority: 'P2' },
    { icon: <RefreshCw size={12} className="text-blue-400" />, text: 'Inventory cycle count variance detected for SKU ADPOST-SMALL-RED. Recommend reallocating from Savannah DC to cover shortage.', action: 'Check allocation', priority: 'P2' },
  ]

  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
            <Bot size={13} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">AI Agent Analysis</p>
            <p className="text-[10px] text-gray-500">Recommended actions based on current exceptions</p>
          </div>
        </div>
        <button onClick={() => setExpanded(v => !v)} className="text-[10px] text-violet-600 hover:underline font-medium">
          {expanded ? 'Show less' : 'Show all'}
        </button>
      </div>
      <div className="space-y-2.5">
        {suggestions.slice(0, expanded ? 3 : 2).map((s, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-violet-100">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-700 leading-relaxed">{s.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${s.priority === 'P1' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{s.priority}</span>
                  <button className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-800 font-medium">
                    <Zap size={9} />{s.action}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [taskFilter, setTaskFilter] = useState<'all' | 'overdue' | 'today'>('all')

  const filteredTasks = MY_TASKS.filter(t => {
    if (taskFilter === 'overdue') return t.status === 'Overdue'
    if (taskFilter === 'today') return t.due.startsWith('Today')
    return true
  })

  return (
    <div className="space-y-4 pb-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-6 gap-3">
        {SUMMARY_STATS.map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl px-4 py-3 border border-white`}>
            <p className="text-[10px] text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle Row: Map + Exceptions */}
      <div className="grid grid-cols-5 gap-4">
        {/* Network Map */}
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-indigo-500" />
              <p className="text-sm font-bold text-gray-800">网络地图 / 仓库与运输态势</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Activity size={10} className="text-green-500" /> Live</span>
              <button className="text-primary-600 hover:underline font-medium">Full screen</button>
            </div>
          </div>
          <NetworkMap />
        </div>

        {/* Exceptions */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-sm font-bold text-gray-800">异常与下一步行动</p>
            </div>
            <button className="text-[10px] text-primary-600 hover:underline font-medium">View all</button>
          </div>
          <div className="space-y-2.5">
            {EXCEPTIONS.map((ex, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${ex.color}`}>{ex.priority}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">{ex.label}</p>
                  <p className="text-[10px] text-gray-400 truncate">{ex.desc}</p>
                </div>
                <button
                  onClick={() => navigate(ex.path)}
                  className="text-[10px] text-violet-600 hover:text-violet-800 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {ex.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: My Tasks + AI Agent */}
      <div className="grid grid-cols-5 gap-4">
        {/* My Tasks */}
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-violet-500" />
              <p className="text-sm font-bold text-gray-800">我的任务</p>
              <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">18 overdue</span>
            </div>
            <div className="flex items-center gap-1">
              {(['all','overdue','today'] as const).map(f => (
                <button key={f} onClick={() => setTaskFilter(f)}
                  className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${taskFilter === f ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {f === 'all' ? 'All' : f === 'overdue' ? 'Overdue' : 'Today'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => navigate(task.path)}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${task.status === 'Overdue' ? 'bg-red-500' : task.status === 'Urgent' ? 'bg-orange-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 group-hover:text-primary-700 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{task.type}</span>
                    <span className={`text-[9px] font-semibold ${task.priority === 'P1' ? 'text-red-500' : task.priority === 'P2' ? 'text-orange-500' : 'text-gray-400'}`}>{task.priority}</span>
                    <span className="flex items-center gap-0.5 text-[9px] text-gray-400"><Clock size={9} />{task.due}</span>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent + Module Quick Links */}
        <div className="col-span-2 space-y-4">
          <AIAgentPanel />
          {/* Quick module links */}
          <div className="grid grid-cols-2 gap-2">
            {MODULES.slice(1).map(m => (
              <button key={m.title} onClick={() => m.path && navigate(m.path)}
                className={`flex items-center gap-2 p-2.5 bg-white border rounded-lg text-left hover:shadow-sm transition-all ${m.color}`}>
                {m.icon}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-700 truncate">{m.title}</p>
                  <p className="text-[9px] text-gray-400 truncate">{m.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
