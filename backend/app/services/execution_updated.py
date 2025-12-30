"""
Updated prompt execution service with usage limit enforcement
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.router import RoutingEngine
from app.adapters.openai import OpenAIAdapter
from app.adapters.anthropic import AnthropicAdapter
from app.adapters.google import GoogleAdapter
from app.adapters.grok import GrokAdapter
from app.models.database import PromptExecution, User, UserAPIKey, ProviderType
from app.models.schemas import PromptRequest, PromptResponse, RoutingDecision
from app.core.security import decrypt_api_key
from app.services.usage_limits import UsageLimitService
from sqlalchemy import select
import hashlib


class PromptExecutionService:
    """Service for executing prompts through the routing engine"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.routing_engine = RoutingEngine()
        self.usage_service = UsageLimitService(db)
    
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
        # Estimate tokens (rough approximation: 1 token ≈ 4 characters)
        estimated_input_tokens = len(request.prompt) // 4
        estimated_output_tokens = request.max_tokens or 1000
        estimated_total = estimated_input_tokens + estimated_output_tokens
        
        # Check usage limit BEFORE executing
        await self.usage_service.enforce_usage_limit(user_id, estimated_total)
        
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
        
        # Select optimal model
        selected_model, routing_reason = self.routing_engine.select_model(
            available_providers=available_providers,
            constraints=request.constraints,
        )
        
        # Get the appropriate adapter and API key
        provider_key = next(
            key for key in api_keys 
            if key.provider.value == selected_model.provider
        )
        decrypted_key = decrypt_api_key(provider_key.encrypted_key)
        
        # Initialize adapter
        adapter = self._get_adapter(selected_model.provider, decrypted_key)
        await adapter.initialize()
        
        # Execute prompt
        result = await adapter.execute_prompt(
            prompt=request.prompt,
            model=selected_model.name,
            system_message=request.system_message,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
        )
        
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
        
        # Get updated usage stats
        usage_stats = await self.usage_service.get_usage_stats(user_id)
        
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
                "usage_stats": usage_stats,
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
