import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, Truck, Bot, CheckCircle2, Clock, TrendingDown,
  Warehouse, Ship, DollarSign, Zap, RefreshCw, AlertCircle,
  X, ArrowRight, ExternalLink, FileText, Send, BarChart2,
  ChevronDown, Sparkles, BookOpen, Phone, MessageSquare,
  PlayCircle, LayoutDashboard, User2, Bell, Globe,
  ShoppingCart, Factory, Layers, AlertOctagon, TrendingUp,
  Container, AlertTriangle,
} from 'lucide-react'

// ─── Types & Constants ────────────────────────────────────────────────────────
type ViewMode = 'new' | 'returning'
const LS_KEY = 'cp_home_view'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  { label: 'Inbound today',        value: '12', sub: '3 late',          subColor: 'text-red-500',    color: 'text-gray-900', bg: 'bg-white',  border: 'border-gray-100' },
  { label: 'Inventory exceptions', value: '8',  sub: '2 stockout risk', subColor: 'text-orange-500', color: 'text-gray-900', bg: 'bg-white',  border: 'border-gray-100' },
  { label: 'Orders to ship',       value: '46', sub: '7 due today',     subColor: 'text-violet-500', color: 'text-gray-900', bg: 'bg-white',  border: 'border-gray-100' },
  { label: 'Shipping exceptions',  value: '5',  sub: '2 severe',        subColor: 'text-red-500',    color: 'text-gray-900', bg: 'bg-white',  border: 'border-gray-100' },
]

// Needs Attention rows — ref / module / issue / action / path
const ATTENTION_ITEMS = [
  { level: 'High',   module: 'Inbound',   ref: 'RN-252810',    issue: 'Appointment missed',      action: 'Review', path: '/inbound/inquiry' },
  { level: 'High',   module: 'Shipping',  ref: 'PRO-78492',    issue: 'ETA slipped 18h',         action: 'Track',  path: '/international-new/tracking' },
  { level: 'Med',    module: 'Inventory', ref: 'SKU 48102',    issue: 'Below safety stock',       action: 'View',   path: '/inventory/activity' },
  { level: 'Med',    module: 'Finance',   ref: 'INV-8821',     issue: 'Overdue 7 days',           action: 'Open',   path: '/finance/invoices' },
  { level: 'Low',    module: 'Outbound',  ref: 'DN-20260901',  issue: 'Carrier not assigned',     action: 'Assign', path: '/outbound/inquiry' },
]

// Today & next 48 hours
const TIMELINE_ITEMS = [
  { time: '09:30',    module: 'Inbound',  label: '2 appointments arriving',   detail: 'Ontario, CA',    path: '/inbound/inquiry' },
  { time: '11:00',    module: 'Outbound', label: '18 orders carrier cutoff',  detail: 'Fontana, CA',    path: '/outbound/inquiry' },
  { time: '14:00',    module: 'Yard',     label: 'Trailer appointment',        detail: 'Garden City, NY', path: '/yard/entry-list' },
  { time: 'Tomorrow', module: 'Shipping', label: '7 LTL pickups scheduled',   detail: '3 facilities',   path: '/international-new/tracking' },
]

const QUICK_ACTIONS = [
  { icon: <Package size={16} className="text-blue-500" />,     label: 'Inbound',          sub: 'Receipts & appointments', path: '/inbound/inquiry',            bg: 'bg-blue-50',    border: 'hover:border-blue-200' },
  { icon: <Warehouse size={16} className="text-emerald-500" />, label: 'Inventory',        sub: 'Stock & cycle counts',    path: '/inventory/activity',         bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
  { icon: <Truck size={16} className="text-indigo-500" />,     label: 'Outbound',         sub: 'Orders & shipping',       path: '/outbound/inquiry',           bg: 'bg-indigo-50',  border: 'hover:border-indigo-200' },
  { icon: <Ship size={16} className="text-teal-500" />,        label: 'Shipment Tracking',sub: 'Containers & milestones', path: '/international-new/tracking',  bg: 'bg-teal-50',    border: 'hover:border-teal-200' },
  { icon: <BarChart2 size={16} className="text-violet-500" />, label: 'OTIF & KPI',       sub: 'Analytics & scorecards',  path: '/dashboard/otif',             bg: 'bg-violet-50',  border: 'hover:border-violet-200' },
  { icon: <DollarSign size={16} className="text-amber-500" />, label: 'Finance',           sub: 'Invoices & claims',       path: '/finance/invoices',           bg: 'bg-amber-50',   border: 'hover:border-amber-200' },
]

const PLATFORM_LINKS = [
  {
    system: 'WMS',  label: 'Warehouse Mgmt', icon: <Factory size={14} className="text-white" />,     color: 'bg-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100',
    question: 'Managing inbound, inventory, or outbound?',
    scenarios: [
      'Check or update an inbound receipt (RN)',
      'Look up on-hand inventory by SKU or location',
      'Process an outbound order or manage carrier pickup',
    ],
    cta: 'Go to WMS', path: '/inventory/activity',
  },
  {
    system: 'OMS',  label: 'Order Management', icon: <ShoppingCart size={14} className="text-white" />, color: 'bg-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100',
    question: 'Tracking a sales or purchase order?',
    scenarios: [
      'Check where a wholesale or retail order stands',
      'View or submit a purchase order to your supplier',
      'Confirm fulfillment status or download a POD',
    ],
    cta: 'Go to OMS', path: '/sales/wholesale',
  },
  {
    system: 'YMS',  label: 'Yard Management',  icon: <Container size={14} className="text-white" />,   color: 'bg-amber-600',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100',
    question: 'Monitoring yard activity or gate entries?',
    scenarios: [
      'Track driver check-in / check-out at the gate',
      'View dock door assignments and available slots',
      'Manage yard appointments or follow up on no-shows',
    ],
    cta: 'Go to YMS', path: '/yard/entry-list',
  },
  {
    system: 'SCM',  label: 'Supply Chain',     icon: <Globe size={14} className="text-white" />,       color: 'bg-teal-600',    bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-100',
    question: 'Tracking ocean shipments or OTIF performance?',
    scenarios: [
      'Follow a container from origin port to your warehouse',
      'Check customs clearance status or LFD deadline',
      'Review OTIF scores, root cause, or penalty risks',
    ],
    cta: 'Go to SCM', path: '/international-new/tracking',
  },
]

const AI_INSIGHTS = [
  { icon: <AlertTriangle size={12} className="text-red-400" />, priority: 'P1', text: '3 containers past LFD at Garden City Terminal — $150/day accruing. Dispatch trucker today.', action: 'Initiate dispatch' },
  { icon: <TrendingDown size={12} className="text-orange-400" />, priority: 'P2', text: 'OTIF at 93.2% for Week 35 (target 97%). 5 at-risk orders. Confirm carrier windows before EoD.', action: 'Review orders' },
  { icon: <RefreshCw size={12} className="text-blue-400" />, priority: 'P2', text: 'Inventory cycle count variance: SKU ADPOST-SMALL-RED -2 units at Long Beach DC.', action: 'Check inventory' },
]

const ONBOARDING_STEPS = [
  { id: 'profile',   icon: <User2 size={15} />,    title: 'Complete your company profile',   desc: 'Add your company name, contact info, and billing details so our team can set up your account.',      cta: 'Set up profile',  path: '/system/accounts',   color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'inbound',   icon: <Package size={15} />,   title: 'Submit your first inbound receipt', desc: 'Create an RN to start tracking incoming goods. Monitor status, exceptions, and put-away in real time.', cta: 'Create receipt',  path: '/inbound/inquiry',   color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { id: 'inventory', icon: <Warehouse size={15} />, title: 'Review your inventory snapshot', desc: 'Check on-hand stock, locations, and discrepancies across your facilities.',                           cta: 'View inventory',  path: '/inventory/activity', color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200' },
  { id: 'outbound',  icon: <Truck size={15} />,     title: 'Submit your first outbound order', desc: 'Enter an order and track every milestone from pick to delivery.',                                       cta: 'Create order',    path: '/outbound/inquiry',  color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'finance',   icon: <DollarSign size={15} />,title: 'Connect billing & review invoices', desc: 'Link your payment method and check outstanding invoices or charges.',                                  cta: 'View Finance',    path: '/finance/invoices',  color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
]

// ─── Shared Modal ─────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

// ─── Priority Item Modal ──────────────────────────────────────────────────────
function PriorityModal({ item, onClose }: { item: typeof PRIORITY_ITEMS[0]; onClose: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const steps = ['Review details', 'Confirm action', 'Submit & close']
  return (
    <Modal onClose={onClose}>
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.color}`}>{item.priority}</span>
          <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{item.desc}</p>
        {!done ? (
          <>
            <div className="space-y-2 mb-5">
              {steps.map((s, i) => (
                <div key={i} onClick={() => setStep(i)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${i <= step ? 'border-primary-200 bg-primary-50' : 'border-gray-100 bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${i <= step ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigate(item.path); onClose() }} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-xs text-gray-600 rounded-xl hover:bg-gray-50">
                <ExternalLink size={12} /> Open Module
              </button>
              <button onClick={() => { if (step < steps.length - 1) setStep(s => s + 1); else setDone(true) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-600 text-white text-xs font-medium rounded-xl hover:bg-primary-700">
                <Send size={12} /> {step < steps.length - 1 ? 'Next' : 'Submit'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-800">Action submitted</p>
            <button onClick={onClose} className="mt-4 px-5 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-xl">Done</button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// RETURNING USER — clean unified dashboard
// ═══════════════════════════════════════════════════════════════════════════════
function ReturningView() {
  const navigate = useNavigate()

  const levelStyle: Record<string, { badge: string; dot: string }> = {
    High: { badge: 'bg-red-100 text-red-600',    dot: 'bg-red-500' },
    Med:  { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    Low:  { badge: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400' },
  }

  const moduleColor: Record<string, string> = {
    Inbound: 'text-blue-600', Shipping: 'text-teal-600', Inventory: 'text-emerald-600',
    Finance: 'text-amber-600', Outbound: 'text-indigo-600', Yard: 'text-orange-500',
  }

  return (
    <div className="space-y-5 pb-8">

      {/* ── KPI Strip — 4 cards, clean ── */}
      <div className="grid grid-cols-4 gap-4">
        {KPI_CARDS.map((k, i) => (
          <div key={i} className={`${k.bg} border ${k.border} rounded-2xl px-5 py-4 shadow-sm`}>
            <p className="text-xs text-gray-400 font-medium mb-2">{k.label}</p>
            <div className="flex items-baseline gap-3">
              <p className={`text-3xl font-bold ${k.color} leading-none`}>{k.value}</p>
              <p className={`text-xs font-semibold ${k.subColor}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main two-column ── */}
      <div className="grid grid-cols-5 gap-5">

        {/* Left col — Needs Attention + Timeline */}
        <div className="col-span-3 space-y-4">

          {/* Needs Attention */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900">Needs attention</h2>
              <button onClick={() => navigate('/international-new/tracking')}
                className="text-xs text-primary-600 font-semibold hover:underline">View all →</button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[72px_80px_1fr_auto] gap-x-4 px-5 py-2 bg-gray-50 border-b border-gray-50">
              {['Priority','Module','Details',''].map((h, i) => (
                <p key={i} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {ATTENTION_ITEMS.map((item, i) => (
                <div key={i} className="grid grid-cols-[72px_80px_1fr_auto] gap-x-4 items-center px-5 py-3 hover:bg-gray-50/70 transition-colors">
                  {/* Level badge */}
                  <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${levelStyle[item.level].badge}`}>
                    {item.level}
                  </span>
                  {/* Module */}
                  <p className={`text-xs font-semibold ${moduleColor[item.module] ?? 'text-gray-600'}`}>{item.module}</p>
                  {/* Ref + issue */}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-primary-700 mr-2">{item.ref}</span>
                    <span className="text-xs text-gray-500">{item.issue}</span>
                  </div>
                  {/* Action button */}
                  <button onClick={() => navigate(item.path)}
                    className="text-[11px] font-bold text-primary-600 border border-primary-200 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-lg transition-colors whitespace-nowrap">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Today & Next 48 hours */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900">Today &amp; next 48 hours</h2>
            </div>
            <div className="px-5 py-3 space-y-0">
              {TIMELINE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-3 group hover:bg-gray-50/60 -mx-5 px-5 transition-colors cursor-pointer" onClick={() => navigate(item.path)}>
                  {/* Dot + line */}
                  <div className="flex flex-col items-center shrink-0 pt-1" style={{ width: '16px' }}>
                    <div className="w-3 h-3 rounded-full bg-primary-500 ring-2 ring-white ring-offset-1 shrink-0" />
                    {i < TIMELINE_ITEMS.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[20px]" />}
                  </div>
                  {/* Time */}
                  <p className="text-xs font-bold text-gray-400 w-16 shrink-0 pt-0.5">{item.time}</p>
                  {/* Module badge */}
                  <p className={`text-xs font-bold w-16 shrink-0 pt-0.5 ${moduleColor[item.module] ?? 'text-gray-600'}`}>{item.module}</p>
                  {/* Label */}
                  <p className="flex-1 text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{item.label}</p>
                  {/* Detail */}
                  <p className="text-[11px] text-gray-400 shrink-0">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col — AI Copilot */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-violet-500 rounded-full flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">AI Copilot</p>
                  <p className="text-[10px] text-gray-400">Ask across inbound, inventory, shipping...</p>
                </div>
              </div>
              <button onClick={() => navigate('/agents?nav=chat')} className="text-[11px] text-violet-600 font-semibold hover:underline">Open →</button>
            </div>

            {/* Quick prompts */}
            <div className="p-4 space-y-2">
              {[
                'Summarize today\'s exceptions',
                'Find late inbound receipts',
                'Export open invoice summary',
                'Which orders are at OTIF risk?',
              ].map((prompt, i) => (
                <button key={i} onClick={() => navigate('/agents?nav=chat')}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-gray-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI insights */}
            <div className="px-4 pb-4 space-y-2 border-t border-gray-50 pt-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Recommended actions</p>
              {AI_INSIGHTS.map((s, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <div className="mt-0.5 shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-700 leading-snug">{s.text}</p>
                    <button className="flex items-center gap-1 text-[10px] text-violet-600 font-semibold mt-1.5">
                      <Zap size={9} /> {s.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Platform Gateway — scenario-driven ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-900">What are you trying to do?</h2>
          <p className="text-xs text-gray-400 mt-0.5">Find the right place based on your current task</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {PLATFORM_LINKS.map((p) => (
            <div key={p.system} className={`rounded-2xl border ${p.border} bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow`}>
              {/* Header */}
              <div className={`px-4 py-3 ${p.bg} border-b ${p.border} flex items-center gap-2.5`}>
                <div className={`w-7 h-7 ${p.color} rounded-lg flex items-center justify-center shrink-0`}>{p.icon}</div>
                <div>
                  <p className={`text-xs font-bold ${p.text}`}>{p.system}</p>
                  <p className="text-[10px] text-gray-400">{p.label}</p>
                </div>
              </div>
              {/* Question */}
              <div className="px-4 pt-3 pb-2">
                <p className="text-[12px] font-semibold text-gray-800 leading-snug">{p.question}</p>
              </div>
              {/* Scenarios */}
              <ul className="px-4 pb-3 flex-1 space-y-1.5">
                {p.scenarios.map((sc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500 leading-snug">
                    <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${p.color.replace('bg-', 'bg-').replace('600', '400')}`} style={{ flexShrink: 0, width: '5px', height: '5px', borderRadius: '9999px', marginTop: '4px', background: p.color.includes('emerald') ? '#34d399' : p.color.includes('blue') ? '#60a5fa' : p.color.includes('amber') ? '#fbbf24' : '#2dd4bf' }} />
                    {sc}
                  </li>
                ))}
              </ul>
              {/* CTA */}
              <div className="px-4 pb-4">
                <button onClick={() => navigate(p.path)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl ${p.bg} ${p.text} border ${p.border} hover:opacity-80 transition-opacity`}>
                  {p.cta} <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && <PriorityModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEW USER — welcoming, focused, one step at a time
// ═══════════════════════════════════════════════════════════════════════════════
function NewUserView({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate()
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = ONBOARDING_STEPS.length
  const done = completedSteps.length
  const progress = Math.round((done / total) * 100)
  const allDone = done === total

  const showToast = (msg: string) => {
    setToast(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 3000)
  }

  const completeStep = (id: string, idx: number) => {
    if (completedSteps.includes(id)) return
    const next = [...completedSteps, id]
    setCompletedSteps(next)
    if (next.length === total) {
      showToast('🎉 All set! Opening your dashboard...')
      setFading(true)
      setTimeout(() => { onSwitch(); setFading(false) }, 2000)
    } else {
      const msgs = ['Step 1 done — great start!', 'Step 2 complete. Keep going!', "Halfway there — you're on a roll!", 'Almost done — one step left!']
      showToast('✅ ' + (msgs[idx] || 'Step complete!'))
      const nextIdx = ONBOARDING_STEPS.findIndex((s, i) => i > idx && !next.includes(s.id))
      if (nextIdx !== -1) setActiveStep(nextIdx)
    }
  }

  return (
    <div className={`pb-10 transition-opacity duration-700 ${fading ? 'opacity-0' : 'opacity-100'}`}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-full shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* ── Hero — compact, warm ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 px-8 py-8 mb-7">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="relative flex items-center justify-between gap-8">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white/90 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles size={10} /> Welcome to Client Portal 3.0
            </span>
            <h1 className="text-2xl font-bold text-white mb-2">Hello, Sarah 👋</h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Your unified supply chain command center. Let's get your account ready in just a few steps.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => navigate('/agents?nav=chat')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-primary-700 text-sm font-bold rounded-xl hover:bg-white/90 shadow-sm transition-colors">
                <Bot size={14} /> Ask AI Copilot
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/15 text-white text-sm font-medium rounded-xl hover:bg-white/25 border border-white/20 transition-colors">
                <PlayCircle size={14} /> Quick tour
              </button>
            </div>
          </div>

          {/* Progress circle */}
          <div className="hidden lg:flex flex-col items-center shrink-0 gap-2">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{progress}%</span>
              </div>
            </div>
            <p className="text-white/60 text-[11px] text-center">
              {allDone ? 'All done 🎉' : `${total - done} steps left`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-5 gap-6">

        {/* Left — Checklist */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Getting Started</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{done}/{total} complete</span>
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-1.5 bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {ONBOARDING_STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(step.id)
              const isOpen = activeStep === idx && !isDone
              return (
                <div key={step.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isDone ? 'border-green-100 bg-green-50/30 opacity-70'
                    : isOpen ? `${step.border} bg-white shadow-sm`
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}>
                  <div className="flex items-center gap-3 px-5 py-4 cursor-pointer"
                    onClick={() => !isDone && setActiveStep(isOpen ? -1 : idx)}>
                    {/* Step indicator */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                      isDone ? 'bg-green-500' : isOpen ? 'bg-primary-600' : 'bg-gray-100'
                    }`}>
                      {isDone ? <CheckCircle2 size={14} className="text-white" /> : <span className={isOpen ? 'text-white' : 'text-gray-400'}>{idx + 1}</span>}
                    </div>
                    {/* Icon */}
                    <div className={`w-8 h-8 ${step.bg} rounded-xl flex items-center justify-center shrink-0 ${step.color}`}>
                      {step.icon}
                    </div>
                    <p className={`flex-1 text-sm font-semibold ${isDone ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {step.title}
                    </p>
                    {isDone
                      ? <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-semibold shrink-0">Done ✓</span>
                      : <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    }
                  </div>

                  {isOpen && (
                    <div className={`px-5 pb-5 pt-1 border-t ${step.border} ${step.bg}`}>
                      <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{step.desc}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(step.path)}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border ${step.border} ${step.color} ${step.bg} hover:shadow-sm transition-shadow`}>
                          {step.cta} <ArrowRight size={11} />
                        </button>
                        <button onClick={() => completeStep(step.id, idx)}
                          className="px-3 py-2 text-xs text-gray-400 hover:text-green-600 transition-colors">
                          Mark as done ✓
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {allDone && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">🎉 Setup complete!</p>
                <p className="text-xs text-green-600 mt-0.5">You're ready to use Client Portal 3.0 to its full potential.</p>
              </div>
              <button onClick={onSwitch}
                className="px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors shrink-0">
                Open Dashboard →
              </button>
            </div>
          )}
        </div>

        {/* Right — Support + Announcements */}
        <div className="col-span-2 space-y-4">

          {/* Need Help */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={14} className="text-primary-400" /> Need Help?
            </h3>
            <div className="space-y-2">
              {[
                { icon: <BookOpen size={13} className="text-blue-500" />, bg: 'bg-blue-50', label: 'Documentation', sub: 'User guides & tutorials' },
                { icon: <Phone size={13} className="text-emerald-500" />, bg: 'bg-emerald-50', label: 'Contact Support', sub: 'Mon–Fri, 8am–6pm PST' },
                { icon: <MessageSquare size={13} className="text-violet-500" />, bg: 'bg-violet-50', label: 'Live Chat', sub: 'Chat with our team' },
                { icon: <FileText size={13} className="text-amber-500" />, bg: 'bg-amber-50', label: "What's New in v3.0", sub: 'Release notes' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className={`w-7 h-7 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-400">{item.sub}</p>
                  </div>
                  <ArrowRight size={12} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell size={14} className="text-gray-400" /> Announcements
            </h3>
            <div className="space-y-3">
              {[
                { date: 'Sep 15', badge: '🆕 New', title: 'AI Copilot in all modules', desc: 'Ask questions, get summaries, and take guided actions across every module.', hi: true },
                { date: 'Sep 28', badge: '🔧 Scheduled', title: 'Maintenance: 2–4 AM PST', desc: 'Brief downtime for platform upgrades. Reports unavailable during window.', hi: false },
                { date: 'Sep 10', badge: '📦 Update', title: 'Outbound Order Entry redesigned', desc: 'Faster flow, auto-fill from history, and inline carrier rate comparison.', hi: false },
              ].map((a, i) => (
                <div key={i} className={`rounded-xl p-3.5 border ${a.hi ? 'bg-primary-50 border-primary-100' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-medium">{a.badge}</span>
                    <span className="text-[10px] text-gray-400">{a.date}</span>
                  </div>
                  <p className={`text-xs font-semibold mb-0.5 ${a.hi ? 'text-primary-700' : 'text-gray-700'}`}>{a.title}</p>
                  <p className="text-[10px] text-gray-500 leading-snug">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — unified page header with clean toggle
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [view, setView] = useState<ViewMode>(() => {
    try { const s = localStorage.getItem(LS_KEY); return s === 'new' ? 'new' : 'returning' } catch { return 'returning' }
  })

  const setAndSave = (v: ViewMode) => {
    setView(v)
    try { localStorage.setItem(LS_KEY, v) } catch { /* ignore */ }
  }

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-[1200px]">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {view === 'returning' ? (
            <>
              <h1 className="text-xl font-bold text-gray-900">{greeting}, Sarah 👋</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — Here's what needs your attention today.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900">Welcome to Client Portal 3.0</h1>
              <p className="text-xs text-gray-400 mt-0.5">Complete your setup to unlock the full portal experience.</p>
            </>
          )}
        </div>

        {/* Compact toggle */}
        <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
          <button
            onClick={() => setAndSave('new')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'new' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <Sparkles size={11} /> New User
          </button>
          <button
            onClick={() => setAndSave('returning')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'returning' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <LayoutDashboard size={11} /> Returning User
          </button>
        </div>
      </div>

      {view === 'new'
        ? <NewUserView onSwitch={() => setAndSave('returning')} />
        : <ReturningView />
      }
    </div>
  )
}
