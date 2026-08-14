import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, ChevronDown, Home } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  children?: { label: string; path: string }[]
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'appointment',
    label: 'Appointment',
    icon: <Calendar size={16} />,
    children: [
      { label: 'Appointment', path: '/carrier/appointment' },
      { label: 'Make Appointment', path: '/carrier/appointment' },
      { label: 'Pending Carrier Appointment', path: '/carrier/appointment' },
    ],
  },
]

export default function CarrierSidebar({ role }: { role: 'Carrier' | 'Broker' }) {
  const [expanded, setExpanded] = useState<string[]>(['appointment'])
  const location = useLocation()
  const navigate = useNavigate()

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="w-56 bg-[#1a1a2e] h-screen fixed left-0 top-0 z-40 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700/50">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-widest">{role}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {/* Home */}
        <button
          onClick={() => navigate('/carrier/appointment')}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors mb-1 text-sm"
        >
          <Home size={15} /> Home
        </button>

        {NAV_ITEMS.map(item => (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                expanded.includes(item.id)
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2.5">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown size={13} className={`transition-transform ${expanded.includes(item.id) ? 'rotate-180' : ''}`} />
            </button>
            {expanded.includes(item.id) && item.children && (
              <div className="ml-4 pl-3 border-l border-gray-600/50 mb-1 space-y-0.5">
                {item.children.map(child => (
                  <button
                    key={child.label}
                    onClick={() => navigate(child.path)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      location.pathname === child.path && child.label === 'Appointment'
                        ? 'text-violet-300 bg-violet-900/30 font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
