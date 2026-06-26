import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Filter, Clock, CheckCircle2, AlertCircle,
  XCircle, ChevronRight, Paperclip, MessageSquare,
} from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'
import type { WorkItem, WorkItemStatus } from '../../types/workItem'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../types/workItem'
import ServicesBanner from './components/ServicesBanner'

// ─── Status tab definitions ──────────────────────────────────────────────────

type TabKey = 'All' | 'New' | 'Processing' | 'PendingApproval' | 'Resolved' | 'Closed'

interface TabDef {
  key: TabKey
  label: string
  statuses: WorkItemStatus[]
  color: string
}

const TABS: TabDef[] = [
  { key: 'All', label: '全部', statuses: [], color: 'text-gray-700' },
  { key: 'New', label: '待处理', statuses: ['Open'], color: 'text-blue-600' },
  { key: 'Processing', label: '处理中', statuses: ['InProgress'], color: 'text-indigo-600' },
  { key: 'PendingApproval', label: '待确认', statuses: ['PendingApproval'], color: 'text-amber-600' },
  { key: 'Resolved', label: '已完成', statuses: ['Resolved', 'Approved'], color: 'text-green-600' },
  { key: 'Closed', label: '已关闭', statuses: ['Closed', 'Cancelled', 'Rejected'], color: 'text-gray-400' },
]

// ─── Status icon helper ──────────────────────────────────────────────────────

function StatusIcon({ status }: { status: WorkItemStatus }) {
  switch (status) {
    case 'Open':
      return <AlertCircle size={14} className="text-blue-500" />
    case 'InProgress':
      return <Clock size={14} className="text-indigo-500" />
    case 'PendingApproval':
      return <Clock size={14} className="text-amber-500" />
    case 'Resolved':
    case 'Approved':
      return <CheckCircle2 size={14} className="text-green-500" />
    case 'Closed':
    case 'Cancelled':
    case 'Rejected':
      return <XCircle size={14} className="text-gray-400" />
    default:
      return <Clock size={14} className="text-gray-400" />
  }
}

const STATUS_LABELS: Record<WorkItemStatus, string> = {
  Open: '待处理',
  InProgress: '处理中',
  PendingApproval: '待确认',
  Approved: '已批准',
  Rejected: '已驳回',
  Resolved: '已完成',
  Closed: '已关闭',
  Cancelled: '已取消',
}

const PRIORITY_LABELS: Record<string, string> = {
  Low: '低',
  Medium: '中',
  High: '高',
  Critical: '紧急',
}

// ─── Request row component ───────────────────────────────────────────────────

function RequestRow({ item, onClick }: { item: WorkItem; onClick: () => void }) {
  const createdDate = new Date(item.createdAt).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
  const updatedDate = new Date(item.updatedAt).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      {/* ID & Title */}
      <td className="py-3.5 px-4">
        <div className="flex items-start gap-3">
          <StatusIcon status={item.status} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-700 transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{item.id}</p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
          {STATUS_LABELS[item.status]}
        </span>
      </td>

      {/* Priority */}
      <td className="py-3.5 px-4">
        <span className={`text-xs font-medium ${PRIORITY_COLORS[item.priority]}`}>
          {item.priority === 'Critical' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />}
          {PRIORITY_LABELS[item.priority]}
        </span>
      </td>

      {/* Related */}
      <td className="py-3.5 px-4">
        {item.relatedObjectId ? (
          <span className="text-xs text-gray-500 font-mono">{item.relatedObjectId}</span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>

      {/* Created */}
      <td className="py-3.5 px-4">
        <span className="text-xs text-gray-500">{createdDate}</span>
      </td>

      {/* Updated */}
      <td className="py-3.5 px-4">
        <span className="text-xs text-gray-500">{updatedDate}</span>
      </td>

      {/* Arrow */}
      <td className="py-3.5 px-2 text-right">
        <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
      </td>
    </tr>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RequestsView() {
  const { items } = useCollaboration()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('All')
  const [search, setSearch] = useState('')

  // Filter only Request type items
  const requestItems = useMemo(() => items.filter((i) => i.type === 'Request'), [items])

  // Apply tab + search filters
  const filtered = useMemo(() => {
    const tabDef = TABS.find((t) => t.key === activeTab)!
    return requestItems
      .filter((i) => {
        if (activeTab === 'All') return true
        return tabDef.statuses.includes(i.status)
      })
      .filter((i) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.relatedObjectId?.toLowerCase().includes(q) ||
          i.customerCode?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [requestItems, activeTab, search])

  // Tab counts
  const tabCount = (tab: TabDef) => {
    if (tab.key === 'All') return requestItems.length
    return requestItems.filter((i) => tab.statuses.includes(i.status)).length
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit and track your service requests. Get real-time status updates and resolve issues faster.
          </p>
        </div>
        <button
          onClick={() => navigate('/support/requests/new')}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 shadow-sm transition-colors"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      {/* ── Value-Added Services Banner ─────────────────────────────────────── */}
      <ServicesBanner />

      {/* ── Status Tabs ─────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 mb-5">
        <nav className="flex gap-0 -mb-px">
          {TABS.map((tab) => {
            const count = tabCount(tab)
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-primary-700 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, request ID, or related order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* ── Request Table ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-500 mb-1">No requests found</p>
          <p className="text-xs text-gray-400 mb-4">
            {activeTab === 'All'
              ? "You haven't submitted any requests yet."
              : 'No requests match the current filter.'}
          </p>
          <button
            onClick={() => navigate('/support/requests/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={14} />
            Submit Your First Request
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Request
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Priority
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Related
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Created
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                  Updated
                </th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <RequestRow
                  key={item.id}
                  item={item}
                  onClick={() => navigate('/support/item/' + item.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Summary bar ─────────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span>Showing {filtered.length} of {requestItems.length} requests</span>
          <span>Last updated: {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  )
}
