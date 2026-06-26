import { useState } from 'react'
import {
  X, CheckCircle2, ArrowRight, CreditCard, Shield,
  Zap, Star, ChevronLeft, Sparkles,
} from 'lucide-react'
import type { ServiceDefinition } from '../../../data/serviceCatalog'

type Step = 'detail' | 'plan' | 'payment' | 'success'

interface Props {
  service: ServiceDefinition
  purchased: boolean
  onClose: () => void
  onPurchase: () => void
}

// Parse businessValue bullets from comma-separated string
function parseBullets(text: string): string[] {
  return text.split(/[；;]/).map((s) => s.trim()).filter(Boolean)
}

const CATEGORY_LABELS = {
  fulfillment: '履约服务',
  inventory:   '库存服务',
  shipping:    '运输服务',
}

const CATEGORY_COLORS = {
  fulfillment: 'bg-blue-100 text-blue-700',
  inventory:   'bg-green-100 text-green-700',
  shipping:    'bg-purple-100 text-purple-700',
}

export default function ServiceDetailModal({ service, purchased, onClose, onPurchase }: Props) {
  const [step, setStep] = useState<Step>('detail')
  const [payMethod, setPayMethod] = useState<'card' | 'credit'>('credit')

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── STEP: Detail ─────────────────────────────────────────────────────── */}
        {step === 'detail' && (
          <>
            {/* Hero header */}
            <div className={`relative px-6 pt-5 pb-4 border-b border-gray-100 ${
              service.category === 'fulfillment' ? 'bg-gradient-to-r from-blue-50 to-indigo-50' :
              service.category === 'inventory'   ? 'bg-gradient-to-r from-green-50 to-teal-50' :
                                                   'bg-gradient-to-r from-purple-50 to-violet-50'
            }`}>
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  service.category === 'fulfillment' ? 'bg-blue-100' :
                  service.category === 'inventory'   ? 'bg-green-100' :
                                                       'bg-purple-100'
                }`}>
                  {service.category === 'fulfillment' ? '📦' :
                   service.category === 'inventory'   ? '📊' : '🚚'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[service.category]}`}>
                      {CATEGORY_LABELS[service.category]}
                    </span>
                    {service.popular && (
                      <span className="flex items-center gap-0.5 text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                        <Star size={10} />
                        热门服务
                      </span>
                    )}
                    {purchased && (
                      <span className="flex items-center gap-0.5 text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                        <CheckCircle2 size={10} />
                        已开通
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{service.nameCn}</h2>
                  <p className="text-xs text-gray-500">{service.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{service.tagline}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">服务说明</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              {/* Business value */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">为什么需要这个服务</h3>
                <ul className="space-y-2">
                  {parseBullets(service.businessValue).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price highlight */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">服务定价</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <span className="text-sm text-gray-500">{service.priceNote}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield size={13} className="text-green-500" />
                  <span>按使用付费，随时可停</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
                稍后再说
              </button>
              {purchased ? (
                <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                  <CheckCircle2 size={16} />
                  服务已开通，可直接使用
                </div>
              ) : (
                <button
                  onClick={() => setStep('plan')}
                  className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  立即开通
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </>
        )}

        {/* ── STEP: Plan Confirm ────────────────────────────────────────────────── */}
        {step === 'plan' && (
          <>
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
              <button onClick={() => setStep('detail')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={18} />
              </button>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-900">确认开通方案</h2>
                <p className="text-xs text-gray-400">请确认以下服务方案，然后进入支付</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Service summary card */}
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {service.category === 'fulfillment' ? '📦' :
                     service.category === 'inventory'   ? '📊' : '🚚'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{service.nameCn}</div>
                    <div className="text-xs text-gray-500">{service.tagline}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">{service.price}</div>
                    <div className="text-xs text-gray-500">{service.priceNote}</div>
                  </div>
                </div>
              </div>

              {/* What you get */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">开通后您将获得</h3>
                <ul className="space-y-2">
                  {parseBullets(service.businessValue).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Zap size={14} className="text-primary-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Zap size={14} className="text-primary-500 shrink-0 mt-0.5" />
                    <span>按需使用，无最低消费，随时可停用</span>
                  </li>
                </ul>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🔒', label: '按量计费', desc: '实际使用才收费' },
                  { icon: '⚡', label: '立即生效', desc: '开通后即可发起请求' },
                  { icon: '📋', label: '专属报告', desc: '每次操作出具记录' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-xs font-semibold text-gray-700">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button onClick={() => setStep('detail')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <ChevronLeft size={14} />
                返回
              </button>
              <button
                onClick={() => setStep('payment')}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
              >
                确认，去支付
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* ── STEP: Payment ────────────────────────────────────────────────────── */}
        {step === 'payment' && (
          <>
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
              <button onClick={() => setStep('plan')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={18} />
              </button>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-900">选择支付方式</h2>
                <p className="text-xs text-gray-400">完成支付即可开通服务</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Payment method selector */}
              <div className="space-y-2">
                {[
                  { key: 'credit' as const, label: '账户余额抵扣', desc: '余额 $1,240.00 可用', icon: '💳' },
                  { key: 'card'   as const, label: '信用卡',        desc: 'Visa **** 8842',    icon: '🏦' },
                ].map((method) => (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPayMethod(method.key)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      payMethod === method.key
                        ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{method.label}</div>
                      <div className="text-xs text-gray-500">{method.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      payMethod === method.key ? 'border-primary-500' : 'border-gray-300'
                    }`}>
                      {payMethod === method.key && (
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Order summary */}
              <div className="rounded-xl border border-gray-200 p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">订单摘要</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{service.nameCn}</span>
                  <span className="font-medium text-gray-800">{service.price} {service.priceNote}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">开通费</span>
                  <span className="text-green-600 font-medium">免费</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">今日费用</span>
                  <span className="text-sm font-bold text-gray-900">¥0（按使用付费）</span>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield size={12} className="text-green-500" />
                <span>安全支付，按实际使用量计费，无隐性费用</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button onClick={() => setStep('plan')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <ChevronLeft size={14} />
                返回
              </button>
              <button
                onClick={() => { onPurchase(); setStep('success') }}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <CreditCard size={14} />
                确认开通服务
              </button>
            </div>
          </>
        )}

        {/* ── STEP: Success ────────────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center p-10 text-center flex-1">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
              <div className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">服务已成功开通！</h2>
              <Sparkles size={18} className="text-amber-500" />
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              <strong className="text-gray-700">{service.nameCn}</strong> 已添加到您的账户。
              现在可以在相关工作事项中直接使用此服务。
            </p>

            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 w-full max-w-sm text-left">
              <div className="text-xs font-semibold text-green-700 mb-2">接下来您可以：</div>
              <ul className="space-y-1.5">
                {parseBullets(service.businessValue).slice(0, 2).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-green-800">
                    <ArrowRight size={12} className="shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2 text-xs text-green-800">
                  <ArrowRight size={12} className="shrink-0 mt-0.5" />
                  <span>在工作事项详情页直接发起服务请求</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              开始使用
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
