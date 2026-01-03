"""
Usage statistics endpoint
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.auth import get_user_from_clerk
from app.models.database import User
from app.services.usage_limits import UsageLimitService

router = APIRouter()


@router.get("/usage")
async def get_usage(
    current_user: User = Depends(get_user_from_clerk),
    db: AsyncSession = Depends(get_db),
):
    """
    Get current usage statistics including:
    - Tier
    - Tokens used this month
    - Tokens remaining
    - Token limit
    - Usage percentage
    """
    service = UsageLimitService(db)
    stats = await service.get_usage_stats(current_user.id)
    return stats
