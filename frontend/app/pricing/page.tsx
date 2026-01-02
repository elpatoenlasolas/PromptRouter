import Link from 'next/link'
import { Check, X, ArrowRight, BarChart3, Info } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export const dynamic = 'force-dynamic'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#ede7e3]">
      <DashboardHeader />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 text-white py-20 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">🎯 Save up to 99.5% on AI costs</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Stop overpaying for AI.
            </h1>
            <p className="text-xl text-primary-50 mb-4">
              PromptRouter automatically routes every prompt to the cheapest model that meets your requirements.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 max-w-xl mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">30-50</div>
                  <div className="text-xs text-primary-100">prompts/day</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-300">€16</div>
                  <div className="text-xs text-primary-100">saved/month</div>
                </div>
                <div className="group relative">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-3xl font-bold text-green-300">99%</div>
                    <Info className="w-4 h-4 text-primary-200 hover:text-white cursor-help" />
                  </div>
                  <div className="text-xs text-primary-100">savings</div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                    vs. always using GPT-4 (€0.03/1K tokens)
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center shadow-lg"
              >
                Start free
              </Link>
              <Link
                href="/dashboard/playground"
                className="bg-primary-700 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center border-2 border-white/30"
              >
                Calculate your savings
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-lg">
            Used by indie developers, agencies, and AI-first startups
          </p>
          {/* Placeholder for logos - can be added later */}
        </div>
      </section>

      {/* How It Works - Flowchart */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in 5 minutes. No code changes required.
            </p>
          </div>
          
          {/* Flowchart Image */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <img 
              src="/flowchart-promptrouter.png" 
              alt="PromptRouter Implementation Flow - 5 steps from API key setup to cost savings tracking"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              Replace one API endpoint and start saving immediately
            </p>
          </div>

          {/* Detailed Steps */}
          <div className="grid md:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 border-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get API Key</h3>
              <p className="text-sm text-gray-600">
                Sign up and get your <code className="bg-gray-100 px-1 rounded">pr_live_xxx</code> token in 2 minutes
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 border-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Provider Keys</h3>
              <p className="text-sm text-gray-600">
                Connect OpenAI, Anthropic, Google AI, and Grok API keys
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 border-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Replace Endpoint</h3>
              <p className="text-sm text-gray-600 mb-2">
                Change one line:
              </p>
              <code className="text-xs bg-gray-100 p-1">
                promptrouter.com/v1/prompt
              </code>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 border-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Routing</h3>
              <p className="text-sm text-gray-600">
                Every request is analyzed and routed to the optimal model automatically
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-green-300 border-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Savings</h3>
              <p className="text-sm text-gray-600 mb-2">
                See real-time cost reduction:
              </p>
              <div className="text-xs text-gray-700 space-y-1">
                <div>• 85-99% savings</div>
                <div>• Per-request costs</div>
                <div>• Monthly reports</div>
              </div>
            </div>
          </div>

          {/* Real Results */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Real Results</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-sm text-green-100 mb-2">Startup (500/day)</div>
                <div className="text-4xl font-bold mb-1">€3,024</div>
                <div className="text-sm text-green-100">saved per year</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-green-100 mb-2">Scale-up (2,000/day)</div>
                <div className="text-4xl font-bold mb-1">€12,096</div>
                <div className="text-sm text-green-100">saved per year</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-green-100 mb-2">Enterprise (10,000/day)</div>
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
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-sm text-gray-600 mb-4">See the magic</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€0</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Perfect for trying PromptRouter and seeing how much you could save.
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 10K tokens / month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Smart routing mode</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic savings dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Estimated cost comparison</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/sign-up"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Try free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-primary-600 p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-sm text-gray-600 mb-4">It pays for itself</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€25</span>
                  <span className="text-gray-600"> / month</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  For users who want real savings and control over their AI spend.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">
                    💰 Most users save €40+ per month on this plan.
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 250K tokens / month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cheap, Fast, and Smart routing modes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Batch prompt processing</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Daily and monthly cost caps</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Spending alerts</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full savings dashboard</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/sign-up"
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Start saving
                </Link>
              </div>
            </div>

            {/* Power Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Power</h3>
                <p className="text-sm text-gray-600 mb-4">Maximum savings</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€59</span>
                  <span className="text-gray-600"> / month</span>
                </div>
                <p className="text-gray-600 text-sm">
                  For power users running large volumes who want maximum optimization.
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 1M tokens / month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom routing rules</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Shadow benchmarking</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Exportable reports (CSV / PDF)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority routing</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/sign-up"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Optimize at scale
                </Link>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Power</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Visible savings</td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Smart routing</td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Cheap / Fast modes</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Batch processing</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Cost caps & alerts</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Custom routing rules</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Shadow benchmarking</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">Exportable reports</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Savings Example */}
      <section id="savings-example" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">A real-world example</h2>
            <p className="text-gray-600 text-lg">
              A typical user running 100,000 prompts per month.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Without PromptRouter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Without PromptRouter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">€112</div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No optimization</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manual model selection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* With PromptRouter */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-green-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  With PromptRouter
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">With PromptRouter</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">€68</div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Automatic routing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Optimized costs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Your savings</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-green-100 mb-1">Monthly savings</p>
                    <p className="text-3xl font-bold">€44</p>
                  </div>
                  <div className="border-t border-green-400 pt-4">
                    <p className="text-sm text-green-100 mb-1">Plan cost</p>
                    <p className="text-2xl font-bold">€25</p>
                  </div>
                  <div className="border-t border-green-400 pt-4">
                    <p className="text-sm text-green-100 mb-1">Net ROI</p>
                    <p className="text-3xl font-bold">+€19</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA to Playground */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg border-2 border-primary-200 p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Want to see YOUR savings?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Use our interactive calculator to estimate how much you'd save based on your workload
              </p>
              <Link
                href="/dashboard/playground"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Try the Savings Calculator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What if I don't save money?
              </h3>
              <p className="text-gray-600">
                PromptRouter is designed so that most users save more than the subscription cost. If you don't, the free plan lets you walk away without risk.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do you see or store my prompts?
              </h3>
              <p className="text-gray-600">
                No. We never train on or log your prompt content. All API keys are encrypted.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes. No lock-in, no long-term contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Start saving on AI today</h2>
          <p className="text-xl text-primary-100 mb-8">
            Connect your API keys and see savings in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors justify-center"
            >
              Try PromptRouter for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/dashboard/playground"
              className="inline-flex items-center bg-primary-700 hover:bg-primary-800 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colors justify-center"
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

