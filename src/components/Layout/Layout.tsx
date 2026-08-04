import { Outlet, useLocation } from 'react-router-dom'
import NavSidebar from './NavSidebar'
import Header from './Header'
import AnnouncementBanner from '../common/AnnouncementBanner'
import OnboardingTour from '../common/OnboardingTour'

function Layout() {
  const location = useLocation()
  const isInsightsPage = location.pathname === '/insights'
  const isHomePage = location.pathname === '/' || location.pathname === '/home'

  return (
    <div className="min-h-screen bg-gray-50">
      <NavSidebar />
      <Header />
      {isInsightsPage ? (
        <main className="ml-56 mt-14 overflow-hidden h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      ) : (
        <main className="ml-56 mt-14 p-4 overflow-auto">
          <AnnouncementBanner />
          <div className="mt-3">
            <Outlet />
          </div>
        </main>
      )}
      {isHomePage && <OnboardingTour />}
    </div>
  )
}

export default Layout
