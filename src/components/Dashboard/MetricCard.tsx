import { TrendingUp, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  trend: string
  trendType?: 'up' | 'neutral'
}

function MetricCard({ title, value, trend, trendType = 'up' }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-xs font-medium text-gray-500 leading-tight">{title}</h3>
      <div className="mt-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {trendType === 'up' ? (
          <TrendingUp size={12} className="text-green-500" />
        ) : (
          <Minus size={12} className="text-gray-400" />
        )}
        <span className="text-xs text-gray-500">{trend}</span>
      </div>
    </div>
  )
}

export default MetricCard
