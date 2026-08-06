import { useState } from 'react'
import { Plus, X, Edit2, Users } from 'lucide-react'

interface Account {
  id: string
  username: string
  email: string
  accountType: 'Main Account' | 'SUB'
  subAccountType: '客户子账号' | '租户子账号' | null
  customers: number
  roles: string[]
  status: 'Active' | 'Inactive'
  lastLogin: string
}

const INITIAL_ACCOUNTS: Account[] = [
  { id:'a1', username:'lt-staging@item.com', email:'lt-staging@item.com', accountType:'Main Account', subAccountType:null, customers:12, roles:['Admin'], status:'Active', lastLogin:'Never' },
  { id:'a2', username:'jordagnedover', email:'jordan@dagnedover.com', accountType:'SUB', subAccountType:'客户子账号', customers:1, roles:['Viewer'], status:'Active', lastLogin:'Never' },
  { id:'a3', username:'megdagnedover', email:'megan@dagnedover.com', accountType:'SUB', subAccountType:'租户子账号', customers:1, roles:['Viewer'], status:'Active', lastLogin:'Never' },
  { id:'a4', username:'jasdagnedover', email:'jasmine@dagnedover.com', accountType:'SUB', subAccountType:'客户子账号', customers:1, roles:['Viewer'], status:'Active', lastLogin:'Never' },
]

interface CreateForm {
  subAccountType: '客户子账号' | '租户子账号' | ''
  username: string; email: string; firstName: string; lastName: string
  contact: string; password: string; confirmPassword: string
}

function CreateAccountModal({ onClose, onSave }: { onClose:()=>void; onSave:(form:CreateForm)=>void }) {
  const [form, setForm] = useState<CreateForm>({
    subAccountType:'', username:'lt-staging@item.com', email:'', firstName:'', lastName:'',
    contact:'', password:'', confirmPassword:'',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CreateForm,string>>>({})

  const validate = () => {
    const e: Partial<Record<keyof CreateForm,string>> = {}
    if (!form.subAccountType) e.subAccountType = 'Please select account type'
    if (!form.username.trim()) e.username = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 8) e.password = 'Use 8+ chars with upper, lower, number, and symbol'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = () => { if (validate()) onSave(form) }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mb-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-900">Create Account</h3>
          <button onClick={onClose}><X size={15} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        <div className="px-6 py-5 space-y-4">

          {/* Sub-account type selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Account Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(['客户子账号','租户子账号'] as const).map(t=>(
                <button key={t} onClick={()=>setForm(f=>({...f,subAccountType:t}))}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${form.subAccountType===t?'border-primary-500 bg-primary-50 text-primary-700':'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <Users size={15} className={form.subAccountType===t?'text-primary-500':'text-gray-400'} />
                  {t}
                </button>
              ))}
            </div>
            {errors.subAccountType&&<p className="text-xs text-red-500 mt-1">{errors.subAccountType}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Username <span className="text-red-500">*</span></label>
            <input value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 ${errors.username?'border-red-300 bg-red-50':'border-gray-200 bg-gray-50'}`} />
            {errors.username&&<p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
            <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
              placeholder="Enter email"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 ${errors.email?'border-red-300':'border-gray-200'}`} />
            {errors.email&&<p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
              <input value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}
                placeholder="Enter first name"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 ${errors.firstName?'border-red-300':'border-gray-200'}`} />
              {errors.firstName&&<p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}
                placeholder="Enter last name"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 ${errors.lastName?'border-red-300':'border-gray-200'}`} />
              {errors.lastName&&<p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Contact Number</label>
            <input value={form.contact} onChange={e=>setForm(f=>({...f,contact:e.target.value}))}
              placeholder="Enter contact number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 bg-gray-50 ${errors.password?'border-red-300':'border-gray-200'}`} />
            {errors.password?<p className="text-xs text-red-500 mt-1">{errors.password}</p>:
              <p className="text-[10px] text-gray-400 mt-1">Use 8+ chars with upper, lower, number, and symbol</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Confirm Password <span className="text-red-500">*</span></label>
            <input type="password" value={form.confirmPassword} onChange={e=>setForm(f=>({...f,confirmPassword:e.target.value}))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400 ${errors.confirmPassword?'border-red-300 bg-red-50':'border-gray-200'}`} />
            {errors.confirmPassword&&<p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={save} className="px-5 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">Save</button>
        </div>
      </div>
    </div>
  )
}

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [showCreate, setShowCreate] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = accounts.filter(a => {
    if (searchUser && !a.username.toLowerCase().includes(searchUser.toLowerCase())) return false
    if (searchEmail && !a.email.toLowerCase().includes(searchEmail.toLowerCase())) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  const handleCreate = (form: CreateForm) => {
    const newAcc: Account = {
      id: `a${Date.now()}`,
      username: form.username,
      email: form.email,
      accountType: 'SUB',
      subAccountType: form.subAccountType as '客户子账号' | '租户子账号',
      customers: 0,
      roles: ['Viewer'],
      status: 'Active',
      lastLogin: 'Never',
    }
    setAccounts(prev => [...prev, newAcc])
    setShowCreate(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={15} /> Create Account
        </button>
      </div>

      {/* Search filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
            <input value={searchUser} onChange={e=>setSearchUser(e.target.value)}
              placeholder="Search by username..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
            <input value={searchEmail} onChange={e=>setSearchEmail(e.target.value)}
              placeholder="Search by email..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
              <option value="">Select status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={()=>{setSearchUser('');setSearchEmail('');setFilterStatus('')}}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
          <button className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Username','Email','Account Type','Customers','Roles','Sub-Account Type','Status','Last Login','Actions'].map(h=>(
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(acc=>(
              <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-800">{acc.username}</td>
                <td className="py-3 px-4 text-gray-600">{acc.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${acc.accountType==='Main Account'?'bg-violet-100 text-violet-700':'bg-gray-100 text-gray-600'}`}>
                    {acc.accountType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1 w-fit">
                    <Users size={11}/> {acc.customers}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">{acc.roles.join(', ')}</td>
                <td className="py-3 px-4">
                  {acc.subAccountType ? (
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${acc.subAccountType==='客户子账号'?'bg-blue-50 text-blue-700':'bg-amber-50 text-amber-700'}`}>
                      {acc.subAccountType}
                    </span>
                  ) : <span className="text-gray-400 text-xs">–</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${acc.status==='Active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                    {acc.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">{acc.lastLogin}</td>
                <td className="py-3 px-4">
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                    <Edit2 size={12}/> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length===0&&(
              <tr><td colSpan={9} className="text-center py-12 text-gray-400">No accounts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate&&<CreateAccountModal onClose={()=>setShowCreate(false)} onSave={handleCreate} />}
    </div>
  )
}
