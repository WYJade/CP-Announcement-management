import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, Clock, Info } from 'lucide-react'
import type { WorkItemDriver } from '../../../types/workItem'
import { SCENARIO_TEMPLATES } from '../../../data/processFlowTemplates'

interface ScenarioIntroProps {
  driver: WorkItemDriver
  showMiniFlow?: boolean
  defaultExpanded?: boolean
}

export default function ScenarioIntro({ driver, showMiniFlow = true, defaultExpanded = false }: ScenarioIntroProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const template = SCENARIO_TEMPLATES[driver]

  if (!template) return null

  return (
    <div className={`rounded-xl border ${template.border} ${template.bg} mb-5`}>
      {/* Collapsed header — always visible */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${template.iconBg}`}>
            <Info size={15} className={template.color} />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${template.color}`}>
              Scenario Guide
            </p>
            <p className="text-sm font-semibold text-gray-800">{template.scenarioName}</p>
          </div>
        </div>
        <span className="text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-opacity-50" style={{ borderColor: 'inherit' }}>
          <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: description + guidance */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                  <Info size={12} />
                  About This Scenario
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{template.scenarioDescription}</p>
              </div>

              <div className={`rounded-lg px-3 py-2.5 border ${template.border} bg-white/60`}>
                <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1.5">
                  <Lightbulb size={12} className="text-yellow-500" />
                  Operator Guidance
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">{template.guidance}</p>
              </div>

              {template.slaNote && (
                <div className="rounded-lg px-3 py-2 bg-white/60 border border-gray-200 flex items-start gap-2">
                  <Clock size={12} className="text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-500">{template.slaNote}</p>
                </div>
              )}
            </div>

            {/* Right: mini process flow preview */}
            {showMiniFlow && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                  Process Overview ({template.steps.length} stages)
                </p>
                <div className="space-y-1.5">
                  {template.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-start gap-2.5">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${template.border} ${template.color} bg-white`}>
                          {step.step}
                        </div>
                        {idx < template.steps.length - 1 && (
                          <div className={`w-0.5 h-3 mt-0.5 ${template.border} border-l`} />
                        )}
                      </div>
                      {/* Label */}
                      <div className="pb-1">
                        <span className={`text-xs font-semibold ${template.color}`}>{step.label}</span>
                        <span className="text-xs text-gray-400 ml-1.5">— {step.sublabel}</span>
                        {step.isDecision && (
                          <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                            Decision
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
