import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { BannerConfig } from '../types/banner'

interface BannerContextValue {
  banners: BannerConfig[]
  dismissedIds: Set<string>
  acknowledgedIds: Set<string>
  addBanner: (banner: BannerConfig) => void
  removeBanner: (id: string) => void
  dismissBanner: (id: string) => void
  acknowledgeBanner: (id: string) => void
  getVisibleBanners: (page?: string) => BannerConfig[]
}

const BannerContext = createContext<BannerContextValue | null>(null)

/** Sample banners showcasing different use cases */
const defaultBanners: BannerConfig[] = [
  {
    id: 'billing-overdue-001',
    tier: 'warning',
    category: 'billing-account',
    title: 'Payment Overdue Notice',
    message:
      'Your account has an outstanding balance that requires immediate attention to avoid disruptions to your regular business operations.',
    highlights: [
      { label: 'Invoice#', value: '19043770' },
      { label: 'Amount Due', value: '$1,250.00' },
      { label: 'Overdue Since', value: '2025-08-01' },
    ],
    actions: [
      { label: 'Pay Now', variant: 'primary' },
      { label: 'View Invoice', variant: 'link', href: '/finance/invoice/19043770' },
    ],
    dismissType: 'dismissible',
    priority: 90,
    targeting: { pages: ['/dashboard/otif', '/dashboard/kpi', '/', '/finance/invoices'] },
  },
  {
    id: 'feature-release-002',
    tier: 'info',
    category: 'feature-release',
    title: 'New Feature Available',
    message:
      'We have launched the new Inventory Forecasting module. Predict stock levels, optimize reorder points, and reduce carrying costs with AI-powered demand planning.',
    highlights: [
      { label: 'Module', value: 'Inventory Forecasting' },
      { label: 'Available Since', value: '2025-08-20' },
    ],
    actions: [
      { label: 'Learn More', variant: 'primary', href: '/dashboard/kpi' },
      { label: 'Release Notes', variant: 'link', href: '/dashboard/kpi' },
    ],
    dismissType: 'dismissible',
    priority: 50,
    targeting: { pages: ['/dashboard/otif', '/dashboard/kpi', '/', '/finance/invoices'] },
  },
]

export function BannerProvider({ children }: { children: ReactNode }) {
  const [banners, setBanners] = useState<BannerConfig[]>(defaultBanners)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())

  const addBanner = useCallback((banner: BannerConfig) => {
    setBanners((prev) => {
      if (prev.some((b) => b.id === banner.id)) return prev
      return [...prev, banner]
    })
  }, [])

  const removeBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const dismissBanner = useCallback((id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]))
  }, [])

  const acknowledgeBanner = useCallback((id: string) => {
    setAcknowledgedIds((prev) => new Set([...prev, id]))
  }, [])

  const getVisibleBanners = useCallback(
    (page?: string): BannerConfig[] => {
      const now = new Date()

      const filtered = banners
        .filter((banner) => {
          // Skip dismissed (unless persistent/acknowledge type)
          if (banner.dismissType === 'dismissible' && dismissedIds.has(banner.id)) {
            return false
          }
          if (banner.dismissType === 'acknowledge' && acknowledgedIds.has(banner.id)) {
            return false
          }

          // Check date range
          if (banner.startDate && new Date(banner.startDate) > now) return false
          if (banner.endDate && new Date(banner.endDate) < now) return false

          // Check page targeting
          if (banner.targeting?.pages && page) {
            if (!banner.targeting.pages.includes(page)) return false
          }

          return true
        })
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

      // Only show the highest priority banner at a time
      return filtered.slice(0, 1)
    },
    [banners, dismissedIds, acknowledgedIds]
  )

  return (
    <BannerContext.Provider
      value={{
        banners,
        dismissedIds,
        acknowledgedIds,
        addBanner,
        removeBanner,
        dismissBanner,
        acknowledgeBanner,
        getVisibleBanners,
      }}
    >
      {children}
    </BannerContext.Provider>
  )
}

export function useBanners() {
  const context = useContext(BannerContext)
  if (!context) {
    throw new Error('useBanners must be used within a BannerProvider')
  }
  return context
}
