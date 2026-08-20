import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Wrench,
  PackageOpen,
  Boxes,
  Truck,
  Puzzle,
  RotateCcw,
  ParkingCircle,
  Link2,
  DollarSign,
  Map,
  Settings,
  UserCircle,
  ChevronDown,
  ChevronRight,
  Users2,
  Navigation,
  Archive,
  Bot,
  MessageSquare,
  Zap,
  Store,
  Heart,
  Clock,
  Search,
  ArrowRight,
  BarChart2 as BarChart2Icon,
  Ship,
  TrendingUp,
  RefreshCw,
  Building,
} from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'
import { useFavorites } from '../../context/FavoritesContext'

interface ChildItem {
  id: string
  label: string
  path?: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  expandable: boolean
  children?: ChildItem[]
}

const menuItems: MenuItem[] = [
  // ── Dashboard ──────────────────────────────────────────────────────────────
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: <LayoutDashboard size={16} />,
    expandable: true,
    children: [
      { id: 'otif', label: 'OTIF', path: '/dashboard/otif' },
      { id: 'kpi', label: 'KPI', path: '/dashboard/kpi' },
      { id: 'ticket-insights', label: 'Ticket Insights' },
    ],
  },

  // ── Order & Planning ───────────────────────────────────────────────────────
  {
    id: 'purchase',
    label: 'Purchase Management',
    icon: <ShoppingCart size={16} />,
    expandable: true,
    children: [
      { id: 'purchase-request', label: 'Purchase Request' },
      { id: 'purchase-order', label: 'Purchase Order' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales Order',
    icon: <ClipboardList size={16} />,
    expandable: true,
    children: [
      { id: 'wholesale', label: 'Wholesale Orders', path: '/sales/wholesale' },
      { id: 'retail', label: 'Retail Orders', path: '/sales/retail' },
      { id: 'sales-order', label: 'Sales Order' },
      { id: 'order-routing', label: 'Order Routing' },
    ],
  },
  {
    id: 'work-order',
    label: 'Work Order',
    icon: <Wrench size={16} />,
    expandable: false,
  },
  // ── Inbound & Yard ─────────────────────────────────────────────────────────
  {
    id: 'inbound',
    label: 'Inbound',
    icon: <PackageOpen size={16} />,
    expandable: true,
    children: [
      { id: 'inbound-inquiry', label: 'Inquiry', path: '/inbound/inquiry' },
      { id: 'inbound-schedule', label: 'Schedule Summary' },
      { id: 'inbound-received', label: 'Received Summary' },
      { id: 'receipt-entry', label: 'Receipt Entry' },
      { id: 'put-away', label: 'Put Away Report' },
      { id: 'make-appointment', label: 'Make Appointment' },
      { id: 'appointment-list', label: 'Appointment List', path: '/inbound/appointment-list' },
    ],
  },
  // ── Inventory ──────────────────────────────────────────────────────────────
  {
    id: 'inventory',
    label: 'Inventory',
    icon: <Boxes size={16} />,
    expandable: true,
    children: [
      { id: 'sn-lookup', label: 'SN Look Up' },
      { id: 'inventory-activity', label: 'Inventory Activity', path: '/inventory/activity' },
      { id: 'inventory-adj', label: 'Inventory Adjustment' },
      { id: 'inventory-status', label: 'Inventory Status' },
      { id: 'item-master', label: 'Item Master' },
      { id: 'current-onhand', label: 'Current Onhand Inventory' },
      { id: 'aging-report', label: 'Historical Inventory Aging Report' },
      { id: 'wh-projects', label: 'Warehouse Projects' },
    ],
  },

  // ── Outbound ───────────────────────────────────────────────────────────────
  {
    id: 'outbound',
    label: 'Outbound',
    icon: <Truck size={16} />,
    expandable: true,
    children: [
      { id: 'outbound-inquiry', label: 'Inquiry', path: '/outbound/inquiry' },
      { id: 'outbound-schedule', label: 'Schedule Summary' },
      { id: 'shipped-summary', label: 'Shipped Summary' },
      { id: 'order-carrier', label: 'Order Carrier Update' },
      { id: 'order-entry', label: 'Order Entry' },
      { id: 'small-parcel', label: 'Small Parcel Tracking Status' },
    ],
  },

  // ── Shipping (merged: Domestic + International + Freight Quote) ───────────
  {
    id: 'supply-chain',
    label: 'Shipping',
    icon: <Ship size={16} />,
    expandable: true,
    children: [
      { id: 'tracking', label: 'Domestic Tracking', path: '/shipping/tracking' },
      { id: 'shipment-tracking', label: 'International Tracking', path: '/international-new/tracking' },
      { id: 'freight-quote', label: 'Freight Quote', path: '/outbound/freight-quote' },
    ],
  },

  // ── Automation ─────────────────────────────────────────────────────────────
  {
    id: 'automation',
    label: 'Automation',
    icon: <Zap size={16} />,
    expandable: true,
    children: [
      { id: 'automated-order-entry', label: 'Automated Order Entry' },
    ],
  },

  // ── Yard Management (after Automation, before Returns) ────────────────────
  {
    id: 'yard',
    label: 'Yard Management',
    icon: <Building size={16} />,
    expandable: true,
    children: [
      { id: 'equip-history', label: 'Equipment History Report' },
      { id: 'equip-report', label: 'Equipment Report' },
      { id: 'yard-status', label: 'Yard Status Report' },
      { id: 'yard-check', label: 'Yard Check Report' },
      { id: 'location-status', label: 'Location Status' },
      { id: 'equip-activity', label: 'Equipment Activity' },
      { id: 'equip-sla', label: 'Equipment SLA Report' },
      { id: 'dock-suggestion', label: 'Dock Suggestion Command' },
      { id: 'appt-report', label: 'Appointment Report' },
      { id: 'yard-traffic', label: 'Yard Traffic Report' },
      { id: 'driver-disc', label: 'Driver Discrepancy Report' },
    ],
  },

  // ── Returns ────────────────────────────────────────────────────────────────
  {
    id: 'returns',
    label: 'Returns',
    icon: <RotateCcw size={16} />,
    expandable: true,
    children: [
      { id: 'rma', label: 'RMA' },
      { id: 'traveler-id', label: 'Traveler ID' },
      { id: 'return-report', label: 'Return Report' },
      { id: 'restock', label: 'Restock Report' },
      { id: 'adjustment', label: 'Adjustment Report' },
      { id: 'scrap', label: 'Scrap Report' },
      { id: 'service-claim', label: 'Service Claim Report' },
    ],
  },

  // ── Finance ────────────────────────────────────────────────────────────────
  {
    id: 'finance',
    label: 'Finance',
    icon: <DollarSign size={16} />,
    expandable: true,
    children: [
      { id: 'invoice', label: 'Invoice', path: '/finance/invoices' },
      { id: 'card-balance', label: 'Card and Balance' },
      { id: 'history', label: 'History' },
      { id: 'cost-calculator', label: 'Cost Calculator' },
      { id: 'claim', label: 'Claim' },
    ],
  },

  // ── Retail Fulfillment (after Finance, before Integration)
  {
    id: 'performance',
    label: 'Retail Operations',
    icon: <TrendingUp size={16} />,
    expandable: true,
    children: [
      { id: 'walmart-shipments', label: 'Walmart Shipments' },
      { id: 'target-shipments', label: 'Target Shipments' },
      { id: 'damaged-box', label: 'Damaged Box Detection' },
      { id: 'recovery-portal', label: 'Recovery Portal' },
      { id: 'deductions', label: 'Deductions' },
    ],
  },

  // ── Integration ────────────────────────────────────────────────────────────
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Puzzle size={16} />,
    expandable: true,
    children: [
      { id: 'store-integrations', label: 'Store Integrations' },
      { id: 'carrier-integrations', label: 'Carrier Integrations' },
    ],
  },
  {
    id: 'webmethods',
    label: 'WebMethods',
    icon: <Link2 size={16} />,
    expandable: true,
    children: [
      { id: 'partners', label: 'Partners' },
      { id: 'transactions', label: 'Transactions' },
    ],
  },
]

const favoritesItems: MenuItem[] = [
  {
    id: 'favorites',
    label: 'Favorites',
    icon: <Heart size={16} />,
    expandable: true,
    children: [
      { id: 'fav-chat', label: 'Chat', path: '/agents?nav=chat' },
      { id: 'fav-scrap-report', label: 'Scrap Report' },
      { id: 'fav-service-claim', label: 'Service Claim Report' },
      { id: 'fav-freight-quote', label: 'Freight Quote', path: '/outbound/freight-quote' },
      { id: 'fav-small-parcel', label: 'Small Parcel Tracking S...' },
      { id: 'fav-order-carrier', label: 'Order Carrier Update' },
    ],
  },
]

const systemItems: MenuItem[] = [
  {
    id: 'system',
    label: 'System Management',
    icon: <Settings size={16} />,
    expandable: true,
    children: [
      { id: 'sys-user', label: 'User Management' },
      { id: 'sys-role', label: 'Role Management' },
      { id: 'sys-accounts', label: 'Account Management', path: '/system/accounts' },
      { id: 'sys-address', label: 'Address Book' },
      { id: 'sys-settings', label: 'Settings' },
    ],
  },
]

const hiddenItems: MenuItem[] = [
  {
    id: 'warehouse-map',
    label: 'Warehouse Map',
    icon: <Map size={16} />,
    expandable: true,
  },
  {
    id: 'profile',
    label: 'User Profile',
    icon: <UserCircle size={16} />,
    expandable: false,
  },
  {
    id: 'international-d',
    label: 'International-D',
    icon: <Navigation size={16} />,
    expandable: true,
    children: [
      { id: 'intl-d-containers', label: 'Containers', path: '/international/containers' },
      { id: 'intl-d-shipments', label: 'Shipments', path: '/international/shipments' },
      { id: 'intl-d-customs', label: 'Customs Entries', path: '/international/customs' },
      { id: 'intl-d-drayage', label: 'Drayage Loads', path: '/international/drayage' },
      { id: 'intl-d-tracking', label: 'End to End Tracking', path: '/international/tracking2' },
    ],
  },
]

// ─── Global Search Index ─────────────────────────────────────────────────────
interface SearchEntry {
  label: string
  parent: string
  path: string
  keywords: string[]
}

const SEARCH_INDEX: SearchEntry[] = [
  // Dashboards
  { label: 'OTIF Dashboard', parent: 'Dashboards', path: '/dashboard/otif', keywords: ['otif', 'on time in full', 'dashboard'] },
  { label: 'KPI Dashboard', parent: 'Dashboards', path: '/dashboard/kpi', keywords: ['kpi', 'key performance', 'dashboard'] },
  { label: 'Ticket Insights', parent: 'Dashboards', path: '/dashboard/otif', keywords: ['ticket', 'insights', 'dashboard'] },
  { label: 'FinanceAgents', parent: 'Dashboards', path: '/dashboard/finance-agents', keywords: ['finance', 'agents', 'dashboard'] },
  // Service & Support
  { label: 'My Requests', parent: 'Service & Support', path: '/support/requests', keywords: ['requests', 'support', 'service', 'my requests'] },
  // Sales Order
  { label: 'Wholesale Orders', parent: 'Sales Order', path: '/sales/wholesale', keywords: ['wholesale', 'sales', 'order'] },
  { label: 'Retail Orders', parent: 'Sales Order', path: '/sales/retail', keywords: ['retail', 'sales', 'order'] },
  // Inbound
  { label: 'Inbound Inquiry', parent: 'Inbound', path: '/inbound/inquiry', keywords: ['inbound', 'inquiry', 'receipt', 'receiving'] },
  { label: 'Inbound Receipt Entry', parent: 'Inbound', path: '/inbound/inquiry', keywords: ['inbound', 'receipt', 'entry', 'receiving'] },
  // Inventory
  { label: 'Inventory Activity', parent: 'Inventory', path: '/inventory/activity', keywords: ['inventory', 'activity', 'stock'] },
  // Outbound
  { label: 'Outbound Inquiry', parent: 'Outbound', path: '/outbound/inquiry', keywords: ['outbound', 'inquiry'] },
  { label: 'Freight Quote', parent: 'Outbound', path: '/outbound/freight-quote', keywords: ['freight', 'quote', 'outbound'] },
  // Supply Chain
  { label: 'Shipments', parent: 'Supply Chain Mgmt', path: '/shipping/shipments', keywords: ['shipments', 'supply chain'] },
  { label: 'Tracking', parent: 'Supply Chain Mgmt', path: '/shipping/tracking', keywords: ['tracking', 'supply chain'] },
  // International
  { label: 'Shipment Tracking', parent: 'International', path: '/international-new/tracking', keywords: ['international', 'shipment', 'tracking', 'container'] },
  // Finance
  { label: 'Invoice', parent: 'Finance', path: '/finance/invoices', keywords: ['invoice', 'finance', 'billing', 'payment'] },
  { label: 'Card and Balance', parent: 'Finance', path: '/finance/invoices', keywords: ['card', 'balance', 'finance'] },
  { label: 'Cost Calculator', parent: 'Finance', path: '/finance/invoices', keywords: ['cost', 'calculator', 'finance'] },
  { label: 'Claim', parent: 'Finance', path: '/finance/invoices', keywords: ['claim', 'finance'] },
  // Backup
  { label: 'End-to-End Tracking', parent: 'Backup', path: '/backup/tracking', keywords: ['end to end', 'tracking', 'backup'] },
  // AI Agents
  { label: 'Chat', parent: 'AI Agents', path: '/agents?nav=chat', keywords: ['chat', 'ai', 'agents', 'assistant'] },
  { label: 'Agent Workstation', parent: 'AI Agents', path: '/agents?nav=workstation', keywords: ['workstation', 'agents', 'ai'] },
  { label: 'Marketplace', parent: 'AI Agents', path: '/agents?nav=marketplace', keywords: ['marketplace', 'agents'] },
  // System
  { label: 'User Management', parent: 'System', path: '/', keywords: ['user', 'management', 'system', 'admin'] },
  { label: 'Role Management', parent: 'System', path: '/', keywords: ['role', 'management', 'system', 'permission'] },
  { label: 'Address Book', parent: 'System', path: '/', keywords: ['address', 'book', 'system'] },
  { label: 'Settings', parent: 'System', path: '/', keywords: ['settings', 'system', 'config'] },
]

// ─── Global Search Component ──────────────────────────────────────────────────
function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length === 0 ? [] : SEARCH_INDEX.filter(e => {
    const q = query.toLowerCase()
    return (
      e.label.toLowerCase().includes(q) ||
      e.parent.toLowerCase().includes(q) ||
      e.keywords.some(k => k.includes(q))
    )
  }).slice(0, 8)

  useEffect(() => { setHighlighted(0) }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter' && results[highlighted]) { handleSelect(results[highlighted]) }
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  const handleSelect = (entry: SearchEntry) => {
    navigate(entry.path)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative px-3 mb-3">
      <div className="relative">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search menu or function..."
          className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all placeholder-gray-400"
        />
      </div>
      {open && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-3 right-3 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {results.map((entry, i) => (
            <button
              key={entry.label + entry.parent}
              onMouseDown={() => handleSelect(entry)}
              onMouseEnter={() => setHighlighted(i)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${i === highlighted ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{entry.label}</p>
                <p className="text-[10px] text-gray-400 truncate">{entry.parent}</p>
              </div>
              <ArrowRight size={10} className="text-gray-300 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <div ref={dropdownRef} className="absolute left-3 right-3 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-3 py-3 text-xs text-gray-400 text-center">
          No results for "{query}"
        </div>
      )}
    </div>
  )
}

function NavSidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboards', 'support'])
  // aiMode: when true, sidebar shows only AI Agents view
  const [aiMode, setAiMode] = useState(false)
  const [favShowAll, setFavShowAll] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { getUnreadCount } = useCollaboration()
  const supportUnread = getUnreadCount()
  const { favorites } = useFavorites()

  // Enter AI mode when navigating to /agents
  useEffect(() => {
    if (location.pathname === '/agents') {
      setAiMode(true)
    }
  }, [location.pathname])

  // Recently used pages — track navigation history
  const [recentPages, setRecentPages] = useState<{ label: string; path: string }[]>([
    { label: 'Shipment Tracking', path: '/international-new/tracking' },
    { label: 'Inbound Inquiry', path: '/inbound/inquiry' },
    { label: 'Invoice', path: '/finance/invoices' },
    { label: 'Inventory Activity', path: '/inventory/activity' },
  ])

  // Path to label lookup
  const pathLabelMap: Record<string, string> = SEARCH_INDEX.reduce((acc, e) => {
    if (e.path && !acc[e.path]) acc[e.path] = e.label
    return acc
  }, {} as Record<string, string>)

  useEffect(() => {
    const path = location.pathname
    const label = pathLabelMap[path]
    if (!label || path === '/') return
    setRecentPages(prev => {
      const filtered = prev.filter(p => p.path !== path)
      return [{ label, path }, ...filtered].slice(0, 5)
    })
  }, [location.pathname])

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isChildActive = (child: ChildItem) => {
    if (!child.path) return false
    return location.pathname === child.path || (child.path === '/dashboard/otif' && location.pathname === '/')
  }

  const renderMenuSection = (items: MenuItem[]) => items.map((item) => {
    const isCollaboration = item.id === 'support'
    const isCollabActive = location.pathname.startsWith('/support')

    return (
      <div key={item.id}>
        <button
          onClick={() => item.expandable ? toggleExpand(item.id) : item.id === 'support' && navigate('/support')}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors group ${
            isCollaboration && isCollabActive
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'text-gray-700'
          }`}
        >
          <span className={`mr-3 ${isCollaboration && isCollabActive ? 'text-primary-600' : 'text-gray-500'}`}>
            {item.icon}
          </span>
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {isCollaboration && supportUnread > 0 && (
            <span className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 mr-1">
              {supportUnread > 9 ? '9+' : supportUnread}
            </span>
          )}
          {item.expandable && (
            <span className="text-gray-400">
              {expandedItems.includes(item.id) ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </span>
          )}
        </button>
        {item.expandable && expandedItems.includes(item.id) && item.children && (
          <div className="ml-8 mt-0.5 space-y-0.5">
            {item.children.map((child) => (
              child.id.includes('recents-header') ? (
                <p key={child.id} className="text-[9px] font-semibold text-gray-400 uppercase px-3 pt-2 pb-0.5 flex items-center gap-1">
                  <Clock size={9} /> RECENTS
                </p>
              ) : (
              <button
                key={child.id}
                onClick={() => child.path && navigate(child.path)}
                className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isChildActive(child)
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {child.label}
              </button>
              )
            ))}
          </div>
        )}
      </div>
    )
  })

  const agentSubItems = [
    { label: 'Chat', path: '/agents?nav=chat' },
    { label: 'Agent Workstation', path: '/agents?nav=workstation' },
    { label: 'Customize', path: '/agents?nav=customize' },
    { label: 'Marketplace', path: '/agents?nav=marketplace' },
  ]

  // ── AI Agents mode sidebar ──────────────────────────────────────────────────
  if (aiMode) {
    return (
      <div className="w-56 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 mb-4">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-800">Client Portal</span>
          </div>

          {/* AI Agents header block */}
          <div className="px-1 mb-3">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-violet-50 border border-violet-200">
              <div className="w-8 h-8 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-bold text-violet-700 leading-snug">AI Agents</p>
                <p className="text-[9px] text-violet-400 leading-tight">Your AI agent</p>
              </div>
            </div>
          </div>

          {/* Sub-menu items */}
          <nav className="space-y-0.5 mb-4">
            {agentSubItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                  location.pathname + location.search === item.path
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Recents */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[9px] font-semibold text-gray-400 uppercase px-3 mb-1.5 flex items-center gap-1">
              <Clock size={9} /> RECENTS
            </p>
            <button
              onClick={() => navigate('/agents?nav=chat')}
              className="w-full text-left px-4 py-1.5 text-xs text-gray-500 hover:text-violet-700 hover:bg-violet-50 rounded-md transition-colors truncate"
            >
              查询下SH20260716 对应的出入库记录
            </button>
          </div>
        </div>

        {/* Back to full nav */}
        <div className="px-3 pb-4 pt-2 bg-white shrink-0 border-t border-gray-100">
          <button
            onClick={() => { setAiMode(false); navigate('/') }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ChevronRight size={14} className="rotate-180 shrink-0" />
            <span>Back to Navigation</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Normal mode sidebar ─────────────────────────────────────────────────────
  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-4">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-800">Client Portal</span>
        </div>

        {/* Global Search */}
        <div data-tour="global-search">
          <GlobalSearch />
        </div>

        {/* Favorites Section — above Workspace, always visible */}
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-gray-400 px-3 mb-1">Favorites</p>
          <nav className="space-y-0.5">
            {favorites.length > 0 ? (
              <>
                {(favShowAll ? favorites : favorites.slice(0, 10)).map(fav => (
                  <button
                    key={fav.path}
                    onClick={() => navigate(fav.path)}
                    className={`flex items-center w-full px-3 py-1.5 text-xs rounded-md transition-colors ${
                      location.pathname === fav.path
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2.5 shrink-0" />
                    <span className="truncate">{fav.label}</span>
                  </button>
                ))}
                {favorites.length > 10 && (
                  <button
                    onClick={() => setFavShowAll(v => !v)}
                    className="flex items-center w-full px-3 py-1.5 text-xs text-primary-500 hover:text-primary-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <ChevronDown size={12} className={`mr-1.5 transition-transform ${favShowAll ? 'rotate-180' : ''}`} />
                    {favShowAll ? '收起' : `更多 (${favorites.length - 10})`}
                  </button>
                )}
              </>
            ) : (
              <p className="text-[10px] text-gray-400 px-3 py-1.5 italic">
                Click ♡ in the header to add favorites
              </p>
            )}
          </nav>
        </div>

        {/* Workspace Section */}
        <div className="border-t border-gray-100 pt-3">
        <p className="text-[10px] font-semibold text-gray-400 px-3 mb-1">Workspace</p>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(1,4))}
        </nav>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(4,5))}
        </nav>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(5,6))}
        </nav>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(6,7))}
        </nav>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(7,11))}
        </nav>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(11,13))}
        </nav>
        <div className="border-t border-gray-100 mx-3 mb-2 mt-1" />
        <p className="text-[10px] font-semibold text-gray-400 px-3 mb-1">Integration</p>
        <nav className="space-y-0.5 mb-3">
          {renderMenuSection(menuItems.slice(13))}
        </nav>
        </div>

        {/* System Section */}
        <div className="border-t border-gray-100 pt-3 mb-4">
          <p className="text-[10px] font-semibold text-gray-400 px-3 mb-1">System</p>
          <nav className="space-y-0.5">
            {renderMenuSection(systemItems)}
          </nav>
        </div>

        {/* Hidden/legacy items */}
        <div className="hidden">
          <nav className="space-y-0.5">
            {renderMenuSection(hiddenItems)}
          </nav>
        </div>
      </div>

      {/* ── Sticky AI Agents bottom entry ── */}
      <div className="px-3 pb-3 pt-1.5 bg-white shrink-0 border-t border-gray-100">
        <button
          onClick={() => {
            setAiMode(true)
            navigate('/agents?nav=chat')
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-all"
        >
          <div className="w-8 h-8 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-bold text-violet-700 leading-snug">AI Agents</p>
            <p className="text-[9px] text-violet-400 leading-tight">Your AI agent</p>
          </div>
          <ChevronRight size={13} className="text-violet-400 shrink-0" />
        </button>
      </div>
    </div>
  )
}

export default NavSidebar
