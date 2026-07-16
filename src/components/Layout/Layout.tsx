import { Outlet, useLocation } from 'react-router-dom'
import NavSidebar from './NavSidebar'
import Header from './Header'
import AnnouncementBanner from '../common/AnnouncementBanner'

function Layout() {
  const location = useLocation()
  const isAgentsPage = location.pathname === '/agents'

  return (
    <div className="min-h-screen bg-gray-50">
      <NavSidebar />
      <Header />
      <main className={`ml-56 mt-14 p-4 overflow-auto`}>
        <AnnouncementBanner />
        <div className="mt-3">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
