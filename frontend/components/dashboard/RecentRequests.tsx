'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface Request {
  id: number
  model: string
  provider: string
  latency_ms: number
  cost: number
  saved: number
  timestamp: string
  success: boolean
}

export default function RecentRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with real API call
    setRequests([
      {
        id: 1,
        model: 'claude-3-haiku',
        provider: 'anthropic',
        latency_ms: 650,
        cost: 0.0023,
        saved: 0.0177,
        timestamp: '2 minutes ago',
        success: true,
      },
      {
        id: 2,
        model: 'gpt-3.5-turbo',
        provider: 'openai',
        latency_ms: 820,
        cost: 0.0015,
        saved: 0.0285,
        timestamp: '8 minutes ago',
        success: true,
      },
      {
        id: 3,
        model: 'gemini-pro',
        provider: 'google',
        latency_ms: 920,
        cost: 0.0008,
        saved: 0.0292,
        timestamp: '14 minutes ago',
        success: true,
      },
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr className="text-left text-sm text-gray-600">
            <th className="pb-3 font-medium">Model</th>
            <th className="pb-3 font-medium">Provider</th>
            <th className="pb-3 font-medium">Latency</th>
            <th className="pb-3 font-medium">Cost</th>
            <th className="pb-3 font-medium">Saved</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req) => (
            <tr key={req.id} className="text-sm">
              <td className="py-3 font-medium">{req.model}</td>
              <td className="py-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {req.provider}
                </span>
              </td>
              <td className="py-3 text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {req.latency_ms}ms
                </div>
              </td>
              <td className="py-3 text-gray-600">€{req.cost.toFixed(4)}</td>
              <td className="py-3 text-green-600 font-medium">+€{req.saved.toFixed(4)}</td>
              <td className="py-3">
                {req.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </td>
              <td className="py-3 text-gray-500">{req.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
