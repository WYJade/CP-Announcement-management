import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Bot, SlidersHorizontal, X, Plus, Calendar } from 'lucide-react'
import { useCollaboration } from '../../context/CollaborationContext'
import { useI18n } from '../../context/I18nContext'
import { WorkItemCard } from './components/WorkItemCard'
import type { WorkItemType, WorkItemStatus, WorkItemPriority, WorkItemDriver, WorkItemSource } from '../../types/workItem'
import { DRIVER_LABELS } from '../../types/workItem'
import CreateWorkItemModal from './components/CreateWorkItemModal'

type SortKey = 'updatedAt' | 'createdAt' | 'priority' | 'slaDeadline'

const PRIORITY_ORDER: Record<WorkItemPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(d, today)) return '今天'
  if (isSameDay(d, yesterday)) return '昨天'
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

function dayKey(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AllWork() {
  const { items } = useCollaboration()
  const navigate = useNavigate()
  const { tt } = useI18n()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<WorkItemType | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<WorkItemStatus | 'Active' | 'All'>('Active')
  const [priorityFilter, setPriorityFilter] = useState<WorkItemPriority | 'All'>('All')
  const [driverFilter, setDriverFilter] = useState<WorkItemDriver | 'All'>('All')
  const [sourceFilter, setSourceFilter] = useState<WorkItemSource | 'All'>('All')
  const [agentOnly, setAgentOnly] = useState(false)
  const [chargeableOnly, setChargeableOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('updatedAt')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const ACTIVE_STATUSES: WorkItemStatus[] = ['Open', 'InProgress', 'PendingApproval']

  const filtered = useMemo(() => {
    let list = items

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.relatedObjectId?.toLowerCase().includes(q) ?? false)
      )
    }

    if (typeFilter !== 'All') list = list.filter((i) => i.type === typeFilter)

    if (statusFilter === 'Active') list = list.filter((i) => ACTIVE_STATUSES.includes(i.status))
    else if (statusFilter !== 'All') list = list.filter((i) => i.status === statusFilter)

    if (priorityFilter !== 'All') list = list.filter((i) => i.priority === priorityFilter)
    if (driverFilter !== 'All') list = list.filter((i) => i.driver === driverFilter)
    if (sourceFilter !== 'All') list = list.filter((i) => i.source === sourceFilter)
    if (agentOnly) list = list.filter((i) => i.isAgentGenerated)
    if (chargeableOnly) list = list.filter((i) => i.isChargeable)

    return [...list].sort((a, b) => {
      if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sort === 'slaDeadline') {
        if (!a.slaDeadline) return 1
        if (!b.slaDeadline) return -1
        return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime()
      }
      return new Date(b[sort]).getTime() - new Date(a[sort]).getTime()
    })
  }, [items, search, typeFilter, statusFilter, priorityFilter, driverFilter, sourceFilter, agentOnly, chargeableOnly, sort])

  // Group by creation date day, newest first
  const columns = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    filtered.forEach((item) => {
      const key = dayKey(item.createdAt)
      if (!map[key]) map[key] = []
      map[key].push(item)
    })
    // Sort keys descending (newest day first)
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const activeFilterCount = [
    typeFilter !== 'All',
    statusFilter !== 'Active',
    priorityFilter !== 'All',
    driverFilter !== 'All',
    sourceFilter !== 'All',
    agentOnly,
    chargeableOnly,
  ].filter(Boolean).length

  const resetFilters = () => {
    setTypeFilter('All'); setStatusFilter('Active'); setPriorityFilter('All')
    setDriverFilter('All'); setSourceFilter('All'); setAgentOnly(false); setChargeableOnly(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed top bar */}
      <div className="px-6 pt-6 pb-3 bg-white border-b border-gray-100 flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tt('All Work Items')}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filtered.length} {tt('items matching current filters')}
              {columns.length > 0 && (
                <span className="ml-2 text-gray-400">· 共 {columns.length} 天</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={15} />
            发起新请求
          </button>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索标题、ID、关联对象…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            筛选
            {activeFilterCount > 0 && (
              <span className="bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAgentOnly(!agentOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm transition-colors ${
              agentOnly ? 'bg-violet-50 border-violet-300 text-violet-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bot size={14} />
            仅 AI
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none"
          >
            <option value="updatedAt">排序：最近更新</option>
            <option value="createdAt">排序：创建时间</option>
            <option value="priority">排序：优先级</option>
            <option value="slaDeadline">排序：SLA 截止</option>
          </select>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3 flex flex-wrap gap-4">
            <FilterSelect label="类型" value={typeFilter} onChange={(v) => setTypeFilter(v as WorkItemType | 'All')}>
              <option value="All">全部类型</option>
              {(['Request', 'Approval', 'Alert', 'Project', 'Task'] as WorkItemType[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="状态" value={statusFilter} onChange={(v) => setStatusFilter(v as WorkItemStatus | 'Active' | 'All')}>
              <option value="Active">进行中</option>
              <option value="All">全部状态</option>
              {(['Open', 'InProgress', 'PendingApproval', 'Approved', 'Rejected', 'Resolved', 'Closed', 'Cancelled'] as WorkItemStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="优先级" value={priorityFilter} onChange={(v) => setPriorityFilter(v as WorkItemPriority | 'All')}>
              <option value="All">全部优先级</option>
              {(['Critical', 'High', 'Medium', 'Low'] as WorkItemPriority[]).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="场景" value={driverFilter} onChange={(v) => setDriverFilter(v as WorkItemDriver | 'All')}>
              <option value="All">全部场景</option>
              {(Object.entries(DRIVER_LABELS) as [WorkItemDriver, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="来源" value={sourceFilter} onChange={(v) => setSourceFilter(v as WorkItemSource | 'All')}>
              <option value="All">全部来源</option>
              {(['Customer', 'Agent', 'System', 'Manual'] as WorkItemSource[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </FilterSelect>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer self-end pb-1">
              <input type="checkbox" checked={chargeableOnly} onChange={(e) => setChargeableOnly(e.target.checked)} className="rounded" />
              仅计费项
            </label>

            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="text-xs text-red-500 hover:underline self-end pb-1.5 ml-auto">
                重置筛选
              </button>
            )}
          </div>
        )}
      </div>

      {/* Scrollable column area */}
      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Filter size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">没有匹配的事项</p>
            <button onClick={resetFilters} className="text-sm text-primary-600 mt-2 hover:underline">重置筛选</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 p-6 h-full" style={{ minWidth: `${columns.length * 320 + 48}px` }}>
            {columns.map(([key, colItems]) => {
              const label = formatDayLabel(key)
              const isToday = label === '今天'
              const isYesterday = label === '昨天'
              const criticalCount = colItems.filter((i) => i.priority === 'Critical').length
              const pendingCount = colItems.filter((i) => i.status === 'PendingApproval').length

              return (
                <div
                  key={key}
                  className="flex flex-col flex-shrink-0 w-72"
                >
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b-2 mb-2 ${
                    isToday
                      ? 'bg-primary-50 border-primary-400'
                      : isYesterday
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className={isToday ? 'text-primary-500' : 'text-gray-400'} />
                      <span className={`text-sm font-bold ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                        {label}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full font-medium">今</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {criticalCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                          {criticalCount} 紧急
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">
                          {pendingCount} 待批
                        </span>
                      )}
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {colItems.length}
                      </span>
                    </div>
                  </div>

                  {/* Full date subtitle */}
                  {!isToday && !isYesterday && (
                    <p className="text-xs text-gray-400 px-1 mb-2">
                      {new Date(key).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                    </p>
                  )}
                  {isToday && (
                    <p className="text-xs text-primary-400 px-1 mb-2">
                      {new Date(key).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                    </p>
                  )}
                  {isYesterday && (
                    <p className="text-xs text-amber-400 px-1 mb-2">
                      {new Date(key).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                    </p>
                  )}

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
                    {colItems.map((item) => (
                      <WorkItemCard
                        key={item.id}
                        item={item}
                        onClick={() => navigate('/collaboration/item/' + item.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showCreate && <CreateWorkItemModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function FilterSelect({
  label, value, onChange, children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none bg-white"
      >
        {children}
      </select>
    </div>
  )
}
