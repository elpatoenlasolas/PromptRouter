'use client'

import { useState, useEffect } from 'react'
import { Key, Trash2, Plus, Copy, Check, Eye, EyeOff } from 'lucide-react'
import type { UserConfig, APIKey } from '@/types'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/lib/toast'
import { api } from '@/lib/api'

export const dynamic = 'force-dynamic'

interface APIToken {
  id: number
  name: string
  token?: string // Only available when first created
  token_preview: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

export default function SettingsPage() {
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddKey, setShowAddKey] = useState(false)
  const [newKey, setNewKey] = useState({ provider: 'openai', key: '' })
  
  // API Tokens state
  const [tokens, setTokens] = useState<APIToken[]>([])
  const [showCreateToken, setShowCreateToken] = useState(false)
  const [newTokenName, setNewTokenName] = useState('')
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState(false)

  const router = useRouter()
  const { user } = useUser()
  const { showToast } = useToast()

  useEffect(() => {
    fetchConfig()
    fetchTokens()
  }, [])

  const fetchConfig = async () => {
    try {
      const data = await api.get<UserConfig>('/v1/config')
      setConfig(data)
    } catch (error) {
      showToast('Failed to fetch config', 'error')
      // Set default config on error to prevent crashes
      setConfig({
        tier: 'free',
        monthly_token_limit: 10000,
        tokens_used_this_month: 0,
        api_keys: []
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTokens = async () => {
    try {
      const data = await api.get<{ tokens: APIToken[] }>('/v1/tokens')
      setTokens(data.tokens || [])
    } catch (error) {
      setTokens([])
    }
  }

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await api.post<{ token: string }>('/v1/tokens', { name: newTokenName })
      setCreatedToken(data.token)
      setNewTokenName('')
      await fetchTokens()
      showToast('API token created successfully', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create API token', 'error')
    }
  }

  const handleRevokeToken = async (tokenId: number) => {
    if (!confirm('Are you sure you want to revoke this token? This cannot be undone.')) return

    try {
      await api.delete(`/v1/tokens/${tokenId}`)
      await fetchTokens()
      showToast('Token revoked successfully', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to revoke token', 'error')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard', 'success', 2000)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/v1/api-keys', {
        provider: newKey.provider,
        api_key: newKey.key,
      })
      
      setShowAddKey(false)
      setNewKey({ provider: 'openai', key: '' })
      await fetchConfig()
      showToast('API key added successfully', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add API key', 'error')
    }
  }

  const handleDeleteKey = async (keyId: number) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      await api.delete(`/v1/api-keys/${keyId}`)
      await fetchConfig()
      showToast('API key deleted successfully', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete API key', 'error')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-dark-text-muted">Loading settings...</p>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="max-w-4xl">
        <div className="card">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load settings</p>
            <button onClick={fetchConfig} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Plan & Billing */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Plan & Billing</h2>
        
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold capitalize">{config?.tier || 'free'} Plan</h3>
                {config?.tier === 'free' && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                    Current
                  </span>
                )}
                {config?.tier === 'starter' && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Active
                  </span>
                )}
                {config?.tier === 'pro' && (
                  <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-dark-text-muted dark:text-dark-text-muted mb-3">
                {config?.tokens_used_this_month?.toLocaleString() || '0'} / {config?.monthly_token_limit?.toLocaleString() || '0'} tokens used this month
              </p>
              {config?.tier === 'free' && (
                <p className="text-sm text-gray-500">
                  🎯 Upgrade to unlock higher limits and priority routing
                </p>
              )}
              {config?.tier === 'starter' && (
                <p className="text-sm text-gray-500">
                  📊 500K tokens/month • Priority routing • Email support
                </p>
              )}
              {config?.tier === 'pro' && (
                <p className="text-sm text-gray-500">
                  🚀 5M tokens/month • Custom rules • Priority support
                </p>
              )}
            </div>
            {config?.tier === 'free' && (
              <button 
                className="btn-primary whitespace-nowrap" 
                onClick={() => router.push('/dashboard/upgrade')}
              >
                Upgrade Plan
              </button>
            )}
            {config?.tier === 'starter' && (
              <button 
                className="btn-primary whitespace-nowrap" 
                onClick={() => router.push('/dashboard/upgrade')}
              >
                Upgrade to Pro
              </button>
            )}
            {config?.tier === 'pro' && (
              <button 
                className="btn-secondary whitespace-nowrap" 
                onClick={() => router.push('/pricing')}
              >
                View Plans
              </button>
            )}
          </div>
        </div>

        {/* Usage Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Token Usage</span>
            <span className="text-sm text-gray-600 dark:text-dark-text-muted">
              {Math.round(((config?.tokens_used_this_month || 0) / (config?.monthly_token_limit || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                ((config?.tokens_used_this_month || 0) / (config?.monthly_token_limit || 1)) > 0.9 
                  ? 'bg-red-500' 
                  : ((config?.tokens_used_this_month || 0) / (config?.monthly_token_limit || 1)) > 0.7 
                  ? 'bg-yellow-500' 
                  : 'bg-success'
              }`}
              style={{ 
                width: `${Math.min(((config?.tokens_used_this_month || 0) / (config?.monthly_token_limit || 1)) * 100, 100)}%` 
              }}
            />
          </div>
          {((config?.tokens_used_this_month || 0) / (config?.monthly_token_limit || 1)) > 0.8 && (
            <p className="text-xs text-orange-600 mt-2">
              ⚠️ You're approaching your monthly limit. Consider upgrading to avoid service interruption.
            </p>
          )}
        </div>
      </div>

      {/* PromptRouter API Tokens */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">API Tokens</h2>
            <p className="text-sm text-gray-600 mt-1">
              Use these tokens to authenticate requests to PromptRouter's API
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateToken(true)
              setCreatedToken(null)
            }}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Token
          </button>
        </div>

        {/* Create Token Form */}
        {showCreateToken && !createdToken && (
          <form onSubmit={handleCreateToken} className="mb-6 p-4 bg-gray-50 dark:bg-dark-surface rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Token Name</label>
              <input
                type="text"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 dark:border-dark-border rounded-lg"
                placeholder="e.g., Production API, Development, My App"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Give your token a descriptive name to remember where it's used
              </p>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Create Token
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateToken(false)
                  setNewTokenName('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Newly Created Token - Show Once */}
        {createdToken && (
          <div className="mb-6 p-4 bg-success/5 border-2 border-success rounded-lg">
            <div className="flex items-start mb-3">
              <Check className="w-5 h-5 text-success mr-2 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-success mb-1">Token Created Successfully!</h3>
                <p className="text-sm text-success mb-3">
                  Make sure to copy your token now. You won't be able to see it again!
                </p>
                <div className="flex items-center gap-2 bg-white dark:bg-dark-surface p-3 rounded border border-green-300">
                  <code className="flex-1 text-sm font-mono break-all">{createdToken}</code>
                  <button
                    onClick={() => copyToClipboard(createdToken)}
                    className="btn-secondary flex items-center whitespace-nowrap"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setCreatedToken(null)
                setShowCreateToken(false)
              }}
              className="btn-primary w-full"
            >
              I've saved my token
            </button>
          </div>
        )}

        {/* Token List */}
        <div className="space-y-3">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <div
                key={token.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  token.is_active ? 'bg-gray-50 text-gray-900 dark:bg-dark-surface' : 'bg-red-50 opacity-60 dark:bg-gray-700/20 text-gray-500'
                }`}
              >
                <div className="flex items-center flex-1">
                  <Key className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-600 dark:text-gray-50">{token.name}</p>
                    <code className="text-xs text-gray-500 font-mono">{token.token_preview}</code>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>Created {new Date(token.created_at).toLocaleDateString()}</span>
                      {token.last_used_at && (
                        <span>Last used {new Date(token.last_used_at).toLocaleDateString()}</span>
                      )}
                      {!token.is_active && (
                        <span className="text-red-600 font-medium">Revoked</span>
                      )}
                    </div>
                  </div>
                </div>
                {token.is_active && (
                  <button
                    onClick={() => handleRevokeToken(token.id)}
                    className="btn-danger flex items-center ml-3 dark:bg-red-900/50 dark:hover:bg-red-900/80"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Revoke
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No API tokens yet</p>
              <p className="text-sm mt-1">Create a token to start using the API</p>
            </div>
          )}
        </div>
      </div>

      {/* LLM Provider API Keys */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">LLM Provider Keys</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add your OpenAI, Anthropic, Google, and Grok API keys
            </p>
          </div>
          <button
            onClick={() => setShowAddKey(true)}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Key
          </button>
        </div>

        {showAddKey && (
          <form onSubmit={handleAddKey} className="mb-6 p-4 bg-gray-50 dark:bg-dark-surface rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <select
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                  <option value="grok">Grok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg"
                  placeholder="sk-..."
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Add Key
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddKey(false)
                  setNewKey({ provider: 'openai', key: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {config?.api_keys && config.api_keys.length > 0 ? (
            config.api_keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-lg"
              >
                <div className="flex items-center">
                  <Key className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium capitalize">{key.provider}</p>
                    <p className="text-sm text-gray-500">
                      Added {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      key.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {key.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No API keys configured. Add one to start routing prompts.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
