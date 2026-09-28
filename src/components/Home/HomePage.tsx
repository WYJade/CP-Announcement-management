import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Package, Truck, Bot, CheckCircle2, Clock,
  TrendingDown, Warehouse, Ship, DollarSign, Zap, RefreshCw,
  AlertCircle, X, ArrowRight, ExternalLink, FileText, Send,
  BarChart2, ChevronDown, Sparkles, BookOpen, Phone,
  MessageSquare, PlayCircle, LayoutDashboard, User2, Bell,
  Globe, ShoppingCart, Factory, Layers, AlertOctagon,
  TrendingUp, ClipboardList, Calendar, Container,
  ReceiptText, CreditCard, Scale, PackageCheck,
  Forklift, ScanLine, Building2, RefreshCcw,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type UserRole = 'new' | 'returning'
type WorkRole = 'warehouse' | 'supplychain' | 'finance'

interface ModalState {
  type: 'stat' | 'exception' | 'task' | 'agent-action' | null
  data: Record<string, unknown> | null
}

const LS_ROLE    = 'cp_home_role'
const LS_WROLE   = 'cp_work_role'

// ─── Work Role Config ─────────────────────────────────────────────────────────
interface KpiCard {
  label: string; value: string; sub: string; color: string; bg: string
  trend: 'up' | 'down' | 'neutral'; trendVal: string
}
interface ExceptionItem {
  priority: 'P1' | 'P2' | 'P3'; label: string; desc: string
  action: string; color: string; path: string
  detail: string; steps: string[]
}
interface TaskItem {
  id: number; title: string; type: string; priority: string
  due: string; status: string; path: string
}
interface PlatformLink {
  system: string; label: string; icon: React.ReactNode
  color: string; bg: string; border: string; textColor: string
  scenarios: string[]; cta: string; path: string
}

interface WorkRoleConfig {
  id: WorkRole
  label: string
  icon: React.ReactNode
  color: string
  accentBg: string
  accentText: string
  accentBorder: string
  heroSub: string
  kpis: KpiCard[]
  exceptions: ExceptionItem[]
  tasks: TaskItem[]
  platforms: PlatformLink[]
  aiInsights: { icon: React.ReactNode; text: string; action: string; priority: string }[]
}

const WORK_ROLES: WorkRoleConfig[] = [
  // ── Warehouse Ops ──────────────────────────────────────────────────────────
  {
    id: 'warehouse',
    label: 'Warehouse Ops',
    icon: <Warehouse size={14} />,
    color: 'bg-emerald-600',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
    heroSub: 'Inbound receipts · Inventory · Outbound orders · Yard management',
    kpis: [
      { label: "Today's Appointments", value: '86', sub: '14 unconfirmed', color: 'text-violet-600', bg: 'bg-violet-50', trend: 'up', trendVal: '+3' },
      { label: 'Open Inbound RNs', value: '34', sub: '8 past due date', color: 'text-blue-600', bg: 'bg-blue-50', trend: 'down', trendVal: '-2' },
      { label: 'On-Hand Inventory', value: '12,480', sub: 'units across 3 DCs', color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'neutral', trendVal: '±0' },
      { label: 'Low Stock SKUs', value: '7', sub: 'Below safety stock', color: 'text-red-600', bg: 'bg-red-50', trend: 'up', trendVal: '+2' },
      { label: 'Pending Outbound', value: '52', sub: '18 ready to ship', color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'neutral', trendVal: '' },
      { label: 'Yard Entries Today', value: '43', sub: '6 need check-in', color: 'text-amber-600', bg: 'bg-amber-50', trend: 'up', trendVal: '+6' },
    ],
    exceptions: [
      { priority: 'P1', label: 'Appointment not confirmed', desc: '14 warehouse appointments for today still unconfirmed', action: 'Confirm now', color: 'bg-red-500', path: '/inbound/inquiry', detail: 'These appointments are past the 4-hour confirmation window. Carriers may no-show if not confirmed.', steps: ['Open appointment list', 'Filter by Unconfirmed', 'Confirm or reschedule each'] },
      { priority: 'P1', label: 'Inbound receipt overdue', desc: 'RN-38193 has been open for 12 days without update', action: 'Resolve', color: 'bg-red-500', path: '/inbound/inquiry', detail: 'RN-38193 for VITA COCO was expected Jun 21. No receiving update in 12 days. Investigate status.', steps: ['Check carrier status', 'Confirm with DC team', 'Update or cancel RN'] },
      { priority: 'P2', label: 'Low inventory — SKU ADPOST-SMALL-RED', desc: 'Current: 68 units, Safety stock: 80 units', action: 'Check allocation', color: 'bg-orange-400', path: '/inventory/activity', detail: 'Stock has been below safety level for 3 days. Inbound shipment expected Jun 28.', steps: ['Review current allocation', 'Check inbound pipeline', 'Reallocate or expedite'] },
      { priority: 'P2', label: 'Outbound order stuck in Picking', desc: 'DN-8821001 in Picking status for over 6 hours', action: 'Check status', color: 'bg-orange-400', path: '/outbound/inquiry', detail: 'Order DN-8821001 for SharkNinja has been in Picking since 08:00. Escalate to warehouse floor.', steps: ['Check pick task progress', 'Reassign picker', 'Update carrier ETA'] },
    ],
    tasks: [
      { id: 1, title: 'Confirm appointment for APPT-3763 (FEDEX, 01:00)', type: 'Appointment', priority: 'P1', due: 'Today', status: 'Urgent', path: '/inbound/inquiry' },
      { id: 2, title: 'Resolve RN-38193 — VITA COCO, 12 days overdue', type: 'Inbound', priority: 'P1', due: 'Overdue', status: 'Overdue', path: '/inbound/inquiry' },
      { id: 3, title: 'Replenish SKU ADPOST-SMALL-RED (Long Beach DC)', type: 'Inventory', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/inventory/activity' },
      { id: 4, title: 'Complete DN-8821001 pick task — SharkNinja', type: 'Outbound', priority: 'P2', due: 'Today 16:00', status: 'In Progress', path: '/outbound/inquiry' },
      { id: 5, title: 'Process gate entry for ET-822803 (DOCK33456)', type: 'Yard', priority: 'P3', due: 'Today', status: 'Pending', path: '/yard/entry-list' },
    ],
    platforms: [
      { system: 'WMS', label: 'Warehouse Mgmt', icon: <Factory size={15} className="text-white" />, color: 'bg-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', textColor: 'text-emerald-700',
        scenarios: ['Create or manage inbound receipts and put-away', 'Run cycle counts and adjust inventory', 'Process outbound orders and carrier pickups'],
        cta: 'Open WMS', path: '/inventory/activity' },
      { system: 'YMS', label: 'Yard Management', icon: <Container size={15} className="text-white" />, color: 'bg-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-700',
        scenarios: ['Monitor driver gate check-in / check-out', 'Track dock door assignments and yard status', 'Manage appointment windows and no-shows'],
        cta: 'Open YMS', path: '/yard/entry-list' },
      { system: 'OMS', label: 'Order Management', icon: <ShoppingCart size={15} className="text-white" />, color: 'bg-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-700',
        scenarios: ['View outbound order status and fulfillment progress', 'Check carrier assignments and pick/pack updates', 'Confirm shipment readiness with operations'],
        cta: 'Open OMS', path: '/outbound/inquiry' },
    ],
    aiInsights: [
      { icon: <AlertTriangle size={12} className="text-red-400" />, text: '14 unconfirmed appointments today. 3 carriers approaching no-show window. Confirm now to avoid gaps.', action: 'Confirm appointments', priority: 'P1' },
      { icon: <TrendingDown size={12} className="text-orange-400" />, text: 'SKU ADPOST-SMALL-RED below safety stock for 3 days. Inbound expected Jun 28 may not cover demand.', action: 'Review allocation', priority: 'P2' },
      { icon: <RefreshCw size={12} className="text-blue-400" />, text: 'Outbound pick efficiency at 78% today. 4 orders at risk of missing carrier cutoff at 17:00.', action: 'Check outbound', priority: 'P2' },
    ],
  },

  // ── Supply Chain ──────────────────────────────────────────────────────────
  {
    id: 'supplychain',
    label: 'Supply Chain',
    icon: <Ship size={14} />,
    color: 'bg-blue-600',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-200',
    heroSub: 'Shipment tracking · Customs · OTIF performance · Demurrage alerts',
    kpis: [
      { label: 'In-Transit Shipments', value: '1,248', sub: '+12 today', color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up', trendVal: '+12' },
      { label: 'Customs Hold', value: '3', sub: 'Awaiting clearance', color: 'text-red-600', bg: 'bg-red-50', trend: 'up', trendVal: '+1' },
      { label: 'DEM/DET Risk', value: '9', sub: '3 LFD exceeded', color: 'text-amber-600', bg: 'bg-amber-50', trend: 'up', trendVal: '+3' },
      { label: 'OTIF Score (WTD)', value: '93.2%', sub: 'Target: 97%', color: 'text-orange-600', bg: 'bg-orange-50', trend: 'down', trendVal: '-1.8%' },
      { label: 'Approaching LFD', value: '6', sub: 'Within 48 hrs', color: 'text-violet-600', bg: 'bg-violet-50', trend: 'neutral', trendVal: '' },
      { label: 'Pending Milestones', value: '28', sub: 'No update 24h+', color: 'text-teal-600', bg: 'bg-teal-50', trend: 'up', trendVal: '+5' },
    ],
    exceptions: [
      { priority: 'P1', label: 'Container DEM Risk — LFD exceeded', desc: 'WHSU8555505, XYLU8225020, SELU4350353 at Garden City Terminal', action: 'Dispatch now', color: 'bg-red-500', path: '/international-new/tracking', detail: '3 containers past last free day. $150/container/day accruing. Dispatch trucker immediately.', steps: ['Select available trucker', 'Set pickup at Garden City', 'Notify UNIS Seabrook', 'Track dispatch'] },
      { priority: 'P1', label: 'Customs hold — SSHAS2608135', desc: 'Entry 82G-0101679-0 on hold awaiting additional docs', action: 'Submit docs', color: 'bg-red-500', path: '/international-new/tracking', detail: 'Customs hold at Savannah. LFD Jun 20. Missing: commercial invoice revision and packing list.', steps: ['Prepare revised invoice', 'Submit to customs broker', 'Track clearance status'] },
      { priority: 'P2', label: 'OTIF penalty risk — Week 35', desc: '5 orders at VITA COCO and ORGAIN LLC approaching threshold', action: 'Review orders', color: 'bg-orange-400', path: '/dashboard/otif', detail: 'OTIF at 95.8% for these accounts. One more delay triggers penalty clause per retailer agreement.', steps: ['Load OTIF risk report', 'Identify at-risk orders', 'Confirm carrier windows', 'Update forecast'] },
      { priority: 'P2', label: '6 containers approaching LFD (48 hrs)', desc: 'Action required before Sep 26 to avoid demurrage', action: 'Schedule pickup', color: 'bg-orange-400', path: '/international-new/tracking', detail: '6 containers at Long Beach terminal with LFD within 48 hours. Pre-arrange drayage now.', steps: ['Identify available drayage carriers', 'Book appointments', 'Confirm with terminal'] },
    ],
    tasks: [
      { id: 1, title: 'Dispatch trucker for WHSU8555505 at Garden City', type: 'DEM/DET', priority: 'P1', due: 'Today', status: 'Overdue', path: '/international-new/tracking' },
      { id: 2, title: 'Submit customs docs for SSHAS2608135 (Entry 82G)', type: 'Customs', priority: 'P1', due: 'Today 17:00', status: 'Urgent', path: '/international-new/tracking' },
      { id: 3, title: 'Confirm carrier windows for 5 OTIF-risk orders', type: 'OTIF', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/dashboard/otif' },
      { id: 4, title: 'Schedule drayage for 6 containers (LFD <48hrs)', type: 'DEM/DET', priority: 'P2', due: 'Sep 26', status: 'Pending', path: '/international-new/tracking' },
      { id: 5, title: 'Update shipment milestones — 28 containers 24h+ no update', type: 'Tracking', priority: 'P3', due: 'Aug 6', status: 'In Progress', path: '/international-new/tracking' },
    ],
    platforms: [
      { system: 'Tracking', label: 'Shipment Tracking', icon: <Globe size={15} className="text-white" />, color: 'bg-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', textColor: 'text-teal-700',
        scenarios: ['Track containers from port of loading to warehouse door', 'Monitor customs clearance and LFD deadlines', 'View OTIF performance and retailer scorecards'],
        cta: 'Open Tracking', path: '/international-new/tracking' },
      { system: 'OMS', label: 'Order Management', icon: <ShoppingCart size={15} className="text-white" />, color: 'bg-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-700',
        scenarios: ['Check sales order status and carrier assignments', 'Monitor shipment milestones and POD status', 'Manage wholesale and retail order fulfillment'],
        cta: 'Open OMS', path: '/sales/wholesale' },
      { system: 'Insights', label: 'Analytics & KPI', icon: <BarChart2 size={15} className="text-white" />, color: 'bg-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', textColor: 'text-violet-700',
        scenarios: ['View OTIF dashboards and root cause analysis', 'Track retailer scorecards and penalty forecasts', 'Analyze supply chain lead times and trends'],
        cta: 'Open Insights', path: '/dashboard/otif' },
    ],
    aiInsights: [
      { icon: <AlertTriangle size={12} className="text-red-400" />, text: '3 containers at Garden City past LFD. Demurrage accruing at $150/day. Expedite dispatch to avoid further charges.', action: 'Initiate dispatch', priority: 'P1' },
      { icon: <TrendingDown size={12} className="text-orange-400" />, text: 'OTIF at 93.2% for Week 35 — below 97% target. 5 orders at risk. Confirm carrier windows before EoD.', action: 'Review orders', priority: 'P2' },
      { icon: <RefreshCw size={12} className="text-blue-400" />, text: '28 containers have had no milestone update in 24+ hours. Recommend contacting carriers for status.', action: 'Check milestones', priority: 'P2' },
    ],
  },

  // ── Finance ───────────────────────────────────────────────────────────────
  {
    id: 'finance',
    label: 'Finance',
    icon: <DollarSign size={14} />,
    color: 'bg-amber-600',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-200',
    heroSub: 'Invoices · Claims · Deductions · Payment tracking',
    kpis: [
      { label: 'Open Invoices', value: '$284K', sub: '23 invoices pending', color: 'text-amber-600', bg: 'bg-amber-50', trend: 'up', trendVal: '+$12K' },
      { label: 'Overdue Balance', value: '$47K', sub: '3 accounts past due', color: 'text-red-600', bg: 'bg-red-50', trend: 'up', trendVal: '+$8K' },
      { label: 'Open Disputes', value: '5', sub: '$18,200 in dispute', color: 'text-orange-600', bg: 'bg-orange-50', trend: 'up', trendVal: '+2' },
      { label: 'Claims Pending', value: '8', sub: '$24,500 in claims', color: 'text-violet-600', bg: 'bg-violet-50', trend: 'neutral', trendVal: '' },
      { label: 'Paid This Month', value: '$156K', sub: '18 invoices cleared', color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'up', trendVal: '+$23K' },
      { label: 'Credit Utilization', value: '68%', sub: 'Limit: $500K', color: 'text-blue-600', bg: 'bg-blue-50', trend: 'neutral', trendVal: '' },
    ],
    exceptions: [
      { priority: 'P1', label: 'Overdue invoice — 3 accounts', desc: 'THE ONLY BEAN LLC overdue by 14 days ($18,240)', action: 'Send reminder', color: 'bg-red-500', path: '/finance/invoices', detail: 'INV-19043770 ($12,500) and INV-19043771 ($5,740) are 14 days past due. Auto-reminder disabled.', steps: ['Review invoice details', 'Send payment reminder', 'Escalate if no response in 3 days'] },
      { priority: 'P1', label: 'Invoice dispute — response required', desc: 'INV-20260601 disputed by THE ONLY BEAN LLC ($3,240)', action: 'Respond now', color: 'bg-red-500', path: '/finance/invoices', detail: 'Dispute filed Aug 1. Reason: quantity mismatch on SSHAS2608135. POD and packing list attached.', steps: ['Review POD and packing list', 'Compare with receipt records', 'Submit formal response'] },
      { priority: 'P2', label: 'Claim pending — carrier damage', desc: 'Claim CLM-2026-041 for $4,800 — no carrier response in 7 days', action: 'Follow up', color: 'bg-orange-400', path: '/finance/claims', detail: 'Claim filed against UPS FREIGHT for damaged goods in SSHAS2608072. Photos submitted Aug 5.', steps: ['Resend claim documentation', 'Contact carrier rep directly', 'Escalate to senior if no response'] },
      { priority: 'P2', label: 'Payment terms mismatch', desc: 'ADOORN LLC invoice issued with Net30, PO specifies Net60', action: 'Correct terms', color: 'bg-orange-400', path: '/finance/invoices', detail: 'INV-20260615 incorrectly issued with Net30 payment terms. Customer PO specifies Net60.', steps: ['Issue corrected invoice', 'Notify accounts receivable', 'Update billing system'] },
    ],
    tasks: [
      { id: 1, title: 'Send overdue reminder to THE ONLY BEAN LLC ($18,240)', type: 'Invoice', priority: 'P1', due: 'Today', status: 'Overdue', path: '/finance/invoices' },
      { id: 2, title: 'Respond to invoice dispute INV-20260601 (THE ONLY BEAN)', type: 'Dispute', priority: 'P1', due: 'Today', status: 'Urgent', path: '/finance/invoices' },
      { id: 3, title: 'Follow up on carrier claim CLM-2026-041 ($4,800)', type: 'Claim', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/finance/claims' },
      { id: 4, title: 'Correct invoice terms — ADOORN LLC INV-20260615', type: 'Invoice', priority: 'P2', due: 'Aug 5', status: 'Pending', path: '/finance/invoices' },
      { id: 5, title: 'Reconcile August billing for ORGAIN LLC account', type: 'Reconciliation', priority: 'P3', due: 'Aug 6', status: 'In Progress', path: '/finance/invoices' },
    ],
    platforms: [
      { system: 'Finance', label: 'Finance Portal', icon: <DollarSign size={15} className="text-white" />, color: 'bg-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-700',
        scenarios: ['Review, download, or dispute WMS and TMS invoices', 'Submit and track freight damage claims', 'Manage deductions and reconcile billing'],
        cta: 'Open Finance', path: '/finance/invoices' },
      { system: 'OMS', label: 'Order Management', icon: <ShoppingCart size={15} className="text-white" />, color: 'bg-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-700',
        scenarios: ['Verify order quantities against invoiced amounts', 'Download POD documents for billing evidence', 'Check wholesale order financial settlement status'],
        cta: 'Open OMS', path: '/sales/wholesale' },
      { system: 'Reports', label: 'Analytics & Reports', icon: <BarChart2 size={15} className="text-white" />, color: 'bg-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', textColor: 'text-violet-700',
        scenarios: ['Generate monthly billing and cost summary reports', 'Analyze cost-per-shipment and billing grade trends', 'Export finance data for internal accounting systems'],
        cta: 'Open Reports', path: '/dashboard/kpi' },
    ],
    aiInsights: [
      { icon: <AlertTriangle size={12} className="text-red-400" />, text: 'THE ONLY BEAN LLC has $18,240 overdue for 14 days. Auto-reminder was disabled. Manual follow-up recommended today.', action: 'Send reminder', priority: 'P1' },
      { icon: <TrendingDown size={12} className="text-orange-400" />, text: 'Dispute INV-20260601 has been open for 21 days. Customer response SLA is 30 days — submit formal response now.', action: 'Respond to dispute', priority: 'P2' },
      { icon: <RefreshCw size={12} className="text-blue-400" />, text: 'Carrier claim CLM-2026-041 ($4,800) has had no response in 7 days. Escalation window closes in 3 days.', action: 'Escalate claim', priority: 'P2' },
    ],
  },
]

// ─── Onboarding steps (new user) ──────────────────────────────────────────────
const ONBOARDING_STEPS = [
  { id: 'profile', icon: <User2 size={15} />, title: 'Complete your company profile', desc: 'Add your company name, contact info, and billing details.', cta: 'Set up profile', path: '/system/accounts', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'inbound', icon: <Package size={15} />, title: 'Submit your first inbound receipt', desc: 'Create an RN to start tracking incoming goods in real time.', cta: 'Create receipt', path: '/inbound/inquiry', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'inventory', icon: <Warehouse size={15} />, title: 'Review your inventory snapshot', desc: 'Check on-hand stock, locations, and discrepancies across facilities.', cta: 'View inventory', path: '/inventory/activity', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'outbound', icon: <Truck size={15} />, title: 'Submit your first outbound order', desc: 'Create an outbound order and track every milestone to delivery.', cta: 'Create order', path: '/outbound/inquiry', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'finance', icon: <DollarSign size={15} />, title: 'Connect billing & review invoices', desc: 'Link payment and review outstanding invoices or charges.', cta: 'View Finance', path: '/finance/invoices', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
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

function ExceptionModal({ ex, onClose }: { ex: ExceptionItem; onClose: () => void }) {
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
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ex.detail}</p>
        {!submitted ? (
          <>
            <div className="space-y-2 mb-4">
              {ex.steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer ${i <= step ? 'border-primary-200 bg-primary-50' : 'border-gray-100'}`} onClick={() => setStep(i)}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i < step ? '✓' : i + 1}</div>
                  <span className={`text-xs ${i <= step ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigate(ex.path); onClose() }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
                <ExternalLink size={12} /> Open Module
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

function TaskModal({ task, onClose }: { task: TaskItem; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Modal onClose={onClose}>
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${task.priority === 'P1' ? 'bg-red-500' : task.priority === 'P2' ? 'bg-orange-400' : 'bg-gray-400'}`}>{task.priority}</span>
          <h3 className="text-sm font-bold text-gray-900 truncate max-w-xs">{task.title}</h3>
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{task.type}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><Clock size={9} /> Due: {task.due}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">Dismiss</button>
          <button onClick={() => { navigate(task.path); onClose() }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700">
            <ArrowRight size={12} /> Open {task.type}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── AI Agent Panel ───────────────────────────────────────────────────────────
function AIAgentPanel({ insights, onAction }: { insights: WorkRoleConfig['aiInsights']; onAction: (a: string) => void }) {
  return (
    <div className="space-y-2">
      {insights.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-3 border border-violet-100">
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
  )
}

// ─── Platform Gateway ─────────────────────────────────────────────────────────
function PlatformGateway({ platforms }: { platforms: PlatformLink[] }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={14} className="text-gray-400" />
        <h2 className="text-sm font-bold text-gray-800">Which platform do you need?</h2>
        <span className="text-[10px] text-gray-400">Choose by business scenario</span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}>
        {platforms.map((p) => (
          <div key={p.system} className={`border ${p.border} rounded-xl p-4 flex flex-col gap-3`}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 ${p.color} rounded-lg flex items-center justify-center shrink-0`}>{p.icon}</div>
              <div>
                <p className={`text-xs font-bold ${p.textColor}`}>{p.system}</p>
                <p className="text-[10px] text-gray-400">{p.label}</p>
              </div>
            </div>
            <ul className="space-y-1.5 flex-1">
              {p.scenarios.map((sc, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-snug">
                  <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${p.color}`} />
                  {sc}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate(p.path)}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg ${p.bg} ${p.textColor} hover:opacity-80 transition-opacity`}>
              {p.cta} <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROLE-BASED RETURNING USER VIEW
// ═══════════════════════════════════════════════════════════════════════════════
type HubTab = 'exceptions' | 'tasks' | 'ai'

function RoleView({ config }: { config: WorkRoleConfig }) {
  const navigate = useNavigate()
  const [hubTab, setHubTab] = useState<HubTab>('exceptions')
  const [taskFilter, setTaskFilter] = useState<'all' | 'overdue' | 'today'>('all')
  const [exModal, setExModal] = useState<ExceptionItem | null>(null)
  const [taskModal, setTaskModal] = useState<TaskItem | null>(null)
  const [agentAction, setAgentAction] = useState<string | null>(null)

  const [modalState, setModalState] = useState<ModalState>({ type: null, data: null })

  const openStat = (kpi: KpiCard) => setModalState({ type: 'stat', data: kpi as unknown as Record<string, unknown> })
  const closeModal = () => { setModalState({ type: null, data: null }); setExModal(null); setTaskModal(null); setAgentAction(null) }

  const filteredTasks = config.tasks.filter(t => {
    if (taskFilter === 'overdue') return t.status === 'Overdue'
    if (taskFilter === 'today') return t.due === 'Today' || t.due.startsWith('Today')
    return true
  })

  const p1Count = config.exceptions.filter(e => e.priority === 'P1').length
  const overdueCount = config.tasks.filter(t => t.status === 'Overdue').length

  const TABS: { id: HubTab; label: string; badge?: string; badgeColor?: string }[] = [
    { id: 'exceptions', label: 'Exceptions & Actions', badge: p1Count > 0 ? `${p1Count} P1` : undefined, badgeColor: 'bg-red-100 text-red-600' },
    { id: 'tasks', label: 'My Tasks', badge: overdueCount > 0 ? `${overdueCount} overdue` : undefined, badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'ai', label: 'AI Insights' },
  ]

  return (
    <div className="space-y-4 pb-6">

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-6 gap-3">
        {config.kpis.map((k, i) => (
          <div key={i} onClick={() => openStat(k)}
            className={`${k.bg} rounded-xl px-4 py-3.5 border border-white/80 cursor-pointer hover:shadow-md transition-all group`}>
            <p className="text-[10px] text-gray-500 font-medium mb-1.5 leading-tight">{k.label}</p>
            <p className={`text-[22px] font-bold ${k.color} leading-none mb-1`}>{k.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-gray-400">{k.sub}</p>
              {k.trendVal && (
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${k.trend === 'up' ? k.color.includes('red') || k.color.includes('orange') || k.color.includes('amber') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600' : k.trend === 'down' ? k.color.includes('red') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                  {k.trendVal}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Priority Action Hub ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center border-b border-gray-100 bg-gray-50/50">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setHubTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-semibold relative transition-colors ${hubTab === tab.id ? 'text-primary-700 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
              {tab.badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tab.badgeColor}`}>{tab.badge}</span>}
              {hubTab === tab.id && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 rounded-full" />}
            </button>
          ))}
          <div className="ml-auto px-5">
            <button onClick={() => navigate(hubTab === 'exceptions' ? config.platforms[0].path : '/')}
              className="text-[10px] text-primary-600 hover:underline font-medium">View all →</button>
          </div>
        </div>

        <div className="p-5">
          {hubTab === 'exceptions' && (
            <div className="grid grid-cols-2 gap-2.5">
              {config.exceptions.map((ex, i) => (
                <div key={i} onClick={() => setExModal(ex)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer hover:shadow-sm transition-all group ${ex.priority === 'P1' ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                  <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${ex.color}`}>{ex.priority}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 mb-0.5">{ex.label}</p>
                    <p className="text-[10px] text-gray-500 leading-snug truncate">{ex.desc}</p>
                    <p className="text-[10px] text-primary-600 font-medium mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">{ex.action} <ArrowRight size={9} /></p>
                  </div>
                </div>
              ))}
            </div>
          )}

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
              <div className="space-y-2">
                {filteredTasks.map(task => (
                  <div key={task.id} onClick={() => setTaskModal(task)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all group ${task.status === 'Overdue' ? 'bg-red-50/40 border-red-100' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.status === 'Overdue' ? 'bg-red-500' : task.status === 'Urgent' ? 'bg-orange-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 group-hover:text-primary-700 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] bg-white text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{task.type}</span>
                        <span className={`text-[9px] font-semibold ${task.priority === 'P1' ? 'text-red-500' : task.priority === 'P2' ? 'text-orange-500' : 'text-gray-400'}`}>{task.priority}</span>
                        <span className="flex items-center gap-0.5 text-[9px] text-gray-400"><Clock size={8} />{task.due}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${task.status === 'Overdue' ? 'bg-red-50 text-red-600' : task.status === 'Urgent' ? 'bg-orange-50 text-orange-600' : task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hubTab === 'ai' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"><Bot size={11} className="text-white" /></div>
                <p className="text-xs font-bold text-gray-800">AI Analysis</p>
                <p className="text-[10px] text-gray-400">Insights tailored to your role</p>
              </div>
              <AIAgentPanel insights={config.aiInsights} onAction={a => setAgentAction(a)} />
            </div>
          )}
        </div>
      </div>

      {/* ── Platform Gateway ── */}
      <PlatformGateway platforms={config.platforms} />

      {/* Modals */}
      {modalState.type === 'stat' && modalState.data && (
        <Modal onClose={closeModal}>
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">{(modalState.data as KpiCard).label}</h3>
            <button onClick={closeModal}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="p-5">
            <p className={`text-4xl font-bold ${(modalState.data as KpiCard).color} mb-2`}>{(modalState.data as KpiCard).value}</p>
            <p className="text-sm text-gray-500">{(modalState.data as KpiCard).sub}</p>
          </div>
        </Modal>
      )}
      {exModal && <ExceptionModal ex={exModal} onClose={closeModal} />}
      {taskModal && <TaskModal task={taskModal} onClose={closeModal} />}
      {agentAction && (
        <Modal onClose={closeModal}>
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2"><Bot size={14} className="text-violet-500" /><h3 className="text-sm font-bold">AI Action: {agentAction}</h3></div>
            <button onClick={closeModal}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="p-5 text-center">
            <Zap size={32} className="text-violet-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">Navigate to the relevant module to complete this action with AI guidance.</p>
            <button onClick={closeModal} className="px-5 py-2 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700">OK</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEW USER VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function NewUserHome({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate()
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState(0)
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
      showToast('🎉 All done! Loading your dashboard...')
      setTransitioning(true)
      setTimeout(() => { onSwitch(); setTransitioning(false) }, 2200)
    } else {
      const msgs = ['Great start! On to step 2.', 'Nice work! Keep going.', "Halfway there — you're doing great!", 'Almost done — one step left!']
      showToast('✅ ' + (msgs[idx] || 'Step complete!'))
      const nextIdx = ONBOARDING_STEPS.findIndex((s, i) => i > idx && !next.includes(s.id))
      if (nextIdx !== -1) setActiveStep(nextIdx)
    }
  }

  return (
    <div className={`space-y-5 pb-8 transition-opacity duration-700 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl">
          {toast}
        </div>
      )}

      {/* Compact Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-700 px-7 py-6 flex items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative flex-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2">
            <Sparkles size={10} /> Welcome to Client Portal 3.0
          </div>
          <h1 className="text-xl font-bold text-white">Hello, Sarah 👋 <span className="text-white/70 font-normal text-base">— Get your account ready in 5 steps.</span></h1>
          <div className="flex items-center gap-2.5 mt-3">
            <button onClick={() => navigate('/agents?nav=chat')} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-primary-700 text-xs font-bold rounded-xl hover:bg-white/90 shadow-sm">
              <Bot size={13} /> Ask AI Copilot
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 text-white text-xs font-medium rounded-xl hover:bg-white/25 border border-white/20">
              <PlayCircle size={13} /> Quick tour
            </button>
          </div>
        </div>
        {/* Progress ring */}
        <div className="hidden lg:flex flex-col items-center shrink-0">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="white" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{progress}%</span>
            </div>
          </div>
          <p className="text-white/60 text-[10px] mt-1 text-center">{allDone ? 'Done! 🎉' : `${ONBOARDING_STEPS.length - completedSteps.length} left`}</p>
        </div>
      </div>

      {/* Checklist + Side */}
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-gray-900">Getting Started — {completedSteps.length}/{ONBOARDING_STEPS.length}</h2>
            <div className="w-28 bg-gray-100 rounded-full h-1.5"><div className="bg-primary-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>
          {ONBOARDING_STEPS.map((step, idx) => {
            const done = completedSteps.includes(step.id)
            const isOpen = activeStep === idx && !done
            return (
              <div key={step.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${done ? 'border-green-200 opacity-60' : isOpen ? `${step.border} shadow-sm` : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => !done && setActiveStep(isOpen ? -1 : idx)}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${done ? 'bg-green-500 border-green-500' : isOpen ? `border-current ${step.color}` : 'border-gray-200 bg-gray-50'}`}>
                    {done ? <CheckCircle2 size={13} className="text-white" /> : <span className="text-[10px] font-bold text-gray-400">{idx + 1}</span>}
                  </div>
                  <div className={`w-7 h-7 ${step.bg} rounded-lg flex items-center justify-center shrink-0 ${step.color}`}>{step.icon}</div>
                  <p className={`flex-1 text-sm font-semibold ${done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{step.title}</p>
                  {done ? <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full shrink-0">Done ✓</span>
                    : <ChevronDown size={13} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                </div>
                {isOpen && (
                  <div className={`px-4 pb-4 pt-1 border-t ${step.border} ${step.bg}`}>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(step.path)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${step.border} ${step.color} ${step.bg}`}>
                        {step.cta} <ArrowRight size={11} />
                      </button>
                      <button onClick={() => completeStep(step.id, idx)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-green-600">Mark done ✓</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5"><MessageSquare size={12} className="text-primary-500" /> Need Help?</h3>
            <div className="space-y-1.5">
              {[
                { icon: <BookOpen size={12} className="text-blue-600" />, bg: 'bg-blue-50', title: 'Documentation', sub: 'User guides & tutorials' },
                { icon: <Phone size={12} className="text-emerald-600" />, bg: 'bg-emerald-50', title: 'Contact Support', sub: 'Mon–Fri, 8am–6pm PST' },
                { icon: <MessageSquare size={12} className="text-violet-600" />, bg: 'bg-violet-50', title: 'Live Chat', sub: 'Chat with our team' },
                { icon: <FileText size={12} className="text-amber-600" />, bg: 'bg-amber-50', title: "What's New in v3.0", sub: 'Release notes' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className={`w-6 h-6 ${item.bg} rounded-md flex items-center justify-center shrink-0`}>{item.icon}</div>
                  <div className="flex-1"><p className="text-xs font-semibold text-gray-800">{item.title}</p><p className="text-[10px] text-gray-400">{item.sub}</p></div>
                  <ChevronRight size={10} className="text-gray-300 group-hover:text-gray-500" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5"><Bell size={12} className="text-gray-400" /> Announcements</h3>
            <div className="space-y-2.5">
              {[
                { badge: '🆕 Sep 15', title: 'AI Copilot now in all modules', desc: 'Ask questions and take guided actions across every module.' },
                { badge: '🔧 Sep 28', title: 'Maintenance window 2–4 AM PST', desc: 'Brief downtime for platform upgrades.' },
              ].map((a, i) => (
                <div key={i} className={`rounded-lg p-2.5 border ${i === 0 ? 'bg-primary-50 border-primary-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-[10px] text-gray-500 mb-0.5">{a.badge}</p>
                  <p className={`text-[11px] font-semibold ${i === 0 ? 'text-primary-700' : 'text-gray-700'}`}>{a.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{a.desc}</p>
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
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try { const s = localStorage.getItem(LS_ROLE); return s === 'new' || s === 'returning' ? s : 'returning' } catch { return 'returning' }
  })
  const [workRole, setWorkRole] = useState<WorkRole>(() => {
    try { const s = localStorage.getItem(LS_WROLE); return (s as WorkRole) || 'warehouse' } catch { return 'warehouse' }
  })

  const switchUserRole = (r: UserRole) => { setUserRole(r); try { localStorage.setItem(LS_ROLE, r) } catch { } }
  const switchWorkRole = (r: WorkRole) => { setWorkRole(r); try { localStorage.setItem(LS_WROLE, r) } catch { } }

  const currentConfig = WORK_ROLES.find(r => r.id === workRole)!
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      {/* ── Unified top bar ── */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="flex-1">
          {userRole === 'returning' ? (
            <>
              <h1 className="text-lg font-bold text-gray-900">{greeting}, Sarah 👋</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-bold text-gray-900">Getting Started</h1>
              <p className="text-xs text-gray-400 mt-0.5">Complete your setup to unlock the full portal</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Work role selector — only for returning users */}
          {userRole === 'returning' && (
            <div className="flex items-center gap-0.5 bg-white border border-gray-200 p-0.5 rounded-xl shadow-sm">
              {WORK_ROLES.map(r => (
                <button key={r.id} onClick={() => switchWorkRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${workRole === r.id ? `${r.color} text-white shadow-sm` : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          )}

          {/* User type toggle */}
          <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button onClick={() => switchUserRole('new')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${userRole === 'new' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
              <Sparkles size={10} /> New
            </button>
            <button onClick={() => switchUserRole('returning')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${userRole === 'returning' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
              <LayoutDashboard size={10} /> Returning
            </button>
          </div>
        </div>
      </div>

      {/* ── View ── */}
      {userRole === 'new'
        ? <NewUserHome onSwitch={() => switchUserRole('returning')} />
        : <RoleView config={currentConfig} />
      }
    </div>
  )
}
