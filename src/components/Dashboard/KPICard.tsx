import { TrendingUp } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  trend: string
  bgColor: string
}

function KPICard({ title, value, trend, bgColor }: KPICardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-5 text-white shadow-lg`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <div className="flex items-center gap-1 text-xs opacity-80">
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      </div>
    </div>
  )
}

export default KPICard
