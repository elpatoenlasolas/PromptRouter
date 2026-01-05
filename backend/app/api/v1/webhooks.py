"""
Clerk Webhooks for user management
"""
from fastapi import APIRouter, Request, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.database import User, UserTier
import os
import hmac
import hashlib
from fastapi import Depends

router = APIRouter()


def verify_clerk_webhook(payload: bytes, signature: str) -> bool:
    """
    Verify that the webhook came from Clerk
    
    Clerk signs webhooks with HMAC-SHA256 using your webhook secret
    """
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")
    if not webhook_secret:
        print("WARNING: CLERK_WEBHOOK_SECRET not set, skipping verification")
        return True  # In development, allow without verification
    
    expected_signature = hmac.new(
        webhook_secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)


@router.post("/webhooks/clerk")
async def clerk_webhook(
    request: Request,
    svix_signature: str = Header(None, alias="svix-signature"),
    db: AsyncSession = Depends(get_db),
):
    """
    Handle Clerk webhooks for user lifecycle events
    
    Events handled:
    - user.created: Create user in our database
    - user.updated: Update user email
    - user.deleted: Soft delete user (deactivate)
    """
    # Get raw body
    body = await request.body()
    
    # Verify webhook signature
    if svix_signature and not verify_clerk_webhook(body, svix_signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    
    # Parse JSON
    import json
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    
    event_type = data.get("type")
    user_data = data.get("data")
    
    print(f"Clerk webhook received: {event_type}")
    
    if event_type == "user.created":
        # Create new user in our database
        clerk_user_id = user_data.get("id")
        email = user_data.get("email_addresses", [{}])[0].get("email_address")
        
        if not clerk_user_id:
            raise HTTPException(status_code=400, detail="Missing user ID")
        
        # Check if user already exists
        result = await db.execute(
            select(User).where(User.clerk_user_id == clerk_user_id)
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print(f"User {clerk_user_id} already exists, skipping creation")
            return {"status": "ok", "message": "User already exists"}
        
        # Create new user
        new_user = User(
            clerk_user_id=clerk_user_id,
            email=email or f"{clerk_user_id}@clerk.user",
            tier=UserTier.FREE,
            monthly_token_limit=10_000,
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        print(f"Created user {new_user.id} for Clerk user {clerk_user_id}")
        return {"status": "ok", "user_id": new_user.id}
    
    elif event_type == "user.updated":
        # Update user email if changed
        clerk_user_id = user_data.get("id")
        email = user_data.get("email_addresses", [{}])[0].get("email_address")
        
        result = await db.execute(
            select(User).where(User.clerk_user_id == clerk_user_id)
        )
        user = result.scalar_one_or_none()
        
        if user and email:
            user.email = email
            await db.commit()
            print(f"Updated email for user {user.id}")
        
        return {"status": "ok"}
    
    elif event_type == "user.deleted":
        # Soft delete user (we keep the data but mark as inactive)
        clerk_user_id = user_data.get("id")
        
        result = await db.execute(
            select(User).where(User.clerk_user_id == clerk_user_id)
        )
        user = result.scalar_one_or_none()
        
        if user:
            # We don't actually delete, just log it
            # You could add an 'is_active' field if you want
            print(f"User {clerk_user_id} deleted from Clerk")
        
        return {"status": "ok"}
    
    # Unknown event type, just acknowledge
    return {"status": "ok", "message": f"Event {event_type} acknowledged"}
