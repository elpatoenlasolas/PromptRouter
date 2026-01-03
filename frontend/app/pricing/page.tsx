'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRight, BarChart3, Info } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast'
import { api } from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export const dynamic = 'force-dynamic'

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { showToast } = useToast()
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleUpgrade = async (tier: 'starter' | 'pro') => {
    if (!isLoaded) return
    
    if (!user) {
      router.push('/sign-up')
      return
    }

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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-base">
      <DashboardHeader />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent dark:from-dark-base dark:to-dark-surface text-white py-20 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">🎯 Save up to 99.5% on AI costs</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Stop overpaying for AI.
            </h1>
            <p className="text-xl text-gray-300 dark:text-gray-400 mb-4">
              PromptRouter automatically routes every prompt to the cheapest model that meets your requirements.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 max-w-xl mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">30-50</div>
                  <div className="text-xs text-gray-300 dark:text-gray-400">prompts/day</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">€16</div>
                  <div className="text-xs text-gray-300 dark:text-gray-400">saved/month</div>
                </div>
                <div className="group relative">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-3xl font-bold text-yellow-300">99%</div>
                    <Info className="w-4 h-4 text-gray-300 dark:text-gray-400 hover:text-white cursor-help" />
                  </div>
                  <div className="text-xs text-gray-300 dark:text-gray-400">savings</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                    vs. always using GPT-4 (€0.03/1K tokens)
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border font-semibold py-3 px-8 rounded-lg transition-all inline-flex items-center justify-center shadow-lg"
              >
                Start free
              </Link>
              <Link
                href="/dashboard/playground"
                className="bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-lg transition-all inline-flex items-center justify-center"
              >
                Calculate your savings
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      {/* <section className="py-12 bg-white border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 dark:text-dark-text-muted text-lg">
            Used by indie developers, agencies, and AI-first startups
          </p>
        </div>
      </section> */}

      {/* How It Works - Flowchart */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in 5 minutes. No code changes required.
            </p>
          </div>
          
          {/* Flowchart Image */}
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl dark:shadow-gray-950 p-8 mb-12">
            <img 
              src="/flowchart-promptrouter.png" 
              alt="PromptRouter Implementation Flow - 5 steps from API key setup to cost savings tracking"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Replace one API endpoint and start saving immediately
            </p>
          </div>

          {/* Detailed Steps */}
          <div className="grid md:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border-2 border-gray-300 dark:border-dark-border dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Get API Key</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sign up and get your <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pr_live_xxx</code> token in 2 minutes
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border-2 border-gray-300 dark:border-dark-border dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Provider Keys</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect OpenAI, Anthropic, Google AI, and Grok API keys
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border-2 border-gray-300 dark:border-dark-border dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Replace Endpoint</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Change one line:
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1">
                promptrouter.com/v1/prompt
              </code>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border-2 border-gray-300 dark:border-dark-border dark:border-gray-700">
              <div className="w-12 h-12 bg-success/10 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-success dark:text-success">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Auto-Routing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Every request is analyzed and routed to the optimal model automatically
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-success/5 dark:bg-green-900/20 rounded-lg p-6 shadow-sm border-2 border-green-300 dark:border-green-800">
              <div className="w-12 h-12 bg-success/10 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-success dark:text-success">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Track Savings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                See real-time cost reduction:
              </p>
              <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <div>• 85-99% savings</div>
                <div>• Per-request costs</div>
                <div>• Monthly reports</div>
              </div>
            </div>
          </div>

          {/* Real Results */}
          <div className="mt-12 bg-gradient-to-br from-primary to-accent dark:from-dark-base dark:to-dark-surface rounded-2xl p-8 text-white border border-gray-700 dark:border-gray-800">
            <h3 className="text-4xl font-bold mb-6 text-center">Real Results</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-s text-green-100 mb-2">Startup (500/day)</div>
                <div className="text-4xl font-bold mb-1">€3,024</div>
                <div className="text-sm text-green-100">saved per year</div>
              </div>
              <div className="text-center">
                <div className="text-s text-green-100 mb-2">Scale-up (2,000/day)</div>
                <div className="text-4xl font-bold mb-1">€12,096</div>
                <div className="text-sm text-green-100">saved per year</div>
              </div>
              <div className="text-center">
                <div className="text-s text-green-100 mb-2">Enterprise (10,000/day)</div>
                <div className="text-4xl font-bold mb-1">€64,368</div>
                <div className="text-sm text-green-100">saved per year</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Free</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">See the magic</p>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">€0</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Perfect for trying PromptRouter and seeing how much you could save.
                </p>
              </div>

              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">10K tokens / month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Smart routing</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Basic dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Cost comparison</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/sign-up"
                  className="block w-full text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  Try free
                </Link>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-dark-border dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gray-800 dark:bg-gray-700 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                  Popular
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Starter</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">For indie devs</p>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">€15</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm"> / mo</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Professional routing and priority support.
                </p>
              </div>

              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">500K tokens/mo</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">All routing modes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Priority routing</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Email support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Full dashboard</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleUpgrade('starter')}
                  disabled={loadingTier !== null}
                  className="block w-full text-center bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loadingTier === 'starter' && <LoadingSpinner size="sm" />}
                  {loadingTier === 'starter' ? 'Processing...' : (user ? 'Upgrade' : 'Start')}
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-dark-border dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                  Best Value
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Pro</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Pays for itself</p>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">€25</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm"> / mo</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                  Real savings and AI spend control.
                </p>
                <div className="bg-success/5 dark:bg-green-900/20 border border-success/20 dark:border-green-800 rounded-lg p-2">
                  <p className="text-success dark:text-green-300 text-xs font-medium">
                    💰 Avg savings: €60+/mo
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">5M tokens/mo</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">All routing modes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Custom rules</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Cost caps & alerts</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={loadingTier !== null}
                  className="block w-full text-center bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loadingTier === 'pro' && <LoadingSpinner size="sm" />}
                  {loadingTier === 'pro' ? 'Processing...' : (user ? 'Upgrade' : 'Start')}
                </button>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Elite</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Max savings</p>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">Custom</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm"> / mo</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Power users running large volumes.
                </p>
              </div>

              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">5M+ tokens/mo</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Custom rules</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Shadow benchmark</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Export reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Priority routing</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="mailto:patofunes@gmail.com?subject=Elite%20Plan%20Inquiry&body=Hi,%20I'm%20interested%20in%20the%20Elite%20plan."
                  className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-colors text-center block text-sm"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Compare plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Visible savings</td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Smart routing</td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Cheap / Fast modes</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Batch processing</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Cost caps & alerts</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Custom routing rules</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Shadow benchmarking</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50">
                  <td className="py-4 px-6 text-gray-700 dark:text-dark-text">Exportable reports</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-success mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                What if I don't save money?
              </h3>
              <p className="text-gray-600 dark:text-dark-text-muted">
                PromptRouter is designed so that most users save more than the subscription cost. If you don't, the free plan lets you walk away without risk.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Do you see or store my prompts?
              </h3>
              <p className="text-gray-600 dark:text-dark-text-muted">
                No. We never train on or log your prompt content. All API keys are encrypted.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-dark-text-muted">
                Yes. No lock-in, no long-term contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent dark:from-dark-base dark:to-dark-surface text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Start saving on AI today</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">
            Connect your API keys and see savings in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border font-semibold py-3 px-8 rounded-lg transition-colors justify-center"
            >
              Try PromptRouter for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/dashboard/playground"
              className="inline-flex items-center bg-gray-700 hover:bg-gray-800 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colors justify-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Calculate Your Savings
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

