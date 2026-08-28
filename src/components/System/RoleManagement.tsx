import { useState, useRef, useEffect } from 'react'
import { Plus, X, ChevronDown, ChevronRight, MoreHorizontal, Edit2, Copy, Trash2, Sparkles } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type RoleType = 'Internal' | 'External'
type RoleStatus = 'Active' | 'Inactive'

interface PermissionNode {
  id: string
  label: string
  children?: PermissionNode[]
  actions?: string[]
}

interface Role {
  id: string
  name: string
  description: string
  roleType: RoleType
  modules: string[]
  users: number
  status: RoleStatus
  lastModified: string
}

// ─── Permission tree data ─────────────────────────────────────────────────────
const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'dashboards', label: 'Dashboards', children: [
      { id: 'otif-dash', label: 'OTIF Dashboard', actions: ['View'] },
      { id: 'kpi-dash', label: 'KPI Dashboard', actions: ['View', 'Create Project'] },
      { id: 'ticket-insights', label: 'Ticket Insights', actions: ['View'] },
    ],
  },
  {
    id: 'purchase-mgmt', label: 'Purchase Management', children: [
      { id: 'projects', label: 'Projects', actions: ['View'] },
      { id: 'purchase-request', label: 'Purchase Request', actions: ['View', 'Add New'] },
      { id: 'purchase-order', label: 'Purchase Order', actions: ['View', 'Add New', 'Edit'] },
    ],
  },
  {
    id: 'sales-order', label: 'Sales Order', children: [
      { id: 'wholesale', label: 'Wholesale Orders', actions: ['View', 'Export'] },
      { id: 'retail', label: 'Retail Orders', actions: ['View', 'Export'] },
    ],
  },
  {
    id: 'inbound', label: 'Inbound', children: [
      { id: 'inbound-inquiry', label: 'Inquiry', actions: ['View', 'Export'] },
      { id: 'receipt-entry', label: 'Receipt Entry', actions: ['View', 'Add New'] },
    ],
  },
  {
    id: 'inventory', label: 'Inventory', children: [
      { id: 'inventory-activity', label: 'Inventory Activity', actions: ['View', 'Export'] },
      { id: 'item-master', label: 'Item Master', actions: ['View'] },
    ],
  },
  {
    id: 'outbound', label: 'Outbound', children: [
      { id: 'outbound-inquiry', label: 'Inquiry', actions: ['View', 'Export'] },
      { id: 'freight-quote', label: 'Freight Quote', actions: ['View', 'Create'] },
    ],
  },
  {
    id: 'finance', label: 'Finance', children: [
      { id: 'invoice', label: 'Invoice', actions: ['View', 'Pay', 'Export'] },
      { id: 'claim', label: 'Claim', actions: ['View', 'Create'] },
    ],
  },
]

const MODULE_OPTIONS = PERMISSION_TREE.map(n => n.label)

// ─── Sample roles ─────────────────────────────────────────────────────────────
const INITIAL_ROLES: Role[] = [
  {
    id: 'r1', name: 'sub-Admin', description: 'No description provided.',
    roleType: 'Internal',
    modules: ['Web Methods', 'International', 'Warehouse Map'],
    users: 1, status: 'Active', lastModified: '2026/08/28',
  },
  {
    id: 'r2', name: 'sdssss', description: 'No description provided.',
    roleType: 'Internal',
    modules: ['Dashboards'],
    users: 1, status: 'Active', lastModified: '2026/08/26',
  },
  {
    id: 'r3', name: 'Client Portal –UF External User',
    description: '供外部客户访问 UF 系统中的客户服务功能及其他授权的业务数据…',
    roleType: 'External',
    modules: [],
    users: 40, status: 'Active', lastModified: '2026/08/24',
  },
]

// ─── Permission tree node component ──────────────────────────────────────────
function PermNode({
  node, depth = 0, checked, onToggle,
}: {
  node: PermissionNode
  depth?: number
  checked: Set<string>
  onToggle: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = !!node.children?.length

  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div className="flex items-center gap-2 py-1">
        {hasChildren ? (
          <button onClick={() => setExpanded(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : <span className="w-3.5" />}
        <input
          type="checkbox"
          checked={checked.has(node.id)}
          onChange={() => onToggle(node.id)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-400"
        />
        <span className="text-sm text-gray-700">{node.label}</span>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map(child => (
            <PermNode key={child.id} node={child} depth={depth + 1} checked={checked} onToggle={onToggle} />
          ))}
          {/* Action checkboxes */}
          {node.actions?.map(action => (
            <div key={action} className="flex items-center gap-2 py-0.5" style={{ marginLeft: (depth + 2) * 20 }}>
              <input
                type="checkbox"
                checked={checked.has(`${node.id}:${action}`)}
                onChange={() => onToggle(`${node.id}:${action}`)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-400"
              />
              <span className="text-xs text-gray-500">{action}</span>
            </div>
          ))}
        </div>
      )}
      {/* Action checkboxes for leaf nodes */}
      {!hasChildren && node.actions && expanded && node.actions.map(action => (
        <div key={action} className="flex items-center gap-2 py-0.5" style={{ marginLeft: (depth + 1) * 20 }}>
          <input
            type="checkbox"
            checked={checked.has(`${node.id}:${action}`)}
            onChange={() => onToggle(`${node.id}:${action}`)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-400"
          />
          <span className="text-xs text-gray-500">{action}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Create / Edit Role Page ──────────────────────────────────────────────────
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
  const [roleType, setRoleType] = useState<RoleType>(initial?.roleType ?? 'Internal')
  const [status, setStatus] = useState<RoleStatus>(initial?.status ?? 'Active')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [nameError, setNameError] = useState('')
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
    if (!roleType) { setRoleTypeError('Role type is required'); valid = false } else setRoleTypeError('')
    if (!valid) return
    onSave({ name, description, roleType, status, modules: [] })
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
        {/* Left — Role Details */}
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

            {/* Role Type — above Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {(['Internal', 'External'] as RoleType[]).map(t => (
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

        {/* Right — Permission Configuration */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Permission Configuration</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium">
                  <Sparkles size={12} /> Role Templates
                </button>
                <button
                  onClick={() => {
                    const all = new Set<string>()
                    const addAll = (nodes: PermissionNode[]) => {
                      nodes.forEach(n => { all.add(n.id); n.actions?.forEach(a => all.add(`${n.id}:${a}`)); if (n.children) addAll(n.children) })
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
            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-lg p-3">
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

// ─── Actions dropdown ─────────────────────────────────────────────────────────
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

// ─── Main Role Management Page ────────────────────────────────────────────────
export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [editTarget, setEditTarget] = useState<Role | null>(null)

  // Filter state
  const [filterModule, setFilterModule] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterRoleType, setFilterRoleType] = useState('')
  const [filterRoleName, setFilterRoleName] = useState('')
  const [activeFilters, setActiveFilters] = useState({ module: '', status: '', roleType: '', roleName: '' })

  const filtered = roles.filter(r => {
    if (activeFilters.roleName && !r.name.toLowerCase().includes(activeFilters.roleName.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.roleType && r.roleType !== activeFilters.roleType) return false
    if (activeFilters.module && !r.modules.includes(activeFilters.module)) return false
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

  const handleDelete = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id))
  }

  // ── Create / Edit view ──
  if (view === 'create') {
    return (
      <div className="p-6 h-full">
        <RoleForm onCancel={() => setView('list')} onSave={handleCreate} />
      </div>
    )
  }
  if (view === 'edit' && editTarget) {
    return (
      <div className="p-6 h-full">
        <RoleForm initial={editTarget} onCancel={() => { setView('list'); setEditTarget(null) }} onSave={handleEdit} />
      </div>
    )
  }

  // ── List view ──
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Role Management</h1>
        <button
          onClick={() => setView('create')}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={14} /> Create Role
        </button>
      </div>

      {/* Filter card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Module */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Module</label>
            <select value={filterModule} onChange={e => setFilterModule(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
              <option value="">Select Module</option>
              {MODULE_OPTIONS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
              <option value="">Select Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          {/* Role Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Role Type</label>
            <select value={filterRoleType} onChange={e => setFilterRoleType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-primary-400">
              <option value="">Select Role Type</option>
              <option>Internal</option>
              <option>External</option>
            </select>
          </div>
          {/* Role Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Role Name</label>
            <input value={filterRoleName} onChange={e => setFilterRoleName(e.target.value)}
              placeholder="Search by role name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => { setFilterModule(''); setFilterStatus(''); setFilterRoleType(''); setFilterRoleName(''); setActiveFilters({ module: '', status: '', roleType: '', roleName: '' }) }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >Reset</button>
          <button
            onClick={() => setActiveFilters({ module: filterModule, status: filterStatus, roleType: filterRoleType, roleName: filterRoleName })}
            className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Role Name', 'Description', 'Role Type', 'Modules', 'Users', 'Status', 'Last Modified', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(role => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-gray-800">{role.name}</td>
                <td className="py-3.5 px-4 text-gray-500 text-xs max-w-[200px] truncate">{role.description}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                    role.roleType === 'Internal'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {role.roleType}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {role.modules.length === 0 ? (
                    <span className="text-gray-400 text-xs">No modules mapped</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {role.modules.slice(0, 3).map(m => (
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
                    <span className="text-[10px]">👤</span> {role.users}
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
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No roles found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
