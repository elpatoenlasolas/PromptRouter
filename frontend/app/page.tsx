'use client'

import Link from 'next/link'
import { ArrowRight, Zap, DollarSign, Target } from 'lucide-react'
import MobileNav from '@/components/dashboard/MobileNav'
import { useUser } from '@clerk/nextjs'

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-base">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary to-accent dark:from-dark-base dark:to-dark-surface text-white">
        <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MobileNav publicOnly />
              <Link href="/" className="hidden sm:flex items-center gap-2">
                <img 
                  src="/images/logo-white.svg" 
                  alt="PromptRouter" 
                  className="h-8 w-auto"
                />
                <span className="text-2xl font-bold">PromptRouter</span>
              </Link>
            </div>
            <Link href="/" className="sm:hidden">
              <img 
                src="/images/logo-white.svg" 
                alt="PromptRouter" 
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/pricing" className="text-gray-50 hover:text-white transition-colors">
                Pricing
              </Link>
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <Link href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="btn-accent">
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
          <h1 className="heading-1 mb-6">
            Stop Overpaying for AI
          </h1>
          <p className="body-large mb-8 text-gray-100 dark:text-dark-text-muted max-w-2xl mx-auto">
            Automatically route every prompt to the cheapest model that meets your quality and speed requirements.
            <span className="block mt-2 font-semibold text-gray-50">Save hundreds of euros monthly.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Link href="/dashboard" className="btn-accent text-lg flex items-center justify-center">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <Link href="/sign-up" className="btn-accent text-lg flex items-center justify-center">
                Start Saving Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-success/10 dark:bg-success/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-success dark:text-success" />
            </div>
            <h3 className="heading-4 mb-2">Visible Savings</h3>
            <p className="caption">
              See exactly how much you save on every request. Dashboard shows total euros saved vs. what you would have paid.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-primary/10 dark:bg-primary-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary dark:text-primary-light" />
            </div>
            <h3 className="heading-4 mb-2">Smart Routing</h3>
            <p className="caption text-gray-600 dark:text-dark-text-muted">
              AI-powered routing engine selects the optimal model based on cost, latency, and quality constraints.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="heading-4 mb-2">Your API Keys</h3>
            <p className="caption text-gray-600 dark:text-dark-text-muted">
              Bring your own API keys. We route, you own the data. No lock-in, no markup, just savings.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-dark-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-2 text-center mb-4">How It Works</h2>
          <p className="body-large text-center text-gray-600 dark:text-dark-text-muted mb-12 max-w-2xl mx-auto">
            Simple integration. Immediate savings. No code changes required.
          </p>
          
          {/* Flowchart */}
          <div className="card shadow-xl mb-12 max-w-5xl mx-auto">
            <img 
              src="/flowchart-promptrouter.png" 
              alt="PromptRouter Implementation Flow - 5 steps from API key setup to cost savings tracking"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary dark:bg-primary-light text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                1
              </div>
              <h3 className="heading-4 mb-2">Connect API Keys</h3>
              <p className="caption text-gray-600 dark:text-dark-text-muted">
                Add your OpenAI, Anthropic, Google, or Grok API keys. They're encrypted and never logged.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary dark:bg-primary-light text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                2
              </div>
              <h3 className="heading-4 mb-2">Send Prompts</h3>
              <p className="caption text-gray-600 dark:text-dark-text-muted">
                Use our API to send prompts. Set cost, latency, and quality constraints.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary dark:bg-primary-light text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                3
              </div>
              <h3 className="heading-4 mb-2">Save Money</h3>
              <p className="caption text-gray-600 dark:text-dark-text-muted">
                We route to the cheapest model that meets your requirements. Watch savings accumulate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="heading-2 text-center mb-4">Simple Pricing</h2>
        <p className="body-large text-center text-gray-600 dark:text-dark-text-muted mb-12">
          You'll save more than the subscription cost
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card border-2 border-gray-200 dark:border-dark-border flex flex-col justify-between">
            <div>
              <h3 className="heading-3 mb-2">Free</h3>
              <p className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">€0<span className="body-large text-gray-500 dark:text-dark-text-muted">/mo</span></p>
              <p className="text-base text-gray-600 dark:text-dark-text-muted mb-6">Get started for free</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption">10K tokens/month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">All providers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">Dashboard access</span>
                </li>
              </ul>
            </div>
            <Link href="/sign-up" className="btn-ghost w-full block text-center">
              Start Free
            </Link>
          </div>

          <div className="card hover:shadow-lg cursor-pointer shadow-lg relative border-2 border-accent dark:border-accent flex flex-col justify-between">
            <div className="badge-accent absolute -top-3 left-1/2 -translate-x-1/2">
              Popular
            </div>
            <div>
              <h3 className="heading-3 mb-2">Starter</h3>
              <p className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">€15<span className="body-large text-gray-500 dark:text-dark-text-muted">/mo</span></p>
              <p className="text-base text-gray-600 dark:text-dark-text-muted mb-6">For indie developers</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">500K tokens/month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">All providers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">Priority routing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">Email support</span>
                </li>
              </ul>
            </div>
            <Link href="/sign-up" className="btn-accent w-full block text-center">
              Get Started
            </Link>
          </div>

          <div className="card border-2 border-gray-200 dark:border-dark-border flex flex-col justify-between">
            <div>
              <h3 className="heading-3 mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">€25<span className="body-large text-gray-500 dark:text-dark-text-muted">/mo</span></p>
              <p className="text-base text-gray-600 dark:text-dark-text-muted mb-6">For power users</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">5M tokens/month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">All providers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">Custom routing rules</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success dark:text-success mr-2 text-lg">✓</span>
                  <span className="caption text-gray-700 dark:text-dark-text">Priority support</span>
                </li>
              </ul>
            </div>
            <Link href="/sign-up" className="btn-primary w-full block text-center">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 mb-4">
            Start Saving on AI Costs Today
          </h2>
          <p className="body-large mb-8 text-gray-100">
            Join hundreds of developers saving money with intelligent prompt routing
          </p>
          <Link href="/sign-up" className="btn-accent text-lg inline-flex items-center shadow-lg">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-dark-text-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="caption">&copy; 2025 PromptRouter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
