import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Search, Clock, AlertTriangle, FileCheck, Warehouse, BarChart3, Map, Package, Truck, List } from 'lucide-react'

// ─── Carousel Slides Data ────────────────────────────────────────────────────
const CAROUSEL_SLIDES = [
  {
    title: 'Welcome to Shipment Tracking',
    description: 'Your new end-to-end visibility hub. Track shipments from booking to warehouse delivery with powerful search, real-time alerts, and detailed milestone tracking.',
    icon: <Package size={40} className="text-primary-600" />,
    features: ['Quick Search & Recent History', 'Risk Alert Cards', 'Status-based Filtering', 'Detailed Shipment Table'],
    category: 'list',
  },
  {
    title: 'Quick Search',
    description: 'Instantly find shipments by Shipment No., HBL, MBL, Container No., BOL, or Load#. Advanced filters let you narrow results by status, date, origin, and destination.',
    icon: <Search size={40} className="text-blue-600" />,
    features: [],
    category: 'list',
  },
  {
    title: 'Risk Alert Cards',
    description: 'See at-a-glance which shipments need attention. Cards show counts for Customs Hold, Approaching LFD, LFD Exceeded, and Warehouse Receiving — click to filter instantly.',
    icon: <AlertTriangle size={40} className="text-orange-600" />,
    features: [],
    category: 'list',
  },
  {
    title: 'Status Tabs & Shipment Table',
    description: 'Filter by tracking status with one click. The table displays key details: shipment number, status, containers, origin, destination, ETA, and customer info.',
    icon: <List size={40} className="text-violet-600" />,
    features: [],
    category: 'list',
  },
  {
    title: 'Detail: Overview',
    description: 'The Overview tab gives you a complete picture — shipment info, overall progress percentage, a business milestone timeline showing every phase, and a live map.',
    icon: <BarChart3 size={40} className="text-green-600" />,
    features: ['Shipment Info Panel', 'Progress Bar', 'Business Milestone Timeline', 'Live Map'],
    category: 'detail',
  },
  {
    title: 'Detail: Containers(Drayage)',
    description: 'View container details, drayage load assignments, pickup terminals, delivery ETAs, and LFD information all in one structured table.',
    icon: <Truck size={40} className="text-violet-600" />,
    features: [],
    category: 'detail',
  },
  {
    title: 'Detail: Items SKUs',
    description: 'Track received quantities against expected, identify discrepancies and damaged items at the SKU level for full inventory reconciliation.',
    icon: <Package size={40} className="text-cyan-600" />,
    features: [],
    category: 'detail',
  },
  {
    title: 'Detail: Customs Clearance',
    description: 'Check customs status, entry numbers, port of entry, broker info, duty amounts, and HTS codes — all your customs data in one place.',
    icon: <FileCheck size={40} className="text-teal-600" />,
    features: [],
    category: 'detail',
  },
  {
    title: 'Detail: Drayage Load',
    description: 'Monitor drayage loads with driver info, pickup/delivery dates, and status. Click Load # to navigate directly to the load detail page for full information.',
    icon: <Truck size={40} className="text-amber-600" />,
    features: [],
    category: 'detail',
  },
]

// ─── Onboarding Dialog Component ─────────────────────────────────────────────
interface OnboardingDialogProps {
  onClose: (startTour: boolean) => void
}

export function OnboardingDialog({ onClose }: OnboardingDialogProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose(false)
    if (e.key === 'ArrowRight' && currentSlide < CAROUSEL_SLIDES.length - 1) setCurrentSlide(s => s + 1)
    if (e.key === 'ArrowLeft' && currentSlide > 0) setCurrentSlide(s => s - 1)
  }, [currentSlide, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const slide = CAROUSEL_SLIDES[currentSlide]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={() => onClose(false)} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <span className="text-[11px] text-gray-400 font-medium">{currentSlide + 1} / {CAROUSEL_SLIDES.length}</span>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex gap-5 items-center">
          <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
            {slide.icon}
          </div>
          <div className="flex-1 text-left min-w-0">
            <h2 className="text-base font-bold text-gray-900 mb-1">{slide.title}</h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">{slide.description}</p>
            {slide.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {slide.features.map(f => (
                  <span key={f} className="text-[10px] px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full font-medium border border-primary-100">{f}</span>
                ))}
              </div>
            )}
            {slide.category === 'detail' && currentSlide === CAROUSEL_SLIDES.length - 1 && (
              <p className="text-[10px] text-amber-600 mt-2 font-medium">💡 Click Load # in Drayage Load tab to jump to load details</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setCurrentSlide(s => s - 1)}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {/* Dots indicator */}
          <div className="flex gap-1.5">
            {CAROUSEL_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-primary-600 w-5' : 'bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>

          {currentSlide < CAROUSEL_SLIDES.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(s => s + 1)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 rounded-lg hover:bg-primary-50 transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => onClose(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tour Step Interface ─────────────────────────────────────────────────────
export interface TourStep {
  targetSelector: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

// ─── List Page Tour Steps ────────────────────────────────────────────────────
export const LIST_TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="search-bar"]',
    title: 'Quick Search',
    description: 'Search by Shipment No., HBL, MBL, Container No., BOL, or Load# to find shipments instantly.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="recent-searches"]',
    title: 'Recent Searches',
    description: 'Quickly revisit your previously searched shipments with one click.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="alert-cards"]',
    title: 'Risk Alert Cards',
    description: 'View shipments needing attention at a glance. Click a card to filter by that alert type.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="status-tabs"]',
    title: 'Status Tabs',
    description: 'Filter shipments by current tracking status — from Booked to Received.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="shipment-table"]',
    title: 'Shipment Table',
    description: 'View all shipment details including status, containers, origin, destination, ETA, and customer.',
    position: 'top',
  },
]

// ─── Detail Page Tour Steps ──────────────────────────────────────────────────
export const DETAIL_OVERVIEW_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="info-panel"]',
    title: 'Shipment Info',
    description: 'View key shipment details: customer, HBL, MBL, container, carrier, milestones, and ETAs.',
    position: 'right',
  },
  {
    targetSelector: '[data-tour="progress-bar"]',
    title: 'Overall Progress',
    description: 'Track shipment journey completion across Ocean, Customs, Drayage, and Warehouse phases.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="milestone-timeline"]',
    title: 'Business Milestone Timeline',
    description: 'Follow the shipment through every milestone — from booking to warehouse receiving.',
    position: 'left',
  },
  {
    targetSelector: '[data-tour="live-map"]',
    title: 'Live Map',
    description: 'See real-time shipment location on an interactive map.',
    position: 'right',
  },
]

export const DETAIL_TAB_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="tab-containers"]',
    title: 'Containers(Drayage)',
    description: 'View container details, drayage assignments, LFD, and delivery status.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="tab-items"]',
    title: 'Items SKUs',
    description: 'Check received vs expected quantities and identify discrepancies.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="tab-customs"]',
    title: 'Customs Clearance',
    description: 'Review customs status, entry details, duties, and broker info.',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="tab-drayage"]',
    title: 'Drayage Load',
    description: 'Monitor loads and click Load # to view full load details.',
    position: 'bottom',
  },
]

// ─── Guided Tour Overlay Component ───────────────────────────────────────────
interface GuidedTourProps {
  steps: TourStep[]
  onComplete: () => void
}

export function GuidedTour({ steps, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  const updateTargetRect = useCallback(() => {
    const step = steps[currentStep]
    if (!step) return
    const el = document.querySelector(step.targetSelector)
    if (el) {
      setTargetRect(el.getBoundingClientRect())
    } else {
      // Skip this step if element not found
      if (currentStep < steps.length - 1) {
        setCurrentStep(s => s + 1)
      } else {
        onComplete()
      }
    }
  }, [currentStep, steps, onComplete])

  useEffect(() => {
    updateTargetRect()
    const handleResize = () => updateTargetRect()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize, true)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
    }
  }, [updateTargetRect])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  if (!targetRect) return null

  const step = steps[currentStep]
  const padding = 8
  const highlightX = targetRect.left - padding
  const highlightY = targetRect.top - padding
  const highlightW = targetRect.width + padding * 2
  const highlightH = targetRect.height + padding * 2

  // Calculate tooltip position
  let tooltipStyle: React.CSSProperties = {}
  let arrowPath = ''

  const tooltipW = 280
  const tooltipH = 120
  const gap = 16

  if (step.position === 'bottom') {
    const tooltipX = Math.max(16, Math.min(highlightX + highlightW / 2 - tooltipW / 2, window.innerWidth - tooltipW - 16))
    const tooltipY = highlightY + highlightH + gap
    tooltipStyle = { left: tooltipX, top: tooltipY }
    // Curved arrow from tooltip top to highlight bottom
    const startX = tooltipX + tooltipW / 2
    const startY = tooltipY
    const endX = highlightX + highlightW / 2
    const endY = highlightY + highlightH + 4
    const cpX = (startX + endX) / 2
    const cpY = startY - 20
    arrowPath = `M${startX},${startY} Q${cpX},${cpY} ${endX},${endY}`
  } else if (step.position === 'top') {
    const tooltipX = Math.max(16, Math.min(highlightX + highlightW / 2 - tooltipW / 2, window.innerWidth - tooltipW - 16))
    const tooltipY = highlightY - tooltipH - gap
    tooltipStyle = { left: tooltipX, top: tooltipY }
    const startX = tooltipX + tooltipW / 2
    const startY = tooltipY + tooltipH
    const endX = highlightX + highlightW / 2
    const endY = highlightY - 4
    const cpX = (startX + endX) / 2
    const cpY = startY + 20
    arrowPath = `M${startX},${startY} Q${cpX},${cpY} ${endX},${endY}`
  } else if (step.position === 'right') {
    const tooltipX = highlightX + highlightW + gap
    const tooltipY = highlightY + highlightH / 2 - tooltipH / 2
    tooltipStyle = { left: Math.min(tooltipX, window.innerWidth - tooltipW - 16), top: Math.max(16, tooltipY) }
    const startX = parseFloat(String(tooltipStyle.left))
    const startY = (tooltipStyle.top as number) + tooltipH / 2
    const endX = highlightX + highlightW + 4
    const endY = highlightY + highlightH / 2
    const cpX = startX - 20
    const cpY = (startY + endY) / 2
    arrowPath = `M${startX},${startY} Q${cpX},${cpY} ${endX},${endY}`
  } else if (step.position === 'left') {
    const tooltipX = highlightX - tooltipW - gap
    const tooltipY = highlightY + highlightH / 2 - tooltipH / 2
    tooltipStyle = { left: Math.max(16, tooltipX), top: Math.max(16, tooltipY) }
    const startX = (tooltipStyle.left as number) + tooltipW
    const startY = (tooltipStyle.top as number) + tooltipH / 2
    const endX = highlightX - 4
    const endY = highlightY + highlightH / 2
    const cpX = startX + 20
    const cpY = (startY + endY) / 2
    arrowPath = `M${startX},${startY} Q${cpX},${cpY} ${endX},${endY}`
  }

  return (
    <div className="fixed inset-0 z-[9998]">
      {/* SVG Overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x={highlightX} y={highlightY} width={highlightW} height={highlightH} rx="8" ry="8" fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#tour-mask)" />
        {/* Highlight border */}
        <rect x={highlightX} y={highlightY} width={highlightW} height={highlightH} rx="8" ry="8" fill="none" stroke="#6366f1" strokeWidth="2" />
        {/* Curved arrow - thick gradient style */}
        {arrowPath && (
          <>
            <defs>
              <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <polygon points="0,0 10,5 0,10" fill="#ef4444" />
              </marker>
            </defs>
            <path d={arrowPath} fill="none" stroke="url(#arrow-gradient)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead)" />
          </>
        )}
      </svg>

      {/* Click blocker except highlight region */}
      <div className="absolute inset-0" onClick={e => e.stopPropagation()}
        style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${highlightY}px, ${highlightX}px ${highlightY}px, ${highlightX}px ${highlightY + highlightH}px, ${highlightX + highlightW}px ${highlightY + highlightH}px, ${highlightX + highlightW}px ${highlightY}px, 0 ${highlightY}px)` }}
      />

      {/* Tooltip */}
      <div className="absolute bg-white rounded-xl shadow-xl border border-gray-200 p-4 transition-all duration-300" style={{ ...tooltipStyle, width: tooltipW, zIndex: 9999 }}>
        <p className="text-sm font-bold text-gray-900 mb-1">{step.title}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-gray-400">{currentStep + 1} / {steps.length}</span>
          <div className="flex gap-2">
            <button onClick={handleSkip} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1">Skip</button>
            <button onClick={handleNext} className="text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors">
              {currentStep < steps.length - 1 ? 'Next' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hook: useOnboardingGuide ────────────────────────────────────────────────
export function useOnboardingGuide() {
  const [showDialog, setShowDialog] = useState(true)
  const [showListTour, setShowListTour] = useState(false)

  const handleDialogClose = (startTour: boolean) => {
    setShowDialog(false)
    if (startTour) {
      setTimeout(() => setShowListTour(true), 300)
    }
  }

  const handleListTourComplete = () => {
    setShowListTour(false)
  }

  return { showDialog, showListTour, handleDialogClose, handleListTourComplete }
}

export function useDetailTourGuide() {
  const [showDetailTour, setShowDetailTour] = useState(true)
  const [tourPhase, setTourPhase] = useState<'overview' | 'tabs'>('overview')

  const handleOverviewComplete = () => {
    setTourPhase('tabs')
  }

  const handleTabsComplete = () => {
    setShowDetailTour(false)
  }

  return { showDetailTour, tourPhase, handleOverviewComplete, handleTabsComplete }
}
