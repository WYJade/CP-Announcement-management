import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

interface ReleaseNotesModalProps {
  isOpen: boolean
  onClose: () => void
}

function ReleaseNotesModal({ isOpen, onClose }: ReleaseNotesModalProps) {
  const { tt } = useI18n()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden mx-4 animate-banner-enter">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <h2 className="text-base font-semibold">{tt('Release Notes')}</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-1">Version 4.2.0 — June 2025</p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: '60vh' }}>
          {/* New Feature Highlight */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">New</span>
              <h3 className="text-sm font-bold text-gray-900">{tt('AI-Powered Demand Forecasting')}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {tt('Predict inventory needs with 95% accuracy using our new machine learning models. The system analyzes historical sales data, seasonal patterns, and market trends to generate forecasts.')}
            </p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <Feature text={tt('Automated reorder point optimization')} />
              <Feature text={tt('Seasonal demand pattern recognition')} />
              <Feature text={tt('Safety stock recommendations')} />
              <Feature text={tt('What-if scenario modeling')} />
            </div>
          </div>

          {/* Improvements */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{tt('Improved')}</span>
              <h3 className="text-sm font-bold text-gray-900">{tt('Dashboard Performance')}</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRight size={12} className="text-blue-500 mt-1 flex-shrink-0" />
                {tt('Page load times reduced by 40% across all dashboard views')}
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={12} className="text-blue-500 mt-1 flex-shrink-0" />
                {tt('Real-time data refresh interval reduced from 60s to 15s')}
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={12} className="text-blue-500 mt-1 flex-shrink-0" />
                {tt('Chart rendering optimized for large datasets (10K+ points)')}
              </li>
            </ul>
          </div>

          {/* Bug Fixes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{tt('Fixed')}</span>
              <h3 className="text-sm font-bold text-gray-900">{tt('Bug Fixes')}</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={12} className="text-green-500 mt-1 flex-shrink-0" />
                {tt('Fixed invoice PDF export formatting issue on Safari')}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={12} className="text-green-500 mt-1 flex-shrink-0" />
                {tt('Resolved intermittent timeout on bulk shipment processing')}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={12} className="text-green-500 mt-1 flex-shrink-0" />
                {tt('Corrected timezone display in activity logs for UTC+8 users')}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {tt('Got it')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-700">
      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
      {text}
    </div>
  )
}

export default ReleaseNotesModal
