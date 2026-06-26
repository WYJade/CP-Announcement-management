import { Outlet, useLocation } from 'react-router-dom'
import IconSidebar from './IconSidebar'
import NavSidebar from './NavSidebar'
import Header from './Header'
import AnnouncementBanner from '../common/AnnouncementBanner'
import MessagePanel from '../MessageCenter/MessagePanel'
import MessageToast from '../MessageCenter/MessageToast'
import NotificationPopup from '../common/NotificationPopup'

const HIDE_BANNER_PATHS = ['/dashboard/kpi']

function Layout() {
  const location = useLocation()
  const showBanner = !HIDE_BANNER_PATHS.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      <IconSidebar />
      <NavSidebar />
      <Header />
      <main className="ml-72 mt-14 p-4 overflow-auto">
        {showBanner && <AnnouncementBanner />}
        <Outlet />
      </main>

      {/* Message Center Panel (slide-in from right) */}
      <MessagePanel />

      {/* Toast notification (bottom-right) */}
      <MessageToast />

      {/* Notification Popup (bottom-right, delayed) */}
      <NotificationPopup />
    </div>
  )
}

export default Layout
