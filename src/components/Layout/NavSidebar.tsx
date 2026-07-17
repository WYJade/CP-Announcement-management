import { useState } from 'react'
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
} from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'

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
  {
    id: 'support',
    label: 'Service & Support',
    icon: <Users2 size={16} />,
    expandable: true,
    children: [
      { id: 'support-requests', label: 'My Requests', path: '/support/requests' },
    ],
  },
  {
    id: 'purchase',
    label: 'Purchase Management',
    icon: <ShoppingCart size={16} />,
    expandable: true,
  },
  {
    id: 'sales',
    label: 'Sales Order',
    icon: <ClipboardList size={16} />,
    expandable: true,
    children: [
      { id: 'wholesale', label: 'Wholesale Orders', path: '/sales/wholesale' },
      { id: 'retail', label: 'Retail Orders', path: '/sales/retail' },
    ],
  },
  {
    id: 'work-order',
    label: 'Work Order',
    icon: <Wrench size={16} />,
    expandable: false,
  },
  {
    id: 'inbound',
    label: 'Inbound',
    icon: <PackageOpen size={16} />,
    expandable: true,
    children: [
      { id: 'inbound-inquiry', label: 'Inquiry', path: '/inbound/inquiry' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: <Boxes size={16} />,
    expandable: true,
    children: [
      { id: 'inventory-activity', label: 'Inventory Activity', path: '/inventory/activity' },
    ],
  },
  {
    id: 'outbound',
    label: 'Outbound',
    icon: <Truck size={16} />,
    expandable: true,
    children: [
      { id: 'outbound-inquiry', label: 'Inquiry', path: '/outbound/inquiry' },
      { id: 'freight-quote', label: 'Freight Quote', path: '/outbound/freight-quote' },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Puzzle size={16} />,
    expandable: true,
  },
  {
    id: 'returns',
    label: 'Returns',
    icon: <RotateCcw size={16} />,
    expandable: true,
  },
  {
    id: 'yard',
    label: 'Yard Management',
    icon: <ParkingCircle size={16} />,
    expandable: true,
  },
  {
    id: 'supply-chain',
    label: 'Supply Chain Mgmt',
    icon: <Link2 size={16} />,
    expandable: true,
    children: [
      { id: 'shipments-list', label: 'Shipments', path: '/shipping/shipments' },
      { id: 'tracking', label: 'Tracking', path: '/shipping/tracking' },
    ],
  },
  {
    id: 'international-new',
    label: 'International',
    icon: <Navigation size={16} />,
    expandable: true,
    children: [
      { id: 'shipment-tracking', label: 'Shipment Tracking', path: '/international-new/tracking' },
    ],
  },
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
    id: 'backup',
    label: 'Backup',
    icon: <Archive size={16} />,
    expandable: true,
    children: [
      { id: 'backup-tracking', label: 'End-to-End Tracking', path: '/backup/tracking' },
    ],
  },
  {
    id: 'ai-agents',
    label: 'AI Agents',
    icon: <Bot size={16} />,
    expandable: true,
    children: [
      { id: 'agent-chat', label: 'Chat', path: '/agents?nav=chat' },
      { id: 'agent-workstation', label: 'Agent Workstation', path: '/agents?nav=workstation' },
      { id: 'agent-customize', label: 'Customize', path: '/agents?nav=customize' },
      { id: 'agent-marketplace', label: 'Marketplace', path: '/agents?nav=marketplace' },
      { id: 'agent-recents-header', label: '── RECENTS ──' },
      { id: 'agent-recents-bash', label: '查询下SH20260716 对应的出入库记录', path: '/agents?nav=chat' },
    ],
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
  },
]

function NavSidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboards', 'support'])
  const location = useLocation()
  const navigate = useNavigate()
  const { getUnreadCount } = useCollaboration()
  const supportUnread = getUnreadCount()

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

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="py-4 px-3">
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

        {/* Workspace Section */}
        <p className="text-[10px] font-semibold text-gray-400 uppercase px-3 mb-1">Workspace</p>
        <nav className="space-y-0.5 mb-4">
          {renderMenuSection(menuItems)}
        </nav>

        {/* Agents Section - standalone link */}
        <div className="border-t border-gray-100 pt-3 mb-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase px-3 mb-1">Agents</p>
          <nav className="space-y-0.5">
            <a href="https://ai-native.item.pub/" target="_blank" rel="noopener noreferrer"
              className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-gray-700">
              <span className="mr-3 text-gray-500"><Bot size={16} /></span>
              <span className="flex-1 text-left font-medium">Agents</span>
            </a>
          </nav>
        </div>

        {/* Favorites Section */}
        <div className="border-t border-gray-100 pt-3 mb-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase px-3 mb-1">Favorites</p>
          <nav className="space-y-0.5">
            {renderMenuSection(favoritesItems)}
          </nav>
        </div>

        {/* System Section */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase px-3 mb-1">System</p>
          <nav className="space-y-0.5">
            {renderMenuSection(systemItems)}
          </nav>
        </div>

        {/* Hidden/legacy items */}
        <div className="border-t border-gray-100 pt-3 mt-4">
          <nav className="space-y-0.5">
            {renderMenuSection(hiddenItems)}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavSidebar
