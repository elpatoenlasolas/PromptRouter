'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data - replace with real API data
const data = [
  { date: 'Jan 1', saved: 0, spent: 0 },
  { date: 'Jan 8', saved: 5.2, spent: 12.3 },
  { date: 'Jan 15', saved: 12.8, spent: 24.5 },
  { date: 'Jan 22', saved: 18.9, spent: 35.2 },
  { date: 'Jan 29', saved: 28.4, spent: 48.7 },
]

export default function SavingsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => `€${value.toFixed(2)}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="saved" 
            stroke="#10b981" 
            name="Saved"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="spent" 
            stroke="#0ea5e9" 
            name="Spent"
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
