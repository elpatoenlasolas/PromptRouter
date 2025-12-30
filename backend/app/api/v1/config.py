"""
User configuration API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.database import User, UserAPIKey, PromptExecution, ProviderType
from app.models.schemas import APIKeyCreate, APIKeyResponse, UserConfigResponse
from app.core.security import encrypt_api_key

router = APIRouter()


@router.post("/api-keys", response_model=APIKeyResponse)
async def add_api_key(
    key_data: APIKeyCreate,
    user_id: int = 1,  # TODO: Extract from auth token
    db: AsyncSession = Depends(get_db),
):
    """
    Add a new LLM provider API key
    
    The key will be encrypted before storage.
    """
    # Validate provider
    try:
        provider = ProviderType(key_data.provider.lower())
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid provider. Must be one of: openai, anthropic, google, grok"
        )
    
    # Check if key already exists for this provider
    result = await db.execute(
        select(UserAPIKey)
        .where(UserAPIKey.user_id == user_id)
        .where(UserAPIKey.provider == provider)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        # Update existing key
        existing.encrypted_key = encrypt_api_key(key_data.api_key)
        existing.is_active = True
        api_key_record = existing
    else:
        # Create new key
        api_key_record = UserAPIKey(
            user_id=user_id,
            provider=provider,
            encrypted_key=encrypt_api_key(key_data.api_key),
            is_active=True,
        )
        db.add(api_key_record)
    
    await db.commit()
    await db.refresh(api_key_record)
    
    return APIKeyResponse(
        id=api_key_record.id,
        provider=api_key_record.provider.value,
        is_active=api_key_record.is_active,
        created_at=api_key_record.created_at,
    )


@router.delete("/api-keys/{key_id}")
async def delete_api_key(
    key_id: int,
    user_id: int = 1,  # TODO: Extract from auth token
    db: AsyncSession = Depends(get_db),
):
    """Deactivate an API key"""
    result = await db.execute(
        select(UserAPIKey)
        .where(UserAPIKey.id == key_id)
        .where(UserAPIKey.user_id == user_id)
    )
    api_key = result.scalar_one_or_none()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    api_key.is_active = False
    await db.commit()
    
    return {"message": "API key deactivated"}


@router.get("/config", response_model=UserConfigResponse)
async def get_user_config(
    user_id: int = 1,  # TODO: Extract from auth token
    db: AsyncSession = Depends(get_db),
):
    """
    Get user configuration including tier, limits, and API keys
    """
    # Get user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get API keys
    result = await db.execute(
        select(UserAPIKey)
        .where(UserAPIKey.user_id == user_id)
    )
    api_keys = result.scalars().all()
    
    # Calculate tokens used this month
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(func.sum(PromptExecution.total_tokens))
        .where(PromptExecution.user_id == user_id)
        .where(PromptExecution.created_at >= month_start)
    )
    tokens_used = result.scalar() or 0
    
    return UserConfigResponse(
        user_id=user.id,
        email=user.email,
        tier=user.tier.value,
        monthly_token_limit=user.monthly_token_limit,
        tokens_used_this_month=tokens_used,
        api_keys=[
            APIKeyResponse(
                id=key.id,
                provider=key.provider.value,
                is_active=key.is_active,
                created_at=key.created_at,
            )
            for key in api_keys
        ],
    )
