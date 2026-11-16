import { useState } from 'react'
import { Plus, X, Calendar, ChevronDown, Trash2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ItemLine {
  id: string
  item: string
  title: string
  uom: string
  qty: string
  lotNo: string
  palletQty: string
  supplier: string
  unitPrice: string
  unitPriceCurrency: string
  goodsType: string
  buyerItemId: string
  notes: string
  status: string
}

// ─── Options ──────────────────────────────────────────────────────────────────
const ORDER_TYPES      = ['Sales Order', 'Return', 'Transfer', 'Sample', 'Disposal']
const RETAILERS        = ['Walmart', 'Target', 'Amazon', 'Costco', 'Home Depot']
const DATA_CHANNELS    = ['EDI', 'API', 'Manual', 'Portal']
const BUSINESS_TYPES   = ['B2B', 'B2C', 'D2C', 'Wholesale', 'Retail']
const SHIP_METHODS     = ['LTL', 'FTL', 'Small Parcel', 'Rail', 'Air', 'Ocean']
const DELIVERY_SERVICES= ['Standard', 'Express', 'Overnight', 'Economy']
const FREIGHT_TERMS    = ['Prepaid', 'Collect', 'Third Party']
const UOM_OPTIONS      = ['EA', 'CS', 'PL', 'LB', 'KG', 'FT', 'MT']
const CURRENCY_OPTIONS = ['USD', 'CAD', 'EUR', 'CNY', 'GBP']
const GOODS_TYPES      = ['Normal', 'Dangerous Goods', 'Perishable', 'Frozen', 'High Value', 'Fragile', 'Hazmat', 'Oversized', 'Expired', 'Returned']

// ─── Form field components ────────────────────────────────────────────────────
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-gray-600 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function TextInput({ placeholder, value, onChange, className }: {
  placeholder?: string; value?: string; onChange?: (v: string) => void; className?: string
}) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 ${className ?? ''}`}
    />
  )
}

function SelectInput({ placeholder, options, value, onChange, className }: {
  placeholder?: string; options: string[]; value?: string; onChange?: (v: string) => void; className?: string
}) {
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400 ${className ?? ''}`}
    >
      <option value="">{placeholder ?? 'Select...'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function DateInput({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative">
      <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder ?? 'Select date and time'}
        className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary-400"
      />
    </div>
  )
}

// ─── Add Item List Modal ───────────────────────────────────────────────────────
function AddItemModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (item: Omit<ItemLine, 'id' | 'status'>) => void
}) {
  const [form, setForm] = useState({
    item: '', title: '', uom: '', qty: '', lotNo: '', palletQty: '',
    supplier: '', unitPrice: '', unitPriceCurrency: '', goodsType: '',
    buyerItemId: '', notes: '',
  })

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-semibold text-gray-900">Add Item List</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Row 1: Item / Title / Supplier */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel label="Item" required />
              <SelectInput placeholder="Input to search" options={[]} value={form.item} onChange={set('item')} />
            </div>
            <div>
              <FieldLabel label="Title" />
              <SelectInput placeholder="Input to search" options={[]} value={form.title} onChange={set('title')} />
            </div>
            <div>
              <FieldLabel label="Supplier" />
              <SelectInput placeholder="Input to search" options={[]} value={form.supplier} onChange={set('supplier')} />
            </div>
          </div>

          {/* Row 2: UOM / Qty / Unit Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel label="UOM" required />
              <SelectInput placeholder="Select UOM" options={UOM_OPTIONS} value={form.uom} onChange={set('uom')} />
            </div>
            <div>
              <FieldLabel label="Qty" required />
              <TextInput placeholder="Enter qty" value={form.qty} onChange={set('qty')} />
            </div>
            <div>
              <FieldLabel label="Unit Price" />
              <TextInput placeholder="Enter Unit Price" value={form.unitPrice} onChange={set('unitPrice')} />
            </div>
          </div>

          {/* Row 3: Unit Price Currency / Lot No / Pallet Qty */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel label="Unit Price Currency" />
              <SelectInput placeholder="Select currency (optional)" options={CURRENCY_OPTIONS} value={form.unitPriceCurrency} onChange={set('unitPriceCurrency')} />
            </div>
            <div>
              <FieldLabel label="Lot No" />
              <TextInput placeholder="Please select an item first" value={form.lotNo} onChange={set('lotNo')} />
            </div>
            <div>
              <FieldLabel label="Pallet Qty" />
              <TextInput placeholder="Enter pallet qty" value={form.palletQty} onChange={set('palletQty')} />
            </div>
          </div>

          {/* Row 4: Goods Type / Buyer Item ID */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel label="Goods Type" />
              <SelectInput
                placeholder="Select goods type"
                options={GOODS_TYPES}
                value={form.goodsType}
                onChange={set('goodsType')}
              />
            </div>
            <div className="col-span-2">
              <FieldLabel label="Buyer Item ID" />
              <TextInput placeholder="Enter Buyer Item ID" value={form.buyerItemId} onChange={set('buyerItemId')} />
            </div>
          </div>

          {/* Row 5: Notes */}
          <div>
            <FieldLabel label="Notes" />
            <textarea
              value={form.notes}
              onChange={e => set('notes')(e.target.value)}
              placeholder="Enter note"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSubmit(form); onClose() }}
            className="px-5 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-5">
        <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
          {num}
        </span>
        {title}
      </h2>
      {children}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function OrderEntry() {
  const [showAddItem, setShowAddItem] = useState(false)
  const [items, setItems] = useState<ItemLine[]>([])

  // Order Info state
  const [customer]  = useState('ADOORN LLC-ADOLLC0001')
  const [facility, setFacility]   = useState('')
  const [orderType, setOrderType] = useState('')
  const [retailer, setRetailer]   = useState('')
  const [poNo, setPoNo]           = useState('')
  const [reference, setReference] = useState('')
  const [csoNo, setCsoNo]         = useState('')
  const [labelCode, setLabelCode] = useState('')
  const [dataChannel, setDataChannel] = useState('')
  const [dcAccount, setDcAccount]     = useState('')
  const [rush, setRush]               = useState(false)
  const [transload, setTransload]     = useState(false)
  const [businessType, setBusinessType] = useState('')
  const [bolNote, setBolNote]           = useState('')
  const [orderNote, setOrderNote]       = useState('')

  // Freight Term state
  const [carrier, setCarrier]           = useState('')
  const [shipMethod, setShipMethod]     = useState('')
  const [deliveryService, setDeliveryService] = useState('')
  const [freightTerm, setFreightTerm]   = useState('')
  const [shippingAcct, setShippingAcct] = useState('')

  const handleAddItem = (item: Omit<ItemLine, 'id' | 'status'>) => {
    setItems(prev => [...prev, { ...item, id: `I${Date.now()}`, status: 'Pending' }])
  }

  const handleDeleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <h1 className="text-xl font-bold text-gray-900 mb-5">Outbound Order Entry</h1>

      {/* ① Order Info */}
      <Section num={1} title="Order Info">
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <FieldLabel label="Customer" required />
            <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">{customer}</div>
          </div>
          <div>
            <FieldLabel label="Facility" required />
            <SelectInput placeholder="Select facility" options={['Seabrook', 'Ontario, CA', 'Fontana, CA', 'Chicago, IL']} value={facility} onChange={setFacility} />
          </div>
          <div>
            <FieldLabel label="Order Type" required />
            <SelectInput placeholder="Select order type" options={ORDER_TYPES} value={orderType} onChange={setOrderType} />
          </div>
          <div>
            <FieldLabel label="Retailer" />
            <SelectInput placeholder="Select retailer" options={RETAILERS} value={retailer} onChange={setRetailer} />
          </div>
          <div>
            <FieldLabel label="Purchase Order No." />
            <TextInput placeholder="Enter purchase order no." value={poNo} onChange={setPoNo} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <FieldLabel label="Reference" required />
            <TextInput placeholder="Enter reference" value={reference} onChange={setReference} />
          </div>
          <div>
            <FieldLabel label="Customer Sales Order No." />
            <TextInput placeholder="Enter customer sales" value={csoNo} onChange={setCsoNo} />
          </div>
          <div>
            <FieldLabel label="Label Code" />
            <TextInput placeholder="" value={labelCode} onChange={setLabelCode} />
          </div>
          <div>
            <FieldLabel label="Data Channel" />
            <SelectInput placeholder="Select data channel" options={DATA_CHANNELS} value={dataChannel} onChange={setDataChannel} />
          </div>
          <div>
            <FieldLabel label="Data Channel Account" />
            <TextInput placeholder="" value={dcAccount} onChange={setDcAccount} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <FieldLabel label="Rush" />
            <div className="flex items-center pt-1">
              <button
                onClick={() => setRush(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors ${rush ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${rush ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <div>
            <FieldLabel label="Transload" />
            <div className="flex items-center pt-1">
              <button
                onClick={() => setTransload(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors ${transload ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${transload ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <div>
            <FieldLabel label="Business Type" />
            <SelectInput placeholder="Select business type" options={BUSINESS_TYPES} value={businessType} onChange={setBusinessType} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel label="BOL Note" />
            <textarea
              value={bolNote}
              onChange={e => setBolNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 resize-none"
            />
          </div>
          <div>
            <FieldLabel label="Order Note" />
            <textarea
              value={orderNote}
              onChange={e => setOrderNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 resize-none"
            />
          </div>
        </div>
      </Section>

      {/* Address Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="text-base font-bold text-gray-900 mb-5">Address Info</h2>
        <div className="grid grid-cols-2 gap-6">
          {[['Ship From', true], ['Ship To', true], ['Freight Bill To', false], ['Sold To', false]].map(([label, req]) => (
            <div key={label as string}>
              <FieldLabel label={label as string} required={req as boolean} />
              {(label === 'Freight Bill To' || label === 'Sold To') && (
                <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-400" />
                  Same As Ship To Address
                </label>
              )}
              <TextInput placeholder="Enter address" />
              <button className="mt-2 text-xs text-primary-600 border border-primary-200 rounded-md px-3 py-1 hover:bg-primary-50 transition-colors">Edit</button>
            </div>
          ))}
        </div>
      </div>

      {/* ② Freight Term */}
      <Section num={2} title="Freight Term">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <FieldLabel label="Carrier" required />
            <TextInput placeholder="Input to search carrier" value={carrier} onChange={setCarrier} />
          </div>
          <div>
            <FieldLabel label="Ship Method" required />
            <SelectInput placeholder="Select ship method" options={SHIP_METHODS} value={shipMethod} onChange={setShipMethod} />
          </div>
          <div>
            <FieldLabel label="Delivery Service" />
            <SelectInput placeholder="Select delivery service" options={DELIVERY_SERVICES} value={deliveryService} onChange={setDeliveryService} />
          </div>
          <div>
            <FieldLabel label="Freight Term" />
            <SelectInput placeholder="Select freight term" options={FREIGHT_TERMS} value={freightTerm} onChange={setFreightTerm} />
          </div>
          <div>
            <FieldLabel label="Shipping Account No" />
            <TextInput placeholder="Enter shipping account no" value={shippingAcct} onChange={setShippingAcct} />
          </div>
        </div>
      </Section>

      {/* ③ Dates */}
      <Section num={3} title="Dates">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div><FieldLabel label="Ship Not Before" /><DateInput /></div>
          <div><FieldLabel label="Ship Not Later" /><DateInput /></div>
          <div><FieldLabel label="Schedule Date" /><DateInput /></div>
          <div><FieldLabel label="Requested Delivery Date" /><DateInput /></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div><FieldLabel label="Appointment Time" /><DateInput /></div>
        </div>
      </Section>

      {/* ④ Item List */}
      <Section num={4} title="Item List">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowAddItem(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={14} /> Add Item Line
          </button>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['#', 'Item', 'Title', 'UOM', 'Qty', 'Lot #', 'Pallet Qty', 'Supplier', 'Unit Price', 'Unit Price Currency', 'Goods Type', 'Status', 'Operations'].map(h => (
                  <th key={h} className="text-left py-3 px-3 font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-10 text-gray-400 text-sm">No data available</td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 text-gray-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-gray-700 font-medium">{item.item || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.title || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.uom || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.qty || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-500">{item.lotNo || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-500">{item.palletQty || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.supplier || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.unitPrice || '–'}</td>
                    <td className="py-2.5 px-3 text-gray-500">{item.unitPriceCurrency || '–'}</td>
                    <td className="py-2.5 px-3">
                      {item.goodsType ? (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">{item.goodsType}</span>
                      ) : '–'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">{item.status}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Save Order */}
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
          Save Order
        </button>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <AddItemModal
          onClose={() => setShowAddItem(false)}
          onSubmit={handleAddItem}
        />
      )}
    </div>
  )
}
