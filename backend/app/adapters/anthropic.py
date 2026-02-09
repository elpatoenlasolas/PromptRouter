"""
Anthropic adapter
"""
import time
from anthropic import AsyncAnthropic
from app.adapters.base import BaseLLMAdapter, ModelInfo, PromptResult
from typing import Optional


class AnthropicAdapter(BaseLLMAdapter):
    """Adapter for Anthropic Claude API"""
    
    # Model pricing (euros per 1K tokens) - Updated January 2026
    # Source: https://anthropic.com/pricing
    MODELS = {
        "claude-3-5-haiku": ModelInfo(
            name="claude-3-5-haiku-20241022",
            provider="anthropic",
            input_price_per_1k=0.0008,    # $0.80 per 1M tokens
            output_price_per_1k=0.004,    # $4.00 per 1M tokens
            avg_latency_ms=400,
            quality_tier="standard",
            max_tokens=8192,
        ),
        "claude-3-5-sonnet": ModelInfo(
            name="claude-3-5-sonnet-20241022",
            provider="anthropic",
            input_price_per_1k=0.003,     # $3.00 per 1M tokens
            output_price_per_1k=0.015,    # $15.00 per 1M tokens
            avg_latency_ms=800,
            quality_tier="premium",
            max_tokens=8192,
        ),
        "claude-3-opus": ModelInfo(
            name="claude-3-opus-20240229",
            provider="anthropic",
            input_price_per_1k=0.015,     # $15.00 per 1M tokens
            output_price_per_1k=0.075,    # $75.00 per 1M tokens
            avg_latency_ms=2500,
            quality_tier="premium",
            max_tokens=4096,
        ),
        # Legacy models for backwards compatibility
        "claude-3-haiku": ModelInfo(
            name="claude-3-haiku-20240307",
            provider="anthropic",
            input_price_per_1k=0.00025,
            output_price_per_1k=0.00125,
            avg_latency_ms=600,
            quality_tier="basic",
            max_tokens=4096,
        ),
        "claude-3-sonnet": ModelInfo(
            name="claude-3-sonnet-20240229",
            provider="anthropic",
            input_price_per_1k=0.003,
            output_price_per_1k=0.015,
            avg_latency_ms=1200,
            quality_tier="standard",
            max_tokens=4096,
        ),
    }
    
    async def initialize(self):
        """Initialize Anthropic client"""
        self._client = AsyncAnthropic(api_key=self.api_key)
    
    async def execute_prompt(
        self,
        prompt: str,
        model: str,
        system_message: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> PromptResult:
        """Execute prompt using Anthropic API"""
        if not self._client:
            await self.initialize()
        
        start_time = time.time()
        
        response = await self._client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_message if system_message else "",
            messages=[{"role": "user", "content": prompt}],
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        # Extract content
        content = response.content[0].text
        
        # Extract token usage
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
        total_tokens = input_tokens + output_tokens
        
        # Calculate cost
        cost = self.calculate_cost(input_tokens, output_tokens, model)
        
        return PromptResult(
            content=content,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total_tokens,
            latency_ms=latency_ms,
            model_used=model,
            cost=cost,
        )
    
    async def execute_chat(
        self,
        messages: list[dict],
        model: str,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> PromptResult:
        """Execute chat completion with messages array"""
        if not self._client:
            await self.initialize()
        
        # Extract system message if present
        system_message = ""
        chat_messages = []
        
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                chat_messages.append(msg)
        
        start_time = time.time()
        
        response = await self._client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_message,
            messages=chat_messages,
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        content = response.content[0].text
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
        total_tokens = input_tokens + output_tokens
        cost = self.calculate_cost(input_tokens, output_tokens, model)
        
        return PromptResult(
            content=content,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total_tokens,
            latency_ms=latency_ms,
            model_used=model,
            cost=cost,
        )
    
    def get_available_models(self) -> list[ModelInfo]:
        """Get list of available Anthropic models"""
        return list(self.MODELS.values())
    
    def calculate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Calculate cost in euros"""
        # Normalize model name
        model_key = model.split("-20")[0]  # Remove date suffix
        model_info = self.MODELS.get(model_key)
        if not model_info:
            raise ValueError(f"Unknown model: {model}")
        
        input_cost = (input_tokens / 1000) * model_info.input_price_per_1k
        output_cost = (output_tokens / 1000) * model_info.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
