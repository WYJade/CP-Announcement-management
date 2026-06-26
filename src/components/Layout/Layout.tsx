import { Outlet, useLocation } from 'react-router-dom'
import IconSidebar from './IconSidebar'
import NavSidebar from './NavSidebar'
import Header from './Header'
import AnnouncementBanner from '../common/AnnouncementBanner'

function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <IconSidebar />
      <NavSidebar />
      <Header />
      <main className="ml-72 mt-14 p-4 overflow-auto">
        <AnnouncementBanner />
        <div className="mt-3">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
