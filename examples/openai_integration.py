"""
Example: Using PromptRouter with OpenAI SDK
Drop-in replacement for cost optimization
"""
import os
from openai import OpenAI

# Initialize PromptRouter client (OpenAI-compatible)
client = OpenAI(
    base_url="https://api.promptrouter.com/v1",
    api_key=os.getenv("PROMPTROUTER_API_KEY")  # Get your token from dashboard
)


def example_basic_chat():
    """Basic chat completion with auto-routing"""
    print("\n=== Example 1: Basic Chat with Auto-Routing ===")
    
    response = client.chat.completions.create(
        # No model specified - PromptRouter chooses the best one!
        messages=[
            {"role": "user", "content": "What is the capital of France?"}
        ]
    )
    
    print(f"Response: {response.choices[0].message.content}")
    print(f"Model used: {response.model}")
    print(f"Tokens: {response.usage.total_tokens}")
    
    # PromptRouter-specific metadata
    metadata = response.x_promptrouter
    print(f"Provider: {metadata.routing.provider}")
    print(f"Cost: ${metadata.savings.actual_cost:.6f}")
    print(f"Saved: ${metadata.savings.amount_saved:.6f} ({metadata.savings.savings_percentage}%)")


def example_specific_model():
    """Chat completion with specific model"""
    print("\n=== Example 2: Specific Model Selection ===")
    
    response = client.chat.completions.create(
        model="gpt-4",  # Explicitly request GPT-4
        messages=[
            {"role": "user", "content": "Explain quantum entanglement"}
        ],
        temperature=0.3,
        max_tokens=200
    )
    
    print(f"Response: {response.choices[0].message.content[:100]}...")
    print(f"Model: {response.model}")
    print(f"Was routed: {response.x_promptrouter.was_routed}")


def example_multi_turn():
    """Multi-turn conversation"""
    print("\n=== Example 3: Multi-Turn Conversation ===")
    
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful math tutor."},
            {"role": "user", "content": "What is 15 * 23?"},
            {"role": "assistant", "content": "15 * 23 = 345"},
            {"role": "user", "content": "Now multiply that by 2"}
        ]
    )
    
    print(f"Assistant: {response.choices[0].message.content}")
    print(f"Conversation tokens: {response.usage.prompt_tokens}")


def example_with_constraints():
    """Using PromptRouter constraints for cost control"""
    print("\n=== Example 4: With Cost Constraints ===")
    
    response = client.chat.completions.create(
        messages=[
            {"role": "user", "content": "Write a short poem about clouds"}
        ],
        extra_body={
            "constraints": {
                "max_cost_per_1k_tokens": 0.001,  # Budget constraint
                "min_quality_tier": "standard",
                "preferred_providers": ["openai", "anthropic"]
            }
        }
    )
    
    print(f"Poem:\n{response.choices[0].message.content}")
    print(f"Cost: ${response.x_promptrouter.savings.actual_cost:.6f}")
    print(f"Met constraints: ✅")


def example_high_quality_task():
    """High-stakes task requiring premium models"""
    print("\n=== Example 5: High-Quality Task ===")
    
    response = client.chat.completions.create(
        messages=[
            {"role": "user", "content": "Review this legal clause for potential issues..."}
        ],
        extra_body={
            "constraints": {
                "min_quality_tier": "premium",
                "risk_level": "critical",
                "requires_verification": True
            }
        }
    )
    
    print(f"Analysis: {response.choices[0].message.content[:150]}...")
    print(f"Model used: {response.model} (premium tier)")
    print(f"Routing reason: {response.x_promptrouter.routing.reason}")


def example_batch_with_tracking():
    """Process multiple requests and track total savings"""
    print("\n=== Example 6: Batch Processing with Savings Tracking ===")
    
    prompts = [
        "Summarize: AI is transforming industries...",
        "Translate to Spanish: Hello, how are you?",
        "Classify sentiment: This product is amazing!",
        "Extract entities: Apple Inc. announced new products",
        "Answer: What year was Python created?"
    ]
    
    total_cost = 0
    total_saved = 0
    
    for i, prompt in enumerate(prompts, 1):
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}]
        )
        
        cost = response.x_promptrouter.savings.actual_cost
        saved = response.x_promptrouter.savings.amount_saved
        
        total_cost += cost
        total_saved += saved
        
        print(f"Request {i}: {response.model} | Cost: ${cost:.6f} | Saved: ${saved:.6f}")
    
    print(f"\n📊 Batch Summary:")
    print(f"Total cost: ${total_cost:.4f}")
    print(f"Total saved: ${total_saved:.4f}")
    print(f"Average savings: {(total_saved / (total_cost + total_saved) * 100):.1f}%")


def example_langchain_integration():
    """Integration with LangChain"""
    print("\n=== Example 7: LangChain Integration ===")
    
    try:
        from langchain.chat_models import ChatOpenAI
        from langchain.schema import HumanMessage, SystemMessage
        
        # Use PromptRouter with LangChain
        llm = ChatOpenAI(
            openai_api_base="https://api.promptrouter.com/v1",
            openai_api_key=os.getenv("PROMPTROUTER_API_KEY"),
            model_name="gpt-4"  # Optional
        )
        
        messages = [
            SystemMessage(content="You are a creative writing assistant."),
            HumanMessage(content="Write a haiku about programming")
        ]
        
        response = llm(messages)
        print(f"Haiku:\n{response.content}")
        
    except ImportError:
        print("LangChain not installed. Run: pip install langchain")


def example_error_handling():
    """Proper error handling"""
    print("\n=== Example 8: Error Handling ===")
    
    try:
        response = client.chat.completions.create(
            model="nonexistent-model",
            messages=[{"role": "user", "content": "Test"}]
        )
    except Exception as e:
        print(f"❌ Error caught: {e}")
        print("Fallback: Using auto-routing instead...")
        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": "Test"}]
        )
        print(f"✅ Success with auto-routing: {response.model}")


if __name__ == "__main__":
    print("🚀 PromptRouter + OpenAI SDK Examples")
    print("=" * 50)
    
    # Run all examples
    example_basic_chat()
    example_specific_model()
    example_multi_turn()
    example_with_constraints()
    example_high_quality_task()
    example_batch_with_tracking()
    example_langchain_integration()
    example_error_handling()
    
    print("\n" + "=" * 50)
    print("✅ All examples completed!")
    print("\n💡 Tips:")
    print("  - Omit 'model' parameter for maximum savings")
    print("  - Use constraints for quality control")
    print("  - Check x-promptrouter metadata for insights")
    print("  - Monitor savings across requests")
