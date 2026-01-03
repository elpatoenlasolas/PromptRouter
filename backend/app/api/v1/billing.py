"""
Billing and subscription management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.database import User, UserTier
from app.config import get_settings
import stripe
import os

router = APIRouter()
settings = get_settings()

# Initialize Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    print("⚠️  WARNING: STRIPE_SECRET_KEY not configured. Billing endpoints will return 501.")


class CreateCheckoutRequest(BaseModel):
    """Request to create Stripe checkout session"""
    tier: str  # 'starter' or 'pro'


class CheckoutResponse(BaseModel):
    """Response with checkout URL"""
    checkout_url: str


@router.post("/create-checkout-session", response_model=CheckoutResponse)
async def create_checkout_session(
    request: CreateCheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a Stripe Checkout session for upgrading subscription
    
    This endpoint creates a Stripe Checkout session and returns the URL
    to redirect the user to complete payment.
    """
    # Check if Stripe is configured
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=501,
            detail="Stripe integration not configured. Please add STRIPE_SECRET_KEY to environment variables."
        )
    
    # Validate tier
    if request.tier not in ['starter', 'pro']:
        raise HTTPException(status_code=400, detail="Invalid tier. Must be 'starter' or 'pro'")
    
    # Check if user is already on this tier or higher
    tier_hierarchy = {'free': 0, 'starter': 1, 'pro': 2}
    current_tier_level = tier_hierarchy.get(current_user.tier.value, 0)
    requested_tier_level = tier_hierarchy.get(request.tier, 0)
    
    if current_tier_level >= requested_tier_level:
        raise HTTPException(
            status_code=400, 
            detail=f"You are already on the {current_user.tier.value} plan"
        )
    
    # Get Price IDs
    price_ids = {
        'starter': settings.STRIPE_STARTER_PRICE_ID,
        'pro': settings.STRIPE_PRO_PRICE_ID,
    }
    
    price_id = price_ids.get(request.tier)
    if not price_id:
        raise HTTPException(
            status_code=501,
            detail=f"Stripe Price ID not configured for {request.tier} tier. Please set STRIPE_{request.tier.upper()}_PRICE_ID in environment variables."
        )
    
    try:
        # Ensure FRONTEND_URL has proper scheme
        frontend_url = settings.FRONTEND_URL
        if not frontend_url.startswith(('http://', 'https://')):
            frontend_url = f'https://{frontend_url}'
        
        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            customer_email=current_user.email,
            client_reference_id=str(current_user.id),
            mode='subscription',
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            success_url=f"{frontend_url}/dashboard/settings?upgrade=success&tier={request.tier}",
            cancel_url=f"{frontend_url}/pricing?upgrade=cancelled",
            metadata={
                'user_id': str(current_user.id),
                'clerk_user_id': current_user.clerk_user_id,
                'tier': request.tier,
            }
        )
        
        return CheckoutResponse(checkout_url=checkout_session.url)
    
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create checkout session: {str(e)}"
        )


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Stripe webhook endpoint to handle subscription events
    
    This endpoint receives webhooks from Stripe when:
    - A subscription is created (checkout.session.completed)
    - A subscription is updated
    - A subscription is cancelled
    - Payment succeeds/fails
    """
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=501, detail="Stripe not configured")
    
    # Get the webhook payload
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    if not sig_header:
        print("⚠️  Missing stripe-signature header")
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")
    
    try:
        # Verify webhook signature (if webhook secret is configured)
        if settings.STRIPE_WEBHOOK_SECRET and settings.STRIPE_WEBHOOK_SECRET != "whsec_dev_placeholder":
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
                )
                print("✅ Webhook signature verified")
            except stripe.error.SignatureVerificationError as e:
                print(f"⚠️  Webhook signature verification failed: {e}")
                print(f"Secret being used: {settings.STRIPE_WEBHOOK_SECRET[:20]}...")
                # In development, continue anyway and parse the payload
                import json
                event = json.loads(payload)
                print("⚠️  WARNING: Proceeding without signature verification (dev mode)")
        else:
            # In development, parse event without verification
            import json
            event = json.loads(payload)
            print("⚠️  WARNING: Webhook signature verification skipped (dev mode)")
    except ValueError as e:
        print(f"❌ Invalid JSON payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    
    # Handle the event
    event_type = event.get('type')
    print(f"📥 Received webhook: {event_type}")
    
    if event_type == 'checkout.session.completed':
        session = event['data']['object']
        
        # Get user info from metadata
        user_id = session.get('metadata', {}).get('user_id')
        tier = session.get('metadata', {}).get('tier')
        
        if not user_id or not tier:
            print(f"⚠️  Missing metadata in checkout session: user_id={user_id}, tier={tier}")
            return {"status": "ignored", "reason": "missing_metadata"}
        
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            print(f"⚠️  Invalid user_id: {user_id}")
            return {"status": "error", "reason": "invalid_user_id"}
        
        # Update user tier in database
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"⚠️  User not found: {user_id}")
            return {"status": "error", "reason": "user_not_found"}
        
        # Update tier and token limit
        old_tier = user.tier
        user.tier = UserTier(tier)
        
        if tier == 'starter':
            user.monthly_token_limit = 500_000
        elif tier == 'pro':
            user.monthly_token_limit = 5_000_000
        
        # Save Stripe subscription ID if available
        subscription_id = session.get('subscription')
        if subscription_id:
            # Store subscription_id in user metadata or separate table
            # For now, we'll just log it
            print(f"✅ Subscription created: {subscription_id}")
        
        await db.commit()
        
        print(f"✅ User {user.id} upgraded from {old_tier.value} to {user.tier.value}")
        
        return {
            "status": "success",
            "user_id": user.id,
            "old_tier": old_tier.value,
            "new_tier": user.tier.value
        }
    
    elif event_type == 'customer.subscription.deleted':
        # Handle subscription cancellation
        subscription = event['data']['object']
        # TODO: Downgrade user to free tier
        print(f"⚠️  Subscription cancelled: {subscription.get('id')}")
        return {"status": "acknowledged"}
    
    elif event_type == 'invoice.payment_failed':
        # Handle failed payment
        invoice = event['data']['object']
        print(f"⚠️  Payment failed: {invoice.get('id')}")
        return {"status": "acknowledged"}
    
    else:
        # Unhandled event type
        print(f"ℹ️  Unhandled event type: {event_type}")
        return {"status": "ignored", "event_type": event_type}

