import { useState } from 'react'
import { FileText, Upload, X, Image, Link2, StickyNote, Download, Eye } from 'lucide-react'
import type { WorkItem, WorkItemEvidence } from '../../../types/workItem'

const TYPE_ICONS: Record<WorkItemEvidence['type'], React.ReactNode> = {
  file: <FileText size={14} className="text-blue-500" />,
  screenshot: <Image size={14} className="text-green-500" />,
  photo: <Image size={14} className="text-green-500" />,
  link: <Link2 size={14} className="text-purple-500" />,
  note: <StickyNote size={14} className="text-amber-500" />,
}

const TYPE_LABELS: Record<WorkItemEvidence['type'], string> = {
  file: 'Document / File',
  screenshot: 'Screenshot / Photo',
  photo: 'Photo',
  link: 'External Link',
  note: 'Text Note',
}

interface Props {
  item: WorkItem
  onUpload: (evidence: Omit<WorkItemEvidence, 'id'>) => void
}

interface UploadForm {
  type: WorkItemEvidence['type']
  label: string
  content: string
  url: string
}

export default function EvidencePanel({ item, onUpload }: Props) {
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState<UploadForm>({ type: 'file', label: '', content: '', url: '' })
  const [viewNote, setViewNote] = useState<WorkItemEvidence | null>(null)

  const handleSubmit = () => {
    if (!form.label.trim()) return
    onUpload({
      type: form.type,
      label: form.label.trim(),
      content: form.content.trim() || undefined,
      url: form.url.trim() || undefined,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
    })
    setForm({ type: 'file', label: '', content: '', url: '' })
    setShowUpload(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            Evidence & Supporting Documents
          </span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
            {item.evidence.length}
          </span>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Upload size={12} />
          Upload
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-blue-800">Add Supporting Document</p>
            <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as WorkItemEvidence['type'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {(Object.entries(TYPE_LABELS) as [WorkItemEvidence['type'], string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Label / Name *</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                placeholder="e.g., AI Detection Report, Invoice scan…"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {(form.type === 'note') && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Note Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="Enter your note content…"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none resize-none"
              />
            </div>
          )}

          {(form.type === 'link') && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://…"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              />
            </div>
          )}

          {(form.type === 'file' || form.type === 'screenshot') && (
            <div className="mb-3 border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
              <Upload size={20} className="mx-auto text-blue-300 mb-1" />
              <p className="text-xs text-gray-500">Click to select file, or drag & drop</p>
              <p className="text-xs text-gray-400 mt-0.5">Supported: PDF, PNG, JPG, XLS, DOCX</p>
              <input type="file" className="hidden" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button onClick={() => setShowUpload(false)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.label.trim()}
              className="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40"
            >
              Add Document
            </button>
          </div>
        </div>
      )}

      {/* Evidence list */}
      <div className="divide-y divide-gray-50">
        {item.evidence.length === 0 && !showUpload && (
          <div className="py-8 text-center text-gray-400">
            <FileText size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No documents uploaded yet</p>
            <p className="text-xs mt-0.5">Upload supporting evidence for this item</p>
          </div>
        )}
        {item.evidence.map((e) => (
          <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 group">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              {TYPE_ICONS[e.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{e.label}</p>
              <p className="text-xs text-gray-400">
                {TYPE_LABELS[e.type]} · Uploaded by {e.uploadedBy} ·{' '}
                {new Date(e.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {(e.type === 'note' || e.content) && (
                <button
                  onClick={() => setViewNote(e)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="View"
                >
                  <Eye size={13} />
                </button>
              )}
              {e.url && (
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                  title="Open link"
                >
                  <Link2 size={13} />
                </a>
              )}
              <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title="Download">
                <Download size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note viewer modal */}
      {viewNote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {TYPE_ICONS[viewNote.type]}
                <span className="text-sm font-semibold text-gray-800">{viewNote.label}</span>
              </div>
              <button onClick={() => setViewNote(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{viewNote.content}</p>
              <p className="text-xs text-gray-400 mt-4">
                Added by {viewNote.uploadedBy} · {new Date(viewNote.uploadedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
