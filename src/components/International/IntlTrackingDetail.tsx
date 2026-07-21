import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Truck, Eye, Clock, MapPin, GripVertical } from 'lucide-react'
import { GuidedTour, DETAIL_OVERVIEW_STEPS, useDetailTourGuide } from './OnboardingGuide'

const D = {
  customer: 'ADOORN LLC', carrier: 'WAN HAI LINES', shipmentNo: 'SSHAS2608137', hbl: 'SSGNS2607829', mbl: '039GX40070',
  container: 'WHSU8555505', status: 'Drayage in Progress', milestone: 'Port to Warehouse Delivery Scheduled',
  origin: 'Haiphong, VN', destination: 'UNIS Seabrook Warehouse, Deer Park, NY',
  vessel: 'WAN HAI A10 / E013', podEta: 'Jun 13, 2026 14:00', whEta: 'Jun 19, 2026 09:00', lastUpdated: 'Jun 15, 2026 08:30',
  progress: 62, totalContainers: 1, totalSkus: 10, totalWeight: '10,542 KG', volume: '68 M\u00b3',
  containers: [{ containerNo: 'WHSU8555505', size: '40HC', seal: 'WHLW847513', loadNo: 'UNIS_SAV_M012771', drayageStatus: 'Scheduled', pickupTerminal: 'Garden City Terminal', destWarehouse: 'UNIS Seabrook', lfd: 'Jun 11, 2026', deliveryEta: 'Jun 19, 2026', deliveredTime: '-' }],
  items: [
    { sku: 'ADPOST-SMALL-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Small - Snow White', expected: 72, received: '72', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
    { sku: 'ADPOST-SMALL-RED', name: 'Post Mount Locking Mailbox', variant: 'Small - Red', expected: 72, received: '70', diff: '-2', damaged: '1', unit: 'EA', status: 'Received' },
    { sku: 'ADPOST-LARGE-WHITE', name: 'Post Mount Locking Mailbox', variant: 'Large - White', expected: 96, received: '96', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
    { sku: 'ADPOST-LARGE-RED', name: 'Post Mount Locking Mailbox', variant: 'Large - Red', expected: 96, received: '94', diff: '-2', damaged: '2', unit: 'EA', status: 'Received' },
    { sku: 'ADBOX-SMALL', name: 'Package Box', variant: 'Small (Corrugated)', expected: 55, received: '55', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
    { sku: 'ADBOX-LARGE', name: 'Package Box', variant: 'Large (Corrugated)', expected: 55, received: '55', diff: '0', damaged: '0', unit: 'EA', status: 'Received' },
  ],
  documents: [
    { type: 'HBL', docNo: 'SSGNS2607829', fileName: 'HBL_SSGNS2607829.pdf', status: 'Available', time: 'Apr 22, 2026' },
    { type: 'MBL', docNo: '039GX40070', fileName: 'MBL_039GX40070.pdf', status: 'Available', time: 'Apr 22, 2026' },
    { type: 'Commercial Invoice', docNo: 'CI-20260601', fileName: 'Invoice_CI-20260601.pdf', status: 'Available', time: 'Jun 01, 2026' },
    { type: 'Packing List', docNo: 'PL-20260601', fileName: 'PackingList_PL-20260601.pdf', status: 'Available', time: 'Jun 01, 2026' },
    { type: 'Customs Entry', docNo: '82G-0101679-0', fileName: 'Entry_82G-0101679-0.pdf', status: 'Available', time: 'Jun 10, 2026' },
    { type: 'Warehouse Receipt', docNo: 'RN-38199', fileName: '', status: 'Pending', time: '-' },
  ],
}

// ─── Phase & Status Color System ─────────────────────────────────────────────
type PhaseKey = 'ocean' | 'customs' | 'drayage' | 'warehouse'

const PHASE_COLORS: Record<PhaseKey, { bg: string; border: string; text: string; lightBg: string; dot: string; line: string; badge: string }> = {
  ocean:     { bg: 'bg-blue-500',   border: 'border-blue-400',   text: 'text-blue-700',   lightBg: 'bg-blue-50',   dot: 'bg-blue-400',   line: 'bg-blue-200', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  customs:   { bg: 'bg-teal-500',   border: 'border-teal-400',   text: 'text-teal-700',   lightBg: 'bg-teal-50',   dot: 'bg-teal-400',   line: 'bg-teal-200', badge: 'bg-teal-100 text-teal-700 border-teal-200' },
  drayage:   { bg: 'bg-violet-500', border: 'border-violet-400', text: 'text-violet-700', lightBg: 'bg-violet-50', dot: 'bg-violet-400', line: 'bg-violet-200', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  warehouse: { bg: 'bg-green-500',  border: 'border-green-400',  text: 'text-green-700',  lightBg: 'bg-green-50',  dot: 'bg-green-400',  line: 'bg-green-200', badge: 'bg-green-100 text-green-700 border-green-200' },
}

interface StatusNode {
  status: string
  date: string
  location: string
  completed: boolean
  active: boolean
}

interface PhaseNode {
  phase: string
  phaseKey: PhaseKey
  id: string
  completed: boolean
  active: boolean
  statuses: StatusNode[]
}

// Timeline data - all dates include hour:minute
const TIMELINE_PHASES: PhaseNode[] = [
  {
    phase: 'International Transportation',
    phaseKey: 'ocean',
    id: 'SSGNS2607829',
    completed: true,
    active: false,
    statuses: [
      { status: 'Booked', date: 'Apr 15, 2026 10:30', location: 'Haiphong, VN', completed: true, active: false },
      { status: 'In Transit', date: 'Apr 22, 2026 06:00', location: 'WAN HAI A10 / E013', completed: true, active: false },
      { status: 'Arrived', date: 'Jun 13, 2026 14:20', location: 'Savannah, GA (POD)', completed: true, active: false },
    ]
  },
  {
    phase: 'Customs Clearance',
    phaseKey: 'customs',
    id: '82G-0101679-0',
    completed: true,
    active: false,
    statuses: [
      { status: 'Customs Released', date: 'Jun 10, 2026 16:45', location: 'Savannah, GA', completed: true, active: false },
    ]
  },
  {
    phase: 'Drayage',
    phaseKey: 'drayage',
    id: 'UNIS_SAV_M012771',
    completed: false,
    active: true,
    statuses: [
      { status: 'Available', date: 'Jun 11, 2026 08:00', location: 'Garden City Terminal', completed: true, active: false },
      { status: 'Dispatched', date: 'Jun 15, 2026 07:30', location: 'Garden City Terminal', completed: true, active: false },
      { status: 'OFD', date: 'Jun 19, 2026 06:00 (ETA)', location: 'Enroute to UNIS Seabrook', completed: false, active: true },
      { status: 'Delivered', date: 'TBD', location: 'UNIS Seabrook', completed: false, active: false },
      { status: 'Returned', date: 'TBD', location: 'SSL Empty Return', completed: false, active: false },
    ]
  },
  {
    phase: 'Warehouse Receiving',
    phaseKey: 'warehouse',
    id: 'RN-38199',
    completed: false,
    active: false,
    statuses: [
      { status: 'Receiving', date: 'TBD (~Jun 21, 2026 09:00)', location: 'UNIS Seabrook', completed: false, active: false },
      { status: 'Received', date: 'TBD', location: 'UNIS Seabrook', completed: false, active: false },
    ]
  },
]

const TABS = ['Containers(Drayage)', 'Items SKUs', 'Customs Clearance', 'Drayage Load']
const MAIN_TABS = ['Overview', 'Containers(Drayage)', 'Items SKUs', 'Customs Clearance', 'Drayage Load']

export default function IntlTrackingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.includes('/tracking2') ? '/international/tracking2' : location.pathname.includes('/backup') ? '/backup/tracking' : '/international/tracking'
  const [activeTab, setActiveTab] = useState(MAIN_TABS[0])
  const [viewDoc, setViewDoc] = useState<string | null>(null)
  const [mapFullscreen, setMapFullscreen] = useState(false)
  const { showDetailTour, handleDetailTourComplete } = useDetailTourGuide()

  // ─── Draggable Splitter State ─────────────────────────────────────────────
  const [leftWidth, setLeftWidth] = useState(300)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = leftWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [leftWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const delta = e.clientX - startX.current
      const containerWidth = containerRef.current?.offsetWidth || 900
      const newWidth = Math.min(Math.max(startWidth.current + delta, 220), containerWidth * 0.45)
      setLeftWidth(newWidth)
    }
    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <button onClick={() => navigate(basePath)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"><ArrowLeft size={14} /> Back to Shipment Tracking</button>

      {/* Main Tabs */}
      <div className="flex gap-6 mb-5 border-b border-gray-200">
        <button onClick={() => setActiveTab('Overview')} className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'Overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Overview</button>
        <div data-tour="detail-tabs-only" className="flex gap-6">
          {MAIN_TABS.slice(1).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* ═══ Tab: Overview (left info + draggable splitter + right timeline) ═══ */}
      {activeTab === 'Overview' && (
        <div ref={containerRef} data-tour="overview-content" className="flex border border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: '600px' }}>
          {/* Left: Info Panel */}
          <div data-tour="info-panel" className="shrink-0 overflow-y-auto bg-gray-50/80" style={{ width: `${leftWidth}px` }}>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div><p className="text-[9px] text-gray-400 uppercase tracking-wide">Customer</p><h2 className="text-base font-bold text-gray-900">{D.customer}</h2></div>
                </div>
                <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">{D.status}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-3 text-xs">
                <div><p className="text-[9px] text-gray-400 uppercase">Customer</p><p className="font-semibold text-gray-900">{D.customer}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Shipment No.</p><p className="font-semibold text-gray-900">{D.shipmentNo}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">HBL</p><p className="font-semibold text-gray-900">{D.hbl}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">MBL</p><p className="font-semibold text-gray-900">{D.mbl}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Container</p><p className="font-semibold text-gray-900">{D.container}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Carrier / Vessel</p><p className="text-gray-700">{D.vessel}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Current Milestone</p><p className="text-gray-700">{D.milestone}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">POD ETA</p><p className="text-gray-700">{D.podEta}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase">Warehouse ETA</p><p className="font-semibold text-primary-600">{D.whEta}</p></div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-[9px] text-gray-400 uppercase">Cargo Value</p><p className="text-base font-bold text-gray-900">$31,720</p><p className="text-[9px] text-gray-400">Declared USD</p></div>
                  <div><p className="text-[9px] text-gray-400 uppercase">Import Duty</p><p className="text-base font-bold text-gray-900">$8,991</p><p className="text-[9px] text-gray-400">Incl. Section 301</p></div>
                </div>
                <div className="mt-3"><p className="text-[9px] text-gray-400 uppercase">Weight</p><p className="text-base font-bold text-gray-900">{D.totalWeight}</p><p className="text-[9px] text-gray-400">40HC</p></div>
              </div>

              {/* Shipment Route Map */}
              <div data-tour="live-map" className="border-t border-gray-200 pt-3">
                <p className="text-[9px] text-gray-400 uppercase font-semibold mb-2">Shipment Route Map</p>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden relative" style={{ height: '280px' }}>
                  {/* SVG Route Map with location points */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
                    <svg viewBox="0 0 600 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                      {/* Ocean background */}
                      <rect x="0" y="0" width="600" height="260" fill="#EFF6FF" />
                      {/* Simplified land masses */}
                      {/* Asia (left) */}
                      <path d="M 20 60 Q 50 40 80 55 Q 100 65 110 90 Q 115 110 105 130 Q 95 145 85 155 L 60 160 Q 40 150 30 130 Q 20 100 20 60 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5" />
                      {/* North America (right) */}
                      <path d="M 400 30 Q 440 25 480 35 Q 520 45 550 60 Q 575 80 580 110 Q 580 140 570 160 Q 555 180 530 195 Q 500 205 470 210 Q 440 200 420 180 Q 405 160 400 130 Q 395 100 398 70 Q 400 50 400 30 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5" />

                      {/* Route line - curved path across ocean */}
                      <path d="M 85 110 C 160 80 280 65 370 95 Q 420 110 460 130 L 500 145 L 520 155" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" />
                      {/* Drayage route on land */}
                      <path d="M 460 130 L 500 145 L 520 155" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />

                      {/* Animated ship indicator on route */}
                      <circle cx="370" cy="95" r="4" fill="#6366F1" opacity="0.3">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>

                      {/* Route Points */}
                      {/* Point 1: Haiphong, VN (Origin) */}
                      <circle cx="85" cy="110" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
                      <circle cx="85" cy="110" r="3" fill="white" />
                      {/* Label */}
                      <rect x="45" y="118" width="95" height="36" rx="3" fill="white" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.95" />
                      <text x="92" y="130" textAnchor="middle" fill="#1E40AF" fontWeight="600" fontSize="8">Haiphong, VN</text>
                      <text x="92" y="139" textAnchor="middle" fill="#6B7280" fontSize="6">Origin · Booked</text>
                      <text x="92" y="148" textAnchor="middle" fill="#9CA3AF" fontSize="5.5">2026-04-15 10:30</text>

                      {/* Point 2: Savannah, GA (POD) */}
                      <circle cx="460" cy="130" r="6" fill="#14B8A6" stroke="white" strokeWidth="2" />
                      <circle cx="460" cy="130" r="3" fill="white" />
                      {/* Label */}
                      <rect x="415" y="95" width="95" height="36" rx="3" fill="white" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.95" />
                      <text x="462" y="107" textAnchor="middle" fill="#0F766E" fontWeight="600" fontSize="8">Savannah, GA</text>
                      <text x="462" y="116" textAnchor="middle" fill="#6B7280" fontSize="6">Customs Released</text>
                      <text x="462" y="125" textAnchor="middle" fill="#9CA3AF" fontSize="5.5">2026-06-10 16:45</text>

                      {/* Point 3: Garden City Terminal */}
                      <circle cx="500" cy="145" r="5" fill="#8B5CF6" stroke="white" strokeWidth="2" />
                      <circle cx="500" cy="145" r="2.5" fill="white" />
                      {/* Label */}
                      <rect x="510" y="131" width="90" height="36" rx="3" fill="white" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.95" />
                      <text x="555" y="143" textAnchor="middle" fill="#6D28D9" fontWeight="600" fontSize="7.5">Garden City Terminal</text>
                      <text x="555" y="152" textAnchor="middle" fill="#6B7280" fontSize="6">Dispatched</text>
                      <text x="555" y="161" textAnchor="middle" fill="#9CA3AF" fontSize="5.5">2026-06-15 07:30</text>

                      {/* Point 4: UNIS Seabrook (Destination) */}
                      <circle cx="520" cy="155" r="6" fill="#22C55E" stroke="white" strokeWidth="2" />
                      <circle cx="520" cy="155" r="3" fill="white" />
                      {/* Label */}
                      <rect x="500" y="164" width="95" height="36" rx="3" fill="white" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.95" />
                      <text x="547" y="176" textAnchor="middle" fill="#166534" fontWeight="600" fontSize="7.5">UNIS Seabrook</text>
                      <text x="547" y="185" textAnchor="middle" fill="#6B7280" fontSize="6">Destination · Receiving</text>
                      <text x="547" y="194" textAnchor="middle" fill="#9CA3AF" fontSize="5.5">ETA 2026-06-21 09:00</text>

                      {/* Legend */}
                      <rect x="10" y="225" width="190" height="30" rx="4" fill="white" opacity="0.9" stroke="#E5E7EB" strokeWidth="0.5" />
                      <circle cx="22" cy="237" r="3" fill="#3B82F6" />
                      <text x="28" y="240" fill="#374151" fontSize="7">Origin</text>
                      <circle cx="65" cy="237" r="3" fill="#14B8A6" />
                      <text x="71" y="240" fill="#374151" fontSize="7">Customs</text>
                      <circle cx="115" cy="237" r="3" fill="#8B5CF6" />
                      <text x="121" y="240" fill="#374151" fontSize="7">Drayage</text>
                      <circle cx="165" cy="237" r="3" fill="#22C55E" />
                      <text x="171" y="240" fill="#374151" fontSize="7">Dest</text>

                      <circle cx="22" cy="248" r="2" fill="#6366F1" />
                      <text x="28" y="251" fill="#6B7280" fontSize="6">--- Sea Route</text>
                      <line x1="80" y1="248" x2="100" y2="248" stroke="#8B5CF6" strokeWidth="1.5" />
                      <text x="104" y="251" fill="#6B7280" fontSize="6">Land Route</text>
                    </svg>
                  </div>

                  {/* Expand to fullscreen button + zoom controls */}
                  <div className="absolute top-2 right-2 flex flex-col bg-white border border-gray-300 rounded shadow-sm">
                    <button
                      onClick={() => setMapFullscreen(true)}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-b border-gray-200"
                      title="View fullscreen"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-b border-gray-200 text-sm font-bold">+</button>
                    <button className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">&minus;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Draggable Splitter */}
          <div
            className="w-[6px] shrink-0 bg-gray-200 hover:bg-primary-300 active:bg-primary-400 cursor-col-resize flex items-center justify-center transition-colors relative group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 -left-1 -right-1" />
            <GripVertical size={12} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>

          {/* Right: Progress Bar + Business Milestone Timeline */}
          <div className="flex-1 min-w-0 overflow-y-auto p-5 bg-white">
            {/* Origin → Destination (left) + Phase Legend (right) */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <MapPin size={11} className="text-blue-500" />
                <span className="text-[9px] text-gray-400 uppercase">Origin:</span>
                <span className="font-semibold">{D.origin}</span>
                <ArrowRight size={12} className="text-gray-400 mx-1" />
                <MapPin size={11} className="text-green-500" />
                <span className="text-[9px] text-gray-400 uppercase">Destination:</span>
                <span className="font-semibold">{D.destination}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Phase:</span>
                {(['ocean', 'customs', 'drayage', 'warehouse'] as PhaseKey[]).map(k => (
                  <span key={k} className="flex items-center gap-1 text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${PHASE_COLORS[k].bg}`} />
                    <span className="text-gray-600">{k === 'ocean' ? 'Ocean' : k === 'customs' ? 'Customs' : k === 'drayage' ? 'Drayage' : 'Warehouse'}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div data-tour="progress-bar" className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700">Overall Progress</p>
                <p className="text-lg font-bold text-primary-600">{D.progress}%</p>
              </div>
              <div className="h-2.5 bg-white/80 rounded-full shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-green-500 rounded-full transition-all" style={{ width: `${D.progress}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-gray-400 uppercase">
                <span>Ocean</span><span>Customs</span><span>Drayage</span><span>Warehouse</span>
              </div>
            </div>

            {/* Business Milestone Timeline */}
            <div data-tour="milestone-timeline" className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Business Milestone Timeline</h3>

              {TIMELINE_PHASES.map((phase, pi) => {
                const colors = PHASE_COLORS[phase.phaseKey]
                const isLast = pi === TIMELINE_PHASES.length - 1

                return (
                  <div key={pi} className="relative">
                    {/* Phase header node */}
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4 relative z-10">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${phase.completed ? colors.bg : phase.active ? `${colors.bg}` : 'bg-gray-200'}`}>
                          {phase.completed ? <CheckCircle2 size={15} className="text-white" /> : phase.active ? <Truck size={15} className="text-white" /> : <Circle size={13} className="text-gray-400" />}
                        </div>
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900">{phase.phase}</span>
                          {phase.id && (phase.completed || phase.active) && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${colors.lightBg} ${colors.text}`}>{phase.id}</span>}
                          {(phase.completed || phase.active) && (
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${phase.completed ? 'bg-green-50 text-green-600 border-green-200' : `${colors.lightBg} ${colors.text} ${colors.border}`}`}>
                              {phase.completed ? 'Completed' : 'In Progress'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status nodes */}
                    <div className="ml-[18px] pl-[20px] border-l-2" style={{ borderColor: phase.completed ? (phase.phaseKey === 'ocean' ? '#93c5fd' : phase.phaseKey === 'customs' ? '#5eead4' : phase.phaseKey === 'drayage' ? '#c4b5fd' : '#86efac') : phase.active ? '#c4b5fd' : '#e5e7eb' }}>
                      {phase.statuses.map((node, ni) => (
                        <div key={ni} className="flex items-start py-2.5">
                          {/* Status dot */}
                          <div className="flex flex-col items-center mr-3 relative">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                              node.completed ? `${colors.dot} border-transparent` : node.active ? `${colors.dot} border-transparent` : 'bg-white border-gray-300'
                            }`}>
                              {node.active && <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: phase.phaseKey === 'ocean' ? '#60a5fa' : phase.phaseKey === 'customs' ? '#2dd4bf' : phase.phaseKey === 'drayage' ? '#a78bfa' : '#4ade80' }} />}
                            </div>
                          </div>
                          {/* Status content */}
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                                node.completed ? colors.badge : node.active ? colors.badge : 'bg-gray-50 text-gray-500 border-gray-200'
                              }`}>{node.status}</span>
                              {node.location && (
                                <span className="flex items-center gap-0.5 text-[10px] text-gray-400 truncate">
                                  <MapPin size={9} className="shrink-0" /><span className="truncate">{node.location}</span>
                                </span>
                              )}
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                              {(phase.completed || phase.active) && <><Clock size={9} />{node.date}</>}
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* Spacer between phases */}
                      {!isLast && <div className="h-3" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Content Tabs (directly after Overview) ═══ */}
      {activeTab === 'Containers(Drayage)' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b">{['Container No.', 'Size', 'Seal', 'Drayage Load No.', 'Status', 'Pickup Terminal', 'Dest. Warehouse', 'LFD', 'Delivery ETA', 'Delivered'].map(h => (<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead>
            <tbody>{D.containers.map((c, i) => (<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-mono">{c.containerNo}</td><td className="py-2.5 px-3">{c.size}</td><td className="py-2.5 px-3">{c.seal}</td><td className="py-2.5 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/international/drayage/${c.loadNo}`)}>{c.loadNo}</td><td className="py-2.5 px-3">{c.drayageStatus}</td><td className="py-2.5 px-3">{c.pickupTerminal}</td><td className="py-2.5 px-3">{c.destWarehouse}</td><td className="py-2.5 px-3">{c.lfd}</td><td className="py-2.5 px-3">{c.deliveryEta}</td><td className="py-2.5 px-3">{c.deliveredTime}</td></tr>))}</tbody>
          </table>
        </div>
      )}
      {activeTab === 'Items SKUs' && (
        <div className="space-y-5">
          {/* Items Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Items</h3>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b">{['Product Description', 'Product Identifier', 'Order Line No', 'Order Line Ref', 'Qty', 'Order Qty', 'Unit Value', 'Total Value'].map(h => (<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-3">Post Mount Locking Mailbox - Small White</td>
                  <td className="py-2.5 px-3 font-mono text-primary-600">ADPOST-SMALL-WHITE</td>
                  <td className="py-2.5 px-3">1</td>
                  <td className="py-2.5 px-3">PO-2026-001-L1</td>
                  <td className="py-2.5 px-3 font-medium">72</td>
                  <td className="py-2.5 px-3">72</td>
                  <td className="py-2.5 px-3">$45.00</td>
                  <td className="py-2.5 px-3 font-medium">$3,240.00</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-3">Post Mount Locking Mailbox - Small Red</td>
                  <td className="py-2.5 px-3 font-mono text-primary-600">ADPOST-SMALL-RED</td>
                  <td className="py-2.5 px-3">2</td>
                  <td className="py-2.5 px-3">PO-2026-001-L2</td>
                  <td className="py-2.5 px-3 font-medium">72</td>
                  <td className="py-2.5 px-3">72</td>
                  <td className="py-2.5 px-3">$45.00</td>
                  <td className="py-2.5 px-3 font-medium">$3,240.00</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-3">Post Mount Locking Mailbox - Large White</td>
                  <td className="py-2.5 px-3 font-mono text-primary-600">ADPOST-LARGE-WHITE</td>
                  <td className="py-2.5 px-3">3</td>
                  <td className="py-2.5 px-3">PO-2026-001-L3</td>
                  <td className="py-2.5 px-3 font-medium">96</td>
                  <td className="py-2.5 px-3">96</td>
                  <td className="py-2.5 px-3">$58.00</td>
                  <td className="py-2.5 px-3 font-medium">$5,568.00</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-3">Post Mount Locking Mailbox - Large Red</td>
                  <td className="py-2.5 px-3 font-mono text-primary-600">ADPOST-LARGE-RED</td>
                  <td className="py-2.5 px-3">4</td>
                  <td className="py-2.5 px-3">PO-2026-001-L4</td>
                  <td className="py-2.5 px-3 font-medium">96</td>
                  <td className="py-2.5 px-3">96</td>
                  <td className="py-2.5 px-3">$58.00</td>
                  <td className="py-2.5 px-3 font-medium">$5,568.00</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-3">Package Box - Small Corrugated</td>
                  <td className="py-2.5 px-3 font-mono text-primary-600">ADBOX-SMALL</td>
                  <td className="py-2.5 px-3">5</td>
                  <td className="py-2.5 px-3">PO-2026-001-L5</td>
                  <td className="py-2.5 px-3 font-medium">55</td>
                  <td className="py-2.5 px-3">55</td>
                  <td className="py-2.5 px-3">$12.00</td>
                  <td className="py-2.5 px-3 font-medium">$660.00</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-3">Package Box - Large Corrugated</td>
                  <td className="py-2.5 px-3 font-mono text-primary-600">ADBOX-LARGE</td>
                  <td className="py-2.5 px-3">6</td>
                  <td className="py-2.5 px-3">PO-2026-001-L6</td>
                  <td className="py-2.5 px-3 font-medium">55</td>
                  <td className="py-2.5 px-3">55</td>
                  <td className="py-2.5 px-3">$15.00</td>
                  <td className="py-2.5 px-3 font-medium">$825.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SKUs Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">SKUs</h3>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b">{['SKU', 'Product Name', 'Variant', 'Expected', 'Received', 'Diff', 'Damaged', 'Unit', 'Status'].map(h => (<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead>
              <tbody>{D.items.map((item, i) => (<tr key={i} className="border-b border-gray-100"><td className="py-2.5 px-3 font-mono text-primary-600">{item.sku}</td><td className="py-2.5 px-3">{item.name}</td><td className="py-2.5 px-3">{item.variant}</td><td className="py-2.5 px-3 font-medium">{item.expected}</td><td className="py-2.5 px-3 text-green-600 font-medium">{item.received}</td><td className="py-2.5 px-3 text-orange-600">{item.diff}</td><td className="py-2.5 px-3 text-red-600">{item.damaged}</td><td className="py-2.5 px-3">{item.unit}</td><td className="py-2.5 px-3"><span className="text-green-600 font-medium">{item.status}</span></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'Customs Clearance' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5">
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[['Customs Status', 'Released'], ['Entry No.', '82G-0101679-0'], ['Port of Entry', 'Savannah, GA'], ['Customs Broker', 'JFS (Jones Fulfillment Services)'], ['Hold Reason', 'None'], ['Duty Amount', '$8,991.00'], ['HTS Code', '8518.40.20']].map(([l, v]) => (<div key={l}><p className="text-[10px] text-gray-400 uppercase">{l}</p><p className="font-medium text-gray-900">{v}</p></div>))}
          </div>
        </div>
      )}
      {activeTab === 'Drayage Load' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b">{['Load #', 'Container', 'Status', 'Pick Up Terminal', 'Delivery Warehouse', 'Driver', 'Pickup Date', 'Delivery ETA', 'Delivered Date'].map(h => (<th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>))}</tr></thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3 text-primary-600 font-medium cursor-pointer hover:underline" onClick={() => navigate('/international/drayage/UNIS_SAV_M012771')}>UNIS_SAV_M012771</td>
                <td className="py-2.5 px-3 font-mono">WHSU8555505</td>
                <td className="py-2.5 px-3"><span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Dispatched</span></td>
                <td className="py-2.5 px-3">Garden City Terminal</td>
                <td className="py-2.5 px-3">UNIS Seabrook</td>
                <td className="py-2.5 px-3">Mike Johnson</td>
                <td className="py-2.5 px-3">Jun 15, 2026</td>
                <td className="py-2.5 px-3">Jun 19, 2026</td>
                <td className="py-2.5 px-3 text-gray-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Doc preview modal */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-8" onClick={() => setViewDoc(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold">{viewDoc}</h3>
              <button onClick={() => setViewDoc(null)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
            </div>
            <div className="p-6">
              <div className="border rounded-lg bg-gray-50 h-48 flex items-center justify-center text-gray-400 text-sm">Document preview</div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Map Modal */}
      {mapFullscreen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setMapFullscreen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
              <h3 className="text-sm font-semibold text-gray-900">Shipment Route Map</h3>
              <button onClick={() => setMapFullscreen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium">Close</button>
            </div>
            <div className="w-full bg-gradient-to-br from-blue-50 to-cyan-50" style={{ height: 'calc(100% - 48px)' }}>
              <svg viewBox="0 0 900 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Ocean background */}
                <rect x="0" y="0" width="900" height="400" fill="#EFF6FF" />
                {/* Asia */}
                <path d="M 30 80 Q 70 50 120 75 Q 160 90 170 130 Q 175 165 160 195 Q 140 220 120 235 L 80 240 Q 50 225 35 195 Q 25 150 30 80 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
                {/* North America */}
                <path d="M 580 40 Q 640 30 720 50 Q 780 70 830 95 Q 870 120 875 165 Q 875 210 855 245 Q 830 275 790 300 Q 740 320 690 325 Q 640 315 600 285 Q 575 255 570 210 Q 565 160 568 110 Q 572 70 580 40 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />

                {/* Sea route */}
                <path d="M 130 155 C 250 110 420 90 560 140 Q 630 165 690 195 L 750 220 L 780 235" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.7" />
                {/* Land route */}
                <path d="M 690 195 L 750 220 L 780 235" fill="none" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.8" />

                {/* Ship animation */}
                <circle cx="420" cy="105" r="6" fill="#6366F1" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="420" y="95" textAnchor="middle" fill="#4F46E5" fontSize="14">🚢</text>

                {/* Point 1: Haiphong, VN */}
                <circle cx="130" cy="155" r="9" fill="#3B82F6" stroke="white" strokeWidth="3" />
                <circle cx="130" cy="155" r="4" fill="white" />
                <rect x="70" y="170" width="125" height="50" rx="4" fill="white" stroke="#BFDBFE" strokeWidth="1" />
                <text x="132" y="186" textAnchor="middle" fill="#1E40AF" fontWeight="700" fontSize="11">Haiphong, VN</text>
                <text x="132" y="200" textAnchor="middle" fill="#6B7280" fontSize="9">Origin · Booked</text>
                <text x="132" y="213" textAnchor="middle" fill="#9CA3AF" fontSize="8">2026-04-15 10:30</text>

                {/* Point 2: Savannah, GA */}
                <circle cx="690" cy="195" r="9" fill="#14B8A6" stroke="white" strokeWidth="3" />
                <circle cx="690" cy="195" r="4" fill="white" />
                <rect x="625" y="140" width="135" height="50" rx="4" fill="white" stroke="#99F6E4" strokeWidth="1" />
                <text x="692" y="156" textAnchor="middle" fill="#0F766E" fontWeight="700" fontSize="11">Savannah, GA</text>
                <text x="692" y="170" textAnchor="middle" fill="#6B7280" fontSize="9">Customs Released</text>
                <text x="692" y="183" textAnchor="middle" fill="#9CA3AF" fontSize="8">2026-06-10 16:45</text>

                {/* Point 3: Garden City Terminal */}
                <circle cx="750" cy="220" r="8" fill="#8B5CF6" stroke="white" strokeWidth="3" />
                <circle cx="750" cy="220" r="3.5" fill="white" />
                <rect x="767" y="200" width="130" height="50" rx="4" fill="white" stroke="#DDD6FE" strokeWidth="1" />
                <text x="832" y="216" textAnchor="middle" fill="#6D28D9" fontWeight="700" fontSize="10">Garden City Terminal</text>
                <text x="832" y="230" textAnchor="middle" fill="#6B7280" fontSize="9">Dispatched</text>
                <text x="832" y="243" textAnchor="middle" fill="#9CA3AF" fontSize="8">2026-06-15 07:30</text>

                {/* Point 4: UNIS Seabrook */}
                <circle cx="780" cy="235" r="9" fill="#22C55E" stroke="white" strokeWidth="3" />
                <circle cx="780" cy="235" r="4" fill="white" />
                <rect x="720" y="250" width="130" height="50" rx="4" fill="white" stroke="#BBF7D0" strokeWidth="1" />
                <text x="785" y="266" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="10">UNIS Seabrook</text>
                <text x="785" y="280" textAnchor="middle" fill="#6B7280" fontSize="9">Destination · Receiving</text>
                <text x="785" y="293" textAnchor="middle" fill="#9CA3AF" fontSize="8">ETA 2026-06-21 09:00</text>

                {/* Legend */}
                <rect x="15" y="350" width="280" height="40" rx="5" fill="white" opacity="0.95" stroke="#E5E7EB" strokeWidth="0.8" />
                <circle cx="30" cy="367" r="4" fill="#3B82F6" />
                <text x="38" y="370" fill="#374151" fontSize="10">Origin</text>
                <circle cx="90" cy="367" r="4" fill="#14B8A6" />
                <text x="98" y="370" fill="#374151" fontSize="10">Customs/POD</text>
                <circle cx="175" cy="367" r="4" fill="#8B5CF6" />
                <text x="183" y="370" fill="#374151" fontSize="10">Drayage</text>
                <circle cx="240" cy="367" r="4" fill="#22C55E" />
                <text x="248" y="370" fill="#374151" fontSize="10">Destination</text>
                <line x1="30" y1="382" x2="55" y2="382" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 2" />
                <text x="60" y="385" fill="#6B7280" fontSize="9">Sea Route</text>
                <line x1="120" y1="382" x2="145" y2="382" stroke="#8B5CF6" strokeWidth="2" />
                <text x="150" y="385" fill="#6B7280" fontSize="9">Land Route</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Detail Page Guided Tour */}
      {showDetailTour && (
        <GuidedTour steps={DETAIL_OVERVIEW_STEPS} onComplete={handleDetailTourComplete} />
      )}
    </div>
  )
}
