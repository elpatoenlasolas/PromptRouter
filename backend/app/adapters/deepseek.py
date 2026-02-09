"""
DeepSeek adapter
DeepSeek API is OpenAI-compatible, making integration straightforward.
"""
import time
from openai import AsyncOpenAI
from app.adapters.base import BaseLLMAdapter, ModelInfo, PromptResult
from typing import Optional


class DeepSeekAdapter(BaseLLMAdapter):
    """Adapter for DeepSeek API (OpenAI-compatible)"""
    
    # Model pricing (euros per 1K tokens) - January 2026
    # Source: https://platform.deepseek.com/api-docs/pricing
    # DeepSeek is known for extremely competitive pricing
    MODELS = {
        "deepseek-chat": ModelInfo(
            name="deepseek-chat",
            provider="deepseek",
            input_price_per_1k=0.00014,   # $0.14 per 1M tokens (cache miss)
            output_price_per_1k=0.00028,  # $0.28 per 1M tokens
            avg_latency_ms=800,
            quality_tier="standard",
            max_tokens=64000,
        ),
        "deepseek-reasoner": ModelInfo(
            name="deepseek-reasoner",
            provider="deepseek",
            input_price_per_1k=0.00055,   # $0.55 per 1M tokens
            output_price_per_1k=0.00219,  # $2.19 per 1M tokens
            avg_latency_ms=2000,
            quality_tier="premium",
            max_tokens=64000,
        ),
    }
    
    BASE_URL = "https://api.deepseek.com"
    
    async def initialize(self):
        """Initialize DeepSeek client (OpenAI-compatible)"""
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
        """Execute prompt using DeepSeek API"""
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
        """Get list of available DeepSeek models"""
        return list(self.MODELS.values())
    
    def calculate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Calculate cost in euros"""
        model_info = self.MODELS.get(model)
        if not model_info:
            # Fallback to deepseek-chat pricing
            model_info = self.MODELS["deepseek-chat"]
        
        input_cost = (input_tokens / 1000) * model_info.input_price_per_1k
        output_cost = (output_tokens / 1000) * model_info.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
