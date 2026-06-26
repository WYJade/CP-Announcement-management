import { Home, Bot, Heart, User, Users2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCollaboration } from '../../context/CollaborationContext'

function IconSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getUnreadCount } = useCollaboration()
  const collabUnread = getUnreadCount()

  const isCollabActive = location.pathname.startsWith('/collaboration')
  const isHomeActive = !isCollabActive && (location.pathname === '/' || location.pathname.startsWith('/dashboard'))

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Nav Icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <IconButton
          icon={<Home size={18} />}
          label="Home"
          isActive={isHomeActive}
          onClick={() => navigate('/')}
        />
        {/* Collaboration Center — above Agents */}
        <div className="relative">
          <IconButton
            icon={<Users2 size={18} />}
            label="Collab"
            isActive={isCollabActive}
            onClick={() => navigate('/collaboration')}
          />
          {collabUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none pointer-events-none">
              {collabUnread > 9 ? '9+' : collabUnread}
            </span>
          )}
        </div>
        <IconButton icon={<Bot size={18} />} label="Agents" onClick={() => navigate('/agents')} />
        <IconButton icon={<Heart size={18} />} label="Favorites" />
      </nav>

      {/* User Avatar */}
      <div className="mt-auto">
        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors">
          <User size={18} className="text-primary-600" />
        </div>
      </div>
    </div>
  )
}

function IconButton({
  icon, label, isActive = false, onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg w-14 transition-colors ${
        isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

export default IconSidebar
