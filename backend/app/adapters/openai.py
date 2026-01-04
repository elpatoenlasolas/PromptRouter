"""
OpenAI adapter
"""
import time
from openai import AsyncOpenAI
from app.adapters.base import BaseLLMAdapter, ModelInfo, PromptResult
from typing import Optional


class OpenAIAdapter(BaseLLMAdapter):
    """Adapter for OpenAI API"""
    
    # Model pricing (euros per 1K tokens) - Update these with current prices
    MODELS = {
        "gpt-3.5-turbo": ModelInfo(
            name="gpt-3.5-turbo",
            provider="openai",
            input_price_per_1k=0.0005,
            output_price_per_1k=0.0015,
            avg_latency_ms=800,
            quality_tier="standard",
            max_tokens=4096,
        ),
        "gpt-4": ModelInfo(
            name="gpt-4",
            provider="openai",
            input_price_per_1k=0.03,
            output_price_per_1k=0.06,
            avg_latency_ms=2000,
            quality_tier="premium",
            max_tokens=8192,
        ),
        "gpt-4-turbo": ModelInfo(
            name="gpt-4-turbo",
            provider="openai",
            input_price_per_1k=0.01,
            output_price_per_1k=0.03,
            avg_latency_ms=1500,
            quality_tier="premium",
            max_tokens=128000,
        ),
    }
    
    async def initialize(self):
        """Initialize OpenAI client"""
        self._client = AsyncOpenAI(api_key=self.api_key)
    
    async def execute_prompt(
        self,
        prompt: str,
        model: str,
        system_message: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> PromptResult:
        """Execute prompt using OpenAI API"""
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
        
        # Extract metrics
        usage = response.usage
        content = response.choices[0].message.content
        
        # Calculate cost
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
        """Get list of available OpenAI models"""
        return list(self.MODELS.values())
    
    def calculate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Calculate cost in euros"""
        model_info = self.MODELS.get(model)
        if not model_info:
            raise ValueError(f"Unknown model: {model}")
        
        input_cost = (input_tokens / 1000) * model_info.input_price_per_1k
        output_cost = (output_tokens / 1000) * model_info.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
