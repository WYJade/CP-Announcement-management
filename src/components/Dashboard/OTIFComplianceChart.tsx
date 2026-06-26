import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'DC1', otif: 75, onTime: 80, inFull: 90 },
  { name: 'DC2', otif: 60, onTime: 65, inFull: 85 },
  { name: 'DC3', otif: 82, onTime: 88, inFull: 92 },
  { name: 'DC4', otif: 55, onTime: 70, inFull: 78 },
  { name: 'DC5', otif: 70, onTime: 75, inFull: 88 },
]

function OTIFComplianceChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">OTIF Compliance Per DC</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-500">OTIF</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">On Time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-500">In Full</span>
          </div>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            />
            <Legend wrapperStyle={{ display: 'none' }} />
            <Bar dataKey="otif" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={12} />
            <Bar dataKey="onTime" fill="#22c55e" radius={[2, 2, 0, 0]} barSize={12} />
            <Bar dataKey="inFull" fill="#eab308" radius={[2, 2, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OTIFComplianceChart
