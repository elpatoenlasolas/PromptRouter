'use client'

import { useState } from 'react'
import { Send, Loader, Zap, TrendingDown, Clock, DollarSign, Info } from 'lucide-react'
import type { PromptRequest } from '@/types'

export const dynamic = 'force-dynamic'

interface PromptResponse {
  content: string
  routing: {
    provider: string
    model: string
    reason: string
    estimated_cost: number
    estimated_latency_ms: number
  }
  metrics: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
    latency_ms: number
  }
  savings: {
    actual_cost: number
    alternative_cost: number
    amount_saved: number
    savings_percentage: number
  }
}

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('Write a short haiku about artificial intelligence')
  const [systemMessage, setSystemMessage] = useState('')
  const [maxTokens, setMaxTokens] = useState(500)
  const [temperature, setTemperature] = useState(0.7)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PromptResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [volumeMultiplier, setVolumeMultiplier] = useState(900) // Default: 30 prompts/day
  const [workloadMix, setWorkloadMix] = useState<'current' | 'balanced' | 'heavy'>('balanced')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const requestBody: PromptRequest = {
        prompt: prompt.trim(),
        max_tokens: maxTokens,
        temperature: temperature,
        ...(systemMessage.trim() && { system_message: systemMessage.trim() }),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
          console.error('API Error:', errorData)
        } catch (e) {
          const text = await response.text().catch(() => 'Unknown error')
          errorMessage = text || errorMessage
          console.error('API Error (text):', text)
        }
        throw new Error(errorMessage)
      }

      const data: PromptResponse = await response.json()
      setResult(data)
    } catch (error: any) {
      console.error('Error executing prompt:', error)
      setError(error.message || 'Failed to execute prompt. Make sure you have API keys configured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Playground</h1>
        <p className="text-gray-600">Calculate savings and test prompts with intelligent routing</p>
      </div>

      {/* Savings Calculator - Always Visible */}
      <div className="card bg-gradient-to-br from-green-50 to-white border-2 border-green-300">
        <div className="flex items-center mb-4">
          <TrendingDown className="w-6 h-6 mr-2 text-green-600" />
          <h2 className="text-2xl font-bold">Savings Calculator</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          See how much you could save based on different workload types
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-4">
            {/* Workload Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workload Type
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setWorkloadMix('current')}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                    workloadMix === 'current'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">📝 Simple Tasks</div>
                  <div className="text-xs opacity-90">
                    Quick queries, simple completions (~300 tokens avg)
                  </div>
                </button>
                <button
                  onClick={() => setWorkloadMix('balanced')}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                    workloadMix === 'balanced'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">🎯 Balanced Mix</div>
                  <div className="text-xs opacity-90">
                    Mix of simple, medium, complex tasks (~800 tokens avg)
                  </div>
                </button>
                <button
                  onClick={() => setWorkloadMix('heavy')}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                    workloadMix === 'heavy'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">🚀 Complex Tasks</div>
                  <div className="text-xs opacity-90">
                    Heavy analysis, long content generation (~1500 tokens avg)
                  </div>
                </button>
              </div>
            </div>

            {/* Volume Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompts per day
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { daily: 30, monthly: 900, label: '30/day' },
                  { daily: 50, monthly: 1500, label: '50/day' },
                  { daily: 100, monthly: 3000, label: '100/day' },
                  { daily: 200, monthly: 6000, label: '200/day' },
                ].map((vol) => (
                  <button
                    key={vol.monthly}
                    type="button"
                    onClick={() => setVolumeMultiplier(vol.monthly)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      volumeMultiplier === vol.monthly
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {vol.label}
                  </button>
                ))}
              </div>
              
              {/* Custom input */}
              <div className="mt-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Or enter custom daily volume:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="e.g., 500"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={(e) => {
                      const daily = parseInt(e.target.value)
                      if (daily >= 1 && daily <= 10000) {
                        setVolumeMultiplier(daily * 30) // Convert to monthly
                      }
                    }}
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">/day</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Max: 10,000/day (enterprise scale)
                </p>
              </div>
              
              <div className="text-center mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Estimated monthly volume</div>
                <span className="text-2xl font-bold text-blue-700">
                  {volumeMultiplier.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 ml-2">prompts</span>
                <div className="text-xs text-gray-500 mt-1">
                  ≈ {(volumeMultiplier / 30).toFixed(0)} prompts/day
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="bg-white p-5 rounded-lg border-2 border-green-300">
            {(() => {
              // Costos realistas basados en usar GPT-4 vs PromptRouter
              let avgTokensPerPrompt = 0;
              let gpt4CostPer1K = 0.03; // €0.03 por 1K tokens (GPT-4)
              let geminiCostPer1K = 0.0002; // €0.0002 por 1K tokens (Gemini Flash)
              
              if (workloadMix === 'current') {
                // Simple tasks: ~300 tokens promedio
                avgTokensPerPrompt = 300;
              } else if (workloadMix === 'balanced') {
                // Balanced mix: ~600 tokens promedio
                avgTokensPerPrompt = 600;
              } else if (workloadMix === 'heavy') {
                // Complex tasks: ~1200 tokens promedio
                avgTokensPerPrompt = 1200;
              }
              
              // Costo por prompt
              const costPerPromptGPT4 = (avgTokensPerPrompt / 1000) * gpt4CostPer1K;
              const costPerPromptRouted = (avgTokensPerPrompt / 1000) * geminiCostPer1K;
              
              // Costos mensuales
              const monthlyCostWithout = costPerPromptGPT4 * volumeMultiplier;
              const monthlyCostWith = costPerPromptRouted * volumeMultiplier;
              const monthlySavings = monthlyCostWithout - monthlyCostWith;
              const annualSavings = monthlySavings * 12;
              const savingsPercentage = ((monthlySavings / monthlyCostWithout) * 100);
              
              return (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Projected Savings</h3>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                        <div className="absolute left-0 top-6 hidden group-hover:block z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                          Comparing against always using GPT-4 (€0.03/1K tokens) - the most expensive premium model
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <div>
                        <div className="text-gray-600 text-sm">Without optimization</div>
                        <div className="text-xs text-gray-400">
                          Always GPT-4: {avgTokensPerPrompt} tokens × €0.03/1K
                        </div>
                      </div>
                      <span className="font-semibold text-red-600">
                        €{monthlyCostWithout.toFixed(2)}/mo
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <div>
                        <div className="text-gray-600 text-sm">With PromptRouter</div>
                        <div className="text-xs text-gray-400">
                          Smart routing (99% Gemini)
                        </div>
                      </div>
                      <span className="font-semibold text-green-600">
                        €{monthlyCostWith.toFixed(2)}/mo
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mt-4 border-2 border-green-400">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xs text-green-700 font-medium">YOUR SAVINGS</div>
                          <div className="text-xs text-green-600 mt-1">
                            {savingsPercentage.toFixed(1)}% cheaper
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-700">
                            €{monthlySavings.toFixed(2)}
                          </div>
                          <div className="text-xs text-green-600">per month</div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-green-300 mt-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-800 font-medium">Annual savings</span>
                          <span className="font-bold text-green-700 text-lg">
                            €{annualSavings.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Real-world impact */}
                    <div className="bg-blue-50 p-3 rounded-lg mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs text-blue-800 font-semibold">💡 Context</div>
                        <div className="group relative">
                          <Info className="w-3 h-3 text-blue-600 hover:text-blue-800 cursor-help" />
                          <div className="absolute left-0 top-5 hidden group-hover:block z-10 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                            PromptRouter automatically selects the cheapest model that meets your quality requirements
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <div>• {volumeMultiplier} prompts = {(volumeMultiplier / 30).toFixed(0)} prompts/day</div>
                        <div>• ~{avgTokensPerPrompt} tokens average per prompt</div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Prompt Testing Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Prompt Configuration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="system-message" className="block text-sm font-medium text-gray-700 mb-2">
                  System Message (Optional)
                </label>
                <textarea
                  id="system-message"
                  value={systemMessage}
                  onChange={(e) => setSystemMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={2}
                  placeholder="You are a helpful assistant..."
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  rows={6}
                  placeholder="Enter your prompt here..."
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {prompt.length} characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="max-tokens" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    id="max-tokens"
                    type="number"
                    min="1"
                    max="32000"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 500)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value) || 0.7)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="btn-primary w-full flex items-center justify-center py-3"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Routing & Executing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Execute Prompt
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Response */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Response</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {result.content}
                  </p>
                </div>
              </div>

              {/* Routing Info */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary-600" />
                  Routing Decision
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Selected Model</span>
                    <span className="font-semibold">{result.routing.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-semibold capitalize">{result.routing.provider}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Why this model?</p>
                    <p className="text-sm text-gray-700 bg-primary-50 p-3 rounded-lg">
                      {result.routing.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-4 h-4 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-600">Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      €{result.savings.actual_cost.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingDown className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Saved</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      €{result.savings.amount_saved.toFixed(4)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {result.savings.savings_percentage}% cheaper
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-600">Latency</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.metrics.latency_ms}ms
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Zap className="w-4 h-4 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-600">Tokens</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.metrics.total_tokens.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {result.metrics.input_tokens} in / {result.metrics.output_tokens} out
                    </p>
                  </div>
                </div>
              </div>

              {/* This Prompt's Savings */}
              <div className="card bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200">
                <h3 className="font-semibold mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                  Your Prompt's Savings
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-primary-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Single execution</span>
                      <span className="text-lg font-bold text-green-600">
                        €{result.savings.amount_saved.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.savings.savings_percentage}% cheaper than {result.routing.provider === 'openai' ? 'Claude Opus' : 'GPT-4'}
                    </div>
                  </div>

                  {/* Scale this specific prompt */}
                  <div className="pt-3 border-t border-primary-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      If you ran this exact prompt:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-gray-600">100 times/month</span>
                        <span className="font-semibold text-green-600">
                          Save €{(result.savings.amount_saved * 100).toFixed(2)}/mo
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-gray-600">1,000 times/month</span>
                        <span className="font-semibold text-green-600">
                          Save €{(result.savings.amount_saved * 1000).toFixed(2)}/mo
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-gray-600">10,000 times/month</span>
                        <span className="font-semibold text-green-600">
                          Save €{(result.savings.amount_saved * 10000).toFixed(2)}/mo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Custom multiplier */}
                  <div className="pt-3 border-t border-primary-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom volume:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="1000000"
                        defaultValue="5000"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const savingsEl = e.target.parentElement?.querySelector('.custom-savings');
                          if (savingsEl) {
                            savingsEl.textContent = `€${(result.savings.amount_saved * val).toFixed(2)}/mo`;
                          }
                        }}
                      />
                      <span className="text-sm text-gray-600">prompts/mo =</span>
                      <span className="custom-savings font-bold text-green-600 text-lg">
                        €{(result.savings.amount_saved * 5000).toFixed(2)}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="card bg-gray-50 border-2 border-dashed border-gray-300">
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No results yet</p>
                <p className="text-sm text-gray-500">
                  Enter a prompt and click "Execute Prompt" to see routing in action
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

