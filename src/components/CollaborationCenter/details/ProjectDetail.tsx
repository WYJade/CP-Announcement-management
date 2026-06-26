import { useState } from 'react'
import {
  CheckCircle, Circle, Users, Send,
  MessageSquare, ChevronRight, AlertCircle,
  Upload, FileText, Package, User, Building2,
  CalendarDays, DollarSign, CheckSquare, XCircle,
} from 'lucide-react'
import { useCollaboration } from '../../../context/CollaborationContext'
import type { WorkItem, ProjectData, ProjectStep } from '../../../types/workItem'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectDetailProps {
  item: WorkItem
  onClose: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysFromNow(dateStr: string): number {
  const target = new Date(dateStr).setHours(0, 0, 0, 0)
  const today = new Date().setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'new-sku-launch': '新 SKU 上架',
  'packaging-change': '包装变更',
  'warehouse-project': '仓库项目',
  'fulfillment-project': '履约项目',
}

const ACTOR_BADGES: Record<ProjectStep['actor'], { label: string; color: string }> = {
  Customer: { label: '客户', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  Warehouse: { label: '仓库', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  Joint: { label: '双方', color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActorBadge({ actor }: { actor: ProjectStep['actor'] }) {
  const { label, color } = ACTOR_BADGES[actor]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}>
      {actor === 'Customer' && <User size={10} />}
      {actor === 'Warehouse' && <Building2 size={10} />}
      {actor === 'Joint' && <Users size={10} />}
      {label}
    </span>
  )
}

// ─── Timeline Step ────────────────────────────────────────────────────────────

function TimelineStep({
  step,
  isLast,
}: {
  step: ProjectStep
  isLast: boolean
}) {
  return (
    <div className="flex gap-4">
      {/* Left: icon + connector */}
      <div className="flex flex-col items-center">
        {/* Circle */}
        <div className="flex-shrink-0">
          {step.status === 'done' && (
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
              <CheckCircle size={18} className="text-white" />
            </div>
          )}
          {step.status === 'active' && (
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30" />
              <div className="relative w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{step.step}</span>
              </div>
            </div>
          )}
          {step.status === 'pending' && (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs font-semibold">{step.step}</span>
            </div>
          )}
        </div>
        {/* Connector */}
        {!isLast && (
          <div className={`w-0.5 flex-1 my-1 rounded-full min-h-[24px] ${
            step.status === 'done' ? 'bg-green-300' : 'bg-gray-200'
          }`} />
        )}
      </div>

      {/* Right: content */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        <div className={`rounded-xl border p-4 transition-all ${
          step.status === 'active'
            ? 'border-blue-300 bg-blue-50 shadow-sm'
            : step.status === 'done'
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-semibold leading-tight ${
              step.status === 'done' ? 'text-green-800' :
              step.status === 'active' ? 'text-blue-900' : 'text-gray-500'
            }`}>
              {step.title}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ActorBadge actor={step.actor} />
              {step.status === 'done' && (
                <span className="text-xs text-green-600 font-medium">已完成</span>
              )}
              {step.status === 'active' && (
                <span className="text-xs text-blue-600 font-semibold animate-pulse">进行中</span>
              )}
              {step.status === 'pending' && (
                <span className="text-xs text-gray-400">待处理</span>
              )}
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${
            step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {step.description}
          </p>

          {/* Completed date */}
          {step.status === 'done' && step.completedAt && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600">
              <CheckCircle size={11} />
              完成于 {formatDate(step.completedAt)}
            </div>
          )}

          {/* Notes callout */}
          {step.notes && step.status !== 'pending' && (
            <div className={`mt-3 rounded-lg px-3 py-2 text-xs flex items-start gap-2 ${
              step.status === 'active'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              <span>{step.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Current Step Action Area ─────────────────────────────────────────────────

function CurrentStepActions({
  projectType,
  activeStep,
  itemId,
}: {
  projectType: string
  activeStep: ProjectStep
  itemId: string
}) {
  const { addComment, updateStatus } = useCollaboration()
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [cartonSpec, setCartonSpec] = useState('')

  if (activeStep.actor === 'Warehouse') {
    return (
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-800">等待仓库处理中...</p>
          <p className="text-xs text-indigo-600 mt-0.5">本步骤由仓库团队负责执行，完成后将自动通知您</p>
        </div>
      </div>
    )
  }

  if (activeStep.actor === 'Joint') {
    return (
      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-purple-600" />
          <p className="text-sm font-semibold text-purple-800">双方需共同行动</p>
        </div>
        <p className="text-xs text-purple-600 mb-3">此步骤需要您和仓库团队各自完成相应操作，方可推进到下一阶段。</p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <User size={12} className="text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">客户：确认并反馈</span>
            <CheckCircle size={12} className="text-blue-400 ml-auto" />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
            <Building2 size={12} className="text-indigo-600" />
            <span className="text-xs text-indigo-700 font-medium">仓库：执行并确认</span>
            <Circle size={12} className="text-gray-300 ml-auto" />
          </div>
        </div>
      </div>
    )
  }

  // actor === 'Customer'
  return (
    <div className="rounded-xl border border-blue-300 bg-blue-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User size={15} className="text-blue-600" />
        <p className="text-sm font-bold text-blue-800">您的行动</p>
        <span className="text-xs text-blue-500">· 当前步骤需要您操作</span>
      </div>

      {/* packaging-change + approval step: approve/reject buttons */}
      {projectType === 'packaging-change' && activeStep.id === 'approval' && (
        <div>
          <p className="text-xs text-blue-700 mb-3">请查看仓库制作的样品照片，确认是否符合您的包装要求：</p>
          {submitted ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle size={14} />
              已提交审批结果，仓库将尽快处理
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addComment(itemId, {
                    author: '我（客户）',
                    role: 'Customer',
                    content: '样品确认通过，请开始批量翻包作业',
                    createdAt: new Date().toISOString(),
                    isInternal: false,
                  })
                  updateStatus(itemId, 'InProgress', '客户确认样品通过，批量作业开始')
                  setSubmitted(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <CheckCircle size={14} />
                确认样品通过
              </button>
              <button
                onClick={() => {
                  addComment(itemId, {
                    author: '我（客户）',
                    role: 'Customer',
                    content: '样品需要修改，请按照最新要求重新制作',
                    createdAt: new Date().toISOString(),
                    isInternal: false,
                  })
                  setSubmitted(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-lg transition-colors border border-red-200"
              >
                <XCircle size={14} />
                需要修改
              </button>
            </div>
          )}
        </div>
      )}

      {/* new-sku-launch + carton-spec step: form input */}
      {projectType === 'new-sku-launch' && activeStep.id === 'carton-spec' && (
        <div>
          <p className="text-xs text-blue-700 mb-3">请提供纸箱规格信息（尺寸、重量、每箱装量），仓库将据此确认存储方式：</p>
          {submitted ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle size={14} />
              纸箱规格已提交，仓库正在审核
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={cartonSpec}
                onChange={(e) => setCartonSpec(e.target.value)}
                placeholder="例：长 × 宽 × 高 = 60cm × 40cm × 30cm，毛重 8kg，每箱 12 件..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!cartonSpec.trim()) return
                    addComment(itemId, {
                      author: '我（客户）',
                      role: 'Customer',
                      content: `纸箱规格：${cartonSpec}`,
                      createdAt: new Date().toISOString(),
                      isInternal: false,
                    })
                    setSubmitted(true)
                  }}
                  disabled={!cartonSpec.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Upload size={13} />
                  提交纸箱规格
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <FileText size={12} />
                  上传规格文件
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Default: comment input */}
      {!(projectType === 'packaging-change' && activeStep.id === 'approval') &&
        !(projectType === 'new-sku-launch' && activeStep.id === 'carton-spec') && (
        <div>
          <p className="text-xs text-blue-700 mb-3">请在此留言或提供所需信息，推进当前步骤：</p>
          {submitted ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle size={14} />
              留言已发送
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请输入您的反馈或所需信息..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <button
                onClick={() => {
                  if (!comment.trim()) return
                  addComment(itemId, {
                    author: '我（客户）',
                    role: 'Customer',
                    content: comment,
                    createdAt: new Date().toISOString(),
                    isInternal: false,
                  })
                  setComment('')
                  setSubmitted(true)
                }}
                disabled={!comment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Send size={13} />
                发送
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectDetail({ item }: ProjectDetailProps) {
  const { addComment } = useCollaboration()
  const [newComment, setNewComment] = useState('')

  const projectData = item.scenarioData as ProjectData | undefined

  if (!projectData || !projectData.steps) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Package size={36} className="mx-auto mb-3 opacity-30" />
        <p>项目数据加载失败</p>
      </div>
    )
  }

  const { steps, targetDate, materials, projectType } = projectData
  const doneSteps = steps.filter((s) => s.status === 'done').length
  const totalSteps = steps.length
  const progressPct = Math.round((doneSteps / totalSteps) * 100)
  const activeStep = steps.find((s) => s.status === 'active')
  const daysLeft = daysFromNow(targetDate)
  const projectTypeLabel = PROJECT_TYPE_LABELS[projectType] ?? projectType

  const handleAddComment = () => {
    if (!newComment.trim()) return
    addComment(item.id, {
      author: '我（客户）',
      role: 'Customer',
      content: newComment,
      createdAt: new Date().toISOString(),
      isInternal: false,
    })
    setNewComment('')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* ── Project Overview ──────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          {/* Title + type badge */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {projectTypeLabel}
                </span>
                <span className="text-xs text-gray-400 font-mono">{item.id}</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 leading-snug">{item.title}</h1>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
            </div>
          </div>

          {/* Status bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                  进行中
                </span>
              </div>
              <span className="text-xs font-bold text-gray-700">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Date + participants row */}
          <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <CalendarDays size={14} className="text-gray-400" />
              <span>目标完成日期: <span className="font-semibold text-gray-800">{targetDate}</span></span>
              <span className={`text-xs font-medium ml-1 px-2 py-0.5 rounded-full ${
                daysLeft < 0 ? 'bg-red-100 text-red-600' :
                daysLeft <= 7 ? 'bg-orange-100 text-orange-600' :
                'bg-green-100 text-green-700'
              }`}>
                {daysLeft < 0 ? `已超期 ${Math.abs(daysLeft)} 天` :
                 daysLeft === 0 ? '今天截止' :
                 `距今 ${daysLeft} 天`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Users size={12} className="text-gray-400" />
                参与方：
              </span>
              {item.customerCode && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-medium">
                  {item.customerCode}
                </span>
              )}
              {item.warehouseCode && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium">
                  {item.warehouseCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Project Timeline ──────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-2">
            <ChevronRight size={15} className="text-indigo-500" />
            项目时间轴
            <span className="ml-auto text-xs font-normal text-gray-400">{doneSteps}/{totalSteps} 步已完成</span>
          </h2>

          <div>
            {steps.map((step, idx) => (
              <TimelineStep
                key={step.id}
                step={step}
                isLast={idx === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* ── Current Step Actions ──────────────────────────────────────────── */}
        {activeStep && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CheckSquare size={15} className="text-blue-500" />
              当前步骤操作
              <span className="text-xs font-normal text-gray-400 ml-1">— {activeStep.title}</span>
            </h2>
            <CurrentStepActions
              projectType={projectType}
              activeStep={activeStep}
              itemId={item.id}
            />
          </div>
        )}

        {/* ── Materials Checklist ───────────────────────────────────────────── */}
        {materials && materials.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <FileText size={15} className="text-gray-500" />
              所需材料清单
            </h2>
            <ul className="space-y-2">
              {materials.map((mat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-gray-300" />
                  </div>
                  {mat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Comments ─────────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <MessageSquare size={15} className="text-gray-500" />
            沟通记录
            <span className="text-xs font-normal text-gray-400 ml-1">({item.comments.length})</span>
          </h2>

          <div className="space-y-3 mb-4">
            {item.comments.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">暂无留言</p>
            )}
            {item.comments.map((c) => (
              <div
                key={c.id}
                className={`rounded-xl p-3 ${
                  c.role === 'Customer'
                    ? 'bg-blue-50 border border-blue-100'
                    : c.role === 'Warehouse'
                    ? 'bg-indigo-50 border border-indigo-100'
                    : c.role === 'Agent'
                    ? 'bg-violet-50 border border-violet-100'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    c.role === 'Customer' ? 'text-blue-700' :
                    c.role === 'Warehouse' ? 'text-indigo-700' : 'text-gray-600'
                  }`}>
                    {c.role === 'Customer' && <User size={11} />}
                    {c.role === 'Warehouse' && <Building2 size={11} />}
                    {c.author}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(c.createdAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="添加留言或提问..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm focus:outline-none resize-none"
            />
            <div className="flex items-center justify-end px-3 py-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Send size={12} />
                发送
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="lg:w-64 xl:w-72 space-y-4 flex-shrink-0">

        {/* Project summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">项目概要</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">项目类型</p>
              <span className="text-sm font-semibold text-gray-800">{projectTypeLabel}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">目标完成日</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{targetDate}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  daysLeft < 0 ? 'bg-red-100 text-red-600' :
                  daysLeft <= 7 ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-700'
                }`}>
                  {daysLeft < 0 ? `超 ${Math.abs(daysLeft)} 天` :
                   daysLeft === 0 ? '今天' : `余 ${daysLeft} 天`}
                </span>
              </div>
            </div>
            {item.isChargeable && item.estimatedFee != null && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">预估费用</p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  <DollarSign size={13} className="text-green-600" />
                  {item.currency ?? 'USD'} {item.estimatedFee.toLocaleString()}
                </div>
              </div>
            )}
            {item.billingStatus && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">计费状态</p>
                <span className="text-sm font-medium text-gray-700">{item.billingStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">进度追踪</h3>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-extrabold text-gray-900">{doneSteps}</span>
            <span className="text-sm text-gray-400 mb-1">/ {totalSteps} 步</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="space-y-1.5">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 text-xs">
                {step.status === 'done' && (
                  <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                )}
                {step.status === 'active' && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
                )}
                {step.status === 'pending' && (
                  <Circle size={12} className="text-gray-300 flex-shrink-0" />
                )}
                <span className={
                  step.status === 'done' ? 'text-green-700 font-medium' :
                  step.status === 'active' ? 'text-blue-700 font-semibold' :
                  'text-gray-400'
                }>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active step quick info */}
        {activeStep && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2">当前步骤</h3>
            <p className="text-sm font-semibold text-blue-900 mb-1">{activeStep.title}</p>
            <ActorBadge actor={activeStep.actor} />
            {activeStep.notes && (
              <p className="text-xs text-blue-600 mt-2 leading-relaxed">{activeStep.notes}</p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
