'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/lib/toast'
import { api } from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function UpgradePage() {
  const router = useRouter()
  const { user } = useUser()
  const { showToast } = useToast()
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleUpgrade = async (tier: 'starter' | 'pro') => {
    setLoadingTier(tier)
    try {
      const data = await api.post<{ checkout_url: string }>('/v1/create-checkout-session', { tier })
      window.location.href = data.checkout_url
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
        'error'
      )
      setLoadingTier(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-14">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-white dark:hover:text-white dark:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Settings
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-dark-text-muted">
            Upgrade to unlock higher limits and advanced features
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-blue-500 p-8 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                Popular
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
              <p className="text-sm text-gray-600 mb-4">For indie developers</p>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">€15</span>
                <span className="text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted"> / month</span>
              </div>
              <p className="text-gray-600 dark:text-dark-text-muted text-sm">
                Get started with professional routing and priority support.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>500K tokens</strong> / month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">All routing modes</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority routing</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Email support</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Full savings dashboard</span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('starter')}
              disabled={loadingTier !== null}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingTier === 'starter' && <LoadingSpinner size="sm" />}
              {loadingTier === 'starter' ? 'Processing...' : 'Upgrade to Starter'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-gold-500 p-8 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gold-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                Best Value
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
              <p className="text-sm text-gray-600 mb-4">It pays for itself</p>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">€25</span>
                <span className="text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted"> / month</span>
              </div>
              <p className="text-gray-600 dark:text-dark-text-muted text-sm mb-3">
                For users who want real savings and control over their AI spend.
              </p>
              <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                <p className="text-success text-sm font-medium">
                  💰 Average savings: €60+ per month
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>5M tokens</strong> / month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">All routing modes</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Custom routing rules</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Cost caps & alerts</span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('pro')}
              disabled={loadingTier !== null}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingTier === 'pro' && <LoadingSpinner size="sm" />}
              {loadingTier === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Elite Plan */}
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-purple-500 p-8 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                Maximum Savings
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Elite</h3>
              <p className="text-sm text-gray-600 mb-4">For power users</p>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">Custom</span>
                <span className="text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted"> / month</span>
              </div>
              <p className="text-gray-600 dark:text-dark-text-muted text-sm">
                For power users running large volumes who want maximum optimization.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>5M+ tokens</strong> / month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Custom routing rules</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Shadow benchmarking</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Exportable reports (CSV/PDF)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority routing</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Dedicated support</span>
              </li>
            </ul>

            <a
              href="mailto:patofunes@gmail.com?subject=Elite%20Plan%20Inquiry&body=Hi,%20I'm%20interested%20in%20the%20Elite%20plan."
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-sm hover:shadow text-center block"
            >
              Contact Sales
            </a>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-dark-text-muted">
            🔒 Secure payment powered by Stripe • Cancel anytime • No long-term contracts
          </p>
        </div>
      </div>
    </div>
  )
}
