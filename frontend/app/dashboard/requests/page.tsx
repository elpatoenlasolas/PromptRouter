'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react'
import Link from 'next/link'

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
  routing_reason?: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProvider, setFilterProvider] = useState<string>('all')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      // TODO: Replace with real API endpoint when available
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests`)
      // const data = await response.json()
      // setRequests(data)
      
      // Mock data for now
      const mockRequests: Request[] = [
        {
          id: 1,
          model: 'claude-3-haiku',
          provider: 'anthropic',
          latency_ms: 650,
          cost: 0.0023,
          saved: 0.0177,
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          success: true,
          input_tokens: 150,
          output_tokens: 200,
          routing_reason: 'Best cost/quality ratio for this prompt',
        },
        {
          id: 2,
          model: 'gpt-3.5-turbo',
          provider: 'openai',
          latency_ms: 820,
          cost: 0.0015,
          saved: 0.0285,
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          success: true,
          input_tokens: 120,
          output_tokens: 180,
          routing_reason: 'Lowest cost option available',
        },
        {
          id: 3,
          model: 'gemini-pro',
          provider: 'google',
          latency_ms: 920,
          cost: 0.0008,
          saved: 0.0292,
          timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
          success: true,
          input_tokens: 200,
          output_tokens: 150,
          routing_reason: 'Optimal for this token count',
        },
        {
          id: 4,
          model: 'gpt-4',
          provider: 'openai',
          latency_ms: 1200,
          cost: 0.0450,
          saved: 0.0,
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          success: true,
          input_tokens: 300,
          output_tokens: 400,
          routing_reason: 'Quality constraint required premium model',
        },
        {
          id: 5,
          model: 'claude-3-sonnet',
          provider: 'anthropic',
          latency_ms: 1100,
          cost: 0.0120,
          saved: 0.0330,
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          success: false,
          input_tokens: 180,
          output_tokens: 0,
          routing_reason: 'Selected for balanced performance',
        },
      ]
      setRequests(mockRequests)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
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

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.routing_reason?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterProvider === 'all' || req.provider === filterProvider
    
    return matchesSearch && matchesFilter
  })

  const providers = Array.from(new Set(requests.map(r => r.provider)))

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Requests</h1>
        <p className="text-gray-600">View and analyze all your prompt executions</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by model, provider, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Providers</option>
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || filterProvider !== 'all' 
              ? 'No requests match your filters'
              : 'No requests found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Model</th>
                  <th className="pb-3 font-medium">Provider</th>
                  <th className="pb-3 font-medium">Tokens</th>
                  <th className="pb-3 font-medium">Latency</th>
                  <th className="pb-3 font-medium">Cost</th>
                  <th className="pb-3 font-medium">Saved</th>
                  <th className="pb-3 font-medium">Reason</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      {req.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="py-3 font-medium">{req.model}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                        {req.provider}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">
                      {req.input_tokens && req.output_tokens ? (
                        <span>
                          {req.input_tokens + req.output_tokens} 
                          <span className="text-gray-400 ml-1">
                            ({req.input_tokens}→{req.output_tokens})
                          </span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {req.latency_ms}ms
                      </div>
                    </td>
                    <td className="py-3 text-gray-900 font-medium">€{req.cost.toFixed(4)}</td>
                    <td className="py-3">
                      {req.saved > 0 ? (
                        <span className="text-green-600 font-medium">+€{req.saved.toFixed(4)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600 max-w-xs truncate" title={req.routing_reason}>
                      {req.routing_reason || '-'}
                    </td>
                    <td className="py-3 text-gray-500">{formatTimestamp(req.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-gray-900">
            €{filteredRequests.reduce((sum, r) => sum + r.cost, 0).toFixed(4)}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-green-600">
            €{filteredRequests.reduce((sum, r) => sum + r.saved, 0).toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  )
}

