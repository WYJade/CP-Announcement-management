import { useState } from 'react'
import { AlertTriangle, Bot, CheckCircle, ArrowUpRight, Bell, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCollaboration } from '../../context/CollaborationContext'
import { DRIVER_LABELS, DRIVER_COLORS, PRIORITY_COLORS } from '../../types/workItem'
import ScenarioIntro from './components/ScenarioIntro'

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }

export default function AlertsView() {
  const { items, updateStatus } = useCollaboration()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'open' | 'agent'>('open')

  const alertItems = items.filter((i) => i.type === 'Alert')

  const displayed = alertItems
    .filter((i) => {
      if (filter === 'open') return ['Open', 'InProgress'].includes(i.status)
      if (filter === 'agent') return i.isAgentGenerated
      return true
    })
    .sort((a, b) => SEVERITY_ORDER[a.priority] - SEVERITY_ORDER[b.priority])

  const openCount = alertItems.filter((i) => ['Open', 'InProgress'].includes(i.status)).length
  const agentCount = alertItems.filter((i) => i.isAgentGenerated).length
  const criticalCount = alertItems.filter((i) => i.priority === 'Critical' && ['Open', 'InProgress'].includes(i.status)).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">
          System and AI-detected issues. Acknowledge, escalate, or resolve each alert.
        </p>
      </div>

      {/* Scenario intros — two drivers shown in alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
        <ScenarioIntro driver="IssueDriven" showMiniFlow={false} />
        <ScenarioIntro driver="EventDriven" showMiniFlow={false} />
      </div>

      {/* Summary banner */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">{criticalCount} Critical alert{criticalCount > 1 ? 's' : ''} require immediate attention</p>
            <p className="text-xs text-red-600 mt-0.5">Review and act on critical items to prevent SLA breach.</p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="flex gap-3 mb-5">
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm">
          <span className="font-bold text-orange-700">{openCount}</span>
          <span className="text-orange-600 ml-1">Open</span>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 text-sm">
          <Bot size={13} className="inline mr-1 text-violet-600" />
          <span className="font-bold text-violet-700">{agentCount}</span>
          <span className="text-violet-600 ml-1">AI-Generated</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
          <span className="font-bold text-red-700">{criticalCount}</span>
          <span className="text-red-600 ml-1">Critical</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {[
          { key: 'open', label: `Active (${openCount})` },
          { key: 'agent', label: `AI-Generated (${agentCount})` },
          { key: 'all', label: `All (${alertItems.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
              filter === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No alerts in this view</p>
          </div>
        )}

        {displayed.map((item) => {
          const isResolvable = ['Open', 'InProgress'].includes(item.status)

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-4 ${
                item.priority === 'Critical'
                  ? 'border-red-300 bg-red-50/30'
                  : item.priority === 'High'
                  ? 'border-orange-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Severity icon */}
                <div className={`shrink-0 p-2 rounded-lg mt-0.5 ${
                  item.priority === 'Critical' ? 'bg-red-100' :
                  item.priority === 'High' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {item.isAgentGenerated ? (
                    <Bot size={16} className={PRIORITY_COLORS[item.priority]} />
                  ) : (
                    <Zap size={16} className={PRIORITY_COLORS[item.priority]} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wide ${PRIORITY_COLORS[item.priority]}`}>
                      {item.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DRIVER_COLORS[item.driver]}`}>
                      {DRIVER_LABELS[item.driver]}
                    </span>
                    {item.isAgentGenerated && (
                      <span className="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-medium flex items-center gap-1">
                        <Bot size={10} /> {item.agentName ?? 'AI Agent'}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 font-mono ml-auto">{item.id}</span>
                  </div>

                  <h3
                    className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-primary-700 mb-1"
                    onClick={() => navigate(`/collaboration/item/${item.id}`)}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>

                  {item.relatedObjectId && (
                    <div className="text-xs text-gray-400 mb-3">
                      {item.relatedObjectType}: <span className="font-medium text-gray-600">{item.relatedObjectId}</span>
                    </div>
                  )}

                  {/* Comments from AI */}
                  {item.comments.filter(c => c.role === 'Agent').map((c) => (
                    <div key={c.id} className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 mb-3 text-xs text-violet-800">
                      <Bot size={11} className="inline mr-1" />
                      {c.content}
                    </div>
                  ))}

                  {/* Action row */}
                  <div className="flex items-center gap-3">
                    {isResolvable && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, 'InProgress')}
                          className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'Resolved', 'Marked resolved from Alerts view')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle size={12} />
                          Resolve
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate(`/collaboration/item/${item.id}`)}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:underline ml-auto"
                    >
                      Full Details <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
