import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Sparkles, AlertCircle, Loader2,
  Paperclip, Info, Zap, Package, Truck, DollarSign,
  MessageSquare, Clock, HelpCircle, BoxSelect, Check,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent'

interface TopicOption {
  id: string
  icon: React.ReactNode
  label: string
  desc: string
  color: string
}

interface AIAnalysis {
  subject: string
  priority: Priority
  relatedType: string
  relatedId: string
  issueCategory: string
  issueSummary: string
  detectedRecords: string[]
  missingInfo: string[]
  suggestedRouting: string
  recommendedAction: string
}

// ─── Topic options (Step 1) ──────────────────────────────────────────────────
const TOPICS: TopicOption[] = [
  { id: 'urgent', icon: <Zap size={18} />, label: 'Urgent Processing', desc: 'Critical issues requiring immediate attention', color: 'text-red-500' },
  { id: 'inventory', icon: <Package size={18} />, label: 'Inventory Issues', desc: 'Stock discrepancy, shortage, damage', color: 'text-blue-500' },
  { id: 'shipping', icon: <Truck size={18} />, label: 'Shipping & Transport', desc: 'Delivery issues, routing, tracking', color: 'text-green-500' },
  { id: 'vas', icon: <Sparkles size={18} />, label: 'Value-Added Services', desc: 'Labeling, kitting, packaging, returns', color: 'text-purple-500' },
  { id: 'inbound', icon: <BoxSelect size={18} />, label: 'Inbound Related', desc: 'Receiving, appointments, putaway', color: 'text-amber-500' },
  { id: 'customs', icon: <Clock size={18} />, label: 'Customs & Compliance', desc: 'Declarations, holds, documentation', color: 'text-teal-500' },
  { id: 'billing', icon: <DollarSign size={18} />, label: 'Invoice / Billing', desc: 'Billing inquiries, disputes, payment', color: 'text-orange-500' },
  { id: 'other', icon: <HelpCircle size={18} />, label: 'Other Issues', desc: 'General questions, misc. requests', color: 'text-gray-500' },
]

// ─── Sample AI analysis ──────────────────────────────────────────────────────
const SAMPLE_ANALYSIS: AIAnalysis = {
  subject: 'Order ORD-5521 fulfillment failure - inventory allocation issue for SKU-A100 & SKU-B200',
  priority: 'High',
  relatedType: 'Sales Order',
  relatedId: 'ORD-5521',
  issueCategory: 'Inventory / Fulfillment',
  issueSummary: 'The request is about an order fulfillment failure where inventory shows as available but the system cannot allocate stock for shipment. This typically indicates an inventory lock or allocation conflict.',
  detectedRecords: ['Sales Order: ORD-5521', 'SKU: SKU-A100, SKU-B200', 'Warehouse: Valley View'],
  missingInfo: ['Expected delivery date not provided', 'Screenshot of the error message recommended', 'Confirm if partial fulfillment is acceptable'],
  suggestedRouting: 'Customer Service \u2192 Inventory Team \u2192 Warehouse Support',
  recommendedAction: 'Please verify if there are any pending allocations or holds on SKU-A100 and SKU-B200 at Valley View. Check if other orders have reserved the available stock.',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SubmitRequestPage() {
  const navigate = useNavigate()

  // Step state
  const [step, setStep] = useState(1) // 1: select topic, 2: fill details, 3: confirm
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // Form state
  const [email, setEmail] = useState('yujuan.wang@item.com')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [relatedType, setRelatedType] = useState('')
  const [relatedId, setRelatedId] = useState('')

  // AI state
  const [aiRunning, setAiRunning] = useState(false)
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null)
  const [aiApplied, setAiApplied] = useState(false)
  const [aiSkipped, setAiSkipped] = useState(false)
  const [autoAnalyzeTimer, setAutoAnalyzeTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // VAS state
  const [showMoreServices, setShowMoreServices] = useState(false)
  const [serviceModal, setServiceModal] = useState<string | null>(null)
  const [serviceEnabled, setServiceEnabled] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'info' | 'card' | 'success'>('info')

  // AI Query state (right panel)
  const [aiQuery, setAiQuery] = useState('')
  const [aiQueryLoading, setAiQueryLoading] = useState(false)
  const [aiQueryResult, setAiQueryResult] = useState('')

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return
    setAiQueryLoading(true)
    setAiQueryResult('')
    setTimeout(() => {
      setAiQueryResult('Based on system records, Order ORD-5521 has 2 SKUs (SKU-A100: 48 units, SKU-B200: 120 units) showing available inventory at Valley View warehouse. However, SKU-A100 has 45 units reserved by Order ORD-5489 (pending shipment), leaving only 3 units actually available. This allocation conflict is preventing fulfillment. Recommended action: release hold on ORD-5489 or source from alternate warehouse.')
      setAiQueryLoading(false)
    }, 1500)
  }

  // Auto-analyze when description changes (debounced)
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (aiSkipped) return
    if (autoAnalyzeTimer) clearTimeout(autoAnalyzeTimer)
    // Re-analyze if description changes (always re-trigger for demo)
    if (value.trim().length > 30) {
      setAiApplied(false)
      const timer = setTimeout(() => {
        runAnalysis(value)
      }, 1500)
      setAutoAnalyzeTimer(timer)
    } else {
      // Clear AI result if description is too short
      setAiResult(null)
    }
  }

  const runAnalysis = (desc?: string) => {
    setAiRunning(true)
    setAiApplied(false)
    const text = desc || description
    // Generate dynamic AI result based on description content
    setTimeout(() => {
      const extractedId = text.match(/ORD-\d+|order\s+(\w+-\d+)/i)?.[0]?.replace(/order\s+/i, '') || 'ORD-5521'
      const extractedSku = text.match(/SKU-\w+/gi) || ['SKU-A100', 'SKU-B200']
      const hasWarehouse = /warehouse|valley view|seabrook/i.test(text)
      const result: AIAnalysis = {
        subject: `Order ${extractedId} fulfillment failure - inventory allocation issue for ${extractedSku.slice(0, 2).join(' & ')}`,
        priority: /urgent|critical|immediately/i.test(text) ? 'Urgent' : /cannot|fail|error/i.test(text) ? 'High' : 'Medium',
        relatedType: /order|ORD/i.test(text) ? 'Sales Order' : /shipment|ship/i.test(text) ? 'Shipment' : /invoice|bill/i.test(text) ? 'Invoice / Billing' : 'Sales Order',
        relatedId: extractedId,
        issueCategory: /inventory|stock|SKU/i.test(text) ? 'Inventory / Fulfillment' : /ship|deliver/i.test(text) ? 'Shipping / Delivery' : 'General',
        issueSummary: `The request is about an order fulfillment failure where inventory shows as available but the system cannot allocate stock for shipment. This typically indicates an inventory lock or allocation conflict.`,
        detectedRecords: [`Sales Order: ${extractedId}`, `SKU: ${extractedSku.join(', ')}`, ...(hasWarehouse ? ['Warehouse: Valley View'] : [])],
        missingInfo: [
          ...(!hasWarehouse ? ['Warehouse location is missing'] : []),
          'Expected delivery date not provided',
          'Screenshot of the error message recommended',
          'Confirm if partial fulfillment is acceptable',
        ].filter(Boolean),
        suggestedRouting: 'Customer Service \u2192 Inventory Team \u2192 Warehouse Support',
        recommendedAction: `Please verify if there are any pending allocations or holds on ${extractedSku.join(' and ')} at ${hasWarehouse ? 'Valley View' : 'the specified warehouse'}. Check if other orders have reserved the available stock.`,
      }
      setAiResult(result)
      setAiRunning(false)
    }, 1200)
  }

  const handleAnalyze = () => {
    if (!description.trim()) return
    setAiSkipped(false)
    runAnalysis()
  }

  const handleSkipAI = () => {
    setAiSkipped(true)
    setAiResult(null)
    setAiRunning(false)
    if (autoAnalyzeTimer) clearTimeout(autoAnalyzeTimer)
  }

  const handleApplySuggestions = () => {
    if (!aiResult) return
    setSubject(aiResult.subject)
    setPriority(aiResult.priority)
    setRelatedType(aiResult.relatedType)
    setRelatedId(aiResult.relatedId)
    setAiApplied(true)
  }

  const handleNextFromStep1 = () => {
    if (selectedTopic) setStep(2)
  }

  const topicLabel = TOPICS.find(t => t.id === selectedTopic)?.label || ''

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <button onClick={() => navigate('/support/requests')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to My Requests</button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Submit a Request</h1>
      <p className="text-sm text-gray-500 mb-5">Fill in the details below and we'll get back to you as soon as possible.</p>

      {/* Step indicator */}
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-2 flex-1">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
        </div>
      </div>
      <div className="flex justify-between text-xs mb-8">
        <span className={step === 1 ? 'text-primary-600 font-semibold' : 'text-gray-400'}>Select Type</span>
        <span className={step === 2 ? 'text-primary-600 font-semibold' : 'text-gray-400'}>Fill Details</span>
        <span className={step === 3 ? 'text-primary-600 font-semibold' : 'text-gray-400'}>Confirm & Submit</span>
      </div>

      {/* ═══ STEP 1: Select Topic ═══ */}
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Select the type of issue you're experiencing so we can route your request efficiently:</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {TOPICS.map(topic => (
              <button key={topic.id} onClick={() => setSelectedTopic(topic.id)}
                className={`flex items-start gap-3 p-4 border rounded-xl text-left transition-all ${
                  selectedTopic === topic.id ? 'border-primary-300 bg-primary-50 ring-1 ring-primary-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <span className={topic.color}>{topic.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{topic.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{topic.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => navigate('/support/requests')} className="text-sm text-gray-500">Cancel</button>
            <button onClick={handleNextFromStep1} disabled={!selectedTopic}
              className={`px-5 py-2 text-sm font-medium rounded-lg ${selectedTopic ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Next &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: Fill Details (with AI) ═══ */}
      {step === 2 && (
        <div className="flex gap-6">
          {/* Left: Form */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* VAS recommendation area */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs text-violet-700 font-medium flex items-center gap-1.5 mb-3">
                <Sparkles size={13} /> VAS Recommendation for "{topicLabel}" &middot; Smart Recommend &middot; {serviceEnabled ? '3/3' : '2/3'} Enabled
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span className="text-sm font-medium text-gray-800">Photo Request</span>
                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Enabled &middot; Ready to use</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    {serviceEnabled ? (
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    ) : (
                      <span className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-white text-[9px] font-bold">!</span>
                    )}
                    <span className="text-sm font-medium text-gray-800">SKU Inspection</span>
                    {serviceEnabled ? (
                      <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Enabled &middot; Ready to use</span>
                    ) : (
                      <span className="text-[10px] text-gray-500">Professional cargo inspection</span>
                    )}
                  </div>
                  {!serviceEnabled && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">$45</span>
                      <button onClick={() => setServiceModal('sku-inspection')} className="text-xs text-primary-600 font-medium hover:underline">Learn More</button>
                    </div>
                  )}
                </div>
                {showMoreServices && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-green-200">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <span className="text-sm font-medium text-gray-800">Inventory Audit Service</span>
                      <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Enabled &middot; Ready to use</span>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setShowMoreServices(!showMoreServices)} className="text-xs text-primary-600 hover:underline mt-3 block mx-auto">
                {showMoreServices ? 'Hide' : 'View more services (1)'}
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your email address <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              <p className="text-[10px] text-gray-400 mt-1">Your email is used solely to track this request and keep you updated.</p>
            </div>

            {/* Describe your issue (FIRST - before Subject) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Describe your issue <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={e => handleDescriptionChange(e.target.value)}
                  rows={5}
                  placeholder="Tell us what happened, including order number, SKU, warehouse, expected result, or any error message."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
                {/* Sample data fill button */}
                {!description && (
                  <button
                    onClick={() => {
                      const sample = 'My order ORD-5521 has two SKUs showing normal inventory, but after placing the order it cannot be fulfilled from the warehouse. The system shows available stock but fulfillment fails. Please help me check the inventory allocation for SKU-A100 and SKU-B200 at Valley View warehouse.'
                      setDescription(sample)
                      setAiSkipped(false)
                      setAiRunning(true)
                      setAiApplied(false)
                      setTimeout(() => { runAnalysis(sample) }, 100)
                    }}
                    className="absolute top-2 right-2 text-[10px] text-primary-500 hover:text-primary-700 bg-white border border-primary-200 px-2 py-1 rounded flex items-center gap-1 hover:bg-primary-50 transition-colors"
                    title="Fill sample description for testing"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                    Sample
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={!description.trim() || aiRunning}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    description.trim() && !aiRunning ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}>
                  {aiRunning ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {aiRunning ? 'Analyzing...' : 'Analyze & Autofill'}
                </button>
                <button onClick={handleSkipAI} className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Skip AI</button>
                <span className="text-[10px] text-gray-400 ml-auto">AI will extract key information from your description</span>
              </div>
            </div>

            {/* AI Extracted Information (appears after analysis) */}
            {aiResult && !aiApplied && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-violet-800 flex items-center gap-1.5"><Sparkles size={14} /> AI Extracted Information</p>
                  <span className="text-[9px] text-violet-500">Review and apply, or edit manually</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-violet-500 text-[10px] uppercase">Subject</p><p className="text-gray-800 font-medium">{aiResult.subject}</p></div>
                  <div><p className="text-violet-500 text-[10px] uppercase">Priority</p><p className="text-gray-800 font-medium">{aiResult.priority}</p></div>
                  <div><p className="text-violet-500 text-[10px] uppercase">Related Type</p><p className="text-gray-800 font-medium">{aiResult.relatedType}</p></div>
                  <div><p className="text-violet-500 text-[10px] uppercase">Related ID</p><p className="text-gray-800 font-medium">{aiResult.relatedId}</p></div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-violet-200">
                  <button onClick={handleApplySuggestions} className="px-3 py-1.5 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700">Apply Suggestions</button>
                  <button onClick={() => setAiApplied(true)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Edit Manually</button>
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary of your issue" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Priority + Related Type + Related ID */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                <div className="flex gap-1">
                  {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map(p => (
                    <button key={p} onClick={() => setPriority(p)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        priority === p ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Related Type</label>
                <select value={relatedType} onChange={e => setRelatedType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select...</option>
                  <option>Sales Order</option>
                  <option>Inbound Receipt</option>
                  <option>Outbound Order</option>
                  <option>Inventory</option>
                  <option>Shipment</option>
                  <option>Invoice / Billing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Related ID</label>
                <input type="text" value={relatedId} onChange={e => setRelatedId(e.target.value)} placeholder="e.g. ORD-5521" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center hover:border-primary-300 transition-colors cursor-pointer">
                <Paperclip size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500"><span className="text-primary-600 font-medium">Add file</span> or drop files here &middot; PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back</button>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/support/requests')} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setStep(3)} className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">Review & Submit</button>
              </div>
            </div>
          </div>

          {/* Right: AI Initial Analysis Panel */}
          {!aiSkipped && (
          <div className="w-80 shrink-0">
            <div className="sticky top-20">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 mb-4"><Sparkles size={13} className="text-primary-600" /> AI Initial Analysis</h3>

                {!aiResult && !aiRunning && (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sparkles size={16} className="text-gray-400" />
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Describe your issue and click "Analyze & Autofill" to get AI-powered suggestions.</p>
                  </div>
                )}

                {aiRunning && (
                  <div className="text-center py-6">
                    <Loader2 size={20} className="animate-spin text-primary-500 mx-auto mb-2" />
                    <p className="text-[11px] text-gray-500">Analyzing...</p>
                  </div>
                )}

                {aiResult && !aiRunning && (
                  <div className="space-y-3 text-[11px]">
                    <div><p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Issue Summary</p><p className="text-gray-700 leading-relaxed">{aiResult.issueSummary}</p></div>
                    <div><p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Detected Records</p>{aiResult.detectedRecords.map((r, i) => <p key={i} className="text-gray-700">{r}</p>)}</div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5 flex items-center gap-1"><AlertCircle size={9} className="text-amber-500" /> Missing Info</p>
                      <ul className="space-y-0.5">{aiResult.missingInfo.map((m, i) => <li key={i} className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">• {m}</li>)}</ul>
                    </div>
                    <div><p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Suggested Priority</p><span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{aiResult.priority}</span></div>
                    <div><p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Routing</p><p className="text-gray-700">{aiResult.suggestedRouting}</p></div>
                    <div><p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5 flex items-center gap-1"><Info size={9} className="text-blue-500" /> Action</p><p className="text-gray-700 leading-relaxed">{aiResult.recommendedAction}</p></div>
                    <div className="pt-2 border-t border-gray-100"><p className="text-[9px] text-gray-400 italic">AI suggestions are for reference only.</p></div>
                  </div>
                )}

                {/* AI Query Input */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-[9px] text-gray-400 uppercase font-semibold mb-2">Ask AI</p>
                  <div className="relative">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={e => setAiQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && aiQuery.trim()) handleAiQuery() }}
                      placeholder="e.g. Check inventory lock or allocation conflict"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[11px] pr-8 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button onClick={handleAiQuery} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                  {!aiQuery && !aiQueryResult && (
                    <button onClick={() => setAiQuery('Help me check if there is inventory lock or allocation conflict for this order')} className="text-[9px] text-primary-500 hover:text-primary-700 mt-1.5 flex items-center gap-0.5">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                      Try sample question
                    </button>
                  )}
                  {aiQueryLoading && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400"><Loader2 size={10} className="animate-spin" /> Querying...</div>
                  )}
                  {aiQueryResult && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-[11px] text-gray-700 leading-relaxed">
                      <p className="font-semibold text-blue-700 text-[10px] mb-1">AI Query Result:</p>
                      <p>{aiQueryResult}</p>
                      <button
                        onClick={() => setDescription(prev => prev + '\n\n[AI Suggestion] ' + aiQueryResult)}
                        className="mt-2 text-[10px] text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 bg-white border border-primary-200 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add to Description
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ═══ STEP 3: Confirm & Submit ═══ */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h2>
            <p className="text-sm text-gray-500">Your request has been submitted and assigned ticket number <span className="font-semibold text-gray-800">WI-012</span>.</p>
            <p className="text-xs text-gray-400 mt-1">A confirmation email has been sent to {email}.</p>
          </div>

          {/* Summary card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Request Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><p className="text-gray-400 uppercase text-[10px]">Subject</p><p className="text-gray-800 font-medium">{subject || 'N/A'}</p></div>
              <div><p className="text-gray-400 uppercase text-[10px]">Priority</p><p className="text-gray-800 font-medium">{priority}</p></div>
              <div><p className="text-gray-400 uppercase text-[10px]">Related Type</p><p className="text-gray-800 font-medium">{relatedType || 'N/A'}</p></div>
              <div><p className="text-gray-400 uppercase text-[10px]">Related ID</p><p className="text-gray-800 font-medium">{relatedId || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-gray-400 uppercase text-[10px]">Description</p><p className="text-gray-700 leading-relaxed mt-1">{description.slice(0, 200)}{description.length > 200 ? '...' : ''}</p></div>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold text-blue-700 mb-2">What happens next?</p>
            <ol className="text-xs text-blue-600/80 space-y-1.5 list-decimal list-inside">
              <li>Our support team will review your request within 2 business hours</li>
              <li>You will receive email updates on status changes</li>
              <li>Track progress anytime from My Requests page</li>
            </ol>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/support/requests')} className="px-5 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">View My Requests</button>
            <button onClick={() => { setStep(1); setDescription(''); setSubject(''); setAiResult(null); setAiApplied(false) }} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Submit Another Request</button>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {serviceModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setServiceModal(null); setPaymentStep('info') }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="bg-primary-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2"><Sparkles size={14} /> Enable Service</h3>
              <button onClick={() => { setServiceModal(null); setPaymentStep('info') }} className="text-white/70 hover:text-white text-lg">&times;</button>
            </div>
            <div className="p-6">
              {paymentStep === 'info' && (
                <>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">SKU Inspection</h4>
                  <p className="text-xs text-gray-500 mb-4">Professional cargo inspection, quality assurance guaranteed</p>
                  <p className="text-sm text-gray-700 mb-4">Professional inspectors will conduct systematic inspections on designated SKUs, providing detailed reports including quantity verification, packaging status, and visual inspection.</p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Service Benefits:</p>
                    <ul className="text-xs text-gray-600 space-y-1.5">
                      <li className="flex items-center gap-2"><span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>Reduce cargo loss rate</li>
                      <li className="flex items-center gap-2"><span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>Identify issues early</li>
                      <li className="flex items-center gap-2"><span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>Provide evidence for cargo claims</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Service Fee</p>
                      <p className="text-[10px] text-gray-400">Per inspection, per container</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">$45</p>
                      <p className="text-[10px] text-gray-400">Usage-based billing</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Payment Method</p>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-xs"><input type="radio" name="payment" className="text-primary-600" /> Account Balance</label>
                      <label className="flex items-center gap-1.5 text-xs"><input type="radio" name="payment" defaultChecked className="text-primary-600" /> Monthly Invoice</label>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 text-[11px] text-gray-600 mb-5">
                    <input type="checkbox" defaultChecked className="rounded text-primary-600 mt-0.5" />
                    <span>I have read and agree to the <span className="text-primary-600 underline cursor-pointer">Service Agreement</span>. Service will be activated upon confirmation.</span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => { setServiceModal(null); setPaymentStep('info') }} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => setPaymentStep('card')} className="flex-1 py-2.5 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Confirm & Pay $45</button>
                  </div>
                </>
              )}

              {paymentStep === 'card' && (
                <>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Payment Details</h4>
                  <p className="text-xs text-gray-500 mb-4">Complete payment to activate the service</p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700">SKU Inspection Service</span>
                    <span className="text-lg font-bold text-gray-900">$45.00</span>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                      <input type="text" defaultValue="4242 4242 4242 4242" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                        <input type="text" defaultValue="12/28" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                        <input type="text" defaultValue="***" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Cardholder Name</label>
                      <input type="text" defaultValue="YUJUAN WANG" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setPaymentStep('info')} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Back</button>
                    <button onClick={() => { setPaymentStep('success'); setTimeout(() => { setServiceEnabled(true); setPaymentStep('info'); setServiceModal(null) }, 3000) }} className="flex-1 py-2.5 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Pay $45.00</button>
                  </div>
                </>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h4 className="text-lg font-bold text-green-700 mb-2">Payment Successful!</h4>
                  <p className="text-sm text-gray-600 mb-1">SKU Inspection service has been activated.</p>
                  <p className="text-xs text-gray-400">Transaction ID: TXN-2026-0706-4521</p>
                  <p className="text-xs text-gray-400 mt-1">Amount: $45.00 &middot; Method: Visa ****4242</p>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-[11px] text-green-700">The service is now ready to use for this request and all future requests.</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3">Closing automatically...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
