'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Key, Zap, CheckCircle } from 'lucide-react'
import { useToast } from '@/lib/toast'
import { api } from '@/lib/api'

export default function OnboardingPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    grok: '',
  })
  const [testPrompt, setTestPrompt] = useState('Write a short haiku about coding')
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAddKey = async (provider: string, key: string) => {
    try {
      await api.post('/v1/api-keys', { provider, api_key: key })
      return true
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add API key', 'error')
      return false
    }
  }

  const handleNextStep = async () => {
    if (step === 1) {
      const entries = Object.entries(apiKeys).filter(([_, value]) => value)
      if (entries.length === 0) {
        showToast('Please add at least one API key', 'warning')
        return
      }
      
      setLoading(true)
      for (const [provider, key] of entries) {
        await handleAddKey(provider, key)
      }
      setLoading(false)
      setStep(2)
    } else if (step === 2) {
      setLoading(true)
      try {
        const result = await api.post('/v1/prompt', {
          prompt: testPrompt,
          max_tokens: 100,
        })
        setTestResult(result)
        showToast('Test prompt executed successfully!', 'success')
        setStep(3)
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to execute test prompt', 'error')
      } finally {
        setLoading(false)
      }
    } else if (step === 3) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-base flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-dark-text">Step {step} of 3</span>
            <span className="text-sm text-gray-500 dark:text-dark-text-muted">{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Connect API Keys */}
        {step === 1 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Connect Your API Keys</h2>
                <p className="text-gray-600 dark:text-dark-text-muted">Add at least one provider to get started</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'OpenAI', key: 'openai', placeholder: 'sk-...' },
                { name: 'Anthropic', key: 'anthropic', placeholder: 'sk-ant-...' },
                { name: 'Google', key: 'google', placeholder: 'AIza...' },
                { name: 'Grok', key: 'grok', placeholder: 'xai-...' },
              ].map((provider) => (
                <div key={provider.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                    {provider.name} API Key
                  </label>
                  <input
                    type="password"
                    placeholder={provider.placeholder}
                    className="input"
                    value={apiKeys[provider.key as keyof typeof apiKeys]}
                    onChange={(e) => setApiKeys({ ...apiKeys, [provider.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-dark-text-muted mt-4">
              🔒 Your API keys are encrypted and never logged. We only use them to route your prompts.
            </p>

            <button
              onClick={handleNextStep}
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        )}

        {/* Step 2: Test Routing */}
        {step === 2 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Test Your First Prompt</h2>
                <p className="text-gray-600 dark:text-dark-text-muted">See routing in action and watch the savings</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                Enter a test prompt
              </label>
              <textarea
                className="input"
                rows={3}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={handleNextStep}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Routing...' : 'Execute Test Prompt'}
            </button>
          </div>
        )}

        {/* Step 3: See Results */}
        {step === 3 && testResult && (
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="bg-success/10 p-3 rounded-full mr-4">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
                <p className="text-gray-600 dark:text-dark-text-muted">Here&apos;s your first routing result</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-1">Selected Model</p>
                  <p className="text-xl font-bold">{testResult?.routing?.model || 'N/A'}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-text-muted">{testResult?.routing?.provider || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-1">Amount Saved</p>
                  <p className="text-3xl font-bold text-success">
                    €{testResult?.savings?.amount_saved?.toFixed(4) || '0.0000'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-dark-text-muted">
                    {testResult?.savings?.savings_percentage || 0}% cheaper
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-2">Why this model?</p>
                <p className="text-sm text-gray-700 dark:text-dark-text">{testResult?.routing?.reason || 'No reason provided'}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-dark-border mt-4 pt-4">
                <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-2">Response:</p>
                <p className="text-gray-900 dark:text-dark-text italic">&quot;{testResult?.content || 'No response'}&quot;</p>
              </div>
            </div>

            <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-6">
              <p className="text-success font-medium">
                💰 If you had used GPT-4, this would have cost €{testResult?.savings?.alternative_cost?.toFixed(4) || '0.0000'}
              </p>
              <p className="text-success text-sm mt-1">
                With PromptRouter, you paid only €{testResult?.savings?.actual_cost?.toFixed(4) || '0.0000'}
              </p>
            </div>

            <button
              onClick={handleNextStep}
              className="btn-primary w-full"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
