"""
Application configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "PromptRouter"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    API_SECRET_KEY: str
    ENCRYPTION_KEY: str
    
    # LLM Provider API Keys (for admin testing only)
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None
    GROK_API_KEY: str | None = None
    
    # Stripe Payment Configuration
    STRIPE_SECRET_KEY: str | None = None
    STRIPE_PUBLISHABLE_KEY: str | None = None
    STRIPE_WEBHOOK_SECRET: str | None = None
    STRIPE_STARTER_PRICE_ID: str | None = None
    STRIPE_PRO_PRICE_ID: str | None = None
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Pricing (tokens per euro)
    OPENAI_GPT35_INPUT_PRICE: float = 0.0005  # per 1K tokens
    OPENAI_GPT4_INPUT_PRICE: float = 0.03
    ANTHROPIC_CLAUDE_INPUT_PRICE: float = 0.008
    GOOGLE_GEMINI_INPUT_PRICE: float = 0.00025
    GROK_INPUT_PRICE: float = 0.01
    
    # Rate limits
    FREE_TIER_MONTHLY_TOKENS: int = 10_000
    STARTER_TIER_MONTHLY_TOKENS: int = 500_000
    PRO_TIER_MONTHLY_TOKENS: int = 5_000_000
    
    # Cache settings
    CACHE_TTL_SECONDS: int = 300  # 5 minutes
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
