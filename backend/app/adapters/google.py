"""
Google Gemini adapter
"""
import time
import google.generativeai as genai
from app.adapters.base import BaseLLMAdapter, ModelInfo, PromptResult
from typing import Optional


class GoogleAdapter(BaseLLMAdapter):
    """Adapter for Google Gemini API"""
    
    MODELS = {
        "gemini-pro": ModelInfo(
            name="gemini-pro",
            provider="google",
            input_price_per_1k=0.00025,
            output_price_per_1k=0.0005,
            avg_latency_ms=900,
            quality_tier="standard",
            max_tokens=8192,
        ),
        "gemini-1.5-pro": ModelInfo(
            name="gemini-1.5-pro",
            provider="google",
            input_price_per_1k=0.0035,
            output_price_per_1k=0.0105,
            avg_latency_ms=1500,
            quality_tier="premium",
            max_tokens=32768,
        ),
    }
    
    async def initialize(self):
        """Initialize Google Gemini client"""
        genai.configure(api_key=self.api_key)
        self._client = genai
    
    async def execute_prompt(
        self,
        prompt: str,
        model: str,
        system_message: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> PromptResult:
        """Execute prompt using Google Gemini API"""
        if not self._client:
            await self.initialize()
        
        # Combine system message with prompt if provided
        full_prompt = f"{system_message}\n\n{prompt}" if system_message else prompt
        
        model_instance = genai.GenerativeModel(model)
        
        start_time = time.time()
        
        response = await model_instance.generate_content_async(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            ),
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        content = response.text
        
        # Estimate tokens (Google doesn't always provide exact counts)
        # Rough estimation: 1 token ≈ 4 characters
        input_tokens = len(full_prompt) // 4
        output_tokens = len(content) // 4
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
    
    def get_available_models(self) -> list[ModelInfo]:
        """Get list of available Google models"""
        return list(self.MODELS.values())
    
    def calculate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Calculate cost in euros"""
        model_info = self.MODELS.get(model)
        if not model_info:
            raise ValueError(f"Unknown model: {model}")
        
        input_cost = (input_tokens / 1000) * model_info.input_price_per_1k
        output_cost = (output_tokens / 1000) * model_info.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
