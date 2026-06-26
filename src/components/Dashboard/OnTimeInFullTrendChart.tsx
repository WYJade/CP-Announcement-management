import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'W28', value: 0 },
  { name: 'W29', value: 0 },
  { name: 'W30', value: 0 },
  { name: 'W31', value: 0 },
  { name: 'W32', value: 0 },
  { name: 'W33', value: 0 },
  { name: 'W34', value: 0 },
]

function OnTimeInFullTrendChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full">
      <h3 className="text-xs font-medium text-gray-500 mb-3">On Time, In Full Trend</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OnTimeInFullTrendChart
