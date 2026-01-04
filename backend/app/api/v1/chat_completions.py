"""
OpenAI-compatible chat completions endpoint
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.database import User
from app.models.schemas import ChatCompletionRequest, ChatCompletionResponse

router = APIRouter()


@router.post("/chat/completions", response_model=ChatCompletionResponse)
async def create_chat_completion(
    request: ChatCompletionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a chat completion (OpenAI-compatible endpoint)
    
    This endpoint provides drop-in replacement compatibility with OpenAI's
    /v1/chat/completions API while adding PromptRouter's intelligent routing.
    
    Key features:
    - If 'model' is specified, that model will be used (OpenAI compatibility)
    - If 'model' is null/omitted, PromptRouter selects the optimal model
    - Returns OpenAI-compatible response format
    - Includes PromptRouter metadata in 'x-promptrouter' field
    
    Authentication: Requires API token in Authorization header
    
    Example usage (Python with OpenAI SDK):
    ```python
    from openai import OpenAI
    
    client = OpenAI(
        base_url="https://api.promptrouter.com/v1",
        api_key="your-promptrouter-token"
    )
    
    # Let PromptRouter choose the best model
    response = client.chat.completions.create(
        model=None,  # or omit this field
        messages=[
            {"role": "user", "content": "Hello!"}
        ]
    )
    
    # Or specify a model directly
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Hello!"}
        ]
    )
    ```
    """
    try:
        # Enforce usage limits before execution
        from app.services.usage_limits import UsageLimitService
        usage_service = UsageLimitService(db)
        
        # Estimate tokens from messages
        total_chars = sum(len(msg.content) for msg in request.messages)
        estimated_tokens = (total_chars + (request.max_tokens or 1000)) // 4
        await usage_service.enforce_usage_limit(current_user.id, estimated_tokens)
        
        from app.services.execution import PromptExecutionService
        service = PromptExecutionService(db)
        response = await service.execute_chat(current_user.id, request)
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        error_msg = f"Chat completion failed: {str(e)}"
        print(f"ERROR: {error_msg}\n{error_trace}")
        raise HTTPException(status_code=500, detail=error_msg)
