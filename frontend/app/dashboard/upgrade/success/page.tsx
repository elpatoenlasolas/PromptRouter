'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Zap, Key, BarChart3 } from 'lucide-react'
import Confetti from 'react-confetti'

export default function UpgradeSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'starter'
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const tierInfo = {
    starter: {
      name: 'Starter',
      tokens: '500K',
      features: ['Priority routing', 'Email support', 'All providers'],
    },
    pro: {
      name: 'Pro',
      tokens: '5M',
      features: ['Custom routing rules', 'Priority support', 'Advanced analytics', 'Cost caps & alerts'],
    },
  }

  const info = tierInfo[tier as keyof typeof tierInfo] || tierInfo.starter

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="max-w-2xl w-full">
        <div className="card text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to {info.name}! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your upgrade was successful. Here's what you get:
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-900">Token Limit</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{info.tokens}/month</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-gray-900">Features</span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                {info.features.slice(0, 2).map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Features List */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">All {info.name} Features:</h3>
            <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
              {info.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
              <Key className="w-5 h-5 mr-2 text-blue-600" />
              Next Steps
            </h3>
            <ol className="text-sm text-gray-700 space-y-2 text-left">
              <li className="flex">
                <span className="font-bold text-blue-600 mr-2">1.</span>
                <span>Make sure your provider API keys are configured in Settings</span>
              </li>
              <li className="flex">
                <span className="font-bold text-blue-600 mr-2">2.</span>
                <span>Try the Playground to test routing with your new limits</span>
              </li>
              <li className="flex">
                <span className="font-bold text-blue-600 mr-2">3.</span>
                <span>Check your email for billing confirmation and invoice</span>
              </li>
            </ol>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/dashboard/playground"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Playground
            </Link>
          </div>
        </div>

        {/* Support CTA */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help getting started?{' '}
            <a href="mailto:support@promptrouter.com" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
