'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Request {
  id: number
  model: string
  provider: string
  cost: number
  saved: number
  timestamp: string
  success: boolean
}

interface ChartDataPoint {
  date: string
  savedCumulative: number
  cost: number
  gpt4Cost: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-2">{payload[0].payload.date}</p>
        <div className="space-y-1 text-xs">
          <p className="text-green-600 font-medium">
            💰 Saved: €{payload[0].payload.savedCumulative.toFixed(2)}
          </p>
          <p className="text-blue-600">
            Your cost: €{payload[0].payload.cost.toFixed(2)}
          </p>
          <p className="text-red-600">
            GPT-4 cost: €{payload[0].payload.gpt4Cost.toFixed(2)}
          </p>
          <p className="text-gray-600 border-t pt-1 mt-1">
            Savings: {payload[0].payload.gpt4Cost > 0 ? ((payload[0].payload.savedCumulative / payload[0].payload.gpt4Cost) * 100).toFixed(1) : '0'}%
          </p>
        </div>
      </div>
    )
  }
  return null
}

export default function SavingsChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAndProcessData()
  }, [])

  const fetchAndProcessData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests?limit=100`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      
      const data = await response.json()
      const requests: Request[] = data.requests || []

      if (requests.length === 0) {
        // Show default data if no requests yet
        setChartData([
          { date: 'Week 1', savedCumulative: 0, cost: 0, gpt4Cost: 0 },
          { date: 'Week 2', savedCumulative: 0, cost: 0, gpt4Cost: 0 },
          { date: 'Week 3', savedCumulative: 0, cost: 0, gpt4Cost: 0 },
          { date: 'Week 4', savedCumulative: 0, cost: 0, gpt4Cost: 0 },
        ])
        setLoading(false)
        return
      }

      // Sort by timestamp
      requests.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      // Group by day
      const dailyData = new Map<string, { saved: number, cost: number }>()
      
      requests.forEach(req => {
        const date = new Date(req.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const existing = dailyData.get(date) || { saved: 0, cost: 0 }
        dailyData.set(date, {
          saved: existing.saved + req.saved,
          cost: existing.cost + req.cost
        })
      })

      // Convert to cumulative chart data
      let cumulativeSaved = 0
      let cumulativeCost = 0
      const points: ChartDataPoint[] = []

      Array.from(dailyData.entries()).forEach(([date, values]) => {
        cumulativeSaved += values.saved
        cumulativeCost += values.cost
        const gpt4Cost = cumulativeCost + cumulativeSaved

        points.push({
          date,
          savedCumulative: cumulativeSaved,
          cost: cumulativeCost,
          gpt4Cost
        })
      })

      // If we have more than 10 points, aggregate by week
      if (points.length > 10) {
        const weeklyData: ChartDataPoint[] = []
        for (let i = 0; i < points.length; i += 7) {
          const weekPoints = points.slice(i, i + 7)
          if (weekPoints.length > 0) {
            const lastPoint = weekPoints[weekPoints.length - 1]
            weeklyData.push({
              date: `Week ${Math.floor(i / 7) + 1}`,
              savedCumulative: lastPoint.savedCumulative,
              cost: lastPoint.cost,
              gpt4Cost: lastPoint.gpt4Cost
            })
          }
        }
        setChartData(weeklyData)
      } else {
        setChartData(points)
      }

    } catch (error) {
      console.error('Failed to fetch chart data:', error)
      // Show empty chart on error
      setChartData([
        { date: 'No data', savedCumulative: 0, cost: 0, gpt4Cost: 0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12}
            tick={{ fill: '#666' }}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tick={{ fill: '#666' }}
            label={{ value: '€', angle: 0, position: 'top', offset: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="savedCumulative" 
            stroke="#10b981" 
            name="Total Saved (Cumulative)"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7 }}
          />
          <Line 
            type="monotone" 
            dataKey="gpt4Cost" 
            stroke="#ef4444" 
            name="GPT-4 Would Cost"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#ef4444', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="cost" 
            stroke="#0ea5e9" 
            name="Your Actual Cost"
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
