import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart2, FileText } from 'lucide-react'

// ─── 各子页面配置 ────────────────────────────────────────────────────────────
const PAGE_CONFIG: Record<string, { title: string; group: 'Dashboard' | 'Report'; desc: string }> = {
  kpi:           { title: 'KPI Dashboard',        group: 'Dashboard', desc: 'Key performance indicators across all operations.' },
  otif:          { title: 'OTIF Dashboard',        group: 'Dashboard', desc: 'On-Time In-Full rate tracking and trends.' },
  ticket:        { title: 'Ticket Insights',       group: 'Dashboard', desc: 'Support ticket volume, resolution time and trends.' },
  'otif-summary':{ title: 'OTIF Summary',          group: 'Report',    desc: 'Aggregated OTIF performance report by period.' },
  'lead-time':   { title: 'Lead Time Analysis',    group: 'Report',    desc: 'End-to-end lead time breakdown by lane and carrier.' },
  penalties:     { title: 'Penalties',             group: 'Report',    desc: 'Penalty events and financial impact summary.' },
  routing:       { title: 'Routing Report',        group: 'Report',    desc: 'Order routing decisions and carrier selection analysis.' },
  'root-cause':  { title: 'Root Cause Analysis',   group: 'Report',    desc: 'Systematic analysis of delays and exception drivers.' },
}

interface InsightsSubPageProps {
  pageKey: string
}

export default function InsightsSubPage({ pageKey }: InsightsSubPageProps) {
  const navigate = useNavigate()
  const config = PAGE_CONFIG[pageKey]

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-sm">Page not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary-600 hover:underline">← Back</button>
      </div>
    )
  }

  const isDashboard = config.group === 'Dashboard'

  return (
    <div className="pb-12">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft size={14} /> Back to Insights
        </button>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDashboard ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>
          {config.group}
        </span>
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          {isDashboard
            ? <BarChart2 size={22} className="text-violet-500" />
            : <FileText size={22} className="text-blue-500" />
          }
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
        </div>
        <p className="text-sm text-gray-500 ml-9">{config.desc}</p>
      </div>

      {/* Placeholder content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {[
          { label: 'Last Month', color: 'from-violet-500 to-purple-400' },
          { label: 'Last 3 Months', color: 'from-cyan-400 to-teal-400' },
          { label: 'Last 6 Months', color: 'from-emerald-400 to-green-400' },
        ].map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-5 text-white min-h-[100px] flex flex-col justify-between`}>
            <p className="text-sm font-semibold opacity-90">{card.label}</p>
            <div className="h-6 w-16 bg-white/20 rounded mt-4" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Data Overview</h3>
        </div>
        <div className="flex items-center justify-center py-20 text-gray-300">
          {isDashboard
            ? <BarChart2 size={48} />
            : <FileText size={48} />
          }
        </div>
      </div>
    </div>
  )
}
