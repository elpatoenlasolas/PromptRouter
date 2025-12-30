"""
Intelligent routing engine - selects optimal model based on constraints
"""
from typing import Optional
from app.adapters.base import ModelInfo
from app.adapters.openai import OpenAIAdapter
from app.adapters.anthropic import AnthropicAdapter
from app.adapters.google import GoogleAdapter
from app.adapters.grok import GrokAdapter
from app.models.schemas import PromptConstraints


class RoutingEngine:
    """
    Core routing engine that selects the optimal model based on:
    - Cost (primary optimization target)
    - Latency constraints
    - Quality requirements
    - User preferences
    """
    
    def __init__(self):
        # Aggregate all available models from all adapters
        self.all_models: list[ModelInfo] = []
        self._load_all_models()
    
    def _load_all_models(self):
        """Load all available models from all providers"""
        self.all_models = (
            OpenAIAdapter("dummy").get_available_models() +
            AnthropicAdapter("dummy").get_available_models() +
            GoogleAdapter("dummy").get_available_models() +
            GrokAdapter("dummy").get_available_models()
        )
    
    def select_model(
        self,
        available_providers: list[str],
        constraints: Optional[PromptConstraints] = None,
    ) -> tuple[ModelInfo, str]:
        """
        Select the optimal model based on constraints
        
        Args:
            available_providers: List of providers user has API keys for
            constraints: User-defined constraints
            
        Returns:
            Tuple of (selected_model, routing_reason)
        """
        # Filter models by available providers
        candidate_models = [
            m for m in self.all_models 
            if m.provider in available_providers
        ]
        
        if not candidate_models:
            raise ValueError("No models available with current API keys")
        
        # Apply constraints
        constraints = constraints or PromptConstraints()
        
        # Filter by quality tier
        min_quality = constraints.min_quality_tier or "basic"
        quality_order = {"basic": 0, "standard": 1, "premium": 2}
        min_quality_level = quality_order.get(min_quality, 0)
        
        candidate_models = [
            m for m in candidate_models
            if quality_order.get(m.quality_tier, 0) >= min_quality_level
        ]
        
        # Filter by latency constraint
        if constraints.max_latency_ms:
            candidate_models = [
                m for m in candidate_models
                if m.avg_latency_ms <= constraints.max_latency_ms
            ]
        
        # Filter by cost constraint
        if constraints.max_cost_per_1k_tokens:
            candidate_models = [
                m for m in candidate_models
                if m.input_price_per_1k <= constraints.max_cost_per_1k_tokens
            ]
        
        # Prefer user's preferred providers
        if constraints.preferred_providers:
            preferred = [
                m for m in candidate_models
                if m.provider in constraints.preferred_providers
            ]
            if preferred:
                candidate_models = preferred
        
        if not candidate_models:
            raise ValueError("No models match the specified constraints")
        
        # Sort by cost (cheapest first)
        candidate_models.sort(key=lambda m: m.input_price_per_1k + m.output_price_per_1k)
        
        # Select cheapest model
        selected = candidate_models[0]
        
        # Generate routing reason
        reason = self._generate_routing_reason(selected, candidate_models, constraints)
        
        return selected, reason
    
    def _generate_routing_reason(
        self,
        selected: ModelInfo,
        candidates: list[ModelInfo],
        constraints: Optional[PromptConstraints],
    ) -> str:
        """Generate human-readable explanation for routing decision"""
        reasons = []
        
        # Cost savings
        if len(candidates) > 1:
            most_expensive = max(candidates, key=lambda m: m.input_price_per_1k)
            savings_pct = ((most_expensive.input_price_per_1k - selected.input_price_per_1k) / 
                          most_expensive.input_price_per_1k * 100)
            reasons.append(f"Cheapest option ({savings_pct:.0f}% cheaper than {most_expensive.name})")
        else:
            reasons.append("Only model matching constraints")
        
        # Quality tier
        reasons.append(f"{selected.quality_tier} quality")
        
        # Latency
        if constraints and constraints.max_latency_ms:
            reasons.append(f"~{selected.avg_latency_ms}ms latency (within {constraints.max_latency_ms}ms limit)")
        else:
            reasons.append(f"~{selected.avg_latency_ms}ms latency")
        
        # Cost per 1K tokens
        avg_cost = (selected.input_price_per_1k + selected.output_price_per_1k) / 2
        reasons.append(f"€{avg_cost:.4f} avg/1K tokens")
        
        return " | ".join(reasons)
    
    def get_cheapest_alternative_cost(
        self,
        input_tokens: int,
        output_tokens: int,
        exclude_model: str,
    ) -> float:
        """
        Calculate what this prompt would have cost with the most common expensive model (GPT-4)
        Used for calculating savings display
        """
        # Use GPT-4 as baseline for "what you would have paid"
        gpt4_model = next((m for m in self.all_models if m.name == "gpt-4"), None)
        if not gpt4_model:
            return 0.0
        
        input_cost = (input_tokens / 1000) * gpt4_model.input_price_per_1k
        output_cost = (output_tokens / 1000) * gpt4_model.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
