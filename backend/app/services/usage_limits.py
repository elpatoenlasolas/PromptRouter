"""
Usage tracking and billing limit enforcement
"""
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.database import User, PromptExecution, UserTier
from fastapi import HTTPException


class UsageLimitService:
    """Service for tracking usage and enforcing tier limits"""
    
    # Token limits by tier (default limits)
    TIER_LIMITS = {
        UserTier.FREE: 10_000,
        UserTier.STARTER: 500_000,
        UserTier.PRO: 5_000_000,
        UserTier.ELITE: 100_000_000,  # 100M tokens default for Elite
    }
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def check_usage_limit(self, user_id: int, estimated_tokens: int = 0) -> tuple[bool, int, int]:
        """
        Check if user is within their usage limit
        
        Args:
            user_id: User ID
            estimated_tokens: Estimated tokens for upcoming request
            
        Returns:
            Tuple of (is_within_limit, tokens_used, tokens_remaining)
        """
        # Get user
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Calculate tokens used this month
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        result = await self.db.execute(
            select(func.sum(PromptExecution.total_tokens))
            .where(PromptExecution.user_id == user_id)
            .where(PromptExecution.created_at >= month_start)
        )
        tokens_used = result.scalar() or 0
        
        # Get limit: use custom monthly_token_limit if set, otherwise use tier default
        # This allows Elite tier (and others) to have custom limits
        if user.monthly_token_limit is not None:
            limit = user.monthly_token_limit
        else:
            limit = self.TIER_LIMITS.get(user.tier, self.TIER_LIMITS[UserTier.FREE])
        
        # Check if within limit
        tokens_remaining = limit - tokens_used
        is_within_limit = (tokens_used + estimated_tokens) <= limit
        
        return is_within_limit, int(tokens_used), int(tokens_remaining)
    
    async def enforce_usage_limit(self, user_id: int, estimated_tokens: int = 0):
        """
        Enforce usage limit before executing a request
        
        Raises HTTPException if limit exceeded
        """
        is_within_limit, tokens_used, tokens_remaining = await self.check_usage_limit(
            user_id, estimated_tokens
        )
        
        if not is_within_limit:
            raise HTTPException(
                status_code=429,
                detail=f"Monthly token limit exceeded. You've used {tokens_used:,} of your {tokens_used + tokens_remaining:,} tokens. Upgrade your plan to continue using PromptRouter."
            )
    
    async def get_usage_stats(self, user_id: int) -> dict:
        """Get current usage statistics for a user"""
        is_within_limit, tokens_used, tokens_remaining = await self.check_usage_limit(user_id)
        
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one()
        
        # Use custom limit if set, otherwise tier default
        if user.monthly_token_limit is not None:
            limit = user.monthly_token_limit
        else:
            limit = self.TIER_LIMITS.get(user.tier, self.TIER_LIMITS[UserTier.FREE])
        
        return {
            "tier": user.tier.value,
            "tokens_used": tokens_used,
            "tokens_remaining": tokens_remaining,
            "token_limit": limit,
            "usage_percentage": round((tokens_used / limit * 100) if limit > 0 else 0, 1),
            "is_within_limit": is_within_limit,
        }
