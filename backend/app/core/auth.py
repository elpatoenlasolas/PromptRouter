"""
Authentication dependency for API endpoints
"""
from fastapi import Depends, HTTPException, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import os
import jwt
from jwt import PyJWKClient
from app.core.database import get_db
from app.api.v1.tokens import verify_api_token
from app.models.database import User, UserTier


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


async def get_user_from_clerk(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Extract user from Clerk session token (for frontend dashboard)
    
    Clerk sends the session token in the Authorization header as:
    Authorization: Bearer <clerk_session_token>
    
    In development mode without auth, returns default dev user.
    """
    # Development mode: skip Clerk auth
    if os.getenv("ENVIRONMENT", "development") == "development":
        # Check if there's an Authorization header
        auth_header = request.headers.get("authorization")
        
        # If no auth header, return dev user
        if not auth_header:
            result = await db.execute(select(User).where(User.id == 1))
            user = result.scalar_one_or_none()
            
            if not user:
                # Create default dev user
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
    
    # Production: verify Clerk token
    auth_header = request.headers.get("authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        # Extract token
        token = auth_header.replace("Bearer ", "")
        
        # Get Clerk's JWKS URL
        clerk_domain = os.getenv("CLERK_DOMAIN", "https://api.clerk.dev")
        jwks_url = f"{clerk_domain}/.well-known/jwks.json"
        
        # Verify token with Clerk's public keys
        jwks_client = PyJWKClient(jwks_url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Decode and verify
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_exp": True}
        )
        
        clerk_user_id = payload.get("sub")
        if not clerk_user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no user ID")
        
        # Find or create user in our database
        result = await db.execute(
            select(User).where(User.clerk_user_id == clerk_user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            # Create new user from Clerk data
            user = User(
                clerk_user_id=clerk_user_id,
                email=payload.get("email", f"{clerk_user_id}@clerk.user"),
                tier=UserTier.FREE,
                monthly_token_limit=10_000,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        # In development, be more lenient
        if os.getenv("ENVIRONMENT") == "development":
            result = await db.execute(select(User).where(User.id == 1))
            user = result.scalar_one_or_none()
            if user:
                return user
        
        raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")
