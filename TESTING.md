# Testing Guide

## Quick Test Flow

### 1. Generate an API Token

Visit the dashboard settings page at `http://localhost:3000/dashboard/settings` and create a new API token.

### 2. Add LLM Provider Keys

In the same settings page, add your API keys for OpenAI, Anthropic, Google, or Grok.

### 3. Test with cURL

```bash
# Replace YOUR_TOKEN with your actual API token
export PR_TOKEN="pr_live_..."

# Simple prompt test
curl -X POST http://localhost:8000/v1/prompt \
  -H "Authorization: Bearer $PR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is 2+2?",
    "constraints": {
      "max_cost_per_1k_tokens": 0.01
    }
  }' | jq .
```

### 4. Test with Python

```python
import requests

API_TOKEN = "pr_live_..."
API_URL = "http://localhost:8000"

# Execute a prompt
response = requests.post(
    f"{API_URL}/v1/prompt",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={
        "prompt": "What is the capital of France?",
        "constraints": {
            "max_cost_per_1k_tokens": 0.01,
            "max_latency_ms": 2000
        }
    }
)

print(response.json())
```

### 5. Test with Node.js

```javascript
const API_TOKEN = "pr_live_...";
const API_URL = "http://localhost:8000";

async function executePrompt() {
  const response = await fetch(`${API_URL}/v1/prompt`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: "Explain quantum computing in one sentence",
      constraints: {
        max_cost_per_1k_tokens: 0.01
      }
    })
  });

  const data = await response.json();
  console.log(data);
}

executePrompt();
```

## API Endpoints

### Authentication Required

All endpoints require a valid API token in the `Authorization` header:

```
Authorization: Bearer pr_live_...
```

### Available Endpoints

#### Execute Prompt
```bash
POST /v1/prompt
Content-Type: application/json

{
  "prompt": "Your prompt here",
  "constraints": {
    "max_cost_per_1k_tokens": 0.01,
    "max_latency_ms": 2000,
    "min_quality_score": 0.8
  }
}
```

#### Get User Config
```bash
GET /v1/config
```

#### List API Tokens
```bash
GET /v1/tokens
```

#### Create API Token
```bash
POST /v1/tokens
Content-Type: application/json

{
  "name": "Production API"
}
```

#### Add LLM Provider Key
```bash
POST /v1/api-keys
Content-Type: application/json

{
  "provider": "openai",
  "api_key": "sk-..."
}
```

#### List LLM Provider Keys
```bash
GET /v1/api-keys
```

## Testing Without Real API Keys

For development testing, you can:

1. Use the playground at `http://localhost:3000/dashboard/playground` to test cost calculations
2. View the docs at `http://localhost:3000/docs` for complete API reference
3. Check request history at `http://localhost:3000/dashboard/requests`

## Expected Response Format

Successful prompt execution returns:

```json
{
  "response": "The AI's response text",
  "model_used": "gpt-3.5-turbo",
  "provider": "openai",
  "total_tokens": 45,
  "cost_usd": 0.000023,
  "latency_ms": 456,
  "quality_score": 0.85,
  "savings": {
    "compared_to": "gpt-4",
    "amount_saved_usd": 0.001,
    "percentage_saved": 97.7
  }
}
```

## Troubleshooting

### 401 Unauthorized
- Check that your API token is valid and active
- Ensure token is in the format: `Bearer pr_live_...`

### 400 Bad Request
- Verify your request body matches the required schema
- Check provider API keys are added in settings

### 500 Internal Server Error
- Check that you've added valid API keys for at least one provider
- Verify the database is running: `docker ps | grep postgres`
- Check backend logs: `docker logs promptrouter-backend-1`
