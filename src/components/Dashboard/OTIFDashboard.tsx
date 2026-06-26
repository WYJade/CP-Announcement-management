import { ChevronDown, Calendar, LayoutGrid } from 'lucide-react'
import KPICard from './KPICard'
import MetricCard from './MetricCard'
import OnTimeInFullTrendChart from './OnTimeInFullTrendChart'
import PerformanceTrendsChart from './PerformanceTrendsChart'
import OTIFComplianceChart from './OTIFComplianceChart'
import TopCategoryChart from './TopCategoryChart'
import { useI18n } from '../../context/I18nContext'

function OTIFDashboard() {
  const { t } = useI18n()

  return (
    <div className="space-y-4">

      {/* Page Title Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">{t('otif.title')}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 text-xs text-gray-600">
            <span className="truncate max-w-[200px]">Walmart test-(Walmart1)-router@tp...</span>
            <ChevronDown size={12} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 text-xs text-gray-600">
            <Calendar size={12} className="text-gray-400" />
            <span>Week 34: 2025-08-23 to 2025-08-29</span>
          </div>
          <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
            <LayoutGrid size={16} className="text-gray-500" />
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            {t('otif.resetLayout')}
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
            {t('otif.saveLayout')}
          </button>
        </div>
      </div>

      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title={t('otif.onTimeInFull')} value="0%" trend={t('otif.vsLastYear')} bgColor="bg-gradient-to-br from-purple-600 to-purple-700" />
        <KPICard title={t('otif.onTimeRate')} value="0%" trend={t('otif.vsLastYear')} bgColor="bg-gradient-to-br from-teal-500 to-teal-600" />
        <KPICard title={t('otif.fillRate')} value="–" trend={t('otif.vsLastYear')} bgColor="bg-gradient-to-br from-indigo-800 to-indigo-900" />
      </div>

      {/* Row 2 - Metric Cards + Trend Chart */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard title={t('otif.inFullRate')} value="0%" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <MetricCard title={t('otif.onTimeAccountability')} value="0%" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <MetricCard title={t('otif.onTimeDeliveriesPrepaid')} value="0%" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <MetricCard title={t('otif.onTimeDeliveriesCollect')} value="0%" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <OnTimeInFullTrendChart />
      </div>

      {/* Row 3 - More Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard title={t('otif.otifDeliveriesNonDS')} value="0" trend={t('otif.vsLastYear')} trendType="neutral" />
        <MetricCard title={t('otif.inFullDeliveries')} value="0" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <MetricCard title={t('otif.totalLTL')} value="0" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <MetricCard title={t('otif.totalTL')} value="0" trend={`↗ ${t('otif.vsLastYear')}`} trendType="up" />
        <div />
      </div>

      {/* Row 4 - Performance Trends */}
      <PerformanceTrendsChart />

      {/* Row 5 - Compliance & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OTIFComplianceChart />
        <TopCategoryChart />
      </div>
    </div>
  )
}

export default OTIFDashboard
