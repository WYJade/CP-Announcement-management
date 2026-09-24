import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Package, Truck, Bot, CheckCircle2, Clock,
  TrendingDown, Warehouse, Ship, DollarSign, Zap, RefreshCw,
  AlertCircle, X, ArrowRight, ExternalLink,
  FileText, Send, ChevronRight, BarChart2, ChevronDown,
  Sparkles, BookOpen, Phone, MessageSquare, Star, PlayCircle,
  LayoutDashboard, User2, Bell, Globe, ShoppingCart, Factory,
  Container, ClipboardList, Layers, AlertOctagon, TrendingUp,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModalState {
  type: 'stat' | 'exception' | 'task' | 'agent-action' | null
  data: Record<string, unknown> | null
}
type UserRole = 'new' | 'returning'
const LS_KEY = 'cp_home_role'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SUMMARY_STATS = [
  { label: 'In-Transit Shipments', value: '1,248', sub: '+12 today', color: 'text-blue-600', bg: 'bg-blue-50',
    detail: { title: 'In-Transit Shipments', items: [
      { label: 'Ocean — Asia to US West Coast', count: 542, status: 'normal' },
      { label: 'Ocean — Asia to US East Coast', count: 398, status: 'normal' },
      { label: 'Drayage — Enroute to Warehouse', count: 187, status: 'warning' },
      { label: 'Available at Terminal', count: 121, status: 'alert' },
    ], cta: { label: 'View Shipment Tracking', path: '/international-new/tracking' } } },
  { label: "Today's Appointments", value: '86', sub: '14 pending confirm', color: 'text-violet-600', bg: 'bg-violet-50',
    detail: { title: "Today's Appointments", items: [
      { label: 'Confirmed', count: 52, status: 'normal' },
      { label: 'Pending Confirmation', count: 14, status: 'alert' },
      { label: 'At Risk', count: 8, status: 'warning' },
      { label: 'Completed', count: 12, status: 'normal' },
    ], cta: { label: 'Manage Appointments', path: '/inbound/inquiry' } } },
  { label: 'High-Risk Exceptions', value: '27', sub: '5 new since yesterday', color: 'text-red-600', bg: 'bg-red-50',
    detail: { title: 'Exceptions Breakdown', items: [
      { label: 'Container DEM/DET Risk', count: 9, status: 'alert' },
      { label: 'Customs Hold', count: 3, status: 'alert' },
      { label: 'Appointment Unconfirmed', count: 6, status: 'warning' },
      { label: 'Inventory Shortage', count: 5, status: 'warning' },
      { label: 'OTIF Penalty Risk', count: 4, status: 'warning' },
    ], cta: { label: 'View All Exceptions', path: '/international-new/tracking' } } },
  { label: 'OTIF Risk', value: '14', sub: 'P1: 3 / P2: 11', color: 'text-orange-600', bg: 'bg-orange-50',
    detail: { title: 'OTIF At-Risk Orders', items: [
      { label: 'P1 — Below 95% threshold', count: 3, status: 'alert' },
      { label: 'P2 — 95–97% approaching', count: 11, status: 'warning' },
    ], cta: { label: 'Open OTIF Dashboard', path: '/dashboard/otif' } } },
  { label: 'Demurrage / Detention', value: '9', sub: 'Containers at risk', color: 'text-amber-600', bg: 'bg-amber-50',
    detail: { title: 'DEM/DET At-Risk', items: [
      { label: 'LFD Exceeded', count: 3, status: 'alert' },
      { label: 'LFD Within 24 hrs', count: 4, status: 'warning' },
      { label: 'LFD Within 48 hrs', count: 2, status: 'normal' },
    ], cta: { label: 'View Container List', path: '/international-new/tracking' } } },
  { label: 'Pending Tasks', value: '43', sub: '18 overdue', color: 'text-emerald-600', bg: 'bg-emerald-50',
    detail: { title: 'Pending Tasks', items: [
      { label: 'Overdue', count: 18, status: 'alert' },
      { label: 'Due Today', count: 9, status: 'warning' },
      { label: 'Due This Week', count: 16, status: 'normal' },
    ], cta: { label: 'View All Tasks', path: '/' } } },
]

const MY_TASKS = [
  { id: 1, title: 'Confirm receiving appointment for SSHAS2608270', type: 'Appointment', priority: 'P1', due: 'Today 14:00', status: 'Overdue', path: '/international-new/tracking', detail: 'Appointment APPT-6007808 at UNIS Seabrook has not been confirmed by the warehouse team.' },
  { id: 2, title: 'Resolve customs hold on SSHAS2608135', type: 'Customs', priority: 'P1', due: 'Today 17:00', status: 'Urgent', path: '/international-new/tracking', detail: 'Customs entry 82G-0101679-0 on hold. Container at Savannah port. LFD is Jun 20.' },
  { id: 3, title: 'Review invoice dispute INV-20260601', type: 'Finance', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/finance/invoices', detail: 'THE ONLY BEAN LLC disputed INV-20260601 for $3,240. Reason: quantity mismatch.' },
  { id: 4, title: 'Update freight quote for ADOORN LLC', type: 'Outbound', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/outbound/freight-quote', detail: 'Revised freight quote for 2x40HC from Shenzhen to Savannah. Quote expires Aug 6.' },
  { id: 5, title: 'Cycle count discrepancy in Inventory', type: 'Inventory', priority: 'P3', due: 'Aug 6', status: 'In Progress', path: '/inventory/activity', detail: 'SKU ADPOST-SMALL-RED variance of -2 units at Long Beach DC.' },
]

const EXCEPTIONS = [
  { priority: 'P1', label: 'Container DEM Risk', desc: '3 containers past LFD at Garden City Terminal', action: 'Review & assign', color: 'bg-red-500', path: '/international-new/tracking', detail: 'Containers WHSU8555505, XYLU8225020, SELU4350353 past last free day. $150/container/day.', steps: ['Select trucker', 'Confirm pickup appointment', 'Notify warehouse', 'Track dispatch'] },
  { priority: 'P1', label: 'Appointment at risk', desc: 'Jun 19 appointment for SSHAS2608270 not confirmed', action: 'Reschedule', color: 'bg-red-500', path: '/international-new/tracking', detail: 'Appointment APPT-6007808 for Jun 19, 10:00 at UNIS Seabrook not confirmed. Vehicle is OFD.', steps: ['Select new slot', 'Notify carrier', 'Update warehouse system'] },
  { priority: 'P2', label: 'Inventory shortage', desc: 'SKU ADPOST-SMALL-RED below safety stock', action: 'Check allocation', color: 'bg-orange-400', path: '/inventory/activity', detail: 'Current: 68 units. Safety: 80 units. Inbound expected Jun 21.', steps: ['Review allocation', 'Check inbound pipeline', 'Reallocate from alternate DC'] },
  { priority: 'P2', label: 'OTIF penalty risk', desc: '5 orders approaching 97% OTIF threshold', action: 'Open RCA', color: 'bg-orange-400', path: '/dashboard/otif', detail: 'VITA COCO and ORGAIN LLC at 95.8% OTIF. Delay triggers penalty clause.', steps: ['Identify root cause', 'Document RCA', 'Submit corrective plan'] },
  { priority: 'P3', label: 'Invoice dispute', desc: 'INV-20260601 disputed by THE ONLY BEAN LLC', action: 'Review documents', color: 'bg-blue-400', path: '/finance/invoices', detail: 'Dispute filed Aug 1. Amount: $3,240. Reason: quantity mismatch.', steps: ['Review POD', 'Compare packing list', 'Respond within 3 days'] },
]

const ONBOARDING_STEPS = [
  { id: 'profile', icon: <User2 size={15} />, title: 'Complete your company profile', desc: 'Add your company name, contact info, and billing details so our team can set up your account.', cta: 'Set up profile', path: '/system/accounts', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500', accent: '#7c3aed' },
  { id: 'inbound', icon: <Package size={15} />, title: 'Submit your first inbound receipt', desc: 'Create an RN to start tracking incoming goods. Monitor status, exceptions, and put-away in real time.', cta: 'Create receipt', path: '/inbound/inquiry', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', accent: '#2563eb' },
  { id: 'inventory', icon: <Warehouse size={15} />, title: 'Review your inventory snapshot', desc: 'Check on-hand stock, locations, and discrepancies across your facilities.', cta: 'View inventory', path: '/inventory/activity', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', accent: '#059669' },
  { id: 'outbound', icon: <Truck size={15} />, title: 'Submit your first outbound order', desc: 'Enter an outbound order to kick off the fulfillment process. Track every milestone from pick to ship.', cta: 'Create order', path: '/outbound/inquiry', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500', accent: '#4f46e5' },
  { id: 'finance', icon: <DollarSign size={15} />, title: 'Connect billing & review invoices', desc: 'Link your payment method and review any outstanding invoices or charges.', cta: 'View Finance', path: '/finance/invoices', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', accent: '#d97706' },
]

// Platform Gateway — scenario-based
const PLATFORM_SCENARIOS = [
  {
    system: 'OMS',
    label: 'Order Management',
    color: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: <ShoppingCart size={16} className="text-white" />,
    scenarios: [
      'Track your wholesale or retail order status end-to-end',
      'Submit or modify a purchase order to your supplier',
      'View order fulfillment progress and carrier assignments',
    ],
    cta: 'Open OMS',
    path: '/sales/wholesale',
  },
  {
    system: 'WMS',
    label: 'Warehouse Management',
    color: 'bg-emerald-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: <Factory size={16} className="text-white" />,
    scenarios: [
      'Check on-hand inventory levels and item locations',
      'Create or review inbound receipts and appointments',
      'Manage outbound shipments and carrier pickups',
    ],
    cta: 'Open WMS',
    path: '/inventory/activity',
  },
  {
    system: 'YMS',
    label: 'Yard Management',
    color: 'bg-amber-600',
    lightBg: 'bg-amber-50',
    border: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: <Container size={16} className="text-white" />,
    scenarios: [
      'Monitor trucks and trailers entering or leaving the yard',
      'Track gate check-in / check-out for drivers',
      'View yard appointments and dock door assignments',
    ],
    cta: 'Open YMS',
    path: '/yard/entry-list',
  },
  {
    system: 'Supply Chain',
    label: 'International & Tracking',
    color: 'bg-teal-600',
    lightBg: 'bg-teal-50',
    border: 'border-teal-200',
    textColor: 'text-teal-700',
    icon: <Globe size={16} className="text-white" />,
    scenarios: [
      'Track ocean containers from port of loading to warehouse',
      'Monitor customs clearance status and LFD alerts',
      'View OTIF performance and retailer scorecards',
    ],
    cta: 'Open Tracking',
    path: '/international-new/tracking',
  },
]

// ─── Shared Modals ────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function StatDetailModal({ stat, onClose }: { stat: typeof SUMMARY_STATS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">{stat.detail.title}</h3>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="p-5 space-y-2">
        {stat.detail.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.status === 'alert' ? 'bg-red-500' : item.status === 'warning' ? 'bg-orange-400' : 'bg-green-400'}`} />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <span className={`text-sm font-bold ${item.status === 'alert' ? 'text-red-600' : item.status === 'warning' ? 'text-orange-600' : 'text-gray-700'}`}>{item.count}</span>
          </div>
        ))}
      </div>
      <div className="px-5 pb-5">
        <button onClick={() => { navigate(stat.detail.cta.path); onClose() }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
          <ExternalLink size={14} /> {stat.detail.cta.label}
        </button>
      </div>
    </Modal>
  )
}

function ExceptionModal({ ex, onClose }: { ex: typeof EXCEPTIONS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${ex.color}`}>{ex.priority}</span>
          <h3 className="text-sm font-bold text-gray-900">{ex.label}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-600 mb-4">{ex.detail}</p>
        {!submitted ? (
          <>
            <div className="space-y-2 mb-4">
              {ex.steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer ${i <= step ? 'border-primary-200 bg-primary-50' : 'border-gray-200'}`} onClick={() => setStep(i)}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i < step ? '✓' : i + 1}</div>
                  <span className={`text-xs ${i <= step ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigate(ex.path); onClose() }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
                <ExternalLink size={12} /> View Details
              </button>
              <button onClick={() => { if (step < ex.steps.length - 1) setStep(s => s + 1); else setSubmitted(true) }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
                <Send size={12} /> {step < ex.steps.length - 1 ? 'Next Step' : 'Submit'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold">Action Submitted</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-xs rounded-lg">Done</button>
          </div>
        )}
      </div>
    </Modal>
  )
}

function TaskModal({ task, onClose }: { task: typeof MY_TASKS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${task.priority === 'P1' ? 'bg-red-500' : task.priority === 'P2' ? 'bg-orange-400' : 'bg-gray-400'}`}>{task.priority}</span>
          <h3 className="text-sm font-bold text-gray-900 truncate">{task.title}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{task.type}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><Clock size={9} /> Due: {task.due}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{task.detail}</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">Dismiss</button>
          <button onClick={() => { navigate(task.path); onClose() }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
            <ArrowRight size={12} /> Go to {task.type}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function AgentActionModal({ action, onClose }: { action: string; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const steps: Record<string, string[]> = {
    'Initiate dispatch': ['Select trucker', 'Set pickup time at Garden City', 'Confirm with UNIS Seabrook', 'System updates status'],
    'Review orders': ['Load OTIF risk report', 'Identify at-risk orders', 'Confirm carrier ETA', 'Update forecast'],
    'Check allocation': ['Review stock levels', 'Check inbound pipeline', 'Reallocate from alternate DC'],
  }
  const [step, setStep] = useState(0)
  const stepList = steps[action] || ['Execute', 'Confirm']
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-violet-500" />
          <h3 className="text-sm font-bold">AI-Assisted: {action}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="p-5">
        {!done ? (
          <>
            <div className="space-y-2 mb-4">
              {stepList.map((s, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer ${i <= step ? 'border-violet-200 bg-violet-50' : 'border-gray-100'}`} onClick={() => setStep(i)}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i < step ? '✓' : i + 1}</div>
                  <span className={`text-xs ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { if (step < stepList.length - 1) setStep(s => s + 1); else setDone(true) }}
              className="w-full py-2.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700">
              {step < stepList.length - 1 ? 'Next Step →' : 'Complete'}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold">Completed</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-green-50 text-green-700 text-xs rounded-lg">Done</button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ─── AI Agent Panel (shared) ──────────────────────────────────────────────────
function AIAgentPanel({ onAction }: { onAction: (action: string) => void }) {
  const suggestions = [
    { icon: <AlertTriangle size={12} className="text-red-400" />, text: '3 containers at Garden City Terminal are past LFD. Recommend expedite dispatch today.', action: 'Initiate dispatch', priority: 'P1' },
    { icon: <TrendingDown size={12} className="text-orange-400" />, text: 'OTIF score trending to 93.2% for Week 35. 5 orders at risk. Confirm carrier windows before EoD.', action: 'Review orders', priority: 'P2' },
    { icon: <RefreshCw size={12} className="text-blue-400" />, text: 'Inventory cycle count variance for SKU ADPOST-SMALL-RED. Recommend reallocating from Savannah DC.', action: 'Check allocation', priority: 'P2' },
  ]
  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center"><Bot size={13} className="text-white" /></div>
        <div>
          <p className="text-xs font-bold text-gray-800">AI Agent Analysis</p>
          <p className="text-[10px] text-gray-500">Recommended actions based on current data</p>
        </div>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="bg-white rounded-lg p-2.5 border border-violet-100">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 shrink-0">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-700 leading-snug">{s.text}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${s.priority === 'P1' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{s.priority}</span>
                  <button onClick={() => onAction(s.action)} className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-800 font-medium"><Zap size={9} />{s.action}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Platform Gateway (shared, shown in both views) ───────────────────────────
function PlatformGateway() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Layers size={14} className="text-gray-500" />
        <h2 className="text-sm font-bold text-gray-800">Access by business scenario</h2>
        <span className="text-[10px] text-gray-400 font-normal">— Which platform do you need?</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {PLATFORM_SCENARIOS.map((p) => (
          <div key={p.system} className={`bg-white border ${p.border} rounded-xl p-4 flex flex-col gap-3`}>
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 ${p.color} rounded-lg flex items-center justify-center shrink-0`}>{p.icon}</div>
              <div>
                <p className={`text-xs font-bold ${p.textColor}`}>{p.system}</p>
                <p className="text-[10px] text-gray-400">{p.label}</p>
              </div>
            </div>
            {/* Scenarios */}
            <ul className="space-y-1.5 flex-1">
              {p.scenarios.map((sc, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                  <span className={`mt-0.5 w-1 h-1 rounded-full shrink-0 ${p.color.replace('bg-', 'bg-')}`} style={{ background: p.color.includes('blue') ? '#2563eb' : p.color.includes('emerald') ? '#059669' : p.color.includes('amber') ? '#d97706' : '#0d9488' }} />
                  {sc}
                </li>
              ))}
            </ul>
            {/* CTA */}
            <button onClick={() => navigate(p.path)}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg ${p.lightBg} ${p.textColor} hover:opacity-80 transition-opacity`}>
              {p.cta} <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// A: NEW USER HOME
// ═══════════════════════════════════════════════════════════════════════════════
function NewUserHome({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate()
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState(0) // index of currently open step
  const [toast, setToast] = useState<string | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const progress = Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100)
  const allDone = completedSteps.length === ONBOARDING_STEPS.length

  const showToast = (msg: string) => {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 3000)
  }

  const completeStep = (id: string, idx: number) => {
    if (completedSteps.includes(id)) return
    const next = [...completedSteps, id]
    setCompletedSteps(next)

    if (next.length === ONBOARDING_STEPS.length) {
      showToast('🎉 All steps complete! Loading your dashboard...')
      setTransitioning(true)
      setTimeout(() => {
        onSwitch()
        setTransitioning(false)
      }, 2200)
    } else {
      const msgs = ['Great start! Move on to step 2.', 'Nice work! Keep going.', 'You\'re halfway there!', 'Almost done — one more step!']
      showToast('✅ ' + (msgs[idx] || 'Step complete!'))
      // Auto-advance to next uncompleted step
      const nextIdx = ONBOARDING_STEPS.findIndex((s, i) => i > idx && !next.includes(s.id))
      if (nextIdx !== -1) setActiveStep(nextIdx)
    }
  }

  return (
    <div className={`space-y-5 pb-8 transition-opacity duration-700 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl animate-bounce">
          {toast}
        </div>
      )}

      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-700 px-7 py-6 flex items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative flex-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2">
            <Sparkles size={10} /> Welcome to Client Portal 3.0
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">Hello, Sarah 👋  <span className="text-white/70 font-normal text-base">— Let's get your account ready.</span></h1>
          <div className="flex items-center gap-2.5 mt-3">
            <button onClick={() => navigate('/agents?nav=chat')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-primary-700 text-xs font-bold rounded-xl hover:bg-white/90 shadow-sm">
              <Bot size={13} /> Ask AI Copilot
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 text-white text-xs font-medium rounded-xl hover:bg-white/25 border border-white/20">
              <PlayCircle size={13} /> Quick tour (2 min)
            </button>
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative hidden lg:flex flex-col items-center shrink-0">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="white" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-white">{progress}%</span>
            </div>
          </div>
          <p className="text-white/70 text-[10px] mt-1.5 text-center">
            {allDone ? 'All done! 🎉' : `${ONBOARDING_STEPS.length - completedSteps.length} steps left`}
          </p>
        </div>
      </div>

      {/* ── Main layout: Checklist + Side ── */}
      <div className="grid grid-cols-5 gap-5">

        {/* Checklist — 3 cols, one step open at a time */}
        <div className="col-span-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Getting Started — {completedSteps.length}/{ONBOARDING_STEPS.length} steps</h2>
            <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {ONBOARDING_STEPS.map((step, idx) => {
            const done = completedSteps.includes(step.id)
            const isOpen = activeStep === idx && !done

            return (
              <div key={step.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${done ? 'border-green-200 opacity-65' : isOpen ? `${step.border} shadow-sm` : 'border-gray-200'}`}>
                {/* Row */}
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => !done && setActiveStep(isOpen ? -1 : idx)}>
                  {/* Status dot */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${done ? 'bg-green-500 border-green-500' : isOpen ? `border-current ${step.color}` : 'border-gray-200'}`}>
                    {done
                      ? <CheckCircle2 size={13} className="text-white" />
                      : <span className="text-[10px] font-bold text-gray-400">{idx + 1}</span>
                    }
                  </div>
                  <div className={`w-7 h-7 ${step.bg} rounded-lg flex items-center justify-center shrink-0 ${step.color}`}>{step.icon}</div>
                  <p className={`flex-1 text-sm font-semibold ${done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{step.title}</p>
                  {done
                    ? <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Done ✓</span>
                    : <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  }
                </div>

                {/* Expanded content — only one open at a time */}
                {isOpen && (
                  <div className={`px-4 pb-4 pt-1 border-t ${step.border} ${step.bg}`}>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(step.path)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${step.border} ${step.color} ${step.bg} hover:shadow-sm`}>
                        {step.cta} <ArrowRight size={11} />
                      </button>
                      <button onClick={() => completeStep(step.id, idx)}
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
                        Mark as done ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Side — 2 cols */}
        <div className="col-span-2 space-y-4">

          {/* Need Help */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5"><MessageSquare size={13} className="text-primary-500" /> Need Help?</h3>
            <div className="space-y-1.5">
              {[
                { icon: <BookOpen size={13} className="text-blue-600" />, bg: 'bg-blue-50', title: 'Documentation', sub: 'User guides & tutorials' },
                { icon: <Phone size={13} className="text-emerald-600" />, bg: 'bg-emerald-50', title: 'Contact Support', sub: 'Mon–Fri, 8am–6pm PST' },
                { icon: <MessageSquare size={13} className="text-violet-600" />, bg: 'bg-violet-50', title: 'Live Chat', sub: 'Chat with our team' },
                { icon: <FileText size={13} className="text-amber-600" />, bg: 'bg-amber-50', title: 'Release Notes', sub: "What's new in v3.0" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group">
                  <div className={`w-6 h-6 ${item.bg} rounded-md flex items-center justify-center shrink-0`}>{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.sub}</p>
                  </div>
                  <ChevronRight size={11} className="text-gray-300 group-hover:text-gray-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5"><Bell size={13} className="text-gray-400" /> Announcements</h3>
            <div className="space-y-2.5">
              {[
                { badge: '🆕', title: 'AI Copilot in all modules', desc: 'Ask questions and take guided actions across every module.', date: 'Sep 15', hi: true },
                { badge: '🔧', title: 'Maintenance: Sep 28, 2–4 AM PST', desc: 'Brief downtime for platform upgrades.', date: 'Sep 20', hi: false },
                { badge: '📦', title: 'Outbound Order Entry redesigned', desc: 'Faster flow, auto-fill, and inline carrier rates.', date: 'Sep 10', hi: false },
              ].map((a, i) => (
                <div key={i} className={`rounded-lg p-2.5 border ${a.hi ? 'bg-primary-50 border-primary-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-gray-600">{a.badge} {a.date}</span>
                  </div>
                  <p className={`text-[11px] font-semibold ${a.hi ? 'text-primary-700' : 'text-gray-700'}`}>{a.title}</p>
                  <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Platform Gateway ── */}
      <PlatformGateway />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// B: RETURNING USER HOME
// ═══════════════════════════════════════════════════════════════════════════════
type HubTab = 'exceptions' | 'tasks' | 'ai'

function ReturningUserHome() {
  const navigate = useNavigate()
  const [hubTab, setHubTab] = useState<HubTab>('exceptions')
  const [taskFilter, setTaskFilter] = useState<'all' | 'overdue' | 'today'>('all')
  const [modal, setModal] = useState<ModalState>({ type: null, data: null })
  const [now] = useState(new Date())

  const openStat = (stat: typeof SUMMARY_STATS[0]) => setModal({ type: 'stat', data: stat as unknown as Record<string, unknown> })
  const openException = (ex: typeof EXCEPTIONS[0]) => setModal({ type: 'exception', data: ex as unknown as Record<string, unknown> })
  const openTask = (task: typeof MY_TASKS[0]) => setModal({ type: 'task', data: task as unknown as Record<string, unknown> })
  const openAgentAction = (action: string) => setModal({ type: 'agent-action', data: { action } })
  const closeModal = () => setModal({ type: null, data: null })

  const filteredTasks = MY_TASKS.filter(t => {
    if (taskFilter === 'overdue') return t.status === 'Overdue'
    if (taskFilter === 'today') return t.due.startsWith('Today')
    return true
  })

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const TAB_CONFIG: { id: HubTab; label: string; badge?: string; badgeColor?: string }[] = [
    { id: 'exceptions', label: 'Exceptions', badge: '2 P1', badgeColor: 'bg-red-100 text-red-600' },
    { id: 'tasks', label: 'My Tasks', badge: '18 overdue', badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'ai', label: 'AI Insights' },
  ]

  return (
    <div className="space-y-4 pb-6">

      {/* ── Compact Hero — same purple gradient, no search (left nav already has it) ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-700 px-7 py-5 flex items-center justify-between gap-4">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <p className="text-white/60 text-[11px] font-medium">{dateStr}</p>
          <h1 className="text-lg font-bold text-white mt-0.5">{greeting}, Sarah 👋</h1>
        </div>

        {/* Status pills */}
        <div className="relative flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-red-200 font-semibold bg-red-900/40 px-2.5 py-1 rounded-full border border-red-700/30">
            <AlertOctagon size={11} /> 2 P1 exceptions
          </span>
          <span className="flex items-center gap-1.5 text-xs text-amber-200 bg-amber-900/40 px-2.5 py-1 rounded-full border border-amber-700/30">
            <Clock size={11} /> 18 overdue tasks
          </span>
          <span className="flex items-center gap-1.5 text-xs text-blue-200 bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-700/30">
            <TrendingUp size={11} /> 1,248 in transit
          </span>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-6 gap-3">
        {SUMMARY_STATS.map((s, i) => (
          <div key={i} onClick={() => openStat(s)}
            className={`${s.bg} rounded-xl px-4 py-3 border border-white/80 cursor-pointer hover:shadow-md transition-all`}>
            <p className="text-[10px] text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} underline decoration-dotted`}>{s.value}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Priority Action Hub (full width, tabbed) ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Tab header */}
        <div className="flex items-center border-b border-gray-100 px-1">
          {TAB_CONFIG.map(tab => (
            <button key={tab.id} onClick={() => setHubTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold relative transition-colors ${hubTab === tab.id ? 'text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
              {tab.badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tab.badgeColor}`}>{tab.badge}</span>}
              {hubTab === tab.id && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full" />}
            </button>
          ))}
          {/* Spacer + View all */}
          <div className="ml-auto px-4">
            <button onClick={() => navigate(hubTab === 'exceptions' ? '/international-new/tracking' : '/')}
              className="text-[10px] text-primary-600 hover:underline font-medium">View all</button>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4">
          {/* Exceptions */}
          {hubTab === 'exceptions' && (
            <div className="grid grid-cols-2 gap-2">
              {EXCEPTIONS.map((ex, i) => (
                <div key={i}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all group ${ex.priority === 'P1' ? 'bg-red-50/60 border-red-100' : 'bg-gray-50 border-gray-100'}`}
                  onClick={() => openException(ex)}>
                  <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${ex.color}`}>{ex.priority}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{ex.label}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{ex.desc}</p>
                    <p className="text-[10px] text-primary-600 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{ex.action} →</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {hubTab === 'tasks' && (
            <div>
              <div className="flex items-center gap-1 mb-3">
                {(['all', 'overdue', 'today'] as const).map(f => (
                  <button key={f} onClick={() => setTaskFilter(f)}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${taskFilter === f ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {f === 'all' ? 'All' : f === 'overdue' ? 'Overdue' : 'Today'}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                {filteredTasks.map(task => (
                  <div key={task.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:shadow-sm transition-all group border ${task.status === 'Overdue' ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100'}`}
                    onClick={() => openTask(task)}>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${task.status === 'Overdue' ? 'bg-red-500' : task.status === 'Urgent' ? 'bg-orange-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 group-hover:text-primary-700 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] bg-white text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{task.type}</span>
                        <span className={`text-[9px] font-semibold ${task.priority === 'P1' ? 'text-red-500' : task.priority === 'P2' ? 'text-orange-500' : 'text-gray-400'}`}>{task.priority}</span>
                        <span className="flex items-center gap-0.5 text-[9px] text-gray-400"><Clock size={9} />{task.due}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {hubTab === 'ai' && <AIAgentPanel onAction={openAgentAction} />}
        </div>
      </div>

      {/* ── Platform Gateway ── */}
      <PlatformGateway />

      {/* Modals */}
      {modal.type === 'stat' && modal.data && !('isLoc' in modal.data) && <StatDetailModal stat={modal.data as unknown as typeof SUMMARY_STATS[0]} onClose={closeModal} />}
      {modal.type === 'exception' && modal.data && <ExceptionModal ex={modal.data as unknown as typeof EXCEPTIONS[0]} onClose={closeModal} />}
      {modal.type === 'task' && modal.data && <TaskModal task={modal.data as unknown as typeof MY_TASKS[0]} onClose={closeModal} />}
      {modal.type === 'agent-action' && modal.data && <AgentActionModal action={(modal.data as { action: string }).action} onClose={closeModal} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [role, setRole] = useState<UserRole>(() => {
    try { const s = localStorage.getItem(LS_KEY); return s === 'new' || s === 'returning' ? s : 'returning' } catch { return 'returning' }
  })

  const switchRole = (r: UserRole) => {
    setRole(r)
    try { localStorage.setItem(LS_KEY, r) } catch { /* ignore */ }
  }

  return (
    <div>
      {/* ── Minimal role switcher — right-aligned, unobtrusive ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {role === 'new' ? 'Getting Started' : 'Home'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {role === 'new' ? 'Complete your setup to unlock the full portal' : 'Your supply chain operations at a glance'}
          </p>
        </div>

        {/* Lightweight toggle — pill style, no large CTA */}
        <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
          <button onClick={() => switchRole('new')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${role === 'new' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <Sparkles size={11} /> New User
          </button>
          <button onClick={() => switchRole('returning')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${role === 'returning' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <LayoutDashboard size={11} /> Returning User
          </button>
        </div>
      </div>

      {role === 'new' ? <NewUserHome onSwitch={() => switchRole('returning')} /> : <ReturningUserHome />}
    </div>
  )
}
