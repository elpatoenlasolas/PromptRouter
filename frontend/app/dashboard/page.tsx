'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Clock,
  Settings,
  BarChart3,
  Info
} from 'lucide-react'
import SavingsChart from '@/components/dashboard/SavingsChart'
import RecentRequests from '@/components/dashboard/RecentRequests'
import { Skeleton } from '@/components/ui/Skeleton'
import { makeAuthenticatedRequest } from '@/lib/clerk-api'

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
  const { getToken } = useAuth()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const data = await makeAuthenticatedRequest<Metrics>('/v1/metrics', getToken)
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      // Set empty metrics on error
      setMetrics({
        total_requests: 0,
        total_tokens: 0,
        total_spend: 0,
        estimated_spend_without_routing: 0,
        total_saved: 0,
        average_latency_ms: 0,
        error_rate: 0,
      })
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
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-10 w-32 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="card">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Stats */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">Your Savings Dashboard</h1>
              
              <div className="grid md:grid-cols-4 gap-6">
                {/* Total Saved */}
                <div className="card bg-gradient-to-br from-primary to-accent text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-50 text-sm mb-1">Total Saved</p>
                      <p className="text-4xl font-bold">€{metrics?.total_saved.toFixed(2) || '0.00'}</p>
                      <p className="text-gray-100 text-sm mt-2">
                        {savingsPercentage}% less than standard pricing
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-gray-50" />
                  </div>
                </div>

                {/* Total Spend */}
                <Link href="/dashboard/usage" className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-dark-text-muted dark:text-gray-400 text-sm mb-1">Your Spend</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">€{metrics?.total_spend.toFixed(2) || '0.00'}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        vs €{metrics?.estimated_spend_without_routing.toFixed(2) || '0.00'} without routing
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-success dark:text-success" />
                  </div>
                </Link>

                {/* Total Requests */}
                <Link href="/dashboard/requests" className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-dark-text-muted dark:text-gray-400 text-sm mb-1">Total Requests</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {metrics?.total_requests.toLocaleString() || '0'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        {((metrics?.total_tokens || 0) / 1000).toFixed(1)}K tokens
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-primary dark:text-primary-light" />
                  </div>
                </Link>

                {/* Average Latency */}
                <div className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-dark-text-muted dark:text-gray-400 text-sm mb-1">Avg Latency</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {Math.round(metrics?.average_latency_ms || 0)}ms
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        {metrics?.error_rate.toFixed(2) || '0'}% error rate
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    Savings Over Time
                  </h2>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute right-0 top-6 hidden group-hover:block z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                      Shows cumulative savings from your actual requests vs. if you had always used GPT-4
                    </div>
                  </div>
                </div>
                <SavingsChart />
              </div>

              <div className="card">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link 
                    href="/dashboard/settings"
                    className="flex items-center p-4 bg-gray-50 dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Manage API Keys</p>
                      <p className="text-sm text-gray-600 dark:text-dark-text-muted">Add or update provider credentials</p>
                    </div>
                  </Link>
                  <Link 
                    href="/dashboard/playground"
                    className="flex items-center p-4 bg-gray-50 dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                  >
                    <Zap className="w-5 h-5 mr-3 text-gold-600" />
                    <div>
                      <p className="font-medium">Test Playground</p>
                      <p className="text-sm text-gray-600 dark:text-dark-text-muted">Try routing with different prompts</p>
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
