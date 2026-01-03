import pytest


@pytest.mark.asyncio
@pytest.mark.skip(reason="DB integration test - needs proper fixture setup")
async def test_add_api_key_creates_user_and_key(async_client):
    payload = {"provider": "openai", "api_key": "sk_test_123"}
    resp = await async_client.post("/v1/api-keys", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body.get("provider") == "openai"
    assert body.get("is_active") is True
    assert body.get("id") is not None
