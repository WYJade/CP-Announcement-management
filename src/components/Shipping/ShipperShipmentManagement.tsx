import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Filter, Download, X, Plus, ChevronDown, ArrowLeft,
  MapPin, AlertCircle, ChevronLeft, ChevronRight as ChevronRightIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Shipment {
  id: string; scheduled: boolean; puNo: string; proNo: string; po: string[]
  reference: string; service: string; origin: string; requestedDate: string
  readyDate: string; readyTime: string; closeTime: string; destination: string
  deliveryDate: string; pallets: number; weight: string; status: string
}
interface FilterRule { id: string; field: string; op: string; value: string }
interface VisibleCols { [key: string]: boolean }

// ─── Sample data ──────────────────────────────────────────────────────────────
const SHIPMENTS: Shipment[] = [
  { id:'s1',scheduled:true,puNo:'7696597',proNo:'PRO#100378',po:[''],reference:'',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'04/05/2026',readyDate:'04/04/2026',readyTime:'00:00',closeTime:'12:00',destination:'LAX DISTRIBUTION FACILITIES, CARSON, CA',deliveryDate:'',pallets:1,weight:'20.00 lbs',status:'Scheduled' },
  { id:'s2',scheduled:false,puNo:'7696594',proNo:'PRO#100377',po:['07021111','07222222'],reference:'',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'04/07/2026',readyDate:'',readyTime:'00:00',closeTime:'00:35',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:0,weight:'–',status:'New' },
  { id:'s3',scheduled:false,puNo:'7695664',proNo:'PRO#100376',po:['07021111','07222222'],reference:'',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'04/05/2026',readyDate:'',readyTime:'02:00',closeTime:'08:00',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:0,weight:'–',status:'New' },
  { id:'s4',scheduled:true,puNo:'7604101',proNo:'PRO#1000002921',po:['21699252222','21699253333'],reference:'test 1222',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'11/26/2025',readyDate:'11/26/2025',readyTime:'00:00',closeTime:'01:33',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:1,weight:'20.00 lbs',status:'Pickup Created' },
  { id:'s5',scheduled:false,puNo:'7604093',proNo:'PRO#16938729715',po:['21699252222','21699253333'],reference:'shipper notes [Refill 2]',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'03/18/2026',readyDate:'',readyTime:'00:00',closeTime:'',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:0,weight:'–',status:'New' },
  { id:'s6',scheduled:false,puNo:'7404402',proNo:'PRO#1000013401',po:['21699252222','21699253333'],reference:'',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'11/21/2025',readyDate:'',readyTime:'00:00',closeTime:'',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:0,weight:'–',status:'New' },
  { id:'s7',scheduled:false,puNo:'7404401',proNo:'PRO#1000013429',po:['21699252222','21699253333'],reference:'',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'11/21/2025',readyDate:'',readyTime:'00:00',closeTime:'',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:0,weight:'–',status:'New' },
  { id:'s8',scheduled:false,puNo:'7404480',proNo:'PRO#1000014028',po:['21699252222','21699253333'],reference:'',service:'LTL',origin:'MEIJER INC C/O INTE LUCENT AUDIT, GRAND RAPIDS MI',requestedDate:'11/21/2025',readyDate:'',readyTime:'00:00',closeTime:'',destination:'EVELYN-CONSIGNEE, CHINO HILLS, CA',deliveryDate:'',pallets:0,weight:'–',status:'New' },
]

const ALL_COLUMNS = [
  {key:'scheduled',label:'Scheduled'},{key:'puNo',label:'PU#'},{key:'proNo',label:'PRO#'},
  {key:'po',label:'PO'},{key:'reference',label:'Reference'},{key:'service',label:'Service'},
  {key:'origin',label:'Origin'},{key:'requestedDate',label:'Requested date'},
  {key:'readyDate',label:'Ready date'},{key:'readyTime',label:'Ready Time'},
  {key:'closeTime',label:'Close Time'},{key:'destination',label:'Destination'},
  {key:'deliveryDate',label:'Delivery date'},
]

const FILTER_FIELDS = ['Pickup Date','Status','Scheduled','Service','Origin','Destination','Ready Date','Close Time']
const FILTER_OPS = ['equal','not equal','contains','not contains','is empty','is not empty','greater than','less than']

// ─── Date‑picker helpers ──────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa']

function DatePicker({ value, onChange }: { value: string; onChange:(v:string)=>void }) {
  const today = new Date(); today.setHours(0,0,0,0)
  const maxDate = new Date(today); maxDate.setDate(today.getDate()+30)

  const [calOpen, setCalOpen] = useState(false)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const prevMonth = () => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1)}else setViewMonth(m=>m-1) }
  const nextMonth = () => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1)}else setViewMonth(m=>m+1) }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate()
  const cells: (number|null)[] = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)]

  const isDisabled = (day:number) => {
    const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0)
    return d < today || d > maxDate
  }

  const isSelected = (day:number) => {
    if (!value) return false
    const parts = value.split('-')
    return parseInt(parts[0])===viewYear && parseInt(parts[1])-1===viewMonth && parseInt(parts[2])===day
  }

  const select = (day:number) => {
    if (isDisabled(day)) return
    const m = String(viewMonth+1).padStart(2,'0')
    const d = String(day).padStart(2,'0')
    onChange(`${viewYear}-${m}-${d}`)
    setCalOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-primary-400 focus-within:border-primary-500 bg-white"
        onClick={()=>setCalOpen(v=>!v)}>
        <span className="text-gray-400 mr-2 text-xs">📅</span>
        <span className={`text-sm flex-1 ${value?'text-gray-800':'text-gray-400'}`}>{value||'Ready date'}</span>
      </div>
      {calOpen&&(
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-[200] w-64 p-3">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={14}/></button>
            <span className="text-sm font-semibold text-gray-800">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100"><ChevronRightIcon size={14}/></button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map(d=><div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>)}
          </div>
          {/* Cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day,i)=>(
              <div key={i} className={`text-center py-1.5 text-xs rounded-md select-none ${
                day===null?'':
                isDisabled(day)?'text-gray-300 cursor-not-allowed':
                isSelected(day)?'bg-primary-600 text-white font-semibold cursor-pointer':
                'text-gray-700 hover:bg-primary-50 cursor-pointer'
              }`}
                onClick={()=>day&&!isDisabled(day)&&select(day)}>
                {day||''}
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 mt-2 text-center">Can only select dates within 30 days from today</p>
        </div>
      )}
    </div>
  )
}

// ─── Edit Order Modal ─────────────────────────────────────────────────────────
function EditOrderModal({ shipment, onClose, onSave }: {
  shipment: Shipment; onClose:()=>void; onSave:(id:string, readyDate:string, readyTime:string, closeTime:string, notes:string, noteReason:string)=>void
}) {
  const [readyDate, setReadyDate] = useState(shipment.readyDate||'')
  const [readyTime, setReadyTime] = useState(shipment.readyTime||'00:00')
  const [closeTime, setCloseTime] = useState(shipment.closeTime||'')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState(shipment.reference||'')
  const [noteReason, setNoteReason] = useState('')

  const poData = shipment.po.filter(p=>p).map((p,i)=>({ no:i+1, po:p, pallets:'', stackable:'No', weight:'573.00' }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mb-10" onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-900">Edit</h3>
          <button onClick={onClose}><X size={15} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Pickup Times */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-3">Pickup Times <span className="text-red-500">*</span></p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Ready date <span className="text-red-500">*</span></label>
                <DatePicker value={readyDate} onChange={setReadyDate} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Ready Time <span className="text-red-500">*</span></label>
                <select value={readyTime} onChange={e=>setReadyTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
                  {['00:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Close Time <span className="text-red-500">*</span></label>
                <select value={closeTime} onChange={e=>setCloseTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
                  <option value="">Close Time</option>
                  {['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Reason</label>
            <select value={reason} onChange={e=>setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
              <option value="">Please select a reason</option>
              <option>Product Not Ready</option>
              <option>Warehouse Delay</option>
              <option>Transportation Issue</option>
              <option>Other</option>
            </select>
            <p className="text-[10px] text-primary-600 mt-1.5">
              Please contact <a href="mailto:grocery.logistics@meyer.com" className="underline">grocery.logistics@meyer.com</a> for further clarification on why this shipment is being delayed.
            </p>
          </div>

          {/* PO Information */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-3">PO Information</p>
            <table className="w-full text-xs border border-gray-100 rounded-lg overflow-hidden">
              <thead><tr className="bg-gray-50">
                {['PO','Pallets','Stackable','Weight'].map(h=><th key={h} className="text-left py-2 px-3 font-medium text-gray-500">{h}</th>)}
              </tr></thead>
              <tbody>
                {(poData.length?poData:[{no:1,po:shipment.po[0]||'',pallets:'',stackable:'No',weight:'573.00'},{no:2,po:shipment.po[1]||'',pallets:'',stackable:'No',weight:'573.00'}]).map(row=>(
                  <tr key={row.no} className="border-t border-gray-100">
                    <td className="py-2 px-3"><input defaultValue={row.po} className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"/></td>
                    <td className="py-2 px-3"><input defaultValue={row.pallets} className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"/></td>
                    <td className="py-2 px-3">
                      <select defaultValue={row.stackable} className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none">
                        <option>No</option><option>Yes</option>
                      </select>
                    </td>
                    <td className="py-2 px-3"><input defaultValue={row.weight} className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PU Reference & Notes */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">PU Reference# &amp; Notes</label>
            <input value={notes} onChange={e=>setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" placeholder="shipper notes" />
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Note</p>
            <label className="text-xs text-gray-500 block mb-1">Reason</label>
            <select value={noteReason} onChange={e=>setNoteReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
              <option value="">Please enter reason</option>
              <option>Delay notification</option>
              <option>Special handling required</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={()=>onSave(shipment.id, readyDate, readyTime, closeTime, notes, noteReason)}
            className="px-5 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">Save</button>
        </div>
      </div>
    </div>
  )
}

// ─── Customize Fields Modal ────────────────────────────────────────────────────
function CustomizeModal({ visible, onToggle, onClose, onConfirm }: {
  visible: VisibleCols; onToggle: (k:string)=>void; onClose:()=>void; onConfirm:()=>void
}) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-80 max-h-[70vh] flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-800">Customize Fields</h3>
          <button onClick={onClose}><X size={15} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
          {ALL_COLUMNS.map(col => (
            <div key={col.key} className="flex items-center justify-between py-2.5 border-b border-gray-50">
              <span className="text-sm text-gray-700">{col.label}</span>
              <button onClick={()=>onToggle(col.key)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${visible[col.key]!==false?'bg-primary-500':'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${visible[col.key]!==false?'translate-x-5':'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={()=>{ALL_COLUMNS.forEach(c=>onToggle && true)}} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
          <button onClick={onConfirm} className="px-4 py-2 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700">Confirm</button>
        </div>
      </div>
    </div>
  )
}

// ─── Filter Table Modal ────────────────────────────────────────────────────────
function FilterModal({ onClose, onApply }: { onClose:()=>void; onApply:(rules:FilterRule[])=>void }) {
  const [rules, setRules] = useState<FilterRule[]>([{ id:'r1', field:'Pickup Date', op:'equal', value:'' }])
  const addRule = () => setRules(prev=>[...prev,{id:`r${Date.now()}`,field:'Status',op:'equal',value:''}])
  const removeRule = (id:string) => setRules(prev=>prev.filter(r=>r.id!==id))
  const updateRule = (id:string, patch: Partial<FilterRule>) => setRules(prev=>prev.map(r=>r.id===id?{...r,...patch}:r))

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[520px]" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-800">Filter table</h3>
          <button onClick={onClose}><X size={15} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {rules.map((rule,i) => (
            <div key={rule.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-20 shrink-0">Condition {i+1}</span>
              <select value={rule.field} onChange={e=>updateRule(rule.id,{field:e.target.value})}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-primary-400">
                {FILTER_FIELDS.map(f=><option key={f}>{f}</option>)}
              </select>
              <select value={rule.op} onChange={e=>updateRule(rule.id,{op:e.target.value})}
                className="w-28 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-primary-400">
                {FILTER_OPS.map(o=><option key={o}>{o}</option>)}
              </select>
              <input value={rule.value} onChange={e=>updateRule(rule.id,{value:e.target.value})}
                placeholder="YYYY-MM-DD" className="w-32 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-primary-400" />
              {rules.length>1&&<button onClick={()=>removeRule(rule.id)} className="text-red-400 hover:text-red-600"><X size={13}/></button>}
            </div>
          ))}
          <button onClick={addRule} className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium mt-2">
            <Plus size={12}/> Add new rule
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
          <button onClick={()=>setRules([{id:'r1',field:'Pickup Date',op:'equal',value:''}])} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
          <button onClick={()=>{onApply(rules);onClose()}} className="px-4 py-2 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700">Search</button>
        </div>
      </div>
    </div>
  )
}

// ─── Report Issue Modal ────────────────────────────────────────────────────────
function ReportIssueModal({ shipment, onClose }: { shipment: Shipment; onClose:()=>void }) {
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-96" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-800">Report Issue</h3>
          <button onClick={onClose}><X size={15} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        {!submitted?(
          <div className="px-5 py-4 space-y-3">
            <div><p className="text-xs text-gray-500 mb-1">TMS PRO#</p><p className="text-sm font-medium text-gray-800">{shipment.proNo}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">PO Numbers</p><p className="text-sm text-gray-700">{shipment.po.join(', ')}</p></div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Issue/Note <span className="text-red-500">*</span></label>
              <textarea value={note} onChange={e=>setNote(e.target.value)} rows={4} maxLength={2000}
                placeholder="Please describe the issue you're experiencing..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary-400" />
              <p className="text-[10px] text-gray-400 text-right">{note.length}/2000</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className="flex-1 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={()=>note.trim()&&setSubmitted(true)} disabled={!note.trim()}
                className="flex-1 py-2 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400">Save</button>
            </div>
          </div>
        ):(
          <div className="px-5 py-8 text-center">
            <AlertCircle size={32} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-800">Issue Reported</p>
            <p className="text-xs text-gray-500 mt-1">Our team will review and follow up with you.</p>
            <button onClick={onClose} className="mt-4 px-5 py-2 text-xs text-white bg-primary-600 rounded-lg">Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Data Change Record Modal ──────────────────────────────────────────────────
function DataChangeModal({ shipment, onClose }: { shipment: Shipment; onClose:()=>void }) {
  const records = [
    { no:1, newDate:'2025-06-20', originalDate:'2025-06-20', reason:'Product Not Ready', changedBy:'ordyran/shipper', changedTime:'2025-05-20 20:14:52' },
  ]
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[580px]" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-800">Ready Date Change Record</h3>
          <button onClick={onClose}><X size={15} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="px-5 py-4">
          <div className="flex justify-end mb-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50">
              <Download size={12}/> Export
            </button>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b">
              {['No','New Ready Date','Original Ready Date','Change Reason','Changed By','Change Time'].map(h=>(
                <th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>{records.map(r=>(
              <tr key={r.no} className="border-b border-gray-100">
                <td className="py-2.5 px-3">{r.no}</td>
                <td className="py-2.5 px-3">{r.newDate}</td>
                <td className="py-2.5 px-3">{r.originalDate}</td>
                <td className="py-2.5 px-3">{r.reason}</td>
                <td className="py-2.5 px-3">{r.changedBy}</td>
                <td className="py-2.5 px-3">{r.changedTime}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="flex justify-end px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  )
}

// ─── Shipment Detail Page ──────────────────────────────────────────────────────
export function ShipperShipmentDetail({ shipmentId, onBack }: { shipmentId: string; onBack:()=>void }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const shipment = SHIPMENTS.find(s=>s.id===shipmentId) ?? SHIPMENTS[0]
  const tabs = ['Overview','Activity','Products','Documents']

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={14}/> Back to Shipments
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-1">{shipment.proNo}</h1>
      <p className="text-xs text-gray-400 mb-5">Pickup reference # {shipment.puNo}/</p>

      {/* Tabs */}
      <div className="flex items-center gap-0 mb-6 border-b border-gray-200">
        {tabs.map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab===tab?'border-primary-600 text-primary-600':'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab==='Overview'&&(
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-xs text-gray-500 mb-4">Service <span className="font-medium text-gray-800 ml-2">{shipment.service} Shipment</span></p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-1.5 mb-3"><MapPin size={13} className="text-gray-500"/><span className="text-xs font-semibold text-gray-700">Pickup</span></div>
              <p className="text-[9px] text-gray-400 uppercase mb-1">Origin</p>
              <p className="text-sm text-gray-800">{shipment.origin}</p>
              <p className="text-xs text-primary-600 mt-3 cursor-pointer hover:underline">Additional Services</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-1.5 mb-3"><MapPin size={13} className="text-gray-500"/><span className="text-xs font-semibold text-gray-700">Delivery</span></div>
              <p className="text-[9px] text-gray-400 uppercase mb-1">Destination</p>
              <p className="text-sm text-gray-800">{shipment.destination}</p>
              <p className="text-xs text-primary-600 mt-3 cursor-pointer hover:underline">Additional Services</p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab==='Activity'&&(
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Activity Timeline</p>
          <div className="space-y-4">
            {[{time:'04/04/2026 09:00',event:'Shipment Created',user:'system'},{time:'04/04/2026 10:30',event:'Ready Date Set',user:'ordyran/shipper'}].map((a,i)=>(
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 shrink-0"/>
                <div><p className="text-xs font-medium text-gray-800">{a.event}</p><p className="text-[10px] text-gray-400">{a.time} · {a.user}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab==='Products'&&(
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Shipment</p>
          <div className="flex gap-4">
            <table className="flex-1 text-xs border border-gray-100 rounded-lg overflow-hidden">
              <thead><tr className="bg-gray-50"><th className="text-left py-2 px-3 font-medium text-gray-500">Item</th><th className="text-left py-2 px-3 font-medium text-gray-500">Pallets</th><th className="text-left py-2 px-3 font-medium text-gray-500">Weight</th></tr></thead>
              <tbody><tr className="border-t border-gray-100"><td className="py-2 px-3 text-gray-700">General Merchandise</td><td className="py-2 px-3">{shipment.pallets} Pallet(s)</td><td className="py-2 px-3">{shipment.weight}</td></tr></tbody>
            </table>
            <div className="w-48 shrink-0 bg-gray-50 rounded-lg p-4 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-2 mb-2"><span className="text-gray-500">Total pallets</span><span className="font-semibold">{shipment.pallets}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Weight</span><span className="font-semibold">{shipment.weight}</span></div>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-6 mb-4">Adjusted Shipment</p>
          <div className="flex gap-4">
            <table className="flex-1 text-xs border border-gray-100 rounded-lg overflow-hidden">
              <thead><tr className="bg-gray-50">{['NO','PO','Pallet','Stackable','Weight'].map(h=><th key={h} className="text-left py-2 px-3 font-medium text-gray-500">{h}</th>)}</tr></thead>
              <tbody><tr><td colSpan={5} className="py-4 text-center text-gray-400">No adjusted shipment data</td></tr></tbody>
            </table>
            <div className="w-48 shrink-0 bg-gray-50 rounded-lg p-4 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-1.5 mb-1.5"><span className="text-gray-500">Total Pallets</span><span className="font-semibold text-right">0 stackable<br/>0 non-stackable</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Weight</span><span className="font-semibold">0 lbs</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab==='Documents'&&(
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Documents</p>
          <table className="w-full text-xs border border-gray-100 rounded-lg overflow-hidden">
            <thead><tr className="bg-gray-50"><th className="text-left py-2.5 px-4 font-medium text-gray-500">Document name</th><th className="text-left py-2.5 px-4 font-medium text-gray-500">Uploaded date</th></tr></thead>
            <tbody><tr><td colSpan={2} className="py-8 text-center text-gray-400">No documents uploaded</td></tr></tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Main List Page ────────────────────────────────────────────────────────────
export default function ShipperShipmentManagement() {
  const [searchPo, setSearchPo] = useState('PO#')
  const [searchVal, setSearchVal] = useState('')
  const [visibleCols, setVisibleCols] = useState<VisibleCols>(() =>
    Object.fromEntries(ALL_COLUMNS.map(c=>[c.key,true]))
  )
  const [showCustomize, setShowCustomize] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterRule[]>([])
  const [actionMenuId, setActionMenuId] = useState<string|null>(null)
  const [reportIssueShipment, setReportIssueShipment] = useState<Shipment|null>(null)
  const [dataChangeShipment, setDataChangeShipment] = useState<Shipment|null>(null)
  const [editShipment, setEditShipment] = useState<Shipment|null>(null)
  const [detailId, setDetailId] = useState<string|null>(null)
  const [readyDates, setReadyDates] = useState<Record<string,string>>(() =>
    Object.fromEntries(SHIPMENTS.map(s=>[s.id, s.readyDate]))
  )

  const toggleCol = (k:string) => setVisibleCols(prev=>({...prev,[k]:prev[k]===false}))

  if (detailId) {
    return <ShipperShipmentDetail shipmentId={detailId} onBack={()=>setDetailId(null)} />
  }

  const filtered = SHIPMENTS.filter(s => {
    if (!searchVal.trim()) return true
    const q = searchVal.toLowerCase()
    return s.puNo.includes(q)||s.proNo.toLowerCase().includes(q)||s.po.some(p=>p.includes(q))||s.origin.toLowerCase().includes(q)
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={14}/> Export
        </button>
      </div>

      {/* Search & controls bar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9">
          <select value={searchPo} onChange={e=>setSearchPo(e.target.value)}
            className="px-2 py-1 text-xs bg-gray-50 border-r border-gray-300 focus:outline-none h-full">
            {['PO#','PRO#','PU#','Reference'].map(o=><option key={o}>{o}</option>)}
          </select>
          <Search size={13} className="ml-2 text-gray-400 shrink-0" />
          <input value={searchVal} onChange={e=>setSearchVal(e.target.value)}
            placeholder="Enter or select multiple shipments (max separated by space or commas)"
            className="flex-1 px-2 text-xs focus:outline-none min-w-[260px]" />
        </div>
        <button onClick={()=>setShowCustomize(true)}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
          <ChevronDown size={12}/> Customize Fields
        </button>
        <div className="flex-1"/>
        <button onClick={()=>setShowFilter(true)}
          className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs transition-colors ${activeFilter.length>0?'border-primary-300 text-primary-600 bg-primary-50':'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
          <Filter size={13}/> Filter{activeFilter.length>0?` (${activeFilter.length})`:''}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {ALL_COLUMNS.filter(c=>visibleCols[c.key]!==false).map(c=>(
                  <th key={c.key} className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase whitespace-nowrap">{c.label}</th>
                ))}
                <th className="text-left py-2.5 px-3 text-[10px] font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(row=>(
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {visibleCols['scheduled']!==false&&<td className="py-2.5 px-3 whitespace-nowrap text-gray-700">{row.scheduled?'Yes':'No'}</td>}
                  {visibleCols['puNo']!==false&&<td className="py-2.5 px-3 whitespace-nowrap text-primary-600 cursor-pointer hover:underline" onClick={()=>setDetailId(row.id)}>{row.puNo}</td>}
                  {visibleCols['proNo']!==false&&<td className="py-2.5 px-3 whitespace-nowrap">
                    <p className="text-primary-600 cursor-pointer hover:underline font-medium" onClick={()=>setDetailId(row.id)}>{row.proNo}</p>
                  </td>}
                  {visibleCols['po']!==false&&<td className="py-2.5 px-3 min-w-[100px]">{row.po.map((p,i)=><p key={i} className="text-gray-600">{p}</p>)}</td>}
                  {visibleCols['reference']!==false&&<td className="py-2.5 px-3 max-w-[100px] truncate text-gray-500">{row.reference||'–'}</td>}
                  {visibleCols['service']!==false&&<td className="py-2.5 px-3 text-gray-600">{row.service}</td>}
                  {visibleCols['origin']!==false&&<td className="py-2.5 px-3 max-w-[140px] text-gray-600 text-[10px] leading-relaxed">{row.origin}</td>}
                  {visibleCols['requestedDate']!==false&&<td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.requestedDate}</td>}
                  {visibleCols['readyDate']!==false&&<td className="py-2.5 px-3">
                    <input type="date" value={readyDates[row.id]||''} onChange={e=>setReadyDates(prev=>({...prev,[row.id]:e.target.value}))}
                      className={`border rounded-md px-2 py-1 text-[10px] focus:outline-none focus:border-primary-400 w-28 ${readyDates[row.id]?'border-gray-200':'border-red-200 bg-red-50'}`}
                      placeholder="Ready date" />
                  </td>}
                  {visibleCols['readyTime']!==false&&<td className="py-2.5 px-3 whitespace-nowrap text-gray-600">{row.readyTime}</td>}
                  {visibleCols['closeTime']!==false&&<td className="py-2.5 px-3 whitespace-nowrap">
                    {row.closeTime
                      ? <button className="px-2 py-1 border border-gray-200 rounded text-[10px] text-gray-600 hover:bg-gray-50">{row.closeTime}</button>
                      : <button className="px-2 py-1 border border-gray-200 rounded text-[10px] text-gray-400 hover:bg-gray-50">Select</button>}
                  </td>}
                  {visibleCols['destination']!==false&&<td className="py-2.5 px-3 max-w-[120px] text-gray-600 text-[10px] leading-relaxed">{row.destination}</td>}
                  {visibleCols['deliveryDate']!==false&&<td className="py-2.5 px-3 whitespace-nowrap text-gray-500">{row.deliveryDate||'–'}</td>}
                  {/* Action */}
                  <td className="py-2.5 px-3 relative">
                    <button onClick={()=>setActionMenuId(actionMenuId===row.id?null:row.id)}
                      className="w-8 h-8 bg-primary-600 text-white rounded flex items-center justify-center hover:bg-primary-700 text-xs font-bold">
                      ···
                    </button>
                    {actionMenuId===row.id&&(
                      <div className="absolute right-8 top-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-44 py-1" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>{setEditShipment(row);setActionMenuId(null)}} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                          ✏️ Edit
                        </button>
                        <button onClick={()=>{setDetailId(row.id);setActionMenuId(null)}} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                          📋 Shipment details
                        </button>
                        <button onClick={()=>{setDataChangeShipment(row);setActionMenuId(null)}} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                          🕒 Data change record
                        </button>
                        <button onClick={()=>{setReportIssueShipment(row);setActionMenuId(null)}} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                          ⚠️ Report issue
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Click outside to close action menu */}
      {actionMenuId&&<div className="fixed inset-0 z-10" onClick={()=>setActionMenuId(null)}/>}

      {/* Modals */}
      {showCustomize&&<CustomizeModal visible={visibleCols} onToggle={toggleCol} onClose={()=>setShowCustomize(false)} onConfirm={()=>setShowCustomize(false)} />}
      {showFilter&&<FilterModal onClose={()=>setShowFilter(false)} onApply={rules=>setActiveFilter(rules)} />}
      {editShipment&&<EditOrderModal shipment={editShipment} onClose={()=>setEditShipment(null)} onSave={(id,rd,rt,ct,n,nr)=>{setReadyDates(prev=>({...prev,[id]:rd}));setEditShipment(null)}} />}
      {reportIssueShipment&&<ReportIssueModal shipment={reportIssueShipment} onClose={()=>setReportIssueShipment(null)} />}
      {dataChangeShipment&&<DataChangeModal shipment={dataChangeShipment} onClose={()=>setDataChangeShipment(null)} />}
    </div>
  )
}
