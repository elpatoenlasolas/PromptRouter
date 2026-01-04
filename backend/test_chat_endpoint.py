#!/usr/bin/env python3
"""
Quick test script for /v1/chat/completions endpoint
Tests both auto-routing and specific model selection
"""
import requests
import json
import os
from datetime import datetime

# Configuration
BASE_URL = os.getenv("API_URL", "http://localhost:8000")
API_TOKEN = os.getenv("PROMPTROUTER_TOKEN", "your-api-token-here")

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_auto_routing():
    """Test 1: Auto-routing (no model specified)"""
    print_section("TEST 1: Auto-Routing")
    
    url = f"{BASE_URL}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messages": [
            {"role": "user", "content": "What is 2+2? Answer in one word."}
        ],
        "temperature": 0.3,
        "max_tokens": 10
    }
    
    print(f"📤 Request to: {url}")
    print(f"📝 Payload: {json.dumps(data, indent=2)}\n")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            # Standard OpenAI fields
            print(f"\n📋 Response:")
            print(f"  ID: {result.get('id')}")
            print(f"  Model: {result.get('model')}")
            print(f"  Content: {result['choices'][0]['message']['content']}")
            print(f"  Tokens: {result['usage']['total_tokens']}")
            
            # PromptRouter metadata
            if 'x-promptrouter' in result:
                metadata = result['x-promptrouter']
                print(f"\n💰 PromptRouter Metadata:")
                print(f"  Provider: {metadata['routing']['provider']}")
                print(f"  Selected Model: {metadata['routing']['model']}")
                print(f"  Routing Reason: {metadata['routing']['reason']}")
                print(f"  Was Auto-Routed: {metadata['was_routed']}")
                print(f"  Cost: ${metadata['savings']['actual_cost']:.6f}")
                print(f"  Saved: ${metadata['savings']['amount_saved']:.6f} ({metadata['savings']['savings_percentage']}%)")
            
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_specific_model():
    """Test 2: Specific model selection"""
    print_section("TEST 2: Specific Model (gpt-3.5-turbo)")
    
    url = f"{BASE_URL}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "gpt-3.5-turbo",  # Explicitly request GPT-3.5
        "messages": [
            {"role": "user", "content": "Say 'Hello' in Spanish"}
        ],
        "temperature": 0.5,
        "max_tokens": 20
    }
    
    print(f"📤 Request to: {url}")
    print(f"📝 Payload: {json.dumps(data, indent=2)}\n")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n📋 Response:")
            print(f"  Model: {result.get('model')}")
            print(f"  Content: {result['choices'][0]['message']['content']}")
            
            if 'x-promptrouter' in result:
                metadata = result['x-promptrouter']
                print(f"\n💡 Was Auto-Routed: {metadata['was_routed']}")
                print(f"  Routing Reason: {metadata['routing']['reason']}")
            
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_multi_turn():
    """Test 3: Multi-turn conversation"""
    print_section("TEST 3: Multi-Turn Conversation")
    
    url = f"{BASE_URL}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messages": [
            {"role": "system", "content": "You are a helpful math tutor."},
            {"role": "user", "content": "What is 5 * 3?"},
            {"role": "assistant", "content": "15"},
            {"role": "user", "content": "Now multiply that by 2"}
        ],
        "temperature": 0.3,
        "max_tokens": 20
    }
    
    print(f"📤 Request to: {url}")
    print(f"📝 Conversation with {len(data['messages'])} messages\n")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n📋 Response:")
            print(f"  Content: {result['choices'][0]['message']['content']}")
            print(f"  Prompt Tokens: {result['usage']['prompt_tokens']}")
            print(f"  Total Tokens: {result['usage']['total_tokens']}")
            
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_with_constraints():
    """Test 4: With routing constraints"""
    print_section("TEST 4: With Routing Constraints")
    
    url = f"{BASE_URL}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messages": [
            {"role": "user", "content": "Write a haiku about coding"}
        ],
        "constraints": {
            "max_cost_per_1k_tokens": 0.001,
            "min_quality_tier": "basic"
        },
        "max_tokens": 50
    }
    
    print(f"📤 Request to: {url}")
    print(f"📝 With constraints: max_cost=0.001, quality=basic\n")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n📋 Response:")
            print(f"  Model: {result.get('model')}")
            print(f"  Content: {result['choices'][0]['message']['content']}")
            
            if 'x-promptrouter' in result:
                metadata = result['x-promptrouter']
                cost = metadata['savings']['actual_cost']
                tokens = result['usage']['total_tokens']
                cost_per_1k = (cost / tokens) * 1000 if tokens > 0 else 0
                
                print(f"\n💰 Cost Analysis:")
                print(f"  Total Cost: ${cost:.6f}")
                print(f"  Cost per 1K: ${cost_per_1k:.6f}")
                print(f"  Constraint Met: {'✅' if cost_per_1k <= 0.001 else '❌'}")
            
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("  PromptRouter Chat Completions Test Suite")
    print("  Testing: /v1/chat/completions endpoint")
    print("="*60)
    print(f"\n🔧 Configuration:")
    print(f"  API URL: {BASE_URL}")
    print(f"  Token: {API_TOKEN[:15]}..." if len(API_TOKEN) > 15 else f"  Token: {API_TOKEN}")
    print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run tests
    results = []
    
    results.append(("Auto-Routing", test_auto_routing()))
    results.append(("Specific Model", test_specific_model()))
    results.append(("Multi-Turn", test_multi_turn()))
    results.append(("Constraints", test_with_constraints()))
    
    # Summary
    print_section("SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n{'='*60}")
    print(f"  Results: {passed}/{total} tests passed")
    print(f"{'='*60}\n")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
