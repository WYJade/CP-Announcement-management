import { BarChart3 } from 'lucide-react'

function NoDataPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <BarChart3 size={28} className="text-gray-300" />
      </div>
      <p className="text-sm text-gray-400">No data available</p>
    </div>
  )
}

export default NoDataPlaceholder
