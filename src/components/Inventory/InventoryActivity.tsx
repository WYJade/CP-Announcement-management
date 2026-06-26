import { useState, useMemo } from 'react'
import {
  X, AlertTriangle, Bell, ChevronRight, Search, Filter,
  Download, Info, Package, TrendingDown, ShieldAlert, ClipboardCheck,
} from 'lucide-react'
import OrderAlertBanner, { type OrderAlert } from '../common/OrderAlertBanner'

// ─── Inventory alert data ────────────────────────────────────────────────────

const INVENTORY_ALERTS: OrderAlert[] = [
  {
    id: 'inv-alert-1',
    type: 'low-stock',
    title: '库存不足提醒',
    message: 'SKU TCORE-CABLE 当前可用库存仅剩 48 件，已低于安全库存阈值（50 件）。建议尽快安排补货，避免影响订单履约。',
    refId: 'TCORE-CABLE',
    severity: 'high',
    actionLabel: '查看详情',
    actionPath: '/support/item/WI-014',
    secondaryActionLabel: '安排补货',
    secondaryActionPath: '/support/requests/new',
  },
  {
    id: 'inv-alert-2',
    type: 'slow-moving',
    title: '库存积压预警',
    message: 'SKU FW-DENIM-001 已在仓库存放超过 180 天无出库记录，当前库存 850 件。持续存储将产生额外费用，建议制定处置计划。',
    refId: 'FW-DENIM-001',
    severity: 'medium',
    actionLabel: '查看处置选项',
    actionPath: '/support/item/WI-002',
  },
  {
    id: 'inv-alert-3',
    type: 'data-anomaly',
    title: '库存数据异常',
    message: 'SKU FW-2024-BLK 近期多次出库数量与订单预期不符，系统检测到潜在差异。已自动发起盘点请求，您可跟踪处理进度。',
    refId: 'FW-2024-BLK',
    severity: 'medium',
    actionLabel: '跟踪盘点进度',
    actionPath: '/support/item/WI-024',
  },
  {
    id: 'inv-alert-4',
    type: 'adjustment-approval',
    title: '库存调整待确认',
    message: 'SKU TCORE-CABLE 盘点结果已出：系统 100 件，实盘 96 件，差异 -4 件。请您审批库存调整方案，或选择继续调查。',
    refId: 'TCORE-CABLE',
    severity: 'high',
    actionLabel: '去审批',
    actionPath: '/support/item/WI-008',
  },
  {
    id: 'inv-alert-5',
    type: 'low-stock',
    title: '库存冻结通知',
    message: 'SKU FW-2024-RED 当前有 300 件处于冻结状态（海关文件待补充），无法正常出库。请尽快补充相关文件以解冻库存。',
    refId: 'FW-2024-RED',
    severity: 'high',
    actionLabel: '查看详情',
    actionPath: '/support/item/WI-004',
  },
]

// ─── Sample inventory data ───────────────────────────────────────────────────

interface InventoryRecord {
  id: string
  facility: string
  itemId: string
  description: string
  shortDescription: string
  title: string
  uom: string
  goodsType: string
  currentBalance: number
  beginningBalance: number
}

const SAMPLE_DATA: InventoryRecord[] = [
  { id: '1', facility: 'Valley View', itemId: '10262062250', description: '10262062250', shortDescription: 'M75Q6-L4', title: 'INNOLUX', uom: 'EA', goodsType: 'GOOD', currentBalance: 1, beginningBalance: 0 },
  { id: '2', facility: 'Valley View', itemId: '10262062250', description: '10262062250', shortDescription: 'M75Q6-L4', title: 'TCORE-X100', uom: 'EA', goodsType: 'GOOD', currentBalance: 4, beginningBalance: 0 },
  { id: '3', facility: 'Valley View', itemId: 'MCC500ml', description: 'MCC500ml', shortDescription: '-', title: 'ZYLUX', uom: 'EA', goodsType: 'GOOD', currentBalance: 0, beginningBalance: 0 },
  { id: '4', facility: 'Valley View', itemId: 'MSN', description: 'sesesescription', shortDescription: 'short short shot', title: 'ZYLUX', uom: 'EA', goodsType: 'GOOD', currentBalance: 36, beginningBalance: 0 },
  { id: '5', facility: 'Valley View', itemId: 'MSN', description: 'sesesescription', shortDescription: 'short short shot', title: 'BOEDS', uom: 'EA', goodsType: 'GOOD', currentBalance: 40, beginningBalance: 0 },
  { id: '6', facility: 'Valley View', itemId: 'TCORE-CABLE', description: 'USB-C Cable 3pk', shortDescription: 'Cable', title: 'TCORE-CABLE', uom: 'EA', goodsType: 'GOOD', currentBalance: 48, beginningBalance: 100 },
  { id: '7', facility: 'Valley View', itemId: 'FW-DENIM-001', description: 'Classic Denim', shortDescription: 'Denim Jean', title: 'FW-DENIM-001', uom: 'EA', goodsType: 'GOOD', currentBalance: 850, beginningBalance: 850 },
  { id: '8', facility: 'Valley View', itemId: 'FW-2024-BLK', description: 'Fashion Black', shortDescription: 'Tee BLK', title: 'FW-2024-BLK', uom: 'EA', goodsType: 'GOOD', currentBalance: 620, beginningBalance: 650 },
]

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function InventoryActivity() {
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('all')
  const [facility, setFacility] = useState('Valley View')

  const filtered = useMemo(() => {
    if (!search) return SAMPLE_DATA
    const q = search.toLowerCase()
    return SAMPLE_DATA.filter(
      (r) => r.itemId.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="p-6 max-w-full">
      {/* Alert Banner — dismissable, shows one at a time */}
      <OrderAlertBanner alerts={INVENTORY_ALERTS} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Activity</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={14} />
          Export To Excel
        </button>
      </div>

      {/* Filters — horizontal row */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Customer*</label>
            <select value={customer} onChange={(e) => setCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">VIZIO-VIZIO</option>
              <option value="techcore">TECHCORE</option>
              <option value="fashionwave">FASHIONWAVE</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facility*</label>
            <select value={facility} onChange={(e) => setFacility(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="Valley View">Valley View</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Item</label>
            <input type="text" placeholder="Input to search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <input type="text" placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lot #</label>
            <input type="text" placeholder="Lot #"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
            <input type="text" placeholder="Select date range"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Expiration Date From</label>
            <input type="text" placeholder="Expiration Date From"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Expiration Date To</label>
            <input type="text" placeholder="Expiration Date To"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex items-end gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={13} />
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
              <Search size={13} />
              Search
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" placeholder="Input to search"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">UOM</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Base UOM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8"></th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Short Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">UOM</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goods Type</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Balance</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beginning Balance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-4 text-gray-400"><ChevronRight size={12} /></td>
                <td className="py-2.5 px-4 text-gray-700">{row.facility}</td>
                <td className="py-2.5 px-4 text-gray-700 font-mono text-xs">{row.itemId}</td>
                <td className="py-2.5 px-4 text-gray-700">{row.description}</td>
                <td className="py-2.5 px-4 text-gray-500">{row.shortDescription}</td>
                <td className="py-2.5 px-4 text-gray-700 font-medium">{row.title}</td>
                <td className="py-2.5 px-4 text-gray-500">{row.uom}</td>
                <td className="py-2.5 px-4 text-gray-500">{row.goodsType}</td>
                <td className="py-2.5 px-4 text-right font-medium text-gray-900">{row.currentBalance}</td>
                <td className="py-2.5 px-4 text-right text-gray-500">{row.beginningBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
