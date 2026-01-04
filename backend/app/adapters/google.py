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
        "gemini-2.5-flash": ModelInfo(
            name="models/gemini-2.5-flash",  # Full model name with prefix
            provider="google",
            input_price_per_1k=0.000075,  # Updated pricing for 2.5-flash
            output_price_per_1k=0.0003,
            avg_latency_ms=600,
            quality_tier="standard",
            max_tokens=8192,
        ),
        "gemini-2.0-flash": ModelInfo(
            name="models/gemini-2.0-flash",  # Full model name with prefix
            provider="google",
            input_price_per_1k=0.000075,
            output_price_per_1k=0.0003,
            avg_latency_ms=700,
            quality_tier="standard",
            max_tokens=8192,
        ),
        "gemini-2.5-pro": ModelInfo(
            name="models/gemini-2.5-pro",  # Full model name with prefix
            provider="google",
            input_price_per_1k=0.00125,   # $1.25 per 1M input tokens
            output_price_per_1k=0.005,    # $5.00 per 1M output tokens
            avg_latency_ms=1500,
            quality_tier="premium",
            max_tokens=32768,
        ),
        "gemini-pro-latest": ModelInfo(
            name="models/gemini-pro-latest",  # Full model name with prefix
            provider="google",
            input_price_per_1k=0.00125,
            output_price_per_1k=0.005,
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
        
        # Normalize model name - remove 'models/' prefix if present for lookup
        model_key = model.replace('models/', '') if model.startswith('models/') else model
        
        # Verify model exists in our MODELS dict
        if model_key not in self.MODELS:
            raise ValueError(f"Model {model} is not available. Available models: {list(self.MODELS.keys())}")
        
        # Get the full model name with prefix for API call
        model_info = self.MODELS[model_key]
        api_model_name = model_info.name  # This already has 'models/' prefix
        
        try:
            # List available models to see what's actually available
            try:
                available_models = [m.name for m in genai.list_models()]
                print(f"DEBUG: Available Google models: {available_models[:5]}...")  # Show first 5
            except Exception as list_error:
                print(f"DEBUG: Could not list models: {list_error}")
            
            # Combine system message with prompt if provided
            # Google Gemini handles system messages differently - we'll prepend it
            full_prompt = f"{system_message}\n\n{prompt}" if system_message else prompt
            
            # Create model instance with full API name
            print(f"DEBUG: Using model: {api_model_name}")
            model_instance = genai.GenerativeModel(api_model_name)
            
            start_time = time.time()
            
            # Execute with proper error handling
            try:
                response = await model_instance.generate_content_async(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=max_tokens,
                        temperature=temperature,
                    ),
                )
            except Exception as api_error:
                error_msg = str(api_error)
                # Try to list available models for better error message
                try:
                    available_models = [m.name for m in genai.list_models()]
                    available_str = ", ".join(available_models)
                except:
                    available_str = "Unable to list models"
                
                # Provide more helpful error messages
                if "not found" in error_msg.lower() or "not supported" in error_msg.lower():
                    raise ValueError(
                        f"Model '{model}' is not available in Google's API. "
                        f"Available models: {available_str}. "
                        f"Original error: {error_msg}"
                    )
                elif "API key" in error_msg or "authentication" in error_msg.lower():
                    raise ValueError(f"Invalid Google API key: {error_msg}")
                else:
                    raise ValueError(f"Google API error: {error_msg}")
            
            latency_ms = int((time.time() - start_time) * 1000)
            
            # Extract content - handle different response formats
            if hasattr(response, 'text') and response.text:
                content = response.text
            elif hasattr(response, 'candidates') and response.candidates:
                content = response.candidates[0].content.parts[0].text
            else:
                raise ValueError("Unexpected response format from Google API")
            
            # Estimate tokens (Google doesn't always provide exact counts)
            # Rough estimation: 1 token ≈ 4 characters
            input_tokens = len(full_prompt) // 4
            output_tokens = len(content) // 4
            total_tokens = input_tokens + output_tokens
            
            # Calculate cost using the model key (without prefix)
            cost = self.calculate_cost(input_tokens, output_tokens, model_key)
            
            return PromptResult(
                content=content,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                total_tokens=total_tokens,
                latency_ms=latency_ms,
                model_used=model_key,  # Return without prefix for consistency
                cost=cost,
            )
        except ValueError:
            raise  # Re-raise ValueError as-is
        except Exception as e:
            raise ValueError(f"Failed to execute prompt with Google Gemini: {str(e)}")
    
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
        
        # Convert messages array to Google's format
        # Google doesn't natively support message arrays, so we concatenate
        system_message = ""
        user_messages = []
        
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            elif msg["role"] in ["user", "assistant"]:
                user_messages.append(f"{msg['role']}: {msg['content']}")
        
        # Combine into single prompt
        full_prompt = "\n\n".join(user_messages)
        if system_message:
            full_prompt = f"{system_message}\n\n{full_prompt}"
        
        # Use the execute_prompt method internally
        return await self.execute_prompt(
            prompt=full_prompt,
            model=model,
            system_message=None,  # Already combined above
            max_tokens=max_tokens,
            temperature=temperature,
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
