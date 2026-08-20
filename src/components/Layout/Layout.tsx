import { Outlet, useLocation } from 'react-router-dom'
import NavSidebar from './NavSidebar'
import Header from './Header'
import CarrierSidebar from './CarrierSidebar'
import AnnouncementBanner from '../common/AnnouncementBanner'
import OnboardingTour from '../common/OnboardingTour'
import { FavoritesProvider } from '../../context/FavoritesContext'
import { RoleProvider, useRole } from '../../context/RoleContext'
import { AssistantProvider, useAssistant } from '../../context/AssistantContext'

const ASSISTANT_WIDTH = 360

function LayoutInner() {
  const location = useLocation()
  const { role } = useRole()
  const { assistantOpen } = useAssistant()
  const isInsightsPage = location.pathname === '/insights'
  const isHomePage = location.pathname === '/' || location.pathname === '/home'
  const isCarrierRole = role === 'Carrier' || role === 'Broker'

  const mainRight = assistantOpen ? `${ASSISTANT_WIDTH}px` : '0'

  if (isCarrierRole) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CarrierSidebar role={role as 'Carrier' | 'Broker'} />
        <Header />
        <main
          className="ml-56 mt-14 overflow-auto min-h-screen transition-all duration-200"
          style={{ marginRight: mainRight }}
        >
          <Outlet />
        </main>
      </div>
    )
  }

  // Insights — no sidebar, full width
  if (isInsightsPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main
          className="mt-14 overflow-hidden h-[calc(100vh-56px)] transition-all duration-200"
          style={{ marginRight: mainRight }}
        >
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavSidebar />
      <Header />
      <main
        className="ml-56 mt-14 p-4 overflow-auto transition-all duration-200"
        style={{ marginRight: mainRight }}
      >
        <AnnouncementBanner />
        <div className="mt-3">
          <Outlet />
        </div>
      </main>
      {isHomePage && <OnboardingTour />}
    </div>
  )
}

function Layout() {
  return (
    <RoleProvider>
      <FavoritesProvider>
        <AssistantProvider>
          <LayoutInner />
        </AssistantProvider>
      </FavoritesProvider>
    </RoleProvider>
  )
}

export default Layout
