"""
Mistral AI adapter
Mistral API is similar to OpenAI's API format.
"""
import time
from openai import AsyncOpenAI
from app.adapters.base import BaseLLMAdapter, ModelInfo, PromptResult
from typing import Optional


class MistralAdapter(BaseLLMAdapter):
    """Adapter for Mistral AI API"""
    
    # Model pricing (euros per 1K tokens) - January 2026
    # Source: https://mistral.ai/pricing/
    MODELS = {
        "mistral-small-latest": ModelInfo(
            name="mistral-small-latest",
            provider="mistral",
            input_price_per_1k=0.0001,    # $0.1 per 1M tokens
            output_price_per_1k=0.0003,   # $0.3 per 1M tokens
            avg_latency_ms=400,
            quality_tier="basic",
            max_tokens=32000,
        ),
        "mistral-medium-latest": ModelInfo(
            name="mistral-medium-latest",
            provider="mistral",
            input_price_per_1k=0.00027,   # $0.27 per 1M tokens
            output_price_per_1k=0.00081,  # $0.81 per 1M tokens
            avg_latency_ms=600,
            quality_tier="standard",
            max_tokens=32000,
        ),
        "mistral-large-latest": ModelInfo(
            name="mistral-large-latest",
            provider="mistral",
            input_price_per_1k=0.002,     # $2 per 1M tokens
            output_price_per_1k=0.006,    # $6 per 1M tokens
            avg_latency_ms=1000,
            quality_tier="premium",
            max_tokens=128000,
        ),
        "codestral-latest": ModelInfo(
            name="codestral-latest",
            provider="mistral",
            input_price_per_1k=0.0003,    # $0.3 per 1M tokens
            output_price_per_1k=0.0009,   # $0.9 per 1M tokens
            avg_latency_ms=500,
            quality_tier="standard",
            max_tokens=32000,
        ),
        "pixtral-large-latest": ModelInfo(
            name="pixtral-large-latest",
            provider="mistral",
            input_price_per_1k=0.002,     # $2 per 1M tokens
            output_price_per_1k=0.006,    # $6 per 1M tokens
            avg_latency_ms=1200,
            quality_tier="premium",
            max_tokens=128000,
        ),
    }
    
    BASE_URL = "https://api.mistral.ai/v1"
    
    async def initialize(self):
        """Initialize Mistral client (OpenAI-compatible)"""
        self._client = AsyncOpenAI(
            api_key=self.api_key,
            base_url=self.BASE_URL,
        )
    
    async def execute_prompt(
        self,
        prompt: str,
        model: str,
        system_message: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> PromptResult:
        """Execute prompt using Mistral API"""
        if not self._client:
            await self.initialize()
        
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
        start_time = time.time()
        
        response = await self._client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        usage = response.usage
        content = response.choices[0].message.content
        cost = self.calculate_cost(usage.prompt_tokens, usage.completion_tokens, model)
        
        return PromptResult(
            content=content,
            input_tokens=usage.prompt_tokens,
            output_tokens=usage.completion_tokens,
            total_tokens=usage.total_tokens,
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
        
        start_time = time.time()
        
        response = await self._client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            **kwargs
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        usage = response.usage
        content = response.choices[0].message.content
        cost = self.calculate_cost(usage.prompt_tokens, usage.completion_tokens, model)
        
        return PromptResult(
            content=content,
            input_tokens=usage.prompt_tokens,
            output_tokens=usage.completion_tokens,
            total_tokens=usage.total_tokens,
            latency_ms=latency_ms,
            model_used=model,
            cost=cost,
        )
    
    def get_available_models(self) -> list[ModelInfo]:
        """Get list of available Mistral models"""
        return list(self.MODELS.values())
    
    def calculate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Calculate cost in euros"""
        model_info = self.MODELS.get(model)
        if not model_info:
            # Fallback to mistral-small pricing
            model_info = self.MODELS["mistral-small-latest"]
        
        input_cost = (input_tokens / 1000) * model_info.input_price_per_1k
        output_cost = (output_tokens / 1000) * model_info.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
