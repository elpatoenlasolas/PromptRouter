"""
Prompt execution API endpoint
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.auth import get_user_from_clerk
from app.models.database import User
from app.models.schemas import PromptRequest, PromptResponse
# Import heavy execution service lazily inside the endpoint to avoid importing
# external provider SDKs at application import time (helps tests run with
# minimal dependencies).

router = APIRouter()


@router.post("/prompt", response_model=PromptResponse)
async def execute_prompt(
    request: PromptRequest,
    current_user: User = Depends(get_user_from_clerk),
    db: AsyncSession = Depends(get_db),
):
    """
    Execute a prompt through the routing engine
    
    This endpoint:
    1. Selects the optimal model based on cost, latency, and quality constraints
    2. Routes the prompt to the selected provider
    3. Returns the response with routing details and savings information
    
    Requires authentication via Clerk token in Authorization header.
    """
    try:
        print(f"DEBUG: Received prompt request from user {current_user.id}")
        print(f"DEBUG: Prompt length: {len(request.prompt)}")
        
        # Enforce usage limits before execution
        from app.services.usage_limits import UsageLimitService
        usage_service = UsageLimitService(db)
        
        # Estimate tokens (rough: 4 chars per token)
        estimated_tokens = (len(request.prompt) + (request.max_tokens or 1000)) // 4
        await usage_service.enforce_usage_limit(current_user.id, estimated_tokens)
        
        from app.services.execution import PromptExecutionService
        service = PromptExecutionService(db)
        response = await service.execute_prompt(current_user.id, request)
        print(f"DEBUG: Prompt executed successfully")
        return response
    except ValueError as e:
        print(f"DEBUG: ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        error_msg = f"Execution failed: {str(e)}"
        print(f"ERROR: {error_msg}\n{error_trace}")  # Log for debugging
        raise HTTPException(
            status_code=500, 
            detail=error_msg
        )
