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
    # Cost constraints
    max_cost_per_1k_tokens: Optional[float] = Field(None, description="Hard ceiling on cost per 1K tokens")
    cost_priority: Optional[float] = Field(0.7, ge=0.0, le=1.0, description="Weight for cost in routing (0=ignore, 1=critical)")
    
    # Latency constraints
    max_latency_ms: Optional[int] = Field(None, description="Hard ceiling on latency in milliseconds")
    latency_priority: Optional[float] = Field(0.2, ge=0.0, le=1.0, description="Weight for latency in routing")
    
    # Quality and risk constraints
    min_quality_tier: Optional[str] = Field("basic", description="Minimum quality tier: basic, standard, premium")
    quality_priority: Optional[float] = Field(0.1, ge=0.0, le=1.0, description="Weight for quality in routing")
    
    # NEW: Risk and correctness
    risk_level: Optional[str] = Field("low", description="Risk level: low, medium, high, critical")
    requires_verification: Optional[bool] = Field(False, description="Task requires factual accuracy (medical, legal, financial)")
    is_irreversible: Optional[bool] = Field(False, description="Decision cannot be easily reversed or checked")
    
    # Preferences
    preferred_providers: Optional[list[str]] = Field(None, description="Preferred providers if available")
    baseline_model: Optional[str] = Field("gpt-4", description="Model to compare savings against")


class PromptRequest(BaseModel):
    """Request to execute a prompt"""
    prompt: str = Field(..., min_length=1, max_length=50000, description="The prompt to execute")
    constraints: Optional[PromptConstraints] = None
    system_message: Optional[str] = Field(None, description="Optional system message")
    max_tokens: Optional[int] = Field(4000, description="Maximum tokens to generate")
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
