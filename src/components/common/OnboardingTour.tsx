import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

interface TourStep {
  target: string          // CSS selector or 'center'
  title: string
  desc: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'center',
    title: 'Welcome to Client Portal',
    desc: 'This is your operations hub. Let us walk you through the key features to help you get started quickly.',
    position: 'center',
  },
  {
    target: '[data-tour="stat-0"]',
    title: 'Key Metrics at a Glance',
    desc: 'These cards show your live operations summary — in-transit shipments, appointments, exceptions, and more. Click any number to drill into the details.',
    position: 'bottom',
  },
  {
    target: '[data-tour="network-map"]',
    title: '网络地图 / 仓库与运输态势',
    desc: 'The network map shows your real-time shipment routes from origin ports to US warehouses. Click any location dot to view shipment details at that point.',
    position: 'right',
  },
  {
    target: '[data-tour="exceptions"]',
    title: '异常与下一步行动',
    desc: 'Critical exceptions are listed here by priority (P1/P2/P3). Click any exception to open the action panel and resolve it step by step.',
    position: 'left',
  },
  {
    target: '[data-tour="my-tasks"]',
    title: '我的任务',
    desc: 'Your assigned tasks are listed here with priority and due time. Click any task to view details and navigate to the relevant page for action.',
    position: 'top',
  },
  {
    target: '[data-tour="ai-agent"]',
    title: 'AI Agent Analysis',
    desc: 'The AI analyzes your current exceptions and recommends specific actions. Click the action buttons to execute AI-guided steps.',
    position: 'top',
  },
  {
    target: '[data-tour="global-search"]',
    title: 'Global Search',
    desc: 'Type any module name, feature, or keyword to instantly jump to any page in the system. Try "invoice", "shipment tracking", or "inventory".',
    position: 'right',
  },
  {
    target: '[data-tour="header-ai-agents"]',
    title: 'AI Agents',
    desc: 'Access the full AI Agents platform for chat, automation, and workflow assistance.',
    position: 'bottom',
  },
  {
    target: '[data-tour="header-insights"]',
    title: 'Insights Builder',
    desc: 'Ask questions about your supply chain data in natural language and get instant dashboards and charts.',
    position: 'bottom',
  },
  {
    target: '[data-tour="help-support"]',
    title: 'Help & Support',
    desc: 'Access the Help Center documentation or submit a support request to our team.',
    position: 'bottom',
  },
]

const STORAGE_KEY = 'cp_onboarding_done'

export default function OnboardingTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      // slight delay so page renders first
      setTimeout(() => setVisible(true), 800)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const s = TOUR_STEPS[step]
    if (s.target === 'center') { setTargetRect(null); return }
    const el = document.querySelector(s.target)
    if (el) {
      setTargetRect(el.getBoundingClientRect())
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setTargetRect(null)
    }
  }, [step, visible])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(s => s + 1)
    else dismiss()
  }

  const prev = () => { if (step > 0) setStep(s => s - 1) }

  if (!visible) return null

  const current = TOUR_STEPS[step]
  const isCenter = current.target === 'center' || !targetRect

  // Compute tooltip position based on target rect
  const getTooltipStyle = (): React.CSSProperties => {
    if (isCenter) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
        width: '360px',
      }
    }
    const r = targetRect!
    const margin = 16
    const tw = 320
    const th = 180
    const vw = window.innerWidth
    const vh = window.innerHeight

    if (current.position === 'bottom') {
      const top = r.bottom + margin
      let left = r.left + r.width / 2 - tw / 2
      left = Math.max(margin, Math.min(left, vw - tw - margin))
      return { position: 'fixed', top, left, zIndex: 10001, width: `${tw}px` }
    }
    if (current.position === 'top') {
      const top = r.top - th - margin
      let left = r.left + r.width / 2 - tw / 2
      left = Math.max(margin, Math.min(left, vw - tw - margin))
      return { position: 'fixed', top: Math.max(margin, top), left, zIndex: 10001, width: `${tw}px` }
    }
    if (current.position === 'right') {
      const left = r.right + margin
      let top = r.top + r.height / 2 - th / 2
      top = Math.max(margin, Math.min(top, vh - th - margin))
      return { position: 'fixed', top, left: Math.min(left, vw - tw - margin), zIndex: 10001, width: `${tw}px` }
    }
    // left
    const left = r.left - tw - margin
    let top = r.top + r.height / 2 - th / 2
    top = Math.max(margin, Math.min(top, vh - th - margin))
    return { position: 'fixed', top, left: Math.max(margin, left), zIndex: 10001, width: `${tw}px` }
  }

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/60 z-[10000]" onClick={dismiss} />

      {/* Highlight cutout — spotlight effect */}
      {!isCenter && targetRect && (
        <div
          className="fixed z-[10000] rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
            border: '2px solid rgba(99,102,241,0.8)',
          }}
        />
      )}

      {/* Tooltip card */}
      <div style={getTooltipStyle()} className="bg-white rounded-xl shadow-2xl p-5">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'bg-primary-600 w-5' : 'bg-gray-200 w-1.5'}`} />
            ))}
          </div>
          <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 p-0.5">
            <X size={14} />
          </button>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{current.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-5">{current.desc}</p>

        <div className="flex items-center justify-between">
          <button onClick={dismiss} className="text-xs text-gray-400 hover:text-gray-600">Skip tour</button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={prev}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronLeft size={12} /> Back
              </button>
            )}
            <button onClick={next}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              {step < TOUR_STEPS.length - 1 ? <><span>Next</span><ChevronRight size={12} /></> : <span>Done</span>}
            </button>
          </div>
        </div>

        <p className="text-[9px] text-gray-400 text-right mt-2">{step + 1} / {TOUR_STEPS.length}</p>
      </div>
    </>
  )
}

// ─── Reset helper (for testing / re-trigger) ───────────────────────────────
export function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY)
}
