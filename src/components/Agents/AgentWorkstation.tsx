import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  MessageSquare, Zap, Settings, Store, Search, Clock,
  AlertTriangle, ChevronRight, Star, Bot, X, ChevronDown,
  Plus, Mic, Paperclip, Send, ArrowLeft, RefreshCw,
  MessageCircle, Sparkles, FileText, CheckCircle2, ArrowLeftRight, Shield,
} from 'lucide-react'

// ─── Nav items ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'workstation', label: 'Agent Workstation', icon: Zap },
  { id: 'customize', label: 'Customize', icon: Settings },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
]

// ─── Chat Modules Data ────────────────────────────────────────────────────────

const CHAT_MODULES = [
  { id: 'sales', label: 'Sales Orders', count: 10, refs: ['ORD-8821', 'ORD-8820', 'ORD-8819', 'ORD-8818', 'ORD-8817', 'ORD-8816', 'ORD-8815', 'ORD-8814', 'ORD-8813', 'ORD-8812'] },
  { id: 'inbound', label: 'Inbound', count: 8, refs: ['RN-38199', 'RN-38198', 'RN-38197', 'RN-38196', 'RN-38195', 'ASN-20260601', 'ASN-20260602', 'ASN-20260603'] },
  { id: 'inventory', label: 'Inventory', count: 8, refs: ['SKU-A100', 'SKU-B200', 'SKU-C350', 'SKU-D410', 'SKU-E520', 'FW-DENIM-001', 'FW-2024-BLK', 'TCORE-CABLE'] },
  { id: 'outbound', label: 'Outbound', count: 8, refs: ['SHP-10021', 'SHP-10022', 'SHP-10023', 'SHP-10024', 'SHP-10025', 'LOAD-4401', 'LOAD-4402', 'LOAD-4403'] },
  { id: 'shipment', label: 'Shipment', count: 8, refs: ['SSHAS2608072', 'SSHAS2608135', 'SSHAS2608099', 'SSHAS2608130', 'SSHAS2608200', 'SSHAS2608250', 'SSHAS2608260', 'SSHAS2608270'] },
  { id: 'invoice', label: 'Invoice', count: 6, refs: ['INV-19043770', 'INV-19043771', 'INV-19043772', 'INV-19043773', 'INV-19043774', 'INV-19043775'] },
]

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

// ─── Quick-reply definitions per tab (All-in-One Copilot) ────────────────────
const COPILOT_TABS = [
  {
    id: 'inbound',
    label: 'Inbound',
    color: 'bg-blue-500',
    chips: [
      '帮我查一下进行中的RN有哪些？',
      '帮我查一下未完成且超过7天未更新状态的RN有哪些？',
      '帮我查一下APPT #：APPT-XXXX的当前状态。',
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    color: 'bg-emerald-500',
    chips: [
      '帮我查一下Item：XXXXXX在什么位置？现在什么状态？',
      '帮我查一下在Ontario, CA facility中\'Goods Type\'为Expired的库存有多少？',
      '库存调整单提交后，发现数量填错了，能撤回或修改吗？',
    ],
  },
  {
    id: 'outbound',
    label: 'Outbound',
    color: 'bg-amber-500',
    chips: [
      '帮我查一下Order #：DN-XXXXXXX的订单状态',
      '出库单录入时，\'Order Type\'怎么选？Reference需要填什么？',
      '帮我对目前在XXX facility中的出库单做一下汇总。',
    ],
  },
]

// ─── Simulated Agent responses ────────────────────────────────────────────────
type SimMsg = { role: 'user' | 'agent'; text: string; lines?: string[] }

const SIM_RESPONSES: Record<string, SimMsg[]> = {
  '帮我查一下进行中的RN有哪些？': [
    { role: 'user', text: '帮我查一下进行中的RN有哪些？' },
    {
      role: 'agent',
      text: '正在查询进行中的 Receipt Notice（RN）...',
      lines: [
        '✅ 共找到 **4 条**进行中的 RN：',
        '',
        '| RN # | 状态 | 到仓日期 | 供应商 |',
        '|---|---|---|---|',
        '| RN-38199 | In Progress | 2026-09-10 | ACME Supplies |',
        '| RN-38198 | Receiving | 2026-09-09 | Global Goods |',
        '| RN-38197 | Pending QC | 2026-09-08 | SharkNinja |',
        '| RN-38195 | Scheduled | 2026-09-12 | THE ONLY BEAN |',
        '',
        '如需查看某条 RN 的详细信息，请告诉我 RN 编号。',
      ],
    },
  ],
  '帮我查一下未完成且超过7天未更新状态的RN有哪些？': [
    { role: 'user', text: '帮我查一下未完成且超过7天未更新状态的RN有哪些？' },
    {
      role: 'agent',
      text: '正在筛选未完成且超过 7 天未更新的 RN...',
      lines: [
        '⚠️ 共找到 **2 条**符合条件的 RN：',
        '',
        '| RN # | 最后更新 | 距今 | 状态 | 供应商 |',
        '|---|---|---|---|---|',
        '| RN-38193 | 2026-08-30 | 12天前 | Pending QC | VITA COCO |',
        '| RN-38190 | 2026-08-28 | 14天前 | On Hold | ORGAIN LLC |',
        '',
        '建议及时跟进这两条 RN，避免影响入库时效。是否需要我生成一份催办通知？',
      ],
    },
  ],
  '帮我查一下APPT #：APPT-XXXX的当前状态。': [
    { role: 'user', text: '帮我查一下APPT #：APPT-XXXX的当前状态。' },
    {
      role: 'agent',
      text: '正在查询 APPT-3763 的状态...',
      lines: [
        '📋 **APPT-3763** 当前状态详情：',
        '',
        '- **状态**：CHECKED IN ✅',
        '- **承运商**：FEDEX FREIGHT INC',
        '- **客户**：SharkNinja Sales Company',
        '- **预约时间**：2026-08-11 01:00',
        '- **签到时间**：2026-08-11 00:22',
        '- **操作员**：estherccc',
        '',
        '该预约已正常签到，无异常。如需修改或取消，请前往 Appointment 页面操作。',
      ],
    },
  ],
  '帮我查一下Item：XXXXXX在什么位置？现在什么状态？': [
    { role: 'user', text: '帮我查一下Item：XXXXXX在什么位置？现在什么状态？' },
    {
      role: 'agent',
      text: '正在定位 SKU-A100 的库存位置...',
      lines: [
        '📦 **SKU-A100** 库存定位结果：',
        '',
        '- **当前仓库**：Ontario, CA',
        '- **库区**：Zone B — 货架 B-04-03',
        '- **可用数量**：1,240 units',
        '- **冻结数量**：80 units（关联出库单 DN-8821001）',
        '- **货物状态**：Normal ✅',
        '- **最后盘点**：2026-09-05',
        '',
        '如需查看完整库存记录或调拨，请告诉我。',
      ],
    },
  ],
  '帮我查一下在Ontario, CA facility中\'Goods Type\'为Expired的库存有多少？': [
    { role: 'user', text: '帮我查一下在Ontario, CA facility中\'Goods Type\'为Expired的库存有多少？' },
    {
      role: 'agent',
      text: '正在查询 Ontario, CA 中 Expired 类型库存...',
      lines: [
        '⚠️ **Ontario, CA** — Expired 库存汇总：',
        '',
        '| SKU | 品名 | 数量 | 过期日期 |',
        '|---|---|---|---|',
        '| SKU-C350 | Protein Bar Mix | 320 units | 2026-08-01 |',
        '| SKU-E520 | Coconut Water 1L | 150 units | 2026-07-15 |',
        '',
        '**合计：470 units** 已过期，建议尽快发起报废或退货流程。',
        '是否需要我生成 Disposition 申请单？',
      ],
    },
  ],
  '库存调整单提交后，发现数量填错了，能撤回或修改吗？': [
    { role: 'user', text: '库存调整单提交后，发现数量填错了，能撤回或修改吗？' },
    {
      role: 'agent',
      text: '正在检索库存调整单撤回政策...',
      lines: [
        '📋 **库存调整单修改政策**：',
        '',
        '- **状态为 Pending（待审批）**：✅ 可以撤回，进入调整单详情页点击"撤回"即可重新编辑。',
        '- **状态为 Approved（已审批）**：❌ 无法直接修改，需联系仓库主管在系统内做反向调整单抵消。',
        '- **状态为 Processed（已执行）**：❌ 库存已变更，须通过新建调整单 + 说明原因的方式纠正。',
        '',
        '💡 建议：如果调整单刚刚提交且状态仍为 Pending，请立即前往 **Inventory → Adjustment** 页面撤回。',
        '需要我帮你定位该调整单吗？',
      ],
    },
  ],
  '帮我查一下Order #：DN-XXXXXXX的订单状态': [
    { role: 'user', text: '帮我查一下Order #：DN-XXXXXXX的订单状态' },
    {
      role: 'agent',
      text: '正在查询出库单 DN-8821001...',
      lines: [
        '🚚 **DN-8821001** 出库单状态：',
        '',
        '- **状态**：Picking In Progress 🔄',
        '- **客户**：SharkNinja Sales Company',
        '- **仓库**：Ontario, CA — Dock 711',
        '- **承运商**：UPS',
        '- **预计发货**：2026-09-09 14:00',
        '- **关联库存**：SKU-A100 × 200 units，SKU-B200 × 50 units',
        '- **拣货完成率**：75%（150 / 200 件已拣）',
        '',
        '拣货仍在进行中，预计 2-3 小时内完成。是否需要实时通知？',
      ],
    },
  ],
  '出库单录入时，\'Order Type\'怎么选？Reference需要填什么？': [
    { role: 'user', text: '出库单录入时，\'Order Type\'怎么选？Reference需要填什么？' },
    {
      role: 'agent',
      text: '正在检索出库单录入规范...',
      lines: [
        '📋 **出库单录入指南**：',
        '',
        '**Order Type 选择规则：**',
        '| 场景 | 选择值 |',
        '|---|---|',
        '| 正常客户发货 | Sales Order |',
        '| 客户退货出库 | Return |',
        '| 仓库间调拨 | Transfer |',
        '| 样品/赠品 | Sample |',
        '| 报废处理 | Disposal |',
        '',
        '**Reference 填写规范：**',
        '- Sales Order → 填写客户 PO 号（如：PO-20260901）',
        '- Transfer → 填写目标仓库代码（如：GA-WH-01）',
        '- Return → 填写原出库单号（如：DN-XXXXXXX）',
        '- 若无强制要求，可填写内部备注或留空。',
        '',
        '如有具体订单不确定如何填写，可把订单发给我帮你判断。',
      ],
    },
  ],
  '帮我对目前在XXX facility中的出库单做一下汇总。': [
    { role: 'user', text: '帮我对目前在XXX facility中的出库单做一下汇总。' },
    {
      role: 'agent',
      text: '正在统计 Ontario, CA 的出库单数据...',
      lines: [
        '📊 **Ontario, CA — 出库单汇总**（截至 2026-09-09 10:00）：',
        '',
        '| 状态 | 单数 | 件数 |',
        '|---|---|---|',
        '| Pending | 8 | 1,240 units |',
        '| Picking | 5 | 820 units |',
        '| Packed | 3 | 450 units |',
        '| Shipped | 12 | 2,100 units |',
        '| On Hold | 2 | 300 units |',
        '',
        '**合计：30 单，4,910 units**',
        '',
        '⚠️ 2 单处于 On Hold 状态，可能影响发货时效，建议优先处理。',
        '需要我导出明细或查看某个具体状态的列表吗？',
      ],
    },
  ],
}

// ─── Agent Definitions ───────────────────────────────────────────────────────

const AGENTS = [
  {
    id: 'all-in-one',
    name: 'All-in-One Copilot',
    dot: 'bg-blue-500',
    iconBg: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-200',
    sendBg: 'bg-violet-600 hover:bg-violet-700',
    accentRing: 'focus-within:border-violet-300 focus-within:ring-violet-100',
    greeting: '有什么我能帮到你？',
    subtitleText: '订单状态 · 入库跟踪 · 库存查询 · 出库进度 全都能问。无需切换模块，一个入口即可查询所有业务数据，快速获取结果。',
    placeholder: '问任何与入库、库存、出库相关的问题... 输入 @ 引用单号',
    hints: ['⚡ 跨模块自动取数', '🔍 结合真实业务场景', '📐 复杂任务 → Agent Workstation'],
  },
  {
    id: 'inbound',
    name: 'CP-Inbound Agent',
    dot: 'bg-blue-500',
    iconBg: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-200',
    sendBg: 'bg-blue-600 hover:bg-blue-700',
    accentRing: 'focus-within:border-blue-300 focus-within:ring-blue-100',
    greeting: '入库问题，帮你查清楚',
    subtitleText: '专注 ASN 状态 · RN 跟踪 · 收货进度 · 预约管理。输入单号或描述问题，立即获取当前状态与异常提示。',
    placeholder: '输入 RN 号、ASN 号或直接描述问题...',
    hints: ['📋 RN / ASN 实时状态', '📅 预约管理', '⚠️ 异常自动识别'],
  },
  {
    id: 'inventory',
    name: 'CP-Inventory Agent',
    dot: 'bg-blue-500',
    iconBg: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-200',
    sendBg: 'bg-emerald-600 hover:bg-emerald-700',
    accentRing: 'focus-within:border-emerald-300 focus-within:ring-emerald-100',
    greeting: '库存信息，一问即知',
    subtitleText: '专注 库存查询 · 货物定位 · 过期/异常库存 · 调整单政策。直接输入 SKU 或描述场景，快速获取库存快照与建议。',
    placeholder: '输入 SKU 编号或描述问题... 如：SKU-A100 在哪里？',
    hints: ['📦 实时库存快照', '🚨 过期/异常预警', '📋 调整单政策查询'],
  },
  {
    id: 'outbound',
    name: 'CP-Outbound Agent',
    dot: 'bg-blue-500',
    iconBg: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-200',
    sendBg: 'bg-amber-500 hover:bg-amber-600',
    accentRing: 'focus-within:border-amber-300 focus-within:ring-amber-100',
    greeting: '出库发货，实时掌握',
    subtitleText: '专注 出库单状态 · 发货进度 · 录入规范 · 仓库汇总。输入出库单号或直接描述场景，立即获取结果与操作建议。',
    placeholder: '输入出库单号或直接描述问题... 如：DN-8821001 状态？',
    hints: ['🚚 出库单实时追踪', '📋 录入规范查询', '📊 仓库出库汇总'],
  },
]

// ─── Markdown-lite renderer for agent responses ──────────────────────────────
function AgentLine({ text }: { text: string }) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-semibold text-gray-800">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  )
}

function AgentBubble({ lines, done }: { lines: string[]; done: boolean }) {
  // Detect table rows
  const isTableRow = (s: string) => s.startsWith('|')
  const isSeparator = (s: string) => /^\|[-| :]+\|$/.test(s.trim())

  let inTable = false
  const rendered: React.ReactNode[] = []
  let tableRows: string[][] = []

  const flushTable = () => {
    if (tableRows.length === 0) return
    const [header, , ...body] = tableRows
    rendered.push(
      <div key={`tbl-${rendered.length}`} className="overflow-x-auto my-2">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr className="bg-gray-100">
              {header.filter(Boolean).map((h, i) => (
                <th key={i} className="px-3 py-1.5 text-left text-gray-600 font-semibold border border-gray-200 whitespace-nowrap">
                  <AgentLine text={h.trim()} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className="even:bg-gray-50">
                {row.filter(Boolean).map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 border border-gray-200 text-gray-700 whitespace-nowrap">
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
    if (isSeparator(line)) continue
    if (isTableRow(line)) {
      inTable = true
      tableRows.push(line.split('|').slice(1, -1))
      continue
    }
    if (inTable) flushTable()

    if (line === '') {
      rendered.push(<div key={i} className="h-2" />)
    } else if (line.startsWith('- ')) {
      rendered.push(
        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
          <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
          <AgentLine text={line.slice(2)} />
        </div>
      )
    } else {
      rendered.push(
        <p key={i} className="text-xs text-gray-700 leading-relaxed">
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

// ─── Chat View ───────────────────────────────────────────────────────────────

function ChatView() {
  type ChatMsg = { role: 'user' | 'agent'; text: string; lines?: string[]; done?: boolean }

  const [input, setInput] = useState('')
  const [activeAgentId, setActiveAgentId] = useState('all-in-one')
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  const [activeTabId, setActiveTabId] = useState('inbound')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showModuleSelect, setShowModuleSelect] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const agent = AGENTS.find(a => a.id === activeAgentId)!
  const currentTab = COPILOT_TABS.find(t => t.id === activeTabId)!

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSelectAgent = (id: string) => {
    setActiveAgentId(id)
    setShowAgentDropdown(false)
    setMessages([])
    // 每个 Agent 对应不同的默认激活 tab
    const defaultTab: Record<string, string> = {
      'all-in-one': 'inbound',
      'inbound':    'inbound',
      'inventory':  'inventory',
      'outbound':   'outbound',
    }
    setActiveTabId(defaultTab[id] ?? 'inbound')
  }

  const handleTabClick = (id: string) => {
    setActiveTabId(id)
    setMessages([])
  }

  const simulateResponse = (question: string) => {
    const sim = SIM_RESPONSES[question]
    if (!sim || sim.length < 2) return

    const agentMsg = sim[1]
    // Step 1: show "thinking" bubble
    setMessages(prev => [...prev, { role: 'agent', text: agentMsg.text, lines: [], done: false }])

    // Step 2: stream lines one by one
    const allLines = agentMsg.lines ?? []
    let idx = 0
    const interval = setInterval(() => {
      idx++
      setMessages(prev => {
        const updated = [...prev]
        const last = { ...updated[updated.length - 1] }
        last.lines = allLines.slice(0, idx)
        last.done = idx >= allLines.length
        updated[updated.length - 1] = last
        return updated
      })
      if (idx >= allLines.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 120)
  }

  const handleSend = (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || isTyping) return
    setInput('')
    setIsTyping(true)
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setTimeout(() => simulateResponse(q), 600)
  }

  const handleChipClick = (chip: string) => {
    setInput(chip)
    // 聚焦输入框，将光标置于末尾，让用户可直接修改后再发送
    setTimeout(() => {
      const el = inputRef.current
      if (el) {
        el.focus()
        el.setSelectionRange(chip.length, chip.length)
        // 自动撑高
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 160) + 'px'
      }
    }, 30)
  }

  const handleInputChange = (val: string) => {
    setInput(val)
    if (val.endsWith('@')) { setShowModuleSelect(true); setSelectedModule(null) }
    else if (!val.includes('@')) setShowModuleSelect(false)
  }

  const handleSelectModule = (moduleId: string) => setSelectedModule(moduleId)
  const handleSelectRef = (ref: string) => {
    const mod = CHAT_MODULES.find(m => m.id === selectedModule)
    setInput(input.replace(/@$/, '') + `@${mod?.label}/${ref} `)
    setShowModuleSelect(false); setSelectedModule(null)
  }

  const inConversation = messages.length > 0

  return (
    <div className="flex flex-col h-full bg-white" onClick={() => showAgentDropdown && setShowAgentDropdown(false)}>

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 shrink-0">
        <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Plus size={15} />
        </button>
        <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Clock size={15} />
        </button>
        <span className="text-xs text-gray-500 font-medium truncate">查询下SH20260716 对应的出入库记录</span>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">● Connector+flow</span>
      </div>

      {/* ── Welcome / Conversation area ── */}
      <div className="flex-1 overflow-y-auto">
        {!inConversation ? (
          /* ──── EMPTY STATE ──── */
          <div className="flex flex-col items-center justify-center min-h-full px-6 py-8">

            {/* Agent icon */}
            <div className={`w-12 h-12 bg-gradient-to-br ${agent.iconBg} rounded-2xl flex items-center justify-center mb-3 shadow-md ${agent.shadowColor}`}>
              <MessageCircle size={22} className="text-white" />
            </div>

            {/* Agent selector */}
            <div className="relative mb-4" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowAgentDropdown(v => !v)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all text-sm font-medium shadow-sm
                  ${showAgentDropdown
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
                  }`}
              >
                {/* switch icon */}
                <ArrowLeftRight size={14} className={`shrink-0 transition-colors ${showAgentDropdown ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className="text-[11px] text-gray-400 font-normal">切换 Agent</span>
                <span className="w-px h-3.5 bg-gray-200" />
                <span className={`w-2 h-2 rounded-full ${agent.dot} shrink-0`} />
                <span>{agent.name}</span>
                <ChevronDown size={13} className={`text-gray-400 transition-transform shrink-0 ${showAgentDropdown ? 'rotate-180 text-primary-400' : ''}`} />
              </button>

              {showAgentDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                    <ArrowLeftRight size={12} className="text-gray-400" />
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">切换 Agent</p>
                  </div>
                  {AGENTS.map(a => (
                    <button key={a.id} onClick={() => handleSelectAgent(a.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-primary-50 ${a.id === activeAgentId ? 'bg-primary-50' : ''}`}>
                      <span className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
                      <span className={`text-sm ${a.id === activeAgentId ? 'font-semibold text-primary-700' : 'text-gray-600 font-medium'}`}>{a.name}</span>
                      {a.id === activeAgentId && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-primary-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400" /> 当前
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Greeting */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{agent.greeting}</h2>
            <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed mb-4">
              {agent.subtitleText}
            </p>

            {/* ── Input box (above tabs, Kimi-style) ── */}
            <div className="w-full max-w-xl mb-6">

              {/* 三条提示文案 — 输入框上方 */}
              <div className="flex items-center justify-center gap-5 mb-3 flex-wrap">
                {agent.hints.map(h => (
                  <span key={h} className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">{h}</span>
                ))}
              </div>

              {/* Kimi-style input card */}
              <div className="border border-gray-200 rounded-2xl bg-white shadow-sm transition-all focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 focus-within:shadow-md overflow-hidden">

                {/* Textarea */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => { handleInputChange(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px' }}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder={agent.placeholder}
                  disabled={isTyping}
                  rows={2}
                  className="w-full px-4 pt-4 pb-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent resize-none disabled:opacity-50 leading-relaxed"
                  style={{ minHeight: '64px', maxHeight: '160px' }}
                />

                {/* Toolbar row — 高频按钮显性展示，低频收纳至更多 */}
                <div className="flex items-center gap-1 px-3 pb-3 pt-1">
                  <div className="flex items-center gap-0.5 flex-1">
                    <ToolBtn icon={<Paperclip size={14}/>} label="附件" />
                    <ToolBtn icon={<CheckCircle2 size={14}/>} label="替我审批" hasDropdown
                      dropdownContent={
                        <div className="p-3 space-y-3 w-64">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">权限模式</p>
                          <ToggleRow icon={<ArrowLeftRight size={13}/>} label="请求批准" desc="工具执行前请求确认，适合高风险或调试场景。" />
                          <ToggleRow icon={<CheckCircle2 size={13}/>} label="替我审批" desc="使用默认安全策略，推荐日常使用。" defaultOn />
                          <ToggleRow icon={<Shield size={13}/>} label="完全访问权限" desc="默认允许工具执行，适合可信会话。" />
                        </div>
                      }
                    />
                    <ToolBtn icon={<ArrowLeftRight size={14}/>} label="环境变量" hasDropdown
                      dropdownContent={
                        <div className="p-3 space-y-3 w-64">
                          <div className="space-y-1">
                            <ToggleRow icon={<ArrowLeftRight size={13}/>} label="允许 Agent 自主修改环境变量" desc="开启后，Agent 可根据任务需要调整运行环境。" />
                          </div>
                          <div className="border-t border-gray-100 pt-2">
                            <p className="text-xs font-semibold text-gray-800 mb-0.5">自定义环境变量</p>
                            <p className="text-[11px] text-gray-500 mb-2">为当前对话配置 Agent 运行所需的环境变量。</p>
                            <button className="text-[11px] text-primary-600 border border-primary-200 rounded-lg px-2 py-1 hover:bg-primary-50 w-full">+ 添加</button>
                          </div>
                        </div>
                      }
                    />
                    <ToolBtn icon={<Mic size={14}/>} label="语音" />
                    <span className="text-[10px] text-gray-300 ml-2 select-none hidden sm:inline">Ctrl+M 语音 · Shift+Enter 换行</span>
                  </div>

                  {/* Send button */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ml-2"
                  >
                    <Send size={13} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Bottom hint */}
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Enter 发送 · @ 引用单号 · 需要批量工作流？
                <button className="text-primary-500 hover:underline ml-0.5">前往 Agent Workstation</button>
              </p>
            </div>

            {/* ── Tab bar (Kimi-style, primary active) ── */}
            <div className="w-full max-w-lg mb-1">
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide border-b border-gray-100">
                {COPILOT_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative shrink-0 px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      tab.id === activeTabId
                        ? 'text-primary-700'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${tab.color} shrink-0`} />
                      {tab.label}
                    </span>
                    {tab.id === activeTabId && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Chip list — with hover lift + business icon ── */}
              <div className="mt-2 space-y-1.5">
                {currentTab.chips.map((chip, idx) => {
                  const chipIcons: Record<string, string> = {
                    inbound:   ['📋','📋','📅'][idx] ?? '📋',
                    inventory: ['📦','🔍','📝'][idx] ?? '📦',
                    outbound:  ['🚚','📋','📊'][idx] ?? '🚚',
                  }
                  const icon = chipIcons[activeTabId] ?? '💬'
                  return (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white border border-gray-100 rounded-xl transition-all hover:border-primary-200 hover:bg-primary-50 hover:-translate-y-0.5 hover:shadow-sm group"
                    >
                      <span className="text-base shrink-0">{icon}</span>
                      <span className="text-sm text-gray-700 group-hover:text-primary-800 leading-snug flex-1">{chip}</span>
                      <span className="text-gray-300 group-hover:text-primary-400 text-sm transition-colors shrink-0">→</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Hints moved to above the input box */}
          </div>
        ) : (
          /* ──── CONVERSATION ──── */
          <div className="flex flex-col px-6 py-5 gap-4 max-w-2xl mx-auto w-full">

            {/* Compact agent header in conversation */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className={`w-7 h-7 bg-gradient-to-br ${agent.iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
                <MessageCircle size={13} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-600">{agent.name}</span>
              <button onClick={() => setMessages([])}
                className="ml-auto text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={11} /> 清除
              </button>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {msg.role === 'agent' && (
                  <div className={`w-7 h-7 bg-gradient-to-br ${agent.iconBg} rounded-lg flex items-center justify-center shadow-sm shrink-0 mt-0.5`}>
                    <MessageCircle size={12} className="text-white" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-gray-500">U</span>
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-tr-sm'
                    : 'bg-gray-50 border border-gray-200 rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.text}</p>
                  ) : (
                    <>
                      {/* Thinking label */}
                      {!msg.done && (!msg.lines || msg.lines.length === 0) && (
                        <p className="text-xs text-gray-500 mb-2">{msg.text}</p>
                      )}
                      {msg.lines && msg.lines.length > 0 && (
                        <AgentBubble lines={msg.lines} done={!!msg.done} />
                      )}
                      {(!msg.lines || msg.lines.length === 0) && !msg.done && (
                        <span className="inline-flex gap-0.5">
                          {[0,1,2].map(i => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── @ Module Select Dropdown ── */}
      {showModuleSelect && (
        <div className="absolute bottom-24 left-6 right-6 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          {!selectedModule ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">选择模块</p>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {CHAT_MODULES.map(mod => (
                  <button key={mod.id} onClick={() => handleSelectModule(mod.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-800">{mod.label}</span>
                    <span className="text-xs text-gray-400">{mod.count} items</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">{CHAT_MODULES.find(m => m.id === selectedModule)?.label}</p>
                <button onClick={() => setSelectedModule(null)} className="text-xs text-gray-500 hover:text-gray-700">← 返回</button>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {CHAT_MODULES.find(m => m.id === selectedModule)?.refs.map(ref => (
                  <button key={ref} onClick={() => handleSelectRef(ref)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-50 transition-colors">
                    {ref}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Input bar (conversation mode only) ── */}
      {inConversation && (
        <div className="px-6 pb-5 pt-3 shrink-0 border-t border-gray-100">
          <div className="max-w-xl mx-auto">
            <div className="border border-gray-200 rounded-2xl bg-white shadow-sm transition-all focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 focus-within:shadow-md overflow-hidden">
              <textarea
                value={input}
                onChange={e => { handleInputChange(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px' }}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={agent.placeholder}
                disabled={isTyping}
                rows={2}
                className="w-full px-4 pt-4 pb-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent resize-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: '60px', maxHeight: '160px' }}
              />
              <div className="flex items-center gap-1 px-3 pb-3 pt-1">
                <div className="flex items-center gap-0.5 flex-1">
                  <ToolBtn icon={<Paperclip size={14}/>} label="附件" />
                  <ToolBtn icon={<CheckCircle2 size={14}/>} label="替我审批" />
                  <ToolBtn icon={<ArrowLeftRight size={14}/>} label="环境变量" />
                  <ToolBtn icon={<Mic size={14}/>} label="语音" />
                  <span className="text-[10px] text-gray-300 ml-1 select-none hidden sm:inline">Ctrl+M 语音 · Shift+Enter 换行</span>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ml-2"
                >
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              Enter 发送 · @ 引用单号 · 需要批量工作流？
              <button className="text-primary-500 hover:underline ml-0.5">前往 Agent Workstation</button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ToolBtn & ToggleRow helpers ─────────────────────────────────────────────

function ToolBtn({ icon, label, hasDropdown, dropdownContent }: {
  icon: React.ReactNode; label: string; hasDropdown?: boolean; dropdownContent?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => hasDropdown && setOpen(v => !v)}
        title={label}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xs"
      >
        {icon}
        <span className="hidden md:inline text-[11px]">{label}</span>
      </button>
      {hasDropdown && open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] min-w-[240px]">
            {dropdownContent}
          </div>
        </>
      )}
    </div>
  )
}

function ToggleRow({ icon, label, desc, defaultOn }: {
  icon: React.ReactNode; label: string; desc: string; defaultOn?: boolean
}) {
  const [on, setOn] = useState(!!defaultOn)
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`w-9 h-5 rounded-full transition-colors shrink-0 mt-0.5 relative ${on ? 'bg-violet-500' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
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
