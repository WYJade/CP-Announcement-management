import { useState } from 'react'
import {
  MessageSquare, Zap, Settings, Store, Search, Clock,
  AlertTriangle, ChevronRight, Star, Bot, X, ExternalLink,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AgentTask {
  id: string
  title: string
  agent: string
  agentTag: string
  tagColor: string
  priority: string
  priorityColor: string
  timeAgo: string
  description: string
  actions: { label: string; variant: 'primary' | 'secondary' | 'warning' }[]
}

interface AgentItem {
  id: string
  name: string
  tag: string
  tagColor: string
  lastUsed?: string
  status: 'active' | 'unused'
}

// ─── Sample Data (based on the demo scenarios) ──────────────────────────────

const NEED_INPUT_TASKS: AgentTask[] = [
  {
    id: 'task-1',
    title: 'DN# 冲突预警 · QVC 945 跨仓重复',
    agent: 'DN# 冲突预警',
    agentTag: 'OMS',
    tagColor: 'bg-red-600',
    priority: 'SLA 2h16m',
    priorityColor: 'text-red-400',
    timeAgo: '5m ago',
    description: 'DR-122309 即将出 QVC 945，但 Buena Park 在 2024-10 用过同 DN#，Agent 已暂停出口，2 个方案待 Shelia 选',
    actions: [{ label: '看方案', variant: 'primary' }, { label: '升级', variant: 'secondary' }, { label: '忽略', variant: 'secondary' }],
  },
  {
    id: 'task-2',
    title: '3 个工单 SLA < 30 分钟',
    agent: 'SLA AGENT',
    agentTag: 'WMS',
    tagColor: 'bg-orange-500',
    priority: '待处理',
    priorityColor: 'text-orange-400',
    timeAgo: '12m ago',
    description: 'TKT-59563 赵女士额外配送、TKT-20790 退款、TKT-25102 深圳站一层时效疑问间题',
    actions: [{ label: '立即处理', variant: 'primary' }, { label: '详情', variant: 'secondary' }, { label: '忽略', variant: 'secondary' }],
  },
  {
    id: 'task-3',
    title: 'Approval Gateway · 5 个待你批准',
    agent: 'AGENT',
    agentTag: 'OMS',
    tagColor: 'bg-blue-500',
    priority: '待批准',
    priorityColor: 'text-blue-400',
    timeAgo: '8m ago',
    description: 'ORD-8821 例外取消、ORD-9034 改地址、ORD-9036 退款、买买道调整 SKU-002、Walmart 仓邮件签章',
    actions: [{ label: '一键批准全部', variant: 'primary' }, { label: '逐条 review', variant: 'secondary' }, { label: '忽略', variant: 'secondary' }],
  },
  {
    id: 'task-4',
    title: 'UPS 西海岸罢工预警',
    agent: 'AGENT',
    agentTag: 'TMS',
    tagColor: 'bg-purple-500',
    priority: '待处理',
    priorityColor: 'text-purple-400',
    timeAgo: '2h ago',
    description: '4 shipment 受影响，货物 1,241 件，客户 DDD，Agent 已生成 4 种备选方案',
    actions: [{ label: '查看方案', variant: 'primary' }, { label: '标记已处理', variant: 'secondary' }, { label: '忽略', variant: 'secondary' }],
  },
  {
    id: 'task-5',
    title: '海风家居拒绝 SKU-002 调拨方案',
    agent: 'AGENT',
    agentTag: 'OMS',
    tagColor: 'bg-green-500',
    priority: '待确认',
    priorityColor: 'text-green-400',
    timeAgo: '1h ago',
    description: '原因：Walmart 长约 SKU 不可调拨，Agent 已加入黑名单，30d 不再向此商家推送',
    actions: [{ label: '查看情况', variant: 'secondary' }, { label: '撤销学习', variant: 'warning' }],
  },
  {
    id: 'task-6',
    title: '库存覆盖扫描 · 14 个 SKU 标记补货',
    agent: 'AGENT',
    agentTag: 'WMS',
    tagColor: 'bg-amber-500',
    priority: '待处理 02',
    priorityColor: 'text-amber-400',
    timeAgo: '30m ago',
    description: 'JD-005 覆盖 3d，AA-11 覆盖 12d，还有 12 个一触发生补货信号的 SKU 待处理',
    actions: [{ label: '确认执行', variant: 'primary' }, { label: '查看 14 个', variant: 'secondary' }, { label: '忽略', variant: 'secondary' }],
  },
]

const WORKING_TASKS = [
  { id: 'w-1', title: 'Promise · 23 单替代方案模拟', status: 'running', progress: '已经 2m 18s，完成 16/23 单，预计还差 1 分钟' },
]

const MY_AGENTS: AgentItem[] = [
  { id: 'a-1', name: 'Connector+flow', tag: 'BI', tagColor: 'bg-blue-500', lastUsed: 'Jun 18 20:34', status: 'active' },
  { id: 'a-2', name: 'Item Smallparcel Support', tag: 'WMS', tagColor: 'bg-green-500', status: 'unused' },
  { id: 'a-3', name: 'UNIS Smallparcel Support', tag: 'WMS', tagColor: 'bg-green-500', status: 'unused' },
  { id: 'a-4', name: 'EDI 诊断 Copilot', tag: 'EDI', tagColor: 'bg-purple-500', status: 'active' },
  { id: 'a-5', name: 'AGENT.md 编辑器', tag: '', tagColor: 'bg-gray-500', status: 'active' },
  { id: 'a-6', name: '数据查询 Copilot', tag: '', tagColor: 'bg-gray-500', status: 'active' },
  { id: 'a-7', name: 'Session Trace · MHH', tag: '', tagColor: 'bg-gray-500', status: 'active' },
]

// ─── Nav items ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'workstation', label: 'Agent Workstation', icon: Zap },
  { id: 'customize', label: 'Customize', icon: Settings },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AgentWorkstation() {
  const [activeNav, setActiveNav] = useState('workstation')
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null)

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-4 bg-gray-50">
      {/* Left sidebar - Navigation */}
      <div className="w-44 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">AI Native</p>
              <p className="text-[10px] text-gray-400">Operations AI</p>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase px-2 pt-2 pb-1">Agents</p>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeNav === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">Settings</p>
        </div>
      </div>

      {/* Middle panel - My Agents list */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">My Agents</h3>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search agents..." className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Need Input section */}
        <div className="p-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
            <AlertTriangle size={10} /> NEED INPUT
            <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 rounded-full">{NEED_INPUT_TASKS.length}</span>
          </p>
          <div className="space-y-1.5">
            {NEED_INPUT_TASKS.slice(0, 4).map(task => (
              <button key={task.id} onClick={() => setSelectedTask(task)}
                className={`w-full text-left px-2.5 py-2 rounded-lg border transition-colors ${
                  selectedTask?.id === task.id ? 'bg-primary-50 border-primary-200' : 'border-transparent hover:bg-gray-50'
                }`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${task.tagColor}`} />
                  <span className="text-[11px] font-medium text-gray-800 truncate">{task.agent}</span>
                  <span className={`text-[9px] font-bold px-1 rounded ${task.tagColor} text-white`}>{task.agentTag}</span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">{task.description.slice(0, 40)}...</p>
              </button>
            ))}
          </div>
        </div>

        {/* Working section */}
        <div className="p-3 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
            <Clock size={10} /> WORKING
            <span className="ml-auto text-[10px] text-gray-400">{WORKING_TASKS.length}</span>
          </p>
          {WORKING_TASKS.map(t => (
            <div key={t.id} className="px-2.5 py-2 rounded-lg hover:bg-gray-50">
              <p className="text-[11px] font-medium text-gray-700">{t.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{t.progress}</p>
            </div>
          ))}
        </div>

        {/* My Agents */}
        <div className="p-3 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
            <Star size={10} /> MY AGENTS
            <span className="ml-auto text-[10px] text-gray-400">{MY_AGENTS.length}</span>
          </p>
          <div className="space-y-1">
            {MY_AGENTS.map(agent => (
              <div key={agent.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className={`w-5 h-5 rounded ${agent.tagColor} flex items-center justify-center`}>
                  <Bot size={10} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-700 truncate">{agent.name}</p>
                  <p className="text-[9px] text-gray-400">{agent.lastUsed || 'Unused'}</p>
                </div>
                {agent.tag && <span className={`text-[9px] font-bold px-1 rounded ${agent.tagColor} text-white`}>{agent.tag}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content - Agent Workstation */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={20} className="text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Agent Workstation</h1>
              <p className="text-xs text-gray-500">Operations workbench · {MY_AGENTS.length} enabled agents · {NEED_INPUT_TASKS.length} active conversations</p>
            </div>
          </div>

          {/* Need Input section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              Need Input · awaiting your decision
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{NEED_INPUT_TASKS.length}</span>
            </h2>
            <div className="space-y-3">
              {NEED_INPUT_TASKS.map(task => (
                <div key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTask?.id === task.id ? 'border-primary-300 ring-1 ring-primary-100' : 'border-gray-200'
                  }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${task.tagColor} text-white`}>{task.agentTag}</span>
                        <span className="text-sm font-semibold text-gray-900">{task.title}</span>
                        <span className={`text-xs font-medium ${task.priorityColor}`}>{task.priority}</span>
                        <span className="text-xs text-gray-400 ml-auto">{task.timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {task.actions.map((action, i) => (
                      <button key={i}
                        onClick={(e) => { e.stopPropagation(); }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          action.variant === 'primary' ? 'bg-primary-600 text-white hover:bg-primary-700' :
                          action.variant === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' :
                          'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Working section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock size={14} className="text-blue-500" />
              Working · your long-running tasks
            </h2>
            {WORKING_TASKS.map(task => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.progress}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* My Agents section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              My Agents
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {MY_AGENTS.filter(a => a.status === 'active').map(agent => (
                <div key={agent.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm cursor-pointer transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${agent.tagColor} flex items-center justify-center`}>
                      <Bot size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                      {agent.tag && <span className={`text-[9px] font-bold px-1 rounded ${agent.tagColor} text-white`}>{agent.tag}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{agent.lastUsed || 'Ready to use'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task detail popup */}
      {selectedTask && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedTask.tagColor} text-white`}>{selectedTask.agentTag}</span>
              <span className="text-sm font-semibold text-gray-900 truncate">{selectedTask.title.slice(0, 25)}...</span>
            </div>
            <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{selectedTask.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedTask.actions.map((action, i) => (
                <button key={i} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  action.variant === 'primary' ? 'bg-primary-600 text-white hover:bg-primary-700' :
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{action.label}</button>
              ))}
            </div>
            <button className="flex items-center gap-1 mt-3 text-xs text-primary-600 hover:underline">
              进入对话详情 <ExternalLink size={10} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
