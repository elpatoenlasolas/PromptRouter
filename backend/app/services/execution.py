"""
Prompt execution service - orchestrates routing and provider adapters
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.router import RoutingEngine
from app.adapters.openai import OpenAIAdapter
from app.adapters.anthropic import AnthropicAdapter
from app.adapters.google import GoogleAdapter
from app.adapters.grok import GrokAdapter
from app.models.database import PromptExecution, User, UserAPIKey, ProviderType
from app.models.schemas import (
    PromptRequest, PromptResponse, RoutingDecision,
    ChatCompletionRequest, ChatCompletionResponse, ChatCompletionChoice,
    ChatCompletionMessage, ChatCompletionUsage, PromptRouterMetadata
)
from app.core.security import decrypt_api_key
from sqlalchemy import select
import hashlib


class PromptExecutionService:
    """Service for executing prompts through the routing engine"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.routing_engine = RoutingEngine()
    
    async def execute_prompt(
        self,
        user_id: int,
        request: PromptRequest,
    ) -> PromptResponse:
        """
        Execute a prompt for a user
        
        Args:
            user_id: User ID
            request: Prompt request with constraints
            
        Returns:
            PromptResponse with content, routing info, and metrics
        """
        # Get user's API keys
        result = await self.db.execute(
            select(UserAPIKey)
            .where(UserAPIKey.user_id == user_id)
            .where(UserAPIKey.is_active == True)
        )
        api_keys = result.scalars().all()
        
        if not api_keys:
            raise ValueError("No API keys configured. Please add at least one provider API key.")
        
        # Get available providers
        available_providers = [key.provider.value for key in api_keys]
        print(f"DEBUG: Available providers: {available_providers}")
        
        # Select optimal model
        try:
            selected_model, routing_reason = self.routing_engine.select_model(
                available_providers=available_providers,
                constraints=request.constraints,
            )
            print(f"DEBUG: Selected model: {selected_model.name} from {selected_model.provider}")
        except ValueError as e:
            raise ValueError(f"Model selection failed: {str(e)}")
        
        # Get the appropriate adapter and API key
        try:
            provider_key = next(
                key for key in api_keys 
                if key.provider.value == selected_model.provider
            )
        except StopIteration:
            raise ValueError(
                f"No API key found for provider {selected_model.provider}. "
                f"Available providers: {available_providers}"
            )
        
        try:
            if not provider_key.encrypted_key:
                raise ValueError(f"API key for {selected_model.provider} is empty")
            decrypted_key = decrypt_api_key(provider_key.encrypted_key)
            if not decrypted_key:
                raise ValueError(f"Decrypted API key for {selected_model.provider} is empty")
            print(f"DEBUG: Successfully decrypted API key for {selected_model.provider}")
        except ValueError as e:
            raise ValueError(f"Failed to decrypt API key for {selected_model.provider}: {str(e)}")
        except Exception as e:
            raise ValueError(f"Unexpected error decrypting API key for {selected_model.provider}: {str(e)}")
        
        # Initialize adapter
        try:
            adapter = self._get_adapter(selected_model.provider, decrypted_key)
            await adapter.initialize()
            print(f"DEBUG: Adapter initialized for {selected_model.provider}")
        except Exception as e:
            raise ValueError(f"Failed to initialize adapter for {selected_model.provider}: {str(e)}")
        
        # Execute prompt with error handling
        try:
            result = await adapter.execute_prompt(
                prompt=request.prompt,
                model=selected_model.name,
                system_message=request.system_message,
                max_tokens=request.max_tokens or 4000,
                temperature=request.temperature or 0.7,
            )
        except ValueError as e:
            # Re-raise ValueError with more context
            raise ValueError(f"Failed to execute prompt: {str(e)}")
        except Exception as e:
            # Wrap other exceptions
            raise ValueError(f"Unexpected error during prompt execution: {str(e)}")
        
        # Calculate savings
        alternative_cost = self.routing_engine.get_cheapest_alternative_cost(
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
            exclude_model=selected_model.name,
        )
        savings = alternative_cost - result.cost
        
        # Save execution record
        prompt_hash = hashlib.sha256(request.prompt.encode()).hexdigest()
        
        execution = PromptExecution(
            user_id=user_id,
            prompt_hash=prompt_hash,
            prompt_length=len(request.prompt),
            selected_provider=ProviderType(selected_model.provider),
            selected_model=selected_model.name,
            routing_reason=routing_reason,
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
            total_tokens=result.total_tokens,
            actual_cost=result.cost,
            cheapest_alternative_cost=alternative_cost,
            savings=savings,
            latency_ms=result.latency_ms,
            success=True,
            constraints=request.constraints.model_dump() if request.constraints else None,
        )
        
        self.db.add(execution)
        await self.db.commit()
        
        # Build response
        return PromptResponse(
            content=result.content,
            routing=RoutingDecision(
                provider=selected_model.provider,
                model=selected_model.name,
                reason=routing_reason,
                estimated_cost=result.cost,
                estimated_latency_ms=selected_model.avg_latency_ms,
            ),
            metrics={
                "input_tokens": result.input_tokens,
                "output_tokens": result.output_tokens,
                "total_tokens": result.total_tokens,
                "latency_ms": result.latency_ms,
            },
            savings={
                "actual_cost": result.cost,
                "alternative_cost": alternative_cost,
                "amount_saved": savings,
                "savings_percentage": round((savings / alternative_cost * 100) if alternative_cost > 0 else 0, 1),
            },
        )
    
    def _get_adapter(self, provider: str, api_key: str):
        """Get the appropriate adapter for a provider"""
        adapters = {
            "openai": OpenAIAdapter,
            "anthropic": AnthropicAdapter,
            "google": GoogleAdapter,
            "grok": GrokAdapter,
        }
        
        adapter_class = adapters.get(provider)
        if not adapter_class:
            raise ValueError(f"Unknown provider: {provider}")
        
        return adapter_class(api_key)
    
    async def execute_chat(
        self,
        user_id: int,
        request: ChatCompletionRequest,
    ) -> ChatCompletionResponse:
        """
        Execute a chat completion request (OpenAI-compatible)
        
        Args:
            user_id: User ID
            request: Chat completion request with messages array
            
        Returns:
            ChatCompletionResponse in OpenAI-compatible format
        """
        # Get user's API keys
        result = await self.db.execute(
            select(UserAPIKey)
            .where(UserAPIKey.user_id == user_id)
            .where(UserAPIKey.is_active == True)
        )
        api_keys = result.scalars().all()
        
        if not api_keys:
            raise ValueError("No API keys configured. Please add at least one provider API key.")
        
        available_providers = [key.provider.value for key in api_keys]
        
        # Calculate total tokens from messages for routing
        # Simple estimation: ~4 chars per token
        total_chars = sum(len(msg.content) for msg in request.messages)
        estimated_input_tokens = total_chars // 4
        
        # Check if user specified a model
        if request.model:
            # User wants a specific model - try to honor it
            selected_model = self._find_model_by_name(request.model, available_providers)
            routing_reason = f"User-specified model: {request.model}"
            was_routed = False
        else:
            # Use routing engine to select optimal model
            selected_model, routing_reason = self.routing_engine.select_model(
                available_providers=available_providers,
                constraints=request.constraints,
            )
            was_routed = True
        
        # Get adapter and API key
        provider_key = next(
            key for key in api_keys 
            if key.provider.value == selected_model.provider
        )
        
        decrypted_key = decrypt_api_key(provider_key.encrypted_key)
        adapter = self._get_adapter(selected_model.provider, decrypted_key)
        await adapter.initialize()
        
        # Convert Pydantic messages to dict format for adapter
        messages_dict = [msg.model_dump() for msg in request.messages]
        
        # Execute chat
        result = await adapter.execute_chat(
            messages=messages_dict,
            model=selected_model.name,
            max_tokens=request.max_tokens or 1000,
            temperature=request.temperature or 0.7,
        )
        
        # Calculate savings
        alternative_cost = self.routing_engine.get_cheapest_alternative_cost(
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
            exclude_model=selected_model.name,
        )
        savings = alternative_cost - result.cost
        
        # Save execution record
        # Create a hash of all messages
        messages_str = "".join(f"{msg.role}:{msg.content}" for msg in request.messages)
        prompt_hash = hashlib.sha256(messages_str.encode()).hexdigest()
        
        execution = PromptExecution(
            user_id=user_id,
            prompt_hash=prompt_hash,
            prompt_length=len(messages_str),
            selected_provider=ProviderType(selected_model.provider),
            selected_model=selected_model.name,
            routing_reason=routing_reason,
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
            total_tokens=result.total_tokens,
            actual_cost=result.cost,
            cheapest_alternative_cost=alternative_cost,
            savings=savings,
            latency_ms=result.latency_ms,
            success=True,
            constraints=request.constraints.model_dump() if request.constraints else None,
        )
        
        self.db.add(execution)
        await self.db.commit()
        
        # Build OpenAI-compatible response
        return ChatCompletionResponse(
            model=selected_model.name,
            choices=[
                ChatCompletionChoice(
                    index=0,
                    message=ChatCompletionMessage(
                        role="assistant",
                        content=result.content,
                    ),
                    finish_reason="stop",
                )
            ],
            usage=ChatCompletionUsage(
                prompt_tokens=result.input_tokens,
                completion_tokens=result.output_tokens,
                total_tokens=result.total_tokens,
            ),
            x_promptrouter=PromptRouterMetadata(
                routing=RoutingDecision(
                    provider=selected_model.provider,
                    model=selected_model.name,
                    reason=routing_reason,
                    estimated_cost=result.cost,
                    estimated_latency_ms=selected_model.avg_latency_ms,
                ),
                savings={
                    "actual_cost": result.cost,
                    "alternative_cost": alternative_cost,
                    "amount_saved": savings,
                    "savings_percentage": round((savings / alternative_cost * 100) if alternative_cost > 0 else 0, 1),
                },
                was_routed=was_routed,
            ),
        )
    
    def _find_model_by_name(self, model_name: str, available_providers: list[str]) -> Optional:
        """Find a model by name from available providers"""
        # Search through all models from available providers
        all_models = []
        for provider in available_providers:
            adapter_class = {
                "openai": OpenAIAdapter,
                "anthropic": AnthropicAdapter,
                "google": GoogleAdapter,
                "grok": GrokAdapter,
            }[provider]
            
            models = adapter_class("dummy").get_available_models()
            all_models.extend(models)
        
        # Try exact match first
        for model in all_models:
            if model.name == model_name or model.name.endswith(model_name):
                return model
        
        # If not found, raise error
        available_names = [m.name for m in all_models]
        raise ValueError(
            f"Model '{model_name}' not found or not available with your API keys. "
            f"Available models: {', '.join(available_names)}"
        )
