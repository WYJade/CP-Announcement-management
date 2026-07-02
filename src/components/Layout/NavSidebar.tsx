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
    id: 'international',
    label: 'International',
    icon: <Navigation size={16} />,
    expandable: true,
    children: [
      { id: 'customs-entries', label: 'Customs Entries', path: '/international/customs' },
      { id: 'intl-shipments', label: 'Shipments', path: '/international/shipments' },
      { id: 'containers', label: 'Containers', path: '/international/containers' },
      { id: 'drayage-loads', label: 'Drayage Loads', path: '/international/drayage' },
      { id: 'intl-tracking2', label: 'End to End Tracking', path: '/international/tracking2' },
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
  {
    id: 'warehouse-map',
    label: 'Warehouse Map',
    icon: <Map size={16} />,
    expandable: true,
  },
  {
    id: 'system',
    label: 'System Management',
    icon: <Settings size={16} />,
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

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen fixed left-16 top-0 z-40 overflow-y-auto">
      <div className="py-4 px-3">
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
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
                  ))}
                </div>
              )}
            </div>
          )})}
        </nav>
      </div>
    </div>
  )
}

export default NavSidebar
