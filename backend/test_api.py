import os
from dotenv import load_dotenv
from openai import OpenAI

def test_openai_connection():
    print("Configuration:")
    
    # Load environment variables
    load_dotenv()
    
    # Get API configuration
    api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
    api_key = os.getenv("OPENAI_API_KEY")
    model_id = os.getenv("OPENAI_MODEL_ID", "gpt-3.5-turbo")
    
    print(f"API Base: {api_base}")
    print(f"Model ID: {model_id}")
    print(f"API Key exists: {'Yes' if api_key else 'No'}")
    print()
    
    try:
        # Initialize the client
        client = OpenAI(api_key=api_key)
        
        # Make a test API call
        response = client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": "Hello! This is a test message."}]
        )
        
        print("✅ Successfully connected to OpenAI API!")
        print(f"Response: {response.choices[0].message.content}")
        
    except Exception as e:
        print("❌ Error connecting to OpenAI API:\n")
        print(str(e))

if __name__ == "__main__":
    test_openai_connection() 