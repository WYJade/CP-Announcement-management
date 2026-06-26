import { ChevronDown, LayoutGrid, ClipboardList } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

function KPIDashboard() {
  const { t } = useI18n()

  return (
    <div className="space-y-5">
      {/* Page Title Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">{t('kpi.title')}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 text-xs text-gray-600">
            <span className="truncate max-w-[160px]">SUNPOWER NI-SUNPO</span>
            <ChevronDown size={12} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 text-xs text-gray-600">
            <span>Fontana</span>
            <ChevronDown size={12} className="text-gray-400" />
          </div>
          <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
            <LayoutGrid size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Inventory Accuracy */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">{t('kpi.inventoryAccuracy')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InventoryCard label={t('kpi.lastMonth')} bgClass="bg-gradient-to-br from-purple-400 to-purple-500" />
          <InventoryCard label={t('kpi.last3Months')} bgClass="bg-gradient-to-br from-indigo-400 to-cyan-400" />
          <InventoryCard label={t('kpi.last6Months')} bgClass="bg-gradient-to-br from-teal-400 to-green-400" />
          <InventoryCard label={t('kpi.last12Months')} bgClass="bg-gradient-to-br from-orange-400 to-red-400" />
        </div>
      </div>

      {/* Today's Order Snapshot */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">{t('kpi.todayOrderSnapshot')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrderCard title={t('kpi.smallParcelOrders')} fulfillmentLabel={t('kpi.fulfillmentRate')} noDataLabel={t('kpi.noDataAvailable')} queueLabel={t('kpi.tomorrowQueue')} />
          <OrderCard title={t('kpi.regularOrders')} fulfillmentLabel={t('kpi.fulfillmentRate')} noDataLabel={t('kpi.noDataAvailable')} queueLabel={t('kpi.tomorrowQueue')} />
        </div>
      </div>

      {/* Today's Receiving/Outbound Snapshot */}
      <h2 className="text-sm font-semibold text-gray-800">{t('kpi.todaySnapshot')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receiving */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">{t('kpi.receivingMetrics')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium"></th>
                <th className="text-center py-2 text-gray-500 font-medium">{t('kpi.receipts')}</th>
                <th className="text-center py-2 text-gray-500 font-medium">{t('kpi.lineItems')}</th>
                <th className="text-center py-2 text-gray-500 font-medium">{t('kpi.eaQtyCount')}</th>
              </tr>
            </thead>
            <tbody>
              {[t('kpi.open'), t('kpi.receiving'), t('kpi.received')].map((row) => (
                <tr key={row} className="border-b border-gray-50">
                  <td className="py-3 text-gray-700 font-medium">{row}</td>
                  <td className="text-center text-gray-400">-</td>
                  <td className="text-center text-gray-400">-</td>
                  <td className="text-center text-gray-400">-</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium"></th>
                  <th className="text-center py-2 text-gray-500 font-medium text-xs">{t('kpi.ctnrInYard')}</th>
                  <th className="text-center py-2 text-gray-500 font-medium text-xs">{t('kpi.ctnrUnloaded')}</th>
                  <th className="text-center py-2 text-gray-500 font-medium text-xs">{t('kpi.avgDaysInYard')}</th>
                </tr>
              </thead>
              <tbody>
                {[t('kpi.today'), t('kpi.yesterday'), t('kpi.last7Days')].map((row) => (
                  <tr key={row} className="border-b border-gray-50">
                    <td className="py-3 text-gray-700 font-medium">{row}</td>
                    <td className="text-center text-gray-400">-</td>
                    <td className="text-center text-gray-400">-</td>
                    <td className="text-center text-gray-400">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outbound */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">{t('kpi.outboundMetrics')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium"></th>
                <th className="text-center py-2 text-gray-500 font-medium">{t('kpi.ordersFulfilled')}</th>
                <th className="text-center py-2 text-gray-500 font-medium">{t('kpi.outboundRevenue')}</th>
                <th className="text-center py-2 text-gray-500 font-medium">{t('kpi.fulfilledOnline')}</th>
              </tr>
            </thead>
            <tbody>
              {[t('kpi.today'), t('kpi.yesterday'), t('kpi.last7Days')].map((row) => (
                <tr key={row} className="border-b border-gray-50">
                  <td className="py-3 text-gray-700 font-medium">{row}</td>
                  <td className="text-center text-gray-400">-</td>
                  <td className="text-center text-gray-400">-</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-500 font-medium">0%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-6 mt-4">© 2026 item.com</div>
    </div>
  )
}

function OrderCard({ title, fulfillmentLabel, noDataLabel, queueLabel }: { title: string; fulfillmentLabel: string; noDataLabel: string; queueLabel: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500">{fulfillmentLabel}: <span className="text-red-500 font-medium">%</span></span>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <ClipboardList size={36} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{noDataLabel}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Open:</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Picked:</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Shipped:</span>
      </div>
      <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#22c55e" strokeWidth="2" />
            <path d="M8 12h8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-sm text-gray-600">{queueLabel}</span>
      </div>
    </div>
  )
}

function InventoryCard({ label, bgClass }: { label: string; bgClass: string }) {
  return (
    <div className={`${bgClass} rounded-lg p-4 text-white min-h-[100px] flex flex-col justify-between`}>
      <span className="text-xs font-medium opacity-90">{label}</span>
      <div className="flex items-end justify-between mt-4">
        <span className="text-2xl font-bold">–</span>
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none" className="opacity-50">
          <path d="M0 12 L8 8 L16 10 L24 4 L32 6" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </div>
  )
}

export default KPIDashboard
