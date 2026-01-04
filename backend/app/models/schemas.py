"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, Literal
import time
import secrets


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


# ============================================================================
# OpenAI-Compatible Chat Completion Schemas
# ============================================================================

class ChatMessage(BaseModel):
    """A single message in a chat conversation"""
    role: Literal["system", "user", "assistant"] = Field(..., description="Role of the message sender")
    content: str = Field(..., description="Content of the message")


class ChatCompletionRequest(BaseModel):
    """OpenAI-compatible chat completion request"""
    model: Optional[str] = Field(None, description="Model to use. If None, PromptRouter selects optimal model")
    messages: list[ChatMessage] = Field(..., min_length=1, description="Array of messages")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: Optional[int] = Field(1000, description="Maximum tokens to generate")
    top_p: Optional[float] = Field(1.0, ge=0.0, le=1.0, description="Nucleus sampling parameter")
    n: Optional[int] = Field(1, description="Number of completions to generate")
    stream: Optional[bool] = Field(False, description="Whether to stream responses (not yet supported)")
    stop: Optional[list[str]] = Field(None, description="Stop sequences")
    presence_penalty: Optional[float] = Field(0.0, ge=-2.0, le=2.0, description="Presence penalty")
    frequency_penalty: Optional[float] = Field(0.0, ge=-2.0, le=2.0, description="Frequency penalty")
    
    # PromptRouter-specific extensions (optional)
    constraints: Optional[PromptConstraints] = Field(None, description="Routing constraints (PromptRouter extension)")


class ChatCompletionMessage(BaseModel):
    """Message in the response"""
    role: Literal["assistant"] = Field("assistant", description="Always 'assistant' for completions")
    content: str = Field(..., description="Generated content")


class ChatCompletionChoice(BaseModel):
    """A single completion choice"""
    index: int = Field(..., description="Index of this choice")
    message: ChatCompletionMessage = Field(..., description="The generated message")
    finish_reason: Optional[Literal["stop", "length", "content_filter"]] = Field("stop", description="Reason for completion finish")


class ChatCompletionUsage(BaseModel):
    """Token usage information"""
    prompt_tokens: int = Field(..., description="Tokens in the prompt")
    completion_tokens: int = Field(..., description="Tokens in the completion")
    total_tokens: int = Field(..., description="Total tokens used")


class PromptRouterMetadata(BaseModel):
    """PromptRouter-specific metadata (extension to OpenAI format)"""
    routing: RoutingDecision = Field(..., description="Routing decision details")
    savings: dict = Field(..., description="Cost savings information")
    was_routed: bool = Field(..., description="Whether model was auto-selected by routing engine")


class ChatCompletionResponse(BaseModel):
    """OpenAI-compatible chat completion response with PromptRouter extensions"""
    id: str = Field(default_factory=lambda: f"chatcmpl-{secrets.token_hex(12)}", description="Unique completion ID")
    object: Literal["chat.completion"] = Field("chat.completion", description="Object type")
    created: int = Field(default_factory=lambda: int(time.time()), description="Unix timestamp")
    model: str = Field(..., description="Model used for completion")
    choices: list[ChatCompletionChoice] = Field(..., description="List of completion choices")
    usage: ChatCompletionUsage = Field(..., description="Token usage")
    
    # PromptRouter extension (custom field, ignored by standard OpenAI clients)
    x_promptrouter: Optional[PromptRouterMetadata] = Field(None, alias="x-promptrouter", description="PromptRouter metadata")
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
