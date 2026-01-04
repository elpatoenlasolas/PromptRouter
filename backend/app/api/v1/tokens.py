"""
API Token management endpoints
"""
import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
from app.core.database import get_db
from app.core.auth import get_user_from_clerk, verify_api_token
from app.models.database import User, APIToken

router = APIRouter()


class TokenCreate(BaseModel):
    """Request to create a new API token"""
    name: str


class TokenResponse(BaseModel):
    """Response with API token info"""
    id: int
    name: str
    token: str  # Only shown on creation
    is_active: bool
    created_at: datetime
    last_used_at: datetime | None


class TokenListResponse(BaseModel):
    """Response for listing tokens (without actual token value)"""
    id: int
    name: str
    token_preview: str  # Only shows pr_live_xxxxx...xxxx (masked)
    is_active: bool
    created_at: datetime
    last_used_at: datetime | None


def generate_api_token(prefix: str = "pr_live") -> str:
    """Generate a secure API token"""
    # Generate 32 random bytes (64 hex characters)
    random_part = secrets.token_hex(32)
    return f"{prefix}_{random_part}"


@router.post("/tokens", response_model=TokenResponse)
async def create_api_token(
    token_data: TokenCreate,
    current_user: User = Depends(get_user_from_clerk),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new API token for the user
    
    The token will be shown only once - make sure to save it!
    """
    # User already verified by get_user_from_clerk
    user = current_user
    
    # Generate token
    token = generate_api_token()
    
    # Create token record
    api_token = APIToken(
        user_id=user.id,
        token=token,
        name=token_data.name,
        is_active=True,
    )
    
    db.add(api_token)
    await db.commit()
    await db.refresh(api_token)
    
    return TokenResponse(
        id=api_token.id,
        name=api_token.name,
        token=token,  # Only shown on creation
        is_active=api_token.is_active,
        created_at=api_token.created_at,
        last_used_at=api_token.last_used_at,
    )


@router.get("/tokens")
async def list_api_tokens(
    current_user: User = Depends(get_user_from_clerk),
    db: AsyncSession = Depends(get_db),
):
    """List all API tokens for the user (tokens are masked)"""
    result = await db.execute(
        select(APIToken)
        .where(APIToken.user_id == current_user.id)
        .order_by(APIToken.created_at.desc())
    )
    tokens = result.scalars().all()
    
    return {
        "tokens": [
            TokenListResponse(
                id=token.id,
                name=token.name,
                token_preview=f"{token.token[:12]}...{token.token[-4:]}",  # pr_live_xxxxx...xxxx
                is_active=token.is_active,
                created_at=token.created_at,
                last_used_at=token.last_used_at,
            )
            for token in tokens
        ]
    }


@router.delete("/tokens/{token_id}")
async def revoke_api_token(
    token_id: int,
    current_user: User = Depends(get_user_from_clerk),
    db: AsyncSession = Depends(get_db),
):
    """Revoke (deactivate) an API token"""
    result = await db.execute(
        select(APIToken)
        .where(APIToken.id == token_id)
        .where(APIToken.user_id == current_user.id)
    )
    token = result.scalar_one_or_none()
    
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    
    token.is_active = False
    await db.commit()
    
    return {"message": "Token revoked successfully"}
