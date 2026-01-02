"""
User API Keys management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.security import encrypt_api_key, decrypt_api_key
from app.models.database import User, UserAPIKey

router = APIRouter()


class APIKeyCreate(BaseModel):
    provider: str  # openai, anthropic, google, grok
    api_key: str


class APIKeyResponse(BaseModel):
    id: int
    provider: str
    created_at: str
    
    class Config:
        from_attributes = True


@router.post("/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    key_data: APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Add or update an LLM provider API key
    """
    # Validate provider
    valid_providers = ["openai", "anthropic", "google", "grok"]
    if key_data.provider.lower() not in valid_providers:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid provider. Must be one of: {', '.join(valid_providers)}"
        )
    
    # Check if user already has a key for this provider
    stmt = select(UserAPIKey).where(
        UserAPIKey.user_id == current_user.id,
        UserAPIKey.provider == key_data.provider.lower()
    )
    result = await db.execute(stmt)
    existing_key = result.scalar_one_or_none()
    
    if existing_key:
        # Update existing key
        existing_key.encrypted_key = encrypt_api_key(key_data.api_key)
        await db.commit()
        await db.refresh(existing_key)
        return APIKeyResponse(
            id=existing_key.id,
            provider=existing_key.provider,
            created_at=existing_key.created_at.isoformat()
        )
    else:
        # Create new key
        new_key = UserAPIKey(
            user_id=current_user.id,
            provider=key_data.provider.lower(),
            encrypted_key=encrypt_api_key(key_data.api_key)
        )
        db.add(new_key)
        await db.commit()
        await db.refresh(new_key)
        return APIKeyResponse(
            id=new_key.id,
            provider=new_key.provider,
            created_at=new_key.created_at.isoformat()
        )


@router.get("/api-keys", response_model=List[APIKeyResponse])
async def list_api_keys(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List all LLM provider API keys for the current user
    """
    stmt = select(UserAPIKey).where(UserAPIKey.user_id == current_user.id)
    result = await db.execute(stmt)
    keys = result.scalars().all()
    
    return [
        APIKeyResponse(
            id=key.id,
            provider=key.provider,
            created_at=key.created_at.isoformat()
        )
        for key in keys
    ]


@router.delete("/api-keys/{key_id}")
async def delete_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete an LLM provider API key
    """
    stmt = select(UserAPIKey).where(
        UserAPIKey.id == key_id,
        UserAPIKey.user_id == current_user.id
    )
    result = await db.execute(stmt)
    key = result.scalar_one_or_none()
    
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    await db.delete(key)
    await db.commit()
    
    return {"message": "API key deleted successfully"}
