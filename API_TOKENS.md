# API Token System

## Overview

PromptRouter uses API tokens to authenticate requests to the API. Each user can create multiple tokens for different applications or environments.

## Token Format

Tokens follow the format: `pr_live_[64 hex characters]`

Example: `pr_live_a1b2c3d4e5f6...`

## Creating Tokens

### Via Dashboard UI

1. Log in to PromptRouter
2. Go to **Settings**
3. Scroll to **API Tokens** section
4. Click **Create Token**
5. Enter a descriptive name (e.g., "Production API", "Development", "My App")
6. **Copy the token immediately** - it will only be shown once!

### Via API

```bash
POST /v1/tokens
Content-Type: application/json

{
  "name": "Production API"
}
```

Response:
```json
{
  "id": 1,
  "name": "Production API",
  "token": "pr_live_a1b2c3d4e5f6...",
  "is_active": true,
  "created_at": "2026-01-02T10:00:00Z",
  "last_used_at": null
}
```

⚠️ **Important**: The `token` field is only included in the response when creating a new token. Save it securely - you won't be able to retrieve it again!

## Using Tokens

Include your token in the `Authorization` header of all API requests:

```bash
curl -X POST https://api.prompt-router.com/v1/prompt \
  -H "Authorization: Bearer pr_live_YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, world!",
    "max_tokens": 100
  }'
```

### JavaScript/TypeScript

```javascript
const response = await fetch('https://api.prompt-router.com/v1/prompt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pr_live_YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Hello, world!',
    max_tokens: 100
  })
});
```

### Python

```python
import requests

response = requests.post(
    'https://api.prompt-router.com/v1/prompt',
    headers={
        'Authorization': 'Bearer pr_live_YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
    },
    json={
        'prompt': 'Hello, world!',
        'max_tokens': 100
    }
)
```

## Managing Tokens

### List All Tokens

```bash
GET /v1/tokens
```

Response:
```json
{
  "tokens": [
    {
      "id": 1,
      "name": "Production API",
      "token_preview": "pr_live_a1b2...3d4e",
      "is_active": true,
      "created_at": "2026-01-02T10:00:00Z",
      "last_used_at": "2026-01-02T12:30:00Z"
    }
  ]
}
```

Note: The full token is never returned after creation. Only a preview is shown.

### Revoke a Token

```bash
DELETE /v1/tokens/{token_id}
```

This immediately deactivates the token. Any requests using this token will be rejected.

## Security Best Practices

### ✅ DO:
- **Store tokens securely** - Use environment variables, secret managers (AWS Secrets Manager, HashiCorp Vault)
- **Create separate tokens** for different environments (dev, staging, prod)
- **Revoke tokens** immediately if compromised
- **Use descriptive names** to track where each token is used
- **Rotate tokens** periodically (e.g., every 90 days)

### ❌ DON'T:
- **Never commit tokens** to version control (Git, GitHub, etc.)
- **Never expose tokens** in client-side code (browsers, mobile apps)
- **Never share tokens** publicly (Slack, Discord, forums)
- **Never use production tokens** in development/testing

## Token Lifecycle

1. **Created**: Token is generated and shown once
2. **Active**: Token can be used for API requests
3. **Used**: `last_used_at` timestamp is updated on each use
4. **Revoked**: Token is deactivated and can no longer be used
5. **Deleted**: (Future feature) Token is permanently removed

## Environment Variables

Store your token in environment variables:

```bash
# .env
PROMPTROUTER_API_TOKEN=pr_live_your_token_here
```

Then use it in your code:

```javascript
const token = process.env.PROMPTROUTER_API_TOKEN;
```

```python
import os
token = os.getenv('PROMPTROUTER_API_TOKEN')
```

## Error Responses

### Missing Token
```json
{
  "detail": "Authorization header missing"
}
```

### Invalid Token
```json
{
  "detail": "Invalid or revoked API token"
}
```

### Expired/Revoked Token
```json
{
  "detail": "Token has been revoked"
}
```

## Database Schema

```sql
CREATE TABLE api_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_tokens_token ON api_tokens(token);
```

## Implementation Details

### Token Generation

Tokens are generated using Python's `secrets` module:

```python
import secrets

def generate_api_token(prefix: str = "pr_live") -> str:
    random_part = secrets.token_hex(32)  # 64 hex characters
    return f"{prefix}_{random_part}"
```

### Token Verification

On each API request:

1. Extract token from `Authorization: Bearer {token}` header
2. Look up token in database
3. Check if `is_active = true`
4. Get associated user
5. Update `last_used_at` timestamp
6. Proceed with request

### Security

- Tokens are stored in plain text in the database (they are already cryptographically random)
- Each token is 64 hex characters (256 bits of entropy)
- Tokens are compared using constant-time comparison to prevent timing attacks
- Rate limiting is applied per token

## Future Enhancements

- Token expiration dates
- Token scopes/permissions
- Token usage analytics
- Multiple token types (read-only, write-only, etc.)
- IP whitelisting per token
- Automatic token rotation
