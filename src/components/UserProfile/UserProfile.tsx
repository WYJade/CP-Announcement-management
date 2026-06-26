import { useState } from 'react'

export default function UserProfile() {
  const [form, setForm] = useState({
    email: 'evelyn_role@itemi.net',
    firstName: 'evelyn_role122',
    lastName: 'zhang',
    username: 'evelyn_role@itemi.net',
    phone: '12111281233',
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>

      <div className="space-y-5">
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm font-bold text-gray-900">{form.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Last name</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">User name</label>
            <input type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone number</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
          </div>
        </div>

        <button className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
          Change
        </button>
      </div>
    </div>
  )
}
