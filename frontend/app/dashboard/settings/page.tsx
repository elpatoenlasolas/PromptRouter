'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Key, Trash2, Plus } from 'lucide-react'
import type { UserConfig, APIKey } from '@/types'

export default function SettingsPage() {
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddKey, setShowAddKey] = useState(false)
  const [newKey, setNewKey] = useState({ provider: 'openai', key: '' })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/config`)
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: newKey.provider,
          api_key: newKey.key,
        }),
      })

      if (!response.ok) throw new Error('Failed to add API key')
      
      setShowAddKey(false)
      setNewKey({ provider: 'openai', key: '' })
      await fetchConfig()
    } catch (error) {
      console.error('Error adding API key:', error)
      alert('Failed to add API key')
    }
  }

  const handleDeleteKey = async (keyId: number) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete API key')
      await fetchConfig()
    } catch (error) {
      console.error('Error deleting API key:', error)
      alert('Failed to delete API key')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Account Tier */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Tier</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold capitalize">{config?.tier}</p>
            <p className="text-gray-600">
              {config?.tokens_used_this_month.toLocaleString()} / {config?.monthly_token_limit.toLocaleString()} tokens used this month
            </p>
          </div>
          {config?.tier === 'free' && (
            <button className="btn-primary">
              Upgrade to Starter
            </button>
          )}
        </div>
      </div>

      {/* API Keys */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <button
            onClick={() => setShowAddKey(true)}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Key
          </button>
        </div>

        {showAddKey && (
          <form onSubmit={handleAddKey} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <select
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
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
                        ? 'bg-green-100 text-green-700'
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
