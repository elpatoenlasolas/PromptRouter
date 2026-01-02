"""
Billing and subscription management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.database import User, UserTier
import os

router = APIRouter()


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
    
    # TODO: Implement Stripe integration
    # For now, return a placeholder
    # 
    # import stripe
    # stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    # 
    # # Price IDs from Stripe Dashboard
    # price_ids = {
    #     'starter': os.getenv("STRIPE_STARTER_PRICE_ID"),
    #     'pro': os.getenv("STRIPE_PRO_PRICE_ID"),
    # }
    # 
    # checkout_session = stripe.checkout.Session.create(
    #     customer_email=current_user.email,
    #     client_reference_id=str(current_user.id),
    #     mode='subscription',
    #     payment_method_types=['card'],
    #     line_items=[{
    #         'price': price_ids[request.tier],
    #         'quantity': 1,
    #     }],
    #     success_url=f"{os.getenv('FRONTEND_URL')}/dashboard/settings?upgrade=success",
    #     cancel_url=f"{os.getenv('FRONTEND_URL')}/pricing?upgrade=cancelled",
    #     metadata={
    #         'user_id': str(current_user.id),
    #         'tier': request.tier,
    #     }
    # )
    # 
    # return CheckoutResponse(checkout_url=checkout_session.url)
    
    raise HTTPException(
        status_code=501,
        detail="Stripe integration not yet implemented. Coming soon!"
    )


@router.post("/webhook")
async def stripe_webhook(db: AsyncSession = Depends(get_db)):
    """
    Stripe webhook endpoint to handle subscription events
    
    This endpoint receives webhooks from Stripe when:
    - A subscription is created
    - A subscription is updated
    - A subscription is cancelled
    - Payment succeeds/fails
    """
    # TODO: Implement Stripe webhook handling
    # 
    # import stripe
    # stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    # webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    # 
    # payload = await request.body()
    # sig_header = request.headers.get('stripe-signature')
    # 
    # try:
    #     event = stripe.Webhook.construct_event(
    #         payload, sig_header, webhook_secret
    #     )
    # except Exception as e:
    #     raise HTTPException(status_code=400, detail=str(e))
    # 
    # # Handle the event
    # if event['type'] == 'checkout.session.completed':
    #     session = event['data']['object']
    #     user_id = int(session['metadata']['user_id'])
    #     tier = session['metadata']['tier']
    #     
    #     # Update user tier
    #     result = await db.execute(
    #         select(User).where(User.id == user_id)
    #     )
    #     user = result.scalar_one_or_none()
    #     if user:
    #         user.tier = UserTier(tier)
    #         if tier == 'starter':
    #             user.monthly_token_limit = 500_000
    #         elif tier == 'pro':
    #             user.monthly_token_limit = 5_000_000
    #         await db.commit()
    # 
    # return {"status": "success"}
    
    raise HTTPException(
        status_code=501,
        detail="Webhook handling not yet implemented"
    )
