import { useState } from 'react'
import { X, Send, Bell, Mail, MessageSquare, CheckCircle2 } from 'lucide-react'

interface Props {
  itemId: string
  itemTitle: string
  customerCode?: string
  onClose: () => void
}

const TEMPLATES = [
  { id: 'update', label: 'General Status Update', body: (title: string) => `We're writing to provide you with an update on your work item "${title}".\n\nCurrent status: In Progress.\nOur team is actively working on this and will provide a further update within 24 hours.\n\nFor questions, please reply directly to this message or contact your account manager.` },
  { id: 'resolution', label: 'Resolution Confirmed', body: (title: string) => `We're pleased to confirm that the following item has been resolved:\n\n"${title}"\n\nPlease review the resolution details in your portal and confirm that everything is in order. If you have any remaining concerns, please let us know within 48 hours.` },
  { id: 'action-required', label: 'Action Required', body: (title: string) => `Action required regarding: "${title}"\n\nWe need your response or approval to proceed. Please log in to your portal and review the pending item. Your response is required within 3 business days to avoid delays.` },
  { id: 'document-request', label: 'Document Request', body: (title: string) => `We're working on resolving "${title}" and need your assistance.\n\nPlease provide the following documents at your earliest convenience:\n• [List documents here]\n\nThese are required before we can proceed. Please upload them via the portal or reply to this message.` },
  { id: 'custom', label: 'Custom Message', body: () => '' },
]

type Channel = 'portal' | 'email' | 'both'

export default function NotifyModal({ itemTitle, customerCode, onClose }: Props) {
  const [template, setTemplate] = useState('update')
  const [channel, setChannel] = useState<Channel>('both')
  const [recipient, setRecipient] = useState(customerCode ?? '')
  const [subject, setSubject] = useState(`Update: ${itemTitle}`)
  const [body, setBody] = useState(TEMPLATES[0].body(itemTitle))
  const [sent, setSent] = useState(false)

  const handleTemplateChange = (id: string) => {
    setTemplate(id)
    const t = TEMPLATES.find((t) => t.id === id)!
    setBody(t.body(itemTitle))
    if (id === 'action-required') setSubject(`Action Required: ${itemTitle}`)
    else if (id === 'resolution') setSubject(`Resolved: ${itemTitle}`)
    else if (id === 'document-request') setSubject(`Documents Needed: ${itemTitle}`)
    else setSubject(`Update: ${itemTitle}`)
  }

  const handleSend = () => {
    setSent(true)
  }

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Notification Sent</h3>
          <p className="text-sm text-gray-500 mb-2">
            Your message has been sent to <strong>{recipient}</strong> via {channel === 'both' ? 'portal and email' : channel}.
          </p>
          <p className="text-xs text-gray-400 mb-6">A copy of this notification has been logged in the activity history.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-primary-600" />
            <h2 className="text-base font-semibold text-gray-900">Send Customer Notification</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Recipient */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Recipient (Customer Code)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. FASHIONWAVE, TECHCORE"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Channel */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Notification Channel</label>
            <div className="flex gap-2">
              {[
                { key: 'portal', label: 'Portal Only', icon: <MessageSquare size={13} /> },
                { key: 'email', label: 'Email Only', icon: <Mail size={13} /> },
                { key: 'both', label: 'Portal + Email', icon: <Bell size={13} /> },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setChannel(opt.key as Channel)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                    channel === opt.key
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.icon}{opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template selector */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message Template</label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={7}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>

          <p className="text-xs text-gray-400">
            This notification will be logged in the item's activity history with timestamp and recipient.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!recipient.trim() || !body.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40"
          >
            <Send size={14} />
            Send Notification
          </button>
        </div>
      </div>
    </div>
  )
}
