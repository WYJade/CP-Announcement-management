import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Package, Truck, CreditCard } from 'lucide-react'

const STEPS = ['Get a Quote', 'Rate Shopping', 'Result', 'Booking', 'Place Order']

export default function FreightQuote() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'prepay' | 'postpay'>('prepay')

  return (
    <div className="p-6">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 ${i <= step ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-16 h-0.5 mx-2 ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* ═══ Step 1: Get a Quote ═══ */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Get a Quote</h2>

          {/* Shipper */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Shipper</h3>
            <div className="grid grid-cols-4 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Shipper Type*</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" defaultValue="Zip Code"><option>Zip Code</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">Zip Code</label><input type="text" defaultValue="78754" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">City</label><input type="text" defaultValue="Austin" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">State</label><input type="text" defaultValue="TX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            </div>
          </div>

          {/* Consignee */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Consignee</h3>
            <div className="grid grid-cols-4 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Consignee Type*</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" defaultValue="Zip Code"><option>Zip Code</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">Zip Code</label><input type="text" defaultValue="78754" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">City</label><input type="text" defaultValue="Austin" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">State</label><input type="text" defaultValue="TX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div><label className="block text-xs text-gray-500 mb-1">Bill To*</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>Select Bill To</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">PO Number</label><input type="text" placeholder="PO Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Reference Number</label><input type="text" placeholder="Reference Number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            </div>
          </div>

          {/* Commodities */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Commodities 1</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className="block text-xs text-gray-500 mb-1">Item</label><input type="text" defaultValue="Box" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Package Type</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>Package Type</option><option>Pallet</option><option>Box</option></select></div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div><label className="block text-xs text-gray-500 mb-1">Pallet Qty*</label><input type="text" defaultValue="1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Pallet Dimensions</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>Pallet Dimensions</option></select></div>
              <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Dimensions (inch)*</label><div className="flex gap-1"><input type="text" defaultValue="7" placeholder="L" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm" /><span className="self-center text-gray-400">x</span><input type="text" defaultValue="6" placeholder="W" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm" /><span className="self-center text-gray-400">x</span><input type="text" defaultValue="8" placeholder="H" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm" /></div></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Class*</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>50</option><option>55</option><option>60</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">Weight (lbs)*</label><input type="text" defaultValue="6" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">NMFC</label><input type="text" placeholder="NMFC" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Description</label><input type="text" placeholder="Description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={() => setStep(1)} className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">Continue</button>
          </div>
        </div>
      )}

      {/* ═══ Step 2: Rate Shopping ═══ */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rate Shopping</h2>
          {/* Summary */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"><span className="text-sm font-medium">Shipper</span><span className="text-xs text-gray-500">Zip Code: 78754 &middot; Austin &middot; TX</span></div>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"><span className="text-sm font-medium">Consignee</span><span className="text-xs text-gray-500">Zip Code: 78754 &middot; Austin &middot; TX</span></div>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"><span className="text-sm font-medium">Commodities 1</span><span className="text-xs text-gray-500">Class: 50 &middot; Pallet: 1 &middot; 7x6x8 inch &middot; Weight: 6</span></div>
          </div>

          <h3 className="text-sm font-semibold text-gray-800 mb-3">Choose a Service</h3>
          <div className="flex gap-6">
            {/* Filters */}
            <div className="w-48 shrink-0 space-y-4 text-xs">
              <div><p className="font-semibold text-gray-700 mb-1">Price</p><p className="text-gray-500">$13.61 - $13.61</p></div>
              <div><p className="font-semibold text-gray-700 mb-1">Estimated date</p><p className="text-gray-500">Jul 05, 2026 - Jul 08, 2026</p></div>
              <div><p className="font-semibold text-gray-700 mb-1">Modes</p><label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="rounded text-primary-600" /> Small Parcel (1)</label></div>
              <div><p className="font-semibold text-gray-700 mb-1">Carrier</p><label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="rounded text-primary-600" /> UPS (1)</label></div>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex mb-3"><button className="flex-1 py-2 text-sm font-medium bg-gray-100 rounded-l-lg">Quickest</button><button className="flex-1 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-r-lg">Cheapest</button></div>
              <div className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedService === 'ups' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedService('ups')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-bold text-[10px]">UPS</div>
                    <div><p className="text-sm font-semibold text-gray-900">UPS</p><p className="text-[10px] text-gray-500">Estimated delivery 2-3 business days after pickup</p></div>
                  </div>
                  <div className="text-right">
                    {selectedService === 'ups' && <span className="text-[9px] bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium">Guaranteed</span>}
                    <p className="text-lg font-bold text-gray-900">13.61</p>
                  </div>
                </div>
                {selectedService === 'ups' && (
                  <table className="w-full text-xs mt-3 border-t border-gray-200 pt-2">
                    <thead><tr className="text-left"><th className="py-2 text-gray-500 font-semibold">Service Name</th><th className="py-2 text-gray-500 font-semibold">Transit Days</th><th className="py-2 text-gray-500 font-semibold">Type</th><th className="py-2 text-gray-500 font-semibold text-right">Total Amount</th></tr></thead>
                    <tbody><tr><td className="py-2"><input type="radio" defaultChecked className="mr-1.5 text-primary-600" />GRND</td><td className="py-2">Estimate 2-3 Business Days</td><td className="py-2">Small Parcel</td><td className="py-2 text-right font-medium">$13.61</td></tr></tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(0)} className="text-sm text-gray-500">&larr; Back</button>
            <button onClick={() => setStep(2)} disabled={!selectedService} className={`px-5 py-2 text-sm font-medium rounded-lg ${selectedService ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-400'}`}>Continue</button>
          </div>
        </div>
      )}

      {/* ═══ Step 3: Result ═══ */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-4">&larr; Back</button>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Result</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Here's your estimated quote</h3>
          <p className="text-sm text-gray-500 mb-6">We have generated a personalized quote just for you. Select your best combination to proceed.</p>

          <div className="flex gap-6">
            {/* Left: Load details */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500 mb-2">Load</p><div className="flex items-center gap-2"><Package size={18} className="text-gray-400" /><span className="text-sm font-medium">1 X <span className="text-[10px] text-gray-400">pallet</span></span></div></div>
                <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500 mb-2">Weight / Volume</p><div className="flex items-center gap-2"><Package size={18} className="text-gray-400" /><span className="text-sm font-medium">103 CFT</span></div></div>
                <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500 mb-2">Type</p><div className="flex items-center gap-2"><Truck size={18} className="text-gray-400" /><span className="text-sm font-medium">GRND</span></div></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Seller: UPS</p>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Truck size={18} className="text-gray-500" /></div><div><p className="text-sm font-semibold">UPS</p><p className="text-[10px] text-gray-400">GRND</p></div></div>
              </div>
            </div>

            {/* Right: Quote card */}
            <div className="w-80 shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500">UPS</p>
                <div className="flex items-center gap-2 mb-4"><h3 className="text-lg font-bold">QUOTE #3996</h3><span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Expires in 29 days</span></div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Transportation</p>
                <div className="space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between"><span className="text-gray-500">Freight Charges</span><span>$350.00</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Fuel Surcharge</span><span>$75.00</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Lift Gate Service</span><span>$25.75</span></div>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-3 mb-2"><span>Sub-Total</span><span>$450.75</span></div>
                <div className="flex justify-between text-base font-bold"><span>Total amount</span><span>$450.75</span></div>
                <button onClick={() => setStep(3)} className="w-full mt-4 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">Schedule Pickup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Step 4: Booking (Schedule A Pickup) ═══ */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="text-sm text-gray-500 mb-4">&larr; Back</button>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Schedule A Pickup</h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">UNIS LTL SHIPMENT</p>
              <p className="text-sm font-bold">QUOTE #3996</p>
              <div className="flex items-center gap-6 mt-3 text-[10px] text-gray-500">
                <div className="flex items-center gap-1"><div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center"><Check size={10} className="text-primary-600" /></div>Austin, TX<br/>78754, USA</div>
                <div className="flex items-center gap-1"><div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center"><Check size={10} className="text-primary-600" /></div>Austin, TX<br/>78754, USA</div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Estimated ship date: Aug 19, 2024 &middot; Transit Day: 4 Days &middot; Weight: 6 lbs</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold mb-3">Schedule pickup window date and hours</p>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-[10px] text-gray-500 mb-1">Pickup date*</label><input type="text" defaultValue="Jul 8, 2026" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div>
                <div><label className="block text-[10px] text-gray-500 mb-1">Earliest pickup time*</label><input type="text" defaultValue="16:25" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div>
                <div><label className="block text-[10px] text-gray-500 mb-1">Latest pickup time*</label><input type="text" defaultValue="16:55" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div>
              </div>
            </div>
          </div>

          {/* Shipper / Consignee details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div><label className="block text-xs text-gray-500 mb-1">Shipper Name*</label><input type="text" defaultValue="Suma" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Consignee Name*</label><input type="text" defaultValue="Alex" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Pickup Address*</label><input type="text" defaultValue="12t2t2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-primary-600 text-white" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Delivery Address*</label><input type="text" defaultValue="12t2t2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-primary-600 text-white" /></div>
            <div className="grid grid-cols-3 gap-2"><div><label className="block text-[10px] text-gray-500 mb-1">Zip Code*</label><input type="text" defaultValue="78754" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div><div><label className="block text-[10px] text-gray-500 mb-1">City*</label><input type="text" defaultValue="Austin" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div><div><label className="block text-[10px] text-gray-500 mb-1">State*</label><input type="text" defaultValue="TX" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div></div>
            <div className="grid grid-cols-3 gap-2"><div><label className="block text-[10px] text-gray-500 mb-1">Zip Code*</label><input type="text" defaultValue="78754" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div><div><label className="block text-[10px] text-gray-500 mb-1">City*</label><input type="text" defaultValue="Austin" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div><div><label className="block text-[10px] text-gray-500 mb-1">State*</label><input type="text" defaultValue="TX" className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /></div></div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500">&larr; Back</button>
            <button onClick={() => setStep(4)} className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">Continue</button>
          </div>
        </div>
      )}

      {/* ═══ Step 5: Place Order (Payment) ═══ */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Review Pickup Request</h2>
          <p className="text-xs text-gray-500 mb-6">Reference #: 3996</p>

          <div className="flex gap-6">
            {/* Left: Shipper/Consignee/Shipment info */}
            <div className="flex-1 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold mb-3">Shipper Information</h4>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p>Suma</p><p>12t2t2</p><p>Austin, TX, 78754, United States</p><p>8885251912</p><p>Email Address: yujuan.wang@item.com</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Additional Services</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold mb-3">Consignee Information</h4>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p>Alex</p><p>12t2t2</p><p>Austin, TX, 78754, United States</p><p>8885251912</p><p>Email Address: yujuan.wang@item.com</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Additional Services</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold mb-3">Shipment</h4>
                <table className="w-full text-xs">
                  <thead><tr className="border-b"><th className="text-left py-2 text-gray-500">Item</th><th className="text-left py-2 text-gray-500">Dimension</th><th className="text-left py-2 text-gray-500">Package Type</th><th className="text-left py-2 text-gray-500">Total weight</th></tr></thead>
                  <tbody><tr><td className="py-2">7 X 6 X 7</td><td className="py-2">7 Box</td><td className="py-2">1 Pallet</td><td className="py-2">6.00 lbs</td></tr></tbody>
                </table>
              </div>
            </div>

            {/* Right: Payment */}
            <div className="w-80 shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs text-gray-500">UNIS LTL SHIPMENT</p>
                <div className="flex items-center gap-2 mb-4"><h3 className="text-lg font-bold">QUOTE #3855</h3><span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Expires in 29 days</span></div>

                {/* Payment method toggle */}
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setPaymentMethod('prepay')} className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${paymentMethod === 'prepay' ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500'}`}>Pay Now</button>
                  <button onClick={() => setPaymentMethod('postpay')} className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${paymentMethod === 'postpay' ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500'}`}>Order First, Pay Later</button>
                </div>

                {paymentMethod === 'prepay' && (
                  <>
                    <div className="mb-3">
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"><option>VISA 4111********1111</option></select>
                      <button className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">+ wallet/paymentMethods.addNewCard</button>
                    </div>
                    <div className="space-y-1.5 text-xs mb-3">
                      <p className="font-semibold text-gray-700">Transportation</p>
                      <div className="flex justify-between"><span className="text-gray-500">Freight Charges</span><span>$350.00</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Fuel Surcharge</span><span>$75.00</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Lift Gate Service</span><span>$25.75</span></div>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-3 mb-2"><span>Sub-Total</span><span>$450.75</span></div>
                    <div className="flex justify-between text-base font-bold mb-4"><span>Total amount</span><span>$450.75</span></div>
                    <button onClick={() => setStep(5)} className="w-full py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">Place Order</button>
                  </>
                )}

                {paymentMethod === 'postpay' && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-700">
                      <p className="font-semibold mb-1">Order First, Pay Later</p>
                      <p className="text-[10px]">Your order will be placed immediately. An invoice will be generated and added to your account for payment within the agreed credit terms.</p>
                    </div>
                    <div className="space-y-1.5 text-xs mb-3">
                      <p className="font-semibold text-gray-700">Transportation</p>
                      <div className="flex justify-between"><span className="text-gray-500">Freight Charges</span><span>$350.00</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Fuel Surcharge</span><span>$75.00</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Lift Gate Service</span><span>$25.75</span></div>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-3 mb-2"><span>Sub-Total</span><span>$450.75</span></div>
                    <div className="flex justify-between text-base font-bold mb-4"><span>Total amount</span><span>$450.75</span></div>
                    <button onClick={() => setStep(5)} className="w-full py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">Place Order & Generate Invoice</button>
                    <p className="text-[9px] text-gray-400 text-center mt-2">Payment terms: Net 30 days from invoice date</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══ Step 6: Shipment Confirmation ═══ */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Shipment Confirmation</h2>
          <p className="text-xs text-gray-500 mb-6">Reference #: 3996</p>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {/* Shipper */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold mb-3">Shipper Information</h4>
              <div className="text-xs text-gray-700 space-y-0.5">
                <p className="font-medium">Suma</p><p>12t2t2</p><p>Austin, TX, 78754, United States</p><p>8885251912</p><p>Email Address: 2454535@qq.com</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Additional Services</p>
            </div>
            {/* Consignee */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold mb-3">Consignee Information</h4>
              <div className="text-xs text-gray-700 space-y-0.5">
                <p className="font-medium">Alex</p><p>12t2t2</p><p>Austin, TX, 78754, United States</p><p>8885251912</p><p>Email Address: 675553435@qq.com</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Additional Services</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {/* Bill Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold mb-3">Bill Information</h4>
              <div className="text-xs text-gray-700 space-y-1">
                <p><span className="text-gray-500">Bill to:</span></p>
                <p>Account Name: John Doe</p>
                <p>Account Number: 123456789</p>
              </div>
            </div>
            {/* Shipment */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold mb-3">Shipment</h4>
              <table className="w-full text-xs">
                <thead><tr className="border-b"><th className="text-left py-2 text-gray-500">Item</th><th className="text-left py-2 text-gray-500">Dimension</th><th className="text-left py-2 text-gray-500">Package Type</th><th className="text-left py-2 text-gray-500">Total weight</th></tr></thead>
                <tbody><tr><td className="py-2">7 X 6 X 5</td><td className="py-2"></td><td className="py-2">1 Pallet</td><td className="py-2">6.00 lbs</td></tr></tbody>
              </table>
            </div>
          </div>

          {/* Payment details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h4 className="text-sm font-semibold mb-3">Payment Details</h4>
            <p className="text-xs text-gray-700 mb-3">Transportation:</p>
            <div className="space-y-1.5 text-xs mb-4 ml-4">
              <div className="flex justify-between"><span className="text-gray-500">Freight Charges</span><span>$299.99</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fuel Surcharge 8.35%</span><span>$25.00</span></div>
            </div>
            <div className="flex justify-between text-sm border-t pt-3 mb-1"><span className="font-semibold">Sub-Total</span><span>$350.99</span></div>
            <div className="flex justify-between text-base font-bold"><span>Total amount</span><span>$450.75</span></div>
          </div>

          {/* View Shipments button */}
          <div className="flex justify-end">
            <button onClick={() => navigate('/shipping/shipments')} className="px-6 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">View Shipments</button>
          </div>
        </div>
      )}
    </div>
  )
}
