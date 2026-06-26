import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'W28', onTime: 0, inFull: 85 },
  { name: 'W29', onTime: 0, inFull: 85 },
  { name: 'W30', onTime: 0, inFull: 90 },
  { name: 'W31', onTime: 0, inFull: 92 },
  { name: 'W32', onTime: 0, inFull: 92 },
  { name: 'W33', onTime: 0, inFull: 88 },
  { name: 'W34', onTime: 0, inFull: 30 },
]

function PerformanceTrendsChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Performance Trends</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-500">On Time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">In Full</span>
          </div>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
            <Line
              type="monotone"
              dataKey="onTime"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="inFull"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PerformanceTrendsChart
