import { Outlet, useLocation } from 'react-router-dom'
import IconSidebar from './IconSidebar'
import NavSidebar from './NavSidebar'
import Header from './Header'
import AnnouncementBanner from '../common/AnnouncementBanner'

function Layout() {
  const location = useLocation()
  const isAgentsPage = location.pathname === '/agents'

  return (
    <div className="min-h-screen bg-gray-50">
      <IconSidebar />
      {!isAgentsPage && <NavSidebar />}
      <Header />
      <main className={`${isAgentsPage ? 'ml-16' : 'ml-72'} mt-14 p-4 overflow-auto`}>
        {!isAgentsPage && <AnnouncementBanner />}
        <div className={isAgentsPage ? '' : 'mt-3'}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
