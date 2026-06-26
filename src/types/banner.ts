/**
 * Announcement Banner Popup Type System
 *
 * Supports all common client portal banner use cases:
 * - System status (maintenance, outages, recovery)
 * - New feature releases
 * - Company announcements
 * - Policy/compliance updates
 * - Billing & account (overdue, expiring, renewal)
 * - Security alerts
 * - Operational alerts (carrier delays, weather cutoffs)
 * - Surveys/feedback
 * - Training & events
 * - Promotions/upsell
 * - Onboarding nudges
 * - Regulatory/industry updates
 * - Emergency/critical
 * - Seasonal/branding
 * - A/B test / beta invites
 * - Deprecation warnings
 */

/** Severity tier determines visual styling and default behavior */
export type BannerTier = 'info' | 'warning' | 'critical' | 'success' | 'promotion'

/** Category for filtering and targeting */
export type BannerCategory =
  | 'system-status'
  | 'feature-release'
  | 'announcement'
  | 'policy-compliance'
  | 'billing-account'
  | 'security'
  | 'operational'
  | 'survey-feedback'
  | 'training-events'
  | 'promotion-upsell'
  | 'onboarding'
  | 'regulatory'
  | 'emergency'
  | 'seasonal'
  | 'beta-invite'
  | 'deprecation'

/** Dismiss behavior */
export type DismissType =
  | 'dismissible'       // User can close, stays dismissed for session
  | 'persistent'        // Cannot be closed (critical/emergency)
  | 'acknowledge'       // Requires explicit acknowledge CTA
  | 'timed'            // Auto-dismisses after a duration

/** Call-to-action button in the banner */
export interface BannerAction {
  label: string
  href?: string
  onClick?: () => void
  variant: 'primary' | 'secondary' | 'link'
}

/** Highlighted field for key data emphasis */
export interface HighlightField {
  label: string
  value: string
}

/** Targeting rules for showing banners to specific audiences */
export interface BannerTargeting {
  roles?: string[]           // e.g., ['admin', 'finance']
  customerSegments?: string[] // e.g., ['enterprise', 'trial']
  regions?: string[]         // e.g., ['US', 'EU', 'APAC']
  pages?: string[]           // specific routes to show on
}

/** Full banner configuration */
export interface BannerConfig {
  id: string
  tier: BannerTier
  category: BannerCategory
  title: string
  message: string
  highlights?: HighlightField[]
  actions?: BannerAction[]
  dismissType: DismissType
  autoDismissMs?: number      // for 'timed' dismiss type
  icon?: string               // custom icon name override
  startDate?: string          // ISO date when banner becomes active
  endDate?: string            // ISO date when banner expires
  targeting?: BannerTargeting
  frequencyCap?: number       // max times to show (0 = unlimited)
  priority?: number           // higher = shows first (default 0)
  createdAt?: string
}
