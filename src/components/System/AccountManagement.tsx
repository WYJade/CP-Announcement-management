import { useState } from 'react'
import { Plus, X, Edit2, Users } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Account {
  id: string
  username: string
  email: string
  accountType: 'Main Account' | 'SUB'
  subAccountType: '客户子账号' | '租户子账号' | null
  customers: number
  roles: string
  status: 'Active' | 'Inactive'
  lastLogin: string
}

interface CreateForm {
  username: string; email: string; firstName: string; lastName: string
  contact: string; password: string; confirmPassword: string; status: string
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const INITIAL_ACCOUNTS: Account[] = [
  { id:'a1', username:'ut', email:'ut@123.com', accountType:'Main Account', subAccountType:null, customers:5, roles:'Admin', status:'Active', lastLogin:'Never' },
  { id:'a2', username:'mengtian.yang@item.com', email:'mengtian.yang@item.com', accountType:'SUB', subAccountType:'租户子账号', customers:1, roles:'Viewer', status:'Active', lastLogin:'Never' },
  { id:'a3', username:'–', email:'–', accountType:'SUB', subAccountType:'客户子账号', customers:0, roles:'–', status:'Active', lastLogin:'Never' },
  { id:'a4', username:'–', email:'–', accountType:'SUB', subAccountType:'租户子账号', customers:0, roles:'–', status:'Active', lastLogin:'Never' },
  { id:'a5', username:'_verify_admin_path_001__', email:'verify_admin_path@test.com', accountType:'SUB', subAccountType:'客户子账号', customers:0, roles:'–', status:'Active', lastLogin:'Never' },
]

// ─── Create Account Modal ─────────────────────────────────────────────────────
function CreateAccountModal({ defaultSubType, onClose, onSave }: {
  defaultSubType: '客户子账号' | '租户子账号'
  onClose: () => void
  onSave: (form: CreateForm, subType: '客户子账号' | '租户子账号') => void
}) {
  const [form, setForm] = useState<CreateForm>({
    username: 'evelyn_role@teml.net', email: '', firstName: '', lastName: '',
    contact: '', password: '', confirmPassword: '', status: 'Active',
  })
  const [customers, setCustomers] = useState('')
  const [roles, setRoles] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof CreateForm, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e: Partial<Record<keyof CreateForm, string>> = {}
    if (!form.username.trim()) e.username = 'Required'
    if (!form.email.trim()) e.email = 'Please enter email'
    if (!form.firstName.trim()) e.firstName = 'Please enter first name'
    if (!form.lastName.trim()) e.lastName = 'Please enter last name'
    if (!form.password) e.password = 'Use 8+ chars with upper, lower, number, and symbol'
    else if (form.password.length < 8) e.password = 'Use 8+ chars with upper, lower, number, and symbol'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const inp = (name: keyof CreateForm) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 transition-colors ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-base font-semibold text-gray-900">Create Account</h3>
          <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Row 1: Username + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username <span className="text-red-500">*</span></label>
              <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Enter username"
                className={`${inp('username')} bg-gray-50`} />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Enter email"
                className={inp('email')} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Enter first name"
                className={inp('firstName')} />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Enter last name"
                className={inp('lastName')} />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Row 3: Contact Number + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
              <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                placeholder="Enter contact number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 4: Password + Confirm Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter password"
                className={inp('password')} />
              {errors.password
                ? <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                : <p className="text-xs text-gray-400 mt-1">Use 8+ chars with upper, lower, number, and symbol</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Confirm password"
                className={inp('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Row 5: Customer & Facility + Roles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer &amp; Facility</label>
              <p className="text-xs text-gray-500 mb-1">Select Customers</p>
              <select value={customers} onChange={e => setCustomers(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 text-gray-400">
                <option value="">Select customers</option>
                <option value="c1">ADOORN LLC</option>
                <option value="c2">THE ONLY BEAN LLC</option>
                <option value="c3">VITA COCO</option>
                <option value="c4">ORGAIN LLC</option>
                <option value="c5">PLEASS GLOBAL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Roles</label>
              <select value={roles} onChange={e => setRoles(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 text-gray-400">
                <option value="">Select roles</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => { if (validate()) onSave(form, defaultSubType) }}
            className="px-5 py-2.5 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium">Save</button>
        </div>
      </div>
    </div>
  )
}

// ─── Account Table (shared between tabs) ──────────────────────────────────────
function AccountTable({
  accounts, searchUser, searchEmail, filterStatus,
}: {
  accounts: Account[]
  searchUser: string
  searchEmail: string
  filterStatus: string
}) {
  const filtered = accounts.filter(a => {
    if (searchUser && !a.username.toLowerCase().includes(searchUser.toLowerCase())) return false
    if (searchEmail && !a.email.toLowerCase().includes(searchEmail.toLowerCase())) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {['Username', 'Email', 'Account Type', 'Customers', 'Roles', 'Status', 'Last Login', 'Actions'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtered.map(acc => (
            <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-gray-800 font-medium text-sm">{acc.username}</td>
              <td className="py-3 px-4 text-gray-600 text-sm">{acc.email}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${acc.accountType === 'Main Account' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'}`}>
                  {acc.accountType}
                </span>
              </td>
              <td className="py-3 px-4">
                {acc.customers > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1 w-fit">
                    <Users size={11} /> {acc.customers}
                  </div>
                ) : <span className="text-gray-400 text-xs">{acc.customers}</span>}
              </td>
              <td className="py-3 px-4 text-gray-500 text-xs">{acc.roles}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${acc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {acc.status}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500 text-xs">{acc.lastLogin}</td>
              <td className="py-3 px-4">
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                  <Edit2 size={12} /> Edit
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No accounts found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [activeTab, setActiveTab] = useState<'租户子账号' | '客户子账号'>('租户子账号')
  const [showCreate, setShowCreate] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const tabAccounts = accounts.filter(a => a.subAccountType === activeTab || a.accountType === 'Main Account')

  const handleCreate = (form: CreateForm, subType: '客户子账号' | '租户子账号') => {
    const newAcc: Account = {
      id: `a${Date.now()}`,
      username: form.username,
      email: form.email,
      accountType: 'SUB',
      subAccountType: subType,
      customers: 0,
      roles: 'Viewer',
      status: form.status as 'Active' | 'Inactive',
      lastLogin: 'Never',
    }
    setAccounts(prev => [...prev, newAcc])
    setShowCreate(false)
  }

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={15} /> Create Account
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 mb-5 border-b border-gray-200">
        {(['租户子账号', '客户子账号'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
            <input
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              placeholder="Search by username..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
            <input
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              placeholder="Search by email..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
            >
              <option value="">Select status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => { setSearchUser(''); setSearchEmail(''); setFilterStatus('') }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <AccountTable
        accounts={tabAccounts}
        searchUser={searchUser}
        searchEmail={searchEmail}
        filterStatus={filterStatus}
      />

      {/* Create Modal */}
      {showCreate && (
        <CreateAccountModal
          defaultSubType={activeTab}
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  )
}
