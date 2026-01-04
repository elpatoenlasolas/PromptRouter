# Testing Guide for Chat Completions Endpoint

## Prerequisites

1. **Start the backend:**
```bash
cd backend
docker-compose up -d  # or your preferred method
```

2. **Get your API token:**
   - Go to http://localhost:3000/dashboard/settings
   - Create an API token
   - Copy the token

3. **Configure at least one LLM provider key:**
   - In Settings, add your OpenAI, Anthropic, Google, or Grok API key

## Quick Tests

### Option 1: Python Test Script (Recommended)

```bash
cd backend

# Set your token
export PROMPTROUTER_TOKEN="pr_live_your_token_here"

# Run comprehensive test suite
python3 test_chat_endpoint.py
```

This will run 4 tests:
- ✅ Auto-routing (no model specified)
- ✅ Specific model selection
- ✅ Multi-turn conversation
- ✅ Routing with constraints

### Option 2: cURL Tests

```bash
cd backend

# Set your token
export PROMPTROUTER_TOKEN="pr_live_your_token_here"

# Run curl tests
./test_chat_curl.sh
```

**Manual cURL example:**
```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Authorization: Bearer pr_live_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "max_tokens": 50
  }' | jq '.'
```

### Option 3: OpenAI SDK Test (Most realistic)

```bash
cd backend

# Install OpenAI SDK if needed
pip install openai

# Set your token
export PROMPTROUTER_TOKEN="pr_live_your_token_here"

# Run SDK test
python3 test_openai_sdk.py
```

This tests the actual drop-in replacement with OpenAI's official SDK!

## Expected Response Format

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1704403200,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  },
  "x-promptrouter": {
    "routing": {
      "provider": "openai",
      "model": "gpt-3.5-turbo",
      "reason": "Cost-optimized selection...",
      "estimated_cost": 0.0000315,
      "estimated_latency_ms": 800
    },
    "savings": {
      "actual_cost": 0.0000315,
      "alternative_cost": 0.000225,
      "amount_saved": 0.0001935,
      "savings_percentage": 86.3
    },
    "was_routed": true
  }
}
```

## Troubleshooting

### 401 Unauthorized
```bash
# Check your token
echo $PROMPTROUTER_TOKEN

# Make sure it starts with pr_live_ or pr_test_
```

### 400 Bad Request - No API keys configured
```bash
# Add a provider API key in the dashboard:
# http://localhost:3000/dashboard/settings
```

### 500 Internal Server Error
```bash
# Check backend logs
docker-compose logs -f backend

# Or if running locally:
cd backend
uvicorn app.main:app --reload
```

### Model not found
```bash
# Available models depend on which provider keys you've added
# Leave "model" null/undefined for auto-routing
```

## Interactive Testing

### Using HTTPie (if installed)
```bash
http POST :8000/v1/chat/completions \
  Authorization:"Bearer pr_live_xxxxx" \
  messages:='[{"role":"user","content":"Hello"}]' \
  max_tokens=50
```

### Using Postman
1. Import URL: `http://localhost:8000/v1/chat/completions`
2. Method: POST
3. Headers:
   - `Authorization`: `Bearer pr_live_xxxxx`
   - `Content-Type`: `application/json`
4. Body (raw JSON):
```json
{
  "messages": [
    {"role": "user", "content": "Test message"}
  ],
  "max_tokens": 50
}
```

## Advanced Testing

### Test Auto-Routing vs Specific Model
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="pr_live_xxxxx"
)

# Auto-routing (omit model)
auto = client.chat.completions.create(
    messages=[{"role": "user", "content": "Hello"}]
)
print(f"Auto-routed to: {auto.model}")
print(f"Saved: ${auto.x_promptrouter.savings.amount_saved}")

# Specific model
specific = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)
print(f"Used: {specific.model}")
print(f"Was routed: {specific.x_promptrouter.was_routed}")  # Should be False
```

### Test with Constraints
```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Authorization: Bearer pr_live_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "constraints": {
      "max_cost_per_1k_tokens": 0.001,
      "min_quality_tier": "standard",
      "risk_level": "low"
    }
  }'
```

## Production Testing

Before deploying to Railway/Vercel:

1. ✅ Test all 4 scenarios locally
2. ✅ Verify savings calculations are correct
3. ✅ Check that x-promptrouter metadata is present
4. ✅ Test with real OpenAI SDK
5. ✅ Test error handling (bad token, no API keys, etc.)
6. ✅ Run pytest suite: `pytest tests/test_chat_completions.py -v`

## Next Steps

Once local testing passes:
1. Deploy to Railway
2. Update NEXT_PUBLIC_API_URL in Vercel
3. Test production endpoint
4. Update docs with production URLs
5. Announce to users!
