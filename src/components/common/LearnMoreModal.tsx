import { X, Zap, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

interface LearnMoreModalProps {
  isOpen: boolean
  onClose: () => void
}

function LearnMoreModal({ isOpen, onClose }: LearnMoreModalProps) {
  const { tt } = useI18n()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden mx-4 animate-banner-enter">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 px-8 py-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{tt('New Feature')}</span>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
          <h2 className="text-xl font-bold mb-2">{tt('AI-Powered Demand Forecasting')}</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            {tt('Predict stock levels, optimize reorder points, and reduce carrying costs with our new machine learning-powered demand planning module.')}
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: '50vh' }}>
          {/* Key Benefits */}
          <h3 className="text-sm font-bold text-gray-900 mb-4">{tt('Key Benefits')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <BenefitCard
              icon={<BarChart3 size={20} className="text-primary-600" />}
              title={tt('95% Forecast Accuracy')}
              description={tt('Machine learning models trained on your historical data deliver industry-leading prediction accuracy.')}
            />
            <BenefitCard
              icon={<TrendingUp size={20} className="text-green-600" />}
              title={tt('30% Cost Reduction')}
              description={tt('Optimize safety stock levels and reduce excess inventory carrying costs significantly.')}
            />
            <BenefitCard
              icon={<Zap size={20} className="text-amber-600" />}
              title={tt('Automated Reordering')}
              description={tt('Set it and forget it — automatic purchase order suggestions when stock hits reorder points.')}
            />
            <BenefitCard
              icon={<ShieldCheck size={20} className="text-blue-600" />}
              title={tt('Stockout Prevention')}
              description={tt('Early warning system alerts you before critical items run out, protecting your fulfillment rate.')}
            />
          </div>

          {/* How It Works */}
          <h3 className="text-sm font-bold text-gray-900 mb-3">{tt('How It Works')}</h3>
          <div className="space-y-3 mb-6">
            <Step number={1} text={tt('The system ingests your historical sales, seasonality, and market signals.')} />
            <Step number={2} text={tt('ML models generate 30/60/90-day demand forecasts for each SKU.')} />
            <Step number={3} text={tt('Reorder recommendations are surfaced in your Inventory dashboard.')} />
            <Step number={4} text={tt('You review, adjust if needed, and approve — or enable auto-ordering.')} />
          </div>

          {/* Getting Started */}
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-primary-800 mb-1">{tt('Getting Started')}</h4>
            <p className="text-xs text-primary-700 leading-relaxed">
              {tt('The module is now available in your Inventory section. Navigate to Inventory → Forecasting to activate it. Initial model training takes approximately 24 hours after activation.')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {tt('Maybe later')}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {tt('Get Started')}
          </button>
        </div>
      </div>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-semibold text-gray-800">{title}</span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
        {number}
      </span>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  )
}

export default LearnMoreModal
