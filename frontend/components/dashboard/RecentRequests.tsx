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
  input_tokens?: number
  output_tokens?: number
}

export default function RecentRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests?limit=5`)
      if (!response.ok) {
        throw new Error('Failed to fetch requests')
      }
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error('Failed to fetch requests:', error)
      setRequests([]) // Show empty state on error
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No requests yet</p>
        <p className="text-sm mt-2">Execute prompts in the Playground to see them here</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr className="text-left text-sm text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted">
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
                <span className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-dark-text dark:text-dark-text rounded text-xs">
                  {req.provider}
                </span>
              </td>
              <td className="py-3 text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {req.latency_ms}ms
                </div>
              </td>
              <td className="py-3 text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted">€{req.cost.toFixed(4)}</td>
              <td className="py-3 text-green-600 font-medium">+€{req.saved.toFixed(4)}</td>
              <td className="py-3">
                {req.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </td>
              <td className="py-3 text-gray-500">{formatTimestamp(req.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
