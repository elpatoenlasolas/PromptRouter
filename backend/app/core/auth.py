"""
Authentication dependency for API endpoints
"""
from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import os
from app.core.database import get_db
from app.api.v1.tokens import verify_api_token
from app.models.database import User


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Get the current authenticated user from the API token
    
    Expects: Authorization: Bearer pr_live_xxxxx
    
    In development mode, if no token is provided, returns a default dev user.
    """
    # Development mode: allow requests without auth (for frontend dashboard)
    if os.getenv("ENVIRONMENT", "development") == "development" and not authorization:
        # Return default dev user (user_id=1)
        result = await db.execute(
            select(User).where(User.id == 1)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            # Create default dev user
            from app.models.database import UserTier
            user = User(
                id=1,
                clerk_user_id="dev_user_1",
                email="dev@promptrouter.local",
                tier=UserTier.FREE,
                monthly_token_limit=10_000,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        return user
    
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing. Please include 'Authorization: Bearer YOUR_TOKEN' in your request headers."
        )
    
    # Parse the token from "Bearer xxx"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected: 'Bearer YOUR_TOKEN'"
        )
    
    token = parts[1]
    
    # Verify token and get user
    user = await verify_api_token(token, db)
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid or revoked API token. Please check your token in Settings."
        )
    
    return user


async def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Optional authentication - returns None if no token provided
    Used for endpoints that work both authenticated and unauthenticated
    """
    if not authorization:
        return None
    
    try:
        return await get_current_user(authorization, db)
    except HTTPException:
        return None
