import { useState } from 'react'
import {
  AlertTriangle,
  Camera,
  Upload,
  FileText,
  X,
  Image,
  Link2,
  StickyNote,
  Download,
  Eye,
  Clock,
  Building2,
  User,
  Tag,
  CheckCircle2,
} from 'lucide-react'
import type { WorkItem, DamageScenarioData, WorkItemEvidence, RecommendedAction, ServiceId } from '../../../types/workItem'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../../types/workItem'
import { useCollaboration } from '../../../context/CollaborationContext'
import RecommendedActions from '../components/RecommendedActions'
import ServiceUpsellModal from '../components/ServiceUpsellModal'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  item: WorkItem
  onClose: () => void
}

// ─── Evidence type helpers ────────────────────────────────────────────────────

type EvidenceType = WorkItemEvidence['type']

const EVIDENCE_TYPE_ICONS: Record<EvidenceType, React.ReactNode> = {
  file: <FileText size={14} className="text-blue-500" />,
  screenshot: <Image size={14} className="text-green-500" />,
  link: <Link2 size={14} className="text-purple-500" />,
  note: <StickyNote size={14} className="text-amber-500" />,
  photo: <Camera size={14} className="text-red-500" />,
}

const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  file: '文件',
  screenshot: '截图',
  link: '链接',
  note: '备注',
  photo: '照片',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-xs text-gray-700 font-medium text-right break-all">{value}</span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DamageDetail({ item, onClose }: Props) {
  const { purchasedServices, addEvidence, updateStatus } = useCollaboration()
  const scenarioData = item.scenarioData as DamageScenarioData | undefined

  // ── Photo upload state ──────────────────────────────────────────────────────
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  // ── Evidence upload state ───────────────────────────────────────────────────
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false)
  const [evidenceForm, setEvidenceForm] = useState<{
    type: EvidenceType
    label: string
    content: string
    url: string
  }>({ type: 'file', label: '', content: '', url: '' })
  const [viewEvidence, setViewEvidence] = useState<WorkItemEvidence | null>(null)

  // ── Service upsell modal state ──────────────────────────────────────────────
  const [upsellServiceId, setUpsellServiceId] = useState<ServiceId | null>(null)

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleActionClick(action: RecommendedAction) {
    if (action.serviceId && !purchasedServices.has(action.serviceId)) {
      setUpsellServiceId(action.serviceId)
    }
  }

  function handlePhotoUpload() {
    addEvidence(item.id, {
      type: 'photo',
      label: `损坏照片 ${new Date().toLocaleDateString('zh-CN')}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
    })
    setShowPhotoUpload(false)
  }

  function handleEvidenceSubmit() {
    if (!evidenceForm.label.trim()) return
    addEvidence(item.id, {
      type: evidenceForm.type,
      label: evidenceForm.label.trim(),
      content: evidenceForm.content.trim() || undefined,
      url: evidenceForm.url.trim() || undefined,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
    })
    setEvidenceForm({ type: 'file', label: '', content: '', url: '' })
    setShowEvidenceUpload(false)
  }

  function handleCloseItem() {
    updateStatus(item.id, 'Closed', '客户手动关闭')
    onClose()
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const damagedQty = scenarioData?.damagedQty ?? 0
  const photoEvidence = item.evidence.filter((e) => e.type === 'photo')
  const photoCount = scenarioData?.photoCount ?? photoEvidence.length
  const recommendedActions = item.recommendedActions ?? []

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-base font-bold text-gray-900">货物损坏调查</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                {item.status}
              </span>
              <span className={`text-xs font-semibold ${PRIORITY_COLORS[item.priority]}`}>
                {item.priority}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-snug">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">#{item.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-1"
          aria-label="关闭"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-6 p-6 max-w-6xl mx-auto">

          {/* ── Main column ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* SKU Info Card */}
            {scenarioData && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={14} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">SKU 信息</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-gray-400 mb-0.5">SKU ID</p>
                    <p className="text-sm font-semibold text-gray-800">{scenarioData.skuId}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 col-span-1 sm:col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">SKU 名称</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{scenarioData.skuName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-gray-400 mb-0.5">本批总件数</p>
                    <p className="text-sm font-semibold text-gray-800">{scenarioData.totalQty.toLocaleString()} 件</p>
                  </div>
                </div>

                {/* Big visual — damage count card */}
                <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle size={26} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-red-700 leading-none">
                      {damagedQty} 件
                    </p>
                    <p className="text-sm font-semibold text-red-600 mt-1">疑似损坏</p>
                    <p className="text-xs text-red-400 mt-0.5">
                      占本批次 {scenarioData.totalQty > 0 ? ((damagedQty / scenarioData.totalQty) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                {/* Warehouse note */}
                {scenarioData.warehouseNote && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">仓库说明</p>
                    <p className="text-sm text-amber-900 leading-relaxed">{scenarioData.warehouseNote}</p>
                  </div>
                )}
              </div>
            )}

            {/* Photo Upload Section */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Camera size={15} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">上传损坏照片</span>
                  {photoCount > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {photoCount} 张
                    </span>
                  )}
                </div>
                {photoCount > 0 && (
                  <button
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Upload size={12} />
                    继续上传
                  </button>
                )}
              </div>

              <div className="p-5">
                {photoCount === 0 ? (
                  /* Empty state */
                  <div>
                    {showPhotoUpload ? (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-red-200 rounded-xl p-8 text-center bg-red-50">
                          <Camera size={32} className="mx-auto text-red-300 mb-2" />
                          <p className="text-sm font-medium text-red-700 mb-1">上传损坏照片</p>
                          <p className="text-xs text-red-400 mb-4">支持 JPG、PNG、HEIC 格式</p>
                          <button
                            onClick={handlePhotoUpload}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Upload size={14} />
                            选择照片文件
                          </button>
                        </div>
                        <button
                          onClick={() => setShowPhotoUpload(false)}
                          className="w-full text-sm text-gray-400 hover:text-gray-600 py-1 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-red-300 transition-colors">
                        <Camera size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-medium text-gray-500 mb-1">暂无损坏照片</p>
                        <p className="text-xs text-gray-400 mb-4">上传照片可作为损坏证据，加快理赔处理</p>
                        <button
                          onClick={() => setShowPhotoUpload(true)}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Camera size={14} />
                          点击上传照片
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Has photos */
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">已上传 {photoCount} 张损坏照片</p>
                        <p className="text-xs text-green-600">照片已记录，可用于损坏调查和理赔流程</p>
                      </div>
                    </div>
                    {showPhotoUpload && (
                      <div className="border-2 border-dashed border-red-200 rounded-xl p-6 text-center bg-red-50">
                        <Camera size={28} className="mx-auto text-red-300 mb-2" />
                        <p className="text-sm text-red-600 mb-3">继续添加更多照片</p>
                        <button
                          onClick={handlePhotoUpload}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Upload size={13} />
                          选择照片文件
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Photo service note */}
                <p className="mt-4 text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-3">
                  拍照服务可由仓库协助完成，确保照片角度完整、记录清晰
                </p>
              </div>
            </div>

            {/* Evidence Panel */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">证据与文件</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {item.evidence.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowEvidenceUpload(!showEvidenceUpload)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Upload size={12} />
                  上传
                </button>
              </div>

              {/* Evidence upload form */}
              {showEvidenceUpload && (
                <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-blue-800">添加证据文件</p>
                    <button onClick={() => setShowEvidenceUpload(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">类型</label>
                      <select
                        value={evidenceForm.type}
                        onChange={(e) => setEvidenceForm((p) => ({ ...p, type: e.target.value as EvidenceType }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        {(Object.entries(EVIDENCE_TYPE_LABELS) as [EvidenceType, string][]).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">名称 *</label>
                      <input
                        type="text"
                        value={evidenceForm.label}
                        onChange={(e) => setEvidenceForm((p) => ({ ...p, label: e.target.value }))}
                        placeholder="例如：AI 检测报告、发票扫描件…"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {evidenceForm.type === 'note' && (
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">备注内容</label>
                      <textarea
                        value={evidenceForm.content}
                        onChange={(e) => setEvidenceForm((p) => ({ ...p, content: e.target.value }))}
                        placeholder="请输入备注内容…"
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none resize-none"
                      />
                    </div>
                  )}

                  {evidenceForm.type === 'link' && (
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                      <input
                        type="text"
                        value={evidenceForm.url}
                        onChange={(e) => setEvidenceForm((p) => ({ ...p, url: e.target.value }))}
                        placeholder="https://…"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                      />
                    </div>
                  )}

                  {(evidenceForm.type === 'file' || evidenceForm.type === 'screenshot' || evidenceForm.type === 'photo') && (
                    <div className="mb-3 border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                      <Upload size={20} className="mx-auto text-blue-300 mb-1" />
                      <p className="text-xs text-gray-500">点击选择文件，或拖拽上传</p>
                      <p className="text-xs text-gray-400 mt-0.5">支持 PDF、PNG、JPG、XLS、DOCX</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowEvidenceUpload(false)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleEvidenceSubmit}
                      disabled={!evidenceForm.label.trim()}
                      className="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40"
                    >
                      添加
                    </button>
                  </div>
                </div>
              )}

              {/* Evidence list */}
              <div className="divide-y divide-gray-50">
                {item.evidence.length === 0 && !showEvidenceUpload && (
                  <div className="py-8 text-center text-gray-400">
                    <FileText size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">暂无证据文件</p>
                    <p className="text-xs mt-0.5">上传文件以支持此工单的调查处理</p>
                  </div>
                )}
                {item.evidence.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      {EVIDENCE_TYPE_ICONS[ev.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{ev.label}</p>
                      <p className="text-xs text-gray-400">
                        {EVIDENCE_TYPE_LABELS[ev.type]} · {ev.uploadedBy} · {formatDate(ev.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(ev.type === 'note' || ev.content) && (
                        <button
                          onClick={() => setViewEvidence(ev)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                          title="查看"
                        >
                          <Eye size={13} />
                        </button>
                      )}
                      {ev.url && (
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                          title="打开链接"
                        >
                          <Link2 size={13} />
                        </a>
                      )}
                      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500" title="下载">
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            {recommendedActions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <RecommendedActions
                  actions={recommendedActions}
                  purchasedServices={purchasedServices}
                  onActionClick={handleActionClick}
                />
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <div className="w-64 shrink-0 space-y-4">

            {/* Metadata card */}
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">工单详情</p>
              <MetaRow label="工单 ID" value={item.id} />
              <MetaRow
                label="状态"
                value={
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                    {item.status}
                  </span>
                }
              />
              <MetaRow label="负责人" value={item.owner} />
              {item.assignee && <MetaRow label="经办人" value={item.assignee} />}
              {item.customerCode && <MetaRow label="客户" value={item.customerCode} />}
              {item.warehouseCode && <MetaRow label="仓库" value={item.warehouseCode} />}
              {item.relatedObjectId && (
                <MetaRow
                  label={item.relatedObjectType ?? '关联对象'}
                  value={item.relatedObjectId}
                />
              )}
            </div>

            {/* SLA card */}
            {item.slaDeadline && (
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock size={13} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SLA 截止时间</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{formatDate(item.slaDeadline)}</p>
                {(() => {
                  const remaining = new Date(item.slaDeadline).getTime() - Date.now()
                  const hoursLeft = Math.floor(remaining / 3_600_000)
                  if (remaining <= 0) {
                    return <p className="text-xs text-red-600 font-medium mt-0.5">已超时</p>
                  }
                  if (hoursLeft < 6) {
                    return <p className="text-xs text-orange-600 font-medium mt-0.5">剩余 {hoursLeft} 小时</p>
                  }
                  return <p className="text-xs text-gray-400 mt-0.5">剩余约 {hoursLeft} 小时</p>
                })()}
              </div>
            )}

            {/* Billing card */}
            {item.isChargeable && (
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">费用信息</p>
                {item.estimatedFee !== undefined && (
                  <MetaRow
                    label="预估费用"
                    value={`${item.currency ?? 'USD'} ${item.estimatedFee.toLocaleString()}`}
                  />
                )}
                {item.billingStatus && (
                  <MetaRow label="账单状态" value={item.billingStatus} />
                )}
              </div>
            )}

            {/* Source / timing */}
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Building2 size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">来源 & 时间</p>
              </div>
              <MetaRow label="来源" value={item.source} />
              <MetaRow
                label="创建时间"
                value={new Date(item.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              />
              <MetaRow
                label="最后更新"
                value={new Date(item.updatedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              />
              {item.isAgentGenerated && item.agentName && (
                <MetaRow
                  label="AI 代理"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <User size={10} />
                      {item.agentName}
                    </span>
                  }
                />
              )}
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">标签</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick action — close item */}
            <button
              onClick={handleCloseItem}
              disabled={item.status === 'Closed' || item.status === 'Cancelled'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={15} />
              关闭此工单
            </button>
          </div>
        </div>
      </div>

      {/* ── Evidence note viewer modal ──────────────────────────────────────── */}
      {viewEvidence && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {EVIDENCE_TYPE_ICONS[viewEvidence.type]}
                <span className="text-sm font-semibold text-gray-800">{viewEvidence.label}</span>
              </div>
              <button onClick={() => setViewEvidence(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{viewEvidence.content}</p>
              <p className="text-xs text-gray-400 mt-4">
                由 {viewEvidence.uploadedBy} 上传 · {formatDate(viewEvidence.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Service upsell modal ────────────────────────────────────────────── */}
      {upsellServiceId && (
        <ServiceUpsellModal
          serviceId={upsellServiceId}
          onClose={() => setUpsellServiceId(null)}
          onPurchased={() => setUpsellServiceId(null)}
        />
      )}
    </div>
  )
}
