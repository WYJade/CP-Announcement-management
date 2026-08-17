import { Outlet, useLocation } from 'react-router-dom'
import NavSidebar from './NavSidebar'
import Header from './Header'
import CarrierSidebar from './CarrierSidebar'
import AnnouncementBanner from '../common/AnnouncementBanner'
import OnboardingTour from '../common/OnboardingTour'
import FloatingAssistant from '../common/FloatingAssistant'
import { FavoritesProvider } from '../../context/FavoritesContext'
import { RoleProvider, useRole } from '../../context/RoleContext'

function LayoutInner() {
  const location = useLocation()
  const { role } = useRole()
  const isInsightsPage = location.pathname === '/insights'
  const isHomePage = location.pathname === '/' || location.pathname === '/home'
  const isCarrierRole = role === 'Carrier' || role === 'Broker'

  if (isCarrierRole) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CarrierSidebar role={role as 'Carrier' | 'Broker'} />
        <Header />
        <main className="ml-56 mt-14 overflow-auto min-h-screen">
          <Outlet />
        </main>
        <FloatingAssistant />
      </div>
    )
  }

  // Insights — no sidebar, full width
  if (isInsightsPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mt-14 overflow-hidden h-[calc(100vh-56px)]">
          <Outlet />
        </main>
        <FloatingAssistant />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavSidebar />
      <Header />
      <main className="ml-56 mt-14 p-4 overflow-auto">
        <AnnouncementBanner />
        <div className="mt-3">
          <Outlet />
        </div>
      </main>
      {isHomePage && <OnboardingTour />}
      <FloatingAssistant />
    </div>
  )
}

function Layout() {
  return (
    <RoleProvider>
      <FavoritesProvider>
        <LayoutInner />
      </FavoritesProvider>
    </RoleProvider>
  )}

export default Layout
