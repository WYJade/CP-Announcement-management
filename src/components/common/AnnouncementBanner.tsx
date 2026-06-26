import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  X,
  Info,
  AlertCircle,
  CheckCircle2,
  Megaphone,
  ExternalLink,
} from 'lucide-react'
import type { BannerConfig, BannerTier } from '../../types/banner'
import { useBanners } from '../../context/BannerContext'
import { useLocation, useNavigate } from 'react-router-dom'
import PayDialog from '../Finance/PayDialog'
import LearnMoreModal from './LearnMoreModal'
import ReleaseNotesModal from './ReleaseNotesModal'
import { invoices } from '../../data/invoices'

/** Tier-based styling configuration */
const tierStyles: Record<
  BannerTier,
  {
    bg: string
    border: string
    iconBg: string
    iconColor: string
    titleColor: string
    highlightBg: string
    highlightText: string
  }
> = {
  info: {
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    highlightBg: 'bg-blue-50',
    highlightText: 'text-blue-700',
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    highlightBg: 'bg-red-50',
    highlightText: 'text-red-600',
  },
  critical: {
    bg: 'bg-gradient-to-r from-red-50 to-rose-50',
    border: 'border-red-300',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    highlightBg: 'bg-red-100',
    highlightText: 'text-red-700',
  },
  success: {
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    highlightBg: 'bg-green-50',
    highlightText: 'text-green-700',
  },
  promotion: {
    bg: 'bg-gradient-to-r from-purple-50 to-fuchsia-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-800',
    highlightBg: 'bg-purple-50',
    highlightText: 'text-purple-700',
  },
}

/** Icon component based on tier */
function TierIcon({ tier, className }: { tier: BannerTier; className?: string }) {
  const props = { size: 18, className }
  switch (tier) {
    case 'info':
      return <Info {...props} />
    case 'warning':
      return <AlertTriangle {...props} />
    case 'critical':
      return <AlertCircle {...props} />
    case 'success':
      return <CheckCircle2 {...props} />
    case 'promotion':
      return <Megaphone {...props} />
  }
}

/** Individual banner popup item */
function BannerPopupItem({
  banner,
  onPayClick,
  onLearnMoreClick,
  onReleaseNotesClick,
}: {
  banner: BannerConfig
  onPayClick: () => void
  onLearnMoreClick: () => void
  onReleaseNotesClick: () => void
}) {
  const { dismissBanner, acknowledgeBanner } = useBanners()
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false)
  const styles = tierStyles[banner.tier]

  // Auto-dismiss for timed banners
  useEffect(() => {
    if (banner.dismissType === 'timed' && banner.autoDismissMs) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, banner.autoDismissMs)
      return () => clearTimeout(timer)
    }
  }, [banner.id, banner.dismissType, banner.autoDismissMs])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      dismissBanner(banner.id)
    }, 200)
  }

  const handleAcknowledge = () => {
    setIsExiting(true)
    setTimeout(() => {
      acknowledgeBanner(banner.id)
    }, 200)
  }

  const handleActionClick = (action: { label: string; href?: string; variant: string }) => {
    if (action.label === 'Pay Now') {
      onPayClick()
    } else if (action.label === 'Learn More') {
      onLearnMoreClick()
    } else if (action.label === 'Release Notes') {
      onReleaseNotesClick()
    } else if (action.href && action.href.startsWith('/')) {
      navigate(action.href)
    }
  }

  const canDismiss = banner.dismissType === 'dismissible' || banner.dismissType === 'timed'

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg px-4 py-3 flex items-start gap-3 shadow-sm transition-all duration-200 ${
        isExiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 animate-banner-enter'
      }`}
      role="alert"
      aria-live={banner.tier === 'critical' ? 'assertive' : 'polite'}
    >
      {/* Tier Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center`}>
          <TierIcon tier={banner.tier} className={styles.iconColor} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title & Message */}
        <div className="mb-1">
          <span className={`font-semibold text-sm ${styles.titleColor}`}>
            {banner.title}:
          </span>{' '}
          <span className="text-sm text-gray-700 leading-relaxed">{banner.message}</span>
        </div>

        {/* Highlighted Fields */}
        {banner.highlights && banner.highlights.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {banner.highlights.map((field) => (
              <span
                key={field.label}
                className={`inline-flex items-center gap-1 text-xs font-bold ${styles.highlightText} ${styles.highlightBg} px-2 py-1 rounded-md border border-current/10`}
              >
                <span className="font-medium opacity-75">{field.label}:</span>
                <span>{field.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {banner.actions && banner.actions.length > 0 && (
          <div className="flex items-center gap-2 mt-2.5">
            {banner.actions.map((action) => {
              const baseClasses =
                'text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer'
              if (action.variant === 'primary') {
                return (
                  <button
                    key={action.label}
                    onClick={() => handleActionClick(action)}
                    className={`${baseClasses} px-3 py-1.5 bg-primary-600 text-white hover:bg-primary-700`}
                  >
                    {action.label}
                  </button>
                )
              }
              if (action.variant === 'secondary') {
                return (
                  <button
                    key={action.label}
                    onClick={() => handleActionClick(action)}
                    className={`${baseClasses} px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50`}
                  >
                    {action.label}
                  </button>
                )
              }
              return (
                <button
                  key={action.label}
                  onClick={() => handleActionClick(action)}
                  className={`${baseClasses} text-primary-600 hover:text-primary-700 underline underline-offset-2`}
                >
                  {action.label}
                  <ExternalLink size={10} />
                </button>
              )
            })}
          </div>
        )}

        {/* Acknowledge CTA for acknowledge-type banners */}
        {banner.dismissType === 'acknowledge' && (
          <div className="mt-2.5">
            <button
              onClick={handleAcknowledge}
              className="text-xs font-medium px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              I Acknowledge
            </button>
          </div>
        )}
      </div>

      {/* Close Button */}
      {canDismiss && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 p-1 rounded-md hover:${styles.iconBg} transition-colors`}
          aria-label="Dismiss notification"
        >
          <X size={16} className={styles.iconColor} />
        </button>
      )}
    </div>
  )
}

/** Main Announcement Banner Popup container — renders all visible banners for the current page */
function AnnouncementBanner() {
  const { getVisibleBanners } = useBanners()
  const location = useLocation()
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false)
  const visibleBanners = getVisibleBanners(location.pathname)

  // Find the invoice referenced in the banner (19043770)
  const bannerInvoice = invoices.find((inv) => inv.invoiceNumber === '19043770')

  if (visibleBanners.length === 0) return null

  // Only show one banner at a time (highest priority first), close to see next
  const activeBanner = visibleBanners[0]

  return (
    <>
      <div className="space-y-2" aria-label="Announcements">
        <BannerPopupItem
          key={activeBanner.id}
          banner={activeBanner}
          onPayClick={() => setPayDialogOpen(true)}
          onLearnMoreClick={() => setLearnMoreOpen(true)}
          onReleaseNotesClick={() => setReleaseNotesOpen(true)}
        />
      </div>

      {/* Pay Dialog triggered from banner */}
      <PayDialog
        isOpen={payDialogOpen}
        onClose={() => setPayDialogOpen(false)}
        initialInvoice={bannerInvoice}
      />

      {/* Learn More Modal */}
      <LearnMoreModal
        isOpen={learnMoreOpen}
        onClose={() => setLearnMoreOpen(false)}
      />

      {/* Release Notes Modal */}
      <ReleaseNotesModal
        isOpen={releaseNotesOpen}
        onClose={() => setReleaseNotesOpen(false)}
      />
    </>
  )
}

export default AnnouncementBanner
