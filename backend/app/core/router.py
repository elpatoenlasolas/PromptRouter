"""
Intelligent routing engine - selects optimal model based on constraints

DESIGN PHILOSOPHY:
- Optimizes for cost by default (most users want savings)
- Escalates to premium models when risk/correctness demands it
- Uses weighted scoring instead of pure cost sorting
- Provides transparent, explainable decisions
- Never compromises safety for cost
"""
from typing import Optional
from app.adapters.base import ModelInfo
from app.adapters.openai import OpenAIAdapter
from app.adapters.anthropic import AnthropicAdapter
from app.adapters.google import GoogleAdapter
from app.adapters.grok import GrokAdapter
from app.adapters.deepseek import DeepSeekAdapter
from app.adapters.mistral import MistralAdapter
from app.models.schemas import PromptConstraints


class RoutingEngine:
    """
    Core routing engine using weighted multi-objective optimization.
    
    ROUTING STRATEGY:
    1. Filter models by hard constraints (cost ceiling, latency ceiling, min quality)
    2. Calculate weighted score for each candidate:
       score = (cost_weight × cost_score) + (quality_weight × quality_score) + (latency_weight × latency_score)
    3. Apply risk-based overrides (force premium for high-risk tasks)
    4. Select highest-scoring model
    5. Generate honest, context-aware explanation
    
    RISK ESCALATION RULES:
    - risk_level="critical" OR requires_verification=True → minimum "premium" quality
    - risk_level="high" → minimum "standard" quality
    - is_irreversible=True AND risk_level >= "medium" → minimum "standard" quality
    """
    
    # Risk level to minimum quality tier mapping
    RISK_TO_QUALITY = {
        "low": "basic",
        "medium": "basic", 
        "high": "standard",
        "critical": "premium"
    }
    
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
            GrokAdapter("dummy").get_available_models() +
            DeepSeekAdapter("dummy").get_available_models() +
            MistralAdapter("dummy").get_available_models()
        )
    
    def select_model(
        self,
        available_providers: list[str],
        constraints: Optional[PromptConstraints] = None,
    ) -> tuple[ModelInfo, str]:
        """
        Select the optimal model using weighted multi-objective optimization.
        
        Args:
            available_providers: List of providers user has API keys for
            constraints: User-defined constraints (cost, quality, risk, etc.)
            
        Returns:
            Tuple of (selected_model, routing_reason)
            
        Raises:
            ValueError: If no models match constraints
        """
        # Initialize constraints with safe defaults
        constraints = constraints or PromptConstraints()
        
        # STEP 1: Apply risk-based quality escalation
        # This is a safety override - high-risk tasks MUST use better models
        effective_min_quality = self._determine_effective_quality(constraints)
        
        # STEP 2: Filter models by available providers
        candidate_models = [
            m for m in self.all_models 
            if m.provider in available_providers
        ]
        
        if not candidate_models:
            raise ValueError("No models available with current API keys")
        
        # STEP 3: Apply hard constraints (these are non-negotiable ceilings)
        candidate_models = self._apply_hard_constraints(
            candidate_models, 
            constraints, 
            effective_min_quality
        )
        
        if not candidate_models:
            raise ValueError("No models match the specified constraints")
        
        # STEP 4: Apply soft preferences (preferred providers)
        candidate_models = self._apply_soft_preferences(candidate_models, constraints)
        
        # STEP 5: Score each model using weighted multi-objective function
        scored_models = [
            (model, self._calculate_model_score(model, constraints))
            for model in candidate_models
        ]
        
        # STEP 6: Select highest-scoring model (lower score = better)
        # Note: We minimize score because lower cost/latency is better
        scored_models.sort(key=lambda x: x[1])
        selected, score = scored_models[0]
        
        # STEP 7: Generate context-aware explanation
        reason = self._generate_routing_reason(
            selected, 
            candidate_models, 
            constraints,
            was_risk_escalated=(effective_min_quality != constraints.min_quality_tier)
        )
        
        return selected, reason
    
    def _determine_effective_quality(self, constraints: PromptConstraints) -> str:
        """
        Determine the effective minimum quality tier based on risk analysis.
        
        This is a critical safety mechanism. We escalate quality requirements when:
        - Task has high risk level
        - Task requires factual verification
        - Decision is irreversible
        
        Returns the MORE RESTRICTIVE of: user's min_quality OR risk-based minimum
        """
        risk_level = constraints.risk_level or "low"
        min_from_risk = self.RISK_TO_QUALITY.get(risk_level, "basic")
        
        # Verification tasks always need at least standard quality
        if constraints.requires_verification:
            min_from_risk = max(min_from_risk, "standard", key=self._quality_rank)
        
        # Irreversible decisions with medium+ risk need standard quality
        if constraints.is_irreversible and risk_level in ["medium", "high", "critical"]:
            min_from_risk = max(min_from_risk, "standard", key=self._quality_rank)
        
        # Return the stricter requirement
        user_min = constraints.min_quality_tier or "basic"
        return max(user_min, min_from_risk, key=self._quality_rank)
    
    def _quality_rank(self, tier: str) -> int:
        """Convert quality tier to numeric rank for comparison"""
        return {"basic": 0, "standard": 1, "premium": 2}.get(tier, 0)
    
    def _apply_hard_constraints(
        self, 
        models: list[ModelInfo], 
        constraints: PromptConstraints,
        effective_min_quality: str
    ) -> list[ModelInfo]:
        """
        Filter models by hard constraints (non-negotiable requirements).
        These are ceilings that cannot be exceeded.
        """
        filtered = models
        
        # Quality tier filter (use effective quality from risk analysis)
        min_quality_level = self._quality_rank(effective_min_quality)
        filtered = [
            m for m in filtered
            if self._quality_rank(m.quality_tier) >= min_quality_level
        ]
        
        # Latency ceiling (hard limit)
        if constraints.max_latency_ms:
            filtered = [
                m for m in filtered
                if m.avg_latency_ms <= constraints.max_latency_ms
            ]
        
        # Cost ceiling (hard limit)
        if constraints.max_cost_per_1k_tokens:
            filtered = [
                m for m in filtered
                if m.input_price_per_1k <= constraints.max_cost_per_1k_tokens
            ]
        
        return filtered
    
    def _apply_soft_preferences(
        self, 
        models: list[ModelInfo], 
        constraints: PromptConstraints
    ) -> list[ModelInfo]:
        """
        Apply soft preferences (nice-to-have, not required).
        If preferred providers exist and have models, use only those.
        Otherwise, keep all candidates.
        """
        if constraints.preferred_providers:
            preferred = [
                m for m in models
                if m.provider in constraints.preferred_providers
            ]
            # Only filter if preferred providers actually have models
            if preferred:
                return preferred
        
        return models
    
    def _calculate_model_score(
        self, 
        model: ModelInfo, 
        constraints: PromptConstraints
    ) -> float:
        """
        Calculate weighted score for a model using multi-objective optimization.
        
        LOWER SCORE = BETTER MODEL
        
        Score = (cost_weight × normalized_cost) + 
                (quality_weight × normalized_quality_penalty) +
                (latency_weight × normalized_latency)
        
        Normalization ensures different metrics are comparable.
        Quality penalty: higher quality = lower penalty (we want quality)
        """
        # Extract weights (default to cost-optimizing behavior)
        cost_weight = constraints.cost_priority if constraints.cost_priority is not None else 0.7
        latency_weight = constraints.latency_priority if constraints.latency_priority is not None else 0.2
        quality_weight = constraints.quality_priority if constraints.quality_priority is not None else 0.1
        
        # Normalize weights to sum to 1.0
        total_weight = cost_weight + latency_weight + quality_weight
        if total_weight > 0:
            cost_weight /= total_weight
            latency_weight /= total_weight
            quality_weight /= total_weight
        
        # Calculate normalized scores (0-1 range)
        # Cost: normalize to typical range (€0.0001 to €0.03 per 1K tokens)
        avg_cost = (model.input_price_per_1k + model.output_price_per_1k) / 2
        cost_score = min(avg_cost / 0.03, 1.0)  # Cap at 1.0
        
        # Latency: normalize to typical range (100ms to 5000ms)
        latency_score = min(model.avg_latency_ms / 5000, 1.0)
        
        # Quality: inverse score (premium=0, standard=0.5, basic=1.0)
        # We penalize LOWER quality, so premium models score best here
        quality_penalty = {
            "premium": 0.0,
            "standard": 0.5,
            "basic": 1.0
        }.get(model.quality_tier, 1.0)
        
        # Weighted combination
        score = (
            cost_weight * cost_score +
            latency_weight * latency_score +
            quality_weight * quality_penalty
        )
        
        return score
    
    def _generate_routing_reason(
        self,
        selected: ModelInfo,
        candidates: list[ModelInfo],
        constraints: Optional[PromptConstraints],
        was_risk_escalated: bool = False
    ) -> str:
        """
        Generate honest, context-aware explanation for routing decision.
        
        CRITICAL: Never imply cost savings when quality/risk was the driver.
        Be transparent about why premium models were chosen.
        """
        reasons = []
        
        # PRIMARY REASON: Why this specific model?
        if was_risk_escalated:
            # Risk-based escalation happened
            risk_level = constraints.risk_level or "low"
            if constraints.requires_verification:
                reasons.append(f"⚠️ Verification required → {selected.quality_tier} quality enforced")
            elif constraints.is_irreversible:
                reasons.append(f"⚠️ Irreversible decision → {selected.quality_tier} quality enforced")
            else:
                reasons.append(f"⚠️ {risk_level.capitalize()} risk → {selected.quality_tier} quality enforced")
        
        elif selected.quality_tier == "premium":
            # Premium chosen but not by risk escalation - explain why
            reasons.append(f"Premium quality selected (accuracy prioritized)")
        
        else:
            # Cost optimization scenario
            if len(candidates) > 1:
                cheapest = min(candidates, key=lambda m: m.input_price_per_1k)
                if selected.name == cheapest.name:
                    most_expensive = max(candidates, key=lambda m: m.input_price_per_1k)
                    savings_pct = ((most_expensive.input_price_per_1k - selected.input_price_per_1k) / 
                                  most_expensive.input_price_per_1k * 100) if most_expensive.input_price_per_1k > 0 else 0
                    reasons.append(f"Cost optimized ({savings_pct:.0f}% cheaper than {most_expensive.name})")
                else:
                    reasons.append(f"Balanced cost/quality ({selected.quality_tier} tier)")
            else:
                reasons.append("Only model matching constraints")
        
        # SECONDARY INFO: Model characteristics
        avg_cost = (selected.input_price_per_1k + selected.output_price_per_1k) / 2
        reasons.append(f"€{avg_cost:.4f}/1K tokens")
        reasons.append(f"~{selected.avg_latency_ms}ms latency")
        
        # OPTIONAL: Constraint satisfaction
        if constraints and constraints.max_latency_ms:
            reasons.append(f"(within {constraints.max_latency_ms}ms limit)")
        
        return " | ".join(reasons)
    
    def get_cheapest_alternative_cost(
        self,
        input_tokens: int,
        output_tokens: int,
        exclude_model: str,
        available_providers: list[str] | None = None,
        baseline_model_name: str | None = None,
    ) -> float:
        """
        Calculate what this prompt would have cost with a premium baseline model.
        
        STRATEGY: Compare against the most expensive model the user has access to.
        This gives honest savings calculations - we compare to what they COULD have used.
        
        Args:
            input_tokens: Number of input tokens
            output_tokens: Number of output tokens
            exclude_model: The model actually used (for comparison)
            available_providers: List of providers user has access to (for realistic comparison)
            baseline_model_name: Optional specific model to compare against
            
        Returns:
            Cost in euros, or 0.0 if no valid baseline found
        """
        # Filter to models user actually has access to
        available_models = self.all_models
        if available_providers:
            available_models = [m for m in self.all_models if m.provider in available_providers]
        
        if not available_models:
            return 0.0
        
        # Find baseline model
        baseline_model = None
        
        if baseline_model_name:
            # User specified a baseline
            baseline_model = next(
                (m for m in available_models if m.name == baseline_model_name), 
                None
            )
        
        if not baseline_model:
            # Find the most expensive premium model available to the user
            # This gives the most honest comparison
            premium_models = [m for m in available_models if m.quality_tier == "premium"]
            if premium_models:
                baseline_model = max(
                    premium_models, 
                    key=lambda m: m.input_price_per_1k + m.output_price_per_1k
                )
            else:
                # No premium models? Use most expensive model available
                baseline_model = max(
                    available_models, 
                    key=lambda m: m.input_price_per_1k + m.output_price_per_1k
                )
        
        # Edge case: baseline is the same as selected model (no savings)
        if baseline_model.name == exclude_model:
            # Try to find second most expensive
            other_models = [m for m in available_models if m.name != exclude_model]
            if other_models:
                baseline_model = max(
                    other_models, 
                    key=lambda m: m.input_price_per_1k + m.output_price_per_1k
                )
            else:
                return 0.0
        
        # Calculate baseline cost
        input_cost = (input_tokens / 1000) * baseline_model.input_price_per_1k
        output_cost = (output_tokens / 1000) * baseline_model.output_price_per_1k
        
        return round(input_cost + output_cost, 6)
