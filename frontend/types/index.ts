export interface PromptRequest {
  prompt: string
  max_tokens?: number
  temperature?: number
  constraints?: {
    min_quality_tier?: 'basic' | 'standard' | 'premium'
    max_latency_ms?: number
    max_cost_per_1k_tokens?: number
    preferred_providers?: string[]
  }
}

export interface PromptResponse {
  response: string
  model: string
  provider: string
  latency_ms: number
  cost: number
  saved: number
  routing_reason: string
  input_tokens: number
  output_tokens: number
  timestamp: string
}

export interface Metrics {
  total_requests: number
  total_tokens: number
  total_spend: number
  estimated_spend_without_routing: number
  total_saved: number
  average_latency_ms: number
  error_rate: number
}

export interface APIKey {
  id: number
  provider: string
  is_active: boolean
  created_at: string
}

export interface UserConfig {
  tier: 'free' | 'starter' | 'pro'
  monthly_token_limit: number
  tokens_used_this_month: number
  api_keys: APIKey[]
}
