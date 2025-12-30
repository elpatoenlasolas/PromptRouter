import Link from 'next/link'
import { ArrowRight, Zap, DollarSign, Target } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">PromptRouter</div>
            <div className="space-x-4">
              <Link href="/sign-in" className="hover:underline">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Stop Overpaying for AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Automatically route every prompt to the cheapest model that meets your quality and speed requirements.
            <span className="block mt-2 font-semibold">Save hundreds of euros monthly.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-4 flex items-center justify-center">
              Start Saving Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="btn-secondary bg-primary-700 hover:bg-primary-600 text-white text-lg px-8 py-4">
              View Demo
            </Link>
          </div>
          <p className="mt-6 text-primary-100">
            Free tier: 10,000 tokens/month • No credit card required
          </p>
        </div>
      </header>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visible Savings</h3>
            <p className="text-gray-600">
              See exactly how much you save on every request. Dashboard shows total euros saved vs. what you would have paid.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Routing</h3>
            <p className="text-gray-600">
              AI-powered routing engine selects the optimal model based on cost, latency, and quality constraints.
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your API Keys</h3>
            <p className="text-gray-600">
              Bring your own API keys. We route, you own the data. No lock-in, no markup, just savings.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Connect API Keys</h3>
              <p className="text-gray-600">
                Add your OpenAI, Anthropic, Google, or Grok API keys. They're encrypted and never logged.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Send Prompts</h3>
              <p className="text-gray-600">
                Use our API to send prompts. Set cost, latency, and quality constraints.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Save Money</h3>
              <p className="text-gray-600">
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
          <div className="card border-2">
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

          <div className="card border-2 border-primary-600 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
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

          <div className="card border-2">
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
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start Saving on AI Costs Today
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of developers saving money with intelligent prompt routing
          </p>
          <Link href="/sign-up" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-4 inline-flex items-center">
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
