#!/bin/bash
# Quick cURL tests for /v1/chat/completions endpoint

# Configuration
API_URL="${API_URL:-http://localhost:8000}"
API_TOKEN="${PROMPTROUTER_TOKEN:-your-api-token-here}"

echo "======================================"
echo "  Chat Completions cURL Tests"
echo "======================================"
echo ""
echo "API URL: $API_URL"
echo "Token: ${API_TOKEN:0:15}..."
echo ""

# Test 1: Auto-routing (no model)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Auto-Routing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -X POST "$API_URL/v1/chat/completions" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Say hello in one word"}
    ],
    "temperature": 0.5,
    "max_tokens": 10
  }' | jq '.'

echo ""
echo ""

# Test 2: Specific model
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Specific Model (gpt-3.5-turbo)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -X POST "$API_URL/v1/chat/completions" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "What is 2+2?"}
    ],
    "max_tokens": 20
  }' | jq '.'

echo ""
echo ""

# Test 3: Multi-turn conversation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Multi-Turn Conversation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -X POST "$API_URL/v1/chat/completions" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hi"},
      {"role": "assistant", "content": "Hello! How can I help?"},
      {"role": "user", "content": "What was my first message?"}
    ],
    "max_tokens": 30
  }' | jq '.'

echo ""
echo ""

# Test 4: Extract just savings info
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Savings Metadata"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -s -X POST "$API_URL/v1/chat/completions" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "max_tokens": 10
  }' | jq '.["x-promptrouter"].savings'

echo ""
echo "======================================"
echo "  Tests Complete"
echo "======================================"
