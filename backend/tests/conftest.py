import os
import sys
from pathlib import Path

# Ensure backend directory is on sys.path so `app` package can be imported
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

# Use in-memory SQLite for tests 
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("API_SECRET_KEY", "test_secret_key_32_chars_long!!!!")
os.environ.setdefault("ENCRYPTION_KEY", "test_encrypt_key_32chars!!!!")
os.environ.setdefault("DEBUG", "True")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport


@pytest_asyncio.fixture(scope="session")
async def async_client():
    """Async HTTP client for testing the FastAPI app."""
    # Import after env vars are set
    from app.main import app
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
