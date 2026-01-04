"""
Base adapter interface for LLM providers
"""
from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass


@dataclass
class ModelInfo:
    """Information about a specific model"""
    name: str
    provider: str
    input_price_per_1k: float  # euros
    output_price_per_1k: float  # euros
    avg_latency_ms: int
    quality_tier: str  # "basic", "standard", "premium"
    max_tokens: int
    supports_system_message: bool = True


@dataclass
class PromptResult:
    """Result from prompt execution"""
    content: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    latency_ms: int
    model_used: str
    cost: float  # in euros


class BaseLLMAdapter(ABC):
    """Base class for all LLM provider adapters"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self._client = None
    
    @abstractmethod
    async def initialize(self):
        """Initialize the provider client"""
        pass
    
    @abstractmethod
    async def execute_prompt(
        self,
        prompt: str,
        model: str,
        system_message: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> PromptResult:
        """
        Execute a prompt and return normalized result
        
        Args:
            prompt: The user prompt
            model: Model identifier
            system_message: Optional system message
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            
        Returns:
            PromptResult with content and metrics
        """
        pass
    
    @abstractmethod
    async def execute_chat(
        self,
        messages: list[dict],
        model: str,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> PromptResult:
        """
        Execute a chat completion with message array (OpenAI-compatible)
        
        Args:
            messages: List of message dicts with 'role' and 'content' keys
            model: Model identifier
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            **kwargs: Additional provider-specific parameters
            
        Returns:
            PromptResult with content and metrics
        """
        pass
    
    @abstractmethod
    def get_available_models(self) -> list[ModelInfo]:
        """Get list of available models with pricing"""
        pass
    
    @abstractmethod
    def calculate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Calculate cost in euros for given token usage"""
        pass
    
    def _normalize_model_name(self, model: str) -> str:
        """Normalize model name for consistent routing"""
        return model.lower().replace("-", "_")
