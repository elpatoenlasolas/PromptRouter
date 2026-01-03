'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Zap, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface UsageStats {
  tokens_used_this_month: number
  monthly_token_limit: number
  requests_this_month: number
  daily_usage: Array<{ date: string; tokens: number; requests: number }>
}

export default function UsagePage() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      // Get usage stats from config endpoint
      const configResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/config`)
      if (!configResponse.ok) {
        throw new Error('Failed to fetch config')
      }
      const configData = await configResponse.json()
      
      // Get metrics for requests count
      const metricsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/metrics?days=30`)
      const metricsData = metricsResponse.ok ? await metricsResponse.json() : { total_requests: 0 }
      
      // Get recent executions for daily usage
      const requestsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/requests?limit=100`)
      const requestsData = requestsResponse.ok ? await requestsResponse.json() : { requests: [] }
      
      // Calculate daily usage from requests
      const dailyUsageMap: Record<string, { tokens: number; requests: number }> = {}
      requestsData.requests?.forEach((req: any) => {
        const date = new Date(req.timestamp).toISOString().split('T')[0]
        if (!dailyUsageMap[date]) {
          dailyUsageMap[date] = { tokens: 0, requests: 0 }
        }
        dailyUsageMap[date].tokens += (req.input_tokens || 0) + (req.output_tokens || 0)
        dailyUsageMap[date].requests += 1
      })
      
      const dailyUsage = Object.entries(dailyUsageMap)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7) // Last 7 days
      
      setStats({
        tokens_used_this_month: configData.tokens_used_this_month || 0,
        monthly_token_limit: configData.monthly_token_limit || 10000,
        requests_this_month: metricsData.total_requests || 0,
        daily_usage: dailyUsage.length > 0 ? dailyUsage : []
      })
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
      // Set empty stats on error
      setStats({
        tokens_used_this_month: 0,
        monthly_token_limit: 10000,
        requests_this_month: 0,
        daily_usage: []
      })
    } finally {
      setLoading(false)
    }
  }

  const usagePercentage = stats 
    ? Math.round((stats.tokens_used_this_month / stats.monthly_token_limit) * 100)
    : 0

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
        <h1 className="text-3xl font-bold mb-2">Usage</h1>
        <p className="text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted">Monitor your token usage and limits</p>
      </div>

      {/* Usage Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-dark-text-muted dark:text-gray-400 text-sm mb-1">Tokens Used</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.tokens_used_this_month.toLocaleString() || '0'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                of {stats?.monthly_token_limit.toLocaleString() || '0'} limit
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary dark:text-primary-light" />
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{usagePercentage}% used</p>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-dark-text-muted dark:text-gray-400 text-sm mb-1">Requests This Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.requests_this_month.toLocaleString() || '0'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Average: {stats ? Math.round(stats.requests_this_month / 30) : 0} per day
              </p>
            </div>
            <Zap className="w-8 h-8 text-primary dark:text-primary-light" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-dark-text-muted dark:text-gray-400 text-sm mb-1">Remaining Tokens</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats ? (stats.monthly_token_limit - stats.tokens_used_this_month).toLocaleString() : '0'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Resets on the 1st of next month
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-success dark:text-success" />
          </div>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
          <Calendar className="w-5 h-5 mr-2 text-primary dark:text-primary-light" />
          Daily Usage (Last 7 Days)
        </h2>
        {stats?.daily_usage && stats.daily_usage.length > 0 ? (
          <div className="space-y-4">
            {stats.daily_usage.map((day, index) => {
              const dayPercentage = stats.monthly_token_limit > 0 
                ? Math.round((day.tokens / stats.monthly_token_limit) * 100)
                : 0
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {day.tokens.toLocaleString()} tokens • {day.requests} requests
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {day.tokens.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(dayPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No usage data yet</p>
            <p className="text-sm mt-2">Execute prompts to see daily usage statistics</p>
          </div>
        )}
      </div>
    </div>
  )
}

