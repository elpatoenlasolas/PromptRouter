"""
Database models
"""
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, Text, Boolean, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class UserTier(str, enum.Enum):
    """User subscription tiers"""
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    ELITE = "elite"


class ProviderType(str, enum.Enum):
    """LLM provider types"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    GROK = "grok"
    DEEPSEEK = "deepseek"
    MISTRAL = "mistral"


class User(Base):
    """User account"""
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    clerk_user_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    tier: Mapped[UserTier] = mapped_column(SQLEnum(UserTier), default=UserTier.FREE)
    monthly_token_limit: Mapped[int] = mapped_column(Integer, default=10_000)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    api_keys = relationship("UserAPIKey", back_populates="user", cascade="all, delete-orphan")
    api_tokens = relationship("APIToken", back_populates="user", cascade="all, delete-orphan")
    executions = relationship("PromptExecution", back_populates="user", cascade="all, delete-orphan")


class UserAPIKey(Base):
    """User's encrypted LLM provider API keys"""
    __tablename__ = "user_api_keys"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    provider: Mapped[ProviderType] = mapped_column(SQLEnum(ProviderType))
    encrypted_key: Mapped[str] = mapped_column(Text)  # Encrypted API key
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class APIToken(Base):
    """PromptRouter API tokens for users to authenticate API requests"""
    __tablename__ = "api_tokens"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    token: Mapped[str] = mapped_column(String(128), unique=True, index=True)  # pr_live_xxxxx (72 chars total)
    name: Mapped[str] = mapped_column(String(255))  # User-defined name for the token
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="api_tokens")


class PromptExecution(Base):
    """Record of each prompt execution"""
    __tablename__ = "prompt_executions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    
    # Request details
    prompt_hash: Mapped[str] = mapped_column(String(64), index=True)  # SHA256 hash for caching
    prompt_length: Mapped[int] = mapped_column(Integer)  # Character count (not stored raw)
    messages: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # Chat messages array for chat completions
    message_count: Mapped[int | None] = mapped_column(Integer, nullable=True)  # Number of messages in conversation
    
    # Routing decision
    selected_provider: Mapped[ProviderType] = mapped_column(SQLEnum(ProviderType))
    selected_model: Mapped[str] = mapped_column(String(100))
    routing_reason: Mapped[str] = mapped_column(Text)  # Why this model was chosen
    
    # Execution metrics
    input_tokens: Mapped[int] = mapped_column(Integer)
    output_tokens: Mapped[int] = mapped_column(Integer)
    total_tokens: Mapped[int] = mapped_column(Integer)
    
    # Cost tracking (in euros)
    actual_cost: Mapped[float] = mapped_column(Float)
    cheapest_alternative_cost: Mapped[float] = mapped_column(Float)  # What GPT-4 would have cost
    savings: Mapped[float] = mapped_column(Float)
    
    # Performance
    latency_ms: Mapped[int] = mapped_column(Integer)
    
    # Status
    success: Mapped[bool] = mapped_column(Boolean, default=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Metadata
    constraints: Mapped[dict] = mapped_column(JSON, nullable=True)  # User's constraints
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="executions")


class ModelPricing(Base):
    """Current pricing for each model (updated periodically)"""
    __tablename__ = "model_pricing"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    provider: Mapped[ProviderType] = mapped_column(SQLEnum(ProviderType))
    model_name: Mapped[str] = mapped_column(String(100))
    
    # Pricing in euros per 1K tokens
    input_price_per_1k: Mapped[float] = mapped_column(Float)
    output_price_per_1k: Mapped[float] = mapped_column(Float)
    
    # Performance characteristics
    avg_latency_ms: Mapped[int] = mapped_column(Integer)
    quality_tier: Mapped[str] = mapped_column(String(50))  # "basic", "standard", "premium"
    
    # Metadata
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
