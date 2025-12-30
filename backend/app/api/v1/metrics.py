"""
Metrics API endpoints
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.database import PromptExecution
from app.models.schemas import UsageMetrics, SavingsBreakdown

router = APIRouter()


@router.get("/metrics", response_model=UsageMetrics)
async def get_usage_metrics(
    user_id: int = 1,  # TODO: Extract from auth token
    days: int = Query(30, ge=1, le=365, description="Number of days to look back"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get usage and savings metrics for a user
    
    Returns aggregated metrics including:
    - Total requests and tokens
    - Total spend and estimated spend without routing
    - Total savings
    - Average latency and error rate
    """
    period_start = datetime.utcnow() - timedelta(days=days)
    period_end = datetime.utcnow()
    
    # Query executions in period
    result = await db.execute(
        select(
            func.count(PromptExecution.id).label("total_requests"),
            func.sum(PromptExecution.total_tokens).label("total_tokens"),
            func.sum(PromptExecution.actual_cost).label("total_spend"),
            func.sum(PromptExecution.cheapest_alternative_cost).label("estimated_spend"),
            func.sum(PromptExecution.savings).label("total_saved"),
            func.avg(PromptExecution.latency_ms).label("avg_latency"),
            func.sum(func.cast(~PromptExecution.success, int)).label("error_count"),
        )
        .where(PromptExecution.user_id == user_id)
        .where(PromptExecution.created_at >= period_start)
    )
    
    metrics = result.first()
    
    total_requests = metrics.total_requests or 0
    error_count = metrics.error_count or 0
    
    return UsageMetrics(
        total_requests=total_requests,
        total_tokens=metrics.total_tokens or 0,
        total_spend=round(metrics.total_spend or 0, 2),
        estimated_spend_without_routing=round(metrics.estimated_spend or 0, 2),
        total_saved=round(metrics.total_saved or 0, 2),
        average_latency_ms=round(metrics.avg_latency or 0, 0),
        error_rate=round((error_count / total_requests * 100) if total_requests > 0 else 0, 2),
        period_start=period_start,
        period_end=period_end,
    )


@router.get("/savings", response_model=SavingsBreakdown)
async def get_savings_breakdown(
    user_id: int = 1,  # TODO: Extract from auth token
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    """
    Get detailed savings breakdown by provider and model
    """
    period_start = datetime.utcnow() - timedelta(days=days)
    
    # Query executions
    result = await db.execute(
        select(PromptExecution)
        .where(PromptExecution.user_id == user_id)
        .where(PromptExecution.created_at >= period_start)
    )
    executions = result.scalars().all()
    
    # Aggregate by provider
    by_provider = {}
    by_model = {}
    total_saved = 0.0
    
    for exec in executions:
        provider = exec.selected_provider.value
        model = exec.selected_model
        
        by_provider[provider] = by_provider.get(provider, 0.0) + exec.savings
        by_model[model] = by_model.get(model, 0.0) + exec.savings
        total_saved += exec.savings
    
    return SavingsBreakdown(
        by_provider={k: round(v, 2) for k, v in by_provider.items()},
        by_model={k: round(v, 2) for k, v in by_model.items()},
        total_saved=round(total_saved, 2),
    )
