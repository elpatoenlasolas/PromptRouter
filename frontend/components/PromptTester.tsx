'use client'

import { useState } from 'react'
import { Send, Loader } from 'lucide-react'
import type { PromptRequest, PromptResponse } from '@/types'

export default function PromptTester() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PromptResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          max_tokens: 500,
        } as PromptRequest),
      })

      if (!response.ok) throw new Error('Failed to execute prompt')
      const data: PromptResponse = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error executing prompt:', error)
      alert('Failed to execute prompt. Make sure you have API keys configured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Test Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your prompt here..."
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Execute Prompt
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="card bg-gray-50 border border-gray-200">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Response</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{result.response}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Model</p>
              <p className="font-semibold">{result.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-semibold capitalize">{result.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost</p>
              <p className="font-semibold">€{result.cost.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Saved</p>
              <p className="font-semibold text-green-600">€{result.saved.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Latency</p>
              <p className="font-semibold">{result.latency_ms}ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tokens</p>
              <p className="font-semibold">{result.input_tokens + result.output_tokens}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Routing Decision</p>
            <p className="text-sm text-gray-700">{result.routing_reason}</p>
          </div>
        </div>
      )}
    </div>
  )
}
