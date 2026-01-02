'use client'

import Link from 'next/link'
import { ArrowRight, Zap, DollarSign, Target } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser()
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black text-white">
        <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">PromptRouter</div>
            <div className="space-x-4">
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <Link href="/dashboard" className="btn-primary bg-white text-gray-900 hover:bg-gray-50">
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/sign-in" className="hover:underline">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="btn-primary bg-white text-gray-900 hover:bg-gray-50">
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Stop Overpaying for AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 dark:text-gray-400 max-w-3xl mx-auto">
            Automatically route every prompt to the cheapest model that meets your quality and speed requirements.
            <span className="block mt-2 font-semibold">Save hundreds of euros monthly.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Link href="/dashboard" className="bg-white text-gray-900 hover:bg-gray-50 text-lg px-8 py-4 rounded-lg font-medium flex items-center justify-center shadow-lg transition-all">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link href="/sign-up" className="bg-white text-gray-900 hover:bg-gray-50 text-lg px-8 py-4 rounded-lg font-medium flex items-center justify-center shadow-lg transition-all">
                  Start Saving Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/dashboard" className="bg-gray-700/40 hover:bg-gray-700/50 backdrop-blur-sm text-white text-lg px-8 py-4 rounded-lg font-medium transition-all">
                  View Demo
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-gray-300 dark:text-gray-400">
            Free tier: 10,000 tokens/month • No credit card required
          </p>
        </div>
      </header>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visible Savings</h3>
            <p className="text-gray-600">
              See exactly how much you save on every request. Dashboard shows total euros saved vs. what you would have paid.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-900 dark:text-gray-100" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Smart Routing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered routing engine selects the optimal model based on cost, latency, and quality constraints.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-900 dark:text-gray-100" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Your API Keys</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bring your own API keys. We route, you own the data. No lock-in, no markup, just savings.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6 dark:text-white">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto text-lg">
            Simple integration. Immediate savings. No code changes required.
          </p>
          
          {/* Flowchart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-950 p-8 mb-12 max-w-5xl mx-auto">
            <img 
              src="/flowchart-promptrouter.png" 
              alt="PromptRouter Implementation Flow - 5 steps from API key setup to cost savings tracking"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Connect API Keys</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add your OpenAI, Anthropic, Google, or Grok API keys. They're encrypted and never logged.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Send Prompts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use our API to send prompts. Set cost, latency, and quality constraints.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Save Money</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We route to the cheapest model that meets your requirements. Watch savings accumulate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          You'll save more than the subscription cost
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card border-2 flex flex-col justify-between">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-4">€0<span className="text-lg text-gray-600">/mo</span></p>
            <p className="text-gray-600 mb-6">Get started for free</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                10K tokens/month
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                All providers
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                Dashboard access
              </li>
            </ul>
            <Link href="/sign-up" className="btn-secondary w-full block text-center">
              Start Free
            </Link>
          </div>

          <div className="card shadow-lg relative border-2 border-gray shadow-md flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-4xl font-bold mb-4">€15<span className="text-lg text-gray-600">/mo</span></p>
            <p className="text-gray-600 mb-6">For indie developers</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                500K tokens/month
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                All providers
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                Priority routing
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                Email support
              </li>
            </ul>
            <Link href="/sign-up" className="btn-primary w-full block text-center">
              Get Started
            </Link>
          </div>

          <div className="card border-2 flex flex-col justify-between">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-4">€25<span className="text-lg text-gray-600">/mo</span></p>
            <p className="text-gray-600 mb-6">For power users</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                5M tokens/month
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                All providers
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                Custom routing rules
              </li>
              <li className="flex items-start">
                <span className="text-success mr-2">✓</span>
                Priority support
              </li>
            </ul>
            <Link href="/sign-up" className="btn-secondary w-full block text-center">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start Saving on AI Costs Today
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join hundreds of developers saving money with intelligent prompt routing
          </p>
          <Link href="/sign-up" className="bg-white text-gray-800 hover:bg-gray-50 text-lg px-8 py-4 rounded-lg font-medium inline-flex items-center shadow-lg transition-all">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 PromptRouter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
