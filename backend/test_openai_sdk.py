#!/usr/bin/env python3
"""
Test with actual OpenAI SDK - Drop-in replacement demo
Requires: pip install openai
"""
import os
from openai import OpenAI

# Configuration
BASE_URL = os.getenv("API_URL", "http://localhost:8000") + "/v1"
API_TOKEN = os.getenv("PROMPTROUTER_TOKEN", "your-api-token-here")

def test_openai_sdk():
    """Test using the official OpenAI SDK"""
    print("="*60)
    print("  Testing with Official OpenAI SDK")
    print("="*60)
    print(f"\nBase URL: {BASE_URL}")
    print(f"Token: {API_TOKEN[:15]}...\n")
    
    # Initialize client (drop-in replacement!)
    client = OpenAI(
        base_url=BASE_URL,
        api_key=API_TOKEN
    )
    
    try:
        # Test 1: Auto-routing
        print("━━━ Test 1: Auto-Routing ━━━\n")
        
        response = client.chat.completions.create(
            # No model specified - PromptRouter will auto-route!
            messages=[
                {"role": "user", "content": "What is the capital of France?"}
            ],
            max_tokens=20
        )
        
        print(f"✅ Response received")
        print(f"Model used: {response.model}")
        print(f"Content: {response.choices[0].message.content}")
        print(f"Tokens: {response.usage.total_tokens}")
        
        # Check PromptRouter metadata
        if hasattr(response, 'x_promptrouter'):
            metadata = response.x_promptrouter
            print(f"\n💰 Savings:")
            print(f"  Amount saved: ${metadata.savings['amount_saved']:.6f}")
            print(f"  Percentage: {metadata.savings['savings_percentage']}%")
            print(f"  Routing reason: {metadata.routing.reason}")
        
        print("\n" + "="*60)
        
        # Test 2: Specific model
        print("\n━━━ Test 2: Specific Model ━━━\n")
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Explicit model
            messages=[
                {"role": "user", "content": "Say hello"}
            ],
            max_tokens=10
        )
        
        print(f"✅ Response received")
        print(f"Model: {response.model}")
        print(f"Content: {response.choices[0].message.content}")
        
        if hasattr(response, 'x_promptrouter'):
            print(f"Was auto-routed: {response.x_promptrouter.was_routed}")
        
        print("\n" + "="*60)
        print("\n✅ All tests passed!")
        print("Drop-in replacement working perfectly! 🎉\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print(f"Type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    try:
        import openai
        print(f"OpenAI SDK version: {openai.__version__}\n")
    except ImportError:
        print("❌ OpenAI SDK not installed")
        print("Install with: pip install openai\n")
        exit(1)
    
    success = test_openai_sdk()
    exit(0 if success else 1)
