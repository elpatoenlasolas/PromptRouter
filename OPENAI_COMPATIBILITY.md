# OpenAI API Compatibility Guide

PromptRouter provides a **drop-in replacement** for OpenAI's API, enabling you to optimize costs without changing your application code.

## Quick Start

Replace your OpenAI base URL and API key:

```python
from openai import OpenAI

# Instead of OpenAI directly:
# client = OpenAI(api_key="sk-...")

# Use PromptRouter:
client = OpenAI(
    base_url="https://api.promptrouter.com/v1",
    api_key="pr_live_xxxxx"  # Your PromptRouter token
)

# Same API, automatic cost optimization!
response = client.chat.completions.create(
    messages=[
        {"role": "user", "content": "Explain quantum computing"}
    ]
)
```

---

## Supported Endpoints

### ✅ `/v1/chat/completions`

**Status:** Fully compatible with OpenAI's Chat Completions API

**Supports:**
- ✅ Messages array with role-based conversation
- ✅ System, user, and assistant roles
- ✅ Multi-turn conversations
- ✅ Temperature, max_tokens, top_p parameters
- ✅ Model specification (optional)
- ⚠️ Streaming (coming soon)

**Request Example:**

```python
response = client.chat.completions.create(
    model="gpt-4",  # Optional - omit for auto-routing
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is 2+2?"}
    ],
    temperature=0.7,
    max_tokens=1000
)

print(response.choices[0].message.content)
```

---

## Auto-Routing vs Model Selection

### Option 1: Automatic Routing (Recommended)

**Omit the `model` parameter** to let PromptRouter select the most cost-effective model:

```python
response = client.chat.completions.create(
    # No model specified!
    messages=[{"role": "user", "content": "Hello"}]
)
```

PromptRouter will:
1. Analyze your prompt
2. Select the cheapest model that meets quality requirements
3. Route to the optimal provider
4. Track savings automatically

### Option 2: Specify a Model

**Provide a `model` parameter** for full control:

```python
response = client.chat.completions.create(
    model="gpt-4",  # Explicitly request GPT-4
    messages=[{"role": "user", "content": "Complex analysis needed"}]
)
```

PromptRouter will:
1. Honor your model choice
2. Still track costs and alternatives
3. Show what you would have saved with routing

---

## PromptRouter Extensions

### Routing Metadata

All responses include PromptRouter metadata in the `x-promptrouter` field:

```python
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Hello"}]
)

# Standard OpenAI fields
print(response.id)
print(response.model)
print(response.choices[0].message.content)
print(response.usage.total_tokens)

# PromptRouter extensions
metadata = response.x_promptrouter

print(metadata.routing.provider)       # "openai"
print(metadata.routing.model)          # "gpt-3.5-turbo"
print(metadata.routing.reason)         # "Cost-optimized selection..."

print(metadata.savings.actual_cost)    # 0.0023
print(metadata.savings.amount_saved)   # 0.0145
print(metadata.savings.savings_percentage)  # 86.3%

print(metadata.was_routed)             # True/False
```

### Advanced Constraints

Use PromptRouter-specific constraints for fine-grained control:

```python
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Medical diagnosis assistance"}],
    # OpenAI doesn't support this, but PromptRouter does:
    extra_body={
        "constraints": {
            "max_cost_per_1k_tokens": 0.01,
            "min_quality_tier": "premium",
            "risk_level": "critical",
            "preferred_providers": ["openai", "anthropic"]
        }
    }
)
```

**Available constraints:**

| Field | Type | Description |
|-------|------|-------------|
| `max_cost_per_1k_tokens` | float | Hard ceiling on cost |
| `max_latency_ms` | int | Maximum acceptable latency |
| `min_quality_tier` | string | "basic", "standard", "premium" |
| `risk_level` | string | "low", "medium", "high", "critical" |
| `requires_verification` | bool | Task needs factual accuracy |
| `preferred_providers` | list | Provider preferences |
| `cost_priority` | float | 0.0-1.0, weight for cost optimization |
| `quality_priority` | float | 0.0-1.0, weight for quality |
| `latency_priority` | float | 0.0-1.0, weight for speed |

---

## Migration Guide

### From OpenAI SDK

**Before:**
```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)
```

**After:**
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.promptrouter.com/v1",
    api_key=os.getenv("PROMPTROUTER_API_KEY")
)

response = client.chat.completions.create(
    # Remove model for auto-routing, or keep for explicit selection
    messages=[{"role": "user", "content": "Hello"}]
)
```

### From LangChain

```python
from langchain.chat_models import ChatOpenAI

# Before:
# llm = ChatOpenAI(model_name="gpt-4")

# After:
llm = ChatOpenAI(
    model_name="gpt-4",  # Optional
    openai_api_base="https://api.promptrouter.com/v1",
    openai_api_key=os.getenv("PROMPTROUTER_API_KEY")
)
```

### From Direct HTTP Calls

**Before:**
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**After:**
```bash
curl https://api.promptrouter.com/v1/chat/completions \
  -H "Authorization: Bearer $PROMPTROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Response Format

PromptRouter returns OpenAI-compatible responses with optional extensions:

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
        "content": "Hello! How can I help you today?"
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
      "reason": "Cost-optimized: 86% cheaper than GPT-4 for this task",
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

---

## Best Practices

### 1. Let PromptRouter Choose Models

For maximum savings, omit the `model` parameter:

```python
# ✅ Good - auto-routing
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Summarize this..."}]
)

# ⚠️ Less optimal - hardcoded model
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Summarize this..."}]
)
```

### 2. Use Constraints for Critical Tasks

For sensitive tasks, specify quality requirements:

```python
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Legal contract review..."}],
    extra_body={
        "constraints": {
            "min_quality_tier": "premium",
            "risk_level": "critical"
        }
    }
)
```

### 3. Monitor Savings

Track your cost optimization:

```python
total_saved = 0
for _ in range(100):
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "..."}]
    )
    total_saved += response.x_promptrouter.savings.amount_saved

print(f"Total saved: ${total_saved:.4f}")
```

---

## Limitations & Roadmap

### Current Limitations

- ❌ Streaming (`stream=True`) - Coming in Phase 2
- ❌ Function calling - Planned for Q1 2026
- ❌ Vision/image inputs - Planned for Q2 2026
- ❌ Embeddings endpoint - Planned for Q1 2026

### Workarounds

**For streaming:**
```python
# Currently: Use non-streaming
response = client.chat.completions.create(
    messages=[...],
    stream=False  # Required for now
)
```

**For function calling:**
Use PromptRouter's native `/v1/prompt` endpoint for now, or specify a model that supports functions directly.

---

## Support

- 📧 Email: support@promptrouter.com
- 📚 Docs: https://docs.promptrouter.com
- 💬 Discord: https://discord.gg/promptrouter
- 🐛 Issues: https://github.com/promptrouter/issues

---

## License

This compatibility layer is part of PromptRouter's core API and follows the same terms of service.
