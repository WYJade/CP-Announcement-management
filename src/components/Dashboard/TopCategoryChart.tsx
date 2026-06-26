import NoDataPlaceholder from '../common/NoDataPlaceholder'

function TopCategoryChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Top 10 Category By On Time %</h3>
      <div className="h-52 flex items-center justify-center">
        <NoDataPlaceholder />
      </div>
    </div>
  )
}

export default TopCategoryChart
