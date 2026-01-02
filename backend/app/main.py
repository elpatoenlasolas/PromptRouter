"""
PromptRouter API - Intelligent AI prompt routing and cost optimization
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.database import engine, Base
from app.api.v1 import prompt, metrics, config as config_router, usage
from app.middleware import (
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Shutdown: Close connections
    await engine.dispose()


app = FastAPI(
    title="PromptRouter API",
    description="Intelligent AI API cost optimizer and prompt router",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
# In development, allow all origins for easier testing
import os
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]

# Add production origins if specified
if os.getenv("ALLOWED_ORIGINS"):
    allowed_origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# API routes
app.include_router(prompt.router, prefix="/v1", tags=["Prompt Execution"])
app.include_router(metrics.router, prefix="/v1", tags=["Metrics"])
app.include_router(config_router.router, prefix="/v1", tags=["Configuration"])
app.include_router(usage.router, prefix="/v1", tags=["Usage"])

# Import requests router, tokens router, and api_keys router
from app.api.v1 import requests as requests_router
from app.api.v1 import tokens as tokens_router
from app.api.v1 import api_keys as api_keys_router
app.include_router(requests_router.router, prefix="/v1", tags=["Requests"])
app.include_router(tokens_router.router, prefix="/v1", tags=["API Tokens"])
app.include_router(api_keys_router.router, prefix="/v1", tags=["LLM API Keys"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "PromptRouter API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {"status": "healthy"}
