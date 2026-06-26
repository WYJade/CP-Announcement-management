import { useState } from 'react'
import { FolderOpen, Plus, DollarSign, Bot, ChevronRight, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCollaboration } from '../../context/CollaborationContext'
import { DRIVER_COLORS, DRIVER_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '../../types/workItem'
import CreateWorkItemModal from './components/CreateWorkItemModal'
import ScenarioIntro from './components/ScenarioIntro'

export default function ProjectsView() {
  const { items } = useCollaboration()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)

  const projects = items
    .filter((i) => i.type === 'Project')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const activeProjects = projects.filter((p) => ['Open', 'InProgress'].includes(p.status))
  const totalValue = projects.reduce((acc, p) => acc + (p.estimatedFee ?? 0), 0)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collaboration Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Joint warehouse–customer initiatives. Long-running engagements with milestones and budgets.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={15} />
          New Project
        </button>
      </div>

      {/* Scenario intro */}
      <ScenarioIntro driver="CollaborationDriven" showMiniFlow />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-indigo-700">{activeProjects.length}</div>
          <div className="text-xs font-medium text-indigo-600 mt-0.5">Active Projects</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-700">${(totalValue / 1000).toFixed(1)}K</div>
          <div className="text-xs font-medium text-green-600 mt-0.5">Total Value Pipeline</div>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-violet-700">
            {projects.filter((p) => p.isAgentGenerated).length}
          </div>
          <div className="text-xs font-medium text-violet-600 mt-0.5">AI-Initiated</div>
        </div>
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FolderOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No collaboration projects yet</p>
          <button onClick={() => setShowCreate(true)} className="text-sm text-primary-600 mt-2 hover:underline">
            Start a project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const slaDeadline = project.slaDeadline
              ? new Date(project.slaDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null

            return (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => navigate(`/collaboration/item/${project.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-xs text-gray-400 font-mono">{project.id}</span>
                      {project.isAgentGenerated && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-medium">
                          <Bot size={10} /> AI
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[project.status]}`}>
                        {project.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DRIVER_COLORS[project.driver]}`}>
                        {DRIVER_LABELS[project.driver]}
                      </span>
                      <span className={`text-xs font-bold ${PRIORITY_COLORS[project.priority]}`}>
                        ● {project.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>

                    {/* Project metadata row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {project.customerCode && (
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {project.customerCode}
                        </span>
                      )}
                      {project.isChargeable && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign size={11} />
                          {project.currency} {project.estimatedFee?.toLocaleString()} est.
                          <span className="text-green-500">({project.billingStatus})</span>
                        </span>
                      )}
                      {slaDeadline && (
                        <span>Target: {slaDeadline}</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-gray-300 group-hover:text-primary-500 transition-colors mt-1"
                  />
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showCreate && <CreateWorkItemModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
