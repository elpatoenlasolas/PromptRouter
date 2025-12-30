"""
Prompt execution API endpoint
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.schemas import PromptRequest, PromptResponse
from app.services.execution import PromptExecutionService

router = APIRouter()


@router.post("/prompt", response_model=PromptResponse)
async def execute_prompt(
    request: PromptRequest,
    user_id: int = 1,  # TODO: Extract from auth token
    db: AsyncSession = Depends(get_db),
):
    """
    Execute a prompt through the routing engine
    
    This endpoint:
    1. Selects the optimal model based on cost, latency, and quality constraints
    2. Routes the prompt to the selected provider
    3. Returns the response with routing details and savings information
    """
    try:
        service = PromptExecutionService(db)
        response = await service.execute_prompt(user_id, request)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")
