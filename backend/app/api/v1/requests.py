"""
Requests/Executions API endpoint
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.database import PromptExecution
from typing import Optional

router = APIRouter()


@router.get("/requests")
async def get_requests(
    user_id: int = 1,  # TODO: Extract from auth token
    limit: int = Query(50, ge=1, le=100, description="Number of requests to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    provider: Optional[str] = Query(None, description="Filter by provider"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get list of prompt executions for a user
    
    Returns recent executions with routing details, costs, and savings
    """
    # Build query
    query = (
        select(PromptExecution)
        .where(PromptExecution.user_id == user_id)
        .order_by(desc(PromptExecution.created_at))
        .limit(limit)
        .offset(offset)
    )
    
    # Filter by provider if specified
    if provider:
        from app.models.database import ProviderType
        try:
            provider_enum = ProviderType(provider.lower())
            query = query.where(PromptExecution.selected_provider == provider_enum)
        except ValueError:
            pass  # Invalid provider, ignore filter
    
    result = await db.execute(query)
    executions = result.scalars().all()
    
    # Format response
    requests = []
    for exec in executions:
        requests.append({
            "id": exec.id,
            "model": exec.selected_model,
            "provider": exec.selected_provider.value,
            "latency_ms": exec.latency_ms,
            "cost": round(exec.actual_cost, 6),
            "saved": round(exec.savings, 6),
            "timestamp": exec.created_at.isoformat(),
            "success": exec.success,
            "input_tokens": exec.input_tokens,
            "output_tokens": exec.output_tokens,
            "routing_reason": exec.routing_reason,
        })
    
    return {
        "requests": requests,
        "total": len(requests),
        "limit": limit,
        "offset": offset,
    }

