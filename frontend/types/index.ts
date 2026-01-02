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
  user_id?: number
  email?: string
  tier: 'free' | 'starter' | 'pro'
  monthly_token_limit: number
  tokens_used_this_month: number
  api_keys: APIKey[]
}
