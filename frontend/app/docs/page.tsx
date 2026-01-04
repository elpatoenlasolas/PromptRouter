'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Code, BookOpen, Zap, Lock, ArrowRight, CheckCircle, Terminal } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export const dynamic = 'force-dynamic'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('how-it-works')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['how-it-works', 'quickstart', 'openai-compatibility', 'authentication', 'api-reference', 'examples', 'best-practices']
      const scrollPosition = window.scrollY + 150

      // Check if we&apos;re near the bottom of the page
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      
      if (isNearBottom) {
        setActiveSection('best-practices')
        return
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-base">
      <DashboardHeader />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-14">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-dark-text-muted max-w-3xl mx-auto">
            Everything you need to integrate PromptRouter into your application and start saving on AI costs
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <a href="#quickstart" className="card hover:shadow-lg transition-shadow">
            <Zap className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">Quick Start</h3>
            <p className="text-gray-600 dark:text-dark-text-muted text-sm">Get started in 5 minutes</p>
          </a>
          <a href="#api-reference" className="card hover:shadow-lg transition-shadow">
            <Code className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">API Reference</h3>
            <p className="text-gray-600 dark:text-dark-text-muted text-sm">Complete endpoint documentation</p>
          </a>
          <a href="#examples" className="card hover:shadow-lg transition-shadow">
            <Terminal className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-2">Code Examples</h3>
            <p className="text-gray-600 dark:text-dark-text-muted text-sm">Integration examples</p>
          </a>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky top-24 space-y-1 mb-8 lg:mb-0">
              <div className="text-xs font-semibold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-3 px-4">
                On this page
              </div>

              <a 
                href="#how-it-works" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === 'how-it-works' 
                    ? 'text-primary bg-primary/10 font-medium' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                How It Works
              </a>
              <a 
                href="#quickstart" 
                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === 'quickstart' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                Quick Start
              </a>
              <a 
                href="#openai-compatibility" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === 'openai-compatibility' 
                    ? 'text-primary bg-primary/10 font-medium' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                OpenAI Compatibility
              </a>
              <a 
                href="#authentication" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === 'authentication' 
                    ? 'text-primary bg-primary/10 font-medium' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                Authentication
              </a>
              <a 
                href="#api-reference" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === 'api-reference' 
                    ? 'text-primary bg-primary/10 font-medium' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                API Reference
              </a>
              <a 
                href="#examples" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === 'examples' 
                    ? 'text-primary bg-primary/10 font-medium' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                Code Examples
              </a>
              <a 
                href="#best-practices" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === 'best-practices' 
                    ? 'text-primary bg-primary/10 font-medium' 
                    : 'text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                Best Practices
              </a>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8 sm:space-y-12 min-w-0">
            {/* How It Works Flowchart */}
            <section id="how-it-works" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">How It Works</h2>
              <p className="text-gray-600 dark:text-dark-text-muted mb-6">
                PromptRouter automatically routes your prompts to the most cost-effective AI model while maintaining quality. Here&apos;s the complete flow:
              </p>
              <div className="bg-primary/5 rounded-xl p-4 sm:p-6 mb-6 -mx-4 sm:mx-0">
                <img 
                  src="/flowchart-promptrouter.png" 
                  alt="PromptRouter Implementation Flow - Complete 5-step process"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <p className="text-sm text-success">
                  <strong>💡 Key benefit:</strong> Replace one API endpoint and start saving 85-99% on AI costs immediately. No architectural changes needed.
                </p>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quickstart" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary" />
                Quick Start
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">1. Sign Up & Get API Keys</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-dark-text ml-4">
                    <li>Create an account at <Link href="/sign-up" className="text-primary hover:underline">PromptRouter</Link></li>
                    <li>Choose your plan (Free, Pro, or Power)</li>
                    <li>Go to Settings → &quot;LLM Provider Keys&quot; and add your API keys (OpenAI, Anthropic, etc.)</li>
                    <li>Go to Settings → &quot;API Tokens&quot; and click &quot;Create Token&quot;</li>
                    <li>Give your token a name (e.g., &quot;Production API&quot;) and copy it</li>
                  </ol>
                  <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                    <p className="text-sm text-yellow-900 dark:text-yellow-200">
                      <strong>Important:</strong> Your API token will only be shown once. Make sure to copy and save it securely!
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">2. Make Your First Request</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`curl -X POST https://api.prompt-router.com/v1/prompt \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    &quot;prompt&quot;: "Write a haiku about coding",
    &quot;max_tokens&quot;: 100
  }'`}</code></pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">3. Get the Response</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`{
  &quot;content&quot;: "Code flows like water\\nBugs hide in silent shadows\\nDebug brings the light",
  "routing": {
    "provider": "anthropic",
    &quot;model&quot;: "claude-3-haiku-20240307",
    "reason": "Cheapest option for simple creative task",
    "estimated_cost": 0.00025,
    "estimated_latency_ms": 450
  },
  "metrics": {
    "input_tokens": 45,
    "output_tokens": 48,
    "total_tokens": 93,
    "latency_ms": 423
  },
  "savings": {
    "actual_cost": 0.00025,
    "alternative_cost": 0.00279,
    "amount_saved": 0.00254,
    "savings_percentage": 91
  }
}`}</code></pre>
                  </div>
                </div>

                <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-success">
                        <strong>You just saved 91% on that request!</strong> PromptRouter automatically selected Claude Haiku instead of GPT-4 for this creative task.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* OpenAI Compatibility */}
            <section id="openai-compatibility" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center">
                <Code className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary" />
                OpenAI SDK Compatibility
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>✨ Drop-in Replacement:</strong> PromptRouter provides a fully compatible <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">/v1/chat/completions</code> endpoint. Change 2 lines of code and start saving 30-60% instantly!
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">Python (OpenAI SDK)</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`from openai import OpenAI

# Before: Direct OpenAI
# client = OpenAI(api_key="sk-...")

# After: PromptRouter (drop-in replacement!)
client = OpenAI(
    base_url="https://api.prompt-router.com/v1",
    api_key="pr_live_your_token_here"
)

# Same API - automatic cost optimization!
response = client.chat.completions.create(
    # Omit 'model' for auto-routing (recommended)
    messages=[
        {"role": "user", "content": "Explain quantum computing"}
    ]
)

print(response.choices[0].message.content)

# Check your savings
print(f"Saved: ${'{'}response.x_promptrouter.savings['amount_saved']:.4f{'}'}")`}</code></pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">JavaScript/TypeScript</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.prompt-router.com/v1',
  apiKey: 'pr_live_your_token_here'
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }]
});

console.log('Savings:', response['x-promptrouter'].savings);`}</code></pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Auto-routing:</strong> Omit <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">model</code> parameter for cost optimization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Model override:</strong> Specify <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">model=&quot;gpt-4&quot;</code> when needed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Multi-turn conversations:</strong> Full message array support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Transparent savings:</strong> Every response includes cost breakdown in <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">x-promptrouter</code> field</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>All providers:</strong> Works with OpenAI, Anthropic, Google, and Grok</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Response Format</h4>
                  <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-3">
                    Standard OpenAI format with PromptRouter extensions:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-100"><code>{`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "gpt-3.5-turbo",
  "choices": [...],
  "usage": {...},
  "x-promptrouter": {
    "routing": {
      "provider": "openai",
      "reason": "Cost-optimized: 86% cheaper..."
    },
    "savings": {
      "amount_saved": 0.000193,
      "savings_percentage": 86.3
    },
    "was_routed": true
  }
}`}</code></pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Authentication</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-dark-text">
                  All API requests require authentication using your PromptRouter API token.
                </p>

                <div>
                  <h3 className="font-semibold mb-2">Getting Your API Token</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-dark-text ml-4">
                    <li>Log in to your PromptRouter dashboard</li>
                    <li>Go to Settings</li>
                    <li>Scroll to &quot;API Tokens&quot; section</li>
                    <li>Click &quot;Create Token&quot;</li>
                    <li>Give it a descriptive name</li>
                    <li>Copy the token immediately (it won&apos;t be shown again!)</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Using the Token</h3>
                  <p className="text-gray-700 dark:text-dark-text mb-3">Include your token in the Authorization header:</p>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`Authorization: Bearer YOUR_API_TOKEN`}</code></pre>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section id="api-reference" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">API Reference</h2>
              
              <div className="space-y-8">
                {/* Execute Prompt */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
                    <span className="bg-success text-white px-3 py-1 rounded text-sm font-mono mr-3 w-fit">POST</span>
                    <code className="text-sm sm:text-base md:text-lg font-mono break-all">/v1/prompt</code>
                  </div>
                  <p className="text-gray-700 dark:text-dark-text mb-4">Execute a prompt through intelligent routing</p>
                  
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0 mb-4">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`{
  &quot;prompt&quot;: "string (required)",
  &quot;max_tokens&quot;: 1000,
  &quot;temperature&quot;: 0.7,
  "system_message": "string (optional)",
  "constraints": {
    "min_quality_tier": "basic" | "standard" | "premium",
    "max_latency_ms": 2000,
    "max_cost_per_1k_tokens": 0.01,
    "preferred_providers": ["openai", "anthropic"]
  }
}`}</code></pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response</h4>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`{
  &quot;content&quot;: "string",
  "routing": {
    "provider": "string",
    &quot;model&quot;: "string",
    "reason": "string",
    "estimated_cost": 0.00025,
    "estimated_latency_ms": 450
  },
  "metrics": {
    "input_tokens": 45,
    "output_tokens": 48,
    "total_tokens": 93,
    "latency_ms": 423
  },
  "savings": {
    "actual_cost": 0.00025,
    "alternative_cost": 0.00279,
    "amount_saved": 0.00254,
    "savings_percentage": 91
  }
}`}</code></pre>
                  </div>
                </div>

                {/* Get Metrics */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-3 w-fit">GET</span>
                    <code className="text-sm sm:text-base md:text-lg font-mono break-all">/v1/metrics</code>
                  </div>
                  <p className="text-gray-700 dark:text-dark-text mb-4">Get usage statistics and savings</p>
                  
                  <h4 className="font-semibold mb-2">Query Parameters</h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-dark-text mb-4 ml-4">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">days</code> - Number of days to look back (default: 30)</li>
                  </ul>

                  <h4 className="font-semibold mb-2">Response</h4>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`{
  "total_requests": 1234,
  "total_tokens": 567890,
  "total_spend": 12.45,
  "estimated_spend_without_routing": 45.67,
  "total_saved": 33.22,
  "average_latency_ms": 650,
  "error_rate": 0.5
}`}</code></pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Code Examples</h2>
              
              <div className="space-y-6">
                {/* JavaScript/TypeScript */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">JavaScript / TypeScript</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`// Using fetch
const response = await fetch('https://api.prompt-router.com/v1/prompt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Explain quantum computing in simple terms',
    max_tokens: 500
  })
});

const data = await response.json();
console.log('Response:', data.content);
console.log('Saved:', data.savings.amount_saved, 'EUR');`}</code></pre>
                  </div>
                </div>

                {/* Python */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">Python</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`import requests

response = requests.post(
    'https://api.prompt-router.com/v1/prompt',
    headers={
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Content-Type': 'application/json'
    },
    json={
        'prompt': 'Explain quantum computing in simple terms',
        'max_tokens': 500
    }
)

data = response.json()
print(f"Response: {'{'}data['content']{'}'}")
print(f"Saved: €{'{'}data['savings']['amount_saved']{'}'}")`}</code></pre>
                  </div>
                </div>

                {/* Node.js */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">Node.js (axios)</h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
                    <pre className="text-xs sm:text-sm text-gray-100"><code>{`const axios = require('axios');

const response = await axios.post(
  'https://api.prompt-router.com/v1/prompt',
  {
    prompt: 'Explain quantum computing in simple terms',
    max_tokens: 500
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    }
  }
);

console.log('Response:', response.data.content);
console.log('Saved:', response.data.savings.amount_saved, 'EUR');`}</code></pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="card overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Best Practices</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">🎯 Let PromptRouter decide the model</h4>
                  <p className="text-gray-700 dark:text-dark-text text-sm">
                    Don&apos;t specify a model - let our routing engine select the optimal one based on your prompt and constraints.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">💰 Add multiple provider keys</h4>
                  <p className="text-gray-700 dark:text-dark-text text-sm">
                    The more providers you add, the better we can optimize. Add OpenAI, Anthropic, Google, and Grok for maximum savings.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">📊 Monitor your metrics</h4>
                  <p className="text-gray-700 dark:text-dark-text text-sm">
                    Regularly check your dashboard to see savings trends and identify optimization opportunities.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">🔧 Use constraints wisely</h4>
                  <p className="text-gray-700 dark:text-dark-text text-sm">
                    Set quality tiers and latency constraints only when necessary. Fewer constraints = more routing options = better savings.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">🔐 Keep your API token secure</h4>
                  <p className="text-gray-700 dark:text-dark-text text-sm">
                    Never expose your PromptRouter API token in client-side code. Use environment variables and keep it server-side.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-br from-primary to-accent rounded-xl p-6 sm:p-8 text-white text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to start saving?</h3>
          <p className="text-sm sm:text-base text-gray-100 mb-4 sm:mb-6">
            Join thousands of developers optimizing their AI costs with PromptRouter
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/dashboard/playground"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border-2 border-white text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors"
            >
              Try the Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
