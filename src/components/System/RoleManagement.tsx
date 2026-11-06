import { useState, useRef, useEffect } from 'react'
import { Plus, X, ChevronDown, ChevronRight, MoreHorizontal, Edit2, Copy, Trash2, Sparkles } from 'lucide-react'

// 鈹€鈹€鈹€ Types 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
type RoleType = 'Tenant Role' | 'Customer Role'
type RoleStatus = 'Active' | 'Inactive'
type TenantOption = 'Unis, LLC' | 'Unis Transportation LLC'

const TENANT_OPTIONS: TenantOption[] = ['Unis, LLC', 'Unis Transportation LLC']
const CUSTOMER_OPTIONS = ['ADOORN LLC', 'THE ONLY BEAN LLC', 'VITA COCO', 'ORGAIN LLC', 'SAMUN INC']

interface PermissionNode {
  id: string
  label: string
  children?: PermissionNode[]
  actions?: string[]        // 椤甸潰鍔熻兘
  apis?: string[]           // API鏉冮檺
}

interface Role {
  id: string
  name: string
  description: string
  tenant: TenantOption | ''
  roleType: RoleType
  customer?: string        // Customer Role 涓撳睘
  modules: string[]
  users: number
  status: RoleStatus
  lastModified: string
}

// 鈹€鈹€鈹€ Permission tree data 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'dashboards', label: 'Dashboards', children: [
      { id: 'otif-dash', label: 'OTIF Dashboard', actions: ['View'], apis: ['OTIF Dashboard View', 'OTIF Data Query'] },
      { id: 'kpi-dash', label: 'KPI Dashboard', actions: ['View', 'Create Project'], apis: ['KPI Dashboard View', 'KPI Order Summary Query', 'Create KPI Project'] },
      { id: 'ticket-insights', label: 'Ticket Insights', actions: ['View'], apis: ['Ticket Insights Query'] },
    ],
  },
  {
    id: 'purchase-mgmt', label: 'Purchase Management', children: [
      { id: 'projects', label: 'Projects', actions: ['View'], apis: ['Project List Query'] },
      { id: 'purchase-request', label: 'Purchase Request', actions: ['View', 'Add New'], apis: ['Purchase Request Query', 'Create Purchase Request'] },
      { id: 'purchase-order', label: 'Purchase Order', actions: ['View', 'Add New', 'Edit'], apis: ['Purchase Order Query', 'Create Purchase Order', 'Update Purchase Order'] },
    ],
  },
  {
    id: 'sales-order', label: 'Sales Order', children: [
      { id: 'wholesale', label: 'Wholesale Orders', actions: ['View', 'Export'], apis: ['Wholesale Order Query', 'Export Wholesale Orders'] },
      { id: 'retail', label: 'Retail Orders', actions: ['View', 'Export'], apis: ['Retail Order Query', 'Export Retail Orders'] },
    ],
  },
  {
    id: 'inbound', label: 'Inbound', children: [
      { id: 'inbound-inquiry', label: 'Inquiry', actions: ['View', 'Export'], apis: ['Inbound Receipt Query', 'Inbound SKU Detail Query', 'Export Inbound Inquiry Details'] },
      { id: 'receipt-entry', label: 'Receipt Entry', actions: ['View', 'Add New'], apis: ['Receipt Entry Query', 'Create Receipt Entry', 'Receipt Item Detail Query'] },
    ],
  },
  {
    id: 'inventory', label: 'Inventory', children: [
      { id: 'inventory-activity', label: 'Inventory Activity', actions: ['View', 'Export'], apis: ['Inventory Activity Query', 'Export Inventory Activity'] },
      { id: 'item-master', label: 'Item Master', actions: ['View'], apis: ['Item Master Query', 'Item Detail Query'] },
    ],
  },
  {
    id: 'outbound', label: 'Outbound', children: [
      { id: 'outbound-inquiry', label: 'Inquiry', actions: ['View', 'Export'], apis: ['Outbound Order Query', 'Export Outbound Inquiry', 'Outbound Order Detail Query'] },
      { id: 'freight-quote', label: 'Freight Quote', actions: ['View', 'Create'], apis: ['Freight Quote Query', 'Create Freight Quote', 'Freight Rate Query'] },
    ],
  },
  {
    id: 'finance', label: 'Finance', children: [
      { id: 'invoice', label: 'Invoice', actions: ['View', 'Pay', 'Export'], apis: ['Invoice List Query', 'Invoice Detail Query', 'Pay Invoice', 'Export Invoice'] },
      { id: 'claim', label: 'Claim', actions: ['View', 'Create'], apis: ['Claim List Query', 'Claim Detail Query', 'File New Claim'] },
    ],
  },
]

const MODULE_OPTIONS = PERMISSION_TREE.map(n => n.label)

// ─── Sample roles ─────────────────────────────────────────────────────────────
const INITIAL_ROLES: Role[] = [
  // ── Tenant Roles (from screenshot) ──
  {
    id: 'r1', name: 'Asset Manager',
    description: 'No description provided.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 1, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r2', name: 'Inventory – Standard User',
    description: 'Access to inventory modules only, read-only except restock requests.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 7, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r3', name: 'Internal Transfer',
    description: 'No description provided.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 1, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r4', name: 'Customer Service – Dashboard Access',
    description: 'Full access to Dashboards; limited access to other operational data.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 2, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r5', name: 'Facility Management',
    description: 'No description provided.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 1, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r6', name: 'Order Management – Order Clone Access',
    description: 'Allows users to clone existing outbound orders for faster order creation.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 2, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r7', name: 'Order Management – Manual Entry Access',
    description: 'Allows users to manually input order data and submit for processing.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 1, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r8', name: 'Operations – Batch Rollback Access',
    description: 'Grants permission to perform batch rollback operations on order records.',
    tenant: 'Unis, LLC', roleType: 'Tenant Role',
    modules: [], users: 3, status: 'Active', lastModified: '2025/10/29',
  },
  // ── Customer Roles ──
  {
    id: 'r9', name: 'Client Portal – Power User',
    description: 'Full access to all client portal features including reports and exports.',
    tenant: 'Unis, LLC', roleType: 'Customer Role',
    customer: 'ADOORN LLC',
    modules: [], users: 5, status: 'Active', lastModified: '2025/10/29',
  },
  {
    id: 'r10', name: 'Client Portal – Standard User',
    description: 'Read-only access to shipment tracking, invoices, and inventory.',
    tenant: 'Unis, LLC', roleType: 'Customer Role',
    customer: 'THE ONLY BEAN LLC',
    modules: [], users: 3, status: 'Active', lastModified: '2025/10/28',
  },
  {
    id: 'r11', name: 'Client Portal – Finance Viewer',
    description: 'Access to invoices, claims, and payment history only.',
    tenant: 'Unis, LLC', roleType: 'Customer Role',
    customer: 'VITA COCO',
    modules: [], users: 2, status: 'Active', lastModified: '2025/10/27',
  },
  {
    id: 'r12', name: 'Client Portal – Logistics User',
    description: 'Access to outbound inquiry, shipment tracking, and freight quote.',
    tenant: 'Unis, LLC', roleType: 'Customer Role',
    customer: 'ORGAIN LLC',
    modules: [], users: 4, status: 'Inactive', lastModified: '2025/10/26',
  },
]
// 鈹€鈹€鈹€ Permission tree node component 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
// Top-level (depth=0): section header with expand/collapse + checkbox
// Second-level (depth=1): sub-menu label + two-column table (椤甸潰鍔熻兘 | API鏉冮檺)
function PermNode({
  node, depth = 0, checked, onToggle,
}: {
  node: PermissionNode
  depth?: number
  checked: Set<string>
  onToggle: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = !!node.children?.length
  const isTopLevel = depth === 0
  const hasActions = !!node.actions?.length
  const hasApis = !!node.apis?.length

  if (isTopLevel) {
    return (
      <div className="mb-2">
        {/* Top-level header row 鈥?purple-tinted */}
        <div className="flex items-center gap-2 py-2 px-3 bg-violet-50 rounded-lg mb-1">
          <button onClick={() => setExpanded(v => !v)} className="text-violet-400 hover:text-violet-600 transition-colors">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <div className="w-4 h-4 rounded bg-violet-500 shrink-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm" />
          </div>
          <span className="text-sm font-semibold text-gray-800">{node.label}</span>
        </div>
        {expanded && hasChildren && (
          <div className="pl-3">
            {node.children!.map(child => (
              <PermNode key={child.id} node={child} depth={1} checked={checked} onToggle={onToggle} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Leaf / second-level node
  return (
    <div className="mb-3">
      {/* Sub-menu label row */}
      <div className="flex items-center gap-2 py-1.5 mb-1">
        <button onClick={() => setExpanded(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        <div className="w-4 h-4 rounded bg-violet-500 shrink-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-sm" />
        </div>
        <span className="text-sm text-gray-700 font-medium">{node.label}</span>
      </div>

      {/* Two-column table for actions + apis */}
      {expanded && (hasActions || hasApis) && (
        <div className="ml-6 border border-gray-200 rounded-lg overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200">椤甸潰鍔熻兘</div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">API 鏉冮檺</div>
          </div>
          {/* Rows 鈥?zip actions and apis side by side */}
          {(() => {
            const acts = node.actions ?? []
            const apis = node.apis ?? []
            const maxLen = Math.max(acts.length, apis.length)
            return Array.from({ length: maxLen }).map((_, i) => (
              <div key={i} className={`grid grid-cols-2 ${i < maxLen - 1 ? 'border-b border-gray-100' : ''}`}>
                {/* 椤甸潰鍔熻兘 cell */}
                <div className="px-4 py-2 border-r border-gray-100 flex items-center gap-2">
                  {acts[i] !== undefined ? (
                    <>
                      <input
                        type="checkbox"
                        checked={checked.has(`${node.id}:action:${acts[i]}`)}
                        onChange={() => onToggle(`${node.id}:action:${acts[i]}`)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-400"
                      />
                      <span className="text-xs text-gray-700">{acts[i]}</span>
                    </>
                  ) : null}
                </div>
                {/* API鏉冮檺 cell */}
                <div className="px-4 py-2 flex items-center gap-2">
                  {apis[i] !== undefined ? (
                    <>
                      <input
                        type="checkbox"
                        checked={checked.has(`${node.id}:api:${apis[i]}`)}
                        onChange={() => onToggle(`${node.id}:api:${apis[i]}`)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-400"
                      />
                      <span className="text-xs text-gray-700">{apis[i]}</span>
                    </>
                  ) : null}
                </div>
              </div>
            ))
          })()}
        </div>
      )}
    </div>
  )
}

// 鈹€鈹€鈹€ Create / Edit Role Page 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
function RoleForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<Role>
  onCancel: () => void
  onSave: (r: Omit<Role, 'id' | 'users' | 'lastModified'>) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [tenant, setTenant] = useState<TenantOption | ''>(initial?.tenant ?? '')
  const [roleType, setRoleType] = useState<RoleType>(initial?.roleType ?? 'Tenant Role')
  const [status, setStatus] = useState<RoleStatus>(initial?.status ?? 'Active')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [nameError, setNameError] = useState('')
  const [tenantError, setTenantError] = useState('')
  const [roleTypeError, setRoleTypeError] = useState('')

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSave = () => {
    let valid = true
    if (!name.trim()) { setNameError('Role name is required'); valid = false } else setNameError('')
    if (!tenant) { setTenantError('Tenant is required'); valid = false } else setTenantError('')
    if (!roleType) { setRoleTypeError('Role type is required'); valid = false } else setRoleTypeError('')
    if (!valid) return
    onSave({ name, description, tenant, roleType, status, modules: [] })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{initial?.id ? 'Edit Role' : 'Create Role'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure role details and permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium">
            {initial?.id ? 'Save Changes' : 'Create Role'}
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left 鈥?Role Details */}
        <div className="w-72 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Role Details</h2>

            {/* Role Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Customer Service Representative"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 transition-colors ${nameError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the role's purpose and responsibilities"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 resize-none"
              />
            </div>

            {/* Tenant 鈥?above Role Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tenant <span className="text-red-500">*</span>
              </label>
              <select
                value={tenant}
                onChange={e => { setTenant(e.target.value as TenantOption | ''); setTenantError('') }}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 transition-colors ${tenantError ? 'border-red-400 bg-red-50' : 'border-gray-300'} ${!tenant ? 'text-gray-400' : 'text-gray-800'}`}
              >
                <option value="">Select Tenant</option>
                {TENANT_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {tenantError && <p className="text-xs text-red-500 mt-1">{tenantError}</p>}
            </div>

            {/* Role Type 鈥?Tenant Role / Customer Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {(['Tenant Role', 'Customer Role'] as RoleType[]).map(t => (
                  <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="roleType"
                      value={t}
                      checked={roleType === t}
                      onChange={() => { setRoleType(t); setRoleTypeError('') }}
                      className="text-primary-600 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
              {roleTypeError && <p className="text-xs text-red-500 mt-1">{roleTypeError}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1.5">
                {(['Active', 'Inactive'] as RoleStatus[]).map(s => (
                  <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="text-primary-600 focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-700">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 鈥?Permission Configuration */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">鏉冮檺閰嶇疆</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium">
                  <Sparkles size={12} /> Role Templates
                </button>
                <button
                  onClick={() => {
                    const all = new Set<string>()
                    const addAll = (nodes: PermissionNode[]) => {
                      nodes.forEach(n => {
                        all.add(n.id)
                        n.actions?.forEach(a => all.add(`${n.id}:action:${a}`))
                        n.apis?.forEach(a => all.add(`${n.id}:api:${a}`))
                        if (n.children) addAll(n.children)
                      })
                    }
                    addAll(PERMISSION_TREE)
                    setChecked(all)
                  }}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  Select All
                </button>
                <button onClick={() => setChecked(new Set())}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                  Clear All
                </button>
              </div>
            </div>

            {/* Fixed tab: 鑿滃崟鍔熻兘/API鏉冮檺 + hint text */}
            <div className="border-b border-gray-200 mb-4 flex items-center justify-between">
              <div className="inline-block px-1 pb-2 text-sm font-semibold text-primary-600 border-b-2 border-primary-600">
                鑿滃崟鍔熻兘/API鏉冮檺
              </div>
              <p className="text-xs text-amber-600 font-medium pb-2">
                姝ゅ閰嶇疆鐨?API 鏉冮檺浠呭 Client Portal 鏈綋鍙?Agent 鐢熸晥锛屼笉褰卞搷椤甸潰鍔熻兘銆?
              </p>
            </div>

            {/* Permission tree */}
            <div className="flex-1 overflow-y-auto">
              {PERMISSION_TREE.map(node => (
                <PermNode key={node.id} node={node} checked={checked} onToggle={toggle} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 鈹€鈹€鈹€ Actions dropdown 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
function ActionsMenu({ role, onEdit, onDuplicate, onDelete }: {
  role: Role
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          <button onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit2 size={13} className="text-gray-400" /> Edit
          </button>
          <button onClick={() => { onDuplicate(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Copy size={13} className="text-gray-400" /> Duplicate
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { onDelete(); setOpen(false) }}
            className={`w-full flex items-start gap-2 px-4 py-2.5 text-sm transition-colors ${role.users > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
            disabled={role.users > 0}
          >
            <Trash2 size={13} className="mt-0.5 shrink-0" />
            <div>
              <p>Delete</p>
              {role.users > 0 && (
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                  (This role is being used by {role.users} users and cannot be deleted)
                </p>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

// 鈹€鈹€鈹€ Main Role Management Page 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [editTarget, setEditTarget] = useState<Role | null>(null)
  const [activeTab, setActiveTab] = useState<'tenant' | 'customer'>('tenant')

  // 鈹€鈹€ Tenant Roles filter state 鈹€鈹€
  const [tFilterModule,   setTFilterModule]   = useState('')
  const [tFilterStatus,   setTFilterStatus]   = useState('')
  const [tFilterTenant,   setTFilterTenant]   = useState('')
  const [tFilterRoleName, setTFilterRoleName] = useState('')
  const [tActive, setTActive] = useState({ module: '', status: '', tenant: '', roleName: '' })

  // 鈹€鈹€ Customer Roles filter state 鈹€鈹€
  const [cFilterCustomer,  setCFilterCustomer]  = useState('')
  const [cFilterStatus,    setCFilterStatus]    = useState('')
  const [cFilterRoleName,  setCFilterRoleName]  = useState('')
  const [cActive, setCActive] = useState({ customer: '', status: '', roleName: '' })

  // Filtered lists
  const tenantRoles = roles
    .filter(r => r.roleType === 'Tenant Role')
    .filter(r => {
      if (tActive.roleName && !r.name.toLowerCase().includes(tActive.roleName.toLowerCase())) return false
      if (tActive.status   && r.status  !== tActive.status)  return false
      if (tActive.tenant   && r.tenant  !== tActive.tenant)  return false
      if (tActive.module   && !r.modules.includes(tActive.module)) return false
      return true
    })

  const customerRoles = roles
    .filter(r => r.roleType === 'Customer Role')
    .filter(r => {
      if (cActive.roleName && !r.name.toLowerCase().includes(cActive.roleName.toLowerCase())) return false
      if (cActive.status   && r.status   !== cActive.status)   return false
      if (cActive.customer && r.customer !== cActive.customer) return false
      return true
    })

  const handleCreate = (data: Omit<Role, 'id' | 'users' | 'lastModified'>) => {
    const now = new Date()
    const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`
    setRoles(prev => [...prev, { ...data, id: `r${Date.now()}`, users: 0, lastModified: dateStr }])
    setView('list')
  }

  const handleEdit = (data: Omit<Role, 'id' | 'users' | 'lastModified'>) => {
    if (!editTarget) return
    const now = new Date()
    const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`
    setRoles(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...data, lastModified: dateStr } : r))
    setView('list')
    setEditTarget(null)
  }

  const handleDuplicate = (role: Role) => {
    const now = new Date()
    const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`
    setRoles(prev => [...prev, { ...role, id: `r${Date.now()}`, name: `${role.name} (Copy)`, users: 0, lastModified: dateStr }])
  }

  const handleDelete = (id: string) => setRoles(prev => prev.filter(r => r.id !== id))

  // 鈹€鈹€ Create / Edit view 鈹€鈹€
  if (view === 'create') return (
    <div className="p-6 h-full">
      <RoleForm onCancel={() => setView('list')} onSave={handleCreate} />
    </div>
  )
  if (view === 'edit' && editTarget) return (
    <div className="p-6 h-full">
      <RoleForm initial={editTarget} onCancel={() => { setView('list'); setEditTarget(null) }} onSave={handleEdit} />
    </div>
  )

  // 鈹€鈹€ Shared table cols renderer 鈹€鈹€
  const renderRoleRows = (list: Role[], isCustomer: boolean) => (
    <>
      {list.map(role => (
        <tr key={role.id} className="hover:bg-gray-50 transition-colors">
          {isCustomer && (
            <td className="py-3.5 px-4 text-gray-700 text-xs whitespace-nowrap">{role.customer || '鈥?}</td>
          )}
          <td className="py-3.5 px-4 font-medium text-gray-800">{role.name}</td>
          <td className="py-3.5 px-4 text-gray-500 text-xs max-w-[180px] truncate">{role.description}</td>
          <td className="py-3.5 px-4 text-gray-600 text-xs whitespace-nowrap">{role.tenant || '鈥?}</td>
          <td className="py-3.5 px-4">
            {role.modules.length === 0 ? (
              <span className="text-gray-400 text-xs">鈥?/span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {role.modules.slice(0,3).map(m => (
                  <span key={m} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{m}</span>
                ))}
                {role.modules.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{role.modules.length - 3}</span>
                )}
              </div>
            )}
          </td>
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-md px-2 py-1 w-fit">
              <span className="text-[10px]">馃懁</span> {role.users}
            </div>
          </td>
          <td className="py-3.5 px-4">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${role.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {role.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-gray-500 text-xs whitespace-nowrap">{role.lastModified}</td>
          <td className="py-3.5 px-4">
            <ActionsMenu
              role={role}
              onEdit={() => { setEditTarget(role); setView('edit') }}
              onDuplicate={() => handleDuplicate(role)}
              onDelete={() => handleDelete(role.id)}
            />
          </td>
        </tr>
      ))}
      {list.length === 0 && (
        <tr>
          <td colSpan={isCustomer ? 9 : 8} className="text-center py-12 text-gray-400 text-sm">
            No roles found
          </td>
        </tr>
      )}
    </>
  )


  // -- List view --
  return (
    <div className="p-6">
      {/* Page header — title + Create Role button (matches screenshot) */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">Role Management</h1>
        <button
          onClick={() => setView('create')}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={14} /> Create Role
        </button>
      </div>

      {/* Filter card — always visible, applies to current tab */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Tenant */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tenant</label>
            <select value={tFilterTenant} onChange={e => setTFilterTenant(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
              <option value="">Select Tenant</option>
              {TENANT_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* Module */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Module</label>
            <select value={tFilterModule} onChange={e => setTFilterModule(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
              <option value="">Select Module</option>
              {MODULE_OPTIONS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select value={tFilterStatus} onChange={e => setTFilterStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
              <option value="">Select Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          {/* Role Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Role Name</label>
            <input value={tFilterRoleName} onChange={e => setTFilterRoleName(e.target.value)}
              placeholder="Search by role name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setTFilterModule(''); setTFilterStatus(''); setTFilterTenant(''); setTFilterRoleName('')
              setTActive({ module: '', status: '', tenant: '', roleName: '' })
            }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >Reset</button>
          <button
            onClick={() => setTActive({ module: tFilterModule, status: tFilterStatus, tenant: tFilterTenant, roleName: tFilterRoleName })}
            className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >Search</button>
        </div>
      </div>

      {/* Tabs — BELOW filter card, matching screenshot */}
      <div className="flex border-b border-gray-200 mb-4">
        {([['tenant', 'Tenant Roles'], ['customer', 'Customer Roles']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Customer Roles: extra Customer filter row */}
      {activeTab === 'customer' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Customer</label>
              <select value={cFilterCustomer} onChange={e => setCFilterCustomer(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
                <option value="">Select Customer</option>
                {CUSTOMER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
              <select value={cFilterStatus} onChange={e => setCFilterStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
                <option value="">Select Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Role Name</label>
              <input value={cFilterRoleName} onChange={e => setCFilterRoleName(e.target.value)}
                placeholder="Search by role name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => { setCFilterCustomer(''); setCFilterStatus(''); setCFilterRoleName(''); setCActive({ customer: '', status: '', roleName: '' }) }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
            <button onClick={() => setCActive({ customer: cFilterCustomer, status: cFilterStatus, roleName: cFilterRoleName })}
              className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">Search</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {activeTab === 'customer' && (
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 whitespace-nowrap">Customer</th>
              )}
              {['Role Name', 'Description', 'Modules', 'Users', 'Status', 'Last Modified', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(activeTab === 'tenant' ? tenantRoles : customerRoles).map(role => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                {activeTab === 'customer' && (
                  <td className="py-3.5 px-4 text-gray-700 text-xs whitespace-nowrap">{role.customer || '--'}</td>
                )}
                <td className="py-3.5 px-4 font-medium text-gray-800 text-sm">{role.name}</td>
                <td className="py-3.5 px-4 text-gray-500 text-xs max-w-[240px] truncate">{role.description}</td>
                <td className="py-3.5 px-4 text-gray-400 text-xs">
                  {role.modules.length === 0 ? 'No modules mapped' : role.modules.slice(0,3).join(', ')}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-md px-2 py-1">
                    Al {role.users}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${role.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {role.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-500 text-xs whitespace-nowrap">{role.lastModified}</td>
                <td className="py-3.5 px-4">
                  <ActionsMenu
                    role={role}
                    onEdit={() => { setEditTarget(role); setView('edit') }}
                    onDuplicate={() => handleDuplicate(role)}
                    onDelete={() => handleDelete(role.id)}
                  />
                </td>
              </tr>
            ))}
            {(activeTab === 'tenant' ? tenantRoles : customerRoles).length === 0 && (
              <tr>
                <td colSpan={activeTab === 'customer' ? 8 : 7} className="text-center py-12 text-gray-400 text-sm">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
