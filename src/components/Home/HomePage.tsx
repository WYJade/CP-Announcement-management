import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Package, Truck, Bot, CheckCircle2, Clock,
  TrendingDown, Warehouse, Ship, DollarSign, Zap, RefreshCw,
  AlertCircle, Activity, MapPin, X, ArrowRight, ExternalLink,
  Calendar, FileText, Send, ChevronRight, BarChart2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModalState {
  type: 'stat' | 'exception' | 'task' | 'agent-action' | null
  data: Record<string, unknown> | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SUMMARY_STATS = [
  {
    label: 'In-Transit Shipments', value: '1,248', sub: '+12 today',
    color: 'text-blue-600', bg: 'bg-blue-50',
    detail: {
      title: 'In-Transit Shipments',
      items: [
        { label: 'Ocean — Asia to US West Coast', count: 542, status: 'normal' },
        { label: 'Ocean — Asia to US East Coast', count: 398, status: 'normal' },
        { label: 'Drayage — Enroute to Warehouse', count: 187, status: 'warning' },
        { label: 'Available at Terminal', count: 121, status: 'alert' },
      ],
      cta: { label: 'View Shipment Tracking', path: '/international-new/tracking' },
    },
  },
  {
    label: "Today's Appointments", value: '86', sub: '14 pending confirm',
    color: 'text-violet-600', bg: 'bg-violet-50',
    detail: {
      title: "Today's Warehouse Appointments",
      items: [
        { label: 'Confirmed', count: 52, status: 'normal' },
        { label: 'Pending Confirmation', count: 14, status: 'alert' },
        { label: 'At Risk (vehicle en route)', count: 8, status: 'warning' },
        { label: 'Completed', count: 12, status: 'normal' },
      ],
      cta: { label: 'Manage Appointments', path: '/inbound/inquiry' },
    },
  },
  {
    label: 'High-Risk Exceptions', value: '27', sub: '5 new since yesterday',
    color: 'text-red-600', bg: 'bg-red-50',
    detail: {
      title: 'High-Risk Exceptions Breakdown',
      items: [
        { label: 'Container DEM/DET Risk', count: 9, status: 'alert' },
        { label: 'Customs Hold', count: 3, status: 'alert' },
        { label: 'Appointment Unconfirmed', count: 6, status: 'warning' },
        { label: 'Inventory Shortage', count: 5, status: 'warning' },
        { label: 'OTIF Penalty Risk', count: 4, status: 'warning' },
      ],
      cta: { label: 'View All Exceptions', path: '/international-new/tracking' },
    },
  },
  {
    label: 'OTIF Risk', value: '14', sub: 'P1: 3 / P2: 11',
    color: 'text-orange-600', bg: 'bg-orange-50',
    detail: {
      title: 'OTIF At-Risk Orders',
      items: [
        { label: 'P1 — Below 95% threshold', count: 3, status: 'alert' },
        { label: 'P2 — 95–97% (approaching)', count: 11, status: 'warning' },
      ],
      cta: { label: 'Open OTIF Dashboard', path: '/dashboard/otif' },
    },
  },
  {
    label: 'Demurrage / Detention', value: '9', sub: 'Containers at risk',
    color: 'text-amber-600', bg: 'bg-amber-50',
    detail: {
      title: 'Demurrage / Detention At-Risk',
      items: [
        { label: 'LFD Exceeded — Immediate action', count: 3, status: 'alert' },
        { label: 'LFD Within 24 hrs', count: 4, status: 'warning' },
        { label: 'LFD Within 48 hrs', count: 2, status: 'normal' },
      ],
      cta: { label: 'View Container List', path: '/international-new/tracking' },
    },
  },
  {
    label: 'Pending Tasks', value: '43', sub: '18 overdue',
    color: 'text-emerald-600', bg: 'bg-emerald-50',
    detail: {
      title: 'Pending Tasks Summary',
      items: [
        { label: 'Overdue', count: 18, status: 'alert' },
        { label: 'Due Today', count: 9, status: 'warning' },
        { label: 'Due This Week', count: 16, status: 'normal' },
      ],
      cta: { label: 'View All Tasks', path: '/' },
    },
  },
]

const MY_TASKS = [
  { id: 1, title: 'Confirm receiving appointment for SSHAS2608270', type: 'Appointment', priority: 'P1', due: 'Today 14:00', status: 'Overdue', path: '/international-new/tracking', detail: 'SSHAS2608270 is scheduled for Jun 19 warehouse receiving at UNIS Seabrook. Appointment APPT-6007808 has not been confirmed by the warehouse team.' },
  { id: 2, title: 'Resolve customs hold on SSHAS2608135', type: 'Customs', priority: 'P1', due: 'Today 17:00', status: 'Urgent', path: '/international-new/tracking', detail: 'Customs entry 82G-0101679-0 is on hold awaiting additional documentation. Container is at Savannah port. LFD is Jun 20.' },
  { id: 3, title: 'Review invoice dispute INV-20260601', type: 'Finance', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/finance/invoices', detail: 'Customer THE ONLY BEAN LLC has disputed INV-20260601 for $3,240. Dispute reason: quantity mismatch on shipment SSHAS2608135.' },
  { id: 4, title: 'Update freight quote for ADOORN LLC', type: 'Outbound', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/outbound/freight-quote', detail: 'ADOORN LLC requested a revised freight quote for 2x40HC from Shenzhen to Savannah. Quote valid window expires Aug 6.' },
  { id: 5, title: 'Cycle count discrepancy in Inventory', type: 'Inventory', priority: 'P3', due: 'Aug 6', status: 'In Progress', path: '/inventory/activity', detail: 'SKU ADPOST-SMALL-RED shows a variance of -2 units in cycle count at Long Beach DC. Investigation in progress.' },
]

const EXCEPTIONS = [
  {
    priority: 'P1', label: 'Container DEM Risk', desc: '3 containers past LFD at Garden City Terminal',
    action: 'Review & assign', color: 'bg-red-500', path: '/international-new/tracking',
    actionType: 'dispatch',
    detail: 'Containers WHSU8555505, XYLU8225020, SELU4350353 are past last free day. Daily demurrage rate: $150/container/day.',
    steps: ['Select trucker', 'Confirm pickup appointment', 'Notify warehouse', 'Track dispatch'],
  },
  {
    priority: 'P1', label: 'Appointment at risk', desc: 'Jun 19 appointment for SSHAS2608270 not confirmed',
    action: 'Reschedule', color: 'bg-red-500', path: '/international-new/tracking',
    actionType: 'reschedule',
    detail: 'Warehouse appointment APPT-6007808 for Jun 19, 10:00 at UNIS Seabrook has not been confirmed. Vehicle is OFD.',
    steps: ['Select new appointment slot', 'Notify carrier', 'Update warehouse system'],
  },
  {
    priority: 'P2', label: 'Inventory shortage', desc: 'SKU ADPOST-SMALL-RED below safety stock',
    action: 'Check allocation', color: 'bg-orange-400', path: '/inventory/activity',
    actionType: 'allocation',
    detail: 'Current stock: 68 units. Safety stock level: 80 units. Incoming shipment expected Jun 21 (SSHAS2608270).',
    steps: ['Review current allocation', 'Check inbound pipeline', 'Reallocate from alternate DC'],
  },
  {
    priority: 'P2', label: 'OTIF penalty risk', desc: '5 orders approaching 97% OTIF threshold',
    action: 'Open RCA', color: 'bg-orange-400', path: '/dashboard/otif',
    actionType: 'rca',
    detail: 'Orders for VITA COCO and ORGAIN LLC are at 95.8% OTIF. Any additional delay this week triggers penalty clause.',
    steps: ['Identify root cause', 'Document RCA', 'Submit corrective action plan'],
  },
  {
    priority: 'P3', label: 'Invoice dispute', desc: 'INV-20260601 disputed by THE ONLY BEAN LLC',
    action: 'Review documents', color: 'bg-blue-400', path: '/finance/invoices',
    actionType: 'document',
    detail: 'Dispute filed Aug 1. Amount: $3,240. Reason: quantity mismatch. POD and packing list attached.',
    steps: ['Review POD', 'Compare packing list', 'Respond to customer within 3 business days'],
  },
]

const MODULES = [
  { title: 'Inbound & Yard', sub: 'Appointments, Gate, Receipt variance', icon: <Package size={18} className="text-blue-500" />, path: '/inbound/inquiry', color: 'border-blue-100 hover:border-blue-300' },
  { title: 'Outbound', sub: 'Orders, Carrier, Tracking', icon: <Truck size={18} className="text-indigo-500" />, path: '/outbound/inquiry', color: 'border-indigo-100 hover:border-indigo-300' },
  { title: 'Shipment Tracking', sub: 'International containers & milestones', icon: <Ship size={18} className="text-teal-500" />, path: '/international-new/tracking', color: 'border-teal-100 hover:border-teal-300' },
  { title: 'Inventory', sub: 'Exceptions, SN, Adjustments', icon: <Warehouse size={18} className="text-emerald-500" />, path: '/inventory/activity', color: 'border-emerald-100 hover:border-emerald-300' },
  { title: 'Finance', sub: 'Invoice, Claim, Deduction', icon: <DollarSign size={18} className="text-amber-500" />, path: '/finance/invoices', color: 'border-amber-100 hover:border-amber-300' },
  { title: 'Insights', sub: 'OTIF, KPI, Analytics', icon: <BarChart2 size={18} className="text-violet-500" />, path: '/insights', color: 'border-violet-100 hover:border-violet-300' },
]

// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

// ─── Stat Detail Modal ────────────────────────────────────────────────────────
function StatDetailModal({ stat, onClose }: { stat: typeof SUMMARY_STATS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">{stat.detail.title}</h3>
        <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-5 space-y-2.5">
        {stat.detail.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${item.status === 'alert' ? 'bg-red-500' : item.status === 'warning' ? 'bg-orange-400' : 'bg-green-400'}`} />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <span className={`text-sm font-bold ${item.status === 'alert' ? 'text-red-600' : item.status === 'warning' ? 'text-orange-600' : 'text-gray-700'}`}>{item.count}</span>
          </div>
        ))}
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={() => { navigate(stat.detail.cta.path); onClose() }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ExternalLink size={14} /> {stat.detail.cta.label}
        </button>
      </div>
    </Modal>
  )
}

// ─── Exception Action Modal ───────────────────────────────────────────────────
function ExceptionModal({ ex, onClose }: { ex: typeof EXCEPTIONS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${ex.color}`}>{ex.priority}</span>
          <h3 className="text-sm font-bold text-gray-900">{ex.label}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ex.detail}</p>

        {!submitted ? (
          <>
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Action Steps:</p>
              <div className="space-y-2">
                {ex.steps.map((s, i) => (
                  <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors cursor-pointer ${i <= step ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-white'}`}
                    onClick={() => setStep(i)}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs ${i <= step ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{s}</span>
                    {i === step && <ChevronRight size={12} className="text-primary-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 block mb-1">Notes / Action taken</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 resize-none focus:outline-none focus:border-primary-400"
                placeholder="Add notes about this action..." />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigate(ex.path); onClose() }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                <ExternalLink size={12} /> View Details
              </button>
              <button onClick={() => { if (step < ex.steps.length - 1) setStep(s => s + 1); else setSubmitted(true) }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
                <Send size={12} /> {step < ex.steps.length - 1 ? 'Next Step' : 'Submit Action'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-800">Action Submitted</p>
            <p className="text-xs text-gray-500 mt-1">The team has been notified. You can track progress in My Tasks.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors">Done</button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ─── Task Detail Modal ────────────────────────────────────────────────────────
function TaskModal({ task, onClose }: { task: typeof MY_TASKS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${task.priority === 'P1' ? 'bg-red-500' : task.priority === 'P2' ? 'bg-orange-400' : 'bg-gray-400'}`}>{task.priority}</span>
          <h3 className="text-sm font-bold text-gray-900 truncate">{task.title}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{task.type}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><Clock size={9} /> Due: {task.due}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{task.detail}</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            Dismiss
          </button>
          <button onClick={() => { navigate(task.path); onClose() }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
            <ArrowRight size={12} /> Go to {task.type}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Network Map ──────────────────────────────────────────────────────────────
function NetworkMap({ onLocClick }: { onLocClick: (loc: { name: string; type: string; count: number; status: string }) => void }) {
  const locations = [
    { id: 'shanghai', name: 'Shanghai', type: 'origin', x: 72, y: 38, count: 8, status: 'active' },
    { id: 'ningbo', name: 'Ningbo', type: 'origin', x: 74, y: 44, count: 5, status: 'active' },
    { id: 'haiphong', name: 'Haiphong', type: 'origin', x: 68, y: 52, count: 3, status: 'active' },
    { id: 'savannah', name: 'Savannah', type: 'pod', x: 22, y: 40, count: 6, status: 'alert' },
    { id: 'longbeach', name: 'Long Beach', type: 'pod', x: 8, y: 42, count: 9, status: 'active' },
    { id: 'newyork', name: 'New York', type: 'pod', x: 24, y: 32, count: 4, status: 'active' },
    { id: 'unis-seabrook', name: 'UNIS Seabrook', type: 'warehouse', x: 25, y: 42, count: 4, status: 'receiving' },
    { id: 'garden-city', name: 'Garden City', type: 'terminal', x: 21, y: 39, count: 3, status: 'alert' },
    { id: 'lbct', name: 'LBCT Terminal', type: 'terminal', x: 7, y: 41, count: 5, status: 'active' },
  ]
  const routes = [
    { from: { x: 72, y: 38 }, to: { x: 22, y: 40 }, status: 'active' },
    { from: { x: 74, y: 44 }, to: { x: 8, y: 42 }, status: 'active' },
    { from: { x: 68, y: 52 }, to: { x: 24, y: 32 }, status: 'alert' },
  ]
  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height: '260px' }}>
      <svg viewBox="0 0 100 70" className="w-full h-full cursor-pointer" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="100" height="70" fill="#0f172a" />
        <ellipse cx="48" cy="45" rx="25" ry="18" fill="#1e3a5f" opacity="0.4" />
        <path d="M 60 20 Q 75 15 85 22 Q 90 30 88 45 Q 82 60 75 65 L 65 65 Q 58 58 60 45 Q 58 35 60 20 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.3" />
        <path d="M 0 15 Q 15 10 28 18 Q 35 25 33 40 Q 30 55 20 62 Q 10 65 2 60 Q 0 50 0 35 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.3" />
        {routes.map((r, i) => (
          <path key={i} d={`M ${r.from.x} ${r.from.y} Q 48 ${r.from.y - 8} ${r.to.x} ${r.to.y}`}
            fill="none" stroke={r.status === 'alert' ? '#f97316' : '#6366f1'} strokeWidth="0.5" strokeDasharray="2 1" opacity="0.7" />
        ))}
        <circle cx="48" cy="35" r="1" fill="#818cf8" opacity="0.9">
          <animateMotion dur="6s" repeatCount="indefinite" path="M 72 38 Q 48 30 22 40" />
        </circle>
        <circle cx="48" cy="38" r="1" fill="#818cf8" opacity="0.7">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 74 44 Q 48 36 8 42" />
        </circle>
        {locations.map(loc => {
          const color = loc.status === 'alert' ? '#f97316' : loc.type === 'warehouse' ? '#22c55e' : loc.type === 'origin' ? '#6366f1' : '#14b8a6'
          const size = loc.type === 'warehouse' || loc.type === 'pod' ? 1.8 : 1.3
          return (
            <g key={loc.id} onClick={() => onLocClick(loc)} style={{ cursor: 'pointer' }}>
              <circle cx={loc.x} cy={loc.y} r={size + 2} fill="transparent" />
              <circle cx={loc.x} cy={loc.y} r={size + 0.8} fill={color} opacity="0.2" />
              <circle cx={loc.x} cy={loc.y} r={size} fill={color} stroke="white" strokeWidth="0.3" />
              {loc.count > 5 && (
                <circle cx={loc.x} cy={loc.y} r={size + 1.5} fill={color} opacity="0.15">
                  <animate attributeName="r" values={`${size};${size + 2};${size}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={loc.x + 1.5} y={loc.y + 0.5} fill="white" fontSize="2.2" fontWeight="600" opacity="0.9">{loc.name}</text>
              <text x={loc.x + 1.5} y={loc.y + 2.8} fill={color} fontSize="1.8" opacity="0.8">{loc.count} {loc.type === 'warehouse' ? 'receiving' : loc.type === 'origin' ? 'vessels' : 'containers'}</text>
            </g>
          )
        })}
      </svg>
      <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-slate-900/80 rounded-lg px-2.5 py-1 backdrop-blur-sm">
        {[['#6366f1','Origin'],['#14b8a6','Port/Terminal'],['#22c55e','Warehouse'],['#f97316','Alert']].map(([c,l]) => (
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c as string }} />
            <span className="text-[9px] text-gray-300">{l}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 bg-slate-900/80 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
        <p className="text-xs font-bold text-white">1,248 <span className="text-[10px] font-normal text-gray-400">in transit</span></p>
        <p className="text-xs font-bold text-orange-400">27 <span className="text-[10px] font-normal text-gray-400">exceptions</span></p>
      </div>
    </div>
  )
}

// ─── Location Detail Modal ────────────────────────────────────────────────────
function LocationModal({ loc, onClose }: { loc: { name: string; type: string; count: number; status: string } | null; onClose: () => void }) {
  const navigate = useNavigate()
  if (!loc) return null
  const isAlert = loc.status === 'alert'
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} className={isAlert ? 'text-orange-500' : 'text-indigo-500'} />
          <h3 className="text-sm font-bold text-gray-900">{loc.name}</h3>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${isAlert ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{loc.type}</span>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-5">
        <div className={`rounded-lg p-3 mb-4 ${isAlert ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
          <p className="text-xs text-gray-600">Active {loc.type === 'warehouse' ? 'receiving' : loc.type === 'origin' ? 'vessel departures' : 'containers'}: <span className="font-bold text-gray-900">{loc.count}</span></p>
          {isAlert && <p className="text-xs text-orange-600 mt-1 font-medium">⚠ Exception detected — action may be required</p>}
        </div>
        <button onClick={() => { navigate('/international-new/tracking'); onClose() }}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <ExternalLink size={14} /> View Shipments at {loc.name}
        </button>
      </div>
    </Modal>
  )
}

// ─── AI Agent Panel ───────────────────────────────────────────────────────────
function AIAgentPanel({ onAction }: { onAction: (action: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const suggestions = [
    { icon: <AlertTriangle size={12} className="text-red-400" />, text: '3 containers at Garden City Terminal are past LFD. Recommend expedite dispatch today to avoid daily demurrage charges.', action: 'Initiate dispatch', priority: 'P1' },
    { icon: <TrendingDown size={12} className="text-orange-400" />, text: 'OTIF score trending to 93.2% for Week 35. 5 orders at risk. Suggest confirming carrier delivery windows before EoD.', action: 'Review orders', priority: 'P2' },
    { icon: <RefreshCw size={12} className="text-blue-400" />, text: 'Inventory cycle count variance detected for SKU ADPOST-SMALL-RED. Recommend reallocating from Savannah DC.', action: 'Check allocation', priority: 'P2' },
  ]
  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
            <Bot size={13} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">AI Agent Analysis</p>
            <p className="text-[10px] text-gray-500">Recommended actions based on current exceptions</p>
          </div>
        </div>
        <button onClick={() => setExpanded(v => !v)} className="text-[10px] text-violet-600 hover:underline font-medium">
          {expanded ? 'Show less' : 'Show all'}
        </button>
      </div>
      <div className="space-y-2.5">
        {suggestions.slice(0, expanded ? 3 : 2).map((s, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-violet-100">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-700 leading-relaxed">{s.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${s.priority === 'P1' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{s.priority}</span>
                  <button onClick={() => onAction(s.action)} className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-800 font-medium">
                    <Zap size={9} />{s.action}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Agent Action Modal ───────────────────────────────────────────────────────
function AgentActionModal({ action, onClose }: { action: string; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const steps: Record<string, string[]> = {
    'Initiate dispatch': ['Select available trucker from panel', 'Set pickup time at Garden City Terminal', 'Confirm with warehouse (UNIS Seabrook)', 'System updates container status'],
    'Review orders': ['Load OTIF risk report', 'Identify at-risk orders', 'Contact carrier for ETA confirmation', 'Update delivery forecast'],
    'Check allocation': ['Review current stock levels', 'Check inbound shipment pipeline', 'Identify reallocation options', 'Submit reallocation request'],
  }
  const [step, setStep] = useState(0)
  const stepList = steps[action] || ['Execute action', 'Confirm completion']
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-violet-500" />
          <h3 className="text-sm font-bold text-gray-900">AI-Assisted: {action}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-5">
        {!done ? (
          <>
            <p className="text-xs text-gray-500 mb-4">Follow the AI-recommended steps to complete this action:</p>
            <div className="space-y-2 mb-4">
              {stepList.map((s, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer ${i <= step ? 'border-violet-200 bg-violet-50' : 'border-gray-100 bg-gray-50'}`}
                  onClick={() => setStep(i)}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { if (step < stepList.length - 1) setStep(s => s + 1); else setDone(true) }}
              className="w-full py-2.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors">
              {step < stepList.length - 1 ? 'Next Step →' : 'Complete Action'}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-800">Action Completed</p>
            <p className="text-xs text-gray-500 mt-1">All steps executed. The system has been updated.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg">Done</button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [taskFilter, setTaskFilter] = useState<'all' | 'overdue' | 'today'>('all')
  const [modal, setModal] = useState<ModalState>({ type: null, data: null })

  const openStat = (stat: typeof SUMMARY_STATS[0]) => setModal({ type: 'stat', data: stat as unknown as Record<string, unknown> })
  const openException = (ex: typeof EXCEPTIONS[0]) => setModal({ type: 'exception', data: ex as unknown as Record<string, unknown> })
  const openTask = (task: typeof MY_TASKS[0]) => setModal({ type: 'task', data: task as unknown as Record<string, unknown> })
  const openAgentAction = (action: string) => setModal({ type: 'agent-action', data: { action } })
  const openLocModal = (loc: { name: string; type: string; count: number; status: string }) =>
    setModal({ type: 'stat', data: { isLoc: true, loc } as unknown as Record<string, unknown> })
  const closeModal = () => setModal({ type: null, data: null })

  const filteredTasks = MY_TASKS.filter(t => {
    if (taskFilter === 'overdue') return t.status === 'Overdue'
    if (taskFilter === 'today') return t.due.startsWith('Today')
    return true
  })

  return (
    <div className="space-y-4 pb-6">
      {/* Summary Stats — clickable */}
      <div className="grid grid-cols-6 gap-3">
        {SUMMARY_STATS.map((s, i) => (
          <div key={i} onClick={() => openStat(s)}
            className={`${s.bg} rounded-xl px-4 py-3 border border-white cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all`}>
            <p className="text-[10px] text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} underline decoration-dotted`}>{s.value}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4" data-tour="network-map">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-indigo-500" />
              <p className="text-sm font-bold text-gray-800">网络地图 / 仓库与运输态势</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Activity size={10} className="text-green-500" /> Live</span>
              <span className="text-[9px] text-gray-400">Click locations to view details</span>
            </div>
          </div>
          <NetworkMap onLocClick={openLocModal} />
        </div>

        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4" data-tour="exceptions">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-sm font-bold text-gray-800">异常与下一步行动</p>
            </div>
            <button onClick={() => navigate('/international-new/tracking')} className="text-[10px] text-primary-600 hover:underline font-medium">View all</button>
          </div>
          <div className="space-y-2">
            {EXCEPTIONS.map((ex, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openException(ex)}>
                <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${ex.color}`}>{ex.priority}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">{ex.label}</p>
                  <p className="text-[10px] text-gray-400 truncate">{ex.desc}</p>
                </div>
                <button className="text-[10px] text-violet-600 hover:text-violet-800 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {ex.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4" data-tour="my-tasks">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-violet-500" />
              <p className="text-sm font-bold text-gray-800">我的任务</p>
              <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">18 overdue</span>
            </div>
            <div className="flex items-center gap-1">
              {(['all','overdue','today'] as const).map(f => (
                <button key={f} onClick={() => setTaskFilter(f)}
                  className={`text-[10px] px-2 py-1 rounded-md font-medium ${taskFilter === f ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {f === 'all' ? 'All' : f === 'overdue' ? 'Overdue' : 'Today'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            {filteredTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openTask(task)}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${task.status === 'Overdue' ? 'bg-red-500' : task.status === 'Urgent' ? 'bg-orange-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 group-hover:text-primary-700 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{task.type}</span>
                    <span className={`text-[9px] font-semibold ${task.priority === 'P1' ? 'text-red-500' : task.priority === 'P2' ? 'text-orange-500' : 'text-gray-400'}`}>{task.priority}</span>
                    <span className="flex items-center gap-0.5 text-[9px] text-gray-400"><Clock size={9} />{task.due}</span>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 space-y-3">
          <div data-tour="ai-agent">
            <AIAgentPanel onAction={openAgentAction} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MODULES.map(m => (
              <button key={m.title} onClick={() => navigate(m.path)}
                className={`flex items-center gap-2 p-2.5 bg-white border rounded-lg text-left hover:shadow-sm transition-all ${m.color}`}>
                {m.icon}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-700 truncate">{m.title}</p>
                  <p className="text-[9px] text-gray-400 truncate">{m.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal.type === 'stat' && modal.data && !('isLoc' in modal.data) && (
        <StatDetailModal stat={modal.data as unknown as typeof SUMMARY_STATS[0]} onClose={closeModal} />
      )}
      {modal.type === 'stat' && modal.data && 'isLoc' in modal.data && (
        <LocationModal loc={(modal.data as { isLoc: boolean; loc: { name: string; type: string; count: number; status: string } }).loc} onClose={closeModal} />
      )}
      {modal.type === 'exception' && modal.data && (
        <ExceptionModal ex={modal.data as unknown as typeof EXCEPTIONS[0]} onClose={closeModal} />
      )}
      {modal.type === 'task' && modal.data && (
        <TaskModal task={modal.data as unknown as typeof MY_TASKS[0]} onClose={closeModal} />
      )}
      {modal.type === 'agent-action' && modal.data && (
        <AgentActionModal action={(modal.data as { action: string }).action} onClose={closeModal} />
      )}
    </div>
  )
}
