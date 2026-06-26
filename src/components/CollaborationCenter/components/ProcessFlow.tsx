import { useState } from 'react'
import {
  CheckCircle2, Bot, Building2, User, Settings, Users2,
  ChevronDown, ChevronUp, ClipboardList, Zap, AlertTriangle,
} from 'lucide-react'
import type { ScenarioFlowTemplate, ResponsibleParty } from '../../../data/processFlowTemplates'
import { getStepCompletionStatus, getCurrentStep } from '../../../data/processFlowTemplates'
import type { WorkItemStatus } from '../../../types/workItem'

interface ProcessFlowProps {
  template: ScenarioFlowTemplate
  currentStatus: WorkItemStatus
  onActionClick?: (action: string) => void
}

const RESPONSIBLE_ICONS: Record<ResponsibleParty, React.ReactNode> = {
  Warehouse: <Building2 size={11} />,
  Customer: <User size={11} />,
  System: <Settings size={11} />,
  Agent: <Bot size={11} />,
  Joint: <Users2 size={11} />,
}

const RESPONSIBLE_COLORS: Record<ResponsibleParty, string> = {
  Warehouse: 'bg-blue-100 text-blue-700',
  Customer: 'bg-green-100 text-green-700',
  System: 'bg-gray-100 text-gray-600',
  Agent: 'bg-violet-100 text-violet-700',
  Joint: 'bg-indigo-100 text-indigo-700',
}



export default function ProcessFlow({ template, currentStatus, onActionClick }: ProcessFlowProps) {
  const completionMap = getStepCompletionStatus(template, currentStatus)
  const currentStepId = getCurrentStep(template, currentStatus)
  const currentStep = template.steps.find((s) => s.id === currentStepId)
  const [expandedDetail, setExpandedDetail] = useState(true)
  const [selectedStepId, setSelectedStepId] = useState<string>(currentStepId)

  const selectedStep = template.steps.find((s) => s.id === selectedStepId) ?? currentStep

  const completedCount = Object.values(completionMap).filter((v) => v === 'completed').length
  const totalSteps = template.steps.length

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-3 border-b ${template.border} ${template.bg} flex items-center justify-between`}>
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${template.color}`}>Process Flow</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{template.scenarioName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">Progress</p>
            <p className={`text-sm font-bold ${template.color}`}>
              {completedCount} / {totalSteps} steps
            </p>
          </div>
          {/* Progress ring */}
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(completedCount / totalSteps) * 88} 88`}
                className={completedCount === totalSteps ? 'stroke-green-500' : 'stroke-primary-500'}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
              {Math.round((completedCount / totalSteps) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Flow nodes row */}
      <div className="px-5 pt-5 pb-3 overflow-x-auto">
        <div className="flex items-start justify-between min-w-max gap-0">
          {template.steps.map((step, idx) => {
            const status = completionMap[step.id] ?? 'pending'
            const isActive = step.id === selectedStepId
            return (
              <div
                key={step.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  setSelectedStepId(step.id)
                  setExpandedDetail(true)
                }}
              >
                {/* Node circle */}
                <div className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all ${
                  status === 'completed'
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200 scale-110'
                    : 'bg-white border-gray-200 text-gray-400 group-hover:border-gray-400'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{step.step}</span>
                  )}
                  {step.isDecision && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                      <AlertTriangle size={7} className="text-white" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center" style={{ width: '80px' }}>
                  <p className={`text-[10px] font-semibold leading-tight ${
                    status === 'completed' ? 'text-green-600' :
                    isActive ? 'text-primary-700' :
                    'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {step.label}
                  </p>
                  <span className={`inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${RESPONSIBLE_COLORS[step.responsible]}`}>
                    {RESPONSIBLE_ICONS[step.responsible]}
                    {step.responsible}
                  </span>
                </div>

                {/* Connector line (after each node except last) */}
                {idx < template.steps.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            )
          })}
        </div>

        {/* Connector lines row (between nodes, as a separate row) */}
        <div className="flex items-center mt-0" style={{ marginTop: '-60px', paddingBottom: '60px', pointerEvents: 'none' }}>
          {template.steps.map((step, idx) => (
            <div key={step.id} className="flex items-center" style={{ width: idx < template.steps.length - 1 ? '80px' : '80px' }}>
              <div style={{ width: '36px' }} />
              {idx < template.steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${
                  completionMap[step.id] === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active step detail panel */}
      {selectedStep && (
        <div className="border-t border-gray-100">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setExpandedDetail(!expandedDetail)}
          >
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                completionMap[selectedStep.id] === 'completed'
                  ? 'bg-green-500 text-white'
                  : selectedStep.id === currentStepId
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedStep.step}
              </span>
              <span className="text-sm font-semibold text-gray-800">{selectedStep.label}</span>
              {selectedStep.id === currentStepId && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                  Current Stage
                </span>
              )}
              {completionMap[selectedStep.id] === 'completed' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                  Completed
                </span>
              )}
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${RESPONSIBLE_COLORS[selectedStep.responsible]}`}>
                {RESPONSIBLE_ICONS[selectedStep.responsible]}
                {selectedStep.responsible}
              </span>
            </div>
            <span className="text-gray-400">
              {expandedDetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {expandedDetail && (
            <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: description + key content */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedStep.description}</p>

                <div className="space-y-3">
                  {/* Key content handled — derived from the 8-stage fields on this step */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <ClipboardList size={12} />
                      Key Content Handled
                    </h4>
                    <ul className="space-y-1">
                      {[
                        selectedStep.triggerNote && `Triggered by: ${selectedStep.triggerNote}`,
                        selectedStep.recipientNote && `Assigned to: ${selectedStep.recipientNote}`,
                        selectedStep.notificationNote && `Notification: ${selectedStep.notificationNote}`,
                        ...(selectedStep.evidenceRequired ?? []).map((e) => `Evidence: ${e}`),
                        selectedStep.feeNote && `Charges: ${selectedStep.feeNote}`,
                        selectedStep.closeNote && `Closure: ${selectedStep.closeNote}`,
                      ].filter(Boolean).map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                          {line as string}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Checklist if present */}
                  {selectedStep.checklist && selectedStep.checklist.length > 0 && (
                    <div className={`rounded-lg p-3 ${template.bg} border ${template.border}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${template.color}`}>
                        <CheckCircle2 size={12} />
                        Stage Checklist
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedStep.checklist.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <input type="checkbox" className="mt-0.5 rounded shrink-0 accent-primary-600" readOnly />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: available actions + decision info */}
              <div className="space-y-3">
                {/* Actions */}
                {selectedStep.actions && selectedStep.actions.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <Zap size={12} />
                      Available Operations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStep.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => onActionClick?.(action)}
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision node info */}
                {selectedStep.isDecision && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      Decision Point
                    </h4>
                    <p className="text-xs text-amber-700 mb-1">
                      This step requires an explicit decision from the responsible party.
                    </p>
                    {selectedStep.outcomeIfRejected && (
                      <p className="text-xs text-amber-600">
                        <span className="font-semibold">If declined:</span> {selectedStep.outcomeIfRejected}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation hint: steps before / after */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Flow Position</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {selectedStep.step > 1 && (
                      <span>← Step {selectedStep.step - 1}: {template.steps[selectedStep.step - 2]?.label}</span>
                    )}
                    {selectedStep.step > 1 && selectedStep.step < template.steps.length && (
                      <span className="text-gray-300">|</span>
                    )}
                    {selectedStep.step < template.steps.length && (
                      <span>Step {selectedStep.step + 1}: {template.steps[selectedStep.step]?.label} →</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
