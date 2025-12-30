"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


# ============================================================================
# Prompt Execution Schemas
# ============================================================================

class PromptConstraints(BaseModel):
    """User-defined constraints for routing"""
    max_cost_per_1k_tokens: Optional[float] = Field(None, description="Maximum cost in euros per 1K tokens")
    max_latency_ms: Optional[int] = Field(None, description="Maximum acceptable latency in milliseconds")
    min_quality_tier: Optional[str] = Field("basic", description="Minimum quality tier: basic, standard, premium")
    preferred_providers: Optional[list[str]] = Field(None, description="Preferred providers if available")


class PromptRequest(BaseModel):
    """Request to execute a prompt"""
    prompt: str = Field(..., min_length=1, max_length=50000, description="The prompt to execute")
    constraints: Optional[PromptConstraints] = None
    system_message: Optional[str] = Field(None, description="Optional system message")
    max_tokens: Optional[int] = Field(1000, description="Maximum tokens to generate")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0, description="Sampling temperature")


class RoutingDecision(BaseModel):
    """Details about the routing decision"""
    provider: str
    model: str
    reason: str
    estimated_cost: float
    estimated_latency_ms: int


class PromptResponse(BaseModel):
    """Response from prompt execution"""
    content: str
    routing: RoutingDecision
    metrics: dict
    savings: dict
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Metrics Schemas
# ============================================================================

class UsageMetrics(BaseModel):
    """Usage and cost metrics"""
    total_requests: int
    total_tokens: int
    total_spend: float
    estimated_spend_without_routing: float
    total_saved: float
    average_latency_ms: float
    error_rate: float
    period_start: datetime
    period_end: datetime


class SavingsBreakdown(BaseModel):
    """Detailed savings breakdown by provider/model"""
    by_provider: dict[str, float]
    by_model: dict[str, float]
    total_saved: float


# ============================================================================
# Configuration Schemas
# ============================================================================

class APIKeyCreate(BaseModel):
    """Request to add an API key"""
    provider: str = Field(..., description="Provider name: openai, anthropic, google, grok")
    api_key: str = Field(..., min_length=10, description="Provider API key")


class APIKeyResponse(BaseModel):
    """Response with API key info (without actual key)"""
    id: int
    provider: str
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class UserConfigResponse(BaseModel):
    """User configuration"""
    user_id: int
    email: str
    tier: str
    monthly_token_limit: int
    tokens_used_this_month: int
    api_keys: list[APIKeyResponse]
    
    model_config = ConfigDict(from_attributes=True)
