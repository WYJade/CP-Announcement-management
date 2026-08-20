import { useState } from 'react'
import { Search, Download, Plus, X } from 'lucide-react'

type ClaimStatus = 'InProgress' | 'Submitted' | 'Approved' | 'Rejected' | 'Closed'
type TabType = 'All' | 'Claims' | 'Dispute'

interface Claim {
  id: string
  ticket: string
  tracking: string
  invoice: string
  claimDate: string
  type: string
  typeColor: string
  amount: string
  status: ClaimStatus
}

const MOCK_CLAIMS: Claim[] = [
  {
    id: '1', ticket: '1202608050001', tracking: '-', invoice: '-',
    claimDate: '2026-08-05 07:51:34',
    type: 'Claim - Inaccurate\nInventory Count', typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    amount: '$ 40.00', status: 'InProgress',
  },
  {
    id: '2', ticket: '1202608040001', tracking: '-', invoice: '-',
    claimDate: '2026-08-04 11:56:11',
    type: 'Claim - Incorrect or\nInaccurate Label', typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    amount: '$ 1235.00', status: 'InProgress',
  },
  {
    id: '3', ticket: '1202607140001', tracking: '-', invoice: '-',
    claimDate: '2026-07-11 23:46:08',
    type: 'Claim - Chargeback\nInventory Loss', typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    amount: '$ 1.00', status: 'InProgress',
  },
  {
    id: '4', ticket: '1202607080043', tracking: '-', invoice: '-',
    claimDate: '2026-07-08 23:34:57',
    type: 'Claim - Chargeback\nInventory Loss', typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    amount: '$ 1.00', status: 'InProgress',
  },
  {
    id: '5', ticket: '1202607080004', tracking: '-', invoice: '19043760',
    claimDate: '2026-07-08 02:15:50',
    type: 'Dispute - Incorrect Details\nin Order/Receipt', typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
    amount: '$ 4.00', status: 'InProgress',
  },
  {
    id: '6', ticket: '1202606250003', tracking: '-', invoice: '-',
    claimDate: '2026-06-25 10:22:15',
    type: 'Claim - Inaccurate\nInventory Count', typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    amount: '$ 120.00', status: 'Submitted',
  },
  {
    id: '7', ticket: '1202606180012', tracking: 'TRK-8872', invoice: '19033421',
    claimDate: '2026-06-18 14:05:30',
    type: 'Dispute - Billing\nDiscrepancy', typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
    amount: '$ 530.00', status: 'Approved',
  },
]

const STATUS_STYLES: Record<ClaimStatus, string> = {
  InProgress: 'text-blue-600',
  Submitted:  'text-yellow-600',
  Approved:   'text-green-600',
  Rejected:   'text-red-600',
  Closed:     'text-gray-500',
}

const FACILITY_OPTIONS = ['All Facilities', 'New Jersey', 'Los Angeles', 'Chicago', 'Dallas']
const STATUS_FILTER_OPTIONS: (ClaimStatus | 'In progress')[] = ['In progress', 'Submitted', 'Approved', 'Rejected', 'Closed']

export default function ClaimList() {
  const [tab, setTab] = useState<TabType>('All')
  const [search, setSearch] = useState('')
  const [facility, setFacility] = useState('All Facilities')
  const [statusFilter, setStatusFilter] = useState<string>('In progress')

  const filtered = MOCK_CLAIMS.filter(c => {
    if (tab === 'Claims' && c.type.startsWith('Dispute')) return false
    if (tab === 'Dispute' && !c.type.startsWith('Dispute')) return false
    if (search && !c.ticket.includes(search) && !c.invoice.includes(search) && !c.tracking.includes(search)) return false
    if (statusFilter === 'In progress' && c.status !== 'InProgress') return false
    if (statusFilter !== 'In progress' && statusFilter !== '' && c.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-0">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Claims &amp; Disputes History</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={15} />
          File New Claim
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white w-52 focus:outline-none focus:border-primary-400"
          />
        </div>

        {/* Facility dropdown */}
        <select
          value={facility}
          onChange={e => setFacility(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-400 text-gray-700"
        >
          {FACILITY_OPTIONS.map(f => <option key={f}>{f}</option>)}
        </select>

        {/* Status tag filter */}
        {statusFilter && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
            <span>{statusFilter}</span>
            <button onClick={() => setStatusFilter('')} className="text-gray-400 hover:text-gray-600 ml-1">
              <X size={13} />
            </button>
          </div>
        )}

        {/* Status dropdown (hidden clear-all trigger area) */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-400 text-gray-700"
          >
            <option value="">All Status</option>
            {STATUS_FILTER_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          {statusFilter && (
            <button onClick={() => setStatusFilter('')} className="text-xs text-primary-600 hover:underline">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5">
        {(['All', 'Claims', 'Dispute'] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              tab === t
                ? 'bg-white border border-gray-300 text-gray-800 font-medium shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Section title + export */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Most Recent Tickets</h2>
          <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            <Download size={12} />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Ticket #', 'Tracking/Pro #', 'Invoice #', 'Claim Date', 'Type', 'Total Claim Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No claims found
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 text-gray-700 font-medium">{c.ticket}</td>
                    <td className="px-4 py-3 text-gray-500">{c.tracking}</td>
                    <td className="px-4 py-3 text-gray-500">{c.invoice}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.claimDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-lg border text-[10px] font-medium leading-tight text-center whitespace-pre-line ${c.typeColor}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{c.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary-600 hover:text-primary-800 font-medium hover:underline transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
