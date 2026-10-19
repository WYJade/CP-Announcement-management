// ─── Shared types, constants, and mock data for Yard Entry Monitor ───────────

export type EntryStatus =
  | 'Pre Entry'
  | 'Gate Checked In'
  | 'Waiting'
  | 'Need Window Check-In'
  | 'Window Checked In'
  | 'Dock Checked In'
  | 'Dock Checked Out'
  | 'Gate Checked Out'
  | 'Rejected'
  | 'Dropping Off Delivery'
  | 'Dropping Off Empty'
  | 'Picking Up Preload'
  | 'Picking Up Empty'

export type EntryType = 'Inbound' | 'Outbound' | 'Drop Off Empty' | 'Drop Off Delivery' | 'Pick Up'
export type AnomalyType = 'mismatch' | 'no-location' | null

export interface Photo {
  id: string
  label: string
  url: string
  type: 'driver' | 'vehicle' | 'camera'
}

export interface EntryRecord {
  id: string
  entryId: string
  status: EntryStatus
  dock: string
  facility: string
  customer: string
  driverName: string
  driverPhone: string
  driverLicense: string
  tractorCarrier: string
  equipType: string
  tractor: string
  trailer: string
  container: string
  seal: string
  freightCarrier: string
  entryType: EntryType
  direction: string
  location: string
  loadTask: string
  loadId: string
  loadNo: string
  receiptId: string
  hasAppointment: boolean
  windowCheckIn: string
  dockCheckIn: string
  dockCheckOut: string
  gateCheckIn: string
  gateCheckOut: string
  anomaly: AnomalyType
  anomalyDetail?: string
  mismatch?: {
    byCarrier: { name: string; phone: string; license: string; carrier: string; mcdot: string }
    byGate:    { name: string; phone: string; license: string; carrier: string; mcdot: string }
  }
  photos: Photo[]
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const ALL_STATUSES: EntryStatus[] = [
  'Pre Entry', 'Gate Checked In', 'Waiting', 'Need Window Check-In',
  'Window Checked In', 'Dock Checked In', 'Dock Checked Out', 'Gate Checked Out',
  'Rejected', 'Dropping Off Delivery', 'Dropping Off Empty',
  'Picking Up Preload', 'Picking Up Empty',
]

export const CUSTOMERS  = ['All Customers', 'ADOORN LLC', 'THE ONLY BEAN LLC', 'VITA COCO', 'ORGAIN LLC', 'SAMUN INC']
export const FACILITIES = ['All Facilities', 'Ontario, CA', 'Fontana, CA', 'Garden City, NY', 'Savannah, GA', 'Chicago, IL']
export const ENTRY_TYPES: EntryType[] = ['Inbound', 'Outbound', 'Drop Off Empty', 'Drop Off Delivery', 'Pick Up']

// ─── Placeholder photo URLs ───────────────────────────────────────────────────
export const PLACEHOLDER_DARK  = 'https://placehold.co/320x200/1a1a2e/555?text=Driver'
export const PLACEHOLDER_VEH   = 'https://placehold.co/320x200/1a1a2e/555?text=Vehicle'
export const PLACEHOLDER_EQUIP = 'https://placehold.co/320x200/1a1a2e/555?text=Equipment'
export const PLACEHOLDER_CAM   = 'https://placehold.co/640x360/0d1117/6e40c9?text=Camera+Feed'

function makePh(label: string, type: Photo['type'] = 'driver'): Photo {
  const url = type === 'camera' ? PLACEHOLDER_CAM
    : type === 'vehicle' ? PLACEHOLDER_VEH
    : PLACEHOLDER_DARK
  return { id: `${label}-${Math.random()}`, label, url, type }
}

// ─── Mock data ────────────────────────────────────────────────────────────────
export const MOCK_ENTRIES: EntryRecord[] = [
  {
    id:'e1', entryId:'ET-822803', status:'Window Checked In', dock:'DOCK33456',
    facility:'Ontario, CA', customer:'ADOORN LLC',
    driverName:'Jason Miller', driverPhone:'(+1)9093451872', driverLicense:'CA-M293847', tractorCarrier:'SWIFT TRANSPORT',
    equipType:'TRAILER', tractor:'T-10923', trailer:'4645', container:'CNTR-9901', seal:'SL-88421', freightCarrier:'SWIFT TRANSPORT',
    entryType:'Outbound', direction:'Outbound', location:'DOCK33456', loadTask:'TASK-35688(jfeng)',
    loadId:'LD-20230', loadNo:'LN-5521', receiptId:'RCP-10040',
    hasAppointment:true, windowCheckIn:'2026-09-08 10:18', dockCheckIn:'2026-09-08 10:35', dockCheckOut:'', gateCheckIn:'2026-09-08 10:04', gateCheckOut:'', anomaly:null,
    photos:[makePh('Driver'), makePh('Vehicle','vehicle'), makePh('Equipment','vehicle'), makePh('Camera In','camera')],
  },
  {
    id:'e2', entryId:'ET-822802', status:'Dock Checked Out', dock:'DOCK711',
    facility:'Ontario, CA', customer:'ADOORN LLC',
    driverName:'api fox', driverPhone:'(+1)2013694258', driverLicense:'DL83R4J484', tractorCarrier:'TTS',
    equipType:'TRAILER', tractor:'LPR443', trailer:'FJWONIX', container:'CNTR-7701', seal:'SL-00312', freightCarrier:'UPS',
    entryType:'Outbound', direction:'Outbound', location:'DOCK711', loadTask:'TASK-837829(SMITH JOHN)',
    loadId:'LD-20198', loadNo:'LN-5498', receiptId:'RCP-10045',
    hasAppointment:true, windowCheckIn:'2026-09-08 03:22', dockCheckIn:'2026-09-08 03:40', dockCheckOut:'2026-09-08 05:12', gateCheckIn:'2026-09-08 03:14', gateCheckOut:'', anomaly:null,
    photos:[makePh('Driver'), makePh('Driver 2'), makePh('Vehicle','vehicle'), makePh('Vehicle 2','vehicle'), makePh('Equipment','vehicle'), makePh('Equipment 2','vehicle'), makePh('Camera In','camera'), makePh('Camera Out','camera')],
  },
  {
    id:'e3', entryId:'ET-822795', status:'Dropping Off Empty', dock:'YARD162',
    facility:'Fontana, CA', customer:'THE ONLY BEAN LLC',
    driverName:'ESTHER CHEN', driverPhone:'(+1)2542492894', driverLicense:'CA-12345568', tractorCarrier:'J B HUNT TRANSPORT INC',
    equipType:'TRAILER', tractor:'T-33881', trailer:'8222733', container:'CNTR-5512', seal:'SL-44901', freightCarrier:'J B HUNT TRANSPORT INC',
    entryType:'Drop Off Empty', direction:'Drop Off Empty', location:'YARD-B12',
    loadTask:'TASK-35601(echen)', loadId:'LD-20187', loadNo:'LN-5490', receiptId:'RCP-10031',
    hasAppointment:true, windowCheckIn:'', dockCheckIn:'', dockCheckOut:'', gateCheckIn:'2026-09-08 02:41', gateCheckOut:'',
    anomaly:'no-location', anomalyDetail:'Driver has not filled in the actual parking location.',
    photos:[makePh('Driver'), makePh('Driver 2'), makePh('Camera In','camera'), makePh('Camera In 2','camera'), makePh('Camera In 3','camera'), makePh('Camera In 4','camera'), makePh('Camera In 5','camera'), makePh('Camera In 6','camera'), makePh('Camera In 7','camera'), makePh('Camera In 8','camera')],
  },
  {
    id:'e4', entryId:'ET-822711', status:'Gate Checked Out', dock:'DOCK442',
    facility:'Garden City, NY', customer:'VITA COCO',
    driverName:'test yuto', driverPhone:'(+1)9988880888', driverLicense:'NY-43e534626', tractorCarrier:'AMC TRANSPORT SERVICES LLC',
    equipType:'TRAILER', tractor:'T-66120', trailer:'PGNN', container:'CNTR-4402', seal:'SL-77654', freightCarrier:'FEDEX FREIGHT INC',
    entryType:'Outbound', direction:'Outbound', location:'DOCK442', loadTask:'TASK-34991(jsmith)',
    loadId:'LD-19854', loadNo:'LN-5200', receiptId:'RCP-09988',
    hasAppointment:false, windowCheckIn:'2026-09-02 00:45', dockCheckIn:'2026-09-02 01:00', dockCheckOut:'2026-09-02 01:48', gateCheckIn:'2026-09-02 00:32', gateCheckOut:'2026-09-02 01:55',
    anomaly:'mismatch', anomalyDetail:'Driver info entered by carrier does not match gate check-in record.',
    mismatch:{
      byCarrier:{ name:'324234', phone:'(+1)2701661989', license:'46534354', carrier:'FEDEX FREIGHT INC', mcdot:'229039' },
      byGate:   { name:'test yuto', phone:'(+1)9988880888', license:'43e534626', carrier:'AMC TRANSPORT SERVICES LLC', mcdot:'' },
    },
    photos:[makePh('Driver'), makePh('Vehicle','vehicle'), makePh('Equipment','vehicle'), makePh('Equipment 2','vehicle'), makePh('Equipment 3','vehicle'), makePh('Other')],
  },
  {
    id:'e5', entryId:'ET-822710', status:'Window Checked In', dock:'DOCK8976',
    facility:'Fontana, CA', customer:'ORGAIN LLC',
    driverName:'Kevin Torres', driverPhone:'(+1)9095552341', driverLicense:'CA-K887712', tractorCarrier:'WERNER ENTERPRISES',
    equipType:'TRAILER', tractor:'T-20541', trailer:'PGNN', container:'CNTR-3308', seal:'SL-33209', freightCarrier:'WERNER ENTERPRISES',
    entryType:'Outbound', direction:'Outbound', location:'DOCK8976', loadTask:'TASK-36384(jfeng)',
    loadId:'LD-20175', loadNo:'LN-5481', receiptId:'RCP-10038',
    hasAppointment:true, windowCheckIn:'2026-09-02 00:50', dockCheckIn:'2026-09-02 01:05', dockCheckOut:'', gateCheckIn:'2026-09-02 00:32', gateCheckOut:'', anomaly:null,
    photos:[makePh('Camera In','camera'), makePh('Camera In 2','camera')],
  },
  {
    id:'e6', entryId:'ET-822804', status:'Need Window Check-In', dock:'DOCK115',
    facility:'Chicago, IL', customer:'SAMUN INC',
    driverName:'Maria Gonzalez', driverPhone:'(+1)3125559988', driverLicense:'IL-M334421', tractorCarrier:'COYOTE LOGISTICS',
    equipType:'TRAILER', tractor:'T-77403', trailer:'TRL-2290', container:'CNTR-6614', seal:'SL-55820', freightCarrier:'COYOTE LOGISTICS',
    entryType:'Inbound', direction:'Inbound', location:'', loadTask:'TASK-36401(mgonzalez)',
    loadId:'LD-20231', loadNo:'LN-5522', receiptId:'RCP-10048',
    hasAppointment:false, windowCheckIn:'', dockCheckIn:'', dockCheckOut:'', gateCheckIn:'2026-09-08 10:04', gateCheckOut:'', anomaly:null,
    photos:[makePh('Driver'), makePh('Vehicle','vehicle'), makePh('Camera In','camera')],
  },
]

// ─── Status style map ─────────────────────────────────────────────────────────
export const STATUS_STYLE: Record<EntryStatus, { bg: string; text: string; dot: string }> = {
  'Pre Entry':             { bg:'bg-gray-100',    text:'text-gray-600',   dot:'bg-gray-400' },
  'Gate Checked In':       { bg:'bg-blue-50',     text:'text-blue-700',   dot:'bg-blue-500' },
  'Waiting':               { bg:'bg-yellow-50',   text:'text-yellow-700', dot:'bg-yellow-500' },
  'Need Window Check-In':  { bg:'bg-orange-50',   text:'text-orange-700', dot:'bg-orange-500' },
  'Window Checked In':     { bg:'bg-emerald-50',  text:'text-emerald-700',dot:'bg-emerald-500' },
  'Dock Checked In':       { bg:'bg-teal-50',     text:'text-teal-700',   dot:'bg-teal-500' },
  'Dock Checked Out':      { bg:'bg-violet-50',   text:'text-violet-700', dot:'bg-violet-500' },
  'Gate Checked Out':      { bg:'bg-gray-100',    text:'text-gray-600',   dot:'bg-gray-400' },
  'Rejected':              { bg:'bg-red-50',      text:'text-red-700',    dot:'bg-red-500' },
  'Dropping Off Delivery': { bg:'bg-cyan-50',     text:'text-cyan-700',   dot:'bg-cyan-500' },
  'Dropping Off Empty':    { bg:'bg-amber-50',    text:'text-amber-700',  dot:'bg-amber-500' },
  'Picking Up Preload':    { bg:'bg-indigo-50',   text:'text-indigo-700', dot:'bg-indigo-500' },
  'Picking Up Empty':      { bg:'bg-purple-50',   text:'text-purple-700', dot:'bg-purple-500' },
}
