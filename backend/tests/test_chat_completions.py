"""
Tests for OpenAI-compatible chat completions endpoint
"""
import pytest
from httpx import AsyncClient
from app.main import app


class TestChatCompletions:
    """Test suite for /v1/chat/completions endpoint"""
    
    @pytest.mark.asyncio
    async def test_chat_completion_with_auto_routing(self, client: AsyncClient, auth_headers: dict):
        """Test chat completion with automatic model routing"""
        request_data = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello!"}
            ],
            "temperature": 0.7,
            "max_tokens": 50
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate OpenAI-compatible structure
        assert "id" in data
        assert data["object"] == "chat.completion"
        assert "created" in data
        assert "model" in data
        assert "choices" in data
        assert len(data["choices"]) == 1
        
        # Validate choice structure
        choice = data["choices"][0]
        assert choice["index"] == 0
        assert "message" in choice
        assert choice["message"]["role"] == "assistant"
        assert "content" in choice["message"]
        assert choice["finish_reason"] == "stop"
        
        # Validate usage
        assert "usage" in data
        assert "prompt_tokens" in data["usage"]
        assert "completion_tokens" in data["usage"]
        assert "total_tokens" in data["usage"]
        
        # Validate PromptRouter metadata
        assert "x-promptrouter" in data
        assert "routing" in data["x-promptrouter"]
        assert "savings" in data["x-promptrouter"]
        assert data["x-promptrouter"]["was_routed"] is True
    
    @pytest.mark.asyncio
    async def test_chat_completion_with_specific_model(self, client: AsyncClient, auth_headers: dict):
        """Test chat completion with user-specified model"""
        request_data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": "Hello"}
            ],
            "temperature": 0.5,
            "max_tokens": 30
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should use the specified model
        assert data["model"] == "gpt-3.5-turbo"
        assert "x-promptrouter" in data
        assert data["x-promptrouter"]["was_routed"] is False
        assert "User-specified model" in data["x-promptrouter"]["routing"]["reason"]
    
    @pytest.mark.asyncio
    async def test_chat_completion_with_constraints(self, client: AsyncClient, auth_headers: dict):
        """Test chat completion with routing constraints"""
        request_data = {
            "messages": [
                {"role": "user", "content": "Write a poem"}
            ],
            "constraints": {
                "max_cost_per_1k_tokens": 0.001,
                "min_quality_tier": "basic"
            },
            "max_tokens": 100
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should respect constraints
        routing = data["x-promptrouter"]["routing"]
        assert routing["estimated_cost"] <= 0.001 * (data["usage"]["total_tokens"] / 1000)
    
    @pytest.mark.asyncio
    async def test_chat_completion_multi_turn(self, client: AsyncClient, auth_headers: dict):
        """Test chat completion with multi-turn conversation"""
        request_data = {
            "messages": [
                {"role": "system", "content": "You are a math tutor."},
                {"role": "user", "content": "What is 2+2?"},
                {"role": "assistant", "content": "4"},
                {"role": "user", "content": "What is 5+5?"}
            ],
            "temperature": 0.3,
            "max_tokens": 20
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should handle multi-turn conversation
        assert "choices" in data
        assert len(data["choices"]) > 0
        assert data["usage"]["total_tokens"] > 0
    
    @pytest.mark.asyncio
    async def test_chat_completion_missing_messages(self, client: AsyncClient, auth_headers: dict):
        """Test chat completion with missing messages array"""
        request_data = {
            "temperature": 0.7,
            "max_tokens": 50
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422  # Validation error
    
    @pytest.mark.asyncio
    async def test_chat_completion_invalid_model(self, client: AsyncClient, auth_headers: dict):
        """Test chat completion with invalid model name"""
        request_data = {
            "model": "nonexistent-model-xyz",
            "messages": [
                {"role": "user", "content": "Hello"}
            ]
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data,
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "not found" in response.json()["detail"].lower()
    
    @pytest.mark.asyncio
    async def test_chat_completion_unauthorized(self, client: AsyncClient):
        """Test chat completion without authentication"""
        request_data = {
            "messages": [
                {"role": "user", "content": "Hello"}
            ]
        }
        
        response = await client.post(
            "/v1/chat/completions",
            json=request_data
        )
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_openai_sdk_compatibility(self, auth_token: str):
        """Test compatibility with OpenAI Python SDK"""
        # This test would require openai SDK to be installed
        # Placeholder for integration test
        pytest.skip("Requires OpenAI SDK - run manually")
        
        # Example usage:
        # from openai import AsyncOpenAI
        # client = AsyncOpenAI(
        #     base_url="http://localhost:8000/v1",
        #     api_key=auth_token
        # )
        # response = await client.chat.completions.create(
        #     messages=[{"role": "user", "content": "Hello"}]
        # )
        # assert response.choices[0].message.content
