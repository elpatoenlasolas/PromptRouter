'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Clock,
  Settings,
  BarChart3
} from 'lucide-react'
import SavingsChart from '@/components/dashboard/SavingsChart'
import RecentRequests from '@/components/dashboard/RecentRequests'

export const dynamic = 'force-dynamic'

interface Metrics {
  total_requests: number
  total_tokens: number
  total_spend: number
  estimated_spend_without_routing: number
  total_saved: number
  average_latency_ms: number
  error_rate: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/metrics`)
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const savingsPercentage = metrics 
    ? ((metrics.total_saved / metrics.estimated_spend_without_routing) * 100).toFixed(1)
    : '0'

  return (
    <>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Hero Stats */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">Your Savings Dashboard</h1>
              
              <div className="grid md:grid-cols-4 gap-6">
                {/* Total Saved */}
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Total Saved</p>
                      <p className="text-4xl font-bold">€{metrics?.total_saved.toFixed(2) || '0.00'}</p>
                      <p className="text-green-100 text-sm mt-2">
                        {savingsPercentage}% less than standard pricing
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-green-100" />
                  </div>
                </div>

                {/* Total Spend */}
                <div className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Your Spend</p>
                      <p className="text-3xl font-bold text-gray-900">€{metrics?.total_spend.toFixed(2) || '0.00'}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        vs €{metrics?.estimated_spend_without_routing.toFixed(2) || '0.00'} without routing
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary-600" />
                  </div>
                </div>

                {/* Total Requests */}
                <div className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Total Requests</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics?.total_requests.toLocaleString() || '0'}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        {((metrics?.total_tokens || 0) / 1000).toFixed(1)}K tokens
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-primary-600" />
                  </div>
                </div>

                {/* Average Latency */}
                <div className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Avg Latency</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(metrics?.average_latency_ms || 0)}ms
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        {metrics?.error_rate.toFixed(2) || '0'}% error rate
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                  Savings Over Time
                </h2>
                <SavingsChart />
              </div>

              <div className="card">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link 
                    href="/dashboard/settings"
                    className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">Manage API Keys</p>
                      <p className="text-sm text-gray-600">Add or update provider credentials</p>
                    </div>
                  </Link>
                  <Link 
                    href="/dashboard/playground"
                    className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Zap className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">Test Playground</p>
                      <p className="text-sm text-gray-600">Try routing with different prompts</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Recent Requests</h2>
              <RecentRequests />
            </div>
          </>
        )}
    </>
  )
}
